"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Template {
  id: string;
  name: string;
  description: string | null;
  variableCount: number;
  updatedAt: string | Date;
}

interface TemplateCardViewProps {
  template: Template;
  onDelete: () => void;
  isDeleting: boolean;
}

export function TemplateCardView({
  template,
  onDelete,
  isDeleting,
}: TemplateCardViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription className="mt-1.5 line-clamp-2">
              {template.description || "No description"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">
              {template.variableCount}
            </span>
            variables
          </div>
          <div>•</div>
          <div>
            Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
