// app/protected/admin/layout.tsx
import { createClient } from "@/lib/supabase/server"; 
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar"; 
import Header from "@/components/admin/Header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role?.toLowerCase();

  // SYSTEMATIC FIX: Allow both 'admin' and 'superadmin'
  if (role !== "admin" && role !== "superadmin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#F0F0F0]">
      <Sidebar /> 
      
      <div className="flex flex-1 flex-col">
        <Header />
        {/* Note: I'm keeping your 'bg-white' and 'border-black' 
            as requested to maintain your design logic */}
        <main className="p-8 flex-1 overflow-y-auto border-l-4 border-black bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}