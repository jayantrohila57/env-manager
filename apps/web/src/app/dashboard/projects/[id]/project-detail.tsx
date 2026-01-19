"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { EnvironmentPanel } from "@/components/environments/environment-panel";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/utils/trpc";

export function ProjectDetail({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const [isCreateEnvOpen, setIsCreateEnvOpen] = useState(false);
  const [envName, setEnvName] = useState("");
  const [activeTab, setActiveTab] = useState<string | undefined>();

  const projectQuery = useQuery(
    trpc.projects.get.queryOptions({ id: projectId }),
  );

  const createEnvMutation = useMutation(
    trpc.environments.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["projects", "get", { id: projectId }],
        });
        toast.success("Environment created successfully");
        setIsCreateEnvOpen(false);
        setEnvName("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleCreateEnv = () => {
    if (!envName.trim()) {
      toast.error("Environment name is required");
      return;
    }
    createEnvMutation.mutate({
      projectId,
      name: envName.trim(),
    });
  };

  if (projectQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const { project, environments } = projectQuery.data?.data ?? {
    project: null,
    environments: [],
  };

  if (!project) {
    return (
      <div className="py-12 text-center">
        <h2 className="font-semibold text-xl">Project not found</h2>
        <Link href="/dashboard">
          <Button variant="link">Go back to dashboard</Button>
        </Link>
      </div>
    );
  }

  // Set default active tab to first environment
  const currentTab = activeTab ?? environments[0]?.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-2xl">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>
      </div>

      {/* Environment Tabs */}
      {environments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="font-medium text-lg">No environments yet</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Create environments like development, staging, or production.
          </p>
          <Dialog open={isCreateEnvOpen} onOpenChange={setIsCreateEnvOpen}>
            <DialogTrigger
              render={
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Environment
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Environment</DialogTitle>
                <DialogDescription>
                  Add a new environment (e.g., development, staging,
                  production).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="env-name">Name</Label>
                  <Input
                    id="env-name"
                    value={envName}
                    onChange={(e) => setEnvName(e.target.value)}
                    placeholder="development"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateEnvOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEnv}
                  disabled={createEnvMutation.isPending}
                >
                  {createEnvMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Tabs value={currentTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4 border-b">
            <TabsList className="h-auto bg-transparent p-0">
              {environments.map((env) => (
                <TabsTrigger
                  key={env.id}
                  value={env.id}
                  className="rounded-none border-transparent border-b-2 px-4 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  {env.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Dialog open={isCreateEnvOpen} onOpenChange={setIsCreateEnvOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Environment
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Environment</DialogTitle>
                  <DialogDescription>
                    Add a new environment to this project.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="env-name">Name</Label>
                    <Input
                      id="env-name"
                      value={envName}
                      onChange={(e) => setEnvName(e.target.value)}
                      placeholder="staging"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateEnvOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateEnv}
                    disabled={createEnvMutation.isPending}
                  >
                    {createEnvMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {environments.map((env) => (
            <TabsContent key={env.id} value={env.id} className="mt-6">
              <EnvironmentPanel environment={env} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
