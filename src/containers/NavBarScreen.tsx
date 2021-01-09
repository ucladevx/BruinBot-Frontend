import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../App';
import Logo from '../assets/logo.png';
import React from 'react';

export const NavCenter = () => <Image style={styles.logo} source={Logo} />;

interface Props {
	navigation: DrawerNavigationProp<RootStackParamList>;
	screen: string;
}

interface ButtonConfig {
	action(): void;
	icon: string;
}

export const HeaderButton = ({ navigation, screen }: Props) => {
	const defaultConfig: ButtonConfig = {
		action: () => {
			if (navigation.canGoBack()) {
				navigation.goBack();
			}
		},
		icon: 'ios-arrow-back',
	};

	const customConfig: { [screen: string]: ButtonConfig } = {
		Map: {
			action: () => navigation.openDrawer(),
			icon: 'ios-menu',
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
		<TouchableOpacity onPress={pressHandler}>
			<Icon
				style={styles.buttonIcon}
				type="ionicon"
				name={customConfig[screen]?.icon || defaultConfig.icon}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	logo: {
		width: 30,
		height: 30,
	},
	buttonIcon: {
		marginLeft: 20,
	},
});
