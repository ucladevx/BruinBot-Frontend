import { Alert, View } from 'react-native';
import { Bot } from '../../types/apiTypes';
import { ItemProps, MapMenuProps } from '../../types/inventoryTypes';
import { RootStackParamList } from '../../../App';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Crane from '../../assets/crane.png';
import Loading from '../../components/Loading';
import MapMenu from '../Map/MapMenuView';
import React, { useEffect, useState } from 'react';
import Robot from '../../assets/robot.png';
import Tank from '../../assets/tank.png';

interface ItemCatalogueProps {
	navigation: StackNavigationProp<RootStackParamList, 'ItemCatalogue'>;
	route: RouteProp<RootStackParamList, 'ItemCatalogue'>;
}

const ItemCatalogue = ({ navigation, route }: ItemCatalogueProps) => {
	const bot = route.params.bot;
	const [botInfo, setBotInfo] = useState<MapMenuProps['info']>({});
	const [botItems, setBotItems] = useState<MapMenuProps['items']>({});
	const [loading, setLoading] = useState(true);

	const runRequests = async () => {
		try {
			console.log(bot);
			const { botHeaderInfo, botItems } = cleanUpData(bot);
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
					id={bot._id}
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
			bot: bot,
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
