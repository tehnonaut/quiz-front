'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStorageItem } from '@/lib/storage';
import { jwtDecode } from 'jwt-decode';
export const usePublicRoute = () => {
	const router = useRouter();

	useEffect(() => {
		const token = getStorageItem('token');

		//detect if the token is expired
		if (token) {
			const decodedToken = jwtDecode(token);
			if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
				localStorage.removeItem('token');
			}
		}

		if (token) router.push('/dashboard');
	}, []);
};
