"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

export function useTemplates() {
  const queryClient = useQueryClient();
  const templatesQuery = useQuery(trpc.templates.list.queryOptions());

  const deleteMutation = useMutation(
    trpc.templates.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.templates.list.queryKey(),
        });
        toast.success("Template deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const applyTemplateMutation = useMutation(
    trpc.templates.applyTemplate.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const status: "loading" | "error" | "empty" | "success" =
    templatesQuery.isLoading
      ? "loading"
      : templatesQuery.isError
        ? "error"
        : templatesQuery.data?.data.length === 0
          ? "empty"
          : "success";

  return {
    templates: templatesQuery.data?.data ?? [],
    status,
    error: templatesQuery.error,
    deleteTemplate: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    applyTemplate: applyTemplateMutation.mutateAsync,
    isApplying: applyTemplateMutation.isPending,
  };
}
