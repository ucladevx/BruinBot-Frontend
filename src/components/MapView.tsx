import React, { useRef, useEffect, useState } from 'react';
import MapView, {
	Polygon,
	Polyline,
	LatLng,
	Region,
	AnimatedRegion,
	MarkerAnimated,
} from 'react-native-maps';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';

import { PropTypes, MarkerData } from '../types/mapTypes';

const MapComponent = ({
	initRegion,
	markers,
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
		// objects, "m" is one marker for each of the markers in the markers array

		// For each marker, add a new AnimatedRegion variable with that
		// marker's coordinates to the state object animatedLocations
		markers.reduce(function (obj, m) {
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
		pitch: 0,
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
			// state, add all new markers's AnimatedRegion object to this copy,
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
		// Remove AnimatedRegions whose markers have been removed
		return function cleanup() {
			// Create array holding ids of markers that have been removed
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
		};
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
				{lineCoords && (
					<Polyline
						coordinates={lineCoords}
						strokeColor="#0288d1"
						strokeWidth={1.5}
						lineDashPattern={[40, 20]}
					/>
				)}
				{markers.map((marker) => (
					<MarkerAnimated
						tracksViewChanges={false}
						key={marker._id}
						coordinate={animatedLocations[marker._id]}
						title={marker.name}
						onPress={() => onSelect(marker._id)}
					>
						<Icon
							style={styles.marker}
							name="ios-pin"
							type="ionicon"
							size={50}
							color={marker._id === selected ? '#0288d1' : '#fff'}
						/>
					</MarkerAnimated>
				))}
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
		width: 50,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 2,
		shadowColor: '#000',
		shadowOpacity: 0.3,
	},
});

export default MapComponent;
