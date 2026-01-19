import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectsSkeleton } from "@/domain/projects/components/skeletons";
import { siteConfig } from "@/lib/siteConfig";

const ProjectList = dynamic(
  () => import("@/domain/projects/components/project-list"),
  {
    loading: () => <ProjectsSkeleton />,
  },
);

export const metadata: Metadata = {
  title: "Dashboard",
  description: `Manage your projects and environment variables in ${siteConfig.name}.`,
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container relative z-10 mx-auto space-y-6 px-4 py-8">
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
