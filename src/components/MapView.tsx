import React, { useRef } from 'react';
import MapView, {
	Polygon,
	Polyline,
	Marker,
	LatLng,
	Region,
} from 'react-native-maps';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';

import { PropTypes } from '../types/mapTypes';

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
					<Marker
						tracksViewChanges={false}
						key={marker._id}
						coordinate={{
							latitude: marker.location.latitude,
							longitude: marker.location.longitude,
						}}
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
					</Marker>
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
