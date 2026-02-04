import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Search, 
  ArrowRight,
  MapPin,
  LayoutGrid,
  Zap,
  Activity
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const now = new Date().toISOString();

  // 1. DYNAMIC DATA FETCHING
  const [spacesResponse, reservationsResponse, nextSessionResponse] = await Promise.all([
    // Get Top Rooms
    supabase.from('rooms').select('*').limit(4),
    // Get Count of Active confirmed bookings
    supabase.from('reservations')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .gt('end_time', now),
    // Get the very next upcoming session for this user
    supabase.from('reservations')
      .select('start_time, rooms(name)')
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .gt('start_time', now)
      .order('start_time', { ascending: true })
      .limit(1)
      .single()
  ]);

  const spaces = spacesResponse.data || [];
  const activeCount = reservationsResponse.count || 0;
  const nextSession = nextSessionResponse.data;

  // 2. LIVE AVAILABILITY LOGIC FOR CARDS
  // Fetch all current reservations to mark rooms as 'Available' or 'Booked'
  const { data: currentBookings } = await supabase
    .from('reservations')
    .select('room_id')
    .lte('start_time', now)
    .gte('end_time', now);

  const bookedRoomIds = new Set(currentBookings?.map(b => b.room_id) || []);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-poppins pb-24 md:pb-12 px-1">
    
      {/* HERO SECTION: Welcome Banner */}
      <section className="bg-primary/5 border-2 border-primary/20 p-5 md:p-8 rounded-2xl md:rounded-[2rem] relative overflow-hidden group">
        <div className="relative z-10 space-y-2 md:space-y-3">
          <div className="flex items-center gap-2 bg-primary/10 w-fit px-2.5 py-0.5 rounded-full border border-primary/20">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Registry Active</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-[0.95] text-white">
            Welcome back,<br />
            <span className="text-[#D7492A]">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-[10px] md:text-xs text-gray-400 font-semibold max-w-sm md:max-w-md leading-relaxed">
            2026 Institutional Access: You have {activeCount} confirmed sessions in the current registry.
          </p>
        </div>
        
        <span className="absolute right-[-10px] bottom-[-20px] md:right-[-20px] md:bottom-[-30px] text-[8rem] md:text-[14rem] font-black text-primary/5 select-none pointer-events-none transition-transform group-hover:scale-110 duration-700">
          {user?.email?.[0].toUpperCase()}
        </span>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        <Link href="/dashboard/reservations" className="block group">
          <div className="h-full bg-[#141414] p-4 md:p-5 rounded-xl border-2 border-white/5 shadow-[2px_2px_0px_0px_rgba(215,73,42,1)] transition-all group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] hover:border-[#D7492A]/50">
            <div className="bg-[#D7492A]/10 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-[#D7492A] mb-3">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-0.5">Active Bookings</p>
            <p className="text-lg md:text-2xl font-black text-white">{activeCount.toString().padStart(2, '0')}</p>
          </div>
        </Link>
        
        <div className="bg-[#141414] p-4 md:p-5 rounded-xl border-2 border-white/5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]">
          <div className="bg-white/5 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-3 text-gray-400">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 mb-0.5">Next Session</p>
          <p className="text-lg md:text-2xl font-black italic text-nowrap text-white">
            {nextSession ? format(new Date(nextSession.start_time), "HH:mm") : "--:--"} 
            <span className="text-[9px] not-italic opacity-40 uppercase ml-1">PM</span>
          </p>
        </div>

        <Link href="/dashboard/spaces" className="col-span-2 md:col-span-1">
          <Button className="w-full h-full bg-[#D7492A] text-white rounded-xl border-2 border-white/5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] flex flex-row md:flex-col items-center justify-center gap-2 py-4 md:py-0 hover:bg-[#D7492A]/90 transition-all group">
              <Search className="w-4 h-4 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
              <span className="font-black uppercase tracking-tighter text-base md:text-lg">Find Rooms</span>
          </Button>
        </Link>
      </section>

      {/* CURATED RECOMMENDATIONS */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <div className="space-y-0.5">
            <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-white">
              <LayoutGrid className="text-[#D7492A] w-5 h-5 md:w-6 md:h-6" />
              Institutional Rooms
            </h2>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Recommended Registry</p>
          </div>
          <Link href="/dashboard/spaces">
            <Button variant="ghost" className="text-[9px] font-black uppercase text-gray-400 hover:text-[#D7492A] hover:bg-transparent p-0 h-auto">
              View All <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {spaces?.map((space) => {
            const isBooked = bookedRoomIds.has(space.id);
            return (
              <div key={space.id} className="group bg-[#141414] rounded-2xl md:rounded-[1.5rem] p-5 md:p-6 border-2 border-white/5 hover:border-[#D7492A]/40 hover:shadow-[4px_4px_0px_0px_rgba(215,73,42,1)] transition-all flex flex-col gap-5 overflow-hidden relative shadow-2xl">
                <div className="flex justify-between items-start relative z-10">
                  <div className="max-w-[75%]">
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-1.5 group-hover:text-[#D7492A] text-white transition-colors leading-none truncate">
                      {space.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold text-gray-500 uppercase">
                      <MapPin className="w-3 h-3 text-[#D7492A]" /> {space.campus || 'ABS'} • Floor {space.floor || 'G'}
                    </div>
                  </div>
                  
                  {/* DYNAMIC AVAILABILITY BADGE */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-colors ${
                    isBooked 
                      ? "bg-red-500/10 text-red-500 border-red-500/20" 
                      : "bg-green-500/10 text-green-500 border-green-500/20"
                  }`}>
                    {isBooked ? "Booked" : "Available"}
                  </span>
                </div>

                <Link href={`/dashboard/spaces/${space.id}/book`} className="relative z-10">
                  <Button className="w-full bg-white text-black hover:bg-[#D7492A] hover:text-white py-4 md:py-5 rounded-lg font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl">
                    Secure This Room <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}