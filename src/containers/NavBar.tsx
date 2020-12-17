import React from 'react';
import { Image, StyleSheet } from 'react-native';

import Logo from '../assets/logo.png';

export const NavCenter = () => <Image style={styles.logo} source={Logo} />;

const styles = StyleSheet.create({
	logo: {
		width: 30,
		height: 30,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#ddd',
		marginRight: 5,
	},
});
