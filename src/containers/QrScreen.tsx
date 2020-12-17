import React, { useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Ctx } from '../components/StateProvider';
import QrComponent from '../components/QrView';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Qr'>;
};

const QrScreen = ({ navigation }: Props) => {
	const { state } = useContext(Ctx);

	const navigateForward = () => {
		navigation.navigate('Dashboard');
	};

	return (
		<>
			<Text style={styles.title}>Scan a BruinBot</Text>

			<QrComponent navigateForward={navigateForward} />

			<View>
				{state.user ? (
					<Button
						containerStyle={styles.login}
						buttonStyle={styles.button}
						titleStyle={styles.buttonText}
						title="Sign out"
						onPress={() => state.firebase.auth().signOut()}
					/>
				) : (
					<Button
						containerStyle={styles.login}
						buttonStyle={styles.button}
						titleStyle={styles.buttonText}
						title="Log in"
						onPress={() => navigation.navigate('Login')}
					/>
				)}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	title: {
		margin: 50,
		fontSize: 30,
		textAlign: 'center',
	},
	login: {
		marginTop: 20,
		marginBottom: 40,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	button: {
		borderRadius: 50,
		borderWidth: 1,
		borderColor: 'lightgrey',
		padding: 15,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: 'white',
	},
	buttonText: {
		color: 'dimgrey',
		fontSize: 15,
	},
});

export default QrScreen;
