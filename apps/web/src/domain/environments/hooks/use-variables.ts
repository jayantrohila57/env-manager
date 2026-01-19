"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

export function useVariables(environmentId: string) {
  const queryClient = useQueryClient();
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const variablesQuery = useQuery(
    trpc.environmentVariables.list.queryOptions({ environmentId }),
  );

  const createMutation = useMutation(
    trpc.environmentVariables.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.environmentVariables.list.queryKey({ environmentId }),
        });
        toast.success("Variable created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.environmentVariables.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.environmentVariables.list.queryKey({ environmentId }),
        });
        toast.success("Variable updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.environmentVariables.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.environmentVariables.list.queryKey({ environmentId }),
        });
        toast.success("Variable deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const bulkImportMutation = useMutation(
    trpc.environmentVariables.bulkImport.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.environmentVariables.list.queryKey({ environmentId }),
        });
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const toggleReveal = async (varId: string) => {
    if (revealedIds.has(varId)) {
      setRevealedIds((prev) => {
        const next = new Set(prev);
        next.delete(varId);
        return next;
      });
    } else {
      const result = await queryClient.fetchQuery(
        trpc.environmentVariables.get.queryOptions({ id: varId }),
      );
      if (result?.data) {
        setRevealedIds((prev) => new Set(prev).add(varId));
        queryClient.setQueryData(["revealedValue", varId], result.data.value);
      }
    }
  };

  const status: "loading" | "error" | "empty" | "success" =
    variablesQuery.isLoading
      ? "loading"
      : variablesQuery.isError
        ? "error"
        : variablesQuery.data?.data.length === 0
          ? "empty"
          : "success";

  return {
    variables: variablesQuery.data?.data ?? [],
    status,
    revealedIds,
    toggleReveal,
    createVariable: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateVariable: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteVariable: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    bulkImport: bulkImportMutation.mutateAsync,
    isImporting: bulkImportMutation.isPending,
  };
}
