import type { Route } from "next";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { slugToTitle } from "@/lib/utils";
import GoBackButton from "./go-back";
import { Button } from "./ui/button";

interface SectionProps {
  title?: string;
  description?: string;
  action?: string;
  actionUrl?: string;
  children: React.ReactNode;
}

export default function DashboardSection({
  title,
  description,
  action,
  actionUrl,
  children,
}: SectionProps) {
  return (
    <Card className="relative z-10 h-full w-full gap-2 rounded-none border-none bg-transparent p-2 group-has-data-[collapsible=icon]/sidebar-wrapper:gap-2 group-has-data-[collapsible=icon]/sidebar-wrapper:px-0">
      {title && description && (
        <CardHeader className="p-0">
          <div className="flex flex-row items-center">
            <GoBackButton />
            <div className="ml-4 h-full w-full">
              {title && (
                <CardTitle className="text-xl">{slugToTitle(title)}</CardTitle>
              )}
              {description && (
                <CardDescription className="line-clamp-1 text-xs">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          <CardAction>
            {action && (
              <Button variant={"default"}>
                {actionUrl && <Link href={actionUrl as Route}>{action}</Link>}
              </Button>
            )}
          </CardAction>
        </CardHeader>
      )}
      <div className="h-[calc(100dvh-10rem)] overflow-auto rounded-md border bg-background">
        <CardContent className="p-2">{children}</CardContent>
      </div>
    </Card>
  );
}
