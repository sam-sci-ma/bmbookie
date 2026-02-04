import { createClient } from "@/lib/supabase/server";
import BookingsView from "@/components/admin/bookings/BookingsView";
import { redirect } from "next/navigation";

export default async function BookingsManagementPage() {
  const supabase = await createClient();

  // 1. Authenticate the Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch reservations with Room and Profile details
  // We explicitly include 'email' here to support the fallback UI
  const { data: bookings, error } = await supabase
    .from("reservations")
    .select(`
      *,
      rooms (
        name, 
        room_number, 
        campus,
        location,
        floor
      ),
      profiles (
        full_name,
        email,
        role
      )
    `)
    .order("start_time", { ascending: false });

  if (error) {
    console.error("Institutional Fetch Error:", error.message);
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Booking <span className="text-[#D7492A]">Requests</span>
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Overseeing {bookings?.length || 0} institutional resource allocations for the 2026 Rollout.
        </p>
      </div>

      {/* Passing initialBookings (which now contains emails) 
          and the adminId (required for approval audit logs)
      */}
      <BookingsView 
        initialBookings={bookings || []} 
        adminId={user.id} 
      />
    </div>
  );
}