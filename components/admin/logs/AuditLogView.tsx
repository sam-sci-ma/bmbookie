"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  PlusCircle, Edit3, Trash2, Clock, Database, 
  Search, X, Activity, Eye, History as HistoryIcon 
} from "lucide-react";
import { format } from "date-fns";

// --- Helper: Visual Diff Logic (Unchanged) ---
function getDiff(oldData: any, newData: any) {
  const diffs: Record<string, { old: any; new: any }> = {};
  if (!oldData || !newData) return diffs;
  const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));
  for (const key of allKeys) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      diffs[key] = { old: oldData[key], new: newData[key] };
    }
  }
  return diffs;
}

// --- Audit Diff Modal (Optimized for Mobile height) ---
function AuditDiffModal({ isOpen, onClose, log }: { isOpen: boolean; onClose: () => void; log: any }) {
  if (!isOpen || !log) return null;
  const changes = log.old_data && log.new_data ? Object.entries(getDiff(log.old_data, log.new_data)) : [];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-2xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-5 md:p-6 border-b border-border flex justify-between items-center bg-muted/30 shrink-0">
          <div>
            <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Activity size={16} className="text-[#D7492A]" /> Forensic Analysis
            </h2>
            <p className="text-[9px] text-muted-foreground font-bold mt-1 truncate max-w-[200px]">Record: {log.record_id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"><X size={20} /></button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto space-y-4 flex-1">
          {changes.map(([key, values]: [string, any]) => (
            <div key={key} className="flex flex-col gap-3 p-4 bg-muted/20 rounded-2xl border border-border/50">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#D7492A]">{key.replace('_', ' ')}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                  <span className="text-[7px] font-black uppercase text-red-600/70 block mb-1">Before</span>
                  <code className="text-[10px] md:text-xs font-mono break-all opacity-70">{String(values.old ?? "nil")}</code>
                </div>
                <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                  <span className="text-[7px] font-black uppercase text-green-600 block mb-1">After</span>
                  <code className="text-[10px] md:text-xs font-mono break-all font-bold">{String(values.new ?? "nil")}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-muted/10 border-t border-border shrink-0">
          <button onClick={onClose} className="w-full py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest">Close Analysis</button>
        </div>
      </div>
    </div>
  );
}

export default function AuditLogView({ initialLogs = [] }: { initialLogs: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return initialLogs.filter(log => {
      const actorName = log.profiles?.full_name?.toLowerCase() || "";
      const tableName = log.table_name.toLowerCase();
      const searchTerm = search.toLowerCase();
      return !search || actorName.includes(searchTerm) || tableName.includes(searchTerm);
    });
  }, [search, initialLogs]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Institutional Command Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            placeholder="Search logs..." 
            className="w-full pl-11 pr-4 py-2.5 bg-muted/50 rounded-xl outline-none text-xs md:text-sm border border-transparent focus:border-[#D7492A]/50 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 text-[10px] font-black uppercase text-muted-foreground bg-muted/30 rounded-xl border border-border">
          <Activity size={14} /> {filteredLogs.length} Events Logged
        </div>
      </div>

      {/* PC VIEW: TABLE */}
      <div className="hidden lg:block bg-card border border-border rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-6">Event / Actor</th>
              <th className="p-6">Resource</th>
              <th className="p-6">Context</th>
              <th className="p-6 text-right">Schedule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/5 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <LogIcon action={log.action} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{log.profiles?.full_name || "System"}</p>
                      <p className="text-[9px] text-muted-foreground font-black uppercase mt-1">Action: {log.action}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-sm font-bold capitalize">
                    <Database size={14} className="text-[#D7492A]" /> {log.table_name}
                  </div>
                </td>
                <td className="p-6">
                  {log.action === 'UPDATE' ? (
                    <button onClick={() => { setSelectedLog(log); setIsModalOpen(true); }} className="px-3 py-1.5 bg-muted/50 hover:bg-[#D7492A]/10 text-[9px] font-black uppercase tracking-widest rounded-lg border border-border transition-all">Analysis</button>
                  ) : <span className="text-[9px] font-black uppercase text-muted-foreground/30">Binary Event</span>}
                </td>
                <td className="p-6 text-right">
                  <p className="text-sm font-black">{format(new Date(log.created_at), "HH:mm:ss")}</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">{format(new Date(log.created_at), "MMM dd")}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW: AUDIT FEED */}
      <div className="lg:hidden flex flex-col gap-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-card border border-border p-5 rounded-[1.5rem] space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <LogIcon action={log.action} />
                <div>
                  <h4 className="font-bold text-sm text-foreground leading-tight">{log.profiles?.full_name || "System"}</h4>
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">{log.action} on {log.table_name}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-xs font-black">{format(new Date(log.created_at), "HH:mm")}</p>
                 <p className="text-[8px] font-bold text-muted-foreground uppercase">{format(new Date(log.created_at), "MMM dd")}</p>
              </div>
            </div>
            
            {log.action === 'UPDATE' && (
              <button 
                onClick={() => { setSelectedLog(log); setIsModalOpen(true); }}
                className="w-full py-2.5 bg-[#D7492A]/5 text-[#D7492A] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#D7492A]/10"
              >
                Review Changes
              </button>
            )}
          </div>
        ))}
      </div>

      <AuditDiffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} log={selectedLog} />
    </div>
  );
}

function LogIcon({ action }: { action: string }) {
  const styles = {
    INSERT: "bg-green-500/10 text-green-600 border-green-500/20",
    UPDATE: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    DELETE: "bg-red-500/10 text-red-600 border-red-500/20"
  };
  const icon = action === 'INSERT' ? <PlusCircle size={18} /> : action === 'UPDATE' ? <Edit3 size={18} /> : <Trash2 size={18} />;
  return <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm shrink-0", styles[action as keyof typeof styles])}>{icon}</div>;
}