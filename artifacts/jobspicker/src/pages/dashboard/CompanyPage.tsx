import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import { Building2, MapPin, Globe, Users, Calendar, Save, Loader2 } from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/hooks/useAuth";

const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];
const industries = ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Marketing", "Consulting", "Real Estate", "Transportation", "Energy", "Entertainment", "Non-profit", "Government", "Other"];

export default function CompanyPage() {
  const { user, profile: authProfile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState({ company_name: "", company_description: null as string | null, company_logo_url: null as string | null, industry: null as string | null, company_size: null as string | null, website: null as string | null, location: null as string | null, founded_year: null as number | null, headquarters: null as string | null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    loadProfile();
  }, [user, authLoading]);

  const loadProfile = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data: userProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (userProfile?.role !== "employer") { navigate("/dashboard"); return; }
    const { data: ep } = await supabase.from("employer_profiles").select("*").eq("user_id", user.id).single();
    if (ep) { setProfile(ep); setIsNewProfile(false); }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    if (!profile.company_name.trim()) { setError("Company name is required"); setIsSaving(false); return; }
    try {
      const supabase = createClient();
      if (isNewProfile) {
        const { error: insertError } = await supabase.from("employer_profiles").insert({ user_id: user!.id, ...profile });
        if (insertError) throw insertError;
        setIsNewProfile(false);
      } else {
        const { error: updateError } = await supabase.from("employer_profiles").update(profile).eq("user_id", user!.id);
        if (updateError) throw updateError;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
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
            <h1 className="text-2xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground">Showcase your company to attract the best talent</p>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="h-5 w-5" />Company Information</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input type="text" required value={profile.company_name} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Acme Inc." />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select value={profile.industry || ""} onChange={(e) => setProfile({ ...profile, industry: e.target.value || null })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select industry</option>
                      {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Size</label>
                    <select value={profile.company_size || ""} onChange={(e) => setProfile({ ...profile, company_size: e.target.value || null })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select size</option>
                      {companySizes.map((s) => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Description</label>
                  <textarea rows={4} value={profile.company_description || ""} onChange={(e) => setProfile({ ...profile, company_description: e.target.value || null })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Tell candidates about your company culture, mission, and values..." />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5" />Location & Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input type="text" placeholder="e.g. San Francisco, CA" value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value || null })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Founded Year</label>
                  <input type="number" placeholder="e.g. 2015" value={profile.founded_year || ""} onChange={(e) => setProfile({ ...profile, founded_year: e.target.value ? parseInt(e.target.value) : null })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input type="url" placeholder="https://yourcompany.com" value={profile.website || ""} onChange={(e) => setProfile({ ...profile, website: e.target.value || null })} className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
            {success && <div className="rounded-md bg-success/10 p-4 text-sm text-success">Company profile saved successfully!</div>}

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
