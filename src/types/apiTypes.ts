export interface BotLocation {
	latitude: number;
	longitude: number;
}

export interface Bot {
	_id: string;
	name: string;
	location: BotLocation;
}

export interface Item {
	_id: string;
	name: string;
	price: number;
	imgSrc: string;
}

export interface BotItem {
	_id: string;
	quantity: number;
	item: Item;
}

export interface UserData {
	_id: string;
	isOrganizer: boolean;
}

export interface EventBot extends Bot {
	inventory: BotItem[];
}
