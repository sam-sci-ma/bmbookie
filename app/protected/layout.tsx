// app/protected/layout.tsx
import AdminGuardWrapper from "@/components/admin/AdminGuardWrapper";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuardWrapper>
      {/* This layout is now a "Pass-Through". 
          The actual UI (Sidebar/Header) is handled inside 
          the AdminGuardWrapper or the specific Admin Layout.
      */}
      <main className="min-h-screen">
        {children}
      </main>
    </AdminGuardWrapper>
  );
}