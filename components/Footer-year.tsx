"use client";

import { useEffect, useState } from "react";

export function FooterYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Fallback to current year during build to prevent layout shift, 
  // but the 'useEffect' ensures it's correct on the client.
  return <>{year || 2026}</>;
}