"use client";

import { Plus, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTemplate } from "../hooks/use-create-template";

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const { form, submit, isPending } = useCreateTemplate(() => setOpen(false));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Environment Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for your environments. Add default
              variables that will be applied when using this template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => form.setName(e.target.value)}
                  placeholder="e.g. Node.js Starter"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => form.setDescription(e.target.value)}
                  placeholder="Brief description of this template"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Default Variables</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={form.addVariable}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variable
                </Button>
              </div>

              <div className="space-y-3">
                {form.variables.map((variable) => (
                  <div key={variable.id} className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="KEY"
                        value={variable.key}
                        onChange={(e) =>
                          form.updateVariable(
                            variable.id,
                            "key",
                            e.target.value.toUpperCase(),
                          )
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Value (Optional)"
                        value={variable.value}
                        onChange={(e) =>
                          form.updateVariable(
                            variable.id,
                            "value",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => form.removeVariable(variable.id)}
                      disabled={form.variables.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
