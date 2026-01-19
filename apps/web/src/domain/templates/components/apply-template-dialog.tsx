"use client";

import { LayoutTemplate } from "lucide-react";
import { useState } from "react";
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
import { useTemplates } from "../hooks/use-templates";

export function ApplyTemplateDialog({
  environmentId,
}: {
  environmentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const { templates, applyTemplate, isApplying } = useTemplates();

  const handleApply = async () => {
    if (!selectedTemplateId) return;
    await applyTemplate({
      environmentId,
      templateId: selectedTemplateId,
    });
    setOpen(false);
    setSelectedTemplateId("");
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
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} ({template.variableCount} vars)
                </SelectItem>
              ))}
              {templates.length === 0 && (
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
            disabled={!selectedTemplateId || isApplying}
          >
            {isApplying ? "Applying..." : "Apply Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
