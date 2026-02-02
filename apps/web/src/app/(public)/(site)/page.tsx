import { Plus } from "lucide-react";
import Shell from "@/components/shell";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Shell>
      <Shell.Section padding={"center"}>
        <div className="mx-auto flex h-[80vh] max-w-3xl flex-col items-center justify-center space-y-6 text-center">
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
            Manage Environment
            <span className="block text-primary">
              Variables with Confidence
            </span>
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
      </Shell.Section>
    </Shell>
  );
}
