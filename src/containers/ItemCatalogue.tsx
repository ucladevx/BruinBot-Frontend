import Constants from 'expo-constants';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import bobaIcon from '../assets/bobaIcon.jpg';

const data: {
  name: string;
  price: string;
  deliveryTime: number;
  image: string;
  key: number;
}[] = [];
for (let i = 0; i < 25; i++) {
	data.push({
		name: 'Green Boba Tea',
		price: '5.99',
		deliveryTime: 10,
		image: '../assets/bobaIcon.jpg',
		key: i,
	});
}

export default class ItemCatalogue extends React.Component {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.header}>Menu</Text>
				<View></View>
				<ScrollView>
					{data.map((item) => {
						return (
							<View key={item.key} style={styles.item}>
								<Image
									source={bobaIcon}
									style={styles.image}
								/>
								<View style={styles.itemTitle}>
									<Text style={styles.itemName}>{item.name}</Text>
									<Text style={styles.itemDeliveryTime}>
										{item.deliveryTime} min
									</Text>
								</View>
								<View style={styles.priceContainer}>
									<Text style={styles.itemPrice}>${item.price}</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		marginLeft: 20,
		marginRight: 20,
	},
	header: {
		fontSize: 30,
		fontWeight: 'bold',
		marginLeft: '5%',
		marginTop: '3%',
	},
	item: {
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 5,
		flexDirection: 'row',
		padding: '5%',
		marginTop: '3%',
		alignItems: 'center',
	},
	image: {
		borderRadius: 3,
		height: '140%',
		width: '10%',
		paddingLeft: '15%',
	},
	itemTitle: {
		flexDirection: 'column',
		flex: 2,
		paddingLeft: '5%',
	},
	itemName: {
		fontWeight: 'bold',
		fontSize: 16,
	},
	itemDeliveryTime: {
		color: 'gray',
	},
	itemPrice: {
		color: 'black',
		fontSize: 16,
	},
	priceContainer: {
		flex: 1,
		alignItems: 'flex-end',
	},
});
