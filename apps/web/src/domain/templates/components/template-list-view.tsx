"use client";

import { TemplatesSkeleton } from "./skeletons";
import { TemplateCardView } from "./template-card-view";

interface Template {
  id: string;
  name: string;
  description: string | null;
  variableCount: number;
  updatedAt: string | Date;
}

interface TemplateListViewProps {
  templates: Template[];
  status: "loading" | "error" | "empty" | "success";
  onDelete: (template: Template) => void;
  isDeleting: boolean;
  EmptyState: React.ReactNode;
}

export function TemplateListView({
  templates,
  status,
  onDelete,
  isDeleting,
  EmptyState,
}: TemplateListViewProps) {
  switch (status) {
    case "loading":
      return <TemplatesSkeleton />;

    case "error":
      return (
        <div className="rounded-lg border border-destructive/50 p-8 text-center text-destructive">
          <p>Failed to load templates. Please try again.</p>
        </div>
      );

    case "empty":
      return <>{EmptyState}</>;

    case "success":
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCardView
              key={template.id}
              template={template}
              onDelete={() => onDelete(template)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      );
  }
}
