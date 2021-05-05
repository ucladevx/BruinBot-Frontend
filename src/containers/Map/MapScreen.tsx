import * as Linking from 'expo-linking';
import * as Loc from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Alert, Dimensions, Platform, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import BotService from '../../services/BotService';
import Loading from '../../components/Loading';
import MapComponent from './MapView';
import MapMenu, { MapMenuHeader } from './MapMenuView';
import MapService from './MapService';

import { EventBot, MapNode, Path } from '../../types/apiTypes';
import { ItemProps, MapMenuProps } from '../../types/inventoryTypes';
import { Location, MapScreenProps, MarkerData } from './mapTypes';

import { Ctx } from '../../components/StateProvider';
import { IntentLauncher } from 'expo';
import { MAP_REFRESH_RATE } from '../../config';
import Bot from '../../assets/robot.png';
import CampusData from '../../assets/campusCoords.json';
import Crane from '../../assets/crane.png';
import LocationImgA from '../../assets/sampleImageLocation1.png';
import LocationImgB from '../../assets/sampleImageLocation2.png';
import LocationImgC from '../../assets/sampleImageLocation3.png';
import Marker from '../../assets/marker.png';
import Tank from '../../assets/tank.png';

const MapScreen = ({ route, navigation }: MapScreenProps) => {
	const botSelected = route.params?.botSelected || null;

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

	//Ordered list of locations for the bot to travel to
	const [botRoute, setBotRoute] = useState<MarkerData[] | null>(null);

	// Path between selected Bot and selected Location
	const [paths, setPaths] = useState<Location[][] | null>(null);

	// Id of the marker that is currently selected
	const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

	// Bot that was selected to send to some map node, used when showing map nodes
	const botS: MarkerData | null = botSelected ? botSelected : null;
	const [
		selectedBotForOrder,
		setSelectedBotForOrder,
	] = useState<MarkerData | null>(botS);

	// true -> map nodes displayed on map, false -> bots displayed on map
	const [showMapNodes, setShowMapNodes] = useState(!!selectedBotForOrder);

	useEffect(() => {
		setSelectedBotForOrder(botSelected);
		setShowMapNodes(!!botSelected);
	}, [botSelected]);

	const [hasLocationPermission, setLocationPermission] = useState('null');
	const [alert, setAlert] = useState(false);

	const [loading, setLoading] = useState<boolean>(false);
	const { state } = useContext(Ctx);

	async function addToRoute(marker: MarkerData) {
		console.log('adding marker ' + marker.name);
		let curRoute = botRoute ? botRoute : [];
		if (curRoute.indexOf(marker) > -1) {
			await removeFromRoute(marker);
		} else {
			if (curRoute.length === 0 && selectedBotForOrder) {
				let curPaths = paths ? paths : [];
				let newPath = await MapService.getPathBetween(
					selectedBotForOrder.location,
					marker.location
				);
				curPaths = curPaths.concat([newPath]);
				setPaths(curPaths);
			} else if (curRoute.length) {
				let curPaths = paths ? paths : [];
				let newPath = await MapService.getPathBetween(
					curRoute[curRoute.length - 1].location,
					marker.location
				);
				curPaths = curPaths.concat([newPath]);
				setPaths(curPaths);
			}
			curRoute = curRoute.concat([marker]);
			marker.type = '' + curRoute.length;
			setBotRoute(curRoute);
		}
	}

	async function removeFromRoute(marker: MarkerData) {
		console.log('removing marker ' + marker.name);
		let curRoute = botRoute ? botRoute : [];
		let curPaths = paths ? paths : [];
		let index: number = curRoute.indexOf(marker);
		if (index === curRoute.length - 1) {
			curPaths = curPaths.slice(0, index).concat(curPaths.slice(index + 1));
		} else {
			let destMarker: MarkerData = curRoute[index + 1];
			if (!selectedBotForOrder) {
				return; //BIG ERROR
			}
			let startMarker: MarkerData =
				index > 0 ? curRoute[index - 1] : selectedBotForOrder;
			let newPath = await MapService.getPathBetween(
				startMarker.location,
				destMarker.location
			);
			curPaths = curPaths
				.slice(0, index)
				.concat([newPath])
				.concat(curPaths.slice(index + 2));
		}
		curRoute = curRoute.slice(0, index).concat(curRoute.slice(index + 1));
		setPaths(curPaths);
		for (let i = 0; i < curRoute.length; i++) {
			curRoute[i].type = '' + (i + 1);
		}
		marker.type = 'mapnode';
		setBotRoute(curRoute);
	}

	async function runRequests() {
		// TODO: use actual API given event id from logged in user
		try {
			const userLocation: Location = await findUserLocation();
			const data = await BotService.getEventBots(state.user!.eventId!);
			const { botArray, botHeaderInfo, botItems } = formatEventBotsData(
				data,
				userLocation
			);

			setMarkers(botArray);
			setHeaderInfo(botHeaderInfo);
			setInventories(botItems);
		} catch (err) {
			if (!alert) {
				setAlert(true);
				console.log(err);
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

			setMarkers(mapNodeArray);
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

	async function setMapNodesSelected() {
		if (selectedBotForOrder) {
			setMapNodes(
				selectedBotForOrder.location.latitude,
				selectedBotForOrder.location.longitude
			);
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
		if (hasLocationPermission !== 'granted') {
			Permissions.askAsync(Permissions.LOCATION).then((res) => {
				setLocationPermission(res.status);
				if (res.status === 'granted') {
					setAlert(true);
					Alert.alert('Thank you', 'Location permissions granted.', [
						{
							text: 'Ok',
							onPress: () => {
								setAlert(false);
							},
						},
					]);
				}
			});
		}
	}, [hasLocationPermission]);

	useEffect(() => {
		let intervalId: ReturnType<typeof setTimeout> | null = null;
		if (!showMapNodes && hasLocationPermission === 'granted') {
			runRequests();
			intervalId = setInterval(runRequests, MAP_REFRESH_RATE);
		} else if (showMapNodes) {
			setMapNodesSelected();
			intervalId = setInterval(setMapNodesSelected, MAP_REFRESH_RATE);
		} else {
			clearInterval(intervalId!!);
		}
		return () => {
			clearInterval(intervalId!!);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showMapNodes, hasLocationPermission]);

	if (hasLocationPermission !== 'granted') {
		if (!alert && hasLocationPermission === 'denied') {
			setAlert(true);
			Alert.alert('Oops', 'No access to location permissions.', [
				{
					text: 'Ok',
					onPress: () => {
						setLocationPermission('null');
						setAlert(false);
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
		return (
			<View style={styles.container}>
				<Loading loadingText={'Loading'} />
			</View>
		);
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
						lineCoords={paths ? paths : []}
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
						onNodeSelect={(marker: MarkerData) => {
							addToRoute(marker);
						}}
						isMapPath={!botRoute || botRoute.length === 0 ? false : true}
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
						lineCoords={[]}
						refresh={runRequests}
						selected={selectedMarker ? selectedMarker : undefined}
						onSelect={(marker: MarkerData) => setSelectedMarker(marker)}
						onNodeSelect={() => {}}
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
								navigation.navigate('SelectMarker', {
									markers: Object.values(markers),
									selectedId: selectedMarker._id,
								});
								// TODO: add check for if bot is "InTransit"
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
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
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
	const botItems: MapMenuProps['items'] = {};

	apiData.forEach((bot, idx) => {
		const { inventory, ...trimBot } = bot;
		botMarkers[bot._id] = {
			...trimBot,
			location: { ...trimBot.location },
			type: 'bot',
		}; // clone location

		const items: ItemProps[] = [];
		let itemCount = 0;
		let itemsSold = 0;
		inventory.forEach((obj) => {
			// TODO: fix item images
			items.push({ ...obj.item, quantity: obj.quantity, bot: bot });
			itemCount += obj.quantity;
			itemsSold += obj.sales.numSold;
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
			bottomRight: itemsSold + ' items sold',
			imgSrc: [Bot, Tank, Crane][idx % 3],
		};

		botItems[bot._id] = items;
	});
	return { botArray: botMarkers, botHeaderInfo, botItems };
};

const formatMapNodesData = (apiData: MapNode[]) => {
	const mapNodeMarkers: { [key: string]: MarkerData } = {};
	const mapNodeHeaderInfo: MapMenuProps['info'] = {};

	apiData
		.filter((node) => node.name)
		.forEach((node, idx) => {
			// TODO: figure out what to name intermediate checkpoints
			let name = node.name
				? node.name
				: 'Checkpoint ' +
				  String.fromCharCode(65 + Math.floor(Math.random() * 26));
			mapNodeMarkers[node._id] = {
				_id: node._id,
				name: name,
				location: node.location,
				type: 'mapnode',
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
