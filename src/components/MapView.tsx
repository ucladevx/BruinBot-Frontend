import React, { useRef, useEffect, useState } from 'react';
import MapView, {
	Polygon,
	Polyline,
	LatLng,
	Region,
	AnimatedRegion,
	Marker,
	MarkerAnimated,
} from 'react-native-maps';
import { TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Icon } from 'react-native-elements';

import { PropTypes, MarkerData } from '../types/mapTypes';
import { MAP_MARKER_SIZE } from '../constants';
// import mapDest from '../assets/mapDest.png';
import mapPinPrimary from '../assets/mapPin1.gif';
import mapPinSecondary from '../assets/mapPin3.gif';
import mapPinTertiary from '../assets/mapPin2.gif';

const MapComponent = ({
	initRegion,
	markers,
	centralMarker,
	polygonCoords,
	lineCoords,
	refresh,
	selected,
	onSelect,
}: PropTypes) => {
	const mapRef = useRef<MapView>(null);

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

	return (
		<>
			<MapView
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
								strokeColor="white"
								strokeWidth={4}
								lineJoin="bevel"
							/>
						);
					})}
				{/* {lineCoords &&
					lineCoords.map((path, idx) => {
						return (
							<Marker
								key={idx}
								tracksViewChanges={false}
								coordinate={path[path.length - 1]}
								centerOffset={{ x: 0, y: 0 }}
							>
								<Image
									source={mapDest}
									style={{ height: MAP_MARKER_SIZE * 0.7 }}
									resizeMode="contain"
								/>
							</Marker>
						);
					})} */}
				{selected && centralMarker && (
					<Polyline
						coordinates={[selected.location, centralMarker.location]}
						strokeColor="white"
						strokeWidth={4}
						lineJoin="bevel"
						lineDashPattern={[10]}
					/>
				)}
				{markers.map((marker) => (
					<MarkerAnimated
						tracksViewChanges={false}
						key={marker._id}
						coordinate={animatedLocations[marker._id]}
						centerOffset={{ x: 0, y: -MAP_MARKER_SIZE / 2 + 5 }}
						title={marker.name}
						onPress={() => onSelect(marker)}
					>
						{selected && marker._id === selected._id ? (
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
						)}
					</MarkerAnimated>
				))}
				{centralMarker && (
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
				)}
			</MapView>
			<TouchableOpacity
				style={{ ...styles.button, marginBottom: 60 }}
				onPress={() => refresh()}
			>
				<Icon name="ios-sync" type="ionicon" size={30} color="#555" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.button}>
				<Icon name="ios-navigate" type="ionicon" size={30} color="#555" />
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
		top: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	button: {
		position: 'absolute',
		bottom: 30,
		right: 8,
		width: 50,
		height: 50,
		borderRadius: 60,
		backgroundColor: '#fff',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 1,
		shadowColor: '#000',
		shadowOpacity: 0.3,
		alignItems: 'center',
		justifyContent: 'center',
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
	},
});

export default MapComponent;
