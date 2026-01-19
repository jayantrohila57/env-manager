"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export default function TemplatesPage() {
  const {
    data: templates,
    isLoading,
    refetch,
  } = useQuery(trpc.templates.list.queryOptions());
  const deleteTemplate = useMutation(
    trpc.templates.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Template deleted");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Manage reusable environment templates.
          </p>
        </div>
        <CreateTemplateDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates?.data.length === 0 && (
          <div className="fade-in-50 col-span-full flex min-h-[200px] animate-in flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 font-semibold text-lg">No templates created</h3>
            <p className="mt-2 mb-4 text-muted-foreground text-sm">
              Create your first template to get started.
            </p>
            <CreateTemplateDialog />
          </div>
        )}

        {templates?.data.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="mt-1.5 line-clamp-2">
                    {template.description || "No description"}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this template?")
                    ) {
                      deleteTemplate.mutate({ id: template.id });
                    }
                  }}
                  disabled={deleteTemplate.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">
                    {template.variableCount}
                  </span>
                  variables
                </div>
                <div>•</div>
                <div>
                  Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
