"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { Button } from "./ui/button";

export default function SignInForm() {
  const router = useRouter();

  const { isPending: isSessionPending } = authClient.useSession();
  const [isTransitionPending, startTransition] = useTransition();

  const handleSubmit = () => {
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

  if (isSessionPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-6">
      <h1 className="mb-6 text-center font-bold text-3xl">Welcome Back</h1>

      <Button
        type="button"
        className="w-full"
        onClick={handleSubmit}
        disabled={isTransitionPending}
      >
        {isTransitionPending ? "Signing in..." : "Sign In with GitHub"}
      </Button>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
