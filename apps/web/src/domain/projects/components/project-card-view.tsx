"use client";

import { Folder } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  name: string;
  description: string | null;
}

interface ProjectCardViewProps {
  project: Project;
}

export function ProjectCardView({ project }: ProjectCardViewProps) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}` as Route}
      className="flex-1"
    >
      <Card className="group relative aspect-square gap-1 border bg-input/30">
        <CardHeader>
          <Folder />
        </CardHeader>
        <Separator className="my-2" />
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">
            {project.name}
          </CardTitle>
          <CardDescription>
            {project.description || "No description"}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
