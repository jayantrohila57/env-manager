"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEnvironments } from "../hooks/use-environments";
import { EnvironmentPanel } from "./environment-panel";
import { EnvironmentsTabsView } from "./environments-tabs-view";
import { ProjectDetailSkeleton } from "./skeletons";

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const {
    project,
    environments,
    status,
    activeTab,
    setActiveTab,
    createEnvironment,
    isCreating,
  } = useEnvironments(projectId);

  if (status === "loading") return <ProjectDetailSkeleton />;
  if (status === "error" || !project) {
    return (
      <div className="py-12 text-center">
        <h2 className="font-semibold text-xl">Project not found</h2>
        <Link href="/dashboard">
          <Button variant="link">Go back to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="font-bold text-2xl">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>
      </div>

      <EnvironmentsTabsView
        environments={environments}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreate={async (name) => {
          await createEnvironment({ projectId, name });
        }}
        isCreating={isCreating}
      >
        {(env) => <EnvironmentPanel environmentId={env.id} />}
      </EnvironmentsTabsView>
    </div>
  );
}
