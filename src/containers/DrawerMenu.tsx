import React, { useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { RootStackParamList } from '../../App';
import DrawerMenu, { Link } from '../components/DrawerMenu';
import Ham from '../assets/greenHam.jpg';

const userLinks: Link[] = [
	{
		text: 'Scan a bot',
		route: 'Qr',
		iconName: 'md-qr-scanner',
	},
	{
		text: 'Settings',
		route: 'Map',
		iconName: 'md-settings',
	},
];

const enterpriseLinks: Link[] = [
	{
		text: 'Scan a bot',
		route: 'Qr',
		iconName: 'md-qr-scanner',
	},
	{
		text: 'Event Statistics',
		route: 'Dashboard',
		iconName: 'md-stats',
	},
	{
		text: 'Event Settings',
		route: 'Map',
		iconName: 'md-settings',
	},
];

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

	// TODO: This should check whether the user has organizer privileges and also should set some
	// context field so that the rest of our app knows which mode our user is in.

	const menuProps = {
		headerProps: enterpriseMode ? enterpriseHeader : userHeader,
		links: enterpriseMode ? enterpriseLinks : userLinks,
		toggleState: enterpriseMode,
		onToggleChange: (val: boolean) => setEnterpriseMode(val),
		navigation,
	};

	return <DrawerMenu {...menuProps} />;
};

export default Drawer;
