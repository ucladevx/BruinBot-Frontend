import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { RootStackParamList } from '../../../App';
import Back from '../../assets/back.png';
import Help from '../../assets/help.png';
import Logo from '../../assets/logo.png';
import Menu from '../../assets/menu.png';
import React from 'react';

export const NavCenter = () => <Image style={styles.logo} source={Logo} />;

interface Props {
	navigation: DrawerNavigationProp<RootStackParamList>;
	screen: string;
}

interface ButtonConfig {
	action(): void;
	icon: ImageSourcePropType;
}

export const HelpButton = () => {
	const pressHandler = () => {};

	return (
		<TouchableOpacity onPress={pressHandler} style={styles.buttonContainer}>
			<Image source={Help} style={{ height: 18 }} resizeMode="contain" />
		</TouchableOpacity>
	);
};

export const HeaderButton = ({ navigation, screen }: Props) => {
	const defaultConfig: ButtonConfig = {
		action: () => {
			if (navigation.canGoBack()) {
				navigation.goBack();
			}
		},
		icon: Back,
	};

	const customConfig: { [screen: string]: ButtonConfig } = {
		Qr: {
			action: () => navigation.openDrawer(),
			icon: Menu,
		},
		BottomBar: {
			// when signed in, BottomBar holds Map and Qr
			action: () => navigation.openDrawer(),
			icon: Menu,
		},
		SelectMarker: {
			action: () =>
				// @ts-ignore
				// Navigating inside a nested navigator gives an tsc error.
				navigation.navigate('BottomBar', {
					screen: 'Map', // go to Map from SelectMarker
				}),
			icon: Back,
		},
		Dashboard: {
			action: () =>
				// @ts-ignore
				// Navigating inside a nested navigator gives an tsc error.
				navigation.navigate('BottomBar', {
					screen: 'Qr', // go to Qr from Dashboard
				}),
			icon: Back,
		},
	};

	const pressHandler = () => {
		if (customConfig[screen]) {
			customConfig[screen].action();
		} else {
			defaultConfig.action();
		}
	};

	return (
		<TouchableOpacity onPress={pressHandler} style={styles.buttonContainer}>
			<Image
				source={customConfig[screen]?.icon || defaultConfig.icon}
				style={{ width: 18 }}
				resizeMode="contain"
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	logo: {
		width: 30,
		height: 30,
	},
	buttonContainer: {
		marginTop: 26,
		marginHorizontal: 17.5,
		height: 36,
		width: 36,
		borderRadius: 36,
		backgroundColor: '#fff',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 1,
		shadowColor: '#000',
		shadowOpacity: 0.3,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
