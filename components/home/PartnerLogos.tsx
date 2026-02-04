import Image from "next/image";

export function PartnerLogos({ containerStyles }: { containerStyles: string }) {
  const logos = ["/logos/um6p-ABS.png", "/logos/sci.png", "/logos/shbm.png", "/logos/storyschool.png"];
  
  return (
    <section className="py-12 md:py-20 border-t border-border bg-muted/30">
      <div className={containerStyles}>
        <p className="text-center font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-10 text-[10px]">
          Supporting Departments & Clusters
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 items-center grayscale opacity-70 dark:invert dark:opacity-40 hover:grayscale-0 transition-all">
          {logos.map((src, index) => (
            <div key={index} className="flex justify-center h-8 md:h-12 relative">
              <Image src={src} alt="Department Logo" fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}