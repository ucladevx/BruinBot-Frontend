import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Dimensions,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

import Loading from '../components/Loading';

interface PaymentInfoProps {
	navigation: StackNavigationProp<RootStackParamList, 'PaymentInfo'>;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PaymentInfo = ({ navigation }: PaymentInfoProps) => {
	const [cardNumber, setCardNumber] = useState('');
	const [expiryDate, setExpiryDate] = useState('');
	const [cvv, setCVV] = useState('');
	const [loading, setLoading] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(false);

	const cleanupCardNumber = (number: string) => {
		let cleanup = number
			.replace(/\s?/g, '')
			.replace(/(\d{4})/g, '$1 ')
			.trim();
		if (cleanup.slice(-1) === '.')
			cleanup = cleanup.substring(0, cleanup.length - 1);
		setCardNumber(cleanup);
	};
	const cleanupExpiryDate = (number: string) => {
		if (number.slice(-1) === '.')
			number = number.substring(0, number.length - 1);
		else if (number.length === 2 && expiryDate.length == 1) number += '/';
		else if (number.length === 2 && expiryDate.length == 3)
			number = number.substring(0, number.length - 1);
		setExpiryDate(number);
	};
	const processAndSubmitPayment = () => {
		if (cardNumber.length !== 19) {
			setLoading(false);
			setSubmitDisabled(false);
			Alert.alert('Invalid Card Number');
			return;
		}
		if (
			expiryDate.length !== 5 ||
			parseInt(expiryDate.substring(0, 2)) <= 0 ||
			parseInt(expiryDate.substring(0, 2)) > 12
		) {
			setLoading(false);
			setSubmitDisabled(false);
			Alert.alert('Invalid Expiry Date');
			return;
		}
		if (cvv.length !== 3) {
			setLoading(false);
			setSubmitDisabled(false);
			Alert.alert('Invalid CVV');
			return;
		}

		// TODO: Stripe API Payment Processing
		setTimeout(() => {
			setLoading(false);
			console.log('Success');
			// TODO: after implementing Stripe API, if success is false, make sure to enable button again
			navigation.navigate('PaymentSuccess', {
				success: false,
			});
		}, 5000);
	};
	// TODO: Use Edward's Form component instead of KeyboardAvoidingView
	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<KeyboardAvoidingView behavior="position" style={styles.container}>
				<Text style={styles.header}>Enter Payment Info</Text>
				<TextInput
					style={[styles.input, { width: screenWidth * 0.9 }]}
					placeholder="0000 0000 0000 0000"
					keyboardType={'numeric'}
					value={cardNumber}
					onChangeText={(text) => cleanupCardNumber(text)}
					maxLength={19}
				/>
				<View style={styles.inputContainer}>
					<TextInput
						style={[styles.input, { width: screenWidth * 0.43 }]}
						placeholder="MM/YY"
						keyboardType={'numeric'}
						value={expiryDate}
						onChangeText={(text) => cleanupExpiryDate(text)}
						maxLength={5}
					/>
					<TextInput
						style={[styles.input, { width: screenWidth * 0.43 }]}
						placeholder="000"
						keyboardType={'numeric'}
						value={cvv}
						onChangeText={(text) => {
							if (text.slice(-1) !== '.') setCVV(text);
						}}
						maxLength={3}
					/>
				</View>
				<Button
					onPress={() => {
						Keyboard.dismiss();
						setLoading(true);
						setSubmitDisabled(true);
						processAndSubmitPayment();
					}}
					buttonStyle={styles.button}
					title="Submit Payment"
					titleStyle={styles.buttonText}
					disabled={submitDisabled}
				/>
				{loading ? (
					<View style={{ alignItems: 'center' }}>
						<Loading loadingText={'Processing'} />
					</View>
				) : (
					<View></View>
				)}
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		marginLeft: screenWidth * 0.05,
		marginRight: screenWidth * 0.05,
	},
	header: {
		fontWeight: 'bold',
		fontSize: 30,
		marginBottom: screenHeight * 0.05,
		textAlign: 'center',
	},
	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: screenHeight * 0.01,
	},
	input: {
		backgroundColor: '#ddd',
		borderRadius: 10,
		paddingLeft: screenWidth * 0.05,
		paddingTop: 15,
		paddingBottom: 15,
		width: screenWidth * 0.45,
		fontSize: 20,
	},
	button: {
		marginTop: screenHeight * 0.03,
		height: 50,
		alignSelf: 'center',
		width: screenWidth * 0.5,
		backgroundColor: '#3399ff',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontWeight: 'bold',
		color: 'white',
	},
});

export default PaymentInfo;
