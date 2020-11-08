import React, { useState, useRef, useEffect } from 'react';
import MapView, { Polygon, Marker, LatLng, Region } from 'react-native-maps';
import {
	TouchableOpacity,
	Image,
	StyleSheet,
	Dimensions,
	ImageSourcePropType
} from 'react-native';

interface MarkerData {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
}

interface PropTypes {
	initRegion: Region;
	markers: MarkerData[];
	markerImg: ImageSourcePropType;
	polygonCoords: LatLng[];
	refresh: () => any;
}

const Map = ({
	initRegion,
	markers,
	markerImg,
	polygonCoords,
	refresh
}: PropTypes) => {
	const [_markers, setMarkers] = useState(markers);
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
						longitude: initRegion.longitude
					},
					zoom: 14.5
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
				showsMyLocationButton={true}
				style={styles.map}
				ref={mapRef}
			>
				<Polygon
					coordinates={polygonCoords}
					strokeColor="#0288d1"
					fillColor="#0288d110"
				/>
				{_markers.map((bot) => (
					<Marker
						key={bot.id}
						coordinate={{ latitude: bot.latitude, longitude: bot.longitude }}
						title={bot.name}
					>
						<Image style={styles.markerIcon} source={markerImg} />
					</Marker>
				))}
			</MapView>
			<TouchableOpacity style={styles.button} onPress={() => refresh()}>
				<Image
					style={styles.refreshIcon}
					source={require('../assets/refresh.png')}
				/>
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
		height: Dimensions.get('window').height
	},
	button: {
		position: 'absolute',
		bottom: 18,
		right: 75,
		width: 58,
		height: 58,
		borderRadius: 60,
		backgroundColor: '#fff',
		shadowColor: '#00000070',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	markerIcon: { width: 50, height: 50 },
	refreshIcon: {
		width: 30,
		height: 30,
		tintColor: '#777'
	}
});

export default Map;
