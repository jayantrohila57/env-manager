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
import { UserMenu } from "@/domain/auth/components/user-menu";

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
          <div className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 group-has-data-[collapsible=icon]/sidebar-wrapper:px-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex w-full flex-row items-center justify-start">
                <SidebarTrigger className="-ml-0.5" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <div className="hidden md:block">
                  <Breadcrumbs />
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-end gap-4">
                <ModeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
          <Separator />
          <div className="block p-5 md:hidden">
            <Breadcrumbs />
          </div>
          <Separator />
          <Shell.Main variant="dashboard" padding="none" scale={"dashboard"}>
            {children}
          </Shell.Main>
        </SidebarInset>
      </SidebarProvider>
    </Shell>
  );
}
