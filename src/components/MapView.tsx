import React, { useRef } from 'react';
import MapView, { Polygon, Marker, LatLng, Region } from 'react-native-maps';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';

import { PropTypes } from '../types/mapTypes';

const MapComponent = ({
	initRegion,
	markers,
	polygonCoords,
	refresh,
	selected,
	onSelect,
}: PropTypes) => {
	const mapRef = useRef<MapView>(null);

	const centerCamera = () => {
		if (mapRef && mapRef.current) {
			mapRef.current.animateCamera(
				{
					center: {
						latitude: initRegion.latitude,
						longitude: initRegion.longitude,
					},
					zoom: 14.5,
				},
				{ duration: 300 }
			);
		}
	};

	return (
		<>
			<MapView
				provider={'google'}
				initialRegion={{ ...initRegion }}
				onRegionChange={(coord) => {
					if (!coordInRegion(coord, initRegion)) {
						centerCamera();
					}
				}}
				showsUserLocation={true}
				showsMyLocationButton={false}
				style={styles.map}
				ref={mapRef}
			>
				<Polygon
					coordinates={polygonCoords}
					strokeColor="#0288d1"
					fillColor="rgba(2, 136, 209, 0.2)"
				/>
				{markers.map((marker) => (
					<Marker
						key={marker._id}
						coordinate={{
							latitude: marker.location.latitude,
							longitude: marker.location.longitude,
						}}
						title={marker.name}
						onPress={() => onSelect(marker._id)}
					>
						<Icon
							name="ios-pin"
							type="ionicon"
							size={40}
							color={marker._id === selected ? '#0288d1' : '#777'}
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
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	button: {
		position: 'absolute',
		bottom: 160,
		right: 8,
		width: 50,
		height: 50,
		borderRadius: 60,
		backgroundColor: '#fff',
		shadowColor: '#00000070',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default MapComponent;
