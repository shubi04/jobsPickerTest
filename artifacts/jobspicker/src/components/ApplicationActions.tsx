import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { CheckCircle, XCircle, Calendar, MessageSquare, Loader2 } from "lucide-react";

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: string;
  onUpdate?: () => void;
}

const statusOptions = [
  { value: "reviewed", label: "Mark as Reviewed", icon: CheckCircle },
  { value: "shortlisted", label: "Shortlist", icon: CheckCircle },
  { value: "interview", label: "Schedule Interview", icon: Calendar },
  { value: "accepted", label: "Accept", icon: CheckCircle },
  { value: "rejected", label: "Reject", icon: XCircle },
];

export function ApplicationActions({ applicationId, currentStatus, onUpdate }: ApplicationActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const updateStatus = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId);
      if (error) throw error;
      onUpdate?.();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("applications").update({ employer_notes: notes }).eq("id", applicationId);
      if (error) throw error;
      setShowNotes(false);
      onUpdate?.();
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statusOptions
          .filter((option) => option.value !== currentStatus)
          .map((option) => {
            const Icon = option.icon;
            const isDestructive = option.value === "rejected";
            const isSuccess = option.value === "accepted" || option.value === "shortlisted";
            return (
              <button
                key={option.value}
                onClick={() => updateStatus(option.value)}
                disabled={isLoading}
                className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors disabled:opacity-50 ${
                  isDestructive
                    ? "border border-destructive/50 text-destructive hover:bg-destructive/10"
                    : isSuccess
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "border border-border bg-background hover:bg-muted"
                }`}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                {option.label}
              </button>
            );
          })}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
        >
          <MessageSquare className="h-4 w-4" />
          Add Notes
        </button>
      </div>

      {showNotes && (
        <div className="space-y-3">
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Add private notes about this candidate..."
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNotes(false)} className="h-8 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted">
              Cancel
            </button>
            <button onClick={saveNotes} disabled={isLoading} className="h-8 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {isLoading ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
