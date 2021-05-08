import { RootStackParamList as BottomRootStackParamList } from '../Navbar/BottomBarNavigator';
import { ImageSourcePropType } from 'react-native';
import { LatLng, Region } from 'react-native-maps';
import { RootStackParamList } from '../../../App';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export interface Location {
	latitude: number;
	longitude: number;
}

export interface MarkerData {
	_id: string;
	name: string;
	location: Location;
	type: string;
}
export interface CalloutProps {
	marker: MarkerData;
	onButtonPress(marker: MarkerData): any;
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
	isMapPath?: boolean;

	/**
	 * Function for when a marker is selected
	 *
	 * @param id Id of bot
	 * @param lat Latitude of bot
	 * @param lon Longitude of bot
	 */
	onSelect(marker: MarkerData): any;
	onNodeSelect(marker: MarkerData): any;
}

export interface MapScreenProps {
	route: RouteProp<BottomRootStackParamList, 'Map'>;
	navigation: StackNavigationProp<RootStackParamList, 'BottomBar'>;
}
