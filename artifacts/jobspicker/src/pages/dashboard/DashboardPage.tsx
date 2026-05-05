import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import {
  Briefcase,
  FileText,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    loadDashboard();
  }, [user, profile, authLoading]);

  const loadDashboard = async () => {
    if (!user || !profile) return;
    const supabase = createClient();

    if (profile.role === "employer") {
      const { data: employerProfile } = await supabase.from("employer_profiles").select("id").eq("user_id", user.id).single();
      if (employerProfile) {
        const { count: totalJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true }).eq("employer_id", employerProfile.id);
        const { count: activeJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true }).eq("employer_id", employerProfile.id).eq("is_active", true);
        const { data: jobs } = await supabase.from("jobs").select("id").eq("employer_id", employerProfile.id);
        const jobIds = jobs?.map(j => j.id) || [];
        let totalApplications = 0;
        let recentApps: any[] = [];
        if (jobIds.length > 0) {
          const { count } = await supabase.from("applications").select("*", { count: "exact", head: true }).in("job_id", jobIds);
          totalApplications = count || 0;
          const { data: apps } = await supabase.from("applications").select(`*, jobs:job_id (title), profiles:applicant_id (full_name)`).in("job_id", jobIds).order("applied_at", { ascending: false }).limit(5);
          recentApps = apps || [];
        }
        setStats([
          { label: "Total Jobs", value: totalJobs || 0, icon: Briefcase, color: "text-primary", bgColor: "bg-primary/10" },
          { label: "Active Jobs", value: activeJobs || 0, icon: CheckCircle, color: "text-success", bgColor: "bg-success/10" },
          { label: "Applications", value: totalApplications, icon: FileText, color: "text-warning", bgColor: "bg-warning/10" },
        ]);
        setRecentItems(recentApps);
      }
    } else {
      const { count: applied } = await supabase.from("applications").select("*", { count: "exact", head: true }).eq("applicant_id", user.id);
      const { count: saved } = await supabase.from("saved_jobs").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const { data: apps } = await supabase.from("applications").select(`*, jobs:job_id (title, employer_profiles:employer_id(company_name))`).eq("applicant_id", user.id).order("applied_at", { ascending: false }).limit(5);
      setStats([
        { label: "Applications", value: applied || 0, icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
        { label: "Saved Jobs", value: saved || 0, icon: Briefcase, color: "text-warning", bgColor: "bg-warning/10" },
        { label: "Profile Views", value: 0, icon: TrendingUp, color: "text-success", bgColor: "bg-success/10" },
      ]);
      setRecentItems(apps || []);
    }
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        {user && profile && <DashboardNav user={user} profile={profile as any} />}
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={user} profile={profile as any} />
      <main className="pb-10">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.full_name || (profile?.role === "employer" ? "Employer" : "Job Seeker")}!
            </h1>
            <p className="text-muted-foreground">Here's an overview of your {profile?.role === "employer" ? "job postings" : "job search"}.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
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

          {profile?.role === "employer" && (
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <Link href="/dashboard/jobs/new" className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Post New Job</div>
                  <div className="text-sm text-muted-foreground">Create a new job listing</div>
                </div>
              </Link>
              <Link href="/dashboard/applications" className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Review Applications</div>
                  <div className="text-sm text-muted-foreground">Manage incoming applications</div>
                </div>
              </Link>
            </div>
          )}

          {profile?.role !== "employer" && (
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <Link href="/dashboard/jobs" className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Browse Jobs</div>
                  <div className="text-sm text-muted-foreground">Find your next opportunity</div>
                </div>
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Update Profile</div>
                  <div className="text-sm text-muted-foreground">Stand out to employers</div>
                </div>
              </Link>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">{profile?.role === "employer" ? "Recent Applications" : "Recent Applications"}</h2>
            </div>
            <div className="divide-y divide-border">
              {recentItems.length > 0 ? recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="font-medium">
                      {profile?.role === "employer" ? item.profiles?.full_name : item.jobs?.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {profile?.role === "employer" ? `Applied for ${item.jobs?.title}` : item.jobs?.employer_profiles?.company_name}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )) : (
                <div className="px-6 py-8 text-center text-muted-foreground">
                  {profile?.role === "employer" ? "No applications yet. Post a job to start receiving applications." : "No applications yet. Start browsing jobs!"}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
