"use client";

import { Copy, Eye, EyeOff, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Variable {
  id: string;
  key: string;
}

interface VariablesTableViewProps {
  variables: Variable[];
  revealedIds: Set<string>;
  onReveal: (id: string) => void;
  onCopy: (id: string) => void;
  onEdit: (variable: Variable) => void;
  onDelete: (id: string) => void;
}

export function VariablesTableView({
  variables,
  revealedIds,
  onReveal,
  onCopy,
  onEdit,
  onDelete,
}: VariablesTableViewProps) {
  return (
    <div className="rounded-lg border">
      <Table>
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
                  <span className="break-all">••••••••</span> // Mocking value reveal logic
                ) : (
                  "••••••••"
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
                    onClick={() => onCopy(variable.id)}
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
                      <DropdownMenuItem onClick={() => onEdit(variable)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(variable.id)}
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
  );
}
