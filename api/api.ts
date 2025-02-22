import Axios from 'axios';
import { getStorageItem } from '../lib/storage';

const apiCall = Axios.create({});

export const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

apiCall.interceptors.request.use(
	(config) => {
		const token = getStorageItem('token');

		config.baseURL = baseURL;
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiCall.interceptors.response.use(
	(response) => {
		return {
			...response,
			data: response.data,
		};
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiCall;
