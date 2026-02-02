"use client";

import { FolderOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  description: string | null;
}

interface ProjectCardViewProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCardView({
  project,
  onEdit,
  onDelete,
}: ProjectCardViewProps) {
  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Link
            href={`/dashboard/projects/${project.id}` as Route}
            className="flex-1"
          >
            <CardTitle className="cursor-pointer text-base hover:underline">
              {project.name}
            </CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">
          {project.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/projects/${project.id}` as Route}>
          <Button variant="outline" size="sm" className="w-full">
            <FolderOpen className="mr-2 h-4 w-4" />
            Open Project
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
