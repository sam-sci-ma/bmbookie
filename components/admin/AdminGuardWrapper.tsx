// components/admin/AdminGuardWrapper.tsx
"use client";
import { usePathname } from "next/navigation";

export default function AdminGuardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/protected/admin");

  if (isAdmin) {
    return <div className="min-h-screen w-full bg-white">{children}</div>;
  }

  return <>{children}</>;
}