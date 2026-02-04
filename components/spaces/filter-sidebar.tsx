"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  RotateCcw, 
  Search,
  ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SpaceFilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // OBLIGATORY COORDINATION STATE
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [minSize, setMinSize] = useState(searchParams.get("minSize") || "");
  const [maxSize, setMaxSize] = useState(searchParams.get("maxSize") || "");
  const [campus, setCampus] = useState(searchParams.get("campus") || "All");
  const [startTime, setStartTime] = useState(searchParams.get("start") || "08:00");
  const [endTime, setEndTime] = useState(searchParams.get("end") || "18:00");

  const isFormValid = date !== "" && minSize !== "" && maxSize !== "";

  const handleApply = () => {
    if (!isFormValid) return;
    
    const params = new URLSearchParams(searchParams);
    params.set("date", date);
    params.set("minSize", minSize);
    params.set("maxSize", maxSize);
    params.set("campus", campus);
    params.set("start", startTime);
    params.set("end", endTime);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setDate(""); setMinSize(""); setMaxSize(""); setCampus("All");
    setStartTime("08:00"); setEndTime("18:00");
    router.push(pathname);
  };

  return (
    <div className="w-full md:w-72 space-y-5 bg-card border-2 border-foreground p-5 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] h-fit font-poppins">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" /> Coordination
        </h2>
        <button onClick={handleReset} className="text-[9px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-4">
        {/* 1. DATE (OBLIGATORY) */}
        <div className="space-y-1.5">
          <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex justify-between">
            Date <span className="text-primary italic">*Required</span>
          </Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-background border-2 border-border p-2 pl-9 rounded-lg text-[11px] font-bold focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* 2. SEAT RANGE (BOTH OBLIGATORY) */}
        <div className="space-y-1.5">
          <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex justify-between">
            Seat Capacity <span className="text-primary italic">*Required</span>
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input 
                type="number"
                placeholder="Min"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                className="w-full bg-background border-2 border-border p-2 pl-8 rounded-lg text-[10px] font-bold focus:border-primary outline-none"
              />
            </div>
            <ArrowRightLeft className="w-3 h-3 opacity-30" />
            <div className="relative flex-1">
              <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input 
                type="number"
                placeholder="Max"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                className="w-full bg-background border-2 border-border p-2 pl-8 rounded-lg text-[10px] font-bold focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. TIME RANGE */}
        <div className="space-y-1.5">
          <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Time Range
          </Label>
          <div className="flex items-center gap-2">
            <select 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 bg-background border-2 border-border p-2 rounded-lg text-[10px] font-bold outline-none focus:border-primary appearance-none text-center"
            >
              {["08:00", "10:00", "12:00", "14:00"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 bg-background border-2 border-border p-2 rounded-lg text-[10px] font-bold outline-none focus:border-primary appearance-none text-center"
            >
              {["16:00", "18:00", "20:00"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* 4. CAMPUS TOGGLE */}
        <div className="space-y-1.5">
          <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Campus Location</Label>
          <div className="flex gap-1.5">
            {['Rabat', 'Benguerir'].map((loc) => (
              <button
                key={loc}
                onClick={() => setCampus(loc)}
                className={cn(
                  "flex-1 py-2 rounded-lg border-2 text-[9px] font-black uppercase transition-all",
                  campus === loc 
                    ? "bg-primary text-white border-primary shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" 
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button 
        onClick={handleApply}
        disabled={!isFormValid}
        className="w-full bg-foreground text-background dark:bg-primary py-4 rounded-lg font-black uppercase tracking-widest text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all disabled:opacity-20 mt-2"
      >
        Check Availability
      </Button>
    </div>
  );
}