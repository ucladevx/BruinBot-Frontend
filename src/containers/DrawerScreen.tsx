import React, { useState, useContext } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { RootStackParamList } from '../../App';
import DrawerMenu, { Link } from '../components/DrawerView';
import Ham from '../assets/greenHam.jpg';
import { Ctx } from '../components/StateProvider';

interface Props {
	navigation: DrawerNavigationProp<RootStackParamList>;
}

const Drawer = ({ navigation }: Props) => {
	const { dispatch } = useContext(Ctx);
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
				dispatch({ type: 'SET_BOT', bot: null });
				navigation.navigate('Qr');
			},
		},
		{
			text: 'Settings',
			route: 'Map',
			iconName: 'md-settings',
			onPress: () => {
				navigation.navigate('Map');
			},
		},
	];

	const enterpriseLinks: Link[] = [
		{
			text: 'Scan a bot',
			route: 'Qr',
			iconName: 'md-qr-scanner',
			onPress: () => {
				dispatch({ type: 'SET_BOT', bot: null });
				navigation.navigate('Qr');
			},
		},
		{
			text: 'Event Statistics',
			route: 'Dashboard',
			iconName: 'md-stats',
			onPress: () => {
				navigation.navigate('Dashboard');
			},
		},
		{
			text: 'Event Settings',
			route: 'Map',
			iconName: 'md-settings',
			onPress: () => {
				navigation.navigate('Map');
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
