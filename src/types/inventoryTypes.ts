import { ImageSourcePropType } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export interface ItemProps {
	_id: string;
	name: string;
	price: number;
	imgSrc: string;
}

export interface InventoryItemProps extends ItemProps {
	clickable?: boolean;
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
	 * @param val Boolean for whether to show
	 */
	onButton?(val: any): any;
}

export interface MapMenuProps {
	id: string;
	info: { [key: string]: HeaderInfo };
	items?: { [key: string]: InventoryItemProps[] };
	collapsedHeight?: number;
	collapsable?: boolean;
	clickable?: boolean;

	/**
	 * Function to change some map property, e.g. setVar of useState()
	 *
	 * @param val Value to be passed into the function
	 */
	setMapProperty?(val: any): any;
}
