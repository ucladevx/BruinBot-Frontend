import React from 'react';
import { StateProvider } from './src/components/StateProvider';
import LoginScreen from './src/containers/LoginScreen';

const App = () => {
	return (
		<StateProvider>
			<LoginScreen />
		</StateProvider>
	);
};

export default App;
