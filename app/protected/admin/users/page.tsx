import { createClient } from "@/lib/supabase/server";
import UsersView from "@/components/admin/users/UsersView";
import { redirect } from "next/navigation";

// Ensure this is the ONLY 'export default' in the file
export default async function UsersManagementPage() {
  const supabase = await createClient();

  // 1. Authenticate Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Parallel Fetch: Profiles and Departments
  const [profilesResponse, departmentsResponse] = await Promise.all([
    supabase
      .from("profiles")
      .select(`*, departments (name)`)
      .order("created_at", { ascending: false }),
    supabase
      .from("departments")
      .select("*")
      .order("name")
  ]);

  if (profilesResponse.error) console.error("User Fetch Error:", profilesResponse.error.message);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Institutional <span className="text-[#D7492A]">Users</span>
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Managing {profilesResponse.data?.length || 0} registered identities for the 2026 Rollout.
        </p>
      </div>

      <UsersView 
        initialUsers={profilesResponse.data || []} 
        departments={departmentsResponse.data || []}
        adminId={user.id} 
      />
    </div>
  );
}