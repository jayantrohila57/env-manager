import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSection from "@/components/section-dashboard";
import Shell from "@/components/shell";
import { ProjectDetailSkeleton } from "@/domain/environments/components/skeletons";
import { siteConfig } from "@/lib/siteConfig";

const ProjectDetail = dynamic(
  () => import("@/domain/environments/components/project-detail"),
  {
    loading: () => <ProjectDetailSkeleton />,
  },
);

export const metadata: Metadata = {
  title: "Project Details",
  description: `Manage project environments and variables in ${siteConfig.name}.`,
};

const header = {
  title: "Project Details",
  description: "Manage project environments and variables",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...header}>
          <ProjectDetail projectId={id} />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
