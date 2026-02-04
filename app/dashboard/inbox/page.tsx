import { createClient } from "@/lib/supabase/server";
import { Inbox } from "lucide-react";
import InboxItem from "@/components/inbox/InboxItem";
import { redirect } from "next/navigation";

export default async function InboxPage() {
  const supabase = await createClient();
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch real messages from the registry
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Inbox Fetch Error:", error.message);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-poppins pb-24 px-4 animate-in fade-in duration-700">
      {/* INSTITUTIONAL HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
          Registry <span className="text-[#D7492A]">Inbox</span>
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Official Communications & System Notifications • 2026 Rollout
        </p>
      </div>

      <div className="h-px bg-border w-full" />

      {/* MESSAGES LIST */}
      <div className="space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <InboxItem key={msg.id} msg={msg} />
          ))
        ) : (
          /* EMPTY STATE - THE VOID */
          <div className="py-24 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/5 flex flex-col items-center justify-center">
            <div className="bg-muted/20 p-6 rounded-full mb-4 border border-border">
              <Inbox className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
              Silence in the Registry
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
              You have no active communications at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}