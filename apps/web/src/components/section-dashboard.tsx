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
    <Card className="h-full w-full bg-card/30">
      {title && description && (
        <CardHeader>
          <div className="flex flex-row">
            <GoBackButton />
            <div className="ml-4 h-full w-full">
              {title && (
                <CardTitle className="">{slugToTitle(title)}</CardTitle>
              )}
              {description && <CardDescription>{description}</CardDescription>}
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
      <div className="h-[calc(100vh-16rem)] overflow-auto">
        <CardContent className="px-4">{children}</CardContent>
      </div>
    </Card>
  );
}
