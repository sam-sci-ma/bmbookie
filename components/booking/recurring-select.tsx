"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function RecurringSelect() {
  const [repeatValue, setRepeatValue] = useState("1");
  const [repeatUnit, setRepeatUnit] = useState("week");
  const [activeDays, setActiveDays] = useState<string[]>(["T"]);
  const [untilDate, setUntilDate] = useState("2026-07-28");

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  const toggleDay = (day: string, idx: number) => {
    // Unique key to handle same letters like 'T' (Tuesday/Thursday)
    const dayKey = `${day}-${idx}`;
    setActiveDays(prev => 
      prev.includes(dayKey) ? prev.filter(d => d !== dayKey) : [...prev, dayKey]
    );
  };

  return (
    <div className="space-y-4 p-4 border-2 border-border rounded-xl bg-muted/5 animate-in fade-in zoom-in-95 duration-300">
      {/* REPEAT EVERY ROW */}
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
        <span>Repeat every</span>
        <div className="flex gap-2">
          <select 
            value={repeatValue}
            onChange={(e) => setRepeatValue(e.target.value)}
            className="bg-background border-2 border-border rounded-md px-2 py-1 outline-none focus:border-primary transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select 
            value={repeatUnit}
            onChange={(e) => setRepeatUnit(e.target.value)}
            className="bg-background border-2 border-border rounded-md px-2 py-1 outline-none focus:border-primary transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            <option value="week">week</option>
            <option value="month">month</option>
          </select>
        </div>
      </div>

      {/* DAY SELECTOR */}
      <div className="flex items-center gap-2">
        {days.map((day, idx) => {
          const dayKey = `${day}-${idx}`;
          const isSelected = activeDays.includes(dayKey);
          return (
            <button
              key={dayKey}
              onClick={() => toggleDay(day, idx)}
              className={cn(
                "w-8 h-8 rounded-full border-2 text-[10px] font-black transition-all flex items-center justify-center",
                isSelected 
                  ? "bg-primary text-white border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                  : "bg-background border-border text-muted-foreground hover:border-primary"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* UNTIL DATE ROW */}
      <div className="flex items-center justify-between pt-2 border-t border-dashed border-border">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span>Until</span>
          <div className="relative">
            <input 
              type="date" 
              value={untilDate}
              onChange={(e) => setUntilDate(e.target.value)}
              className="bg-background border-2 border-border rounded-md px-2 py-1 pl-7 outline-none text-[9px] font-bold"
            />
            <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" />
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}