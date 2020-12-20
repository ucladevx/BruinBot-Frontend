import { LatLng, Region } from 'react-native-maps';
import { ImageSourcePropType } from 'react-native';

export interface Location {
	latitude: number;
	longitude: number;
}

export interface MarkerData {
	_id: string;
	name: string;
	location: Location;
}
export interface PropTypes {
	initRegion: Region;
	centralMarker?: MarkerData; // User's location, selected bot's location in order mode, etc.
	markers: MarkerData[]; // Rest of the markers, such as all bots or all map nodes
	markerImg?: ImageSourcePropType;
	polygonCoords?: LatLng[];
	lineCoords?: LatLng[][];
	mapNodes?: MarkerData[];
	refresh(): any;
	selected?: MarkerData;

	/**
	 * Function for when a marker is selected
	 *
	 * @param id Id of bot
	 * @param lat Latitude of bot
	 * @param lon Longitude of bot
	 */
	onSelect(marker: MarkerData): any;
}
