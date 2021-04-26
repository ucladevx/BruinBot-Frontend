import { Alert } from 'react-native';
import { Ctx } from '../../components/StateProvider';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../../App';
import DrawerMenu, { Link } from './DrawerView';
import Ham from '../../assets/greenHam.jpg';
import React, { useContext } from 'react';

interface Props {
	navigation: DrawerNavigationProp<RootStackParamList>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Drawer = ({ navigation }: Props) => {
	const { state, dispatch } = useContext(Ctx);

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
			text: 'Settings',
			route: 'Settings',
			iconName: 'md-settings',
			onPress: () => {
				Alert.alert('Event settings page in development');
			},
		},
		state.user
			? {
					text: 'Log Out',
					route: 'Login',
					iconName: 'md-contact',
					onPress: () =>
						state.firebase
							.auth()
							.signOut()
							.then(() => {
								dispatch({
									type: 'SET_USER',
									user: null,
								});
							}),
			  }
			: {
					text: 'Log In',
					route: 'Login',
					iconName: 'md-contact',
					onPress: () => {
						navigation.navigate('Login');
					},
			  },
	];

	/* when in enterprise mode, user will already have been logged in since enterprise mode is only available if the user is an enterprise user, which is why there is only a sign out */
	const enterpriseLinks: Link[] = [
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
		{
			text: 'Log Out',
			route: 'Login',
			iconName: 'md-contact',
			onPress: () =>
				state.firebase
					.auth()
					.signOut()
					.then(() => {
						dispatch({
							type: 'SET_ENTERPRISE_MODE',
							isEnterpriseMode: false,
						});
						dispatch({
							type: 'SET_USER',
							user: null,
						});
					}),
		},
	];

	const menuProps = {
		headerProps: state.isEnterpriseMode ? enterpriseHeader : userHeader,
		links: state.isEnterpriseMode ? enterpriseLinks : userLinks,
		toggleState: state.isEnterpriseMode,
		onToggleChange: (mode: boolean) =>
			dispatch({ type: 'SET_ENTERPRISE_MODE', isEnterpriseMode: mode }),
	};

	return <DrawerMenu {...menuProps} />;
};

export default Drawer;
