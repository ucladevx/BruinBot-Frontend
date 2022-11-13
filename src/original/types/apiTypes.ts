/**
 * Extend your api interfaces from ApiResponse, as it allows you to match objects
 * that have fields that are not specified. This is useful because if a field is
 * added to a model in the backend and the HTTP call now returns an object with an
 * extra, unexpected field, our code will not break. However, if a field is removed,
 * then we definitely must also remove it from the appropriate api type interface.
 */
export interface ApiResponse {
	[key: string]: any;
}

export interface Location extends ApiResponse {
	latitude: number;
	longitude: number;
}

export interface Bot extends ApiResponse {
	_id: string;
	name: string;
	location: Location;
	status: String;
}

export interface Item extends ApiResponse {
	_id: string;
	name: string;
	price: number;
	imgSrc: string;
}

export interface BotItem extends ApiResponse {
	_id: string;
	quantity: number;
	item: Item;
}

export interface UserData extends ApiResponse {
	_id: string;
	eventId: string | null;
}

export interface EventBot extends Bot {
	inventory: BotItem[];
	path: Location[];
}

export interface MapNode extends ApiResponse {
	_id: string;
	location: Location;
	name?: string;
	distance: number;
	eta: number;
}

export interface Path extends ApiResponse {
	_id: string;
	points: Location[];
	nodeA: MapNode;
	nodeB: MapNode;
}
