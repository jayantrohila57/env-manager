"use client";

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
      </div>
      <ProjectList />
    </div>
  );
}
