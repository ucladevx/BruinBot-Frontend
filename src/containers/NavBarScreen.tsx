import { Image, StyleSheet } from 'react-native';
import React from 'react';

import Logo from '../assets/logo.png';

export const NavCenter = () => <Image style={styles.logo} source={Logo} />;

const styles = StyleSheet.create({
	logo: {
		width: 30,
		height: 30,
	},
});
