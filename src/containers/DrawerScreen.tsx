import { DrawerNavigationProp } from '@react-navigation/drawer';
import React, { useState } from 'react';

import { Alert } from 'react-native';
import { RootStackParamList } from '../../App';
import DrawerMenu, { Link } from '../components/DrawerView';
import Ham from '../assets/greenHam.jpg';

interface Props {
	navigation: DrawerNavigationProp<RootStackParamList>;
}

const Drawer = ({ navigation }: Props) => {
	const [enterpriseMode, setEnterpriseMode] = useState(true);

	const userHeader = {
		// TODO: get text programatically
		title: 'Bender',
		subtitles: ["I'll make my own BruinBot"],
		imgSrc: Ham,
	};

	const enterpriseHeader = {
		// TODO: get text programatically
		title: 'Bear Gathering',
		subtitles: ['25 items sold', '$350.00 sales'],
		imgSrc: Ham,
	};

	const userLinks: Link[] = [
		{
			text: 'Scan a bot',
			route: 'Qr',
			iconName: 'md-qr-scanner',
			onPress: () => {
				navigation.navigate('Qr');
			},
		},
		{
			text: 'Settings',
			route: 'Settings',
			iconName: 'md-settings',
			onPress: () => {
				Alert.alert('Event settings page in development');
			},
		},
	];

	const enterpriseLinks: Link[] = [
		{
			text: 'Scan a bot',
			route: 'Qr',
			iconName: 'md-qr-scanner',
			onPress: () => {
				navigation.navigate('Qr');
			},
		},
		{
			text: 'Bruinbot Map',
			route: 'Map',
			iconName: 'md-map',
			onPress: () => {
				navigation.navigate('Map');
			},
		},
		{
			text: 'Event Statistics',
			route: 'Dashboard',
			iconName: 'md-stats',
			onPress: () => {
				Alert.alert('Event stats page in development');
			},
		},
		{
			text: 'Event Settings',
			route: 'Settings',
			iconName: 'md-settings',
			onPress: () => {
				Alert.alert('Event settings page in development');
			},
		},
	];

	// TODO: This should check whether the user has organizer privileges and also should set some
	// context field so that the rest of our app knows which mode our user is in.

	const menuProps = {
		headerProps: enterpriseMode ? enterpriseHeader : userHeader,
		links: enterpriseMode ? enterpriseLinks : userLinks,
		toggleState: enterpriseMode,
		onToggleChange: (val: boolean) => setEnterpriseMode(val),
	};

	return <DrawerMenu {...menuProps} />;
};

export default Drawer;
