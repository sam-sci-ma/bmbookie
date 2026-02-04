"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  PlusCircle, Edit3, Trash2, Clock, Database, 
  Search, X, Activity, Eye, ArrowRight, History as HistoryIcon // <--- Aliased
} from "lucide-react";
import { format } from "date-fns";

// --- Helper: Visual Diff Logic ---
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

// --- Sub-Component: Audit Diff Modal ---
function AuditDiffModal({ isOpen, onClose, log }: { isOpen: boolean; onClose: () => void; log: any }) {
  if (!isOpen || !log) return null;

  const changes = log.old_data && log.new_data ? Object.entries(getDiff(log.old_data, log.new_data)) : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Activity size={16} className="text-[#D7492A]" /> Change Analysis
            </h2>
            <p className="text-[10px] text-muted-foreground font-bold mt-1">UUID: {log.record_id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {changes.length > 0 ? (
            changes.map(([key, values]: [string, any]) => (
              <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-2xl border border-border/50">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#D7492A] self-center">
                  {key.replace('_', ' ')}
                </div>
                <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                  <p className="text-[8px] font-black uppercase text-red-600/70 mb-1">Previous</p>
                  <p className="text-xs font-mono break-words opacity-70">{String(values.old ?? "empty")}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                  <p className="text-[8px] font-black uppercase text-green-600 mb-1">Updated</p>
                  <p className="text-xs font-mono break-words font-bold">{String(values.new ?? "empty")}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-50 italic text-xs uppercase font-black tracking-widest">
              No structural differences detected in this event.
            </div>
          )}
        </div>
        <div className="p-4 bg-muted/10 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase">
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component: Audit Log View ---
export default function AuditLogView({ initialLogs = [] }: { initialLogs: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return initialLogs.filter(log => {
      const actorName = log.profiles?.full_name?.toLowerCase() || "";
      const actorEmail = log.profiles?.email?.toLowerCase() || "";
      const tableName = log.table_name.toLowerCase();
      const searchTerm = search.toLowerCase();

      return !search || actorName.includes(searchTerm) || actorEmail.includes(searchTerm) || tableName.includes(searchTerm);
    });
  }, [search, initialLogs]);

  return (
    <div className="space-y-6">
      {/* Institutional Command Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-[1.5rem] border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            placeholder="Search by actor name, email, or table..." 
            className="w-full pl-12 pr-4 py-2.5 bg-muted/50 rounded-xl outline-none text-sm text-foreground border border-transparent focus:border-[#D7492A]/50 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 text-[10px] font-black uppercase text-muted-foreground bg-muted/30 rounded-xl border border-border">
          <Activity size={14} /> {filteredLogs.length} Events Logged
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Event / Actor</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Resource Path</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Context</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Schedule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm",
                        log.action === 'INSERT' ? "bg-green-500/10 text-green-600 border-green-500/20" :
                        log.action === 'UPDATE' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                        "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        {log.action === 'INSERT' ? <PlusCircle size={18} /> : 
                         log.action === 'UPDATE' ? <Edit3 size={18} /> : <Trash2 size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">
                          {log.profiles?.full_name || log.profiles?.email || "System/Trigger"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-1">
                          Action: {log.action}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Database size={14} className="text-[#D7492A]" />
                      <span className="text-sm font-bold text-foreground capitalize">{log.table_name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono ml-5 opacity-60">
                      ID: {log.record_id.slice(0, 8)}...
                    </p>
                  </td>

                  <td className="p-6">
                    {log.action === 'UPDATE' ? (
                      <button 
                        onClick={() => { setSelectedLog(log); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-[#D7492A]/10 hover:text-[#D7492A] rounded-lg border border-border transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <Eye size={14} /> Analysis
                      </button>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">
                        {log.action === 'INSERT' ? "Creation Event" : "Removal Event"}
                      </span>
                    )}
                  </td>

                  <td className="p-6 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Clock size={12} className="text-muted-foreground" />
                        {format(new Date(log.created_at), "HH:mm:ss")}
                      </div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                        {format(new Date(log.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-24 text-center opacity-30">
            
<HistoryIcon className="mx-auto mb-4" size={48} />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Registry Synchronized (Empty)</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AuditDiffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        log={selectedLog} 
      />
    </div>
  );
}