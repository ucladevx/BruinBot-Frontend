import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapComponent from '../components/MapView';
import CampusData from '../assets/campusCoords.json';
import Tank from '../assets/tank.png';

let botCoords = [
	// placeholders
	{ id: 1, name: 'Optimus', latitude: 34.0714, longitude: -118.4432 },
	{ id: 2, name: 'Bumble', latitude: 34.0735, longitude: -118.4439 },
	{ id: 3, name: 'Zilla', latitude: 34.0692, longitude: -118.4463 },
];

const shuffleMarkers = (markers) => {
	// for testing purposes, randomly move around markers
	return markers.map((bot) => {
		bot[Math.random() > 0.5 ? 'latitude' : 'longitude'] +=
			Math.random() > 0.5 ? -0.0005 : 0.0005;
		return bot;
	});
};

const MapScreen = () => {
	const [markers, setMarkers] = useState(botCoords);
	return (
		<View style={styles.container}>
			<MapComponent
				initRegion={CampusData.region}
				markers={markers}
				markerImg={Tank}
				polygonCoords={CampusData.polygon.map(([lat, lng]) => ({
					latitude: lat,
					longitude: lng,
				}))}
				refresh={() => setMarkers(shuffleMarkers(markers))}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default MapScreen;
