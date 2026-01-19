"use client";

import { useMutation } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variables, setVariables] = useState<
    { id: string; key: string; value: string; description: string }[]
  >([{ id: crypto.randomUUID(), key: "", value: "", description: "" }]);
  const router = useRouter();

  const createTemplate = useMutation(
    trpc.templates.create.mutationOptions({
      onSuccess: () => {
        toast.success("Template created successfully");
        setOpen(false);
        setName("");
        setDescription("");
        setVariables([
          { id: crypto.randomUUID(), key: "", value: "", description: "" },
        ]);
        router.refresh();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const filteredVariables = variables
      .filter((v) => v.key.trim() !== "")
      .map(({ id, ...v }) => v);

    createTemplate.mutate({
      name,
      description,
      variables: filteredVariables,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Environment Template</DialogTitle>
          <DialogDescription>
            Create a reusable template for your environments. Add default
            variables that will be applied when using this template.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Node.js Starter"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                onClick={addVariable}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Variable
              </Button>
            </div>

            <div className="space-y-3">
              {variables.map((variable) => (
                <div key={variable.id} className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="KEY"
                      value={variable.key}
                      onChange={(e) =>
                        updateVariable(
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
                        updateVariable(variable.id, "value", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariable(variable.id)}
                    disabled={variables.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
            <Button type="submit" disabled={createTemplate.isPending}>
              {createTemplate.isPending ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
