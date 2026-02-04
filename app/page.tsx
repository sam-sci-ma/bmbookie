import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { MobileNav } from "@/components/home/MobileNav";
import { FooterYear } from "@/components/Footer-year";

export default function HomePage() {
  const containerStyles = "max-w-7xl mx-auto px-6 md:px-8 w-full";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar containerStyles={containerStyles} />
      
      <main className="flex-grow">
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
  );
}