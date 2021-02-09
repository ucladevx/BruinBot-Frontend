import 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useContext } from 'react';

import { Bot } from './src/types/apiTypes';
import { Ctx, StateProvider } from './src/components/StateProvider';
import { HeaderButton, NavCenter } from './src/containers/Navbar/NavBarScreen';
import AddItem from './src/containers/InventoryModification/AddItemScreen';
import CustomDrawer from './src/containers/Navbar/DrawerScreen';
import DashboardScreen from './src/containers/DashboardScreen';
import InventoryModification from './src/containers/InventoryModification/InventoryModification';
import ItemCatalogue from './src/containers/ItemCatalogue/ItemCatalogue';
import ItemWeight from './src/containers/InventoryModification/ItemWeightScreen';
import LoginScreen from './src/containers/Auth/LoginScreen';
import MapScreen from './src/containers/Map/MapScreen';
import PasswordResetScreen from './src/containers/Auth/PasswordResetScreen';
import PaymentInfo from './src/containers/ItemCatalogue/PaymentInfo';
import PaymentSuccess from './src/containers/ItemCatalogue/PaymentSuccessScreen';
import QrScreen from './src/containers/QR/QrScreen';
import SignupScreen from './src/containers/Auth/SignupScreen';

export type RootStackParamList = {
	Login: undefined;
	Signup: undefined;
	PasswordReset: undefined;
	Blank: undefined;
	Map: undefined;
	InventoryModification: { bot: Bot };
	AddItem: { bot: Bot };
	ItemWeight: {
		itemId: string;
		bot: Bot;
	};
	Qr: undefined;
	ItemCatalogue: { bot: Bot };
	PaymentInfo: {
		bot: Bot;
		itemId: string;
		quantity: number;
		amount: number;
	};
	Dashboard: { bot: Bot };
	PaymentSuccess: { success: boolean };
	Settings: undefined;
};

const Stack = createDrawerNavigator<RootStackParamList>();

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'rgb(250, 250, 250)',
	},
};

export default function App() {
	return (
		<StateProvider>
			<NavigationContainer theme={theme}>
				<Home />
			</NavigationContainer>
		</StateProvider>
	);
}

const Home = () => {
	const { state } = useContext(Ctx);

	let stack;
	if (state.user == null) {
		stack = (
			<>
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen
					name="Map"
					component={MapScreen}
					options={{ unmountOnBlur: true }}
				/>
				<Stack.Screen name="ItemCatalogue" component={ItemCatalogue} />
				<Stack.Screen name="PaymentInfo" component={PaymentInfo} />
				<Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
			</>
		);
	} else {
		// If the user's "eventId" is empty or null, then they are an organizer
		// TODO: Change this to be something the user can toggle
		stack = state.isEnterpriseMode ? (
			<>
				<Stack.Screen
					name="Map"
					component={MapScreen}
					options={{ unmountOnBlur: true }}
				/>
				<Stack.Screen name="ItemCatalogue" component={ItemCatalogue} />
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="AddItem" component={AddItem} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen
					name="InventoryModification"
					component={InventoryModification}
				/>
				<Stack.Screen name="ItemWeight" component={ItemWeight}></Stack.Screen>
			</>
		) : (
			<>
				<Stack.Screen name="Qr" component={QrScreen} />
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
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
				screenOptions={({ route, navigation }) => {
					const HeaderLeft = () => (
						// avoid missing displayName warning
						<HeaderButton navigation={navigation} screen={route.name} />
					);
					return {
						headerShown: true,
						headerLeft: HeaderLeft,
						headerTitle: NavCenter,
						headerTintColor: '#000',
					};
				}}
			>
				{stack}
			</Stack.Navigator>
		</>
	);
};
