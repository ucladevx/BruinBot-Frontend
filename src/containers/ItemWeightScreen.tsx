import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Image,
	Dimensions,
} from 'react-native';
import Axios from 'axios';
import Constants from 'expo-constants';
import Bot from '../assets/robot.png';
import {
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

interface ItemWeightProps {
	id: string;
}

const baseUrl = 'http://localhost:5000';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ItemWeight = ({ id }: ItemWeightProps) => {
	const [weight, setWeight] = useState('');
	const onSubmit = async () => {
		await Axios.put(baseUrl + '/items/weight', {
			itemId: id,
			weight: parseFloat(weight).toFixed(1),
		})
			.then(() => {
				Alert.alert('Item weight set successfully\nRedirecting...');
				// TODO: Navigate back to items view
				//setTimeout(5000);
			})
			.catch(() => {
				Alert.alert('An error has occurred. Please try again.');
			});
	};

	return (
		<TouchableWithoutFeedback
			onPress={Keyboard.dismiss}
			style={styles.container}
		>
			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>
					Please place the item on the scale (shown below) to measure the weight
					of the item
				</Text>
				<Image source={Bot} style={styles.img} />
			</View>
			<KeyboardAvoidingView
				behavior="position"
				contentContainerStyle={styles.inputContainer}
			>
				<TextInput
					style={styles.inputField}
					onChangeText={(text) => setWeight(text)}
					placeholder="Item Weight"
					value={weight}
					keyboardType="numeric"
				/>
				<TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
					<Text style={styles.buttonText}>Done</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		paddingLeft: '3%',
		paddingRight: '3%',
		flexDirection: 'column',
		height: '100%',
		alignItems: 'center',
	},
	headerContainer: {
		alignItems: 'center',
		marginBottom: screenHeight * 0.1,
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 30,
		textAlign: 'center',
		marginBottom: screenHeight * 0.05,
	},
	img: {
		borderRadius: 10,
		aspectRatio: 1,
		width: screenWidth * 0.7,
		height: undefined,
	},
	inputContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: screenWidth,
	},
	inputField: {
		backgroundColor: '#ddd',
		borderRadius: 10,
		width: '90%',
		height: 50,
		paddingLeft: '5%',
		marginBottom: screenHeight * 0.01,
	},
	button: {
		backgroundColor: '#4b55f7',
		borderRadius: 30,
		height: 50,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		width: screenWidth * 0.5,
	},
	buttonText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 20,
	},
});

export default ItemWeight;
