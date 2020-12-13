import Axios from 'axios';

import { MapNode } from '../types/apiTypes';
import sampleData from '../assets/sampleMapNodes.json';

const axios = Axios.create({
	baseURL:
		'http://bruinbot-load-balancer-1177858409.us-west-1.elb.amazonaws.com/',
	withCredentials: true,
});

// TODO: remove later
async function getMapNodesSample() {
	const data: MapNode[] = [
		{
			_id: '5fc86e16b9d0df06d8a3b95c',
			location: {
				_id: '5fc86e16b9d0df06d8a3b95b',
				latitude: 34.0714,
				longitude: -118.4439,
			},
			name: 'Powell Library',
			distance: 1.0,
			eta: 90,
			__v: 0,
		},
		{
			_id: '5fc86e16b9d0df06d8a3b959',
			location: {
				_id: '5fc86e16b9d0df06d8a3b958',
				latitude: 34.0735,
				longitude: -118.4432,
			},
			name: 'Sculpture Garden',
			distance: 5.0,
			eta: 60,
			__v: 0,
		},
		{
			_id: '5fc86e21b9d0df06d8a3b962',
			location: {
				_id: '5fc86e21b9d0df06d8a3b961',
				latitude: 34.067,
				longitude: -118.443,
			},
			name: 'Boelter Hall',
			distance: 15.0,
			eta: 80,
			__v: 0,
		},
	];
	return Promise.resolve(data);
}

export default { getMapNodesSample };
