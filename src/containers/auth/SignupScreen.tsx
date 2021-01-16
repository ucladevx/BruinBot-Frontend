import { Alert } from 'react-native';
import { BASE_URL } from '../../config';
import { Button, Input } from 'react-native-elements';
import { Ctx } from '../../components/StateProvider';
import { PasswordInput, handleAuthErrors } from './FormUtils';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserData } from '../../types/apiTypes';
import { styles } from './FormStyles';
import Axios from 'axios';
import Form from './Form';
import React, { useContext, useEffect, useState } from 'react';
import firebase, { FirebaseError } from 'firebase';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
};

const SignupScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [formErrors, setFormErrors] = useState({ email: '', password: '' });
	const [signingIn, setSigningIn] = useState(false);
	const { state, dispatch } = useContext(Ctx);

	useEffect(() => {
		if (state.user != null) navigation.navigate('Qr');
	}, [navigation, state.user]);

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
				loading={signingIn}
				onPress={() => {
					if (password !== confirmPassword) {
						setFormErrors({
							password: 'Passwords do not match',
							email: '',
						});
						return;
					}
					setSigningIn(true);
					setFormErrors({ password: '', email: '' });
					state.firebase
						.auth()
						.createUserWithEmailAndPassword(email, password)
						// Fetch Firebase JWT
						.then((user) => Promise.all([user, user.getIdToken(true)]))
						// Init user data in Mongo
						.then(([user, token]) => {
							return Promise.all([
								user,
								Axios.post(BASE_URL + 'users/add', {
									username: email,
									firebaseIdToken: token,
								}),
							]);
						})
						// Populate user data in Context
						.then(([user, res]) => {
							const userData: UserData = res.data;
							setSigningIn(false);
							dispatch({
								type: 'SET_USER',
								user: {
									_id: userData._id,
									eventId: userData.eventId,
									uid: user.uid,
								},
							});
						})
						.catch((error: FirebaseError | any) => {
							setSigningIn(false);
							// Only FirebaseError has code
							if (error.code) setFormErrors(handleAuthErrors(error));
							else {
								console.log(error);
								console.log('Error during signup! Deleting user...');
								// We delete the user if we fail to add the user to mongodb
								// This is to prevent the existence of firebase users with no corresponding mongo entry
								firebase.auth().currentUser?.delete();
								Alert.alert(
									'Error connecting to server',
									'Check your internet connection'
								);
							}
						});
				}}
			/>
		</Form>
	);
};

export default SignupScreen;
