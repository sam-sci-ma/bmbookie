"use client";
import { usePathname } from "next/navigation";

export default function AdminGuardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // This checks if we are in the admin sub-directory
  const isAdminArea = pathname.startsWith("/protected/admin");

  if (isAdminArea) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
        {/* We use 'bg-background' instead of 'bg-white' to ensure 
          your dark mode settings from globals.css are respected 
        */}
        <main className="relative flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Regular dashboard or guest view
  return <>{children}</>;
}