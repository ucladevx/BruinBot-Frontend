import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { Ctx, StateProvider } from './src/components/StateProvider';
import LoginScreen from './src/containers/auth/LoginScreen';
import PasswordResetScreen from './src/containers/auth/PasswordResetScreen';
import SignupScreen from './src/containers/auth/SignupScreen';
import MapScreen from './src/containers/MapScreen';
import QrScreen from './src/containers/QrScreen';
import DashboardScreen from './src/containers/DashboardScreen';
import BotService from './src/services/BotService';

export type RootStackParamList = {
	Login: undefined;
	Signup: undefined;
	PasswordReset: undefined;
	Blank: undefined;
	Map: undefined;
	Qr: undefined;
	Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const prefix = Linking.makeUrl('/');

export default function App() {
	const linking = {
		prefixes: [prefix],
	};

	return (
		<StateProvider>
			<NavigationContainer linking={linking}>
				<Home />
			</NavigationContainer>
		</StateProvider>
	);
}

const Home = () => {
	const { state, dispatch } = useContext(Ctx);

	const updateBotFromDeepLink = useCallback(
		(botId: string) => {
			BotService.getOneBot(botId)
				.then((bot) => {
					dispatch({ type: 'SET_BOT', bot });
					Alert.alert(`Connected to ${bot.name}!`);
					Linking.openURL(Linking.makeUrl('Dashboard'));
				})
				.catch(() => {
					Alert.alert('Could not connect to BruinBot...');
				});
		},
		[dispatch]
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

	return (
		<Stack.Navigator headerMode="none">
			{state.user ? (
				<>
					<Stack.Screen name="Qr" component={QrScreen} />
					<Stack.Screen name="Dashboard" component={DashboardScreen} />
					<Stack.Screen name="Map" component={MapScreen} />
				</>
			) : (
				<>
					<Stack.Screen name="Qr" component={QrScreen} />
					<Stack.Screen name="Dashboard" component={DashboardScreen} />
					<Stack.Screen name="Login" component={LoginScreen} />
					<Stack.Screen name="Signup" component={SignupScreen} />
					<Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
					<Stack.Screen name="Map" component={MapScreen} />
				</>
			)}
		</Stack.Navigator>
	);
};
