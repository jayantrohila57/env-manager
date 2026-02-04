"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useProjects } from "../hooks/use-projects";
import { ProjectCardView } from "./project-card-view";
import { ProjectsSkeleton } from "./skeletons";

export default function ProjectList() {
  const { projects, status } = useProjects();

  switch (status) {
    case "loading":
      return <ProjectsSkeleton />;
    case "error":
      return (
        <div className="rounded-lg border border-destructive/50 p-8 text-center text-destructive">
          <p>Failed to load projects. Please try again.</p>
        </div>
      );
    case "empty":
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Plus className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to start managing environment variables.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </EmptyContent>
        </Empty>
      );
    case "success":
      return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCardView key={project.id} project={project} />
          ))}
        </div>
      );
  }
}
