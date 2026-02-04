import { createClient } from "@/lib/supabase/server";
import CalendarView from "@/components/admin/calendar/CalendarView";
import { redirect } from "next/navigation";

export default async function AdminCalendarPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch reservations with room and profile metadata for the 2026 timeline
  const { data: reservations } = await supabase
    .from("reservations")
    .select(`
      *,
      rooms (name, room_number, campus),
      profiles (full_name, email)
    `)
    .order("start_time", { ascending: true });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Institutional <span className="text-[#D7492A]">Scheduler</span>
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Navigating {reservations?.length || 0} scheduled events for the 2026 Roadmap.
        </p>
      </div>

      <CalendarView initialEvents={reservations || []} />
    </div>
  );
}