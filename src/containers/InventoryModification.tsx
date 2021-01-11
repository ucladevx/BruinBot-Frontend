import { Button } from 'react-native-elements';
import { Dimensions, StyleSheet, View } from 'react-native';
import { HeaderInfo, ItemProps } from '../types/inventoryTypes';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import Crane from '../assets/crane.png';
import MapMenu from '../components/MapMenuView';
import React, { useState } from 'react';

const screenWidth = Dimensions.get('window').width;

interface InventoryModificationProps {
	navigation: StackNavigationProp<RootStackParamList, 'InventoryModification'>;
	botId: string;
}
const InventoryModification = ({ navigation }: InventoryModificationProps) => {
	const botInfo: HeaderInfo = {
		topLeft: 'Random Bear',
		topRight: '10 items',
		bottomLeft: '0 m away',
		bottomRight: '5 items sold',
		imgSrc: Crane,
	};
	const botItems: ItemProps[] = [
		{
			_id: '1',
			name: 'Ham 1',
			price: 10,
			imgSrc: '',
		},
		{
			_id: '2',
			name: 'Ham 2',
			price: 15,
			imgSrc: '',
		},
		{
			_id: '3',
			name: 'Ham 3',
			price: 20,
			imgSrc: '',
		},
		{
			_id: '4',
			name: 'Ham 4',
			price: 10,
			imgSrc: '',
		},
	];

	const [info] = useState(botInfo);
	const [items] = useState(botItems);

	return (
		<>
			<View style={{ flex: 1 }}>
				<MapMenu info={info} items={items} collapsable={false} />
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
