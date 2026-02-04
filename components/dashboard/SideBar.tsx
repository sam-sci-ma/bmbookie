"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Search, CalendarCheck, 
  CalendarRange, Settings, Mail, LogOut, 
  ChevronLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Props added to handle the Fill Logic from Layout
export function Sidebar({ isCollapsed, setIsCollapsed }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState(0);

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
    { name: "Rooms", href: "/dashboard/spaces", icon: Search },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarRange },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <aside className={cn(
        "hidden md:flex h-screen sticky top-0 flex-col bg-card text-muted-foreground font-sans border-r border-border transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-64"
      )}>
        
        <div className="p-6 flex items-center justify-between min-h-[100px]">
          {!isCollapsed ? (
            <div className="relative w-32 h-12 animate-in fade-in duration-500">
              <Image 
                src="/logos/um6p.png" 
                alt="UM6P Logo" 
                fill 
                className="object-contain object-left dark:brightness-200"
                priority
              />
            </div>
          ) : (
            <div className="mx-auto relative w-8 h-8">
               <Image src="/logos/um6p.png" alt="U" fill className="object-contain dark:brightness-200" />
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            <ChevronLeft size={18} className={cn("transition-transform", isCollapsed && "rotate-180")} />
          </button>
        </div>

        <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            {!isCollapsed && (
              <p className="px-4 text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-4">
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
                        : "hover:text-foreground hover:bg-muted",
                      isCollapsed && "pl-4 ml-0 rounded-full justify-center"
                    )}
                  >
                    <item.icon size={18} className={isActive ? "text-white" : "text-muted-foreground"} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex flex-col gap-1">
            <Link 
              href="/dashboard/inbox" 
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                pathname === "/dashboard/inbox" ? "bg-muted text-foreground" : "hover:bg-muted",
                isCollapsed && "justify-center"
              )}
            >
              <div className="flex items-center gap-3">
                <Mail size={18} className={pathname === "/dashboard/inbox" ? "text-[#D7492A]" : "text-muted-foreground group-hover:text-[#D7492A]"} />
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
                "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 transition-all text-muted-foreground hover:text-destructive",
                isCollapsed && "justify-center"
              )}
            >
              <LogOut size={18} />
              {!isCollapsed && <span className="text-xs font-semibold">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-card/80 backdrop-blur-xl border-t border-border px-6 py-3">
        <nav className="flex justify-between items-center">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  isActive ? "text-[#D7492A]" : "text-muted-foreground"
                )}
              >
                <item.icon size={20} />
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.name}</span>
              </Link>
            );
          })}
          <Link href="/dashboard/inbox" className={cn("relative flex flex-col items-center gap-1", pathname === "/dashboard/inbox" ? "text-[#D7492A]" : "text-muted-foreground")}>
            <Mail size={20} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Inbox</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D7492A] text-white text-[7px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-card">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </>
  );
}