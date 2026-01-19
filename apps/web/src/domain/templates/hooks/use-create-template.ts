"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

export function useCreateTemplate(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variables, setVariables] = useState<
    { id: string; key: string; value: string; description: string }[]
  >([{ id: crypto.randomUUID(), key: "", value: "", description: "" }]);

  const createMutation = useMutation(
    trpc.templates.create.mutationOptions({
      onSuccess: () => {
        toast.success("Template created successfully");
        setName("");
        setDescription("");
        setVariables([
          { id: crypto.randomUUID(), key: "", value: "", description: "" },
        ]);
        queryClient.invalidateQueries({
          queryKey: trpc.templates.list.queryKey(),
        });
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const addVariable = () => {
    setVariables([
      ...variables,
      { id: crypto.randomUUID(), key: "", value: "", description: "" },
    ]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter((v) => v.id !== id));
  };

  const updateVariable = (
    id: string,
    field: keyof (typeof variables)[0],
    value: string,
  ) => {
    setVariables(
      variables.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  const submit = async () => {
    if (!name) return;

    const filteredVariables = variables
      .filter((v) => v.key.trim() !== "")
      .map(({ id, ...v }) => v);

    await createMutation.mutateAsync({
      name,
      description,
      variables: filteredVariables,
    });
  };

  return {
    form: {
      name,
      setName,
      description,
      setDescription,
      variables,
      addVariable,
      removeVariable,
      updateVariable,
    },
    submit,
    isPending: createMutation.isPending,
  };
}
