"use client";

import { Github } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";

export default function Header() {
  const links: Array<{ to: string; label: string }> = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/templates", label: "Templates" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
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
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <ModeToggle />
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}
