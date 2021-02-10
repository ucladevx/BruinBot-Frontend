import { Bot } from '../../types/apiTypes';
import { Button } from 'react-native-elements';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ItemProps, MapMenuProps } from '../../types/inventoryTypes';
import { RootStackParamList } from '../../../App';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Crane from '../../assets/crane.png';
import MapMenu from '../Map/MapMenuView';
import React from 'react';

const screenWidth = Dimensions.get('window').width;

interface InventoryModificationProps {
	navigation: StackNavigationProp<RootStackParamList, 'InventoryModification'>;
	route: RouteProp<RootStackParamList, 'InventoryModification'>;
}
const InventoryModification = ({
	navigation,
	route,
}: InventoryModificationProps) => {
	//GET PROPER PROPS
	const bot: Bot = route.params.bot;

	const botInfo: MapMenuProps['info'] = {};
	const botItems: MapMenuProps['items'] = {};

	let items: ItemProps[] = [];
	let itemCount: number = 0;

	for (let botItem of bot.inventory) {
		items.push({
			_id: botItem.item._id,
			name: botItem.item.name,
			price: botItem.item.price,
			imgSrc: botItem.item.imgSrc,
			quantity: botItem.quantity,
			bot: bot,
		});
		itemCount += botItem.quantity;
	}

	botInfo[bot._id] = {
		topLeft: bot.name,
		topRight: itemCount.toString() + ' items',
		bottomLeft: '0 m away', //Change to actual
		bottomRight: '5 items sold', //Change to actual
		imgSrc: Crane,
	};

	botItems[bot._id] = items;

	return (
		<>
			<View style={{ flex: 1 }}>
				<MapMenu
					id={bot._id}
					info={botInfo}
					items={botItems}
					collapsable={false}
				/>
				<Button
					title="Add Item"
					buttonStyle={styles.button}
					containerStyle={styles.buttonContainer}
					onPress={() => {
						navigation.navigate('AddItem', { bot: bot });
					}}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	button: {
		height: 50,
		alignSelf: 'center',
		width: screenWidth * 0.5,
		backgroundColor: '#3399ff',
	},
	buttonContainer: {
		bottom: 10,
		position: 'absolute',
		borderRadius: 30,
		alignSelf: 'center',
		fontSize: 20,
	},
});

export default InventoryModification;
