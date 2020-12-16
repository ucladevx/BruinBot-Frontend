import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import MapComponent from '../components/MapView';
import MapMenu, { MapMenuHeader } from '../components/MapMenuView';
import BotService from '../services/BotService';
import MapService from '../services/MapService';

import { EventBot, MapNode } from '../types/apiTypes';
import { MarkerData } from '../types/mapTypes';
import { ItemProps, MapMenuProps } from '../types/inventoryTypes';

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
	const [markers, setMarkers] = useState<{ [key: string]: MarkerData } | null>(
		null
	);
	const [headerInfo, setHeaderInfo] = useState<MapMenuProps['info'] | null>(
		null
	);
	const [inventories, setInventories] = useState<MapMenuProps['items'] | null>(
		null
	);
	const [selectedMarker, setSelected] = useState('');

	// true -> map nodes displayed on map, false -> bots displayed on map
	const [showMapNodes, setShowMapNodes] = useState(false);
	// Bot that was selected to send to some map node
	const [
		selectedBotForOrder,
		setSelectedBotForOrder,
	] = useState<MarkerData | null>(null);

	const [updateInterval, setUpdateInterval] = useState<ReturnType<
		typeof setTimeout
	> | null>(null);

	async function runRequests() {
		// TODO: use actual API given event id from logged in user
		try {
			const OG_PROD_EVENT = '5fc90164d5869f00143e7fac';
			const data = await BotService.getEventBots(OG_PROD_EVENT);

			const { botArray, botHeaderInfo, botItems } = formatEventBotsData(data);
			setMarkers(botArray);
			setHeaderInfo(botHeaderInfo);
			setInventories(botItems);
		} catch (err) {
			Alert.alert('Could not retrieve bot information.');
		}
	}

	/**
	 * Sets markers as map nodes, with each node's distance and eta from the given
	 * location
	 *
	 * @param latitude Latitude of location
	 * @param longitude Longitude of location
	 */
	async function setMapNodes(latitude: number, longitude: number) {
		try {
			const mapNodes = await MapService.getMapNodes(latitude, longitude);
			const { mapNodeArray, mapNodeHeaderInfo } = formatMapNodesData(mapNodes);

			setMarkers(mapNodeArray);
			setHeaderInfo(mapNodeHeaderInfo);
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showMapNodes]);

	if (!markers || !headerInfo) {
		return (
			<View style={styles.container}>
				<Loading loadingText={'Loading'} />
			</View>
		);
	}

	if (showMapNodes && selectedBotForOrder) {
		return (
			<>
				<View style={styles.container}>
					<MapComponent
						initRegion={CampusData.region}
						markers={Object.values(markers)}
						markerImg={Marker}
						polygonCoords={CampusData.polygon.map(([lat, lng]) => ({
							latitude: lat,
							longitude: lng,
						}))}
						refresh={() => {
							setMapNodes(
								selectedBotForOrder.location.latitude,
								selectedBotForOrder.location.longitude
							);
						}}
						selected={selectedMarker}
						onSelect={(id: string) => {
							setSelected(id);
						}}
					/>
				</View>
				<MapMenuHeader
					info={headerInfo[selectedMarker]}
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
						markers={Object.values(markers)}
						markerImg={Marker}
						polygonCoords={CampusData.polygon.map(([lat, lng]) => ({
							latitude: lat,
							longitude: lng,
						}))}
						refresh={runRequests}
						selected={selectedMarker}
						onSelect={(id: string) => setSelected(id)}
					/>
				</View>
				<MapMenu
					id={selectedMarker}
					info={headerInfo}
					items={inventories}
					setMapProperty={(id: string) => {
						let selectedBot = markers[id];
						setSelectedBotForOrder(selectedBot);
						setMapNodes(
							selectedBot.location.latitude,
							selectedBot.location.longitude
						);
						setShowMapNodes(true);
					}}
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
	const botMarkers: { [key: string]: MarkerData } = {};
	const botHeaderInfo: MapMenuProps['info'] = {};
	const botItems: MapMenuProps['items'] = {};

	apiData.forEach((bot, idx) => {
		const { inventory, ...trimBot } = bot;
		botMarkers[bot._id] = { ...trimBot, location: { ...trimBot.location } }; // clone location

		const items: ItemProps[] = [];
		let itemCount = 0;
		inventory.forEach((obj) => {
			// TODO: fix item images
			items.push({ ...obj.item });
			itemCount += obj.quantity;
		});

		botHeaderInfo[bot._id] = {
			topLeft: bot.name + ' BruinBot',
			topRight: itemCount.toString() + ' items',
			// TODO: fix distance, items sold, and bot image
			bottomLeft: '0' + 'm away',
			bottomRight: '0' + ' itemsSold',
			imgSrc: [Bot, Tank, Crane][idx % 3],
		};
		botItems[bot._id] = items;
	});
	return { botArray: botMarkers, botHeaderInfo, botItems };
};

const formatMapNodesData = (apiData: MapNode[]) => {
	const mapNodeMarkers: { [key: string]: MarkerData } = {};
	const mapNodeHeaderInfo: MapMenuProps['info'] = {};
	console.log(apiData);
	apiData.forEach((node, idx) => {
		let name = node.name
			? node.name
			: 'Checkpoint ' +
			  String.fromCharCode(65 + Math.floor(Math.random() * 26));
		mapNodeMarkers[node._id] = {
			_id: node._id,
			name: name,
			location: node.location,
		};

		mapNodeHeaderInfo[node._id] = {
			topLeft: name,
			topRight: node.distance.toFixed(0).toString() + 'm away',
			bottomRight: node.eta.toFixed(1).toString() + ' minute(s)',
			imgSrc: [LocationImgA, LocationImgB, LocationImgC][idx % 3],
		};
	});
	return { mapNodeArray: mapNodeMarkers, mapNodeHeaderInfo };
};
