import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  ArrowLeft,
  Bookmark,
  Globe,
  Users,
  Calendar,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { formatSalary, formatDate, timeAgo } from "@/lib/utils";
import { ApplyButton } from "@/components/apply-button";
import { SaveJobButton } from "@/components/save-job-button";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Get job with employer info
  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      employer_profiles:employer_id (
        id,
        user_id,
        company_name,
        company_description,
        company_logo_url,
        industry,
        company_size,
        website,
        location,
        founded_year
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Check if user has already applied
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id, status")
    .eq("job_id", id)
    .eq("applicant_id", user.id)
    .single();

  // Check if job is saved
  const { data: savedJob } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("job_id", id)
    .eq("user_id", user.id)
    .single();

  const isOwner = job.employer_profiles?.user_id === user.id;
  const isJobSeeker = profile?.role === "jobseeker";

  // Increment view count (only for job seekers)
  if (isJobSeeker && !isOwner) {
    await supabase
      .from("jobs")
      .update({ views_count: (job.views_count || 0) + 1 })
      .eq("id", id);
  }

  return (
    <div className="container py-8">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                {job.employer_profiles?.company_logo_url ? (
                  <img
                    src={job.employer_profiles.company_logo_url}
                    alt={job.employer_profiles.company_name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {job.employer_profiles?.company_name}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                      {job.is_remote && " (Remote available)"}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.job_type}
                  </span>
                  {job.experience_level && (
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.experience_level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Salary & Posted */}
            <div className="mt-6 flex flex-wrap gap-6">
              {(job.salary_min || job.salary_max) && (
                <div>
                  <div className="text-sm text-muted-foreground">Salary</div>
                  <div className="font-semibold">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Posted</div>
                <div className="font-semibold">{timeAgo(job.created_at)}</div>
              </div>
              {job.application_deadline && (
                <div>
                  <div className="text-sm text-muted-foreground">Deadline</div>
                  <div className="font-semibold">
                    {formatDate(job.application_deadline)}
                  </div>
                </div>
              )}
              {isOwner && (
                <div>
                  <div className="text-sm text-muted-foreground">Views</div>
                  <div className="font-semibold">{job.views_count || 0}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isJobSeeker && !isOwner && (
              <div className="mt-6 flex gap-3">
                {existingApplication ? (
                  <div className="flex items-center gap-2 rounded-md bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                    <CheckCircle className="h-4 w-4" />
                    Applied - {existingApplication.status}
                  </div>
                ) : (
                  <ApplyButton jobId={job.id} jobTitle={job.title} />
                )}
                <SaveJobButton
                  jobId={job.id}
                  isSaved={!!savedJob}
                  userId={user.id}
                />
              </div>
            )}

            {isOwner && (
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/dashboard/jobs/${job.id}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
                >
                  Edit Job
                </Link>
                <Link
                  href={`/dashboard/applications?job=${job.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  View Applications
                </Link>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Job Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-success mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Benefits</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills Required */}
          {job.skills_required && job.skills_required.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">About the Company</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
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
                <div className="font-semibold">
                  {job.employer_profiles?.company_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {job.employer_profiles?.industry}
                </div>
              </div>
            </div>

            {job.employer_profiles?.company_description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                {job.employer_profiles.company_description}
              </p>
            )}

            <div className="space-y-2 text-sm">
              {job.employer_profiles?.company_size && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {job.employer_profiles.company_size} employees
                </div>
              )}
              {job.employer_profiles?.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.employer_profiles.location}
                </div>
              )}
              {job.employer_profiles?.founded_year && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Founded {job.employer_profiles.founded_year}
                </div>
              )}
              {job.employer_profiles?.website && (
                <a
                  href={job.employer_profiles.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Visit website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
