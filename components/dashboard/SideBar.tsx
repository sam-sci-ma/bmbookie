"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Added for your logo
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Search, CalendarCheck, 
  CalendarRange, Settings, Mail, LogOut, 
  ChevronLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function Sidebar({ isAdmin = true }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      setUnreadCount(count || 0);
    };
    fetchUnreadCount();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const mainNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bookings", href: "/dashboard/reservations", icon: CalendarCheck },
    { name: "Rooms", href: "/dashboard/rooms", icon: Search },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarRange },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <div className={cn(
        "hidden md:flex h-full flex-col bg-[#0F0F0F] text-[#A3A3A3] font-sans border-r border-white/5 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        
        {/* 1. BRAND SECTION (Updated with your logo) */}
        <div className="p-6 flex items-center justify-between min-h-[100px]">
          {!isCollapsed ? (
            <div className="relative w-32 h-12 animate-in fade-in duration-500">
              <Image 
                src="/logos/um6p.png" 
                alt="UM6P Logo" 
                fill 
                className="object-contain object-left"
                priority
              />
            </div>
          ) : (
            <div className="mx-auto relative w-8 h-8">
               <Image src="/logos/um6p.png" alt="U" fill className="object-contain" />
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-600 hover:text-white transition-colors ml-2"
          >
            <ChevronLeft size={18} className={cn("transition-transform", isCollapsed && "rotate-180")} />
          </button>
        </div>

        {/* 2. ADMINISTRATION GROUP */}
        <div className="flex-1 px-4 space-y-8 overflow-y-auto">
          <div>
            {!isCollapsed && (
              <p className="px-4 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">
                Administration
              </p>
            )}
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-r-full text-xs font-semibold transition-all duration-300",
                      isActive 
                        ? "bg-[#D7492A] text-white -ml-4 pl-8 shadow-lg shadow-[#D7492A]/20" 
                        : "hover:text-white hover:bg-white/5",
                      isCollapsed && "pl-4 ml-0 rounded-full justify-center"
                    )}
                  >
                    <item.icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 3. SYSTEM FOOTER */}
        <div className="p-4 border-t border-white/5">
          <div className="flex flex-col gap-1">
            <Link 
              href="/dashboard/inbox" 
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                pathname === "/dashboard/inbox" ? "bg-white/5 text-white" : "hover:bg-white/5",
                isCollapsed && "justify-center"
              )}
            >
              <div className="flex items-center gap-3">
                <Mail size={18} className={pathname === "/dashboard/inbox" ? "text-[#D7492A]" : "text-gray-500 group-hover:text-[#D7492A]"} />
                {!isCollapsed && <span className="text-xs font-semibold">Inbox</span>}
              </div>
              {!isCollapsed && unreadCount > 0 && (
                <span className="bg-[#D7492A] text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            <button 
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-500 hover:text-white",
                isCollapsed && "justify-center"
              )}
            >
              <LogOut size={18} />
              {!isCollapsed && <span className="text-xs font-semibold">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-xl border-t border-white/5 px-6 py-3">
        <nav className="flex justify-between items-center">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  isActive ? "text-[#D7492A]" : "text-gray-500"
                )}
              >
                <item.icon size={20} />
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.name}</span>
              </Link>
            );
          })}
          <Link href="/dashboard/inbox" className={cn("relative flex flex-col items-center gap-1", pathname === "/dashboard/inbox" ? "text-[#D7492A]" : "text-gray-500")}>
            <Mail size={20} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Inbox</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D7492A] text-white text-[7px] w-3 h-3 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </>
  );
}