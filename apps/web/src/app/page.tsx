import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="container mx-auto flex h-[90vh] items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
          Manage Environment
          <span className="block text-primary">Variables with Confidence</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Securely store, manage, and deploy environment variables across all
          your projects from a single, reliable dashboard.
        </p>
        <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
