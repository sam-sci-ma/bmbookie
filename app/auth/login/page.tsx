import { LoginForm } from "@/components/login-form";
import { Navbar } from "@/components/home/Navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();

  // 1. Session Check
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const role = profile?.role?.toLowerCase();

    // 2. UPDATED: Systematic Tiered Redirects
    // Check for both 'admin' and 'superadmin' roles
    if (role === "admin" || role === "superadmin") {
      return redirect("/protected/admin");
    } else {
      return redirect("/dashboard");
    }
  }

  // SHARED STYLES
  const containerStyles = "max-w-7xl mx-auto px-6 md:px-8 w-full";

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      {/* 3. INTEGRATED NAVBAR */}
      <Navbar containerStyles={containerStyles} />

      {/* 4. LOGIN CONTENT */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <LoginForm />
        </div>
      </main>

      {/* Small footer for consistent branding */}
      <footer className="py-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
       Booky Shared Services | UM6P &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}