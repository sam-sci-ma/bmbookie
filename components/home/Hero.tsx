import Link from "next/link";
import { ArrowRight, MapPin, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { startOfDay, endOfDay, format } from "date-fns";

export async function Hero({ containerStyles }: { containerStyles: string }) {
  const supabase = await createClient();
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const todayEnd = endOfDay(now).toISOString();

  // 1. DYNAMIC FETCHING: Only confirmed admissions/events
  const { data: todayEvents } = await supabase
    .from('reservations')
    .select('*, rooms(name, location)')
    .gte('start_time', todayStart)
    .lte('start_time', todayEnd)
    .eq('status', 'confirmed') 
    .order('start_time', { ascending: true });

  return (
    <div className={containerStyles}>
      <section className="flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-24 py-12 md:py-24 items-center text-white font-sans">
        
        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left order-2 lg:order-1 max-w-lg">
          <div className="inline-block bg-[#D7492A]/10 text-[#D7492A] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 border border-[#D7492A]/20">
            Shared Services Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter mb-5 uppercase">
            Centralized <br /><span className="text-[#D7492A]">Spaces.</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed font-medium mx-auto lg:mx-0 max-w-md">
            A unified booking engine for spaces/rooms. View the global timeline and coordinate sessions with zero friction.
          </p>
          <Link href="/auth/login" className="inline-flex bg-[#D7492A] text-white px-6 py-3 rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 shadow-lg shadow-[#D7492A]/30">
            Book a Resource <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* RIGHT LIVE STATUS BOX */}
        <div className="relative w-full order-1 lg:order-2 max-w-md mx-auto lg:ml-auto lg:mr-0">
          {/* 8PX BRUTALIST SHADOW - NO ITALICS - CLEAN UI */}
          <div className="bg-[#141414] rounded-[2rem] p-5 md:p-8 border-4 border-white shadow-[8px_8px_0px_0px_rgba(215,73,42,1)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg md:text-xl uppercase tracking-tighter">Live Status</h3>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#D7492A] animate-pulse" />
                <span className="text-[9px] font-black text-[#D7492A] uppercase tracking-widest text-nowrap">Global Timeline</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {todayEvents && todayEvents.length > 0 ? (
                todayEvents.map((event: any) => (
                  <div key={event.id} className="bg-[#1A1A1A] border-2 border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-[#D7492A]/30 transition-all">
                    <div className="flex items-center gap-4">
                      {/* TIME COLUMN */}
                      <div className="flex flex-col items-center justify-center border-r border-white/10 pr-4 min-w-[60px]">
                        <span className="text-base font-black text-white leading-none">
                          {format(new Date(event.start_time), "HH:mm")}
                        </span>
                        <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest mt-1">Start</span>
                      </div>
                      
                      {/* INFO COLUMN - STATUS REMOVED */}
                      <div className="overflow-hidden">
                        <h3 className="text-[11px] font-black text-white uppercase truncate max-w-[180px] group-hover:text-[#D7492A] transition-colors">
                          {event.purpose || "Institutional Session"}
                        </h3>
                        <p className="text-[9px] text-gray-500 flex items-center gap-1 font-bold uppercase tracking-wider mt-0.5">
                          <MapPin size={8} className="text-[#D7492A]" /> {event.rooms?.name}
                        </p>
                      </div>
                    </div>

                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-4 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  </div>
                ))
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">No Active Events Today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}