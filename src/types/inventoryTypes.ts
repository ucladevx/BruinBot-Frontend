import { Bot } from './apiTypes';
import { ImageSourcePropType } from 'react-native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';

export interface ItemProps {
	_id: string;
	name: string;
	price: number;
	imgSrc: string;
	quantity?: number;
	bot: Bot;
}

export interface InventoryItemProps extends ItemProps {
	clickable?: boolean;
	navigation?: StackNavigationProp<RootStackParamList, 'ItemCatalogue'>;
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
	info: HeaderInfo;

	/**
	 * True if the header is being used along with the menu, otherwise false. If
	 * used as a standalone, only the header will pop up at the bottom of the map
	 * and swiping does not bring up the rest of the menu.
	 */
	standalone: boolean;

	// Configuration for button on the menu header
	button?: {
		title: string;
		/**
		 * Callback for the button on the header. Could be used for anything
		 *
		 * @param val Boolean for whether to show
		 */
		onButton(val: any): any;
	};
}

export interface MapMenuProps {
	id: string;
	info: { [key: string]: HeaderInfo };
	items?: { [key: string]: InventoryItemProps[] };
	collapsedHeight?: number;
	collapsable?: boolean;
	clickable?: boolean;
	navigation?: StackNavigationProp<RootStackParamList, 'ItemCatalogue'>;

	// TODO: This needs a refactor, since we are just passing button through to the header
	// Configuration for button on the menu header
	button?: {
		title: string;
		/**
		 * Callback for the button on the header. Could be used for anything
		 *
		 * @param val Boolean for whether to show
		 */
		onButton(val: any): any;
	};
}
