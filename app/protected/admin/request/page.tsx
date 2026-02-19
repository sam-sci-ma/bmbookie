"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Mail, 
  ShieldAlert,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner"; // Assuming you use sonner for notifications

export default function AccessRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  }

  async function handleApproval(userId: string, status: boolean) {
    setProcessingId(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: status })
      .eq('id', userId);

    if (error) {
      toast.error("Action failed");
    } else {
      toast.success(status ? "User Approved" : "Request Declined");
      setRequests(prev => prev.filter(r => r.id !== userId));
    }
    setProcessingId(null);
  }

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
          Access <span className="text-primary">Requests</span>
        </h1>
        <p className="text-muted-foreground font-medium text-xs md:text-sm">
          Review and approve institutional access for new staff and faculty.
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="bg-card border border-border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between group hover:border-primary/30 transition-all gap-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-tight">
                    {request.full_name || "New User"}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase">
                      <Mail size={12} className="text-primary" /> {request.email}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase">
                      <ShieldAlert size={12} /> {request.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                <button
                  disabled={!!processingId}
                  onClick={() => handleApproval(request.id, false)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors border border-transparent"
                >
                  Decline
                </button>
                <button
                  disabled={!!processingId}
                  onClick={() => handleApproval(request.id, true)}
                  className="flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {processingId === request.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Approve Access
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-card rounded-[2rem] border border-dashed border-border">
          <div className="flex justify-center mb-4 text-muted-foreground/30">
            <CheckCircle2 size={48} />
          </div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest italic">
            Zero pending requests. The system is up to date.
          </p>
        </div>
      )}
    </div>
  );
}