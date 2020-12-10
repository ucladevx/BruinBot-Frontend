import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseError } from 'firebase';
import React, { useContext, useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { RootStackParamList } from '../../../App';
import { Ctx } from '../../components/StateProvider';
import Form from './Form';
import { styles } from './FormStyles';
import { handleAuthErrors, PasswordInput } from './FormUtils';
import Axios from 'axios';

const baseUrl = 'http://192.168.1.10:8080';

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
		<Form title="Sign up" navigation={navigation} backButton>
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
								const response = await Axios.post(baseUrl + '/users/add', {
									username: email,
									firebase_id_token: idToken,
								});
								console.log("sucess");
								console.log(response.data);
							  } catch (error) {
								console.log("error")
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
