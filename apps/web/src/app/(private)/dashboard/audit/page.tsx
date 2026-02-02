import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSection from "@/components/section-dashboard";
import Shell from "@/components/shell";
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

const header = {
  title: "Audit Logs",
  description: "View system audit logs and activities",
};

export default async function AuditPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...header}>
          <AuditLogs />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
