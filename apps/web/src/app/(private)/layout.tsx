"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ModeToggle } from "@/components/mode-toggle";
import Shell from "@/components/shell";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserMenu from "@/components/user-menu";

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

export default function OrganizationLayout({
  children,
}: OrganizationLayoutProps) {
  return (
    <Shell>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 p-2.5 pt-4">
            <div className="flex w-full items-center justify-between gap-2 rounded-sm border bg-card/30 p-2">
              <div className="flex w-full flex-row items-center justify-start gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs />
              </div>
              <div className="flex w-full flex-row items-center justify-end gap-4">
                <ModeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
          <Shell.Main variant="dashboard" padding="none" scale={"dashboard"}>
            {children}
          </Shell.Main>
        </SidebarInset>
      </SidebarProvider>
    </Shell>
  );
}
