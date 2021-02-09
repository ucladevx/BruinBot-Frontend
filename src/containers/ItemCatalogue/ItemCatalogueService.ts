import Axios from 'axios';

import { BASE_URL } from '../../config';
import { Bot } from '../../types/apiTypes';

const axios = Axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

async function updateInventory(
	botId: string,
	itemId: string,
	quantity: number
) {
	try {
		let data: string = (
			await axios.put('/bots/purchase', {
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
			await axios.get('bots/bot', {
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
