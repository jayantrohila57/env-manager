"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const router = useRouter();
  const { isPending: isSessionLoading, data: session } =
    authClient.useSession();
  const [isTransitionPending, startTransition] = useTransition();

  const signInWithGithub = () => {
    startTransition(async () => {
      await authClient.signIn.social(
        {
          provider: "github",
        },
        {
          onSuccess: () => {
            toast.success("Sign in successful");
            router.push("/dashboard");
          },
          onError: (error) => {
            toast.error(
              error.error.message || error.error.statusText || "Sign in failed",
            );
          },
        },
      );
    });
  };

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully");
        },
      },
    });
  };

  return {
    session,
    isLoading: isSessionLoading || isTransitionPending,
    signInWithGithub,
    signOut,
  };
}
