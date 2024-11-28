"use client";
import * as React from "react";
import { Bot, CodeXml, FileUserIcon, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavItem, NavMain } from "./navmain";
import { NavUser } from "./nav-user";
import Image from "next/image";

type UserData = {
  name?: string;
  email: string;
  avatar?: string;
};

const navMain: NavItem[] = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
    iconClassName: "min-w-[25px] min-h-[25px]",
    isActive: true,
  },
  {
    title: "Modifica el contenido",
    url: "/admin/content",
    icon: Bot,
    iconClassName: "min-w-[25px] min-h-[25px]",
    isActive: true,
  },
  {
    title: "Admin Whitelist",
    url: "/admin/whitelist",
    icon: FileUserIcon,
    iconClassName: "min-w-[25px] min-h-[25px]",
    isActive: true,
  },

  {
    title: "Creador de Iframes",
    url: "/admin/iframes",
    icon: CodeXml,
    iconClassName: "min-w-[25px] min-h-[25px]",
    isActive: true,
  },
];

export function AdminSidebar({
  userData,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userData: UserData }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col items-center min-h-[70px] my-4 justify-center p-2 relative">
        <Image src="/opdlogo.svg" fill alt="" className="min-w-[120px]" />
      </SidebarHeader>
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
