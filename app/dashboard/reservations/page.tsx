import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Clock, MapPin, Inbox, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function ReservationsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: reservations } = await supabase
    .from("reservations")
    .select(`
      *,
      rooms (
        name,
        location,
        building_id
      )
    `)
    .eq("user_id", user.id)
    .order("start_time", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10 px-4 md:px-8 space-y-6 md:space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER SECTION - Adjusted for mobile alignment */}
      <header className="space-y-1 md:space-y-2 px-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
          Departmental <span className="text-[#D7492A]">Reservations</span>
        </h1>
        <p className="text-[8px] md:text-[10px] text-[#A3A3A3] font-black uppercase tracking-[0.2em]">
          Registry 2026: Space Tracking
        </p>
      </header>

      <div className="grid gap-3 md:gap-4">
        {reservations && reservations.length > 0 ? (
          reservations.map((res) => (
            <div 
              key={res.id} 
              className="bg-[#141414] p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center group transition-all hover:border-[#D7492A]/30 gap-4"
            >
              <div className="flex items-center gap-4 md:gap-6 w-full">
                {/* ICON BLOCK - Hidden on small mobile to save horizontal space */}
                <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl text-[#D7492A] shrink-0 hidden xs:flex">
                  <CalendarDays size={20} className="md:w-6 md:h-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base md:text-lg font-bold text-white tracking-tight truncate">
                      {res.rooms?.name || "Unknown Space"}
                    </h3>
                    <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  
                  {/* Metadata - Stacked on mobile, row on desktop */}
                  <div className="flex flex-col sm:flex-row gap-x-5 gap-y-1.5 text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <Clock size={12} className="text-[#D7492A] shrink-0" /> 
                      {format(new Date(res.start_time), "MMM d, HH:mm")}
                    </span>
                    <span className="flex items-center gap-2 truncate">
                      <MapPin size={12} className="text-[#D7492A] shrink-0" /> 
                      <span className="truncate">{res.rooms?.location} • {res.rooms?.building_id}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* STATUS BADGE - Full width on mobile for better touch/visibility */}
              <div className="w-full md:w-auto pt-2 md:pt-0">
                <span className={cn(
                  "block text-center px-4 md:px-6 py-2 rounded-xl md:rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] border transition-colors",
                  res.status === 'confirmed' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : res.status === 'pending' 
                    ? 'bg-[#D7492A]/10 text-[#D7492A] border-[#D7492A]/20 animate-pulse' 
                    : 'bg-white/5 text-gray-400 border-white/10'
                )}>
                  {res.status || 'Processing'}
                </span>
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE - Scaled for mobile */
          <div className="py-20 md:py-32 text-center bg-[#141414] rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center px-6">
            <div className="bg-white/5 p-5 md:p-6 rounded-full mb-4 md:mb-6">
              <Inbox size={32} className="text-gray-700 md:w-10 md:h-10" />
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
              Registry silent: No active reservations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}