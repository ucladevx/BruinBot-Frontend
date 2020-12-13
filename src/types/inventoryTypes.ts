import { ImageSourcePropType } from 'react-native';

export interface ItemProps {
	_id: string;
	name: string;
	price: number;
	imgSrc: string;
}

/**
 * Header has two two texts on the left and right, and an image in the middle
 */
export interface HeaderInfo {
	topLeft?: string;
	bottomLeft?: string;
	topRight?: string;
	bottomRight?: string;
	imgSrc: ImageSourcePropType;
}

export interface HeaderProps {
	height: number;
	info: HeaderInfo;

	/**
	 * True if the header is being used along with the menu, otherwise false. If
	 * used as a standalone, only the header will pop up at the bottom of the map
	 * and swiping does not bring up the rest of the menu.
	 */
	standalone: boolean;

	/**
	 * Callback for the button on the header. Could be used for anything
	 *
	 * @param bool Boolean for whether to show
	 */
	onButton?(bool: boolean): any;
}

export interface MapMenuProps {
	id: string;
	info: { [key: string]: HeaderInfo };
	items?: { [key: string]: ItemProps[] };
	collapsedHeight?: number;
	collapsable?: boolean;

	/**
	 * Function to change some map property, e.g. setVar of useState(), currently
	 * used to pass along MapScreen's setShowMap() hook to MapMenuHeader's onButton()
	 *
	 * @param val Value to be passed into the function
	 */
	setMapProperty?(val: any): any;
}
