"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(
  reservationId: string, 
  status: 'confirmed' | 'rejected',
  adminId: string,
  notes: string = ""
) {
  const supabase = await createClient();

  // 1. Fetch the reservation first to get the user_id and room info for the message
  const { data: booking } = await supabase
    .from("reservations")
    .select("user_id, rooms(name)")
    .eq("id", reservationId)
    .single();

  if (!booking) throw new Error("Booking not found");

  // 2. Update the Reservation Status
  const { error: resError } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId);

  if (resError) throw new Error(resError.message);

  // 3. Log into Approval Workflows
  await supabase
    .from("approval_workflows")
    .insert([{
      reservation_id: reservationId,
      approver_id: adminId,
      notes: notes || `Admin ${status} this request.`,
    }]);

  // 4. AUTOMATED MESSAGE: Notify the user
  const isApproved = status === 'confirmed';
  const subject = isApproved ? "Booking Confirmed" : "Booking Update";
  const content = isApproved 
    ? `Your request for ${booking.rooms?.name} has been approved. Please ensure you check in on time.`
    : `Regrettably, your request for ${booking.rooms?.name} was not approved. ${notes}`;

  await supabase
    .from("messages")
    .insert([{
      user_id: booking.user_id,
      reservation_id: reservationId,
      subject: subject,
      content: content,
      type: isApproved ? 'success' : 'warning',
      sender_name: 'Shared Services Admin'
    }]);

  revalidatePath("/protected/admin/bookings");
}