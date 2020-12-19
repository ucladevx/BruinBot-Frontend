import Axios from 'axios';

import { BASE_URL } from '../config';
import { MapNode } from '../types/apiTypes';

const axios = Axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

async function getMapNodes(latitude: number, longitude: number) {
	try {
		const data: MapNode[] = (
			await axios.get('/paths/nodes/location', {
				params: {
					latitude: latitude,
					longitude: longitude,
				},
			})
		).data;
		return data;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

export default { getMapNodes };
