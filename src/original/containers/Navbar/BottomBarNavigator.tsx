import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { MarkerData } from '../Map/mapTypes';
import CameraImage from '../../assets/camera.png';
import MapImage from '../../assets/map.png';
import MapScreen from '../Map/MapScreen';
import QrScreen from '../QR/QrScreen';

export type RootStackParamList = {
	Map: { botSelected?: MarkerData };
	Qr: undefined;
};

const BottomTab = createBottomTabNavigator<RootStackParamList>();

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
			initialRouteName="Map" // default to Map
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
