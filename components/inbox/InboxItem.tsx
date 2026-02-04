"use client";

import { useState } from "react";
import { markAsRead } from "@/lib/actions/messages";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, CheckCircle2, AlertCircle, 
  Info, X, Calendar
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function InboxItem({ msg }: { msg: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(msg.is_read);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!isRead) {
      setIsRead(true);
      await markAsRead(msg.id);
    }
  };

  return (
    <>
      {/* 1. NEAT LIST ITEM */}
      <div
        onClick={handleOpen}
        className={cn(
          "group relative p-5 rounded-xl transition-all cursor-pointer mb-3 border border-border/50",
          "bg-card hover:border-[#D7492A]/30 hover:bg-muted/30",
          !isRead ? "shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)]" : "opacity-60"
        )}
      >
        <div className="flex items-center gap-5">
          {/* Status Dot */}
          <div className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
            !isRead ? "bg-[#D7492A]" : "bg-transparent"
          )} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#D7492A] uppercase tracking-wider">
                {msg.sender_name}
              </span>
              <span className="text-[9px] font-medium text-muted-foreground/60">
                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
              </span>
            </div>
            <h3 className={cn(
              "text-sm tracking-tight truncate",
              !isRead ? "font-semibold text-foreground" : "font-normal text-muted-foreground"
            )}>
              {msg.subject}
            </h3>
          </div>
          
          <ChevronRight size={14} className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 2. NEAT MODAL VIEW */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-xl rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-border flex justify-between items-center bg-muted/20">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Message Detail
              </span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-muted rounded-md transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                  {msg.subject}
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium italic">
                  <Calendar size={12} />
                  {format(new Date(msg.created_at), "MMMM d, yyyy 'at' HH:mm")}
                </div>
              </div>

              <div className="text-sm leading-relaxed text-foreground/80 font-normal whitespace-pre-wrap py-6 px-6 bg-muted/10 rounded-lg border border-border/40">
                {msg.content}
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-foreground text-background rounded-lg text-xs font-bold tracking-wide hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}