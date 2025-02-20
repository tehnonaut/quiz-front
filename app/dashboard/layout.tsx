"use client";

import { getMe } from "@/api/user";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  useQuery({ queryKey: ["user"], queryFn: getMe });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
