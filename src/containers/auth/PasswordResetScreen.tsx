import { Button, Input, Text } from 'react-native-elements';
import { Ctx } from '../../components/StateProvider';
import { FirebaseError } from 'firebase';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { handleAuthErrors } from './FormUtils';
import { styles } from './FormStyles';
import Form from './Form';
import React, { useContext, useState } from 'react';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'PasswordReset'>;
};

/*
	Used to track which stage of the password reset process the user is currently in
 	Changes the form shown to the user accordingly
 */
enum Stage {
	PasswordResetEmail = 'PASSWORD_RESET_EMAIL',
	ChangePassword = 'CHANGE_PASSWORD',
	Done = 'DONE',
}

const PasswordResetScreen = ({ navigation }: Props) => {
	const [stage, setStage] = useState<Stage>(Stage.PasswordResetEmail);

	// The form that is shown to the user, depending on stage
	let currentForm;
	switch (stage) {
		case Stage.PasswordResetEmail:
			currentForm = (
				<PasswordResetEmailForm
					nextStage={() => setStage(Stage.ChangePassword)}
				/>
			);
			break;
		case Stage.ChangePassword:
			currentForm = (
				<ChangePasswordForm nextStage={() => setStage(Stage.Done)} />
			);
			break;
		case Stage.Done:
			currentForm = (
				<>
					<Text>All set! Your password has been changed.</Text>
					<Button title="Back to Login" />
				</>
			);
			break;
	}

	return (
		<Form bigTitle title={'Reset Password'} navigation={navigation} backButton>
			{currentForm}
		</Form>
	);
};

const PasswordResetEmailForm = ({ nextStage }: { nextStage: () => void }) => {
	const [email, setEmail] = useState('');
	const [formError, setFormError] = useState('');
	const { state } = useContext(Ctx);
	return (
		<>
			<Input
				placeholder="Email"
				errorMessage={formError}
				onChangeText={(text) => setEmail(text)}
			/>
			<Button
				title="Reset password"
				buttonStyle={styles.formButton}
				onPress={() => {
					state.firebase
						.auth()
						.sendPasswordResetEmail(email)
						.then(() => {
							nextStage();
						})
						.catch((error: FirebaseError) => {
							setFormError(handleAuthErrors(error).email);
						});
				}}
			/>
		</>
	);
};

const ChangePasswordForm = ({ nextStage }: { nextStage: () => void }) => {
	const [code, setCode] = useState('');
	const [formError, setFormError] = useState('');
	const [confirmed, setConfirmed] = useState(false);
	const [password, setPassword] = useState('');
	const { state } = useContext(Ctx);
	if (!confirmed) {
		return (
			<>
				<Input
					placeholder="Verification code"
					errorMessage={formError}
					onChangeText={(text) => setCode(text)}
				/>
				<Button
					title="Reset password"
					buttonStyle={styles.formButton}
					onPress={() => {
						state.firebase
							.auth()
							.checkActionCode(code)
							.then(() => {
								setConfirmed(true);
								setFormError('');
							})
							.catch((error: FirebaseError) => {
								setFormError(handleAuthErrors(error).password);
							});
					}}
				/>
			</>
		);
	} else {
		return (
			<>
				<Input
					placeholder="Password"
					errorMessage={formError}
					onChangeText={(text) => setPassword(text)}
				/>
				<Button
					title="Reset password"
					buttonStyle={styles.formButton}
					onPress={() => {
						state.firebase
							.auth()
							.confirmPasswordReset(code, password)
							.then(() => {
								nextStage();
							})
							.catch((error: FirebaseError) => {
								setFormError(handleAuthErrors(error).password);
							});
					}}
				/>
			</>
		);
	}
};

export default PasswordResetScreen;
