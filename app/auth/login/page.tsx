import { LoginForm } from "@/components/login-form";
import { Navbar } from "@/components/home/Navbar"; // Imported your component
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

    // 2. Absolute Path Redirects
    if (role === "admin") {
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

      {/* Optional: Small footer for consistent branding */}
      <footer className="py-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
        Secure Access • Booky Shared Services 2026
      </footer>
    </div>
  );
}