"use client";

import Link from "next/link";
import { ProjectList } from "@/components/projects";
import type { authClient } from "@/lib/auth-client";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>
        <Link href="/audit" className="text-primary text-sm hover:underline">
          View Audit Logs
        </Link>
      </div>
      <ProjectList />
    </div>
  );
}
