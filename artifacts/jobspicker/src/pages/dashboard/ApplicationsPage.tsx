import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import {
  FileText, Building2, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Eye, Calendar, Loader2,
} from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/hooks/useAuth";

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle }> = {
    pending: { label: "Pending", className: "bg-muted text-muted-foreground", icon: Clock },
    reviewed: { label: "Reviewed", className: "bg-primary/10 text-primary", icon: Eye },
    shortlisted: { label: "Shortlisted", className: "bg-success/10 text-success", icon: CheckCircle },
    interview: { label: "Interview", className: "bg-warning/10 text-warning", icon: AlertCircle },
    rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive", icon: XCircle },
    accepted: { label: "Accepted", className: "bg-success/10 text-success", icon: CheckCircle },
  };
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />{config.label}
    </span>
  );
}

export default function ApplicationsPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    loadApplications();
  }, [user, profile, authLoading]);

  const loadApplications = async () => {
    if (!user || !profile) return;
    const supabase = createClient();

    if (profile.role === "employer") {
      const { data: employerProfile } = await supabase.from("employer_profiles").select("id").eq("user_id", user.id).single();
      if (!employerProfile) { setIsLoading(false); return; }
      const { data: jobs } = await supabase.from("jobs").select("id").eq("employer_id", employerProfile.id);
      const jobIds = jobs?.map(j => j.id) || [];
      if (jobIds.length > 0) {
        const { data } = await supabase.from("applications").select(`*, jobs:job_id(id, title), profiles:applicant_id(id, full_name, email, avatar_url), jobseeker_profiles:applicant_id(title, location, skills)`).in("job_id", jobIds).order("applied_at", { ascending: false });
        setApplications(data || []);
      }
    } else {
      const { data } = await supabase.from("applications").select(`*, jobs:job_id(id, title, location, job_type, employer_profiles:employer_id(company_name, company_logo_url))`).eq("applicant_id", user.id).order("applied_at", { ascending: false });
      setApplications(data || []);
    }
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        {user && profile && <DashboardNav user={user} profile={profile as any} />}
        <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!user || !profile) return null;
  const isEmployer = profile.role === "employer";

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={user} profile={profile as any} />
      <main className="pb-10">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">{isEmployer ? "Applications" : "My Applications"}</h1>
            <p className="text-muted-foreground">{isEmployer ? "Review and manage candidate applications" : "Track the status of your job applications"}</p>
          </div>

          <div className="grid gap-4">
            {applications.length > 0 ? applications.map((app) => (
              <div key={app.id} className="rounded-lg border border-border bg-card p-6">
                {isEmployer ? (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                          {app.profiles?.avatar_url ? (
                            <img src={app.profiles.avatar_url} alt={app.profiles.full_name} className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-lg font-semibold text-muted-foreground">{app.profiles?.full_name?.charAt(0) || "?"}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{app.profiles?.full_name}</div>
                          <p className="text-sm text-muted-foreground">{app.jobseeker_profiles?.title || app.profiles?.email}</p>
                          <p className="text-sm text-primary mt-1">Applied for: {app.jobs?.title}</p>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {app.jobseeker_profiles?.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{app.jobseeker_profiles.location}</span>}
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(app.applied_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />
                        <Link href={`/dashboard/applications/${app.id}`} className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
                          <Eye className="h-4 w-4 mr-1" />Review
                        </Link>
                      </div>
                    </div>
                    {app.jobseeker_profiles?.skills && app.jobseeker_profiles.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {app.jobseeker_profiles.skills.slice(0, 5).map((skill: string) => (
                          <span key={skill} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{skill}</span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {app.jobs?.employer_profiles?.company_logo_url ? (
                          <img src={app.jobs.employer_profiles.company_logo_url} alt={app.jobs.employer_profiles.company_name} className="h-12 w-12 rounded-lg object-cover" />
                        ) : (
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <Link href={`/dashboard/jobs/${app.jobs?.id}`} className="font-semibold hover:text-primary">{app.jobs?.title}</Link>
                        <p className="text-sm text-muted-foreground">{app.jobs?.employer_profiles?.company_name}</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {app.jobs?.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{app.jobs.location}</span>}
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Applied {timeAgo(app.applied_at)}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                )}
              </div>
            )) : (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">No applications yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isEmployer ? "Applications will appear here once candidates apply to your jobs" : "Start applying to jobs to track your applications here"}
                </p>
                {!isEmployer && (
                  <Link href="/dashboard/jobs" className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">Browse Jobs</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
