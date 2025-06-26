'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStorageItem } from '@/lib/storage';
import { handleTokenRefresh } from '@/lib/token-utils';

export const usePublicRoute = () => {
	const router = useRouter();

	useEffect(() => {
		const checkToken = async () => {
			const token = getStorageItem('token');

			if (token) {
				try {
					const validToken = await handleTokenRefresh();
					if (validToken) {
						router.push('/dashboard');
					}
					// If validToken is null, user stays on public route
				} catch (error) {
					console.error('Token validation failed:', error);
				}
			}
		};

		checkToken();
	}, [router]);
};
