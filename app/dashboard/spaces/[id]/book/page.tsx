"use client";

import { useState, use, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, Clock, Users, CheckCircle2, 
  ArrowLeft, ShieldCheck, Zap, Hash, AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SuccessModal from "@/components/SuccessModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookSpacePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const roomId = resolvedParams?.id || "";
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL State
  const dateStr = searchParams.get("date") || ""; 
  const start = searchParams.get("start") || "08:00";
  const end = searchParams.get("end") || "10:00";
  const guests = parseInt(searchParams.get("guests") || "0");

  // Local UI State
  const [eventName, setEventName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const triggerToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const displayId = useMemo(() => {
    if (!dateStr) return "PENDING";
    return `${dateStr.replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [dateStr]);

  const isFormComplete = eventName.length >= 3;

  const handleConfirm = async () => {
    // 1. MANDATORY PARAMETER VALIDATION
    if (!dateStr || guests === 0) {
      triggerToast("Coordination Error: Date and Seat Range are mandatory.");
      return;
    }

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      triggerToast("Session Expired. Please re-authenticate.", "error");
      setIsSubmitting(false);
      return;
    }

    const startTime = `${dateStr}T${start}:00Z`;
    const endTime = `${dateStr}T${end}:00Z`;

    const { error } = await supabase
      .from("reservations")
      .insert([{
          room_id: roomId,
          user_id: user.id,
          start_time: startTime,
          end_time: endTime,
          purpose: eventName,
          status: 'pending'
      }]);

    setIsSubmitting(false);

    if (error) {
      triggerToast(`Governance Error: ${error.message}`, "error");
    } else {
      setShowSuccess(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-poppins pb-24 px-4 relative">
      
      {/* --- HIGH-CONTRAST TOAST --- */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 duration-300">
          <div className={cn(
            "px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[320px]",
            toast.type === "error" 
              ? "bg-[#D7492A] text-white border-white/10" 
              : "bg-green-600 text-white border-white/10"
          )}>
            {toast.type === "error" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}

      <Link href="/dashboard/spaces" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#D7492A] transition-colors w-fit">
        <ArrowLeft className="w-3 h-3" /> Back to registry
      </Link>

      <header className="space-y-1">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
          Review <span className="text-[#D7492A]">Booking</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em]">Institutional Submission Mode</p>
      </header>

      <Card className="bg-[#141414] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-[#D7492A] uppercase tracking-widest">Tracking Reference</p>
              <h2 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Hash size={14} className="text-gray-500" /> ID: {displayId}
              </h2>
            </div>
            <Zap size={14} className={cn("text-[#D7492A] fill-[#D7492A] transition-opacity", !dateStr && "opacity-20")} />
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Purpose of Reservation</Label>
              <Input 
                placeholder="e.g. Research Seminar" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="h-12 bg-[#1A1A1A] border-none rounded-xl px-5 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 outline-none placeholder:text-gray-800"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Date", value: dateStr || "Missing", icon: Calendar, error: !dateStr },
                { label: "Window", value: `${start}-${end}`, icon: Clock, error: false },
                { label: "Guests", value: guests > 0 ? `${guests} Seats` : "Missing", icon: Users, error: guests === 0 }
              ].map((item, i) => (
                <div key={i} className={cn(
                  "bg-white/5 p-4 rounded-2xl border transition-colors",
                  item.error ? "border-red-500/50 bg-red-500/5" : "border-white/5"
                )}>
                  <p className={cn(
                    "text-[8px] font-black uppercase tracking-widest mb-1",
                    item.error ? "text-red-500" : "text-[#D7492A]"
                  )}>{item.label}</p>
                  <p className={cn(
                    "text-[10px] font-bold truncate",
                    item.error ? "text-red-400 italic" : "text-white"
                  )}>{item.value}</p>
                </div>
              ))}
            </div>

            <Button 
              disabled={!isFormComplete || isSubmitting}
              onClick={handleConfirm}
              className="w-full py-7 rounded-2xl bg-white text-black hover:bg-[#D7492A] hover:text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl active:scale-95"
            >
              {isSubmitting ? "Syncing Registry..." : "Confirm Booking"}
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-700 uppercase tracking-widest">
              <ShieldCheck size={14} /> 2026 Institutional Governance
            </div>
          </div>
        </CardContent>
      </Card>

     <SuccessModal 
  bookingId={displayId} 
  isOpen={showSuccess} 
  onClose={() => setShowSuccess(false)}
/>
    </div>
  );
}