import Axios from 'axios';

import { EventBot } from '../types/apiTypes';
import sampleData from '../assets/sampleData.json';

const baseUrl = 'http://localhost:5000';

async function getEventBotsSample() {
	const data: EventBot[] = sampleData;
	return Promise.resolve(data);
}

async function getEventBots(eventId: string) {
	const data: EventBot[] = await Axios.get(baseUrl + '/events/bots', {
		data: { id: eventId },
	});
	return data;
}

export default { getEventBots, getEventBotsSample };
