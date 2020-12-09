import Axios from 'axios';

import { EventBot, Bot } from '../types/apiTypes';
import sampleData from '../assets/sampleData.json';

const axios = Axios.create({
	baseURL:
		'http://bruinbot-load-balancer-1177858409.us-west-1.elb.amazonaws.com/',
	withCredentials: true,
});

// TODO: remove later
async function getEventBotsSample() {
	const data: EventBot[] = sampleData;
	return Promise.resolve(data);
}

async function getEventBots(eventId: string) {
	try {
		const data: EventBot[] = (
			await axios.get('/events/bots', {
				data: { id: eventId },
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
	console.log(botId);
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

export default { getEventBots, getAllBots, getOneBot, getEventBotsSample };
