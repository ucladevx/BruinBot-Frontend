import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import MapComponent from '../components/MapView';
import Inventory, { InventoryHeader } from '../components/MapMenuView';
import BotService from '../services/BotService';
import MapService from '../services/MapService';

import { EventBot, MapNode } from '../types/apiTypes';
import { MarkerData } from '../types/mapTypes';
import {
	ItemProps,
	MenuProps,
	InventoryProps,
	MapNodeProps,
} from '../types/inventoryTypes';

import CampusData from '../assets/campusCoords.json';
import Bot from '../assets/robot.png';
import Tank from '../assets/tank.png';
import Crane from '../assets/crane.png';
import LocationImgA from '../assets/sampleImageLocation1.png';
import LocationImgB from '../assets/sampleImageLocation2.png';
import LocationImgC from '../assets/sampleImageLocation3.png';
import Marker from '../assets/marker.png';

import Loading from '../components/Loading';

const MILLISECONDS_IN_SECOND = 1000;

const MapScreen = () => {
	const [markers, setMarkers] = useState<MarkerData[] | null>(null);
	const [info, setInfo] = useState<MenuProps['info'] | null>(null);
	const [inventories, setInventories] = useState<
		InventoryProps['items'] | null
	>(null);
	const [selectedMarker, setSelected] = useState('');

	/**
	 * showMapNodes = true -> map nodes are on displayed on the map
	 * showMapNodes = false -> bots are displayed on the map
	 */
	const [showMapNodes, setShowMapNodes] = useState(false);
	const [updateInterval, setUpdateInterval] = useState<ReturnType<
		typeof setTimeout
	> | null>(null);

	async function runRequests() {
		// TODO: use actual API given event id from logged in user
		try {
			const OG_PROD_EVENT = '5fc90164d5869f00143e7fac';
			const data = await BotService.getEventBots(OG_PROD_EVENT);

			const { botArray, botInfo, botItems } = formatEventBotsData(data);
			setMarkers(botArray);
			setInfo(botInfo);
			setInventories(botItems);
		} catch (err) {
			Alert.alert('Could not retrieve bot information.');
		}
	}

	async function setMapNodes() {
		try {
			const mapNodes = await MapService.getMapNodesSample();
			const { mapNodeArray, mapNodeInfo } = formatMapNodesData(mapNodes);

			setMarkers(mapNodeArray);
			setInfo(mapNodeInfo);
		} catch (err) {
			Alert.alert('Could not retrieve map nodes.');
		}
	}

	useEffect(() => {
		if (!showMapNodes) {
			runRequests();
			setUpdateInterval(setInterval(runRequests, MILLISECONDS_IN_SECOND * 10));
		} else {
			clearInterval(updateInterval!!);
			setMapNodes();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showMapNodes]);

	if (!markers || !info) {
		return (
			<View style={styles.container}>
				<Loading loadingText={'Loading'} />
			</View>
		);
	}

	if (showMapNodes) {
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
						refresh={setMapNodes}
						selected={selectedMarker}
						onSelect={(id) => {
							setSelected(id);
						}}
					/>
				</View>
				<InventoryHeader
					info={info[selectedMarker]}
					height={150}
					standalone={true}
				/>
			</>
		);
	} else {
		if (!inventories) {
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
				<Inventory
					id={selectedMarker}
					info={info}
					items={inventories}
					setMapProperty={setShowMapNodes}
				/>
			</>
		);
	}
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

/** --------------------------- HELPER FUNCTIONS ---------------------------- */

const formatEventBotsData = (apiData: EventBot[]) => {
	const botArray: MarkerData[] = [];
	const botInfo: InventoryProps['info'] = {};
	const botItems: InventoryProps['items'] = {};

	apiData.forEach((bot, idx) => {
		const { inventory, ...trimBot } = bot;
		botArray.push({ ...trimBot, location: { ...trimBot.location } }); // clone location

		const items: ItemProps[] = [];
		let itemCount = 0;
		inventory.forEach((obj) => {
			// TODO: fix item images
			items.push({ ...obj.item });
			itemCount += obj.quantity;
		});

		botInfo[bot._id] = {
			topLeft: bot.name + ' BruinBot',
			topRight: itemCount.toString() + ' items',
			// TODO: fix distance, items sold, and bot image
			bottomLeft: '0 ' + ' m away',
			bottomRight: '0' + ' itemsSold',
			imgSrc: [Bot, Tank, Crane][idx % 3],
		};
		botItems[bot._id] = items;
	});
	return { botArray, botInfo, botItems };
};

const formatMapNodesData = (apiData: MapNode[]) => {
	const mapNodeArray: MarkerData[] = [];
	const mapNodeInfo: MapNodeProps['info'] = {};

	apiData.forEach((node, idx) => {
		let name = node.name ? node.name : 'Intermediate checkpoint';
		mapNodeArray.push({
			_id: node._id,
			name: name,
			location: node.location,
		});

		mapNodeInfo[node._id] = {
			topLeft: name,
			topRight: node.distance.toString() + 'm away',
			bottomRight: (node.eta / 60).toFixed(1).toString() + ' minute(s)',
			imgSrc: [LocationImgA, LocationImgB, LocationImgC][idx % 3],
		};
	});
	return { mapNodeArray, mapNodeInfo };
};
