"use client";

import { Button } from "@/components/ui/button";

interface SignInViewProps {
  isLoading: boolean;
  onSignIn: () => void;
}

export function SignInView({ isLoading, onSignIn }: SignInViewProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-md">
      <Button
        type="button"
        className="w-full"
        onClick={onSignIn}
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In with GitHub"}
      </Button>

      <div className="mt-4 text-center">
        <Button variant="link">Need an account? Sign Up</Button>
      </div>
    </div>
  );
}
