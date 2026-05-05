"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bookmark, Loader2 } from "lucide-react";

interface SaveJobButtonProps {
  jobId: string;
  isSaved: boolean;
  userId: string;
}

export function SaveJobButton({ jobId, isSaved, userId }: SaveJobButtonProps) {
  const [saved, setSaved] = useState(isSaved);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleSave = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      if (saved) {
        // Remove from saved
        await supabase
          .from("saved_jobs")
          .delete()
          .eq("job_id", jobId)
          .eq("user_id", userId);
        setSaved(false);
      } else {
        // Add to saved
        await supabase.from("saved_jobs").insert({
          job_id: jobId,
          user_id: userId,
        });
        setSaved(true);
      }

      router.refresh();
    } catch (err) {
      console.error("Failed to toggle save:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors ${
        saved
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background hover:bg-muted"
      } disabled:opacity-50`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      )}
      {saved ? "Saved" : "Save Job"}
    </button>
  );
}
