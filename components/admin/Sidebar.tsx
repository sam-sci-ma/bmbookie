"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  DoorOpen, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sailboat,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/protected/admin' },
  { name: 'Bookings', icon: CalendarDays, href: '/protected/admin/bookings' },
  { name: 'Rooms', icon: DoorOpen, href: '/protected/admin/rooms' },
  { name: 'Users', icon: Users, href: '/protected/admin/users' },
  { name: 'Logs', icon: Sailboat, href: '/protected/admin/logs' },
  { name: 'Settings', icon: Settings, href: '/protected/admin/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <aside 
        className={cn(
          "hidden md:flex bg-card text-card-foreground h-screen sticky top-0 flex-col p-4 font-sans border-r border-border transition-all duration-300 ease-in-out z-50",
          isCollapsed ? "w-[90px]" : "w-[280px]"
        )}
      >
        <div className={cn("flex items-start mb-10", isCollapsed ? "justify-center" : "justify-between px-2")}>
          {!isCollapsed && (
            <img src="/logos/um6p.png" alt="Logo" className="h-10 w-auto object-contain dark:brightness-200" />
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-muted p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors mt-1"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 mb-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Administration</p>
          </div>
        )}
        
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-200 py-3",
                  isCollapsed ? "justify-center px-0" : "px-4 gap-4",
                  isActive ? "bg-[#D7492A] text-white font-bold shadow-lg shadow-[#D7492A]/20" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon size={20} />
                {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={cn("pt-4 border-t border-border", isCollapsed ? "flex justify-center" : "")}>
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center rounded-xl text-muted-foreground font-medium hover:bg-destructive/10 hover:text-destructive transition-colors w-full py-3",
              isCollapsed ? "justify-center px-0" : "px-4 gap-4"
            )}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAV (Visible only on Phone) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-[100] px-2 py-3">
        <div className="flex justify-around items-center">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  isActive ? "text-[#D7492A]" : "text-muted-foreground"
                )}
              >
                <item.icon size={20} className={isActive ? "scale-110" : ""} />
                <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
              </Link>
            );
          })}
          {/* Mobile Logout - Small Icon */}
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <LogOut size={20} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Exit</span>
          </button>
        </div>
      </nav>
    </>
  );
}