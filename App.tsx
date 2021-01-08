import 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { Alert, StatusBar } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useCallback, useContext, useEffect } from 'react';

import { Ctx, StateProvider } from './src/components/StateProvider';
import { NavCenter } from './src/containers/NavBarScreen';
import AddItem from './src/containers/AddItemScreen';
import CustomDrawer from './src/containers/DrawerScreen';
import DashboardScreen from './src/containers/DashboardScreen';
import InventoryModification from './src/containers/InventoryModification';
import LoginScreen from './src/containers/auth/LoginScreen';
import MapScreen from './src/containers/MapScreen';
import PasswordResetScreen from './src/containers/auth/PasswordResetScreen';
import QrScreen from './src/containers/QrScreen';
import SignupScreen from './src/containers/auth/SignupScreen';

import BotService from './src/services/BotService';
import PaymentInfo from './src/containers/PaymentInfo';
import PaymentSuccess from './src/containers/PaymentSuccessScreen';
import ItemCatalogue from './src/containers/ItemCatalogue';

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
	ItemCatalogue: undefined;
	PaymentInfo: {
		itemId: string;
		quantity: number;
		amount: number;
	};
	PaymentSuccess: { success: boolean };
};

const Stack = createDrawerNavigator<RootStackParamList>();

const prefix = Linking.makeUrl('/');

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'rgb(250, 250, 250)',
	},
};

export default function App() {
	const linking = {
		prefixes: [prefix],
	};

	return (
		<StateProvider>
			<NavigationContainer linking={linking} theme={theme}>
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
				<Stack.Screen name="Qr" component={ItemCatalogue} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="Map" component={MapScreen} />
				<Stack.Screen name="ItemCatalogue" component={ItemCatalogue} />
				<Stack.Screen name="PaymentInfo" component={PaymentInfo} />
				<Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
			</>
		);
	} else {
		// TODO: Change this to be something the user can toggle
		stack = state.user.isOrganizer ? (
			<>
				<Stack.Screen name="ItemCatalogue" component={ItemCatalogue} />
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="AddItem" component={AddItem} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="Map" component={MapScreen} />
				<Stack.Screen
					name="InventoryModification"
					component={InventoryModification}
				/>
			</>
		) : (
			<>
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="Map" component={MapScreen} />
				<Stack.Screen name="ItemCatalogue" component={ItemCatalogue} />
				<Stack.Screen name="PaymentInfo" component={PaymentInfo} />
				<Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
			</>
		);
	}

	return (
		// TODO: fix `any` in drawerContent props
		<>
			<StatusBar barStyle="dark-content" />
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
		</>
	);
};
