import { FirebaseError } from 'firebase';
import React, { useContext, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Ctx } from '../components/StateProvider';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { state } = useContext(Ctx);
	return (
		<TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
				style={styles.container} >
				<View style={styles.logoContainer}>
					<Text>
						Logo goes here!
					</Text>
				</View>
				<View style={styles.formContainer}>
					<Input
						placeholder='Email'
						containerStyle={{ marginBottom: 8 }}
						onChangeText={(text) => setEmail(text)}
					/>
					<Input
						placeholder='Password'
						containerStyle={{ marginBottom: 16 }}
						secureTextEntry={true}
						onChangeText={(text) => setPassword(text)}
					/>
					<Button
						title="Log in"
						buttonStyle={{ width: 128 }}
						containerStyle={{ marginBottom: 16 }}
						onPress={() => {
							state.firebase.auth().signInWithEmailAndPassword(email, password).catch(function (_error: FirebaseError) {
								// TODO: Handle error codes
							});
						}}
					/>
					<Button
						title="Sign up"
						buttonStyle={{ width: 128 }}
						containerStyle={{ marginBottom: 16 }}
						onPress={() => {
							state.firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (_error: FirebaseError) {
								// TODO: Handle error codes
							});
						}}
					/>
				</View>
			</KeyboardAvoidingView >
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
		backgroundColor: '#fff',
	},
	logoContainer: {
		height: '40%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingBottom: 24
	},
	formContainer: {
		height: '60%',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 24,
		paddingHorizontal: 24,
		backgroundColor: '#fff',
	}
});

export default LoginScreen;