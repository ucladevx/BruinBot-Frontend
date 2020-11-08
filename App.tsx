import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import { StateProvider } from './src/components/StateProvider';
import BlankScreen from './src/containers/BlankScreen';
import LoginScreen from './src/containers/LoginScreen';
import MapScreen from './src/containers/MapScreen';

const Stack = createStackNavigator();
const App = () => {
  return (
    <StateProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName="Map">
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Blank" component={BlankScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StateProvider>
  );
};

export default App;
