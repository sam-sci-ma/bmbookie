import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Clock, MapPin, Inbox, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function ReservationsPage() {
  const supabase = await createClient();
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 2. Fetch reservations with room details
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
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Institutional Reservations
        </h1>
        <p className="text-[10px] text-[#A3A3A3] font-black uppercase tracking-[0.2em]">
          Registry 2026: Space Tracking & Status
        </p>
      </header>

      <div className="grid gap-3">
        {reservations && reservations.length > 0 ? (
          reservations.map((res) => (
            <div 
              key={res.id} 
              className="bg-[#141414] p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center group transition-all hover:border-[#D7492A]/30"
            >
              <div className="flex items-center gap-6">
                {/* ICON BLOCK */}
                <div className="bg-white/5 p-4 rounded-2xl text-[#D7492A] shrink-0">
                  <CalendarDays size={24} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {res.rooms?.name || "Unknown Space"}
                    </h3>
                    <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <Clock size={12} className="text-[#D7492A]" /> 
                      {format(new Date(res.start_time), "MMM d, HH:mm")}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={12} className="text-[#D7492A]" /> 
                      {res.rooms?.location} • {res.rooms?.building_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* STATUS BADGE (High Contrast) */}
              <div className="mt-5 md:mt-0 w-full md:w-auto">
                <span className={cn(
                  "block text-center px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-colors",
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
          /* EMPTY STATE - Minimalist */
          <div className="py-32 text-center bg-[#141414] rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center">
            <div className="bg-white/5 p-6 rounded-full mb-6">
              <Inbox size={40} className="text-gray-700" />
            </div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">
              No active reservations in registry
            </p>
          </div>
        )}
      </div>
    </div>
  );
}