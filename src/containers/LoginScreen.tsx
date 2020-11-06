import { FirebaseError } from 'firebase';
import React, { useContext, useEffect, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Ctx } from '../components/StateProvider';

function handleAuthErrors(error: FirebaseError) {
	switch (error.code) {
		case 'auth/user-disabled':
			return {
				email: 'The user corresponding to the provided email has been disabled',
				password: '',
			};
		case 'auth/user-not-found':
			return {
				email: 'There is no user corresponding to the provided email',
				password: '',
			};
		case 'auth/wrong-password':
			return { email: '', password: 'The provided password is incorrect' };
		case 'auth/email-already-in-use':
			return { email: 'The provided email is already in use', password: '' };
		case 'auth/invalid-email':
			return { email: 'The provided email is invalid', password: '' };
		case 'auth/weak-password':
			return { email: '', password: 'The provided pasword is too weak' };
		default:
			throw 'Invalid Firebase Auth code!';
	}
}

const LoginScreen = (props: any) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState({ email: '', password: '' });
	const { state } = useContext(Ctx);

	useEffect(() => {
		if (state.user) props.navigation.navigate('Blank');
	});

	return (
		<TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
				style={styles.container}
			>
				<View style={styles.logoContainer}>
					<Text h1 style={{ fontWeight: 'bold' }}>
						BruinBot
					</Text>
				</View>
				<View style={styles.formContainer}>
					<Input
						placeholder="Email"
						errorMessage={formErrors.email}
						onChangeText={(text) => setEmail(text)}
					/>
					<Input
						placeholder="Password"
						errorMessage={formErrors.password}
						secureTextEntry={true}
						onChangeText={(text) => setPassword(text)}
					/>
					<Button
						title="Log in"
						buttonStyle={{ width: 128 }}
						containerStyle={{ marginBottom: 16 }}
						onPress={() => {
							state.firebase
								.auth()
								.signInWithEmailAndPassword(email, password)
								.catch((error: FirebaseError) => {
									setFormErrors(handleAuthErrors(error));
								});
						}}
					/>
					<Button
						title="Sign up"
						buttonStyle={{ width: 128 }}
						containerStyle={{ marginBottom: 16 }}
						onPress={() => {
							state.firebase
								.auth()
								.createUserWithEmailAndPassword(email, password)
								.catch((error: FirebaseError) => {
									setFormErrors(handleAuthErrors(error));
								});
						}}
					/>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'stretch',
	},
	logoContainer: {
		height: '40%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingBottom: 24,
	},
	formContainer: {
		height: '60%',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 24,
		paddingHorizontal: 24,
	},
});

export default LoginScreen;
