import React, { useState, FC } from 'react';
import { Image, StyleSheet } from 'react-native';

import Ham from '../assets/greenHam.jpg';
import Logo from '../assets/logo.png';
import NavBar from '../components/NavBar';
import Menu from '../components/HamMenu';

const userLinks = [
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

const enterpriseLinks = [
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

	return <NavBar menu={menuProps} title="BruinBot" logoSrc={Logo} />;
};

// TODO: fix `any` types
export const withNavBar = (BaseComponent: FC<any>) => {
	const wrappedComponent = (baseProps: any) => {
		return (
			<>
				<NavBarScreen />
				<BaseComponent {...baseProps} />
			</>
		);
	};
	return wrappedComponent;
};

export default NavBarScreen;

export const NavCenter = () => (
	<Image style={imageStyles.navImage} source={Logo} />
);

const imageStyles = StyleSheet.create({
	navImage: {
		width: 30,
		height: 30,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#ddd',
		marginRight: 5,
	},
	headerImage: {
		width: 100,
		height: 100,
		marginRight: 15,
		borderRadius: 5,
	},
});
