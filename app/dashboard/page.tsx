import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Briefcase,
  FileText,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isEmployer = profile?.role === "employer";

  if (isEmployer) {
    return <EmployerDashboard userId={user.id} profile={profile} />;
  }

  return <JobSeekerDashboard userId={user.id} profile={profile} />;
}

interface DashboardProps {
  userId: string;
  profile: {
    full_name: string | null;
    role: string;
  } | null;
}

async function JobSeekerDashboard({ userId, profile }: DashboardProps) {
  const supabase = await createClient();

  // Get application stats
  const { count: totalApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("applicant_id", userId);

  const { count: pendingApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("applicant_id", userId)
    .eq("status", "pending");

  const { count: interviewApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("applicant_id", userId)
    .eq("status", "interview");

  // Get recent applications
  const { data: recentApplications } = await supabase
    .from("applications")
    .select(
      `
      *,
      jobs:job_id (
        title,
        location,
        employer_profiles:employer_id (
          company_name
        )
      )
    `
    )
    .eq("applicant_id", userId)
    .order("applied_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Total Applications",
      value: totalApplications || 0,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pending",
      value: pendingApplications || 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Interviews",
      value: interviewApplications || 0,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {profile?.full_name || "Job Seeker"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-lg bg-primary/10 p-3">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold">Browse Jobs</div>
            <div className="text-sm text-muted-foreground">
              Discover new opportunities
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-lg bg-primary/10 p-3">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold">Update Profile</div>
            <div className="text-sm text-muted-foreground">
              Keep your profile up to date
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold">Recent Applications</h2>
        </div>
        <div className="divide-y divide-border">
          {recentApplications && recentApplications.length > 0 ? (
            recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <div className="font-medium">{app.jobs?.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {app.jobs?.employer_profiles?.company_name} •{" "}
                    {app.jobs?.location}
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No applications yet.{" "}
              <Link href="/dashboard/jobs" className="text-primary hover:underline">
                Start browsing jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function EmployerDashboard({ userId, profile }: DashboardProps) {
  const supabase = await createClient();

  // Get employer profile
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
            Set up your company profile to start posting jobs.
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

  // Get job stats
  const { count: totalJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("employer_id", employerProfile.id);

  const { count: activeJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("employer_id", employerProfile.id)
    .eq("is_active", true);

  // Get total applications across all jobs
  const { data: jobIds } = await supabase
    .from("jobs")
    .select("id")
    .eq("employer_id", employerProfile.id);

  let totalApplications = 0;
  if (jobIds && jobIds.length > 0) {
    const { count } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .in(
        "job_id",
        jobIds.map((j) => j.id)
      );
    totalApplications = count || 0;
  }

  // Get recent applications
  const { data: recentApplications } = await supabase
    .from("applications")
    .select(
      `
      *,
      jobs:job_id (title),
      profiles:applicant_id (full_name, email)
    `
    )
    .in(
      "job_id",
      (jobIds || []).map((j) => j.id)
    )
    .order("applied_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs || 0,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Jobs",
      value: activeJobs || 0,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Applications",
      value: totalApplications,
      icon: FileText,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {profile?.full_name || "Employer"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your job postings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-lg bg-primary/10 p-3">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold">Post New Job</div>
            <div className="text-sm text-muted-foreground">
              Create a new job listing
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/applications"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-lg bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold">Review Applications</div>
            <div className="text-sm text-muted-foreground">
              Manage incoming applications
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold">Recent Applications</h2>
        </div>
        <div className="divide-y divide-border">
          {recentApplications && recentApplications.length > 0 ? (
            recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <div className="font-medium">{app.profiles?.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Applied for {app.jobs?.title}
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No applications yet. Post a job to start receiving applications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    { label: string; className: string; icon: typeof CheckCircle }
  > = {
    pending: {
      label: "Pending",
      className: "bg-muted text-muted-foreground",
      icon: Clock,
    },
    reviewed: {
      label: "Reviewed",
      className: "bg-primary/10 text-primary",
      icon: Eye,
    },
    shortlisted: {
      label: "Shortlisted",
      className: "bg-success/10 text-success",
      icon: CheckCircle,
    },
    interview: {
      label: "Interview",
      className: "bg-warning/10 text-warning",
      icon: AlertCircle,
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive",
      icon: XCircle,
    },
    accepted: {
      label: "Accepted",
      className: "bg-success/10 text-success",
      icon: CheckCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
