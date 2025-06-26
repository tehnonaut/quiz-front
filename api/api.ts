import Axios from 'axios';
import { getStorageItem } from '../lib/storage';
import { handleTokenRefresh } from '../lib/token-utils';

const apiCall = Axios.create({});

export const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

apiCall.interceptors.request.use(
	async (config) => {
		// Skip token refresh for the refresh token endpoint to avoid infinite loops
		if (config.url === '/user/refresh-token') {
			const token = getStorageItem('token');
			config.baseURL = baseURL;
			if (token) config.headers.Authorization = `Bearer ${token}`;
			return config;
		}

		// Handle token refresh for other endpoints
		const token = await handleTokenRefresh();

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
		// Handle 401 Unauthorized responses
		if (error.response?.status === 401) {
			// Clear storage and redirect to login
			if (typeof window !== 'undefined') {
				localStorage.clear();
				window.location.href = '/signin';
			}
		}
		return Promise.reject(error);
	}
);

export default apiCall;
