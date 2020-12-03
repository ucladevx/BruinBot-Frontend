import React, { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import {
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	View,
	Text,
	Alert,
} from 'react-native';
import { Camera, PermissionResponse } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Icon, Button, Input, Image } from 'react-native-elements';

const screenWidth = Dimensions.get('window').width;

interface AddItemProps {
	navigation: StackNavigationProp<RootStackParamList, 'AddItem'>;
	botId: string;
}

const AddItem = ({ navigation, botId }: AddItemProps) => {
	const [nameErrorMessage, setNameErrorMessage] = useState('');
	const [costErrorMessage, setCostErrorMessage] = useState('');
	const [quantityErrorMessage, setQuantityErrorMessage] = useState('');

	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
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
		} else {
			//DO REQUEST
			Alert.alert('Added Item succesfully');
			navigation.navigate('InventoryModification');
		}
	};

	return (
		<>
			<View style={{ flex: 1 }}>
				<Icon
					name="arrow-left"
					type="font-awesome"
					color="black"
					size={30}
					containerStyle={{
						position: 'absolute',
						top: 40,
						left: 15,
					}}
					onPress={() => {
						navigation.navigate('InventoryModification');
					}}
				/>
				<Text style={styles.header}> Add an Item </Text>
				<View style={styles.cameraContainer}>
					{photo === null ? (
						<>
							<Camera
								style={styles.camera}
								type={type}
								ref={(ref) => {
									setCamera(ref);
								}}
							/>
							<Icon
								name="image"
								type="font-awesome"
								color="#fff"
								size={50}
								containerStyle={{
									backgroundColor: 'transparent',
									position: 'absolute',
									bottom: 5,
									left: screenWidth * 0.11,
								}}
								onPress={() => {
									pickImage();
								}}
							/>
							<Icon
								name="circle"
								type="font-awesome"
								color="#fff"
								size={50}
								containerStyle={{
									backgroundColor: 'transparent',
									position: 'absolute',
									bottom: 5,
								}}
								onPress={() => {
									takePhoto();
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
								name="times"
								type="font-awesome"
								color="#fff"
								size={40}
								containerStyle={{
									backgroundColor: 'transparent',
									position: 'absolute',
									top: 5,
									right: screenWidth * 0.09,
								}}
								onPress={() => {
									setPhoto(null);
								}}
							/>
						</>
					)}
				</View>
				<View
					style={{ flex: 9, width: screenWidth * 0.8, alignSelf: 'center' }}
				>
					<View style={styles.inputBlock}>
						<Input
							placeholder="Item Name"
							onChangeText={(value) => setItemName(value)}
							errorMessage={nameErrorMessage}
						/>
					</View>
					<View style={styles.inputBlock}>
						<Input
							placeholder="Cost"
							onChangeText={(value) => {
								const regex: RegExp = /^\d+(?:\.?\d{0,2})$/;
								if (regex.test(value)) {
									setCost(Number(value));
									setCostErrorMessage('');
								} else {
									setCostErrorMessage('Enter a Valid Cost');
								}
							}}
							keyboardType="number-pad"
							errorMessage={costErrorMessage}
						></Input>
					</View>
					<View style={styles.inputBlock}>
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
							keyboardType="numeric"
							errorMessage={quantityErrorMessage}
						></Input>
					</View>
					<View style={styles.inputBlock}>
						<Button
							title="Add Item"
							buttonStyle={styles.button}
							containerStyle={styles.buttonContainer}
							onPress={() => {
								submitItem();
							}}
						/>
					</View>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	header: {
		top: 45,
		fontSize: 40,
		fontWeight: 'bold',
		flex: 3,
		alignSelf: 'center',
	},
	cameraContainer: {
		flex: 13,
		alignItems: 'center',
		marginVertical: 15,
	},
	inputBlock: {
		display: 'flex',
		flexDirection: 'row',
		alignSelf: 'center',
	},
	input: {
		borderColor: 'gray',
		borderWidth: 1,
		width: screenWidth * 0.85,
		padding: 3,
	},
	button: {
		height: 50,
		alignSelf: 'center',
		width: screenWidth * 0.5,
		backgroundColor: '#3399ff',
	},
	buttonContainer: {
		borderRadius: 30,
		alignSelf: 'center',
		fontSize: 20,
	},
	camera: {
		width: screenWidth * 0.85,
		alignSelf: 'center',
		flex: 1,
	},
});

export default AddItem;
