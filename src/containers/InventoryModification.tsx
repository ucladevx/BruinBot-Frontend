import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ItemProps, InventoryProps } from '../types/inventoryTypes';
import Ham from '../assets/greenHam.jpg';
import Crane from '../assets/crane.png';
import Inventory from '../components/InventoryView';

const screenWidth = Dimensions.get('window').width;

interface InventoryModificationProps {
	navigation: StackNavigationProp<RootStackParamList, 'InventoryModification'>;
	botId: string;
}
const InventoryModification = ({ navigation }: InventoryModificationProps) => {
	//GET PROPER PROPS

	const botInfo: InventoryProps['info'] = {};
	const botItems: InventoryProps['items'] = {};

	const item: ItemProps[] = [
		{
			_id: '1',
			name: 'Ham 1',
			price: 10,
			imgSrc: Ham,
		},
		{
			_id: '2',
			name: 'Ham 2',
			price: 15,
			imgSrc: Ham,
		},
		{
			_id: '3',
			name: 'Ham 3',
			price: 20,
			imgSrc: Ham,
		},
		{
			_id: '4',
			name: 'Ham 4',
			price: 10,
			imgSrc: Ham,
		},
		{
			_id: '5',
			name: 'Ham 5',
			price: 15,
			imgSrc: Ham,
		},
		{
			_id: '6',
			name: 'Ham 6',
			price: 20,
			imgSrc: Ham,
		},
	];

	botInfo['123'] = {
		name: 'bot 1',
		inventorySize: 10,
		distance: 0,
		itemsSold: 0,
		imgSrc: Crane,
	};
	botItems['123'] = item;

	const [info] = useState(botInfo);
	const [items] = useState(botItems);

	return (
		<>
			<View style={{ flex: 1 }}>
				<Inventory id="123" info={info} items={items} collapsable={false} />
				<Button
					title="Add Item"
					buttonStyle={styles.button}
					containerStyle={styles.buttonContainer}
					onPress={() => {
						navigation.navigate('AddItem');
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
