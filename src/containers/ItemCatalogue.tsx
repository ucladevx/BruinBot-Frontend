import { Alert, View } from 'react-native';
import { Bot } from '../types/apiTypes';
import { Ctx } from '../components/StateProvider';
import { ItemProps, MapMenuProps } from '../types/inventoryTypes';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import BotService from '../services/BotService';
import Crane from '../assets/crane.png';
import Loading from '../components/Loading';
import MapMenu from '../components/MapMenuView';
import React, { useContext, useEffect, useState } from 'react';
import Robot from '../assets/robot.png';
import Tank from '../assets/tank.png';

interface ItemCatalogueProps {
	navigation: StackNavigationProp<RootStackParamList, 'ItemCatalogue'>;
}

const ItemCatalogue = ({ navigation }: ItemCatalogueProps) => {
	const { state } = useContext(Ctx);
	/* OG Bot is BruinBear with id 5ff798be0390ab19822d21db for demo purposes,
			but if you come from QR view, botId will be set from global state */
	const [botId] = useState<string>(
		state.bot?._id ? state.bot._id : '5ff798be0390ab19822d21db'
	);
	const [botInfo, setBotInfo] = useState<MapMenuProps['info']>({});
	const [botItems, setBotItems] = useState<MapMenuProps['items']>({});
	const [loading, setLoading] = useState(true);

	const runRequests = async () => {
		try {
			console.log(botId);
			let data = await BotService.getOneBot(botId);
			const { botHeaderInfo, botItems } = cleanUpData(data);
			setBotInfo(botHeaderInfo);
			setBotItems(botItems);
			setLoading(false);
		} catch (err) {
			Alert.alert('Could not retrieve bot information.');
		}
	};

	useEffect(() => {
		if (loading) runRequests();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]);

	if (loading) {
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<Loading loadingText={'Loading'} />
			</View>
		);
	}

	return (
		<>
			<View style={{ flex: 1 }}>
				<MapMenu
					id={botId}
					info={botInfo}
					items={botItems}
					collapsable={false}
					clickable={true}
					navigation={navigation}
				/>
			</View>
		</>
	);
};

export default ItemCatalogue;

/** --------------------------- HELPER FUNCTIONS ---------------------------- */

const cleanUpData = (bot: Bot) => {
	const botHeaderInfo: MapMenuProps['info'] = {};
	const botItems: MapMenuProps['items'] = {};

	const items: ItemProps[] = [];
	let itemCount = 0;
	bot.inventory.forEach((obj: { item: ItemProps; quantity: number }) => {
		items.push({
			_id: obj.item._id,
			name: obj.item.name,
			price: obj.item.price,
			imgSrc: obj.item.imgSrc,
			quantity: obj.quantity,
		});
		itemCount += obj.quantity;
	});

	botHeaderInfo[bot._id] = {
		topLeft: bot.name + ' BruinBot',
		topRight: itemCount.toString() + ' items',
		bottomLeft: '',
		bottomRight: '',
		imgSrc: [Robot, Tank, Crane][Math.floor(Math.random() * 3) % 3],
	};
	botItems[bot._id] = items;
	return { botHeaderInfo, botItems };
};
