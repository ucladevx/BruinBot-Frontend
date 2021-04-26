import { Alert } from 'react-native';
import { BASE_URL } from '../../config';
import { Button, Input, Text } from 'react-native-elements';
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
	navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState({ email: '', password: '' });
	const [loggingIn, setLoggingIn] = useState(false);
	const { state, dispatch } = useContext(Ctx);

	useEffect(() => {
		setLoggingIn(false);
		if (state.user != null) navigation.navigate('Qr');
	}, [navigation, state.user]);

	return (
		<Form bigTitle title="Log in" navigation={navigation}>
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
					setLoggingIn(true);
					state.firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
						// Fetch Firebase JWT
						.then((user: firebase.User) => {
							return Promise.all([user, user.getIdToken(true)]);
						})
						// Fetch user data
						.then(([user, token]) => {
							return Promise.all([
								user,
								Axios.get(BASE_URL + 'users/user', {
									params: { firebaseIdToken: token },
								}),
							]);
						})
						// Populate user data in Context
						.then(([user, res]) => {
							const userData: UserData = res.data;
							dispatch({
								type: 'SET_USER',
								user: {
									_id: userData._id,
									eventId: userData.eventId,
									uid: user.uid,
								},
							});
							dispatch({
								type: 'SET_ENTERPRISE_MODE',
								isEnterpriseMode: userData.eventId !== null,
							});
						})
						.catch((error: FirebaseError | any) => {
							if (error.type === 'FirebaseError')
								setFormErrors(handleAuthErrors(error));
							else {
								console.log(error);
								Alert.alert('There was an error');
							}
							setLoggingIn(false);
						});
				}}
				loading={loggingIn}
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
