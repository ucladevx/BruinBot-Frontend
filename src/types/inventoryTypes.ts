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
	info: HeaderInfo;
	items?: ItemProps[];
	collapsedHeight?: number;
	collapsable?: boolean;

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
