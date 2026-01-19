"use client";

import { useTemplates } from "../hooks/use-templates";
import { CreateTemplateDialog } from "./create-template-dialog";
import { TemplateListView } from "./template-list-view";

interface Template {
  id: string;
  name: string;
  description: string | null;
  variableCount: number;
  updatedAt: string | Date;
}

export default function TemplateList() {
  const { templates, status, deleteTemplate, isDeleting } = useTemplates();

  const handleDelete = async (template: Template) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      await deleteTemplate({ id: template.id });
    }
  };

  const EmptyState = (
    <div className="fade-in-50 col-span-full flex min-h-[200px] animate-in flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <h3 className="mt-4 font-semibold text-lg">No templates created</h3>
      <p className="mt-2 mb-4 text-muted-foreground text-sm">
        Create your first template to get started.
      </p>
      <CreateTemplateDialog />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Manage reusable environment templates.
          </p>
        </div>
        <CreateTemplateDialog />
      </div>

      <TemplateListView
        templates={templates}
        status={status}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        EmptyState={EmptyState}
      />
    </div>
  );
}
