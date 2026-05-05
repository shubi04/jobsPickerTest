import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/HomePage";
import PublicJobsPage from "@/pages/PublicJobsPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import SignUpSuccessPage from "@/pages/auth/SignUpSuccessPage";
import AuthErrorPage from "@/pages/auth/AuthErrorPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import JobsPage from "@/pages/dashboard/JobsPage";
import NewJobPage from "@/pages/dashboard/NewJobPage";
import JobDetailPage from "@/pages/dashboard/JobDetailPage";
import ApplicationsPage from "@/pages/dashboard/ApplicationsPage";
import ApplicationDetailPage from "@/pages/dashboard/ApplicationDetailPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import CompanyPage from "@/pages/dashboard/CompanyPage";
import AdminPage from "@/pages/admin/AdminPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/jobs" component={PublicJobsPage} />

      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/signup" component={SignUpPage} />
      <Route path="/auth/signup-success" component={SignUpSuccessPage} />
      <Route path="/auth/error" component={AuthErrorPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />

      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/jobs" component={JobsPage} />
      <Route path="/dashboard/jobs/new" component={NewJobPage} />
      <Route path="/dashboard/jobs/:id" component={JobDetailPage} />
      <Route path="/dashboard/applications" component={ApplicationsPage} />
      <Route path="/dashboard/applications/:id" component={ApplicationDetailPage} />
      <Route path="/dashboard/profile" component={ProfilePage} />
      <Route path="/dashboard/company" component={CompanyPage} />

      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/users" component={AdminUsersPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
