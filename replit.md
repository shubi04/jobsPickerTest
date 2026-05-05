# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: Supabase (PostgreSQL, auth, and storage — external, not Replit DB)
- **Frontend**: React + Vite + Tailwind CSS v4
- **Routing**: Wouter
- **Build**: Vite

## Artifacts

### JobsPicker (`artifacts/jobspicker/`)
- **Kind**: React + Vite web app
- **Preview path**: `/`
- **Port**: 19676 (via `PORT` env var)
- **Supabase secrets**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Description**: Full job board app migrated from Next.js to React+Vite. Supports job seekers, employers, and admins.

#### Pages
- `/` — Public homepage
- `/jobs` — Public job listings (reads from Supabase `jobs` table)
- `/auth/login` — Login with email/password
- `/auth/signup` — Sign up (job seeker or employer)
- `/auth/callback` — Supabase OAuth callback handler
- `/dashboard` — Authenticated dashboard (role-aware: jobseeker vs employer)
- `/dashboard/jobs` — Browse jobs (jobseeker) or manage postings (employer)
- `/dashboard/jobs/new` — Create a new job posting (employer only)
- `/dashboard/jobs/:id` — Job detail with apply/save buttons
- `/dashboard/applications` — Track applications (jobseeker) or review candidates (employer)
- `/dashboard/applications/:id` — Application detail with employer actions
- `/dashboard/profile` — Job seeker profile editor
- `/dashboard/company` — Employer company profile editor
- `/admin` — Admin dashboard (admin role only)
- `/admin/users` — User management table

#### Key source files
- `src/App.tsx` — Wouter router with all routes
- `src/lib/supabase.ts` — Supabase browser client (uses `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`)
- `src/lib/utils.ts` — `cn()`, `formatSalary()`, `timeAgo()`, `formatDate()`
- `src/hooks/useAuth.ts` — Auth state hook (user + profile + isLoading)
- `src/components/DashboardNav.tsx` — Sticky nav for authenticated pages
- `src/components/ApplyButton.tsx` — Apply modal with cover letter
- `src/components/SaveJobButton.tsx` — Toggle save job
- `src/components/ApplicationActions.tsx` — Employer status update actions
- `src/components/JobFilters.tsx` — Search + filter bar

#### Supabase tables used
- `profiles` — user data + role (`jobseeker` | `employer` | `admin`)
- `jobseeker_profiles` — extended profile for job seekers
- `employer_profiles` — company profile for employers
- `jobs` — job listings
- `applications` — job applications
- `saved_jobs` — saved/bookmarked jobs

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/jobspicker run dev` — run JobsPicker locally
