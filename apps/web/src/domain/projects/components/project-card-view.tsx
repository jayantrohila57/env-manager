"use client";

import type { ProjectOutput } from "@env-manager/api/types";
import { Calendar, Folder, GitBranch, Github, Globe } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectCardViewProps {
  project: ProjectOutput;
}

export function ProjectCardView({ project }: ProjectCardViewProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.updatedAt));

  return (
    <Card className="min-h-80 border bg-input/30">
      <CardHeader>
        <CardTitle className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Folder className="h-5 w-5" />
        </CardTitle>
        <CardAction>
          {project.isPublic && <Badge variant="outline">Public</Badge>}
        </CardAction>
      </CardHeader>
      <CardHeader>
        <Link
          href={`/dashboard/projects/${project.id}` as Route}
          className="group block h-full"
        >
          <CardTitle>{project.name}</CardTitle>
        </Link>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          {project.isArchived && <Badge variant="outline">Archived</Badge>}
        </div>

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
      </CardFooter>
    </Card>
  );
}
