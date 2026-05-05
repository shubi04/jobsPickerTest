import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold">Check your email</h1>
        <p className="mb-6 text-muted-foreground">
          We&apos;ve sent you a confirmation link. Please check your email to
          verify your account.
        </p>
        <div className="mb-8 flex items-center justify-center gap-2 rounded-lg bg-muted p-4">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder.
          </span>
        </div>
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
