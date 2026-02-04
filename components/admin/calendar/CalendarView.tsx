"use client";

import { useState, useMemo } from "react";
import { 
  format, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, 
  parseISO, startOfDay, endOfDay
} from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Settings2, Clock, DoorOpen, Download, 
  Search, Calendar as CalendarIcon, ArrowRight, MapPin, User
} from "lucide-react";

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarView({ initialEvents }: { initialEvents: any[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [baseDate, setBaseDate] = useState(new Date(2026, 1, 4)); 
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  // --- Filtered Interval Logic ---
  const interval = useMemo(() => {
    if (viewMode !== 'month' && customStart && customEnd) {
      return { start: startOfDay(parseISO(customStart)), end: endOfDay(parseISO(customEnd)) };
    }
    if (viewMode === 'month') {
      return { start: startOfWeek(startOfMonth(baseDate)), end: endOfWeek(endOfMonth(baseDate)) };
    } else if (viewMode === 'week') {
      return { start: startOfWeek(baseDate), end: endOfWeek(baseDate) };
    } else {
      return { start: startOfDay(baseDate), end: endOfDay(baseDate) };
    }
  }, [baseDate, viewMode, customStart, customEnd]);

  const days = useMemo(() => {
    try { return eachDayOfInterval(interval); } 
    catch (e) { return eachDayOfInterval({ start: startOfWeek(baseDate), end: endOfWeek(baseDate) }); }
  }, [interval, baseDate]);

  // --- Export Logic ---
  const handleExport = () => {
    const filteredEvents = initialEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate >= interval.start && eventDate <= interval.end;
    });

    const csvRows = [
      ["Requestor Name", "Email", "Room", "Campus", "Start Time", "End Time", "Status", "Purpose"].join(","),
      ...filteredEvents.map(e => [
        `"${e.profiles?.full_name || 'N/A'}"`,
        `"${e.profiles?.email || 'N/A'}"`,
        `"${e.rooms?.name || 'N/A'}"`,
        `"${e.rooms?.campus || 'N/A'}"`,
        `"${format(new Date(e.start_time), 'yyyy-MM-dd HH:mm')}"`,
        `"${format(new Date(e.end_time), 'yyyy-MM-dd HH:mm')}"`,
        `"${e.status}"`,
        `"${e.purpose?.replace(/"/g, '""') || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const fileName = `Registry_Export_${format(new Date(), 'yyyy_MM_dd')}.csv`;
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* 1. Control Panel */}
      <div className="bg-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-border shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="p-2 bg-[#D7492A]/10 text-[#D7492A] rounded-xl"><Settings2 size={20} /></div>
            <div>
              <h2 className="text-base md:text-lg font-black text-foreground">{format(baseDate, 'MMMM yyyy')}</h2>
              <p className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest">{viewMode} Mode Active</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button 
              onClick={handleExport}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
            >
              <Download size={14} /> <span className="md:inline">Export</span>
            </button>
            <div className="flex flex-1 lg:flex-none gap-1 p-1 bg-muted/50 rounded-xl border border-border">
              {(['day', 'week', 'month'] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setViewMode(m); setCustomStart(""); setCustomEnd(""); }}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    viewMode === m ? "bg-background text-[#D7492A] shadow-sm" : "text-muted-foreground"
                  )}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Filters - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pt-4 border-t border-border/50">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-black uppercase text-muted-foreground ml-2">Jump to Month</label>
            <input type="month" value={format(baseDate, 'yyyy-MM')} onChange={(e) => setBaseDate(new Date(e.target.value + "-01"))} className="bg-muted/30 border border-transparent focus:border-[#D7492A]/30 rounded-xl px-4 py-2 text-xs md:text-sm outline-none transition-all" />
          </div>
          {viewMode !== 'month' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase text-muted-foreground ml-2">Start Range</label>
                <input type="date" onChange={(e) => setCustomStart(e.target.value)} className="bg-muted/30 border border-transparent focus:border-[#D7492A]/30 rounded-xl px-4 py-2 text-xs md:text-sm outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase text-muted-foreground ml-2">End Range</label>
                <input type="date" onChange={(e) => setCustomEnd(e.target.value)} className="bg-muted/30 border border-transparent focus:border-[#D7492A]/30 rounded-xl px-4 py-2 text-xs md:text-sm outline-none transition-all" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. PC VIEW: CALENDAR GRID (Hidden on Mobile) */}
      <div className="hidden md:block bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className={cn("grid gap-px bg-border", days.length > 7 ? "grid-cols-7" : `grid-cols-${days.length}`)}>
          {days.length <= 14 && days.map((day, i) => (
            <div key={i} className="bg-muted/30 p-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
              {format(day, 'EEE')}
            </div>
          ))}
          {days.map((day, i) => {
            const dayEvents = initialEvents.filter(e => isSameDay(new Date(e.start_time), day));
            return (
              <div key={i} className="bg-card min-h-[140px] p-3 hover:bg-muted/5 transition-colors group relative">
                <span className={cn(
                  "text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg mb-2",
                  isSameDay(day, new Date()) ? "bg-[#D7492A] text-white" : "bg-muted text-foreground"
                )}>{format(day, 'd')}</span>
                <div className="space-y-1.5">
                  {dayEvents.map(event => (
                    <div key={event.id} className="p-1.5 rounded-lg border border-[#D7492A]/20 bg-[#D7492A]/5">
                      <p className="text-[8px] font-black text-[#D7492A] uppercase truncate">{event.purpose}</p>
                      <p className="text-[7px] font-bold text-muted-foreground truncate">{event.profiles?.full_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MOBILE VIEW: TIMELINE FEED (Visible only on Phone) */}
      <div className="md:hidden space-y-4">
        {days.map((day, i) => {
          const dayEvents = initialEvents.filter(e => isSameDay(new Date(e.start_time), day));
          if (dayEvents.length === 0 && viewMode === 'month') return null;

          return (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-2xl border",
                  isSameDay(day, new Date()) ? "bg-[#D7492A] border-[#D7492A] text-white shadow-lg shadow-[#D7492A]/20" : "bg-card border-border text-foreground"
                )}>
                  <span className="text-[9px] font-black uppercase leading-none">{format(day, 'EEE')}</span>
                  <span className="text-lg font-black">{format(day, 'd')}</span>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="pl-4 space-y-3 border-l-2 border-dashed border-border ml-6 pb-4">
                {dayEvents.length > 0 ? (
                  dayEvents.map(event => (
                    <div key={event.id} className="bg-card border border-border p-4 rounded-2xl shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase text-[#D7492A] tracking-tighter bg-[#D7492A]/5 px-2 py-0.5 rounded">
                          {format(new Date(event.start_time), 'HH:mm')}
                        </span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase">{event.rooms?.campus}</span>
                      </div>
                      <h4 className="text-xs font-black text-foreground uppercase leading-tight">{event.purpose}</h4>
                      <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase">
                         <div className="flex items-center gap-1"><MapPin size={10}/> {event.rooms?.name}</div>
                         <div className="flex items-center gap-1"><User size={10}/> {event.profiles?.full_name?.split(' ')[0]}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[9px] font-black text-muted-foreground/40 uppercase italic pl-2">Registry Silent</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}