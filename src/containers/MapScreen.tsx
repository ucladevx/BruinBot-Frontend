import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import MapComponent from '../components/MapView';
import MapMenu, { MapMenuHeader } from '../components/MapMenuView';
import Loading from '../components/Loading';
import BotService from '../services/BotService';
import MapService from '../services/MapService';

import { EventBot, MapNode } from '../types/apiTypes';
import { MarkerData, Location } from '../types/mapTypes';
import { ItemProps, MapMenuProps } from '../types/inventoryTypes';

import CampusData from '../assets/campusCoords.json';
import Bot from '../assets/robot.png';
import Tank from '../assets/tank.png';
import Crane from '../assets/crane.png';
import LocationImgA from '../assets/sampleImageLocation1.png';
import LocationImgB from '../assets/sampleImageLocation2.png';
import LocationImgC from '../assets/sampleImageLocation3.png';
import Marker from '../assets/marker.png';
import { MAP_REFRESH_RATE } from '../config';

const MapScreen = () => {
	// For displaying the markers on the map
	const [markers, setMarkers] = useState<{ [key: string]: MarkerData } | null>(
		null
	);
	// For displaying the header at the bottom of the screen associated with each marker
	const [headerInfo, setHeaderInfo] = useState<MapMenuProps['info'] | null>(
		null
	);
	// If markers are bots, these contain the inventories of each bot
	const [inventories, setInventories] = useState<MapMenuProps['items'] | null>(
		null
	);
	// If markers are bots, these these contain the path of each bot, if it exists
	const [botPaths, setBotPaths] = useState<{
		[key: string]: Location[];
	} | null>(null);

	// Id of the marker that is currently selected
	const [selectedMarker, setSelected] = useState<MarkerData | null>(null);

	// true -> map nodes displayed on map, false -> bots displayed on map
	const [showMapNodes, setShowMapNodes] = useState(false);

	// Bot that was selected to send to some map node, used when showing map nodes
	const [
		selectedBotForOrder,
		setSelectedBotForOrder,
	] = useState<MarkerData | null>(null);

	// Holds the timeout object that runs requests periodically
	const [updateInterval, setUpdateInterval] = useState<ReturnType<
		typeof setTimeout
	> | null>(null);

	async function runRequests() {
		// TODO: use actual API given event id from logged in user
		try {
			const OG_PROD_EVENT = '5fc90164d5869f00143e7fac';
			const data = await BotService.getEventBots(OG_PROD_EVENT);

			const {
				botArray,
				botHeaderInfo,
				botItems,
				botPaths,
			} = formatEventBotsData(data);

			setMarkers(botArray);
			setHeaderInfo(botHeaderInfo);
			setInventories(botItems);
			setBotPaths(botPaths);
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
			setUpdateInterval(setInterval(runRequests, MAP_REFRESH_RATE));
		} else {
			clearInterval(updateInterval!!);
		}
		return () => clearInterval(updateInterval!!);
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
						centralMarker={selectedBotForOrder}
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
						selected={selectedMarker ? selectedMarker : undefined}
						onSelect={(marker: MarkerData) => {
							setSelected(marker);
						}}
					/>
				</View>
				<MapMenuHeader
					info={headerInfo[selectedMarker ? selectedMarker._id : '']}
					standalone={true}
					onButton={() => {
						// for now, go back to map with btos
						setShowMapNodes(false);
					}}
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
						lineCoords={botPaths ? Object.values(botPaths) : []}
						refresh={runRequests}
						selected={selectedMarker ? selectedMarker : undefined}
						onSelect={(marker: MarkerData) => setSelected(marker)}
					/>
				</View>
				<MapMenu
					id={selectedMarker ? selectedMarker._id : ''}
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
	const botPaths: { [key: string]: Location[] } = {};
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
			bottomRight: '0' + ' items sold',
			imgSrc: [Bot, Tank, Crane][idx % 3],
		};

		botPaths[bot._id] = bot.path;

		botItems[bot._id] = items;
	});
	return { botArray: botMarkers, botHeaderInfo, botItems, botPaths };
};

const formatMapNodesData = (apiData: MapNode[]) => {
	const mapNodeMarkers: { [key: string]: MarkerData } = {};
	const mapNodeHeaderInfo: MapMenuProps['info'] = {};
	apiData.forEach((node, idx) => {
		// TODO: figure out what to name intermediate checkpoints
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
			bottomRight: node.eta.toFixed(1).toString() + ' minutes',
			imgSrc: [LocationImgA, LocationImgB, LocationImgC][idx % 3],
		};
	});
	return { mapNodeArray: mapNodeMarkers, mapNodeHeaderInfo };
};
