"use client";

import { useVariables } from "../hooks/use-variables";
import { AddVariableDialog } from "./add-variable-dialog";
import { VariablesSkeleton } from "./skeletons";
import { VariablesTableView } from "./variables-table-view";

interface Variable {
  id: string;
  key: string;
}

export function EnvironmentPanel({ environmentId }: { environmentId: string }) {
  const {
    variables,
    status,
    revealedIds,
    toggleReveal,
    createVariable,
    isCreating,
    deleteVariable,
  } = useVariables(environmentId);

  const handleCreate = async (data: { key: string; value: string }) => {
    await createVariable({ environmentId, ...data });
  };

  const handleCopy = (id: string) => {
    console.log("Copy variable", id);
  };

  const handleEdit = (variable: Variable) => {
    console.log("Edit variable", variable);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this variable?")) {
      await deleteVariable({ id });
    }
  };

  if (status === "loading") return <VariablesSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Variables</h3>
        <div className="flex items-center gap-2">
          <AddVariableDialog onConfirm={handleCreate} isPending={isCreating} />
        </div>
      </div>

      <VariablesTableView
        variables={variables}
        revealedIds={revealedIds}
        onReveal={toggleReveal}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddVariable={handleCreate}
        isAddingVariable={isCreating}
      />
    </div>
  );
}
