import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft, User, MapPin, Mail, Phone, Briefcase, Calendar,
  ExternalLink, MessageSquare, CheckCircle, XCircle, Clock, Eye, AlertCircle, Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ApplicationActions } from "@/components/ApplicationActions";
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

export default function ApplicationDetailPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    loadApplication();
  }, [params.id, user, authLoading]);

  const loadApplication = async () => {
    if (!user || !params.id) return;
    const supabase = createClient();
    const { data, error } = await supabase.from("applications").select(`*, jobs:job_id(id, title, employer_id, employer_profiles:employer_id(user_id, company_name)), profiles:applicant_id(id, full_name, email, phone, avatar_url), jobseeker_profiles:applicant_id(title, bio, skills, location, expected_salary, linkedin_url, portfolio_url, experience, education)`).eq("id", params.id).single();
    if (error || !data) { navigate("/dashboard/applications"); return; }
    const isEmployer = data.jobs?.employer_profiles?.user_id === user.id;
    const isApplicant = data.applicant_id === user.id;
    if (!isEmployer && !isApplicant) { navigate("/dashboard"); return; }
    setApplication(data);
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

  if (!user || !profile || !application) return null;

  const isEmployer = application.jobs?.employer_profiles?.user_id === user.id;

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={user} profile={profile as any} />
      <main className="pb-10">
        <div className="container py-8 max-w-4xl">
          <Link href="/dashboard/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />Back to applications
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted">
                      {application.profiles?.avatar_url ? (
                        <img src={application.profiles.avatar_url} alt={application.profiles.full_name} className="h-16 w-16 rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl font-semibold text-muted-foreground">{application.profiles?.full_name?.charAt(0) || "?"}</span>
                      )}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">{application.profiles?.full_name}</h1>
                      <p className="text-muted-foreground">{application.jobseeker_profiles?.title || "Job Seeker"}</p>
                      <p className="text-sm text-primary mt-1">Applied for: {application.jobs?.title}</p>
                    </div>
                  </div>
                  <StatusBadge status={application.status} />
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  {application.profiles?.email && (
                    <a href={`mailto:${application.profiles.email}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <Mail className="h-4 w-4" />{application.profiles.email}
                    </a>
                  )}
                  {application.profiles?.phone && (
                    <a href={`tel:${application.profiles.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <Phone className="h-4 w-4" />{application.profiles.phone}
                    </a>
                  )}
                  {application.jobseeker_profiles?.location && (
                    <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{application.jobseeker_profiles.location}</span>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  {application.jobseeker_profiles?.linkedin_url && (
                    <a href={application.jobseeker_profiles.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      LinkedIn<ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {application.jobseeker_profiles?.portfolio_url && (
                    <a href={application.jobseeker_profiles.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      Portfolio<ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {isEmployer && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <ApplicationActions applicationId={application.id} currentStatus={application.status} onUpdate={loadApplication} />
                  </div>
                )}
              </div>

              {application.cover_letter && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5" />Cover Letter</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{application.cover_letter}</p>
                </div>
              )}

              {application.jobseeker_profiles?.bio && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5" />About</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{application.jobseeker_profiles.bio}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {application.jobseeker_profiles?.skills && application.jobseeker_profiles.skills.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {application.jobseeker_profiles.skills.map((skill: string) => (
                      <span key={skill} className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {application.jobseeker_profiles?.expected_salary && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-2">Expected Salary</h2>
                  <div className="font-semibold">{application.jobseeker_profiles.expected_salary}</div>
                </div>
              )}

              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Application Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />Applied {formatDate(application.applied_at)}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <Link href={`/dashboard/jobs/${application.jobs?.id}`} className="text-primary hover:underline">{application.jobs?.title}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
