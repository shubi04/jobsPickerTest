import { createClient } from "@/lib/supabase/server";
import { Users, Building2, Briefcase, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get counts
  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: employerCount } = await supabase
    .from("employer_profiles")
    .select("*", { count: "exact", head: true });

  const { count: jobCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  const { count: applicationCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true });

  // Get recent activity
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentJobs } = await supabase
    .from("jobs")
    .select(
      `
      *,
      employer_profiles:employer_id (company_name)
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Total Users",
      value: userCount || 0,
      icon: Users,
      href: "/admin/users",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Companies",
      value: employerCount || 0,
      icon: Building2,
      href: "/admin/companies",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Jobs Posted",
      value: jobCount || 0,
      icon: Briefcase,
      href: "/admin/jobs",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Applications",
      value: applicationCount || 0,
      icon: FileText,
      href: "/admin/applications",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform activity and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
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
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.full_name || "No name"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No users yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Jobs</h2>
            <Link
              href="/admin/jobs"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentJobs && recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {job.employer_profiles?.company_name}
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
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No jobs yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
