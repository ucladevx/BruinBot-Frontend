/* eslint-disable no-undef */
import Axios from 'axios';
import { Platform } from 'react-native';
import { BASE_URL } from '../config';

const axios = Axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

const addItem = async (
	name: string,
	price: number,
	eventId: string,
	uri: string,
	botId: string,
	quantity: number
) => {
	const img = {
		uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
		type: 'image/jpeg',
		name: uri.split('/').pop(),
		// Need to hack the following fields to avoid typescript error
		size: 0,
		arrayBuffer: () =>
			new Promise<ArrayBuffer>((resolve) => {
				//@ts-ignore
				resolve(undefined);
			}),
		slice: () => new Blob(),
		stream: () => new ReadableStream(),
		text: () =>
			new Promise<string>((resolve) => {
				resolve('');
			}),
	};
	const data = new FormData();
	data.append('name', name);
	data.append('price', `${price}`);
	data.append('eventId', eventId);
	data.append('img', img);
	const res = await axios({
		method: 'POST',
		url: '/items/add',
		data,
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	await axios.post('/bots/addItem', { botId, itemId: res.data._id, quantity });
};

export default { addItem };
