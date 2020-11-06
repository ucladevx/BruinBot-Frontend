import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import 'react-native-gesture-handler';
import { Ctx, StateProvider } from './src/components/StateProvider';
import LoginScreen from './src/containers/auth/LoginScreen';
import SignupScreen from './src/containers/auth/SignupScreen';
import BlankScreen from './src/containers/BlankScreen';

export type RootStackParamList = {
	Login: undefined;
	Signup: undefined;
	Blank: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<StateProvider>
			<NavigationContainer>
				<Home />
			</NavigationContainer>
		</StateProvider>
	);
}

const Home = () => {
	const { state } = useContext(Ctx);
	return (
		<Stack.Navigator headerMode="none">
			{state.user ? (
				<Stack.Screen name="Blank" component={BlankScreen} />
			) : (
				<>
					<Stack.Screen name="Login" component={LoginScreen} />
					<Stack.Screen name="Signup" component={SignupScreen} />
				</>
			)}
		</Stack.Navigator>
	);
};
