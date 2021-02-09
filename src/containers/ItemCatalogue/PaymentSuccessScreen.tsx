import { Button } from 'react-native-elements';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

interface PaymentSuccessProps {
	navigation: StackNavigationProp<RootStackParamList, 'PaymentSuccess'>;
	route: RouteProp<RootStackParamList, 'PaymentSuccess'>;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PaymentSuccess = ({ navigation, route }: PaymentSuccessProps) => {
	return route.params.success ? (
		<View style={styles.container}>
			<Text style={styles.header}>
				Thank you for your purchase! Please take your item from the BruinBot.
			</Text>
		</View>
	) : (
		<View style={styles.container}>
			<Text style={styles.header}>
				An error has occurred. Please try again.
			</Text>
			<Button
				onPress={() => navigation.goBack()}
				buttonStyle={styles.button}
				title="Go Back"
				titleStyle={styles.buttonText}
			/>
		</View>
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
		textAlign: 'center',
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

export default PaymentSuccess;
