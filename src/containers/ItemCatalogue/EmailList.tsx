import { Button } from 'react-native-elements';
import { Dimensions, StyleSheet, TextInput } from 'react-native';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import Form from '../Auth/Form';
import React, { useState } from 'react';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'EmailList'>;
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const EmailList = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');

	const navigateForward = () => {
		navigation.navigate('PaymentSuccess', {
			success: true,
		});
	};

	return (
		<Form bigTitle title="Join Our Email List!" navigation={navigation}>
			<TextInput
				style={[styles.input, { width: screenWidth * 0.9 }]}
				placeholder="Email"
				value={email}
				onChangeText={(text) => setEmail(text)}
			/>
			<Button
				onPress={navigateForward}
				buttonStyle={styles.button}
				title="Submit"
				titleStyle={styles.buttonText}
			/>
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

export default EmailList;
