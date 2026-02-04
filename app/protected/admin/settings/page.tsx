import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSettingsView from "@/components/admin/settings/AdminSettingsView";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  
  // Verify Admin Authority
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== 'admin') redirect("/dashboard");

  // Fetch Institutional Config in parallel
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
          2026 Governance: Clusters, Departments & Booking Protocols
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