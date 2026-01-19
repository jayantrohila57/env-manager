"use client";

import { useAuth } from "../hooks/use-auth";
import { SignInView } from "./sign-in-view";

export default function SignInForm() {
  const { isLoading, signInWithGithub } = useAuth();

  return <SignInView isLoading={isLoading} onSignIn={signInWithGithub} />;
}
