import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  Search,
  Filter,
  Bookmark,
} from "lucide-react";
import { formatSalary, timeAgo } from "@/lib/utils";
import { JobFilters } from "@/components/job-filters";

interface SearchParams {
  q?: string;
  type?: string;
  location?: string;
  experience?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // For employers, show their own jobs
  if (profile?.role === "employer") {
    return <EmployerJobsPage userId={user.id} />;
  }

  // For job seekers, show all active jobs with filters
  let query = supabase
    .from("jobs")
    .select(
      `
      *,
      employer_profiles:employer_id (
        company_name,
        company_logo_url,
        location
      )
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Apply filters
  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,description.ilike.%${params.q}%`
    );
  }
  if (params.type) {
    query = query.eq("job_type", params.type);
  }
  if (params.location) {
    query = query.ilike("location", `%${params.location}%`);
  }
  if (params.experience) {
    query = query.eq("experience_level", params.experience);
  }

  const { data: jobs } = await query.limit(50);

  // Get saved jobs for this user
  const { data: savedJobs } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", user.id);

  const savedJobIds = new Set(savedJobs?.map((s) => s.job_id) || []);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Browse Jobs</h1>
        <p className="text-muted-foreground">
          Find your next opportunity from thousands of listings
        </p>
      </div>

      {/* Filters */}
      <JobFilters />

      {/* Jobs Grid */}
      <div className="mt-8 grid gap-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {job.employer_profiles?.company_logo_url ? (
                      <img
                        src={job.employer_profiles.company_logo_url}
                        alt={job.employer_profiles.company_name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {job.employer_profiles?.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {savedJobIds.has(job.id) && (
                    <span className="text-primary">
                      <Bookmark className="h-5 w-5 fill-current" />
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                    {job.is_remote && " (Remote)"}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.job_type}
                </span>
                {(job.salary_min || job.salary_max) && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeAgo(job.created_at)}
                </span>
              </div>

              {job.skills_required && job.skills_required.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills_required.slice(0, 5).map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills_required.length > 5 && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      +{job.skills_required.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No jobs found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

async function EmployerJobsPage({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!employerProfile) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground mb-6">
            Set up your company profile before posting jobs.
          </p>
          <Link
            href="/dashboard/company"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Set Up Company Profile
          </Link>
        </div>
      </div>
    );
  }

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", employerProfile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Briefcase className="h-4 w-4" />
          Post New Job
        </Link>
      </div>

      <div className="grid gap-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.job_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {timeAgo(job.created_at)}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    job.is_active
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No jobs posted yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Start by posting your first job
            </p>
            <Link
              href="/dashboard/jobs/new"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
