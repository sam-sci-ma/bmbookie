import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Navbar({ containerStyles }: { containerStyles: string }) {
  return (
    <nav className="sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border">
      <div className={containerStyles}>
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
              <LayoutDashboard className="text-primary-foreground w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">BM-Booky</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              <Link href="/how-it-works" className="hover:text-primary transition-colors text-xs">How it works</Link>
              <Link href="/auth/login" className="bg-foreground text-background dark:bg-primary dark:text-primary-foreground px-6 py-2.5 rounded-full hover:opacity-90 transition-all font-black text-xs">
                Sign In
              </Link>
            </div>
            <div className="border-l pl-2 md:pl-4 border-border">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}