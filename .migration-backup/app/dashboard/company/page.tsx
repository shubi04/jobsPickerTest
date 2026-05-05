"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Save,
  Loader2,
} from "lucide-react";

interface EmployerProfile {
  company_name: string;
  company_description: string | null;
  company_logo_url: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  location: string | null;
  founded_year: number | null;
  headquarters: string | null;
}

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Consulting",
  "Real Estate",
  "Transportation",
  "Energy",
  "Entertainment",
  "Non-profit",
  "Government",
  "Other",
];

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile>({
    company_name: "",
    company_description: null,
    company_logo_url: null,
    industry: null,
    company_size: null,
    website: null,
    location: null,
    founded_year: null,
    headquarters: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Check user role
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userProfile?.role !== "employer") {
      router.push("/dashboard");
      return;
    }

    // Get employer profile
    const { data: employerData } = await supabase
      .from("employer_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (employerData) {
      setProfile(employerData);
      setIsNewProfile(false);
    }

    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    if (!profile.company_name.trim()) {
      setError("Company name is required");
      setIsSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (isNewProfile) {
        // Insert new
        const { error: insertError } = await supabase
          .from("employer_profiles")
          .insert({
            user_id: user.id,
            ...profile,
          });

        if (insertError) throw insertError;
        setIsNewProfile(false);
      } else {
        // Update existing
        const { error: updateError } = await supabase
          .from("employer_profiles")
          .update(profile)
          .eq("user_id", user.id);

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

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <p className="text-muted-foreground">
          {isNewProfile
            ? "Set up your company profile to start posting jobs"
            : "Update your company information"}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={profile.company_name}
                onChange={(e) =>
                  setProfile({ ...profile, company_name: e.target.value })
                }
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company Logo URL
              </label>
              <input
                type="url"
                value={profile.company_logo_url || ""}
                onChange={(e) =>
                  setProfile({ ...profile, company_logo_url: e.target.value })
                }
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry
                </label>
                <select
                  value={profile.industry || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, industry: e.target.value })
                  }
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Size
                </label>
                <select
                  value={profile.company_size || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, company_size: e.target.value })
                  }
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company Description
              </label>
              <textarea
                rows={4}
                value={profile.company_description || ""}
                onChange={(e) =>
                  setProfile({ ...profile, company_description: e.target.value })
                }
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Tell candidates about your company, culture, and what makes it a great place to work..."
              />
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location & Details
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Headquarters
              </label>
              <input
                type="text"
                value={profile.headquarters || ""}
                onChange={(e) =>
                  setProfile({ ...profile, headquarters: e.target.value })
                }
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Office Location
              </label>
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Full address or city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Founded Year
              </label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={profile.founded_year || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    founded_year: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. 2015"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                value={profile.website || ""}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-success/10 p-4 text-sm text-success">
            Company profile saved successfully!
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isNewProfile ? "Create Profile" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
