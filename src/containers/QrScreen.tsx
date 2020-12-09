import React, { useContext } from 'react';
import { Text, StyleSheet } from 'react-native';

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
			{state.user ? (
				<Text
					style={styles.footnote}
					onPress={() => state.firebase.auth().signOut()}
				>
					Sign out
				</Text>
			) : (
				<Text
					style={styles.footnote}
					onPress={() => navigation.navigate('Login')}
				>
					Log in
				</Text>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	title: {
		margin: 50,
		fontSize: 30,
		textAlign: 'center',
	},
	footnote: {
		margin: 30,
		textAlign: 'center',
	},
});

export default QrScreen;
