import { createClient } from "@/lib/supabase/server";
import RoomsView from "@/components/admin/rooms/RoomsView";
import RegisterRoomButton from "@/components/admin/rooms/RegisterRoomButton";

export default async function RoomsManagementPage() {
  const supabase = await createClient();

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Room <span className="text-[#D7492A]">Management</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Institutional resource tracking for UM6P.
          </p>
        </div>
        
        {/* Functional Client Component Button */}
        <RegisterRoomButton /> 
      </div>

      {/* Pass the data to the Client Wrapper */}
      <RoomsView initialRooms={rooms || []} />
    </div>
  );
}