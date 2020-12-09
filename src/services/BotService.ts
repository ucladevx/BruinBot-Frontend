import Axios from 'axios';

import { EventBot, Bot } from '../types/apiTypes';

const axios = Axios.create({
	baseURL:
		'http://bruinbot-load-balancer-1177858409.us-west-1.elb.amazonaws.com/',
	withCredentials: true,
});

async function getEventBots(eventId: string) {
	try {
		const data: EventBot[] = (
			await axios.get('/events/bots', {
				params: { eventId },
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

export default { getEventBots, getAllBots, getOneBot };
