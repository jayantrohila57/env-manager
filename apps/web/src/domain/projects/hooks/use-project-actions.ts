"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useProjects } from "./use-projects";

interface UseProjectActionsProps {
  projectId: string;
  onUpdate?: () => void;
}

export function useProjectActions({
  projectId,
  onUpdate,
}: UseProjectActionsProps) {
  const queryClient = useQueryClient();

  const {
    archiveProject,
    unarchiveProject,
    changeProjectStatus,
    toggleProjectPublic,
    deleteProject,
    isArchiving,
    isUnarchiving,
    isChangingStatus,
    isTogglingPublic,
    isDeleting,
  } = useProjects();

  // Get project details to check current state
  const projectQuery = useQuery(
    trpc.projects.get.queryOptions({ id: projectId }),
  );

  const handleArchive = async () => {
    try {
      await archiveProject({ id: projectId });
      onUpdate?.();
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({
        queryKey: trpc.projects.list.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ id: projectId }),
      });
    } catch (error) {
      console.error("Archive failed:", error);
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveProject({ id: projectId });
      onUpdate?.();
      queryClient.invalidateQueries({
        queryKey: trpc.projects.list.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ id: projectId }),
      });
    } catch (error) {
      console.error("Unarchive failed:", error);
    }
  };

  const handleChangeStatus = async (
    status: "active" | "inactive" | "maintenance",
  ) => {
    try {
      await changeProjectStatus({ id: projectId, status });
      onUpdate?.();
      queryClient.invalidateQueries({
        queryKey: trpc.projects.list.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ id: projectId }),
      });
    } catch (error) {
      console.error("Status change failed:", error);
    }
  };

  const handleTogglePublic = async () => {
    try {
      await toggleProjectPublic({ id: projectId });
      onUpdate?.();
      queryClient.invalidateQueries({
        queryKey: trpc.projects.list.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ id: projectId }),
      });
    } catch (error) {
      console.error("Toggle public failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject({ id: projectId });
      onUpdate?.();
      queryClient.invalidateQueries({
        queryKey: trpc.projects.list.queryKey(),
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return {
    project: projectQuery.data?.data.project,
    isLoading: projectQuery.isLoading,
    error: projectQuery.error,
    archiveProject: handleArchive,
    unarchiveProject: handleUnarchive,
    changeProjectStatus: handleChangeStatus,
    toggleProjectPublic: handleTogglePublic,
    deleteProject: handleDelete,
    isArchiving,
    isUnarchiving,
    isChangingStatus,
    isTogglingPublic,
    isDeleting,
  };
}
