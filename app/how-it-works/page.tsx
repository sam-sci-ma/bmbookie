"use client";

import Link from "next/link";
import { 
  UserPlus, 
  Search, 
  CalendarCheck, 
  QrCode, 
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function HowItWorks() {
  const containerStyles = "max-w-7xl mx-auto px-6 md:px-8 w-full";

  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Join Your Cluster",
      desc: "Register with your UM6P credentials and select your specific Department(ABS, SCI, SHBM,StorySchool) and Cluster(Business Management,Science & Technology) .",
      color: "bg-blue-500"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Find Your Space",
      desc: "Use advanced filters to find rooms by capacity, equipment (Projectors, Lab tools), and real-time availability.",
      color: "bg-purple-500"
    },
    {
      icon: <CalendarCheck className="w-8 h-8" />,
      title: "Instant Reservation",
      desc: "Book standard rooms instantly. For restricted spaces, an automated approval request is sent to your Dept Head.",
      color: "bg-primary"
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Seamless Check-in",
      desc: "Arrive at your room and scan the QR code or use our PWA to confirm your attendance and unlock the session.",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 1. SHARED NAV */}
      <nav className="sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className={containerStyles}>
          <div className="flex justify-between items-center py-4 md:py-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-black text-xs">B</span>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Booky</span>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* 2. HEADER */}
      <header className={containerStyles}>
        <div className="py-20 text-center md:text-left">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20">
            The Process
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
            HOW BOOKY <br />
            <span className="text-primary">WORKS.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">
            A streamlined four-step workflow designed specifically for the BM Shared Services .
          </p>
        </div>
      </header>

      {/* 3. ANIMATED STEPS GRID */}
      <section className="pb-32">
        <div className={containerStyles}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className="group relative bg-card p-8 rounded-[2rem] border-2 border-foreground hover:shadow-[12px_12px_0px_0px_rgba(215,73,42,1)] transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-black text-xl border-4 border-background">
                  {i + 1}
                </div>
                <div className={`w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center mb-8 shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium italic">
                  "{step.desc}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="bg-foreground text-background py-20">
        <div className={`${containerStyles} flex flex-col items-center text-center`}>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8">READY TO START?</h2>
          <Link 
            href="/auth/sign-up" 
            className="group bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-all flex items-center gap-3"
          >
            Create Your Account
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}