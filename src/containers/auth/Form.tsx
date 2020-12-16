import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Text } from 'react-native-elements';
import { RootStackParamList } from '../../../App';
import { BackButton } from './FormUtils';

type Props = {
	backButton?: boolean;
	bigTitle?: boolean;
	title: string;
	children: React.ReactNode;
	navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
};

const Form = ({ backButton, bigTitle, title, children, navigation }: Props) => {
	return (
		<TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
				style={styles({ bigTitle }).container}
			>
				<View style={styles({ bigTitle }).logoContainer}>
					<Text h1 style={{ fontWeight: 'bold' }}>
						{title}
					</Text>
				</View>
				<View style={styles({ bigTitle }).formContainer}>{children}</View>
				{/* This absolutely positioned icon must be at the bottom to be able to register press */}
				{backButton && <BackButton onPress={() => navigation.goBack()} />}
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

interface StyleProps {
	bigTitle?: boolean;
}
const styles = ({ bigTitle }: StyleProps) =>
	StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'column',
			alignItems: 'stretch',
		},
		logoContainer: {
			flex: bigTitle ? 4 : 1,
			alignItems: 'center',
			justifyContent: bigTitle ? 'flex-end' : 'center',
			paddingBottom: 24,
		},
		formContainer: {
			flex: bigTitle ? 6 : 9,
			alignItems: 'center',
			justifyContent: 'flex-start',
			paddingTop: bigTitle ? 24 : 0,
			paddingHorizontal: 24,
		},
	});

export default Form;
