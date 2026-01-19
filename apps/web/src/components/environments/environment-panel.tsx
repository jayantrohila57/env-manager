"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

interface Environment {
  id: string;
  name: string;
  projectId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function EnvironmentPanel({
  environment,
}: {
  environment: Environment;
}) {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [importText, setImportText] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [editingVar, setEditingVar] = useState<{
    id: string;
    key: string;
    value: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const variablesQuery = useQuery(
    trpc.environmentVariables.list.queryOptions({
      environmentId: environment.id,
    }),
  );

  const createMutation = useMutation(
    trpc.environmentVariables.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["environmentVariables", "list"],
        });
        toast.success("Variable added");
        setIsAddOpen(false);
        setKey("");
        setValue("");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const updateMutation = useMutation(
    trpc.environmentVariables.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["environmentVariables", "list"],
        });
        toast.success("Variable updated");
        setEditingVar(null);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const deleteMutation = useMutation(
    trpc.environmentVariables.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["environmentVariables", "list"],
        });
        toast.success("Variable deleted");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const bulkImportMutation = useMutation(
    trpc.environmentVariables.bulkImport.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["environmentVariables", "list"],
        });
        toast.success(data.message);
        setIsImportOpen(false);
        setImportText("");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const exportQuery = useQuery({
    ...trpc.environmentVariables.export.queryOptions({
      environmentId: environment.id,
    }),
    enabled: false,
  });

  const handleAdd = () => {
    if (!key.trim()) {
      toast.error("Variable key is required");
      return;
    }
    createMutation.mutate({
      environmentId: environment.id,
      key: key.trim(),
      value: value,
    });
  };

  const handleImport = () => {
    const lines = importText
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"));
    const variables = lines
      .map((line) => {
        const eqIndex = line.indexOf("=");
        if (eqIndex === -1) return null;
        const k = line.slice(0, eqIndex).trim();
        let v = line.slice(eqIndex + 1);
        // Remove surrounding quotes if present
        if (
          (v.startsWith('"') && v.endsWith('"')) ||
          (v.startsWith("'") && v.endsWith("'"))
        ) {
          v = v.slice(1, -1);
        }
        return { key: k, value: v };
      })
      .filter(Boolean) as { key: string; value: string }[];

    if (variables.length === 0) {
      toast.error("No valid variables found");
      return;
    }

    bulkImportMutation.mutate({
      environmentId: environment.id,
      variables,
      overwrite,
    });
  };

  const handleExport = async () => {
    const result = await exportQuery.refetch();
    if (result.data?.data) {
      await navigator.clipboard.writeText(result.data.data);
      toast.success("Copied to clipboard as .env format");
    }
  };

  const handleCopyValue = async (varId: string) => {
    const result = await queryClient.fetchQuery(
      trpc.environmentVariables.get.queryOptions({ id: varId }),
    );
    if (result?.data?.value) {
      await navigator.clipboard.writeText(result.data.value);
      toast.success("Value copied to clipboard");
    }
  };

  const handleReveal = async (varId: string) => {
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
        // Store the value temporarily
        queryClient.setQueryData(["revealedValue", varId], result.data.value);
      }
    }
  };

  const getRevealedValue = (varId: string) => {
    return (
      queryClient.getQueryData<string>(["revealedValue", varId]) ?? "••••••••"
    );
  };

  if (variablesQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const variables = variablesQuery.data?.data ?? [];
  const filteredVariables = variables.filter((v) =>
    v.key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 max-w-xs"
          />
          <Badge variant="secondary">
            {filteredVariables.length} of {variables.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              }
            />
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Variables</DialogTitle>
                <DialogDescription>
                  Paste your .env file content below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="DATABASE_URL=postgres://...&#10;API_KEY=sk-..."
                  rows={10}
                  className="font-mono text-sm"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="overwrite"
                    checked={overwrite}
                    onChange={(e) => setOverwrite(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="overwrite" className="text-sm">
                    Overwrite existing variables with same keys
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsImportOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={bulkImportMutation.isPending}
                >
                  {bulkImportMutation.isPending ? "Importing..." : "Import"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variable
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Variable</DialogTitle>
                <DialogDescription>
                  Add a new environment variable.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="var-key">Key</Label>
                  <Input
                    id="var-key"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    placeholder="DATABASE_URL"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="var-value">Value</Label>
                  <Textarea
                    id="var-value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="your-value-here"
                    rows={3}
                    className="font-mono"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Variables Table */}
      {variables.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="font-medium text-lg">No variables yet</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Add variables manually or import from a .env file.
          </p>
        </div>
      ) : filteredVariables.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="font-medium text-lg">No matches found</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            No variables match your search query "{searchQuery}".
          </p>
          <Button variant="link" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.map((variable) => (
                <TableRow key={variable.id}>
                  <TableCell className="font-medium font-mono">
                    {variable.key}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {revealedIds.has(variable.id) ? (
                      <span className="break-all">
                        {getRevealedValue(variable.id)}
                      </span>
                    ) : (
                      "••••••••"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleReveal(variable.id)}
                      >
                        {revealedIds.has(variable.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyValue(variable.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={async () => {
                              const result = await queryClient.fetchQuery(
                                trpc.environmentVariables.get.queryOptions({
                                  id: variable.id,
                                }),
                              );
                              if (result?.data) {
                                setEditingVar({
                                  id: variable.id,
                                  key: variable.key,
                                  value: result.data.value,
                                });
                              }
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              deleteMutation.mutate({ id: variable.id })
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingVar}
        onOpenChange={(open) => !open && setEditingVar(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Variable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-key">Key</Label>
              <Input
                id="edit-key"
                value={editingVar?.key ?? ""}
                onChange={(e) =>
                  setEditingVar((prev) =>
                    prev
                      ? { ...prev, key: e.target.value.toUpperCase() }
                      : null,
                  )
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-value">Value</Label>
              <Textarea
                id="edit-value"
                value={editingVar?.value ?? ""}
                onChange={(e) =>
                  setEditingVar((prev) =>
                    prev ? { ...prev, value: e.target.value } : null,
                  )
                }
                rows={3}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVar(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingVar) {
                  updateMutation.mutate({
                    id: editingVar.id,
                    key: editingVar.key,
                    value: editingVar.value,
                  });
                }
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
