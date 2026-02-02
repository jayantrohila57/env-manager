"use client";

import type * as React from "react";
import { Suspense } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-black" {...props}>
      <SidebarHeader className="mb-2 rounded-sm border bg-card/30">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="rounded-sm border bg-card/30">
        <Suspense fallback={<div>Loading navigation...</div>}>
          <NavMain />
        </Suspense>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
