"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  Info, 
  Users, 
  MapPin, 
  Clock,
  Circle,
  Zap,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Data structure based on your UM6P Planning Image
const planningData = [
  { id: 1, day: "Tuesday 3", title: "SKILL SPOT: RSE", entity: "Africa Business School", bloc: "C", floor: "4", room: "C4-CR02", owner: "HARAMOUNI, Hiba", time: "09:00 - 12:00" },
  { id: 2, day: "Tuesday 3", title: "Rencontre avec John Mather", entity: "Africa Business School", bloc: "C", floor: "3", room: "C3-MD01", owner: "ELALJ, Chada", time: "14:00 - 17:00" },
  { id: 3, day: "Wednesday 4", title: "Transformation by Design", entity: "Africa Business School", bloc: "B", floor: "3", room: "B3-MD01", owner: "DOUELFAKAR, Y.", time: "08:30 - 11:30" },
  { id: 4, day: "Wednesday 4", title: "AT 202", entity: "Africa Business School", bloc: "B", floor: "4", room: "B4-CR01", owner: "Mehdi El Mabtoul", time: "13:00 - 16:00" },
];

export default function WeeklyCalendarPage() {
  const [selectedDate, setSelectedDate] = useState("Tuesday 3");

  return (
    <div className="space-y-6 font-poppins pb-24 px-1 animate-in fade-in duration-700">
      
      {/* 1. HEADER & GLOBAL COORDINATION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
            Weekly <span className="text-primary">Planning</span>
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
            Shared Services • UM6P Campus Rabat
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 text-[10px] font-black uppercase border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
            <Filter className="w-3 h-3 mr-2" /> Filter Bloc
          </Button>
          <Button className="h-9 text-[10px] font-black uppercase bg-primary text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <Zap className="w-3 h-3 mr-2 fill-white" /> Available Now
          </Button>
        </div>
      </div>

      {/* 2. HORIZONTAL DATE SCROLLER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Monday 2", "Tuesday 3", "Wednesday 4", "Thursday 5", "Friday 6", "Saturday 7"].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDate(day)}
            className={cn(
              "px-6 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all shrink-0",
              selectedDate === day 
                ? "bg-foreground text-background border-foreground shadow-[3px_3px_0px_0px_rgba(215,73,42,1)]" 
                : "bg-card border-border text-muted-foreground hover:border-primary"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 3. PLANNING GRID (The "Table" replacement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" /> Scheduled Events
          </h3>
          <span className="text-[9px] font-bold text-muted-foreground uppercase italic">Showing {selectedDate}</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {planningData.filter(e => e.day === selectedDate).map((event) => (
            <div 
              key={event.id}
              className="group bg-card border-2 border-foreground rounded-2xl p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all relative overflow-hidden"
            >
              {/* Entity Vertical Badge */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                      {event.entity}
                    </span>
                    <span className="text-[8px] font-black uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      Bloc {event.bloc} • Floor {event.floor}
                    </span>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {event.room} — Owned by {event.owner}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-dashed border-border pt-4 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase opacity-40 mb-1">Time Window</p>
                    <p className="text-xs font-black uppercase flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {event.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase opacity-40 mb-1">Status</p>
                    <p className="text-[10px] font-black text-green-600 uppercase">Confirmed</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {planningData.filter(e => e.day === selectedDate).length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5 flex flex-col items-center justify-center">
            <CalendarDays className="w-8 h-8 text-muted-foreground/20 mb-3" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
              No events coordinated for this date
            </p>
          </div>
        )}
      </div>
    </div>
  );
}