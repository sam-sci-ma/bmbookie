"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/SideBar";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerStyles = "max-w-7xl mx-auto px-6 md:px-8 w-full";

  return (
    <div className="flex min-h-screen bg-background font-poppins overflow-x-hidden">
      {/* SIDEBAR - Passing state for fill logic */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* MAIN CONTENT - transition-all enables the smooth "fill" animation */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <header className="h-20 border-b border-border flex items-center bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className={`${containerStyles} flex justify-between items-center`}>
            <h2 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-muted-foreground truncate mr-4">
              Shared Services Portal
            </h2>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <main className={`${containerStyles} py-10 flex-grow`}>
          {children}
        </main>
      </div>
    </div>
  );
}