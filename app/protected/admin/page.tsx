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
    supabase.from('reservations')
      .select('*, rooms(name, location), profiles(full_name)')
      .gte('start_time', todayStart)
      .lte('start_time', todayEnd)
      .order('start_time', { ascending: true })
  ]);

  const todayEvents = todayEventsResponse.data || [];

  const stats = [
    { label: "Pending", mobileLabel: "Pending", val: (pendingRes.count || 0).toString(), icon: FileClock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Bookings", mobileLabel: "Active", val: (activeRes.count || 0).toString(), icon: CalendarCheck2, color: "text-[#D7492A]", bg: "bg-[#D7492A]/10" },
    { label: "Total Users", mobileLabel: "Users", val: (totalUsers.count || 0).toString(), icon: Users2, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-6 md:space-y-10 pb-10 animate-in fade-in duration-700 px-4 md:px-0">
      
      {/* 1. Page Header Section */}
      <div className="flex flex-col gap-1 mt-4 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          System <span className="text-[#D7492A]">Dashboard</span>
        </h1>
        <p className="text-gray-500 font-medium text-xs md:text-sm">
          Real-time overview of university resources.
        </p>
      </div>
      
      {/* 2. Professional Stats Grid - Adjusted for Mobile height/padding */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group p-5 md:p-8 bg-[#141414] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 hover:border-[#D7492A]/50">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className={cn("p-2 md:p-3 rounded-xl md:rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-5 h-5 md:w-6 md:h-6", stat.color)} />
              </div>
              <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp size={10} />
                <span className="text-[8px] md:text-[10px] font-bold">LIVE</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1">
                <span className="hidden md:inline">{stat.label}</span>
                <span className="md:hidden">{stat.mobileLabel}</span>
              </p>
              <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">{stat.val.padStart(2, '0')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. GLOBAL DAILY AGENDA */}
      <section className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#D7492A]/10 rounded-lg text-[#D7492A]">
            <Clock size={18} />
          </div>
          <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white">Global Timeline</h2>
        </div>

        <div className="grid gap-3 md:gap-4">
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <div key={event.id} className="bg-[#141414] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] flex flex-col md:flex-row md:items-center justify-between group hover:border-[#D7492A]/30 transition-all gap-4">
                <div className="flex items-center gap-4 md:gap-6">
                  {/* Time Section - Smaller on mobile */}
                  <div className="flex flex-col items-center justify-center border-r border-white/10 pr-4 md:pr-6 min-w-[60px] md:min-w-[80px]">
                    <span className="text-base md:text-xl font-black text-white leading-none">
                      {format(new Date(event.start_time), "HH:mm")}
                    </span>
                    <span className="text-[7px] md:text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Time</span>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-xs md:text-sm font-bold text-white uppercase group-hover:text-[#D7492A] transition-colors truncate">
                      {event.purpose || "Institutional Meeting"}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                      <p className="text-[9px] md:text-[10px] text-gray-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                        <MapPin size={10} className="text-[#D7492A]" /> {event.rooms?.name}
                      </p>
                      <p className="text-[9px] md:text-[10px] text-gray-600 flex items-center gap-1 font-bold uppercase tracking-wider">
                        <Users2 size={10} /> {event.profiles?.full_name?.split(' ')[0] || "Staff"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge - Full width on mobile */}
                <div className="flex md:block justify-end">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border w-fit",
                     event.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                   )}>
                     {event.status}
                   </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-[#141414] rounded-[1.5rem] md:rounded-[2rem] border border-dashed border-white/10">
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic px-4">No active sessions found today</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. ACTIVITY LOGS - Stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="h-48 md:h-64 bg-[#141414] border border-dashed border-white/10 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center gap-2 p-4">
          <ActivityLoader label="System Logs" />
        </div>
        <div className="h-48 md:h-64 bg-[#141414] border border-dashed border-white/10 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center gap-2 p-4">
          <ActivityLoader label="User Analytics" />
        </div>
      </div>
    </div>
  );
}

function ActivityLoader({ label }: { label: string }) {
  return (
    <>
      <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#D7492A]/20 border-t-[#D7492A] rounded-full animate-spin" />
      <p className="text-gray-600 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-center">Syncing {label}...</p>
    </>
  );
}