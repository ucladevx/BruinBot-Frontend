import { Button } from 'react-native-elements';
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import MainStyles from '../../styles/main.scss';
import MapView, {
	AnimatedRegion,
	Callout,
	LatLng,
	Marker,
	MarkerAnimated,
	Polygon,
	Polyline,
	Region,
} from 'react-native-maps';
import React, { useEffect, useRef, useState } from 'react';

import { CalloutProps, MarkerData, PropTypes } from './mapTypes';
import { MAP_MARKER_SIZE } from '../../constants';
import mapNodeSelected from '../../assets/pin2.png';
import mapNodeUnselected from '../../assets/pin.png';
import mapPinPrimary from '../../assets/mapPin1.gif';
import mapPinSecondary from '../../assets/mapPin3.gif';
import mapPinTertiary from '../../assets/mapPin2.gif';
import recenterIcon from '../../assets/ICON_recenter.png';
import reloadIcon from '../../assets/ICON_reload.png';

const MapNodeCallout = ({ marker, onButtonPress }: CalloutProps) => {
	const text: string =
		marker.type === 'mapnode' ? 'Save Point' : 'Remove Point';
	return (
		<>
			<Text style={styles.calloutText}> {marker.name} </Text>
			<Button
				onPress={() => onButtonPress(marker)}
				title={text}
				style={styles.buttonP}
				containerStyle={styles.buttonPContainer}
			></Button>
		</>
	);
};

const MapComponent = ({
	initRegion,
	markers,
	centralMarker,
	polygonCoords,
	lineCoords,
	refresh,
	selected,
	onSelect,
	onNodeSelect,
	isMapPath,
}: PropTypes) => {
	const mapRef = useRef<MapView>(null);
	const doneButtonBackgroundColor = isMapPath
		? MainStyles['primary-blue']['color']
		: MainStyles['primary-gray']['color'];
	//console.log(markers)

	// Adds a new object to the MapComponent's state that keeps track of
	// AnimatedRegion objects to be used to locate markers on the map
	const [animatedLocations, setAnimatedLocations] = useState(
		// "obj" will be the initial object holding each of the AnimatedRegion
		// objects, "m" is one marker for each of the markers in the markers
		// array

		// For each marker, add a new AnimatedRegion variable with that
		// marker's coordinates to the state object animatedLocations
		markers.reduce((obj, m) => {
			obj[m._id] = new AnimatedRegion({
				latitude: m.location.latitude,
				longitude: m.location.longitude,
				latitudeDelta: 0,
				longitudeDelta: 0,
			});
			return obj;
		}, Object.create(null)) // This Object.create() is the base empty object
	);

	const initCameraView = {
		center: {
			latitude: initRegion.latitude,
			longitude: initRegion.longitude,
		},
		heading: 0,
		pitch: 30,
		zoom: 14.5,
		altitude: 8000,
	};

	const centerCamera = () => {
		if (mapRef && mapRef.current) {
			mapRef.current.animateCamera(initCameraView, { duration: 300 });
		}
	};

	/**
	 * Animates markers from their original locations to their new locations
	 * upon markers' location change
	 */
	useEffect(() => {
		// Create array to hold any new markers added
		let newMarkers: MarkerData[] = [];

		// For each marker in the main marker array in props
		for (const m of markers) {
			if (m._id in animatedLocations) {
				// Animate coordinates from current location in AnimatedRegion
				// object to new location updated in the marker array's object
				const coordinateConfig = {
					latitude: m.location.latitude,
					longitude: m.location.longitude,
					latitudeDelta: 0,
					longitudeDelta: 0,
					useNativeDriver: false,
					duration: 10000,
				};
				// Start the animation
				animatedLocations[m._id].timing(coordinateConfig).start();
			} else {
				// This is a new marker; add it to the new marker array
				newMarkers.push(m);
			}
		}
		// If a new marker was added to the marker array in props
		if (newMarkers.length > 0) {
			// Create a copy of the animatedLocations array from the component
			// state, add all new markers' AnimatedRegion object to this copy,
			// and set animatedLocations state to this copy
			let animatedLocationsCopy = { ...animatedLocations };
			for (const m of newMarkers) {
				const animatedM = new AnimatedRegion({
					latitude: m.location.latitude,
					longitude: m.location.longitude,
					latitudeDelta: 0,
					longitudeDelta: 0,
				});
				animatedLocationsCopy[m._id] = animatedM;
			}
			setAnimatedLocations(animatedLocationsCopy);
		}

		let markersIdsToRemove: string[] = [];
		// Add all ids that are a key to an AnimatedRegion object in
		// animatedLocations and whose associated markers have been
		// removed to the markersIdsToRemove array
		for (const id in animatedLocations) {
			if (
				markers.find((obj) => {
					return obj._id === id;
				}) == undefined
			) {
				markersIdsToRemove.push(id);
			}
		}
		// For all in animatedLocations, if a key for an animatedRegion
		// object value in the animatedLocations object is an id that
		// doesn't correspond to a marker in the marker array in props,
		// remove that value
		if (markersIdsToRemove.length > 0) {
			// Create a copy of the animatedLocations array from the
			// component state, remove all AnimatedRegion objects without
			// markers from this copy, and set animatedLocations state to
			// this copy
			let animatedLocationsCopy = { ...animatedLocations };
			for (const id of markersIdsToRemove) {
				delete animatedLocationsCopy[id];
			}
			setAnimatedLocations(animatedLocationsCopy);
		}
	}, [markers, animatedLocations]);

	//console.log(lineCoords);
	return (
		<>
			<MapView
				provider="google"
				initialCamera={initCameraView}
				onRegionChangeComplete={(coord) => {
					if (!coordInRegion(coord, initRegion)) {
						centerCamera();
					}
				}}
				loadingEnabled={true}
				showsUserLocation={true}
				showsMyLocationButton={false}
				style={styles.map}
				ref={mapRef}
			>
				{polygonCoords && (
					<Polygon
						coordinates={polygonCoords}
						strokeColor="#0288d1"
						fillColor="rgba(2, 136, 209, 0.2)"
					/>
				)}
				{lineCoords &&
					lineCoords.map((path, idx) => {
						return (
							<Polyline
								key={'Path' + idx}
								coordinates={path}
								strokeColor={MainStyles['primary-blue']['color']}
								strokeWidth={4}
								lineJoin="bevel"
							/>
						);
					})}
				{markers.map(
					(marker) =>
						animatedLocations[marker._id] && (
							<MarkerAnimated
								key={marker._id}
								coordinate={animatedLocations[marker._id]}
								centerOffset={{ x: 0, y: -MAP_MARKER_SIZE / 2 + 5 }}
								title={marker.name}
								onPress={() => {
									onSelect(marker);
								}}
							>
								{marker.type === 'bot' ? (
									selected && marker._id === selected._id ? (
										<Image
											source={mapPinSecondary}
											style={styles.pin}
											resizeMode="contain"
										/>
									) : (
										<Image
											source={mapPinPrimary}
											style={styles.pin}
											resizeMode="contain"
										/>
									)
								) : (
									<>
										{marker.type === 'mapnode' ? (
											<>
												<Image
													source={
														selected && marker._id === selected._id
															? mapNodeSelected
															: mapNodeUnselected
													}
													style={styles.pin}
													resizeMode="contain"
												/>
											</>
										) : (
											<>
												<TouchableOpacity style={styles.circle}>
													<Text style={styles.mapNodeNumber}>
														{' '}
														{marker.type}{' '}
													</Text>
												</TouchableOpacity>
											</>
										)}
										<Callout
											style={styles.callout}
											tooltip={false}
											onPress={() => {
												onNodeSelect(marker);
											}}
										>
											<MapNodeCallout
												marker={marker}
												onButtonPress={onNodeSelect}
											/>
										</Callout>
									</>
								)}
							</MarkerAnimated>
						)
				)}
				{centralMarker && (
					<>
						<Marker
							tracksViewChanges={false}
							coordinate={centralMarker.location}
							centerOffset={{ x: 0, y: -MAP_MARKER_SIZE / 2 + 5 }}
							title={centralMarker.name}
						>
							<Image
								source={mapPinTertiary}
								style={styles.pin}
								resizeMode="contain"
							/>
						</Marker>
					</>
				)}
			</MapView>
			{centralMarker && (
				<Button
					title="Done"
					buttonStyle={{
						...styles.doneButton,
						backgroundColor: doneButtonBackgroundColor,
					}}
					containerStyle={styles.buttonContainer}
					onPress={() => {}}
				/>
			)}
			{/*<TouchableOpacity style={{...styles.button, ...styles.smallerButton, top: '7.9%', left: 18,}}>
				<Image source={hamburgerIcon} style={{height: 10, width:16}} />
			</TouchableOpacity>
			<TouchableOpacity style={{...styles.button, ...styles.smallerButton, top: '7.9%', right: 18}}>
				<Image source={helpIcon} style={styles.icon} />
				</TouchableOpacity>*/}
			<TouchableOpacity
				style={{ ...styles.button, marginBottom: 55 }}
				onPress={() => refresh()}
			>
				<Image source={reloadIcon} style={styles.icon} />
			</TouchableOpacity>
			<TouchableOpacity style={{ ...styles.button }}>
				<Image source={recenterIcon} style={styles.icon} />
			</TouchableOpacity>
		</>
	);
};

