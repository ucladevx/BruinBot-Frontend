import React, { useState } from 'react';

import Ham from '../assets/greenHam.jpg';
import Logo from '../assets/logo.png';
import NavBar from '../components/NavBarView';

const userLinks = [
	{
		text: 'Scan a bot',
		route: 'scan',
		iconName: 'md-qr-scanner',
	},
	{
		text: 'Settings',
		route: 'settings',
		iconName: 'md-settings',
	},
];

const enterpriseLinks = [
	{
		text: 'Scan a bot',
		route: 'scan',
		iconName: 'md-qr-scanner',
	},
	{
		text: 'Event Statistics',
		route: 'stats',
		iconName: 'md-stats',
	},
	{
		text: 'Event Settings',
		route: 'settings',
		iconName: 'md-settings',
	},
];

const NavBarScreen = () => {
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
		header: enterpriseMode ? enterpriseHeader : userHeader,
		links: enterpriseMode ? enterpriseLinks : userLinks,
		toggleState: enterpriseMode,
		onToggleChange: (val: boolean) => setEnterpriseMode(val),
	};

	return <NavBar menu={menuProps} title="" logoSrc={Logo} />;
};

export default NavBarScreen;
