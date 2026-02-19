import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSettingsView from "@/components/admin/settings/AdminSettingsView";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  
  // 1. Verify Admin/Superadmin Authority
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user is found, send to login immediately
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // SYSTEMATIC FIX: Define allowed roles for governance
  const allowedRoles = ['admin', 'superadmin'];
  const userRole = profile?.role?.toLowerCase();

  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect("/dashboard");
  }

  // 2. Fetch Institutional Config in parallel
  const [clusters, departments, rules] = await Promise.all([
    supabase.from("clusters").select("*").order("name"),
    supabase.from("departments").select("*, clusters(name)").order("name"),
    supabase.from("booking_rules").select("*").order("role_type")
  ]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Institutional Control</h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-2 font-bold">
          2026 Shared services
        </p>
      </header>

      <AdminSettingsView 
        initialClusters={clusters.data || []} 
        initialDepartments={departments.data || []} 
        initialRules={rules.data || []} 
      />
    </div>
  );
}