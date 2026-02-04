import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardSection from "@/components/section-dashboard";
import Shell from "@/components/shell";
import { ProjectDetailSkeleton } from "@/domain/environments/components/skeletons";
import { deSlug } from "@/lib/utils";

const ProjectDetail = dynamic(
  () => import("@/domain/projects/components/project-detail"),
  {
    loading: () => <ProjectDetailSkeleton />,
  },
);

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projectTitle = deSlug(slug);

  return {
    title: projectTitle,
    description: `Manage project environments and variables for project ${projectTitle}.`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectTitle = deSlug(slug);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Shell>
      <Shell.Section variant="dashboard" padding="dashboard" scale="full">
        <DashboardSection
          title="Project Details"
          description={`Manage project environments and variables for project ${projectTitle}.`}
        >
          <ProjectDetail projectSlug={slug} />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
