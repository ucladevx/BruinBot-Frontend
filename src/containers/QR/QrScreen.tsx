import { Button } from 'react-native-elements';
import { Ctx } from '../../components/StateProvider';
import { Dimensions, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import QrComponent from './QrView';
import React, { useContext } from 'react';

type Props = {
	navigation: StackNavigationProp<RootStackParamList, 'Qr'>;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEADER_HEIGHT = 150;

const QrScreen = ({ navigation }: Props) => {
	const { state, dispatch } = useContext(Ctx);

	return (
		<>
			<QrComponent navigation={navigation} />

			<View>
				{state.user ? (
					<Button
						containerStyle={styles.login}
						buttonStyle={styles.button}
						titleStyle={styles.buttonText}
						title="Sign out"
						onPress={() =>
							state.firebase
								.auth()
								.signOut()
								.then(() => {
									dispatch({
										type: 'SET_USER',
										user: null,
									});
								})
						}
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
	login: {
		marginTop: SCREEN_HEIGHT - HEADER_HEIGHT - 60,
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
