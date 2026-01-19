"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

export function useEnvironments(projectId: string) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | undefined>();

  const projectQuery = useQuery(
    trpc.projects.get.queryOptions({ id: projectId }),
  );

  const createEnvMutation = useMutation(
    trpc.environments.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.get.queryKey({ id: projectId }),
        });
        toast.success("Environment created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const status: "loading" | "error" | "success" = projectQuery.isLoading
    ? "loading"
    : projectQuery.isError
      ? "error"
      : "success";

  const projectData = projectQuery.data?.data ?? {
    project: null,
    environments: [],
  };
  const currentTab = activeTab ?? projectData.environments[0]?.id;

  return {
    project: projectData.project,
    environments: projectData.environments,
    status,
    activeTab: currentTab,
    setActiveTab,
    createEnvironment: createEnvMutation.mutateAsync,
    isCreating: createEnvMutation.isPending,
  };
}
