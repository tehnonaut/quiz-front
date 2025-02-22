'use client';

import { getMe } from '@/api/user';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type Props = {
	children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
	const router = useRouter();
	useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			try {
				const user = await getMe();
				return user;
			} catch (error) {
				toast({
					title: 'Error fetching user',
					description: 'Please try again',
					variant: 'destructive',
				});
				router.push('/signin');
				localStorage.removeItem('token');
				return null;
			}
		},
	});

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<main className="flex-1 p-4">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
