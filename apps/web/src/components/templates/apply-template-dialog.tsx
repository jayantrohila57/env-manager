"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutTemplate } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";

export function ApplyTemplateDialog({
  environmentId,
}: {
  environmentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: templates } = useQuery(trpc.templates.list.queryOptions());

  const applyTemplate = useMutation(
    trpc.templates.applyTemplate.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        setOpen(false);
        setSelectedTemplateId("");
        queryClient.invalidateQueries();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleApply = () => {
    if (!selectedTemplateId) return;
    applyTemplate.mutate({
      environmentId,
      templateId: selectedTemplateId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <LayoutTemplate className="mr-2 h-4 w-4" />
            Apply Template
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply Template</DialogTitle>
          <DialogDescription>
            Select a template to apply to this environment. Existing variables
            will be skipped.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select
            value={selectedTemplateId}
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates?.data.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} ({template.variableCount} vars)
                </SelectItem>
              ))}
              {templates?.data.length === 0 && (
                <div className="p-2 text-center text-muted-foreground text-sm">
                  No templates found
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedTemplateId || applyTemplate.isPending}
          >
            {applyTemplate.isPending ? "Applying..." : "Apply Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
