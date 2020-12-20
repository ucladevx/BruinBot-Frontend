import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React, { useCallback, useContext, useEffect } from 'react';
import { Alert, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { Ctx, StateProvider } from './src/components/StateProvider';
import AddItem from './src/containers/AddItemScreen';
import LoginScreen from './src/containers/auth/LoginScreen';
import PasswordResetScreen from './src/containers/auth/PasswordResetScreen';
import SignupScreen from './src/containers/auth/SignupScreen';
import DashboardScreen from './src/containers/DashboardScreen';
import CustomDrawer from './src/containers/DrawerScreen';
import InventoryModification from './src/containers/InventoryModification';
import ItemWeight from './src/containers/ItemWeightScreen';
import MapScreen from './src/containers/MapScreen';
import { NavCenter } from './src/containers/NavBarScreen';
import PaymentInfo from './src/containers/PaymentInfo';
import PaymentSuccess from './src/containers/PaymentSuccessScreen';
import QrScreen from './src/containers/QrScreen';
import BotService from './src/services/BotService';

export type RootStackParamList = {
	Login: undefined;
	Signup: undefined;
	PasswordReset: undefined;
	Blank: undefined;
	Map: undefined;
	InventoryModification: undefined;
	AddItem: undefined;
	ItemWeight: { itemId: string };
	Qr: undefined;
	Dashboard: undefined;
	PaymentInfo: undefined;
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
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="Map" component={MapScreen} />
				<Stack.Screen name="PaymentInfo" component={PaymentInfo} />
				<Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
			</>
		);
	} else {
		// TODO: Change this to be something the user can toggle
		stack = state.user.isOrganizer ? (
			<>
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="AddItem" component={AddItem} />
				<Stack.Screen name="ItemWeight" component={ItemWeight} />
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
