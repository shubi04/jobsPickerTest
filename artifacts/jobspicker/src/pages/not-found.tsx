import { Link } from "wouter";
import { Briefcase, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-center text-muted-foreground max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Briefcase className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/jobs"
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium hover:bg-muted"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  );
}
