import { Dimensions, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-elements';
import MainStyles from '../../styles/main.scss';
import MapView, {
	AnimatedRegion,
	LatLng,
	Marker,
	MarkerAnimated,
	Polygon,
	Polyline,
	Region,
	Callout,
} from 'react-native-maps';
import React, { useEffect, useRef, useState } from 'react';

import { MAP_MARKER_SIZE } from '../../constants';
import { MarkerData, PropTypes, CalloutProps } from './mapTypes';
// import mapDest from '../../assets/mapDest.png';
import mapNodeUnselected from '../../assets/pin.png';
import mapNodeSelected from '../../assets/pin2.png';
import mapPinPrimary from '../../assets/mapPin1.gif';
import mapPinSecondary from '../../assets/mapPin3.gif';
import mapPinTertiary from '../../assets/mapPin2.gif';
import recenterIcon from '../../assets/ICON_recenter.png';
import reloadIcon from '../../assets/ICON_reload.png';
import { exp } from 'react-native-reanimated';

const MapNodeCallout = ({marker, onButtonPress}: CalloutProps) => {
	const text: string = marker.type === "mapnodeX" ? "Save Point" : "Remove Point";
	return (
		<>
		<Text> {marker.name} </Text>
		<Button
			onPress={() => onButtonPress(marker)}
			title={text}
			style={styles.buttonP}>
		</Button>
		</>
	)
}

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
								strokeColor="white" //TODO: change color here
								strokeWidth={4}
								lineJoin="bevel"
							/>
						);
					})}
				{/* TODO: after splitting bot mode and map node mode into different
						  -screen.tsx files, add this to bot mode screen
				{lineCoords &&
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
				{/*selected && centralMarker && (
					<Polyline
						coordinates={[selected.location, centralMarker.location]}
						strokeColor="white"
						strokeWidth={4}
						lineJoin="bevel"
						lineDashPattern={[10]}
					/>
				)*/}
				{
				markers.map(
					(marker) =>
						animatedLocations[marker._id] && (
							<MarkerAnimated
								key={marker._id}
								coordinate={animatedLocations[marker._id]}
								centerOffset={{ x: 0, y: -MAP_MARKER_SIZE / 2 + 5 }}
								title={marker.name}
								onPress={() => {if (marker.type === "bot") onSelect(marker)}}
							>
								{marker.type === "bot" ? (
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
								)) : (
									<>
									{selected && marker._id === selected._id ? (
									<>
									<Image
										source={mapNodeSelected}
										style={styles.pin}
										resizeMode="contain"
									/>
									<Callout style={styles.callout}>
										<MapNodeCallout marker={marker} onButtonPress={onSelect}/>
									</Callout>
									</>
									) : (
										<>
										<Image
										source={mapNodeUnselected}
										style={styles.pin}
										resizeMode="contain"
									/>
									<Callout>
										<MapNodeCallout marker={marker} onButtonPress={onSelect}/>
									</Callout>
									</>
									)}
									</>)}
							</MarkerAnimated>
						)
				)}
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
		top: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
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
	marker: {
		height: MAP_MARKER_SIZE,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 2,
		shadowColor: '#000',
		shadowOpacity: 0.3,
	},
	pin: {
		height: MAP_MARKER_SIZE,
		width: 32
	},
	buttonP: {
		width: 175,
		height: 36,
		borderRadius: 18,
	},
	callout: {
		width: 207,
		height: 117,
		borderRadius: 18,
		fontSize: 12,
	}

});

export default MapComponent;
