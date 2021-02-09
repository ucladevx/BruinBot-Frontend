import { Alert } from 'react-native';
import { Ctx } from '../../components/StateProvider';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../../App';
import DrawerMenu, { Link } from './DrawerView';
import Ham from '../assets/greenHam.jpg';
import React, { useContext } from 'react';

interface Props {
	navigation: DrawerNavigationProp<RootStackParamList>;
}

const Drawer = ({ navigation }: Props) => {
	const {
		state: { isEnterpriseMode },
		dispatch,
	} = useContext(Ctx);

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

	const menuProps = {
		headerProps: isEnterpriseMode ? enterpriseHeader : userHeader,
		links: isEnterpriseMode ? enterpriseLinks : userLinks,
		toggleState: isEnterpriseMode,
		onToggleChange: (mode: boolean) =>
			dispatch({ type: 'SET_ENTERPRISE_MODE', isEnterpriseMode: mode }),
	};

	return <DrawerMenu {...menuProps} />;
};

export default Drawer;
