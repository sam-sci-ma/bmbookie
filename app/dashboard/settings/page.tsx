// app/dashboard/settings/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/dashboard/settings/ProfileForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  
  // Fetch Profile and Departments in parallel for speed
  const [profileRes, deptsRes] = await Promise.all([
    supabase.from("profiles").select("*").single(),
    supabase.from("departments").select("*").order("name")
  ]);

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
          Update your institutional data for the 2026 Registry
        </p>
      </header>

      <ProfileForm 
        profile={profileRes.data} 
        departments={deptsRes.data || []} 
      />
    </div>
  );
}