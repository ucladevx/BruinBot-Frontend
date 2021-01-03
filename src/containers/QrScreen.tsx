import { Button } from 'react-native-elements';
import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';

import { Ctx } from '../components/StateProvider';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import QrComponent from '../components/QrView';
import ScanGif from '../assets/scan.gif';

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
			<Image source={ScanGif} style={styles.gif} />
			<Text style={styles.title}>Scan QR code on the BruinBot to continue</Text>

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
	gif: {
		marginLeft: 'auto',
		marginRight: 'auto',
		margin: 15,
		height: 75,
		resizeMode: 'contain',
	},
	title: {
		marginBottom: 25,
		fontSize: 15,
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
