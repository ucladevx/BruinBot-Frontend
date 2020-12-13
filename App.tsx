import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect } from 'react';
import 'react-native-gesture-handler';
import * as Linking from 'expo-linking';

import { Ctx, StateProvider } from './src/components/StateProvider';
import LoginScreen from './src/containers/auth/LoginScreen';
import PasswordResetScreen from './src/containers/auth/PasswordResetScreen';
import SignupScreen from './src/containers/auth/SignupScreen';
import MapScreen from './src/containers/MapScreen';
import InventoryModification from './src/containers/InventoryModification';
import AddItem from './src/containers/AddItemScreen';
import QrScreen from './src/containers/QrScreen';
import NavMenuScreen from './src/containers/NavMenuScreen';

export type RootStackParamList = {
	Login: undefined;
	Signup: undefined;
	PasswordReset: undefined;
	Blank: undefined;
	Map: undefined;
	InventoryModification: undefined;
	AddItem: undefined;
	Qr: undefined;
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
		(botid: any) => {
			if (state.bot && botid === state.bot._id) {
				return;
			}
			// Dispatch with placeholder bot
			dispatch({ type: 'SET_BOT', bot: { _id: botid } });
			// Change it to inventory view if user not logged in
			Linking.openURL(Linking.makeUrl('Map'));
		},
		[dispatch, state.bot]
	);

	useEffect(() => {
		Linking.parseInitialURLAsync().then(({ path: _path, queryParams }) => {
			if (queryParams && queryParams.botid) {
				updateBotFromDeepLink(queryParams.botid);
			}
		});
	}, [updateBotFromDeepLink]);

	Linking.addEventListener('url', ({ url }) => {
		if (url) {
			const { queryParams } = Linking.parse(url);
			if (queryParams && queryParams.botid) {
				updateBotFromDeepLink(queryParams.botid);
			}
		}
	});

	return (
		<>
			<NavMenuScreen />
			<Stack.Navigator headerMode="none">
				{state.user ? (
					<>
						<Stack.Screen
							name="InventoryModification"
							component={InventoryModification}
						/>
						<Stack.Screen name="AddItem" component={AddItem} />
						<Stack.Screen name="Qr" component={QrScreen} />
						<Stack.Screen name="Map" component={MapScreen} />
					</>
				) : (
					<>
						<Stack.Screen name="Qr" component={QrScreen} />
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Signup" component={SignupScreen} />
						<Stack.Screen
							name="PasswordReset"
							component={PasswordResetScreen}
						/>
						<Stack.Screen name="Map" component={MapScreen} />
					</>
				)}
			</Stack.Navigator>
		</>
	);
};
