import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { MobileNav } from "@/components/home/MobileNav";
import { FooterYear } from "@/components/Footer-year";
import { PuzzleAnimation } from "@/components/home/PuzzleAnimation";

export default function HomePage() {
  const containerStyles = "max-w-7xl mx-auto px-6 md:px-8 w-full";

  return (
    // 'relative' is required for the 'absolute' puzzle pieces to stay inside this container
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* 1. The Animation Layer 
         Placed first so it stays in the background 
      */}
      <PuzzleAnimation />

      {/* 2. The Content Layer 
         'relative z-10' forces this content to sit on top of the animation 
      */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar containerStyles={containerStyles} />
        
        <main className="flex-grow">
          {/* Ensure Hero and PartnerLogos don't have solid background colors that hide the puzzle */}
          <Hero containerStyles={containerStyles} />
          <PartnerLogos containerStyles={containerStyles} />
        </main>

        <MobileNav />

        <footer className="py-10 text-center text-[10px] text-muted-foreground uppercase tracking-widest border-t border-border bg-muted/10">
          <div className={containerStyles}>
            © <FooterYear /> Booky Shared Services Reservation System
          </div>
        </footer>
      </div>
    </div>
  );
}