"use client";

import type { Route } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links: Array<{ to: string; label: string }> = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/templates", label: "Templates" },
  ];

  return (
    <header className="container mx-auto flex h-full w-full items-center justify-between">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-4 font-medium text-sm md:flex">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                href={to as Route}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            <ModeToggle />
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
