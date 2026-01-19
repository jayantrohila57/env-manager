import { auth } from "@env-manager/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container relative z-10 mx-auto px-4 py-8">
      <Dashboard session={session} />
    </div>
  );
}
