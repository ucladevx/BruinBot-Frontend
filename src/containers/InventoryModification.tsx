import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { RootStackParamList } from '../../App';
import Crane from '../assets/crane.png';
import MapMenu from '../components/MapMenuView';
import { Ctx } from '../components/StateProvider';
import BotService from '../services/BotService';
import { Bot } from '../types/apiTypes';
import { MapMenuProps } from '../types/inventoryTypes';

const screenWidth = Dimensions.get('window').width;

interface InventoryModificationProps {
	navigation: StackNavigationProp<RootStackParamList, 'InventoryModification'>;
	botId: string;
}
const InventoryModification = ({ navigation }: InventoryModificationProps) => {
	const {
		state: { bot },
	} = useContext(Ctx);
	const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

	useEffect(() => {
		if (bot != null) {
			BotService.getOneBot(bot._id).then((bot) => {
				console.log(bot.inventory);
				setSelectedBot(bot);
			});
		}
	}, [bot, selectedBot?.name]);

	if (!selectedBot) return <ActivityIndicator />;

	const botInfo: MapMenuProps['info'] = {
		[selectedBot._id]: {
			topLeft: selectedBot?.name,
			topRight: '10 items',
			bottomLeft: '0 m away',
			bottomRight: '5 items sold',
			imgSrc: Crane,
		},
	};
	const botItems: MapMenuProps['items'] = {
		[selectedBot._id]: selectedBot.inventory.map(({ _id, item }) => ({
			_id: _id,
			name: item.name,
			price: item.price,
			imgSrc: item.imgSrc,
		})),
	};

	return (
		<View style={{ flex: 1 }}>
			<MapMenu
				id={selectedBot._id}
				info={botInfo}
				items={botItems}
				collapsable={false}
			/>
			<Button
				title="Add Item"
				buttonStyle={styles.button}
				containerStyle={styles.buttonContainer}
				onPress={() => {
					navigation.navigate('AddItem');
				}}
			/>
		</View>
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
