import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { createClient } from "@/lib/supabase";
import { Users, Shield, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsersPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth/login"); return; }
    if (profile && profile.role !== "admin") { navigate("/dashboard"); return; }
    if (profile) loadUsers();
  }, [user, profile, authLoading]);

  const loadUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
    setIsLoading(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive">
              <Shield className="h-5 w-5 text-destructive-foreground" />
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/admin/users" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-muted text-foreground">
              <Users className="h-4 w-4" />Users
            </Link>
          </nav>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Exit Admin</Link>
        </div>
      </header>
      <main className="py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage all registered users on the platform</p>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length > 0 ? users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.full_name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <span className="text-sm font-semibold text-muted-foreground">{u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{u.full_name || "No name"}</div>
                          <div className="text-sm text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${u.role === "admin" ? "bg-destructive/10 text-destructive" : u.role === "employer" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {u.role === "admin" && <Shield className="h-3 w-3" />}{u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(u.created_at)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
