"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { siteConfig } from "@/lib/siteConfig";

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          variant={"default"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="/favicon/favicon.ico" alt={siteConfig.name} />
            <AvatarFallback className="rounded-lg">
              {siteConfig.name
                ? siteConfig.name.slice(0, 2).toUpperCase()
                : "NA"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{siteConfig.name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
