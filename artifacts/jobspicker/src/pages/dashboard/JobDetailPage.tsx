import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft, MapPin, Building2, Clock, DollarSign, Briefcase, CheckCircle,
  Users, Globe, Calendar, ExternalLink, Loader2,
} from "lucide-react";
import { formatSalary, timeAgo, formatDate } from "@/lib/utils";
import { DashboardNav } from "@/components/DashboardNav";
import { ApplyButton } from "@/components/ApplyButton";
import { SaveJobButton } from "@/components/SaveJobButton";
import { useAuth } from "@/hooks/useAuth";

export default function JobDetailPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [savedJob, setSavedJob] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    loadJob();
  }, [params.id, user, authLoading]);

  const loadJob = async () => {
    if (!user || !params.id) return;
    const supabase = createClient();
    const { data, error } = await supabase.from("jobs").select(`*, employer_profiles:employer_id(user_id, company_name, company_logo_url, company_description, industry, company_size, website, location, founded_year)`).eq("id", params.id).single();
    if (error || !data) { navigate("/dashboard/jobs"); return; }
    setJob(data);

    if (profile?.role !== "employer") {
      const { data: app } = await supabase.from("applications").select("id, status").eq("job_id", params.id).eq("applicant_id", user.id).single();
      setExistingApplication(app);
      const { data: saved } = await supabase.from("saved_jobs").select("id").eq("job_id", params.id).eq("user_id", user.id).single();
      setSavedJob(!!saved);
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

  if (!user || !profile || !job) return null;

  const isOwner = job.employer_profiles?.user_id === user.id;
  const isJobSeeker = profile.role === "jobseeker";

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={user} profile={profile as any} />
      <main className="pb-10">
        <div className="container py-8 max-w-4xl">
          <Link href="/dashboard/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />Back to jobs
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {job.employer_profiles?.company_logo_url ? (
                      <img src={job.employer_profiles.company_logo_url} alt={job.employer_profiles.company_name} className="h-16 w-16 rounded-lg object-cover" />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <p className="text-muted-foreground">{job.employer_profiles?.company_name}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}{job.is_remote && " (Remote)"}</span>}
                  <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.job_type}</span>
                  {job.experience_level && <span className="flex items-center gap-1"><Users className="h-4 w-4" />{job.experience_level}</span>}
                  {(job.salary_min || job.salary_max) && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{timeAgo(job.created_at)}</span>
                </div>

                {isJobSeeker && !isOwner && (
                  <div className="mt-6 flex gap-3">
                    {existingApplication ? (
                      <div className="flex items-center gap-2 rounded-md bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                        <CheckCircle className="h-4 w-4" />Applied - {existingApplication.status}
                      </div>
                    ) : (
                      <ApplyButton jobId={job.id} jobTitle={job.title} onApplied={loadJob} />
                    )}
                    <SaveJobButton jobId={job.id} isSaved={savedJob} userId={user.id} />
                  </div>
                )}

                {isOwner && (
                  <div className="mt-6 flex gap-3">
                    <Link href={`/dashboard/applications?job=${job.id}`} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      View Applications
                    </Link>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Job Description</h2>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</div>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 shrink-0 text-success mt-0.5" />{req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />{resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Benefits</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit: string, i: number) => (
                      <span key={i} className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">{benefit}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {job.skills_required && job.skills_required.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill: string) => (
                      <span key={skill} className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">About the Company</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {job.employer_profiles?.company_logo_url ? (
                      <img src={job.employer_profiles.company_logo_url} alt={job.employer_profiles.company_name} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{job.employer_profiles?.company_name}</div>
                    <div className="text-sm text-muted-foreground">{job.employer_profiles?.industry}</div>
                  </div>
                </div>
                {job.employer_profiles?.company_description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{job.employer_profiles.company_description}</p>
                )}
                <div className="space-y-2 text-sm">
                  {job.employer_profiles?.company_size && <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" />{job.employer_profiles.company_size} employees</div>}
                  {job.employer_profiles?.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{job.employer_profiles.location}</div>}
                  {job.employer_profiles?.founded_year && <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" />Founded {job.employer_profiles.founded_year}</div>}
                  {job.employer_profiles?.website && (
                    <a href={job.employer_profiles.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <Globe className="h-4 w-4" />Visit website<ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {job.application_deadline && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-2">Deadline</h2>
                  <div className="font-semibold">{formatDate(job.application_deadline)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
