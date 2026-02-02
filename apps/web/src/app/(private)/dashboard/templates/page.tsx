import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSection from "@/components/section-dashboard";
import Shell from "@/components/shell";
import { TemplatesSkeleton } from "@/domain/templates/components/skeletons";
import { siteConfig } from "@/lib/siteConfig";

const TemplateList = dynamic(
  () => import("@/domain/templates/components/template-list"),
  {
    loading: () => <TemplatesSkeleton />,
  },
);

export const metadata: Metadata = {
  title: "Templates",
  description: `Manage reusable environment templates in ${siteConfig.name}.`,
};

const header = {
  title: "Templates",
  description: "Manage reusable environment templates",
};

export default async function TemplatesPage() {
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
          <TemplateList />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
