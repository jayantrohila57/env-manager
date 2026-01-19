"use client";

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
  onCreate: (name: string) => Promise<any>;
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
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h3 className="font-medium text-lg">No environments yet</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Create environments like development, staging, or production.
        </p>
        <div className="mt-4">
          <CreateEnvironmentDialog
            onConfirm={onCreate}
            isPending={isCreating}
          />
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="flex items-center justify-between gap-4">
        <TabsList>
          {environments.map((env) => (
            <TabsTrigger key={env.id} value={env.id}>
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
        <TabsContent key={env.id} value={env.id} className="mt-6">
          {children(env)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
