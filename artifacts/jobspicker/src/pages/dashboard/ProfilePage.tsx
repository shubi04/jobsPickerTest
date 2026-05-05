import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import { User, MapPin, Briefcase, Save, Loader2, Plus, X, Link as LinkIcon } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, profile: authProfile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [jobseekerProfile, setJobseekerProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    loadProfile();
  }, [user, authLoading]);

  const loadProfile = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const { data: jsData } = await supabase.from("jobseeker_profiles").select("*").eq("user_id", user.id).single();
    setProfile(profileData);
    setJobseekerProfile(jsData || { title: null, bio: null, skills: [], location: null, expected_salary: null, linkedin_url: null, portfolio_url: null });
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const supabase = createClient();
      const { error: profileError } = await supabase.from("profiles").update({ full_name: profile.full_name, phone: profile.phone }).eq("id", user!.id);
      if (profileError) throw profileError;

      const { data: existing } = await supabase.from("jobseeker_profiles").select("id").eq("user_id", user!.id).single();
      if (existing) {
        const { error: jsError } = await supabase.from("jobseeker_profiles").update({ title: jobseekerProfile?.title, bio: jobseekerProfile?.bio, skills: jobseekerProfile?.skills || [], location: jobseekerProfile?.location, expected_salary: jobseekerProfile?.expected_salary, linkedin_url: jobseekerProfile?.linkedin_url, portfolio_url: jobseekerProfile?.portfolio_url }).eq("user_id", user!.id);
        if (jsError) throw jsError;
      } else {
        const { error: jsError } = await supabase.from("jobseeker_profiles").insert({ user_id: user!.id, ...jobseekerProfile, skills: jobseekerProfile?.skills || [] });
        if (jsError) throw jsError;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && jobseekerProfile) {
      setJobseekerProfile({ ...jobseekerProfile, skills: [...(jobseekerProfile.skills || []), newSkill.trim()] });
      setNewSkill("");
    }
  };
  const removeSkill = (skill: string) => {
    if (jobseekerProfile) setJobseekerProfile({ ...jobseekerProfile, skills: jobseekerProfile.skills.filter((s: string) => s !== skill) });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        {user && authProfile && <DashboardNav user={user} profile={authProfile as any} />}
        <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!user || !authProfile) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={user} profile={authProfile as any} />
      <main className="pb-10">
        <div className="container py-8 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Update your profile information to help employers find you</p>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5" />Basic Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input type="text" value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input type="tel" value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile!, phone: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Professional Title</label>
                  <input type="text" placeholder="e.g. Senior Frontend Developer" value={jobseekerProfile?.title || ""} onChange={(e) => setJobseekerProfile({ ...jobseekerProfile!, title: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5" />Location & Expectations</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input type="text" placeholder="e.g. New York, NY" value={jobseekerProfile?.location || ""} onChange={(e) => setJobseekerProfile({ ...jobseekerProfile!, location: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Salary</label>
                  <input type="text" placeholder="e.g. $80,000 - $100,000" value={jobseekerProfile?.expected_salary || ""} onChange={(e) => setJobseekerProfile({ ...jobseekerProfile!, expected_salary: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5" />Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {jobseekerProfile?.skills?.map((skill: string) => (
                  <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={addSkill} className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted"><Plus className="h-4 w-4" />Add</button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4">About Me</h2>
              <textarea rows={4} placeholder="Write a brief summary about yourself..." value={jobseekerProfile?.bio || ""} onChange={(e) => setJobseekerProfile({ ...jobseekerProfile!, bio: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><LinkIcon className="h-5 w-5" />Links</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                  <input type="url" placeholder="https://linkedin.com/in/yourprofile" value={jobseekerProfile?.linkedin_url || ""} onChange={(e) => setJobseekerProfile({ ...jobseekerProfile!, linkedin_url: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                  <input type="url" placeholder="https://yourportfolio.com" value={jobseekerProfile?.portfolio_url || ""} onChange={(e) => setJobseekerProfile({ ...jobseekerProfile!, portfolio_url: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
            {success && <div className="rounded-md bg-success/10 p-4 text-sm text-success">Profile saved successfully!</div>}

            <div className="flex justify-end">
              <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Profile</>}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
