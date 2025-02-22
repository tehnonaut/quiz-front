import { useAuthStore } from '@/store/auth-store';
import apiCall from '../api';
import { LoginRequest, UserResponse, RegisterRequest } from './types';
import { clearStorage } from '@/lib/storage';

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
	clearStorage();

	window.location.href = '/signin';
};
