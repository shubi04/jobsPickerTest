"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Briefcase,
  LayoutDashboard,
  Search,
  FileText,
  User,
  Building2,
  LogOut,
  Menu,
  X,
  Bell,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "jobseeker" | "employer" | "admin";
  avatar_url: string | null;
}

interface DashboardNavProps {
  user: SupabaseUser;
  profile: Profile | null;
}

const jobseekerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Browse Jobs", icon: Search },
  { href: "/dashboard/applications", label: "My Applications", icon: FileText },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

const employerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/company", label: "Company Profile", icon: Building2 },
];

export function DashboardNav({ user, profile }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEmployer = profile?.role === "employer";
  const links = isEmployer ? employerLinks : jobseekerLinks;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">JobsPicker</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isEmployer && (
              <Link
                href="/dashboard/jobs/new"
                className="hidden sm:inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Post Job
              </Link>
            )}

            <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">
                  {profile?.full_name || "User"}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {profile?.role || "jobseeker"}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container py-4 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              <hr className="my-2" />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
