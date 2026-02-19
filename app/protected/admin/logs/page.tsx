"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Activity, 
  ShieldCheck, 
  UserCircle, 
  Clock, 
  Search,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('system_logs')
        .select(`
          *,
          profiles:actor_id (full_name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error) setLogs(data || []);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            System <span className="text-primary">Logs</span>
          </h1>
          <p className="text-muted-foreground font-medium text-xs md:text-sm uppercase tracking-wider">
            Institutional Audit Trail • 2026
          </p>
        </div>

        <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl">
          <Search size={14} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="bg-transparent border-none text-xs focus:ring-0 w-40"
          />
        </div>
      </header>

      <div className="relative">
        {/* Timeline Vertical Line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="relative pl-12 md:pl-20 group">
              {/* Timeline Indicator Dot */}
              <div className="absolute left-[13px] md:left-[29px] top-1.5 w-2 h-2 rounded-full bg-primary border-4 border-background group-hover:scale-150 transition-transform" />

              <div className="bg-card border border-border p-4 rounded-2xl shadow-sm hover:border-primary/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                       <Activity size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {log.action_text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                           {log.category}
                         </span>
                         <span className="text-[10px] text-muted-foreground">•</span>
                         <span className="text-[10px] text-muted-foreground font-medium">
                           by {log.profiles?.full_name || "System"}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1 rounded-full w-fit">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold">
                      {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}