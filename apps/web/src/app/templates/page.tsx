import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

export default async function TemplatesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TemplateList />
    </div>
  );
}
