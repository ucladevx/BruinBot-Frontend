import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import MapComponent from '../components/MapView';
import Inventory from '../components/InventoryView';
import BotService from '../services/BotService';

import { EventBot } from '../types/apiTypes';
import { MarkerData } from '../types/mapTypes';
import { ItemProps, InventoryProps } from '../types/inventoryTypes';

import CampusData from '../assets/campusCoords.json';
import Ham from '../assets/greenHam.jpg';
import Bot from '../assets/robot.png';
import Tank from '../assets/tank.png';
import Crane from '../assets/crane.png';
import Marker from '../assets/marker.png';

import Loading from '../components/Loading';

const formatData = (apiData: EventBot[]) => {
	const botArray: MarkerData[] = [];
	const botInfo: InventoryProps['info'] = {};
	const botItems: InventoryProps['items'] = {};

	apiData.forEach((bot) => {
		const { inventory, ...trimBot } = bot;
		botArray.push({ ...trimBot, location: { ...trimBot.location } }); // clone location

		const items: ItemProps[] = [];
		let itemCount = 0;
		inventory.forEach((obj) => {
			// TODO: fix item images
			items.push({ ...obj.item, imgSrc: Ham });
			itemCount += obj.quantity;
		});

		botInfo[bot._id] = {
			name: bot.name,
			inventorySize: itemCount,
			// TODO: fix distance, items sold, and bot image
			distance: 0,
			itemsSold: 0,
			imgSrc: [Bot, Tank, Crane][Math.floor(Math.random() * 3)],
		};
		botItems[bot._id] = items;
	});
	return { botArray, botInfo, botItems };
};

const MapScreen = () => {
	const [markers, setMarkers] = useState<MarkerData[] | null>(null);
	const [info, setInfo] = useState<InventoryProps['info'] | null>(null);
	const [inventories, setInventories] = useState<
		InventoryProps['items'] | null
	>(null);
	const [selectedMarker, setSelected] = useState('');

	async function runRequests() {
		// TODO: use actual API given event id
		try {
			// const eventId = '5fb49d9b30f3d1586ff2a354';
			// const data = await BotService.getEventBots(eventId);

			const data = await BotService.getEventBotsSample();
			const { botArray, botInfo, botItems } = formatData(data);
			setMarkers(botArray);
			setInfo(botInfo);
			setInventories(botItems);
			setSelected(botArray.length ? botArray[0]._id : '');
		} catch (err) {
			// TODO: handle request error
		}
	}

	useEffect(() => {
		runRequests();
		setInterval(runRequests, 1000 * 15);
	}, []);

	if (!markers || !info || !inventories || !selectedMarker.length) {
		return (
			<View style={styles.container}>
				<Loading loadingText={'Loading'} />
			</View>
		);
	}

	return (
		<>
			<View style={styles.container}>
				<MapComponent
					initRegion={CampusData.region}
					markers={markers}
					markerImg={Marker}
					polygonCoords={CampusData.polygon.map(([lat, lng]) => ({
						latitude: lat,
						longitude: lng,
					}))}
					refresh={runRequests}
					selected={selectedMarker}
					onSelect={(id) => setSelected(id)}
				/>
			</View>
			<Inventory id={selectedMarker} info={info} items={inventories} />
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default MapScreen;
