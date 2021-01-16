import { Button, Input } from 'react-native-elements';
import React, { useContext, useState } from 'react';

import { FirebaseError } from 'firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import Axios from 'axios';

import { BASE_URL } from '../../config';
import { Ctx } from '../../components/StateProvider';
import { PasswordInput, handleAuthErrors } from './FormUtils';
import { RootStackParamList } from '../../../App';
import { styles } from './FormStyles';
import Form from './Form';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
};

const SignupScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [formErrors, setFormErrors] = useState({ email: '', password: '' });
	const { state } = useContext(Ctx);

	return (
		<Form bigTitle title="Sign up" navigation={navigation} backButton>
			<Input
				placeholder="Email"
				errorMessage={formErrors.email}
				onChangeText={(text) => setEmail(text)}
			/>
			<PasswordInput
				errorMessage={formErrors.password}
				onChangeText={(text) => setPassword(text)}
			/>
			<PasswordInput
				placeholder="Confirm password"
				errorMessage={formErrors.password}
				onChangeText={(text) => setConfirmPassword(text)}
			/>
			<Button
				title="Sign up"
				buttonStyle={styles.formButton}
				onPress={() => {
					if (password !== confirmPassword) {
						setFormErrors({
							password: 'Passwords do not match',
							email: '',
						});
						return;
					}
					state.firebase
						.auth()
						.createUserWithEmailAndPassword(email, password)
						.then(async (user) => {
							const idToken = await user.getIdToken(true);
							console.log(idToken);
							//Works up to here. Just learn how to use axios
							try {
								const response = await Axios.post(BASE_URL + 'users/add', {
									username: email,
									firebaseIdToken: idToken,
								});
								console.log(response.data);
							} catch (error) {
								console.error(error);
							}
						})
						.catch((error: FirebaseError) => {
							setFormErrors(handleAuthErrors(error));
						});
				}}
			/>
		</Form>
	);
};

export default SignupScreen;
