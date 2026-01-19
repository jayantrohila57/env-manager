"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

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

  const status: "loading" | "error" | "empty" | "success" =
    projectsQuery.isLoading
      ? "loading"
      : projectsQuery.isError
        ? "error"
        : projectsQuery.data?.data.length === 0
          ? "empty"
          : "success";

  return {
    projects: projectsQuery.data?.data ?? [],
    status,
    error: projectsQuery.error,
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
