import { Image, StyleSheet } from 'react-native';
import Logo from '../assets/logo.png';
import React from 'react';

export const NavCenter = () => <Image style={styles.logo} source={Logo} />;

const styles = StyleSheet.create({
	logo: {
		width: 30,
		height: 30,
	},
});
