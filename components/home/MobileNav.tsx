"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      name: "Home", 
      href: "/", 
      icon: LayoutDashboard 
    },
    { 
      name: "Search", 
      href: "/auth/login", 
      icon: Search 
    },
    { 
      name: "Join", 
      href: "/auth/sign-up", 
      icon: UserPlus 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-foreground text-background dark:bg-card dark:text-foreground p-4 rounded-2xl flex justify-around items-center shadow-2xl z-50 border border-border/50 backdrop-blur-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.name} 
            href={item.href} 
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300",
              isActive ? "opacity-100 scale-110" : "opacity-60 hover:opacity-100"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              isActive ? "text-[#D7492A]" : "text-current"
            )} />
            <span className={cn(
              "text-[10px] uppercase tracking-tighter font-black",
              isActive ? "text-[#D7492A]" : "text-current"
            )}>
              {item.name}
            </span>
            {isActive && (
              <div className="w-1 h-1 bg-[#D7492A] rounded-full mt-0.5 animate-pulse" />
            )}
          </Link>
        );
      })}
    </div>
  );
}