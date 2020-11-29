import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, Image } from 'react-native';
import Axios from 'axios';
import Constants from 'expo-constants';
import loading from '../assets/loading.gif';

interface ItemWeightProps {
	id: string;
}

// TODO: Change to not be hardcoded URL after production
const baseUrl = 'http://localhost:5000';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// mocks getting the weight from the scale inside the bot
const getWeight = () => {
	return 10.0;
};

const ItemWeight = ({ id }: ItemWeightProps) => {
	const [weight, setWeight] = useState(0);
	const [itemDetected, setItemDetected] = useState(false);
	const [itemMeasured, setItemMeasured] = useState(false);
	const submitWeight = async () => {
		await Axios.put(baseUrl + '/items/weight', {
			itemId: id,
			weight: weight.toFixed(1),
		})
			.then(() => {
				Alert.alert('Item weight set successfully\nRedirecting...');
				// TODO: Navigate back to items view
				//setTimeout(5000);
			})
			.catch(() => {
				Alert.alert('An error has occurred. Please try again.');
			});
	};
	const calculateWeight = () => {
		var start = Date.now();
		var weightInterval = setInterval(() => {
			if (Date.now() - start > 10000) {
				clearInterval(weightInterval);
				return;
			}
			setWeight(getWeight());
		}, 100);
		setTimeout(() => {
			setItemDetected(false);
			setItemMeasured(true);
			setTimeout(() => submitWeight(), 3000);
		}, 10000);
	};
	useEffect(() => {
		// setTimeout simulates an item being placed inside the bot after 3 seconds
		if (!itemMeasured) {
			setTimeout(() => {
				setItemDetected(true);
				calculateWeight();
			}, 3000);
		}
	});

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>
				Please place the item into the BruinBot for weighing
			</Text>
			{itemDetected && !itemMeasured ? (
				<View>
					<Text style={styles.itemDetectedText}>
						Item Detected {'\n'} Measuring Weight...
					</Text>
					<Image source={loading} />
				</View>
			) : (
				<View></View>
			)}
			{itemMeasured ? (
				<View>
					<Text style={styles.itemMeasuredText}>
						Item Weight: {weight} lbs {'\n'} Submitting...
					</Text>
				</View>
			) : (
				<View></View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingLeft: '3%',
		paddingRight: '3%',
		flexDirection: 'column',
		height: '100%',
		alignItems: 'center',
		backgroundColor: 'white',
		justifyContent: 'center',
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 35,
		textAlign: 'center',
		marginBottom: screenHeight * 0.1,
	},
	itemDetectedText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 30,
	},
	itemMeasuredText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 30,
	},
});

export default ItemWeight;
