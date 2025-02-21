'use client';

import * as React from 'react';
import { AudioWaveform, Command, GalleryVerticalEnd, SquareTerminal } from 'lucide-react';

import Link from 'next/link';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenuButton,
	SidebarRail,
} from '@/components/ui/sidebar';

const data = {
	teams: [
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
	navMain: [
		{
			title: 'Quizzes',
			url: '#',
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: 'All Quizzes',
					url: '/dashboard',
				},
				{
					title: 'Create Quiz',
					url: '/dashboard/quizzes/manage',
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						Q
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<Link href="/dashboard" className="truncate font-semibold">
							Quiz.Tools
						</Link>
					</div>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
