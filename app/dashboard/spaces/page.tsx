import { createClient } from "@/lib/supabase/server";
import { SpaceFilterSidebar } from "@/components/spaces/filter-sidebar";
import { AlertTriangle, Fingerprint } from "lucide-react";
import RoomListClient from "@/components/dashboard/rooms/RoomListClient";

export default async function FindSpacePage({
  searchParams,
}: {
  searchParams: { 
    date?: string; 
    minSize?: string; 
    maxSize?: string; 
    campus?: string; 
    start?: string; 
    end?: string 
  };
}) {
  const supabase = await createClient();
  const { date, minSize, maxSize, campus, start, end } = await searchParams;

  // 1. Database Query (Logic remains unchanged)
  let roomsQuery = supabase.from("rooms").select("*");
  if (minSize) roomsQuery = roomsQuery.gte("capacity", parseInt(minSize));
  if (maxSize) roomsQuery = roomsQuery.lte("capacity", parseInt(maxSize));
  if (campus && campus !== "All") roomsQuery = roomsQuery.eq("campus", campus);

  const { data: allRooms } = await roomsQuery.order("capacity", { ascending: true });

  // 2. Availability Logic
  let availableRooms = allRooms;
  if (date && start && end && allRooms) {
    const requestedStart = `${date}T${start}:00`;
    const requestedEnd = `${date}T${end}:00`;

    const { data: busyReservations } = await supabase
      .from("reservations")
      .select("room_id")
      .or(`and(start_time.lte.${requestedStart},end_time.gt.${requestedStart}),and(start_time.lt.${requestedEnd},end_time.gte.${requestedEnd}),and(start_time.gte.${requestedStart},end_time.lte.${requestedEnd})`);

    const busyRoomIds = busyReservations?.map((r) => r.room_id) || [];
    availableRooms = allRooms.filter((room) => !busyRoomIds.includes(room.id));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-10 font-poppins pb-24 px-4 md:px-8 bg-[#0A0A0A] min-h-screen">
      
      {/* --- SIDEBAR COMMAND CENTER --- */}
      {/* Optimized: Changed md:w-80 to lg:w-80 and reduced padding for mobile */}
      <aside className="w-full lg:w-80 shrink-0 mt-6 lg:mt-10">
        <div className="lg:sticky lg:top-10">
          <div className="relative overflow-hidden bg-[#141414] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D7492A]/5 blur-[80px] rounded-full" />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#D7492A]/10 rounded-lg">
                  <Fingerprint size={18} className="text-[#D7492A]" />
                </div>
                <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] text-white">
                  Parameters
                </h2>
              </div>
              <SpaceFilterSidebar />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 space-y-8 md:space-y-12 py-4 md:py-10">
        <header className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Registry</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-none">
            Find <span className="text-[#D7492A]">Space</span>
          </h1>
          
          {date && minSize ? (
            <div className="flex flex-wrap items-center gap-4 md:gap-8 py-2">
              <div className="flex flex-col">
                <span className="text-[7px] md:text-[8px] font-black text-[#D7492A] uppercase tracking-widest">Schedule</span>
                <span className="text-xs md:text-sm font-bold text-white uppercase">{date} <span className="text-gray-600 px-1">/</span> {start}—{end}</span>
              </div>
              <div className="hidden xs:block w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[7px] md:text-[8px] font-black text-[#D7492A] uppercase tracking-widest">Capacity</span>
                <span className="text-xs md:text-sm font-bold text-white uppercase">{minSize}—{maxSize} Seats</span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
              <AlertTriangle className="text-orange-500 mt-0.5 shrink-0" size={16} />
              <p className="text-[9px] md:text-[10px] font-bold text-orange-200 uppercase tracking-widest leading-relaxed">
                Coordination Required: Complete parameters to view availability.
              </p>
            </div>
          )}
        </header>

        {/* --- DYNAMIC ROOM LIST --- */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <RoomListClient 
            rooms={availableRooms || []} 
            date={date} 
            start={start} 
            end={end} 
            minSize={minSize} 
          />
        </div>
      </main>
    </div>
  );
}