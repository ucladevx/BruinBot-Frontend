import { FirebaseError } from 'firebase';
import { GestureResponderEvent, View } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import React, { useState } from 'react';

// Handles error codes that may be returned from Firebase Auth calls
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
		case 'auth/expired-action-code':
			return { password: 'The verification code has expired', email: '' };
		case 'auth/invalid-action-code':
			return { password: 'The verification code is invalid', email: '' };
		default:
			throw 'Invalid Firebase Auth code!';
	}
}

const BackButton = ({
	onPress,
}: {
	onPress: (_event: GestureResponderEvent) => void;
}) => {
	return (
		<View style={{ position: 'absolute', left: 16, top: 32 }}>
			<Icon name="arrow-left" type="font-awesome" onPress={onPress} />
		</View>
	);
};

const PasswordInput = ({
	errorMessage,
	placeholder = 'Password',
	onChangeText,
}: {
	errorMessage: string;
	placeholder?: string;
	onChangeText: (_text: string) => void;
}) => {
	const [hidePassword, setHidePassword] = useState(true);
	return (
		<Input
			placeholder={placeholder}
			errorMessage={errorMessage}
			secureTextEntry={hidePassword}
			onChangeText={onChangeText}
			rightIcon={
				<Icon
					name={hidePassword ? 'eye-slash' : 'eye'}
					type="font-awesome"
					onPress={() => setHidePassword(!hidePassword)}
				/>
			}
		/>
	);
};

export { handleAuthErrors, BackButton, PasswordInput };
