"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "@/components/theme-switcher";
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
  const pageTitle = segment === "admin" ? "Overview" : segment?.replace(/-/g, ' ').charAt(0).toUpperCase() + (segment?.slice(1) || "");

  return (
    <header className="h-16 md:h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-[40] font-sans transition-all duration-300">
      
      {/* Page Title Section */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="w-1 md:w-1.5 h-5 md:h-6 bg-[#D7492A] rounded-full flex-shrink-0" />
        <h2 className="font-black text-lg md:text-xl text-foreground tracking-tight truncate">
          {pageTitle}
        </h2>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* THEME SWITCHER */}
        <div className="scale-90 md:scale-100">
          <ThemeSwitcher />
        </div>

        {/* Notifications */}
        <button className="relative p-2 md:p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors group">
          <Bell size={18} className="md:w-5 md:h-5 group-hover:text-primary transition-colors" />
          <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 w-2 h-2 bg-[#D7492A] rounded-full border-2 border-background" />
        </button>

        {/* Separator - Hidden on very small screens */}
        <div className="hidden xs:block h-6 md:h-8 w-[1px] bg-border mx-0.5 md:mx-1" />

        {/* User Profile Section */}
        <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2 group">
          {/* Text Labels - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs md:text-sm font-bold text-foreground line-clamp-1 max-w-[120px]">
              {userIdentifier}
            </span>
            <span className="text-[8px] md:text-[10px] font-black text-[#D7492A] uppercase tracking-[0.15em]">
              Administrator
            </span>
          </div>
          
          {/* Avatar Icon */}
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-muted flex items-center justify-center text-foreground border border-border group-hover:border-[#D7492A] transition-all duration-300 flex-shrink-0">
            <User size={18} className="md:w-5 md:h-5" />
          </div>
        </div>

      </div>
    </header>
  );
}