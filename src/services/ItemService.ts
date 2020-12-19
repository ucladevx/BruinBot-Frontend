import Axios from 'axios';

import { baseUrl } from '../config';
import { Platform } from 'react-native';

const axios = Axios.create({
	baseURL: baseUrl,
	withCredentials: true,
});

const addItem = async (
	name: string,
	price: number,
	eventId: string,
	uri: string
) => {
	const img = {
		uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
		type: 'image/jpeg',
		name: uri.split('/').pop(),
	};
	const data = new FormData();
	data.append('name', name);
	data.append('price', price);
	data.append('eventId', eventId);
	data.append('img', img);
	await axios({
		method: 'POST',
		url: '/items/add',
		data,
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

export default { addItem };
