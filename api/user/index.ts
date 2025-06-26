import { useAuthStore } from '@/store/auth-store';
import apiCall from '../api';
import { LoginRequest, UserResponse, RegisterRequest } from './types';
import { clearStorage, setStorageItem } from '@/lib/storage';

export const getMe = async () => {
	try {
		const { data } = await apiCall.get<{ user: UserResponse }>('/user');

		const user = data.user;
		useAuthStore.getState().setUser(user);

		return user;
	} catch (error: any) {
		throw error;
	}
};

export const registration = async (body: RegisterRequest) => {
	const { data } = await apiCall.post<{ token: string }>('/user', body);
	return data?.token;
};

export const login = async (body: LoginRequest) => {
	const { data } = await apiCall.post<{ token: string }>('/user/auth', body);
	return data?.token;
};

export const logout = async () => {
	//post token
	try {
		await apiCall.post('/user/logout');
	} catch (error) {
		console.error('Error during logout:', error);
	}

	// clear storage anyway
	clearStorage();

	window.location.href = '/signin';
};

export const refreshToken = async () => {
	try {
		const { data } = await apiCall.get<{ token: string }>('/user/refresh-token');
		const newToken = data?.token;

		if (newToken) {
			setStorageItem('token', newToken);
		}

		return newToken;
	} catch (error: any) {
		// If refresh fails, clear storage and redirect to login
		clearStorage();
		window.location.href = '/signin';
		throw error;
	}
};
