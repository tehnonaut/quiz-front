'use client';

import { type LucideIcon } from 'lucide-react';

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavMain({
	items,
	onLinkClick,
}: {
	items: {
		id: string;
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
	}[];
	onLinkClick: () => void;
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title} id={item.id}>
						<SidebarMenuButton asChild tooltip={item.title}>
							<Link href={item.url} onClick={onLinkClick} aria-label={item.title} aria-describedby={item.id}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
