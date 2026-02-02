"use client";

import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const generateBreadcrumbs = (pathname: string) => {
  const pathArray = pathname?.split("/")?.filter(Boolean);
  const breadcrumbs = pathArray.map((path, index) => {
    const href = `/${pathArray?.slice(0, index + 1)?.join("/")}`;
    return { href, label: path };
  });
  return breadcrumbs;
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbs = generateBreadcrumbs(pathname);

  const handleBreadcrumbClick = (href: string) => {
    router.push(href as Route);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className={cn("", className)}>
        {breadcrumbs?.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb?.href}>
            <BreadcrumbSeparator className="first:hidden">
              {"/"}
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {index === breadcrumbs?.length - 1 ? (
                <BreadcrumbPage className="capitalize">
                  {breadcrumb?.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  className="capitalize"
                  href={breadcrumb?.href}
                  onClick={() => handleBreadcrumbClick(breadcrumb?.href)}
                >
                  {breadcrumb?.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
