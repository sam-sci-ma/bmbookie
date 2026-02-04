"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function PartnerLogos({ containerStyles }: { containerStyles: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const logoNames = [
    "um6p-ABS.png",
    "sci.png",
    "shbm.png",
    "storyschool.png"
  ];

  if (!mounted) return null;

  // Determine path based on theme
  const folder = resolvedTheme === "dark" ? "white" : "coloured";

  return (
    <section className="py-12 md:py-20 border-t border-border bg-muted/30">
      <div className={containerStyles}>
        <p className="text-center font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-10 text-[10px]">
          Supporting Departments & Clusters
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 items-center">
          {logoNames.map((name, index) => (
            <div key={index} className="flex justify-center h-8 md:h-12 relative transition-opacity hover:opacity-100 opacity-80">
              <Image 
                src={`/logos/${folder}/${name}`} 
                alt={`${name} logo`} 
                fill 
                className="object-contain"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}