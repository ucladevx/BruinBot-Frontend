import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseError } from 'firebase';
import React, { useContext, useState } from 'react';
import { Button, Input, Text } from 'react-native-elements';
import { RootStackParamList } from '../../../App';
import { Ctx } from '../../components/StateProvider';
import Form from './Form';
import { styles } from './FormStyles';
import { handleAuthErrors, PasswordInput } from './FormUtils';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState({ email: '', password: '' });
	const { state } = useContext(Ctx);

	return (
		<Form title="BruinBot" navigation={navigation}>
			<Input
				placeholder="Email"
				errorMessage={formErrors.email}
				onChangeText={(text) => setEmail(text)}
			/>
			<PasswordInput
				errorMessage={formErrors.password}
				onChangeText={(text) => setPassword(text)}
			/>
			<Text
				onPress={() => {
					navigation.navigate('PasswordReset');
				}}
				style={{
					textDecorationLine: 'underline',
					alignSelf: 'flex-end',
					marginHorizontal: 8,
					marginBottom: 16,
				}}
			>
				Forgot password?
			</Text>
			<Button
				title="Log in"
				buttonStyle={styles.formButton}
				onPress={() => {
					state.firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
						.then(() => {
							if (state.bot) {
								navigation.navigate('Map');
							} else {
								navigation.navigate('Qr');
							}
						})
						.catch((error: FirebaseError) => {
							setFormErrors(handleAuthErrors(error));
						});
				}}
			/>
			<Text
				onPress={() => {
					navigation.navigate('Signup');
				}}
				style={{
					textDecorationLine: 'underline',
					justifyContent: 'flex-end',
					marginHorizontal: 8,
					marginTop: 16,
				}}
			>
				Don&apos;t have an account? Sign up
			</Text>
		</Form>
	);
};

export default LoginScreen;
