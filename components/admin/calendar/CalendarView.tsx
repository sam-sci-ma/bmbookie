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
  Search, Calendar as CalendarIcon, ArrowRight
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

  // --- Export Logic (Excel/CSV) ---
  const handleExport = () => {
    // 1. Get events within the currently filtered calendar range
    const filteredEvents = initialEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate >= interval.start && eventDate <= interval.end;
    });

    // 2. Map to Excel-friendly structure with Names
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

    // 3. Trigger Download
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
    <div className="space-y-6">
      {/* 1. Control Panel */}
      <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-[#D7492A]/10 text-[#D7492A] rounded-xl"><Settings2 size={20} /></div>
            <div>
              <h2 className="text-lg font-black text-foreground">{format(baseDate, 'MMMM yyyy')}</h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{viewMode} View</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
            >
              <Download size={14} /> Export Registry
            </button>
            <div className="flex gap-1 p-1 bg-muted rounded-xl border border-border">
              {(['day', 'week', 'month'] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setViewMode(m); setCustomStart(""); setCustomEnd(""); }}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    viewMode === m ? "bg-background text-[#D7492A] shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">Jump to Month</label>
            <input type="month" value={format(baseDate, 'yyyy-MM')} onChange={(e) => setBaseDate(new Date(e.target.value + "-01"))} className="bg-muted/50 border border-transparent focus:border-[#D7492A]/30 rounded-xl px-4 py-2 text-sm outline-none" />
          </div>
          {viewMode !== 'month' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">Start Range</label>
                <input type="date" onChange={(e) => setCustomStart(e.target.value)} className="bg-muted/50 border border-transparent focus:border-[#D7492A]/30 rounded-xl px-4 py-2 text-sm outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">End Range</label>
                <input type="date" onChange={(e) => setCustomEnd(e.target.value)} className="bg-muted/50 border border-transparent focus:border-[#D7492A]/30 rounded-xl px-4 py-2 text-sm outline-none" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Calendar Grid */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className={cn("grid gap-px bg-border", days.length > 7 ? "grid-cols-7" : `grid-cols-${days.length}`)}>
          {days.length <= 14 && days.map((day, i) => (
            <div key={i} className="bg-muted/30 p-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
              {format(day, 'EEE')}
            </div>
          ))}
          {days.map((day, i) => {
            const dayEvents = initialEvents.filter(e => isSameDay(new Date(e.start_time), day));
            return (
              <div key={i} className="bg-card min-h-[160px] p-4 hover:bg-muted/5 transition-colors group relative">
                <span className={cn(
                  "text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg mb-4",
                  isSameDay(day, new Date(2026, 1, 4)) ? "bg-[#D7492A] text-white shadow-lg shadow-[#D7492A]/20" : "bg-muted text-foreground"
                )}>{format(day, 'd')}</span>
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <div key={event.id} className="p-2 rounded-xl border border-[#D7492A]/20 bg-[#D7492A]/5">
                      <p className="text-[9px] font-black text-[#D7492A] uppercase truncate">{event.purpose}</p>
                      <p className="text-[8px] font-bold text-muted-foreground mt-0.5 truncate">{event.profiles?.full_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}