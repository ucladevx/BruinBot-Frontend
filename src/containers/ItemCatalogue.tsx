import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Loading from '../components/Loading';
import ItemCatalogueService from '../services/ItemCatalogueService';
import MapMenu from '../components/MapMenuView';
import { ItemProps, MapMenuProps } from '../types/inventoryTypes';
import { Bot } from '../types/apiTypes';
import Robot from '../assets/robot.png';
import Tank from '../assets/tank.png';
import Crane from '../assets/crane.png';

interface ItemCatalogueProps {
	botId: string;
}

// OG Bot is BruinBear with id 5fc8e9d411fb0d00125750d3
const ItemCatalogue = ({
	botId = '5fc8e9d411fb0d00125750d3',
}: ItemCatalogueProps) => {
	const [botInfo, setBotInfo] = useState<MapMenuProps['info']>({});
	const [botItems, setBotItems] = useState<MapMenuProps['items']>({});
	const [loading, setLoading] = useState(true);

	const runRequests = async () => {
		try {
			let data = await ItemCatalogueService.getBot(botId);
			const { botHeaderInfo, botItems } = cleanUpData(data);
			setBotInfo(botHeaderInfo);
			setBotItems(botItems);
			setLoading(false);
			console.log(botInfo);
		} catch (err) {
			Alert.alert('Could not retrieve bot information.');
		}
	};

	useEffect(() => {
		if (loading) runRequests();
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
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({});

export default ItemCatalogue;

/** --------------------------- HELPER FUNCTIONS ---------------------------- */

const cleanUpData = (bot: Bot) => {
	const botHeaderInfo: MapMenuProps['info'] = {};
	const botItems: MapMenuProps['items'] = {};

	const items: ItemProps[] = [];
	let itemCount = 0;
	bot.inventory.forEach((obj: { item: ItemProps; quantity: number }) => {
		items.push({ ...obj.item });
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
