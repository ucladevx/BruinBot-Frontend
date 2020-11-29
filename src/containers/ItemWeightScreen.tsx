import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Axios from 'axios';

interface ItemWeightProps {
	id: string;
}

// TODO: Change to not be hardcoded URL after production
const baseUrl = 'http://10.0.0.131:5000';

// mocks getting the weight from the scale inside the bot
const getWeight = () => {
	return 10.0;
};

const ItemWeight = ({ id }: ItemWeightProps) => {
	const [weight, setWeight] = useState(0);
	const [itemDetected, setItemDetected] = useState(false);
	const [itemMeasured, setItemMeasured] = useState(false);
	const [itemSubmitted, setItemSubmitted] = useState(false);
	const submitWeight = async () => {
		await Axios.put(baseUrl + '/items/weight', {
			itemId: '5fbb368f9c73306115adb26f',
			weight: weight.toFixed(1),
		})
			.then(() => {
				setItemSubmitted(true);
				// TODO: Navigate back to items view
				//setTimeout(5000);
			})
			.catch((err) => {
				console.log(err);
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
			{!itemDetected && !itemMeasured && !itemSubmitted ? (
				<Text style={styles.itemText}>
					Please place the item into the BruinBot for weighing
				</Text>
			) : (
				<View></View>
			)}
			{itemDetected && !itemMeasured ? (
				<View style={styles.textContainer}>
					<Text style={styles.itemText}>
						Item Detected {'\n'} Measuring Weight...
					</Text>
					<ActivityIndicator size="large" />
				</View>
			) : (
				<View></View>
			)}
			{itemMeasured && !itemSubmitted ? (
				<View style={styles.textContainer}>
					<Text style={styles.itemText}>
						Item Weight: {weight} lbs {'\n'} Submitting...
					</Text>
					<ActivityIndicator size="large" />
				</View>
			) : (
				<View></View>
			)}
			{itemSubmitted ? (
				<View style={styles.textContainer}>
					<Text style={styles.itemText}>
						Item weight set successfully {'\n'} Redirecting...
					</Text>
					<ActivityIndicator size="large" />
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
	textContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 30,
		marginBottom: 15,
	},
});

export default ItemWeight;
