import Axios from 'axios';

import { BASE_URL } from '../config';
import { Bot } from '../types/apiTypes';

const axios = Axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

async function getEventBots(eventId: string) {
	try {
		let eventIdFake: string = "5ff79fe262764325a8a6ed98";
		const data: Bot[] = (
			await axios.get('events/bots', {
				params: { eventId: eventIdFake },
			})
		).data;
		return data;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

async function getAllBots() {
	try {
		const data: Bot[] = (await axios.get('/bots')).data;
		return data;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

async function getOneBot(botId: string) {
	try {
		let data: Bot = (
			await axios.get('/bots/bot', {
				params: {
					botId: botId,
				},
			})
		).data;
		return data;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

async function sendBot(botId: string, nodeId: string) {
	try {
		let data: Bot = (
			await axios.post('/bots/toNode', {
				nodeId: nodeId,
				botId: botId,
			})
		).data;
		console.log(data);
		return data;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export default { getEventBots, getAllBots, getOneBot, sendBot };
