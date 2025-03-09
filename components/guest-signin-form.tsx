'use client';

import type React from 'react';

import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LoginRequest } from '@/api/user/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/user';
import { setStorageItem } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { usePublicRoute } from '@/hooks/usePublicRoute';
import Link from 'next/link';

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
	usePublicRoute();

	const router = useRouter();
	const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);

	const { mutate, isPending } = useMutation({
		mutationFn: login,
		onSuccess: (token) => {
			setStorageItem('token', token);
			setIsAuthenticated(true);
			router.push('/dashboard');
		},
		onError: (error: any) => {
			setError('email', { message: error.message });
		},
	});

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<LoginRequest>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = handleSubmit((data) => {
		mutate(data);
	});

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>Enter your email below to login to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
								{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input id="password" type="password" placeholder="Password" {...register('password')} />
								{errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
							</div>
							<Button type="submit" className="w-full" disabled={isPending}>
								Login
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{' '}
							<Link href={'/signup'} className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
