import React, { useState, useRef, useEffect } from 'react';
import MapView, { Polygon, Marker, LatLng, Region } from 'react-native-maps';
import {
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	ImageSourcePropType,
} from 'react-native';
import { Icon } from 'react-native-elements';

interface MarkerData {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
}

export interface MapControlledTypes {
	id: string;
}

interface PropTypes {
	initRegion: Region;
	markers: MarkerData[];
	markerImg?: ImageSourcePropType;
	polygonCoords: LatLng[];
	refresh(): any;
	ControlledComponent(_: MapControlledTypes): any;
}

const MapComponent = ({
	initRegion,
	markers,
	polygonCoords,
	refresh,
	ControlledComponent,
}: PropTypes) => {
	const [_markers, setMarkers] = useState(markers);
	const [selectedMarker, setSelected] = useState(
		markers.length && markers[0].id
	);

	const mapRef = useRef<MapView>(null);

	useEffect(() => {
		setMarkers(markers);
	}, [markers]);

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
					fillColor="#0288d110"
				/>
				{_markers.map((marker) => (
					<Marker
						key={marker.id}
						coordinate={{
							latitude: marker.latitude,
							longitude: marker.longitude,
						}}
						title={marker.name}
						onPress={() => setSelected(marker.id)}
					>
						<Icon
							name="ios-pin"
							type="ionicon"
							size={40}
							color={marker.id === selectedMarker ? '#0288d1' : '#777'}
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
			<ControlledComponent id={selectedMarker} />
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
