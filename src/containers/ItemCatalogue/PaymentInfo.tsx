import {
	Alert,
	Dimensions,
	Keyboard,
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Ctx } from '../../components/StateProvider';
import { RootStackParamList } from '../../../App';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Form from '../Auth/Form';
import ItemCatalogueService from './ItemCatalogueService';
import React, { useContext, useState } from 'react';

import Loading from '../../components/Loading';

interface PaymentInfoProps {
	navigation: StackNavigationProp<RootStackParamList, 'PaymentInfo'>;
	route: RouteProp<RootStackParamList, 'PaymentInfo'>;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PaymentInfo = ({ navigation, route }: PaymentInfoProps) => {
	const { state } = useContext(Ctx);

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

	const updateInventory = async () => {
		try {
			let data = await ItemCatalogueService.updateInventory(
				route.params.bot._id,
				route.params.itemId,
				route.params.quantity
			);
			console.log(data);
		} catch (err) {
			Alert.alert('Could not update inventory.');
		}
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
		/* route is unused for now, but for the Stripe API needs an amount parameter in the request
		and amount is passed in through navigation and can be accessed as route.params.amount */
		console.log(route.params);
		updateInventory();
		setTimeout(() => {
			setLoading(false);
			console.log('Success');
			// TODO: after implementing Stripe API, if success is false, make sure to enable button again
			if (state.user) {
				navigation.navigate('PaymentSuccess', {
					success: true,
				});
			} else {
				navigation.navigate('EmailList');
			}
		}, 5000);
	};

	return (
		<Form bigTitle title="Enter Payment Info" navigation={navigation}>
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
					style={[styles.input, { width: screenWidth * 0.435 }]}
					placeholder="MM/YY"
					keyboardType={'numeric'}
					value={expiryDate}
					onChangeText={(text) => cleanupExpiryDate(text)}
					maxLength={5}
				/>
				<TextInput
					style={[styles.input, { width: screenWidth * 0.435 }]}
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
				<View style={{ alignItems: 'center', flex: 1 }}>
					<Loading loadingText={'Processing'} />
				</View>
			) : (
				<View></View>
			)}
		</Form>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		alignContent: 'center',
		marginTop: 30,
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
		width: screenWidth * 0.9,
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
