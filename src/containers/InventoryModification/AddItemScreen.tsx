import {
	ActivityIndicator,
	Alert,
	Dimensions,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Button, Icon, Image, Input } from 'react-native-elements';
import { Camera, PermissionResponse } from 'expo-camera';
import { StackNavigationProp } from '@react-navigation/stack';

import { Bot } from '../../types/apiTypes';
import { Ctx } from '../../components/StateProvider';
import { Item } from '../../types/apiTypes';
import { NAV_HEIGHT } from '../../constants';
import { RootStackParamList } from '../../../App';
import { RouteProp } from '@react-navigation/native';
import { styles as formStyles } from '../Auth/FormStyles';
import BotService from '../../services/BotService';
import Form from '../Auth/Form';
import ItemService from '../../services/ItemService';
import Loading from '../../components/Loading';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface AddItemProps {
	navigation: StackNavigationProp<RootStackParamList, 'AddItem'>;
	route: RouteProp<RootStackParamList, 'AddItem'>;
}

const AddItem = ({ navigation, route }: AddItemProps) => {
	const { state } = useContext(Ctx);
	const bot: Bot = route.params.bot;

	const [nameErrorMessage] = useState('');
	const [costErrorMessage, setCostErrorMessage] = useState('');
	const [quantityErrorMessage, setQuantityErrorMessage] = useState('');

	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [type] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState<Camera | null>(null);
	const [photo, setPhoto] = useState<string | null>(null);
	const [itemName, setItemName] = useState('');
	const [cost, setCost] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(false);

	const takePhoto = async () => {
		if (camera) {
			const pic = await camera.takePictureAsync({ skipProcessing: true });
			setPhoto(pic.uri);
		}
	};

	const pickImage = async () => {
		const pic = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		});
		setPhoto(pic.cancelled ? null : pic.uri);
	};

	useEffect(() => {
		(async () => {
			const response: PermissionResponse = await Camera.requestPermissionsAsync();
			setHasPermission(response.status === 'granted');
		})();
	}, []);

	if (hasPermission === null) {
		return <Text> Requesting permission </Text>;
	} else if (hasPermission === false) {
		return <Text> No access to camera </Text>;
	}

	const submitItem = async () => {
		if (photo === null) {
			Alert.alert('Please submit a photo!');
		} else if (itemName === '' || cost === 0 || quantity === 0) {
			Alert.alert('Please fill out all inputs before submitting');
		} else if (
			nameErrorMessage !== '' ||
			quantityErrorMessage !== '' ||
			costErrorMessage !== ''
		) {
			Alert.alert('Please fix errors before submitting');
		} else {
			setLoading(true);
			try {
				let addedItem: Item = await ItemService.addItem(
					itemName,
					cost,
					state.user!.eventId!,
					photo,
					bot._id,
					quantity
				);
				Alert.alert('Added Item succesfully');
				let updatedBot: Bot = await BotService.getOneBot(bot._id);
				navigation.navigate('ItemWeight', {
					itemId: addedItem._id,
					bot: updatedBot,
				});
			} catch (err) {
				Alert.alert('Something went wrong when submitting...');
			} finally {
				setLoading(false);
				setPhoto(null);
			}
		}
	};

	if (loading) {
		return (
			<View
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					top: screenHeight * 0.25,
				}}
			>
				<Loading loadingText="Loading"></Loading>
			</View>
		);
	} else {
		return (
			<Form navigation={navigation}>
				<View style={{ flex: 1, marginBottom: 24 }}>
					{photo === null ? (
						<>
							<Camera
								style={styles.camera}
								type={type}
								ref={(ref) => {
									setCamera(ref);
								}}
							/>
							{/* The circle icon must be above the image picker icon so it doesn't block
							the image picker's click handler  */}
							<Icon
								name="ios-radio-button-on"
								type="ionicon"
								color="#fff"
								size={50}
								iconStyle={{
									...styles.icon,
								}}
								containerStyle={{
									...styles.iconContainer,
									bottom: 0,
									left: 0,
									right: 0,
									alignItems: 'center',
								}}
								onPress={() => {
									takePhoto();
								}}
							/>
							<Icon
								name="ios-images"
								type="ionicon"
								color="#fff"
								size={50}
								iconStyle={styles.icon}
								containerStyle={{
									...styles.iconContainer,
									bottom: 0,
								}}
								onPress={() => {
									pickImage();
								}}
							/>
						</>
					) : (
						<>
							<Image
								style={styles.camera}
								source={{ uri: photo }}
								PlaceholderContent={<ActivityIndicator />}
							></Image>
							<Icon
								name="ios-close-circle"
								type="ionicon"
								color="#fff"
								size={40}
								iconStyle={styles.icon}
								containerStyle={{
									...styles.iconContainer,
									top: 0,
									right: 0,
								}}
								onPress={() => {
									setPhoto(null);
								}}
							/>
						</>
					)}
				</View>
				<View style={{ marginBottom: 24, width: '100%' }}>
					<Input
						placeholder="Item Name"
						onChangeText={(value) => setItemName(value)}
						errorMessage={nameErrorMessage}
					/>
					<Input
						placeholder="Price"
						onChangeText={(value) => {
							const regex: RegExp = /^\d+(?:\.?\d{0,2})$/;
							if (regex.test(value)) {
								setCost(Number(value));
								setCostErrorMessage('');
							} else {
								setCostErrorMessage('Enter a Valid Cost');
							}
						}}
						keyboardType="decimal-pad"
						errorMessage={costErrorMessage}
					></Input>
					<Input
						placeholder="Quantity"
						onChangeText={(value) => {
							if (Number.isInteger(+value)) {
								setQuantity(+value);
								setQuantityErrorMessage('');
							} else {
								setQuantityErrorMessage('Enter a Valid Quantity');
							}
						}}
						keyboardType="number-pad"
						errorMessage={quantityErrorMessage}
					></Input>
					<Button
						title="Add Item"
						buttonStyle={formStyles.formButton}
						onPress={() => {
							submitItem();
						}}
					/>
				</View>
			</Form>
		);
	}
};

const styles = StyleSheet.create({
	icon: {
		elevation: 5,
		shadowOpacity: 0.25,
		shadowRadius: 3,
		shadowOffset: {
			height: 2,
			width: 0,
		},
		padding: 16,
	},
	iconContainer: {
		backgroundColor: 'transparent',
		position: 'absolute',
	},
	input: {
		borderColor: 'gray',
		borderWidth: 1,
		width: screenWidth * 0.85,
		padding: 3,
	},
	camera: {
		flex: 1,
		width: screenWidth,
		alignSelf: 'center',
		marginTop: -NAV_HEIGHT,
	},
});

export default AddItem;
