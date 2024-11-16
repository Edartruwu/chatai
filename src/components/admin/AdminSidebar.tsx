"use client";
import * as React from "react";
import { Bot, FileUserIcon, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "./navmain";
import { NavUser } from "./nav-user";

type UserData = {
  name?: string;
  email: string;
  avatar?: string;
};

const navMain = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
    isActive: true,
  },
  {
    title: "Modifica el contenido",
    url: "/admin/content",
    icon: Bot,
    isActive: true,
  },
  {
    title: "Admin Whitelist",
    url: "/admin/whitelist",
    icon: FileUserIcon,
    isActive: true,
  },
];

export function AdminSidebar({
  userData,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userData: UserData }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function AdminLayout({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: UserData;
}) {
  return (
    <>
      <AdminSidebar userData={userData} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </>
  );
}
