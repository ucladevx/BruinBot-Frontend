import Axios from 'axios';

import { baseUrl } from '../config';
import { Bot } from '../types/apiTypes';

const axios = Axios.create({
	baseURL: baseUrl,
	withCredentials: true,
});

async function updateInventory(
	botId: string,
	itemId: string,
	quantity: number
) {
	try {
		let data: string = (
			await axios.post('/addItem', {
				botId: botId,
				itemId: itemId,
				quantity: quantity,
			})
		).data;
		return data;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

async function getBot(botId: string) {
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

export default { updateInventory, getBot };
