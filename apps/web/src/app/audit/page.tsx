"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuditLogTable } from "@/components/audit/audit-log-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function AuditLogsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");

  const projectsQuery = useQuery(trpc.projects.list.queryOptions());

  const handleBack = () => {
    router.push("/dashboard");
  };

  if (projectsQuery.isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (projectsQuery.error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Failed to load projects. Please try again.
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const _projects = projectsQuery.data?.data ?? [];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="font-semibold text-2xl">Audit Logs</h1>
        </div>
      </div>

      {/* Simple Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedProjectId}
          onValueChange={setSelectedProjectId}
          disabled={!_projects.length}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Projects</SelectItem>
            {_projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Audit Logs Table */}
      <AuditLogTable
        search={searchTerm}
        projectId={selectedProjectId === "ALL" ? undefined : selectedProjectId}
      />
    </div>
  );
}
