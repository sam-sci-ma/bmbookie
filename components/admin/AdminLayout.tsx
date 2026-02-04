// components/admin/AdminLayout.tsx
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Fixed width on desktop */}
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Header - Sticky at the top */}
        <Header />
        
        {/* Main Content Area */}
        <main className="p-6 bg-[#F9F9F9] flex-1 border-l-4 border-black">
          {children}
        </main>
      </div>
    </div>
  );
}