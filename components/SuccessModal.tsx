"use client";

import { CheckCircle2, Copy, ArrowRight, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void; // Added onClose prop
}

export default function SuccessModal({ bookingId, isOpen, onClose }: SuccessModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="max-w-sm w-full bg-[#141414] border border-white/10 rounded-[2.5rem] p-8 text-center space-y-6 shadow-[0_0_80px_rgba(215,73,42,0.15)] animate-in zoom-in-95 duration-300 relative">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-500 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* SUCCESS ICON (Slightly Smaller) */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-[#D7492A] blur-2xl opacity-20 animate-pulse" />
          <div className="relative bg-[#141414] border-2 border-[#D7492A] rounded-full w-full h-full flex items-center justify-center text-[#D7492A]">
            <CheckCircle2 size={36} strokeWidth={2} />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tighter italic uppercase">Submission Complete</h2>
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]"></p>
        </div>

        {/* TRACKING BOX (Compact) */}
        <div className="bg-white/5 p-5 rounded-[1.5rem] border border-white/5 space-y-2">
          <p className="text-[7px] font-black text-[#D7492A] uppercase tracking-widest">Tracking Reference</p>
          <div className="flex items-center justify-center gap-3 text-lg font-mono font-bold text-white tracking-widest">
            {bookingId}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(bookingId);
                // You could trigger a small "Copied" toast here
              }} 
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-600 hover:text-white"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button 
            onClick={() => router.push("/dashboard/reservations")}
            className="w-full py-6 rounded-2xl bg-white text-black hover:bg-[#D7492A] hover:text-white font-black uppercase tracking-[0.25em] text-[10px] transition-all shadow-xl"
          >
            Review Status <ArrowRight size={14} className="ml-2" />
          </Button>
          
          <button className="flex items-center justify-center gap-2 mx-auto text-[8px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-colors">
            <Share2 size={10} /> Export Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}