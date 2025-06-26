import { jwtDecode } from 'jwt-decode';
import { getStorageItem, setStorageItem, clearStorage } from './storage';
import { refreshToken } from '@/api/user';

export const isTokenExpired = (token: string): boolean => {
	try {
		const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000;
		return decodedToken.exp ? decodedToken.exp < currentTime : true;
	} catch (error) {
		return true;
	}
};

export const isTokenExpiringSoon = (token: string, daysThreshold: number = 2): boolean => {
	try {
		const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000;
		const thresholdTime = daysThreshold * 24 * 60 * 60; // Convert days to seconds

		return decodedToken.exp ? decodedToken.exp < currentTime + thresholdTime : true;
	} catch (error) {
		return true;
	}
};

export const handleTokenRefresh = async (): Promise<string | null> => {
	try {
		const token = getStorageItem('token');

		if (!token) {
			return null;
		}

		// Check if token is expired
		if (isTokenExpired(token)) {
			clearStorage();
			return null;
		}

		// Check if token is expiring soon (within 2 days)
		if (isTokenExpiringSoon(token)) {
			const newToken = await refreshToken();
			return newToken;
		}

		return token;
	} catch (error) {
		console.error('Token refresh failed:', error);
		clearStorage();
		return null;
	}
};
