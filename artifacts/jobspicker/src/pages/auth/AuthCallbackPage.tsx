import { useEffect } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.search
      );
      if (error) {
        navigate("/auth/error");
      } else {
        navigate("/dashboard");
      }
    };
    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="mt-4 text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
