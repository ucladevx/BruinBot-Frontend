import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as Linking from 'expo-linking';
import React, { useCallback, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import 'react-native-gesture-handler';

import { Ctx, StateProvider } from './src/components/StateProvider';
import AddItem from './src/containers/AddItemScreen';
import LoginScreen from './src/containers/auth/LoginScreen';
import PasswordResetScreen from './src/containers/auth/PasswordResetScreen';
import SignupScreen from './src/containers/auth/SignupScreen';
import InventoryModification from './src/containers/InventoryModification';
import MapScreen from './src/containers/MapScreen';
import QrScreen from './src/containers/QrScreen';
import DashboardScreen from './src/containers/DashboardScreen';
import CustomDrawer from './src/containers/DrawerScreen';
import { NavCenter } from './src/containers/NavBar';

import BotService from './src/services/BotService';

export type RootStackParamList = {
	Login: undefined;
	Signup: undefined;
	PasswordReset: undefined;
	Blank: undefined;
	Map: undefined;
	InventoryModification: undefined;
	AddItem: undefined;
	Qr: undefined;
	Dashboard: undefined;
};

const Stack = createDrawerNavigator<RootStackParamList>();

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

	let stack;
	if (state.user == null) {
		stack = (
			<>
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="Map" component={MapScreen} />
			</>
		);
	} else {
		// TODO: Change this to be something the user can toggle
		stack = state.user.isOrganizer ? (
			<>
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="Map" component={MapScreen} />
				<Stack.Screen
					name="InventoryModification"
					component={InventoryModification}
				/>
				<Stack.Screen name="AddItem" component={AddItem} />
			</>
		) : (
			<>
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="Map" component={MapScreen} />
			</>
		);
	}

	return (
		// TODO: fix `any`
		<Stack.Navigator
			drawerContent={(props: any) => <CustomDrawer {...props} />}
			screenOptions={{
				headerShown: true,
				headerTitle: NavCenter,
				headerTintColor: '#000',
			}}
		>
			{stack}
		</Stack.Navigator>
	);
};
