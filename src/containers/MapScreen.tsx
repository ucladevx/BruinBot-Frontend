import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import MapComponent, { MapControlledTypes } from '../components/MapView';
import Inventory from '../components/InventoryView';

import CampusData from '../assets/campusCoords.json';
import Ham from '../assets/greenHam.jpg';
import Tank from '../assets/tank.png';
import Bot from '../assets/robot.png';
import Crane from '../assets/crane.png';
import Marker from '../assets/marker.png';

// placeholder data
const botCoords = [
	{
		id: 'A',
		name: 'Optimus',
		latitude: 34.0714,
		longitude: -118.4432,
	},
	{
		id: 'B',
		name: 'Bumble',
		latitude: 34.0735,
		longitude: -118.4439,
	},
	{
		id: 'C',
		name: 'Zilla',
		latitude: 34.0692,
		longitude: -118.4463,
	},
];

const botInfo = {
	A: {
		name: 'Optimus',
		distance: 0.5,
		inventorySize: 20,
		itemsSold: 15,
		imgSrc: Tank,
	},
	B: {
		name: 'Bumble',
		distance: 0.7,
		inventorySize: 15,
		itemsSold: 2,
		imgSrc: Crane,
	},
	C: {
		name: 'Zilla',
		distance: 0.2,
		inventorySize: 3,
		itemsSold: 5,
		imgSrc: Bot,
	},
};

const botInventories = {
	A: new Array(10).fill(null).map((_, idx) => ({
		id: idx,
		name: 'Green Eggs and Ham',
		price: 4.19,
		imgSrc: Ham,
	})),
	B: new Array(2).fill(null).map((_, idx) => ({
		id: idx,
		name: 'Green Eggs and Ham',
		price: 4.29,
		imgSrc: Ham,
	})),
	C: new Array(3).fill(null).map((_, idx) => ({
		id: idx,
		name: 'Green Eggs and Ham',
		price: 4.39,
		imgSrc: Ham,
	})),
};

const shuffleMarkers = (markers) => {
	// for testing purposes, randomly move around markers
	return markers.map((bot) => {
		bot[Math.random() > 0.5 ? 'latitude' : 'longitude'] +=
			Math.random() > 0.5 ? -0.0005 : 0.0005;
		return bot;
	});
};

// wrapper component that takes in a dynamically updated
// `id` prop from the MapComponent
const MapControlledComponent = ({ id }: MapControlledTypes) => (
	<Inventory id={id} info={botInfo} items={botInventories} />
);

const MapScreen = () => {
	const [markers, setMarkers] = useState(botCoords);
	return (
		<View style={styles.container}>
			<MapComponent
				initRegion={CampusData.region}
				markers={markers}
				markerImg={Marker}
				polygonCoords={CampusData.polygon.map(([lat, lng]) => ({
					latitude: lat,
					longitude: lng,
				}))}
				refresh={() => setMarkers(shuffleMarkers(markers))}
				ControlledComponent={MapControlledComponent}
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
