import * as Linking from 'expo-linking';
import * as Permissions from 'expo-permissions';
import * as URL from 'url';
import { Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';
// Credit: <a href='https://pngtree.com/so/simple'>simple png from pngtree.com</a>
import Border from '../../assets/qrBorder.png';
import MainStyles from '../../styles/main.scss';
import ScanIcon from '../../assets/scanIcon.png';

import BotService from '../../services/BotService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const QR_SIZE = 230;

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Qr'>;
}

const QrComponent = ({ navigation }: Props) => {
	const [hasCameraPermission, setCameraPermission] = useState('null');
	const [functionLock, setFunctionLock] = useState(false);
	const [cameraLock, setCameraLock] = useState(false);
	const [alert, setAlert] = useState(false);

	const alertError = useCallback(
		(msg: string) => {
			if (!alert) {
				setAlert(true);
				Alert.alert('Oops', msg, [
					{
						text: 'Ok',
						onPress: () => {
							setFunctionLock(false);
							setAlert(false);
						},
					},
				]);
			}
		},
		[alert]
	);

	const updateBotFromDeepLink = useCallback(
		async (botId: string) => {
			setFunctionLock(true);
			try {
				const bot = await BotService.getOneBot(botId);
				Alert.alert(`Connected to ${bot.name}!`);
				setCameraLock(true);
				navigation.navigate('Dashboard', { bot });
			} catch {
				alertError('Could not connect to BruinBot...');
			}
		},
		[navigation, alertError]
	);

	useEffect(() => {
		Linking.parseInitialURLAsync().then(({ path: _path, queryParams }) => {
			if (queryParams && queryParams.botId) {
				updateBotFromDeepLink(queryParams.botId);
			}
		});
	}, [updateBotFromDeepLink]);

	Linking.addEventListener('url', ({ url }) => {
		if (url) {
			const { queryParams } = Linking.parse(url);
			if (queryParams && queryParams.botId) {
				updateBotFromDeepLink(queryParams.botId);
			}
		}
	});

	useEffect(() => {
		Permissions.askAsync(Permissions.CAMERA).then((res) => {
			setCameraPermission(res.status);
		});
	}, []);

	useFocusEffect(
		useCallback(() => {
			setCameraLock(false);
			setFunctionLock(false);
		}, [])
	);

	if (hasCameraPermission === 'null') {
		return (
			<Text style={styles.container}>Requesting for camera permission...</Text>
		);
	} else if (hasCameraPermission !== 'granted') {
		return <Text style={styles.container}>No access to camera.</Text>;
	}

	return (
		<View style={styles.container}>
			{!cameraLock && (
				<BarCodeScanner
					onBarCodeScanned={
						functionLock
							? () => {}
							: async ({ type: _type, data }) => {
									setFunctionLock(true);
									const { query } = URL.parse(data);
									if (!query) {
										alertError('Please scan a BruinBot QR code!');
										return;
									}
									const qrData = JSON.parse(
										`{"${query}"}`.replace(/=/g, '": "').replace(/&/g, '", "')
									);
									const { botId } = qrData;

									if (!botId) {
										alertError('Please scan a BruinBot QR code!');
										return;
									}

									try {
										const bot = await BotService.getOneBot(botId);
										Alert.alert(`Connected to ${bot.name}!`);
										setCameraLock(true);
										navigation.navigate('Dashboard', { bot });
									} catch (err) {
										alertError('We cannot find this BruinBot...');
									}
							  }
					}
					style={styles.scanner}
				>
					<Image style={styles.qr} source={Border} />
					<View style={styles.label}>
						<Image style={styles.icon} source={ScanIcon} />
						<Text
							style={[MainStyles['primary-white'], MainStyles['text-body-1']]}
						>
							Scan the Bruinbot&apos;s QR code
						</Text>
					</View>
				</BarCodeScanner>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
	},
	scanner: {
		position: 'absolute',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	qr: {
		width: QR_SIZE,
		height: QR_SIZE,
	},
	label: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 41,
		width: 282,
		height: 44,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		borderRadius: 18,
	},
	icon: {
		height: 18,
		width: 20,
		marginRight: 16,
	},
});

export default QrComponent;
