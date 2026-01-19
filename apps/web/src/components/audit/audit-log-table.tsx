"use client";

import type { AppRouter } from "@env-manager/api/routers/index";
import { useQuery } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/utils/trpc";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type AuditLog = RouterOutputs["auditLogs"]["list"]["data"][number];

const actionVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  BULK_IMPORT: "outline",
  EXPORT: "outline",
};

const entityTypeVariants: Record<string, "default" | "secondary" | "outline"> =
  {
    VARIABLE: "default",
    ENVIRONMENT: "secondary",
    PROJECT: "outline",
  };

const getActionDescription = (action: string, entityType: string) => {
  const actionMap = {
    CREATE: `Created ${entityType}`,
    UPDATE: `Updated ${entityType}`,
    DELETE: `Deleted ${entityType}`,
    BULK_IMPORT: `Bulk imported ${entityType}s`,
    EXPORT: `Exported ${entityType}s`,
  };
  return (
    actionMap[action as keyof typeof actionMap] || `${action} ${entityType}`
  );
};

const getEntityDescription = (log: AuditLog) => {
  if (log.variableId) {
    return `Variable: ${log.variableId.slice(0, 8)}...`;
  }
  if (log.environmentId) {
    return `Environment: ${log.environmentId.slice(0, 8)}...`;
  }
  if (log.projectId) {
    return `Project: ${log.projectId.slice(0, 8)}...`;
  }
  return "System operation";
};

const formatJsonValue = (value: string | null) => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return "Invalid JSON";
  }
};

interface AuditLogTableProps {
  projectId?: string;
  environmentId?: string;
  action?: string;
  entityType?: string;
  search?: string;
}

export function AuditLogTable({
  projectId,
  environmentId,
  action,
  entityType,
  search,
}: AuditLogTableProps) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const auditLogsQuery = useQuery(
    trpc.auditLogs.list.queryOptions({
      projectId: projectId as string | undefined,
      environmentId: environmentId as string | undefined,
      action: action as
        | "CREATE"
        | "UPDATE"
        | "DELETE"
        | "BULK_IMPORT"
        | "EXPORT"
        | undefined,
      entityType: entityType as
        | "VARIABLE"
        | "ENVIRONMENT"
        | "PROJECT"
        | undefined,
      search,
      limit: 50,
      offset: 0,
    }),
  );

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (auditLogsQuery.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (auditLogsQuery.error) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          Failed to load audit logs. Please try again.
        </p>
      </div>
    );
  }

  const logs = auditLogsQuery.data?.data ?? [];

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No audit logs found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Changes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs">
                {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm")}
              </TableCell>
              <TableCell>
                <Badge variant={actionVariants[log.action] || "secondary"}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={entityTypeVariants[log.entityType] || "secondary"}
                >
                  {log.entityType}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                <div className="flex items-center justify-between">
                  <span className="truncate">{getEntityDescription(log)}</span>
                  <button
                    type="button"
                    onClick={() => toggleReveal(log.id)}
                    className="h-6 w-6 rounded p-1 text-xs hover:bg-muted"
                  >
                    {revealedIds.has(log.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                {revealedIds.has(log.id) ? (
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-xs">
                      {getActionDescription(log.action, log.entityType)}
                    </span>
                    <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">
                      {formatJsonValue(log.oldValue)}
                    </pre>
                    {log.newValue && (
                      <div>
                        <span className="text-muted-foreground text-xs">
                          After:
                        </span>
                        <pre className="mt-1 overflow-x-auto rounded bg-green-50 p-2 text-xs dark:bg-green-950">
                          {formatJsonValue(log.newValue)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {getActionDescription(log.action, log.entityType)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleReveal(log.id)}
                        className="h-6 w-6 rounded p-1 text-xs hover:bg-muted"
                      >
                        {revealedIds.has(log.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
