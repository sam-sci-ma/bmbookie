"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "@/components/theme-switcher"; // Use the official component
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = (usePathname() || "");
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);
  const supabase = createClient();

  // 1. Fetch User Info
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        setUserIdentifier(profile?.full_name || user.email || "Admin");
      }
    };
    getUser();
  }, [supabase]);

  // 2. Format Page Title
  const segment = pathname.split("/").pop();
  const pageTitle = segment === "admin" ? "Overview" : segment?.charAt(0).toUpperCase() + (segment?.slice(1) || "");

  return (
    <header className="h-20 bg-background border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 font-sans transition-colors duration-300">
      
      {/* Page Title Section */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-[#D7492A] rounded-full" />
        <h2 className="font-black text-xl text-foreground tracking-tight">
          {pageTitle}
        </h2>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-4">
        
        {/* THEME SWITCHER (Imported from your home page logic) */}
        <div className="p-1">
          <ThemeSwitcher />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors group">
          <Bell size={20} className="group-hover:text-primary transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#D7492A] rounded-full border-2 border-background" />
        </button>

        <div className="h-8 w-[1px] bg-border mx-1" />

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-2 group">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-foreground">
              {userIdentifier}
            </span>
            <span className="text-[10px] font-black text-[#D7492A] uppercase tracking-[0.15em]">
              Administrator
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-foreground border border-border group-hover:border-[#D7492A] transition-all duration-300">
            <User size={20} />
          </div>
        </div>

      </div>
    </header>
  );
}