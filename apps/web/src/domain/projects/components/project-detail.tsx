"use client";

import { Github, Globe } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EnvironmentPanel } from "../../environments/components/environment-panel";
import { EnvironmentsTabsView } from "../../environments/components/environments-tabs-view";
import { ProjectDetailSkeleton } from "../../environments/components/skeletons";
import { useEnvironments } from "../../environments/hooks/use-environments";

export default function ProjectDetail({
  projectSlug,
}: {
  projectSlug: string;
}) {
  const {
    project,
    environments,
    status,
    activeTab,
    setActiveTab,
    createEnvironment,
    isCreating,
    projectId,
  } = useEnvironments(projectSlug);

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
    <div className="space-y-4">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">{project.name}</CardTitle>
          <CardDescription className="max-w-xl text-muted-foreground">
            {project.description}
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-3">
              {project.repositoryUrl && (
                <Link
                  href={project.repositoryUrl as Route}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="View Repository"
                >
                  <Button variant={"ghost"} size="icon">
                    <Github className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {project.websiteUrl && (
                <Link
                  href={project.websiteUrl as Route}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="View Website"
                >
                  <Button variant={"ghost"} size="icon">
                    <Globe className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardAction>
        </CardHeader>
      </Card>
      <Separator />
      <EnvironmentsTabsView
        environments={environments}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreate={async (name) => {
          if (!projectId) return;
          await createEnvironment({ projectId, name });
        }}
        isCreating={isCreating}
      >
        {(env) => <EnvironmentPanel environmentId={env.id} />}
      </EnvironmentsTabsView>
    </div>
  );
}
