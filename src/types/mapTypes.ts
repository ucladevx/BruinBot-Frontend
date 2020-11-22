import { LatLng, Region } from 'react-native-maps';
import { ImageSourcePropType } from 'react-native';

export interface MarkerLocation {
	latitude: number;
	longitude: number;
}

export interface MarkerData {
	_id: string;
	name: string;
	location: MarkerLocation;
}

export interface PropTypes {
	initRegion: Region;
	markers: MarkerData[];
	markerImg?: ImageSourcePropType;
	polygonCoords?: LatLng[];
	lineCoords?: LatLng[];
	refresh(): any;
	selected: string;
	onSelect(id: string): any;
}
