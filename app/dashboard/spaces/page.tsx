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

  // 1. Database Query
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
    <div className="flex flex-col md:flex-row gap-8 font-poppins pb-24 px-6 bg-[#0A0A0A] min-h-screen">
      
      {/* --- STATIC SIDEBAR COMMAND CENTER --- */}
      <aside className="w-full md:w-80 shrink-0">
        <div className="md:sticky md:top-10">
          <div className="relative overflow-hidden bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Aesthetic Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D7492A]/5 blur-[80px] rounded-full" />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#D7492A]/10 rounded-lg">
                  <Fingerprint size={18} className="text-[#D7492A]" />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-white">
                  Filters
                </h2>
              </div>
              <SpaceFilterSidebar />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 space-y-10 py-4">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Registry</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Available <span className="text-[#D7492A]">Rooms</span>
          </h1>
          
          {date && minSize ? (
            <div className="flex items-center gap-4 py-2">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-[#D7492A] uppercase tracking-widest">Schedule</span>
                <span className="text-sm font-bold text-white uppercase">{date} • {start}—{end}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-[#D7492A] uppercase tracking-widest">Capacity</span>
                <span className="text-sm font-bold text-white uppercase">{minSize}—{maxSize} Seats</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
              <AlertTriangle className="text-orange-500" size={18} />
              <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">
                Coordination Required: Please complete parameters.
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