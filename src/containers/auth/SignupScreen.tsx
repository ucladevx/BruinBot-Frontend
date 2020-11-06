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

const SignupScreen = ({ navigation }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [hidePassword, setHidePassword] = useState(true);
	const [confirmPassword, setConfirmPassword] = useState('');
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
						Sign up
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
					<Input
						placeholder="Confirm password"
						errorMessage={formErrors.password}
						secureTextEntry
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
								.catch((error: FirebaseError) => {
									setFormErrors(handleAuthErrors(error));
								});
						}}
					/>
				</View>
				<View style={{ position: 'absolute', left: 16, top: 32 }}>
					<Icon
						name="arrow-left"
						type="font-awesome"
						onPress={() => navigation.goBack()}
					/>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default SignupScreen;
