"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Marks a specific message as read in the registry.
 */
export async function markAsRead(messageId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId);

  if (error) {
    console.error("Failed to mark message as read:", error.message);
    return { success: false };
  }

  revalidatePath("/protected/inbox");
  return { success: true };
}