"use client";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./navmain";
import { NavUser } from "./nav-user";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
import { HelpCircle } from "../help-circle";

type UserData = {
  name?: string;
  email: string;
  avatar?: string;
};

export function AdminSidebar({
  userData,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userData: UserData;
}) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col items-center min-h-[70px] my-4 justify-center p-2 relative">
        {open && (
          <Image src="/opdlogo.svg" fill alt="" className="min-w-[120px]" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
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
        <HelpCircle />
        <SidebarTrigger />
        {children}
      </main>
    </>
  );
}