const between = (x: number, target: number, delta: number): boolean =>
	x > target - delta && x < target + delta;

const coordInRegion = (coord: LatLng, region: Region): boolean =>
	between(coord.latitude, region.latitude, region.latitudeDelta) &&
	between(coord.longitude, region.longitude, region.longitudeDelta);

const styles = StyleSheet.create({
	map: {
		position: 'absolute',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		top: 0,
	},
	icon: {
		position: 'absolute',
		height: 18,
		width: 18,
	},
	button: {
		bottom: '9.8%',
		right: 18,
		width: 48,
		height: 48,
		position: 'absolute',
		borderRadius: 60,
		backgroundColor: MainStyles['primary-white']['color'],
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 10,
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.25,
		alignItems: 'center',
		justifyContent: 'center',
	},
	calloutText: {
		alignItems: 'center',
		fontSize: 14,
		fontWeight: '600',
	},
	marker: {
		height: MAP_MARKER_SIZE,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 2,
		shadowColor: '#000',
		shadowOpacity: 0.3,
	},
	pin: {
		height: MAP_MARKER_SIZE,
		width: 32,
	},
	buttonP: {
		height: 36,
		alignSelf: 'center',
		width: '100%',
	},
	buttonPContainer: {
		bottom: 10,
		position: 'absolute',
		borderRadius: 18,
		alignSelf: 'center',
		fontSize: 20,
		width: 100,
	},
	callout: {
		width: 207,
		height: 117,
		borderRadius: 18,
	},
	circle: {
		height: MAP_MARKER_SIZE - 10,
		width: MAP_MARKER_SIZE - 10,
		backgroundColor: 'black',
		borderRadius: MAP_MARKER_SIZE / 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mapNodeNumber: {
		color: 'white',
		fontSize: 17,
		fontWeight: '600',
	},
	doneButton: {
		height: 50,
		alignSelf: 'center',
		width: '100%',
	},
	buttonContainer: {
		bottom: 30,
		position: 'absolute',
		borderRadius: 30,
		alignSelf: 'center',
		fontSize: 20,
	},
});

export default MapComponent;
