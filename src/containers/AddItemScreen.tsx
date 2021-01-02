import * as ImagePicker from 'expo-image-picker';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { Button, Icon, Image, Input } from 'react-native-elements';
import { Camera, PermissionResponse } from 'expo-camera';
import { Ctx } from '../components/StateProvider';
import { HARDCODED_EVENT_ID } from '../config';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles as formStyles } from './auth/FormStyles';
import Form from './auth/Form';
import ItemService from '../services/ItemService';
import React, { useContext, useEffect, useState } from 'react';

const screenWidth = Dimensions.get('window').width;

interface AddItemProps {
	navigation: StackNavigationProp<RootStackParamList, 'AddItem'>;
	botId: string;
}

const AddItem = ({ navigation }: AddItemProps) => {
	const { state } = useContext(Ctx);
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
		} else if (!state.bot) {
			Alert.alert('Please scan a bot first');
		} else {
			try {
				await ItemService.addItem(
					itemName,
					cost,
					HARDCODED_EVENT_ID,
					photo,
					state.bot._id,
					quantity
				);
				Alert.alert('Added Item succesfully');
				navigation.navigate('InventoryModification');
			} catch (err) {
				Alert.alert('Something went wrong when submitting...');
			}
		}
	};

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
	},
});

export default AddItem;
