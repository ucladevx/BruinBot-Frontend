import { ImageSourcePropType } from 'react-native';

export interface ItemProps {
	_id: string;
	name: string;
	price: number;
	imgSrc: ImageSourcePropType;
}

export interface VendorInfo {
	name: string;
	distance: number;
	inventorySize: number;
	itemsSold: number;
	imgSrc: ImageSourcePropType;
}

export interface HeaderProps {
	height: number;
	vendor: VendorInfo;
}

export interface InventoryProps {
	id: string;
	info: { [key: string]: VendorInfo };
	items: { [key: string]: ItemProps[] };
	collapsedHeight?: number;
}
