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
	const [animatedLocations, setAnimatedLocations] = useState(
		markers.reduce(function (obj, m) {
			obj[m._id] = new AnimatedRegion({
				latitude: m.location.latitude,
				longitude: m.location.longitude,
				latitudeDelta: 0,
				longitudeDelta: 0,
			});
			return obj;
		}, Object.create(null))
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

	// animates markers from original location to new location
	useEffect(() => {
		let newMarkers: MarkerData[] = [];
		for (const m of markers) {
			if (m._id in animatedLocations) {
				const coordinateConfig = {
					latitude: m.location.latitude,
					longitude: m.location.longitude,
					latitudeDelta: 0,
					longitudeDelta: 0,
					useNativeDriver: false,
				};
				animatedLocations[m._id].timing(coordinateConfig).start();
			} else {
				newMarkers.push(m);
			}
		}
		if (newMarkers.length > 0) {
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
		return function cleanup() {
			let markersIdsToRemove: string[] = [];
			for (const id in animatedLocations) {
				if (
					markers.find((obj) => {
						return obj._id === id;
					}) == undefined
				) {
					markersIdsToRemove.push(id);
				}
			}
			if (markersIdsToRemove.length > 0) {
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
