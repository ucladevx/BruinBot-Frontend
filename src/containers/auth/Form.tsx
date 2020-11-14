import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Text } from 'react-native-elements';
import { RootStackParamList } from '../../../App';
import { styles } from './FormStyles';
import { BackButton } from './FormUtils';

type Props = {
	backButton?: boolean;
	title: string;
	children: React.ReactNode;
	navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
};

const Form = (props: Props) => {
	return (
		<TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
				style={styles.container}
			>
				<View style={styles.logoContainer}>
					<Text h1 style={{ fontWeight: 'bold' }}>
						{props.title}
					</Text>
				</View>
				<View style={styles.formContainer}>{props.children}</View>
				{/* This absolutely positioned icon must be at the bottom to be able to register press */}
				{props.backButton && (
					<BackButton onPress={() => props.navigation.goBack()} />
				)}
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default Form;
