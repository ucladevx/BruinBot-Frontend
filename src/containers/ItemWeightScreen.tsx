import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import Loading from '../components/Loading';

interface ItemWeightProps {
	navigation: StackNavigationProp<RootStackParamList, 'ItemWeight'>;
	route: RouteProp<RootStackParamList, 'ItemWeight'>;
}

// mocks getting the weight from the scale inside the bot
const getWeight = () => {
	return 10.0;
};

const ItemWeight = ({ navigation, route }: ItemWeightProps) => {
	console.log(route.params.itemId);
	const [weight, setWeight] = useState(0);
	const [itemDetected, setItemDetected] = useState(false);
	const [itemMeasured, setItemMeasured] = useState(false);
	const [itemSubmitted, setItemSubmitted] = useState(false);
	const submitWeight = async () => {
		setItemSubmitted(true);
		navigation.navigate('InventoryModification');

		// TODO: Was having trouble with this, fix later
		// await axios
		// 	.put(baseUrl + '/items/weight', {
		// 		itemId: route.params.itemId,
		// 		weight: weight.toFixed(1),
		// 	})
		// 	.then(() => {
		// 		setItemSubmitted(true);
		// 		navigation.navigate('InventoryModification');
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 		Alert.alert('There was an error');
		// 		navigation.navigate('InventoryModification');
		// 	});
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
					<Text style={styles.itemText}>Item Detected</Text>
					<Loading loadingText={'Measuring Weight'} />
				</View>
			) : (
				<View></View>
			)}
			{itemMeasured && !itemSubmitted ? (
				<View style={styles.textContainer}>
					<Text style={styles.itemText}>Item Weight: {weight} lbs</Text>
					<Loading loadingText={'Submitting'} />
				</View>
			) : (
				<View></View>
			)}
			{itemSubmitted ? (
				<View style={styles.textContainer}>
					<Text style={styles.itemText}>Item weight set successfully</Text>
					<Loading loadingText={'Redirecting'} />
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
