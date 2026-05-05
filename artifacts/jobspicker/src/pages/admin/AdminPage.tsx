import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import { Users, Building2, Briefcase, FileText, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState({ users: 0, employers: 0, jobs: 0, applications: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    if (profile && profile.role !== "admin") { navigate("/dashboard"); return; }
    if (profile) loadData();
  }, [user, profile, authLoading]);

  const loadData = async () => {
    const supabase = createClient();
    const [{ count: uc }, { count: ec }, { count: jc }, { count: ac }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("employer_profiles").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }),
    ]);
    setStats({ users: uc || 0, employers: ec || 0, jobs: jc || 0, applications: ac || 0 });
    const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5);
    const { data: jobs } = await supabase.from("jobs").select("*, employer_profiles:employer_id(company_name)").order("created_at", { ascending: false }).limit(5);
    setRecentUsers(users || []);
    setRecentJobs(jobs || []);
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive">
              <Shield className="h-5 w-5 text-destructive-foreground" />
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/admin/users" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <Users className="h-4 w-4" />Users
            </Link>
          </nav>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Exit Admin</Link>
        </div>
      </header>
      <main className="py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of platform activity and statistics</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { label: "Total Users", value: stats.users, icon: Users, color: "text-primary", bgColor: "bg-primary/10" },
              { label: "Companies", value: stats.employers, icon: Building2, color: "text-success", bgColor: "bg-success/10" },
              { label: "Jobs Posted", value: stats.jobs, icon: Briefcase, color: "text-warning", bgColor: "bg-warning/10" },
              { label: "Applications", value: stats.applications, icon: FileText, color: "text-destructive", bgColor: "bg-destructive/10" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                  <div><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm text-muted-foreground">{stat.label}</div></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="font-semibold">Recent Users</h2>
                <Link href="/admin/users" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-border">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-semibold text-muted-foreground">{u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}</span>
                      </div>
                      <div>
                        <div className="font-medium">{u.full_name || "No name"}</div>
                        <div className="text-sm text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">{u.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold">Recent Jobs</h2>
              </div>
              <div className="divide-y divide-border">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">{job.employer_profiles?.company_name}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${job.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {job.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
