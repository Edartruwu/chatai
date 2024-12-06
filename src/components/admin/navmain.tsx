"use client";
import {
  Bot,
  CodeXml,
  FileUserIcon,
  Home,
  type LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  iconClassName?: string;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
    iconClassName?: string;
  }[];
}

export function NavMain() {
  const t = useTranslations("sidebar");

  const items: NavItem[] = [
    {
      title: `${t("home")}`,
      url: "/admin",
      icon: Home,
      iconClassName: "min-w-[25px] min-h-[25px]",
      isActive: true,
    },
    {
      title: `${t("content")}`,
      url: "/admin/content",
      icon: Bot,
      iconClassName: "min-w-[25px] min-h-[25px]",
      isActive: true,
    },
    {
      title: `${t("whitelist")}`,
      url: "/admin/whitelist",
      icon: FileUserIcon,
      iconClassName: "min-w-[25px] min-h-[25px]",
      isActive: true,
    },

    {
      title: `${t("iframes")}`,
      url: "/admin/iframes",
      icon: CodeXml,
      iconClassName: "min-w-[25px] min-h-[25px]",
      isActive: true,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              tooltip={item.title}
              className="min-h-[50px] min-w-[80px]"
            >
              <a href={item.url}>
                {item.icon && (
                  <item.icon className={item.iconClassName || "size-8"} />
                )}
                <span className="text-md">{item.title}</span>
              </a>
            </SidebarMenuButton>
            {item.items && item.items.length > 0 && (
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.url}>
                        {subItem.icon && (
                          <subItem.icon
                            className={subItem.iconClassName || "size-8"}
                          />
                        )}
                        <span className="text-md">{subItem.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
