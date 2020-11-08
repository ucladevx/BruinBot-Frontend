import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Map from '../components/MapView';
import CampusData from '../assets/campusCoords.json';

let botCoords = [
	// placeholders
	{ id: 1, name: 'Optimus', latitude: 34.0714, longitude: -118.4432 },
	{ id: 2, name: 'Bumble', latitude: 34.0735, longitude: -118.4439 },
	{ id: 3, name: 'Zilla', latitude: 34.0692, longitude: -118.4463 }
];

const MapScreen = () => {
	const [markers, setMarkers] = useState(botCoords);

	const shuffleMarkers = () => {
		// for testing purposes, randomly move around markers
		setMarkers(
			markers.map((bot) => {
				bot[Math.random() > 0.5 ? 'latitude' : 'longitude'] +=
					Math.random() > 0.5 ? -0.0005 : 0.0005;
				return bot;
			})
		);
	};

	return (
		<View style={styles.container}>
			<Map
				initRegion={CampusData.region}
				markers={markers}
				markerImg={require('../assets/tank.png')}
				polygonCoords={CampusData.polygon.map(([lat, lng]) => ({
					latitude: lat,
					longitude: lng
				}))}
				refresh={() => shuffleMarkers()}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default MapScreen;
