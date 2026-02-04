import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardSection from "@/components/section-dashboard";
import Shell from "@/components/shell";
import { ProjectDetailSkeleton } from "@/domain/environments/components/skeletons";

const ProjectDetail = dynamic(
  () => import("@/domain/environments/components/project-detail"),
  {
    loading: () => <ProjectDetailSkeleton />,
  },
);

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Project Details – ${id}`,
    description: `Manage project environments and variables for project ${id}.`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Shell>
      <Shell.Section variant="dashboard" padding="dashboard" scale="full">
        <DashboardSection
          title={`Project Details – ${id}`}
          description={`Manage project environments and variables for project ${id}.`}
        >
          <ProjectDetail projectId={id} />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
