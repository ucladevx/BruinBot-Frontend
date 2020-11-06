import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseError } from 'firebase';
import React, { useContext, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Button, Icon, Input, Text } from 'react-native-elements';
import { RootStackParamList } from '../../../App';
import { Ctx } from '../../components/StateProvider';
import { styles } from './FormStyles';
import { handleAuthErrors } from './FormUtils';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [hidePassword, setHidePassword] = useState(true);
	const [formErrors, setFormErrors] = useState({ email: '', password: '' });
	const { state } = useContext(Ctx);

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
						secureTextEntry={hidePassword}
						onChangeText={(text) => setPassword(text)}
						rightIcon={
							<Icon
								name={hidePassword ? 'eye-slash' : 'eye'}
								type="font-awesome"
								onPress={() => setHidePassword(!hidePassword)}
							/>
						}
					/>
					<Text
						onPress={() => {
							console.log('yo');
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
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default LoginScreen;
