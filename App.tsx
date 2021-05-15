import 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
	HindVadodara_300Light,
	HindVadodara_400Regular,
	HindVadodara_500Medium,
	HindVadodara_600SemiBold,
	HindVadodara_700Bold,
	useFonts,
} from '@expo-google-fonts/hind-vadodara';
import { StatusBar } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useContext } from 'react';

import { Bot } from './src/types/apiTypes';
import { Ctx, StateProvider } from './src/components/StateProvider';
import { HeaderButton, HelpButton } from './src/containers/Navbar/NavBarScreen';
import { MarkerData } from './src/containers/Map/mapTypes';
import AddItem from './src/containers/InventoryModification/AddItemScreen';
import BottomBar from './src/containers/Navbar/BottomBarNavigator';
import CustomDrawer from './src/containers/Navbar/DrawerScreen';
import DashboardScreen from './src/containers/DashboardScreen';
import EmailList from './src/containers/ItemCatalogue/EmailList';
import InventoryModification from './src/containers/InventoryModification/InventoryModification';
import ItemCatalogue from './src/containers/ItemCatalogue/ItemCatalogue';
import ItemWeight from './src/containers/InventoryModification/ItemWeightScreen';
import Loading from './src/components/Loading';
import LoginScreen from './src/containers/Auth/LoginScreen';
import PasswordResetScreen from './src/containers/Auth/PasswordResetScreen';
import PaymentInfo from './src/containers/ItemCatalogue/PaymentInfo';
import PaymentSuccess from './src/containers/ItemCatalogue/PaymentSuccessScreen';
import QrScreen from './src/containers/QR/QrScreen';
import SelectMarkerScreen from './src/containers/Map/SelectMarkerScreen';
import SignupScreen from './src/containers/Auth/SignupScreen';

export type RootStackParamList = {
	Login: undefined;
	Signup: undefined;
	PasswordReset: undefined;
	Blank: undefined;
	BottomBar: undefined;
	SelectMarker: { markers: MarkerData[]; selectedId: Bot['_id'] | null };
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
	EmailList: undefined;
	Dashboard: { bot: Bot };
	PaymentSuccess: { success: boolean };
	Settings: undefined;
};

const Stack = createDrawerNavigator<RootStackParamList>();

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'rgb(255, 255, 255)',
	},
};

export default function App() {
	let [loaded] = useFonts({
		HindVadodara_300Light,
		HindVadodara_400Regular,
		HindVadodara_500Medium,
		HindVadodara_600SemiBold,
		HindVadodara_700Bold,
	});

	if (!loaded) {
		return <Loading loadingText="Loading..." />;
	}

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
				<Stack.Screen name="ItemCatalogue" component={ItemCatalogue} />
				<Stack.Screen name="PaymentInfo" component={PaymentInfo} />
				<Stack.Screen name="EmailList" component={EmailList} />
				<Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
			</>
		);
	} else {
		// If the user's "eventId" is empty or null, then they are an organizer
		// TODO: Change this to be something the user can toggle
		stack = state.isEnterpriseMode ? (
			<>
				<Stack.Screen
					name="BottomBar"
					component={BottomBar}
					options={{
						unmountOnBlur: true,
					}}
				/>
				<Stack.Screen name="ItemCatalogue" component={ItemCatalogue} />
				<Stack.Screen name="SelectMarker" component={SelectMarkerScreen} />
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
				<Stack.Screen
					name="BottomBar"
					component={BottomBar}
					options={{
						unmountOnBlur: true,
					}}
				/>
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
					// avoid missing displayName warning
					const HeaderLeft = () => (
						<HeaderButton navigation={navigation} screen={route.name} />
					);
					const HeaderRight = () => <HelpButton />;
					return {
						headerShown: true,
						headerLeft: HeaderLeft,
						headerRight: HeaderRight,
						headerTitle: '',
						headerTintColor: '#000',
						headerStyle: {
							position: 'absolute',
							left: 0,
							right: 0,
							backgroundColor: 'transparent',
							elevation: 0, // remove shadow on Android
							shadowOpacity: 0, // remove shadow on iOS
							borderBottomWidth: 0,
							zIndex: 100,
						},
					};
				}}
			>
				{stack}
			</Stack.Navigator>
		</>
	);
};
