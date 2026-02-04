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

} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/protected/admin' },
  { name: 'Bookings', icon: CalendarDays, href: '/protected/admin/bookings' },
  { name: 'Rooms', icon: DoorOpen, href: '/protected/admin/rooms' },
  { name: 'Users', icon: Users, href: '/protected/admin/users' },
  { name: 'Calendar', icon: CalendarDays, href: '/protected/admin/calendar' },
  { name: 'Audit Logs', icon: Sailboat, href: '/protected/admin/logs' },
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
    <aside 
      className={cn(
        // Use bg-card or bg-muted/50 for a clean theme-aware surface
        "bg-card text-card-foreground h-screen sticky top-0 flex flex-col p-4 font-sans border-r border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[90px]" : "w-[300px]"
      )}
    >
      {/* 1. Header with Logo & Toggle */}
      <div className={cn(
        "flex items-start mb-10",
        isCollapsed ? "justify-center" : "justify-between px-2"
      )}>
        {!isCollapsed && (
          <div className="flex flex-col gap-2">
            <img 
              src="/logos/um6p.png" 
              alt="UM6P Logo" 
              // Added dark:invert logic or brightness adjustment for dark mode logos
              className="h-14 w-auto object-contain dark:brightness-200"
            />
          
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-muted p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors mt-1"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* 2. Label */}
      {!isCollapsed && (
        <div className="px-4 mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Administration</p>
        </div>
      )}
      
      {/* 3. Navigation Links */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl transition-all duration-200 py-3",
                isCollapsed ? "justify-center px-0" : "px-4 gap-4",
                isActive 
                  ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={22} className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {!isCollapsed && <span className="text-[16px] whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 4. Logout Section */}
      <div className={cn(
        "pt-4 border-t border-border",
        isCollapsed ? "flex justify-center" : ""
      )}>
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center rounded-xl text-muted-foreground font-medium hover:bg-destructive/10 hover:text-destructive transition-colors w-full py-3",
            isCollapsed ? "justify-center px-0" : "px-4 gap-4"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-[16px]">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}