import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import CameraImage from '../../assets/camera.png';
import MapImage from '../../assets/map.png';
import MapScreen from '../Map/MapScreen';
import QrScreen from '../QR/QrScreen';

const BottomTab = createBottomTabNavigator();

interface IconProps {
	color: string;
}

const BottomBarNavigator = () => {
	const MapIcon = ({ color }: IconProps) => (
		<Image
			source={MapImage}
			style={{ width: 20, resizeMode: 'contain', tintColor: color }}
		/>
	);

	const CameraIcon = ({ color }: IconProps) => (
		<Image
			source={CameraImage}
			style={{ width: 20, resizeMode: 'contain', tintColor: color }}
		/>
	);

	return (
		<BottomTab.Navigator
			initialRouteName="Qr"
			tabBarOptions={{ inactiveTintColor: '#000' }}
		>
			<BottomTab.Screen
				name="Map"
				component={MapScreen}
				options={{
					tabBarIcon: MapIcon,
				}}
			/>
			<BottomTab.Screen
				name="Qr"
				component={QrScreen}
				options={{ tabBarIcon: CameraIcon }}
			/>
		</BottomTab.Navigator>
	);
};

export default BottomBarNavigator;
