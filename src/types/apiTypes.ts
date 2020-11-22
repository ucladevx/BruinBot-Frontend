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
}

export interface BotItem {
	_id: string;
	quantity: number;
	item: Item;
}

export interface EventBot extends Bot {
	inventory: BotItem[];
}
