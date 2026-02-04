import { Sidebar } from "@/components/dashboard/SideBar";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerStyles = "max-w-7xl mx-auto px-6 md:px-8 w-full";

  return (
    <div className="flex min-h-screen bg-background font-poppins">
      {/* LEFT SIDEBAR - Fixed desktop navigation */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border bg-card sticky top-0 h-screen">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* TOP HEADER */}
        <header className="h-20 border-b border-border flex items-center bg-background/50 backdrop-blur-md sticky top-0 z-40">
          <div className={`${containerStyles} flex justify-between items-center`}>
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Shared Services Portal
            </h2>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* MAIN PAGE CONTENT - Where sub-pages appear */}
        <main className={`${containerStyles} py-10`}>
          {children}
        </main>
      </div>
    </div>
  );
}