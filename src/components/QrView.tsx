import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as URL from 'url';

import { BarCodeScanner } from 'expo-barcode-scanner';
// Credit: <a href='https://pngtree.com/so/simple'>simple png from pngtree.com</a>
import Border from '../assets/qr2_from_pngtree.png';

import { Ctx } from './StateProvider';
import BotService from '../services/BotService';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

interface Props {
	navigateForward: () => void;
}

const QrComponent = ({ navigateForward }: Props) => {
	const [hasCameraPermission, setCameraPermission] = useState('null');
	const [scanned, setScanned] = useState(false);

	const { state, dispatch } = useContext(Ctx);

	useEffect(() => {
		Permissions.askAsync(Permissions.CAMERA).then((res) => {
			setCameraPermission(res.status);
		});
	}, []);

	if (hasCameraPermission === 'null') {
		return (
			<Text style={styles.container}>Requesting for camera permission...</Text>
		);
	} else if (hasCameraPermission !== 'granted') {
		return <Text style={styles.container}>No access to camera.</Text>;
	}

	const alertError = () => {
		Alert.alert('Oops', 'Please scan a bruinbot QR code!', [
			{
				text: 'Ok',
				onPress: () => setScanned(false),
			},
		]);
	};

	return (
		<View style={styles.container}>
			{!state.bot && (
				<BarCodeScanner
					onBarCodeScanned={
						scanned
							? () => {}
							: async ({ type: _type, data }) => {
									setScanned(true);
									const { query } = URL.parse(data);
									if (!query) {
										alertError();
										return;
									}
									const qrData = JSON.parse(
										`{"${query}"}`.replace(/=/g, '": "').replace(/&/g, '", "')
									);
									const { botId } = qrData;

									if (!botId) {
										alertError();
										return;
									}

									try {
										const bot = await BotService.getOneBot(botId);
										dispatch({ type: 'SET_BOT', bot });
										Alert.alert(`Connected to ${bot.name}!`);
										navigateForward();
									} catch (err) {
										Alert.alert('Could not connect to BruinBot...');
									} finally {
										setScanned(false);
									}
							  }
					}
					style={[styles.scanner]}
				>
					<Image style={styles.qr} source={Border} />
				</BarCodeScanner>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
	},
	scanner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Dimensions.get('window').width - 20,
		borderRadius: 25,
		overflow: 'hidden',
	},
	qr: {
		marginTop: '20%',
		marginBottom: '20%',
		width: qrSize,
		height: qrSize,
	},
});

export default QrComponent;
