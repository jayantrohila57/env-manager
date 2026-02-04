"use client";

import type { ProjectOutput } from "@env-manager/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

// Interface for API response before transformation
interface ApiProject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  isArchived: boolean;
  isPublic: boolean;
  repositoryUrl: string | null;
  websiteUrl: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Helper function to transform API response to proper ProjectOutput type
function transformProject(project: ApiProject): ProjectOutput {
  return {
    ...project,
    status: project.status as "active" | "inactive" | "maintenance",
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  };
}

export function useProjects() {
  const queryClient = useQueryClient();
  const projectsQuery = useQuery(trpc.projects.list.queryOptions());

  const createMutation = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        });
        toast.success("Project created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        });
        toast.success("Project updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        });
        toast.success("Project deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const archiveMutation = useMutation(
    trpc.projects.archive.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        });
        toast.success("Project archived successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const unarchiveMutation = useMutation(
    trpc.projects.unarchive.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        });
        toast.success("Project unarchived successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const changeStatusMutation = useMutation(
    trpc.projects.changeStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        });
        toast.success("Project status updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const togglePublicMutation = useMutation(
    trpc.projects.togglePublic.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.queryKey(),
        });
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const status: "loading" | "error" | "empty" | "success" =
    projectsQuery.isLoading
      ? "loading"
      : projectsQuery.isError
        ? "error"
        : projectsQuery.data?.data.length === 0
          ? "empty"
          : "success";

  return {
    projects: (projectsQuery.data?.data ?? []).map(transformProject),
    status,
    error: projectsQuery.error,
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    archiveProject: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
    unarchiveProject: unarchiveMutation.mutateAsync,
    isUnarchiving: unarchiveMutation.isPending,
    changeProjectStatus: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,
    toggleProjectPublic: togglePublicMutation.mutateAsync,
    isTogglingPublic: togglePublicMutation.isPending,
  };
}
