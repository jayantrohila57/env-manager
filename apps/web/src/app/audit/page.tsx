import { auth } from "@env-manager/auth";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuditSkeleton } from "@/domain/audit/components/skeletons";
import { siteConfig } from "@/lib/siteConfig";

const AuditLogs = dynamic(
  () => import("@/domain/audit/components/audit-logs"),
  {
    loading: () => <AuditSkeleton />,
  },
);

export const metadata: Metadata = {
  title: "Audit Logs",
  description: `View system audit logs in ${siteConfig.name}.`,
};

export default async function AuditPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl">Audit Logs</h1>
      </div>

      <AuditLogs />
    </div>
  );
}
