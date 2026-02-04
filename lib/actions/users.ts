"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Updates a user's role (Admin, Staff, or User)
 */
export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);
  
  if (error) {
    console.error("Update Role Error:", error.message);
    return { success: false };
  }

  revalidatePath("/protected/admin/users");
  return { success: true };
}

/**
 * Updates a user's assigned department
 */
export async function updateDepartment(userId: string, deptId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ department_id: deptId || null })
    .eq("id", userId);

  if (error) {
    console.error("Update Department Error:", error.message);
    return { success: false };
  }

  revalidatePath("/protected/admin/users");
  return { success: true };
}

/**
 * Removes a profile from the public schema registry
 */
export async function deleteProfile(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  
  if (error) {
    console.error("Delete Profile Error:", error.message);
    return { success: false };
  }

  revalidatePath("/protected/admin/users");
  return { success: true };
}

/**
 * Dispatches an institutional message to a user's dashboard inbox
 */
export async function sendUserMessage(recipientId: string, senderName: string, subject: string, content: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.from("messages").insert({
    user_id: recipientId,
    sender_name: senderName,
    subject: subject,
    content: content,
    type: 'info' // Defaulting to info for standard dispatches
  });

  if (error) {
    console.error("Message Dispatch Error:", error.message);
    return { success: false };
  }

  // We don't necessarily need to revalidate the admin page, 
  // but we return success so the modal can close.
  return { success: true };
}