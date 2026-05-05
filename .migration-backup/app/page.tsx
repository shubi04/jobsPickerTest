import Link from "next/link";
import {
  Briefcase,
  Search,
  Building2,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">JobsPicker</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Companies
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Find Your Dream Job Today
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Connect with top employers and discover thousands of job
              opportunities. Whether you&apos;re starting your career or looking
              for your next big move, we&apos;re here to help.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/jobs"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Search className="h-4 w-4" />
                Browse Jobs
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-8 text-sm font-medium hover:bg-muted"
              >
                Post a Job
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Active Jobs
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Companies
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50,000+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Job Seekers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Why Choose JobsPicker?</h2>
            <p className="mt-4 text-muted-foreground">
              We make job hunting simple, efficient, and effective.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Smart Job Matching</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our algorithm matches you with jobs that fit your skills and
                preferences perfectly.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Top Companies</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Access opportunities from verified companies across all
                industries.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Direct Applications</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Apply directly to employers and track your applications in real
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Join thousands of job seekers who found their dream jobs through
              JobsPicker.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-8 text-sm font-medium text-primary hover:bg-white/90"
              >
                <CheckCircle className="h-4 w-4" />
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">JobsPicker</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/jobs" className="hover:text-foreground">
                Jobs
              </Link>
              <Link href="/companies" className="hover:text-foreground">
                Companies
              </Link>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              2024 JobsPicker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
