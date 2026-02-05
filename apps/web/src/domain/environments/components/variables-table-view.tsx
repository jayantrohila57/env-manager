"use client";

import {
  BarChart3,
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppNavigation } from "@/utils/navigation";
import { AddVariableDialog } from "./add-variable-dialog";
import { EditVariableDialog } from "./edit-variable-dialog";

interface Variable {
  id: string;
  key: string;
  value: string;
  environmentId: string;
  createdAt: string;
  updatedAt: string;
}

interface VariablesTableViewProps {
  variables: Variable[];
  revealedIds: Set<string>;
  onReveal: (id: string) => void;
  onCopy: (id: string) => void;
  onEdit: (variable: Variable) => void;
  onDelete: (id: string) => void;
  onAddVariable: (data: { key: string; value: string }) => Promise<void>;
  isAddingVariable: boolean;
}

export function VariablesTableView({
  variables,
  revealedIds,
  onReveal,
  onCopy,
  onEdit,
  onDelete,
  onAddVariable,
  isAddingVariable,
}: VariablesTableViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<Variable | null>(null);
  const navigation = useAppNavigation();

  const handleCopy = async (id: string) => {
    try {
      const variable = variables.find((v) => v.id === id);
      if (variable?.value) {
        await navigator.clipboard.writeText(variable.value);
        onCopy(id);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = (variable: Variable) => {
    setDeleteDialogOpen(variable.id);
  };

  const confirmDelete = async () => {
    if (deleteDialogOpen) {
      onDelete(deleteDialogOpen);
      setDeleteDialogOpen(null);
    }
  };

  const handleEdit = (variable: Variable) => {
    setEditDialogOpen(variable);
  };

  if (variables.length === 0) {
    return (
      <Empty className="h-full w-full border-2 border-muted-foreground/20 border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Plus className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No variables yet</EmptyTitle>
          <EmptyDescription>
            Add your first environment variable to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AddVariableDialog
            onConfirm={onAddVariable}
            isPending={isAddingVariable}
          />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigation.redirectToDashboard()}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Dashboard Stats
        </Button>
      </div>
      <Table className="rounded-lg border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variables.map((variable) => (
            <TableRow key={variable.id}>
              <TableCell className="font-medium font-mono">
                {variable.key}
              </TableCell>
              <TableCell className="font-mono text-muted-foreground">
                {revealedIds.has(variable.id) ? (
                  <span className="break-all">{variable.value}</span>
                ) : (
                  <span className="break-all">••••••</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onReveal(variable.id)}
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
                    onClick={() => handleCopy(variable.id, variable.value)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(variable)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(variable)}
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

      {/* Edit Dialog */}
      {editDialogOpen && (
        <EditVariableDialog
          variable={editDialogOpen}
          onConfirm={async (data) => {
            onEdit(data);
            setEditDialogOpen(null);
          }}
          isPending={false}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <AlertDialog
          open={!!deleteDialogOpen}
          onOpenChange={() => setDeleteDialogOpen(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Variable</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the variable "
                {variables.find((v) => v.id === deleteDialogOpen)?.key}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
