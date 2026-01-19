import { auth } from "@env-manager/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ProjectDetail } from "./project-detail";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <div className="container relative z-10 mx-auto px-4 py-8">
      <ProjectDetail projectId={id} />
    </div>
  );
}
