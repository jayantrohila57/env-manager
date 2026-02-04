"use client";

import { Plus } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateEnvironmentDialog } from "./create-environment-dialog";

interface Environment {
  id: string;
  name: string;
}

interface EnvironmentsTabsViewProps {
  environments: Environment[];
  activeTab?: string;
  onTabChange: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
  isCreating: boolean;
  children: (env: Environment) => React.ReactNode;
}

export function EnvironmentsTabsView({
  environments,
  activeTab,
  onTabChange,
  onCreate,
  isCreating,
  children,
}: EnvironmentsTabsViewProps) {
  if (environments.length === 0) {
    return (
      <Empty className="h-full w-full border-2 border-muted-foreground/20 border-dashed bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Plus className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No environments yet</EmptyTitle>
          <EmptyDescription>
            Create environments like development, staging, or production.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateEnvironmentDialog
            onConfirm={onCreate}
            isPending={isCreating}
          />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="flex items-center justify-between">
        <TabsList variant={"line"}>
          {environments.map((env) => (
            <TabsTrigger
              className={
                activeTab === env.id
                  ? "rounded-none border-b-2 border-b-primary text-lg text-primary"
                  : "rounded-none border-b-2 border-b-border text-lg"
              }
              key={env.id}
              value={env.id}
            >
              {env.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <CreateEnvironmentDialog
          onConfirm={onCreate}
          isPending={isCreating}
          triggerText="Add Environment"
        />
      </div>
      {environments.map((env) => (
        <TabsContent
          key={env.id}
          value={env.id}
          className="rounded-md border bg-input/10 p-4"
        >
          {children(env)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
