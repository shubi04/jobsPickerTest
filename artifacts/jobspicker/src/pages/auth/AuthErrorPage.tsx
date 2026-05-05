import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold">Authentication Error</h1>
        <p className="mb-6 text-muted-foreground">
          Something went wrong during authentication. Please try again.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
