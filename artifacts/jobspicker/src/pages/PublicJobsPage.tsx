import { useEffect, useState } from "react";
import { Link } from "wouter";
import { createClient } from "@/lib/supabase";
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  Search,
  ArrowRight,
} from "lucide-react";
import { formatSalary, timeAgo } from "@/lib/utils";

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("jobs")
        .select(`*, employer_profiles:employer_id (company_name, company_logo_url, location)`)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);
      setJobs(data || []);
      setIsLoading(false);
    };
    loadJobs();
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">JobsPicker</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/jobs" className="text-sm font-medium text-foreground">Find Jobs</Link>
            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link href="/auth/signup" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
          <p className="mt-2 text-muted-foreground">
            Browse {jobs.length}+ jobs from top companies
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {job.employer_profiles?.company_logo_url ? (
                          <img src={job.employer_profiles.company_logo_url} alt={job.employer_profiles.company_name} className="h-12 w-12 rounded-lg object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.employer_profiles?.company_name}</p>
                      </div>
                    </div>
                    <Link href="/auth/signup" className="inline-flex h-9 items-center justify-center gap-1 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Apply <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />{job.location}{job.is_remote && " (Remote)"}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />{job.job_type}
                    </span>
                    {(job.salary_min || job.salary_max) && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />{timeAgo(job.created_at)}
                    </span>
                  </div>

                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills_required.slice(0, 5).map((skill: string) => (
                        <span key={skill} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{skill}</span>
                      ))}
                      {job.skills_required.length > 5 && (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">+{job.skills_required.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">No jobs available</h3>
                <p className="mt-2 text-sm text-muted-foreground">Check back soon for new opportunities</p>
              </div>
            )}
          </div>

          <div className="mt-12 rounded-lg bg-primary/5 p-8 text-center">
            <h2 className="text-xl font-bold">Ready to apply?</h2>
            <p className="mt-2 text-muted-foreground">Create a free account to apply to any job and track your applications.</p>
            <Link href="/auth/signup" className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          2024 JobsPicker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
