import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import {
  MapPin, Building2, Clock, DollarSign, Briefcase, Search, Bookmark, Loader2,
  Plus, Edit, Eye, ToggleLeft, ToggleRight,
} from "lucide-react";
import { formatSalary, timeAgo } from "@/lib/utils";
import { DashboardNav } from "@/components/DashboardNav";
import { JobFilters } from "@/components/JobFilters";
import { useAuth } from "@/hooks/useAuth";

export default function JobsPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", type: "", experience: "" });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    loadJobs();
  }, [user, profile, authLoading, filters]);

  const loadJobs = async () => {
    if (!user || !profile) return;
    const supabase = createClient();

    if (profile.role === "employer") {
      const { data: employerProfile } = await supabase.from("employer_profiles").select("id").eq("user_id", user.id).single();
      if (employerProfile) {
        const { data } = await supabase.from("jobs").select("*, employer_profiles:employer_id(company_name, company_logo_url)").eq("employer_id", employerProfile.id).order("created_at", { ascending: false });
        setJobs(data || []);
      }
    } else {
      let query = supabase.from("jobs").select("*, employer_profiles:employer_id(company_name, company_logo_url, location)").eq("is_active", true).order("created_at", { ascending: false });
      if (filters.q) query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
      if (filters.type) query = query.eq("job_type", filters.type);
      if (filters.experience) query = query.eq("experience_level", filters.experience);
      const { data } = await query.limit(50);
      setJobs(data || []);

      const { data: saved } = await supabase.from("saved_jobs").select("job_id").eq("user_id", user.id);
      setSavedJobIds(new Set(saved?.map(s => s.job_id) || []));
    }
    setIsLoading(false);
  };

  const toggleJobActive = async (jobId: string, isActive: boolean) => {
    const supabase = createClient();
    await supabase.from("jobs").update({ is_active: !isActive }).eq("id", jobId);
    loadJobs();
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{isEmployer ? "My Jobs" : "Browse Jobs"}</h1>
              <p className="text-muted-foreground">{isEmployer ? "Manage your job postings" : "Find your next opportunity from thousands of listings"}</p>
            </div>
            {isEmployer && (
              <Link href="/dashboard/jobs/new" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />Post New Job
              </Link>
            )}
          </div>

          {!isEmployer && (
            <div className="mb-8">
              <JobFilters
                filters={filters}
                onSearch={(q) => setFilters(f => ({ ...f, q }))}
                onFilter={(name, value) => setFilters(f => ({ ...f, [name]: f[name as keyof typeof f] === value ? "" : value }))}
                onClear={() => setFilters({ q: "", type: "", experience: "" })}
              />
            </div>
          )}

          <div className="grid gap-4">
            {jobs.length > 0 ? jobs.map((job) => (
              isEmployer ? (
                <div key={job.id} className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
                        <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.job_type}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{timeAgo(job.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${job.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                        {job.is_active ? "Active" : "Inactive"}
                      </span>
                      <Link href={`/dashboard/jobs/${job.id}`} className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
                        <Eye className="h-4 w-4 mr-1" />View
                      </Link>
                      <button onClick={() => toggleJobActive(job.id, job.is_active)} className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
                        {job.is_active ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-sm transition-all">
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
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.employer_profiles?.company_name}</p>
                      </div>
                    </div>
                    {savedJobIds.has(job.id) && <span className="text-primary"><Bookmark className="h-5 w-5 fill-current" /></span>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}{job.is_remote && " (Remote)"}</span>}
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.job_type}</span>
                    {(job.salary_min || job.salary_max) && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{timeAgo(job.created_at)}</span>
                  </div>
                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills_required.slice(0, 5).map((skill: string) => (
                        <span key={skill} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{skill}</span>
                      ))}
                      {job.skills_required.length > 5 && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">+{job.skills_required.length - 5} more</span>}
                    </div>
                  )}
                </Link>
              )
            )) : (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">{isEmployer ? "No jobs posted yet" : "No jobs found"}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isEmployer ? "Create your first job posting to start receiving applications." : "Try adjusting your filters or search terms"}
                </p>
                {isEmployer && (
                  <Link href="/dashboard/jobs/new" className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Post a Job
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
