"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Calendar, Clock, User, DoorOpen, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingDetailsModal({ booking, isOpen, onClose }: any) {
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen && booking) {
      const checkConflicts = async () => {
        setLoading(true);
        const { data } = await supabase
          .from("reservations")
          .select("*, profiles(full_name)")
          .eq("room_id", booking.room_id)
          .eq("status", "confirmed")
          .neq("id", booking.id) // Don't check against itself
          .filter("start_time", "lt", booking.end_time)
          .filter("end_time", "gt", booking.start_time);

        setConflicts(data || []);
        setLoading(false);
      };
      checkConflicts();
    }
  }, [isOpen, booking, supabase]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-xl border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header (Same as before) */}
        <div className="p-8 border-b border-border bg-muted/30 flex justify-between items-start">
            {/* ... header content ... */}
        </div>

        <div className="p-8 space-y-6">
          {/* CONFLICT DETECTOR PANEL */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">System Audit</p>
            {loading ? (
              <div className="p-4 bg-muted animate-pulse rounded-2xl border border-border text-xs font-bold italic">Scanning for scheduling conflicts...</div>
            ) : conflicts.length > 0 ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-red-600 shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-sm font-black text-red-600">Double-Booking Warning</p>
                  <p className="text-xs text-red-500 font-medium leading-relaxed">
                    This room is already confirmed for <span className="font-bold">{conflicts[0].profiles?.full_name}</span> during this window.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-xs font-black text-green-600 uppercase">Clear to Confirm: No Conflicts Detected</p>
              </div>
            )}
          </div>

          <hr className="border-border" />

          {/* User & Room Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Requestor</p>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <User size={16} className="text-[#D7492A]" />
                {booking.profiles?.full_name}
              </div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Room</p>
              <div className="flex items-center justify-end gap-2 font-bold text-foreground">
                {booking.rooms?.name}
                <DoorOpen size={16} className="text-[#D7492A]" />
              </div>
            </div>
          </div>

          {/* Purpose Box */}
          <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <Info size={12} /> Stated Purpose
              </p>
              <div className="p-4 bg-muted/30 border border-border rounded-2xl text-sm leading-relaxed text-foreground italic">
                "{booking.purpose || "No specific purpose provided."}"
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-muted/50 border-t border-border flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-foreground text-background dark:bg-primary dark:text-primary-foreground rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}