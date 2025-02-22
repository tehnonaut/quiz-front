'use client';

import * as React from 'react';
import { List, SquarePen } from 'lucide-react';

import Link from 'next/link';

import { NavMain } from '@/components/dashboard-nav';
import { NavUser } from '@/components/dashboard-nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenuButton,
	SidebarRail,
} from '@/components/ui/sidebar';

const data = {
	navMain: [
		{
			id: 'all-quizzes', //id for the element
			title: 'All Quizzes',
			url: '/dashboard',
			icon: List,
		},
		{
			id: 'create-quiz', //id for the element
			title: 'Create Quiz',
			url: '/dashboard/quizzes/manage',
			icon: SquarePen,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [isSidebarOpen, setSidebarOpen] = React.useState(true);

	const handleLinkClick = () => {
		setSidebarOpen(false);
	};

	return (
		<Sidebar collapsible="icon" aria-label="Main navigation" {...props}>
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
				<NavMain items={data.navMain} onLinkClick={handleLinkClick} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
