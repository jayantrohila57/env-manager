import SignInForm from "@/components/sign-in-form";

export default function LoginPage() {
  return (
    <section className="container mx-auto flex h-[90vh] items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
          Welcome Back to
          <span className="block text-primary">EnvManager</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Sign in to access your environment variables and continue managing
          your projects securely.
        </p>
        <div className="mx-auto max-w-md">
          <SignInForm />
        </div>
      </div>
    </section>
  );
}
