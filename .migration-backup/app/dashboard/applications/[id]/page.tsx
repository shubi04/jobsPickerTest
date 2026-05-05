import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  ExternalLink,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ApplicationActions } from "@/components/application-actions";

export default async function ApplicationDetailPage({
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

  // Get application with all related data
  const { data: application, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      jobs:job_id (
        id,
        title,
        employer_id,
        employer_profiles:employer_id (
          user_id,
          company_name
        )
      ),
      profiles:applicant_id (
        id,
        full_name,
        email,
        phone,
        avatar_url
      ),
      jobseeker_profiles:applicant_id (
        title,
        bio,
        skills,
        location,
        expected_salary,
        linkedin_url,
        portfolio_url,
        experience,
        education
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !application) {
    notFound();
  }

  // Check if current user is the employer for this job
  const isEmployer = application.jobs?.employer_profiles?.user_id === user.id;
  const isApplicant = application.applicant_id === user.id;

  if (!isEmployer && !isApplicant) {
    redirect("/dashboard");
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Header */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted">
                  {application.profiles?.avatar_url ? (
                    <img
                      src={application.profiles.avatar_url}
                      alt={application.profiles.full_name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {application.profiles?.full_name?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    {application.profiles?.full_name}
                  </h1>
                  <p className="text-muted-foreground">
                    {application.jobseeker_profiles?.title || "Job Seeker"}
                  </p>
                  <p className="text-sm text-primary mt-1">
                    Applied for: {application.jobs?.title}
                  </p>
                </div>
              </div>
              <StatusBadge status={application.status} />
            </div>

            {/* Contact Info */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {application.profiles?.email && (
                <a
                  href={`mailto:${application.profiles.email}`}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {application.profiles.email}
                </a>
              )}
              {application.profiles?.phone && (
                <a
                  href={`tel:${application.profiles.phone}`}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {application.profiles.phone}
                </a>
              )}
              {application.jobseeker_profiles?.location && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {application.jobseeker_profiles.location}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="mt-4 flex gap-3">
              {application.jobseeker_profiles?.linkedin_url && (
                <a
                  href={application.jobseeker_profiles.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {application.jobseeker_profiles?.portfolio_url && (
                <a
                  href={application.jobseeker_profiles.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Portfolio
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Employer Actions */}
            {isEmployer && (
              <div className="mt-6 pt-6 border-t border-border">
                <ApplicationActions
                  applicationId={application.id}
                  currentStatus={application.status}
                />
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Cover Letter
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {application.cover_letter}
              </p>
            </div>
          )}

          {/* Bio */}
          {application.jobseeker_profiles?.bio && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                About
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {application.jobseeker_profiles.bio}
              </p>
            </div>
          )}

          {/* Experience */}
          {application.jobseeker_profiles?.experience &&
            application.jobseeker_profiles.experience.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience
                </h2>
                <div className="space-y-4">
                  {application.jobseeker_profiles.experience.map(
                    (exp: {
                      title: string;
                      company: string;
                      start_date: string;
                      end_date: string;
                      description: string;
                    }, i: number) => (
                      <div
                        key={i}
                        className="border-l-2 border-primary/20 pl-4"
                      >
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {exp.company}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {exp.start_date} - {exp.end_date || "Present"}
                        </div>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Education */}
          {application.jobseeker_profiles?.education &&
            application.jobseeker_profiles.education.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Education
                </h2>
                <div className="space-y-4">
                  {application.jobseeker_profiles.education.map(
                    (edu: {
                      degree: string;
                      school: string;
                      year: string;
                    }, i: number) => (
                      <div
                        key={i}
                        className="border-l-2 border-primary/20 pl-4"
                      >
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-sm text-muted-foreground">
                          {edu.school}
                        </div>
                        {edu.year && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {edu.year}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {application.jobseeker_profiles?.skills &&
            application.jobseeker_profiles.skills.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {application.jobseeker_profiles.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Application Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Application Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Applied</span>
                <span>{formatDate(application.applied_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize">{application.status}</span>
              </div>
              {application.jobseeker_profiles?.expected_salary && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expected Salary</span>
                  <span>{application.jobseeker_profiles.expected_salary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Employer Notes */}
          {isEmployer && application.employer_notes && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4">Notes</h2>
              <p className="text-sm text-muted-foreground">
                {application.employer_notes}
              </p>
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
      label: "Pending Review",
      className: "bg-muted text-muted-foreground",
      icon: Clock,
    },
    reviewed: {
      label: "Reviewed",
      className: "bg-primary/10 text-primary",
      icon: CheckCircle,
    },
    shortlisted: {
      label: "Shortlisted",
      className: "bg-success/10 text-success",
      icon: CheckCircle,
    },
    interview: {
      label: "Interview Scheduled",
      className: "bg-warning/10 text-warning",
      icon: Calendar,
    },
    rejected: {
      label: "Not Selected",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.className}`}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
}
