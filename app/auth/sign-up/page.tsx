import { SignUpForm } from "@/components/sign-up-form";
import { Navbar } from "@/components/home/Navbar";

export default function Page() {
  // Shared layout constants from your homepage
  const containerStyles = "max-w-7xl mx-auto px-6 md:px-8 w-full";

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      {/* 1. TOP NAVIGATION */}
      <Navbar containerStyles={containerStyles} />

      {/* 2. SIGN UP CONTENT */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SignUpForm />
        </div>
      </main>

      {/* 3. BRAND FOOTER */}
      <footer className="py-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
        Account Creation • Booky Shared Services 2026
      </footer>
    </div>
  );
}