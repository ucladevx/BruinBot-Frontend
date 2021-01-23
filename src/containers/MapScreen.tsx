import * as Linking from 'expo-linking';
import * as Loc from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import BotService from '../services/BotService';
import Loading from '../components/Loading';
import MapComponent from '../components/MapView';
import MapMenu, { MapMenuHeader } from '../components/MapMenuView';
import MapService from '../services/MapService';

import { EventBot, MapNode, Path } from '../types/apiTypes';
import { ItemProps, MapMenuProps } from '../types/inventoryTypes';
import { Location, MarkerData } from '../types/mapTypes';

import { Ctx } from '../components/StateProvider';
import { IntentLauncher } from 'expo';
import { MAP_REFRESH_RATE } from '../config';
import Bot from '../assets/robot.png';
import CampusData from '../assets/campusCoords.json';
import Crane from '../assets/crane.png';
import LocationImgA from '../assets/sampleImageLocation1.png';
import LocationImgB from '../assets/sampleImageLocation2.png';
import LocationImgC from '../assets/sampleImageLocation3.png';
import Marker from '../assets/marker.png';
import Tank from '../assets/tank.png';

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
	// If markers are bots, these these contain the paths of each non-idle bot
	// else, if markers are map ndoes, contains all of the possible paths
	const [botPaths, setBotPaths] = useState<Location[][] | null>(null);

	// Id of the marker that is currently selected
	const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

	// true -> map nodes displayed on map, false -> bots displayed on map
	const [showMapNodes, setShowMapNodes] = useState(false);

	// Bot that was selected to send to some map node, used when showing map nodes
	const [
		selectedBotForOrder,
		setSelectedBotForOrder,
	] = useState<MarkerData | null>(null);

	const [hasLocationPermission, setLocationPermission] = useState('null');
	const [locationGranted, setLocationGranted] = useState(false);
	const [alert, setAlert] = useState(false);

	const [loading, setLoading] = useState<boolean>(false);
	const { state } = useContext(Ctx);

	async function runRequests() {
		// TODO: use actual API given event id from logged in user
		try {
			const userLocation: Location = await findUserLocation();
			const data = await BotService.getEventBots(state.user!.eventId!);
			const {
				botArray,
				botHeaderInfo,
				botItems,
				botPaths,
			} = formatEventBotsData(data, userLocation);

			setMarkers(botArray);
			setHeaderInfo(botHeaderInfo);
			setInventories(botItems);
			setBotPaths(botPaths);
		} catch (err) {
			console.log(alert);
			if (!alert) {
				setAlert(true);
				Alert.alert('Oops', 'Could not retrieve bot/location information.', [
					{
						text: 'Ok',
						onPress: () => {
							setAlert(false);
						},
					},
				]);
			}
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
			const { mapPaths } = formatMapPathsData(await MapService.getMapPaths());

			setMarkers(mapNodeArray);
			setBotPaths(mapPaths);
			setHeaderInfo(mapNodeHeaderInfo);
		} catch (err) {
			if (!alert) {
				setAlert(true);
				Alert.alert('Oops', 'Could not retrieve map nodes.', [
					{
						text: 'Ok',
						onPress: () => {
							setAlert(false);
						},
					},
				]);
			}
		}
	}

	/**
	 * Finds and sets the user's location
	 */
	async function findUserLocation() {
		let location = await Loc.getCurrentPositionAsync({});
		//console.log(location);
		return {
			longitude: location.coords.latitude,
			latitude: location.coords.latitude,
		};
	}

	useEffect(() => {
		Permissions.askAsync(Permissions.LOCATION).then((res) => {
			setLocationPermission(res.status);
		});
	}, [hasLocationPermission]);

	useEffect(() => {
		let intervalId: ReturnType<typeof setTimeout> | null = null;
		if (!showMapNodes && hasLocationPermission === 'granted') {
			runRequests();
			intervalId = setInterval(runRequests, MAP_REFRESH_RATE);
		} else {
			clearInterval(intervalId!!);
		}
		return () => {
			clearInterval(intervalId!!);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showMapNodes, hasLocationPermission]);

	if (hasLocationPermission === 'null' || hasLocationPermission !== 'granted') {
		if (hasLocationPermission !== 'granted') {
			if (!alert) {
				setAlert(true);
				Alert.alert('Oops', 'No access to location permissions.', [
					{
						text: 'Ok',
						onPress: () => {
							setAlert(false);
							setLocationPermission('null');
						},
					},
					{
						text: 'Open Settings',
						onPress: () => {
							setAlert(false);
							if (Platform.OS == 'ios') {
								// Linking for iOS
								Linking.openURL('app-settings:');
							} else {
								// IntentLauncher for Android
								IntentLauncher.startActivityAsync(
									IntentLauncher.ACTION_MANAGE_ALL_APPLICATIONS_SETTINGS
								);
							}
							setLocationPermission('null');
						},
					},
				]);
			}
		}
		return (
			<View style={styles.container}>
				<Loading loadingText={'Loading'} />
			</View>
		);
	} else {
		if (!alert && !locationGranted) {
			setAlert(true);
			Alert.alert('Thank you', 'Location permissions granted.', [
				{
					text: 'Ok',
					onPress: () => {
						setAlert(false);
						setLocationGranted(true);
					},
				},
			]);
		}
	}

	if (loading || !markers || !headerInfo) {
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
						lineCoords={botPaths ? botPaths : []}
						refresh={() => {
							setMapNodes(
								selectedBotForOrder.location.latitude,
								selectedBotForOrder.location.longitude
							);
						}}
						selected={selectedMarker ? selectedMarker : undefined}
						onSelect={(marker: MarkerData) => {
							setSelectedMarker(marker);
						}}
					/>
				</View>
				{selectedMarker && (
					<MapMenuHeader
						info={headerInfo[selectedMarker ? selectedMarker._id : '']}
						standalone={true}
						button={{
							title: 'Send',
							onButton: () => {
								BotService.sendBot(selectedBotForOrder._id, selectedMarker._id);

								setLoading(true);
								setTimeout(() => {
									setLoading(false);
									setShowMapNodes(false);
								}, 1000);
							},
						}}
					/>
				)}
			</>
		);
	} else {
		if (loading || !inventories) {
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
						lineCoords={botPaths ? botPaths : []}
						refresh={runRequests}
						selected={selectedMarker ? selectedMarker : undefined}
						onSelect={(marker: MarkerData) => setSelectedMarker(marker)}
					/>
				</View>
				{selectedMarker && (
					<MapMenu
						id={selectedMarker ? selectedMarker._id : ''}
						info={headerInfo}
						items={inventories}
						button={{
							title: 'Order',
							onButton: () => {
								// TODO: add check for if bot is "InTransit"
								setSelectedBotForOrder(selectedMarker);
								setMapNodes(
									selectedMarker.location.latitude,
									selectedMarker.location.longitude
								);
								setShowMapNodes(true);
							},
						}}
					/>
				)}
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

const formatEventBotsData = (
	apiData: EventBot[],
	userLocation: Location | null
) => {
	const botMarkers: { [key: string]: MarkerData } = {};
	const botHeaderInfo: MapMenuProps['info'] = {};
	const botPaths: Location[][] = [];
	const botItems: MapMenuProps['items'] = {};

	apiData.forEach((bot, idx) => {
		const { inventory, ...trimBot } = bot;
		botMarkers[bot._id] = { ...trimBot, location: { ...trimBot.location } }; // clone location

		const items: ItemProps[] = [];
		let itemCount = 0;
		inventory.forEach((obj) => {
			// TODO: fix item images
			items.push({ ...obj.item, quantity: obj.quantity, botId: bot._id });
			itemCount += obj.quantity;
		});

		const distance = userLocation
			? coordDistanceM(
					bot.location.latitude,
					bot.location.longitude,
					userLocation?.latitude,
					userLocation?.longitude
			  )
					.toFixed(0)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			: '0';

		botHeaderInfo[bot._id] = {
			topLeft: bot.name,
			topRight: itemCount.toString() + ' items',
			// TODO: fix distance, items sold, and bot image
			bottomLeft: distance + 'm away',
			bottomRight: bot.sales.itemsSold + ' items sold',
			imgSrc: [Bot, Tank, Crane][idx % 3],
		};

		if (bot.status == 'InTransit') {
			botPaths.push(bot.path);
		}

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

const formatMapPathsData = (apiData: Path[]) => {
	const mapPaths: Location[][] = [];

	apiData.forEach((path) => {
		let formattedPath = path.points;
		formattedPath.unshift(path.nodeA.location);
		formattedPath.push(path.nodeB.location);
		mapPaths.push(formattedPath);
	});

	return { mapPaths };
};

/**
 * Converts degrees to radians.
 *
 * @param {number} degrees Number of degrees to convert to radians
 *
 * @returns {number} Degree in radians
 */
function degToRad(degrees: number) {
	return (degrees * Math.PI) / 180;
}

/**
 * Returns the distance between two coordinates in meters.
 * Uses the haversine formula.
 *
 * @param {number} lat1 Latitude of the first coordinate
 * @param {number} lon1 Longitude of the first coordinate
 * @param {number} lat2 Latitude of the second coordinate
 * @param {number} lon2 Longitude of the second coordinate
 *
 * @returns {number} Distance between two points on a globe
 */
function coordDistanceM(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) {
	let radiusM = 6371e3;
	let lat1rad = degToRad(lat1);
	let lon1rad = degToRad(lon1);
	let lat2rad = degToRad(lat2);
	let lon2rad = degToRad(lon2);
	let u = Math.sin((lat2rad - lat1rad) / 2);
	let v = Math.sin((lon2rad - lon1rad) / 2);
	let x = Math.sqrt(u * u + Math.cos(lat1rad) * Math.cos(lat2rad) * v * v);
	return 2.0 * radiusM * Math.asin(x);
}
