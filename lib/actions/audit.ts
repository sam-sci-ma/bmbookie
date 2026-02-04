"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Institutional Audit Fetcher
 * Retrieves the last 100 events from the audit_logs table.
 * RLS policies will automatically filter results based on the requester's role.
 */
export async function getAuditLogs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select(`
      *,
      profiles:actor_id (
        full_name,
        email,
        role
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Institutional Audit Error:", error.message);
    return [];
  }

  return data;
}