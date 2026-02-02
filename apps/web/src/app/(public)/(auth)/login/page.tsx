import { auth } from "@env-manager/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Shell from "@/components/shell";
import { AuthSkeleton } from "@/domain/auth/components/skeletons";
import { siteConfig } from "@/lib/siteConfig";

const GitHubLoginButton = dynamic(
  async () =>
    import("@/domain/auth/components/github-login").then(
      (m) => m.GitHubLoginButton,
    ),
  {
    loading: () => <AuthSkeleton />,
  },
);

export const metadata: Metadata = {
  title: "Login",
  description: `Sign in to ${siteConfig.name} to manage your environment variables.`,
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Shell>
      <Shell.Section padding={"center"}>
        <div className="flex h-[80vh] items-center justify-center pt-24">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="font-semibold text-2xl tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome back to {siteConfig.name}
              </p>
            </div>
            <GitHubLoginButton />
          </div>
        </div>
      </Shell.Section>
    </Shell>
  );
}
