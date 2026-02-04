import { 
  FileClock, 
  CalendarCheck2, 
  Users2, 
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { format, startOfDay, endOfDay } from "date-fns";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const todayEnd = endOfDay(now).toISOString();

  // 1. DYNAMIC DATA FETCHING
  const [pendingRes, activeRes, totalUsers, todayEventsResponse] = await Promise.all([
    supabase.from("reservations").select("*", { count: 'exact', head: true }).eq("status", "pending"),
    supabase.from("reservations").select("*", { count: 'exact', head: true }).eq("status", "confirmed").gt("end_time", now.toISOString()),
    supabase.from("profiles").select("*", { count: 'exact', head: true }),
    // FETCH ALL EVENTS FOR TODAY ACROSS THE SYSTEM
    supabase.from('reservations')
      .select('*, rooms(name, location), profiles(full_name)')
      .gte('start_time', todayStart)
      .lte('start_time', todayEnd)
      .order('start_time', { ascending: true })
  ]);

  const todayEvents = todayEventsResponse.data || [];

  const stats = [
    { label: "Pending Requests", val: (pendingRes.count || 0).toString(), icon: FileClock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Bookings", val: (activeRes.count || 0).toString(), icon: CalendarCheck2, color: "text-[#D7492A]", bg: "bg-[#D7492A]/10" },
    { label: "Total Users", val: (totalUsers.count || 0).toString(), icon: Users2, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* 1. Page Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-white tracking-tight">
          System <span className="text-[#D7492A]">Dashboard</span>
        </h1>
        <p className="text-gray-500 font-medium text-sm">
          Real-time overview of university resources and user activity.
        </p>
      </div>
      
      {/* 2. Professional Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group p-8 bg-[#141414] border border-white/5 rounded-[2rem] transition-all duration-300 hover:border-[#D7492A]/50 hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                <span className="text-[10px] font-bold">+Live</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-5xl font-black text-white tracking-tighter">{stat.val.padStart(2, '0')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. GLOBAL DAILY AGENDA (NEW) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D7492A]/10 rounded-lg text-[#D7492A]">
            <Clock size={20} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white">Today's Global Timeline</h2>
        </div>

        <div className="grid gap-4">
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <div key={event.id} className="bg-[#141414] border border-white/5 p-6 rounded-[1.5rem] flex flex-col md:flex-row md:items-center justify-between group hover:border-[#D7492A]/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center border-r border-white/10 pr-6 min-w-[80px]">
                    <span className="text-xl font-black text-white leading-none">
                      {format(new Date(event.start_time), "HH:mm")}
                    </span>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Timeline</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase group-hover:text-[#D7492A] transition-colors">
                      {event.purpose || "Institutional Meeting"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <p className="text-[10px] text-gray-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                        <MapPin size={10} className="text-[#D7492A]" /> {event.rooms?.name}
                      </p>
                      <p className="text-[10px] text-gray-600 flex items-center gap-1 font-bold uppercase tracking-wider">
                        <Users2 size={10} /> {event.profiles?.full_name || "Staff"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                     event.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                   )}>
                     {event.status}
                   </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-[#141414] rounded-[2rem] border border-dashed border-white/10">
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic">No active sessions found for today</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. ACTIVITY LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-[#141414] border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-2">
          <ActivityLoader label="System Logs" />
        </div>
        <div className="h-64 bg-[#141414] border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-2">
          <ActivityLoader label="User Analytics" />
        </div>
      </div>
    </div>
  );
}

function ActivityLoader({ label }: { label: string }) {
  return (
    <>
      <div className="w-8 h-8 border-2 border-[#D7492A]/20 border-t-[#D7492A] rounded-full animate-spin" />
      <p className="text-gray-600 font-black text-[10px] uppercase tracking-[0.2em]">Syncing {label}...</p>
    </>
  );
}