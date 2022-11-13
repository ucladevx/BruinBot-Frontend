import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import robotLoading from '../assets/robotLoading.gif';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface loadingProps {
	loadingText: string;
}

const Loading = ({ loadingText }: loadingProps) => {
	const [animation] = useState(new Animated.Value(1));

	useEffect(() => {
		setInterval(() => {
			Animated.timing(animation, {
				toValue: 0.05,
				duration: 3000,
				useNativeDriver: true,
			}).start(() => {
				Animated.timing(animation, {
					toValue: 1,
					duration: 3000,
					useNativeDriver: true,
				}).start();
			});
		}, 6000);

		return () => {
			animation.stopAnimation();
		};
	});

	return (
		<View style={styles.loadingBackground}>
			<Image source={robotLoading} style={styles.gif} />
			<Animated.Text style={[styles.text, { opacity: animation }]}>
				{loadingText}...
			</Animated.Text>
		</View>
	);
};

const styles = StyleSheet.create({
	loadingBackground: {
		alignItems: 'center',
		flexDirection: 'column',
		borderRadius: 10,
		width: screenHeight * 0.3,
		height: screenHeight * 0.3,
	},
	gif: {
		borderRadius: 10,
		aspectRatio: 1,
		width: screenWidth * 0.5,
		height: undefined,
	},
	text: {
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
	},
});

export default Loading;
