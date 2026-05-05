import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import { Briefcase, ArrowLeft, Save, Loader2, Plus, X, DollarSign } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/hooks/useAuth";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];

export default function NewJobPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [employerProfileId, setEmployerProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("USD");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    checkEmployerProfile();
  }, [user, authLoading]);

  const checkEmployerProfile = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase.from("employer_profiles").select("id").eq("user_id", user.id).single();
    if (!data) { navigate("/dashboard/company"); return; }
    setEmployerProfileId(data.id);
    setIsLoading(false);
  };

  const addToArray = (value: string, array: string[], setArray: (a: string[]) => void, setValue: (v: string) => void) => {
    if (value.trim()) { setArray([...array, value.trim()]); setValue(""); }
  };
  const removeFromArray = (index: number, array: string[], setArray: (a: string[]) => void) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    if (!title.trim()) { setError("Job title is required"); setIsSaving(false); return; }
    if (!description.trim()) { setError("Job description is required"); setIsSaving(false); return; }
    if (!employerProfileId) { setError("Employer profile not found"); setIsSaving(false); return; }

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("jobs").insert({
        employer_id: employerProfileId,
        title: title.trim(), description: description.trim(),
        job_type: jobType, experience_level: experienceLevel || null,
        location: location.trim() || null, is_remote: isRemote,
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        salary_currency: salaryCurrency,
        skills_required: skills, requirements, responsibilities, benefits, is_active: true,
      });
      if (insertError) throw insertError;
      navigate("/dashboard/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={user} profile={profile as any} />
      <main className="pb-10">
        <div className="container py-8 max-w-3xl">
          <Link href="/dashboard/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />Back to jobs
          </Link>
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Post a New Job</h1>
            <p className="text-muted-foreground">Fill in the details to create a new job posting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5" />Job Details</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Senior Frontend Developer" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Type *</label>
                    <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select level</option>
                      {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. New York, NY" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} className="h-4 w-4 rounded border-input" />
                      <span className="text-sm font-medium">Remote position</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Job Description *</label>
                  <textarea rows={6} required value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Describe the role..." />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><DollarSign className="h-5 w-5" />Compensation</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Salary</label>
                  <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="50000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Salary</label>
                  <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="80000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select value={salaryCurrency} onChange={(e) => setSalaryCurrency(e.target.value)} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            {[
              { label: "Required Skills", items: skills, setItems: setSkills, newItem: newSkill, setNewItem: setNewSkill, placeholder: "Add a skill...", type: "tag" },
              { label: "Requirements", items: requirements, setItems: setRequirements, newItem: newRequirement, setNewItem: setNewRequirement, placeholder: "Add a requirement...", type: "list" },
              { label: "Responsibilities", items: responsibilities, setItems: setResponsibilities, newItem: newResponsibility, setNewItem: setNewResponsibility, placeholder: "Add a responsibility...", type: "list" },
              { label: "Benefits", items: benefits, setItems: setBenefits, newItem: newBenefit, setNewItem: setNewBenefit, placeholder: "Add a benefit...", type: "tag" },
            ].map((section) => (
              <div key={section.label} className="rounded-lg border border-border bg-card p-6">
                <h2 className="font-semibold mb-4">{section.label}</h2>
                {section.type === "tag" ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {section.items.map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {item}
                        <button type="button" onClick={() => removeFromArray(i, section.items, section.setItems)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2 mb-4">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                        {item}
                        <button type="button" onClick={() => removeFromArray(i, section.items, section.setItems)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={section.placeholder}
                    value={section.newItem}
                    onChange={(e) => section.setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToArray(section.newItem, section.items, section.setItems, section.setNewItem))}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button type="button" onClick={() => addToArray(section.newItem, section.items, section.setItems, section.setNewItem)} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
                    <Plus className="h-4 w-4" />Add
                  </button>
                </div>
              </div>
            ))}

            {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

            <div className="flex justify-end gap-4">
              <Link href="/dashboard/jobs" className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium hover:bg-muted">Cancel</Link>
              <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Publishing...</> : <><Save className="h-4 w-4" />Publish Job</>}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
