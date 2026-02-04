"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  Calendar, Clock, DoorOpen, Search, 
  CheckCircle2, XCircle, Eye, Loader2, Mail, MapPin 
} from "lucide-react";
import { updateBookingStatus } from "@/lib/actions/bookings";
import BookingDetailsModal from "./BookingDetailsModal"; 

export default function BookingsView({ 
  initialBookings = [], 
  adminId 
}: { 
  initialBookings: any[], 
  adminId: string 
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    return initialBookings.filter(b => {
      const matchesStatus = filterStatus === "all" || b.status === filterStatus;
      const userName = b.profiles?.full_name?.toLowerCase() || "";
      const userEmail = b.profiles?.email?.toLowerCase() || "";
      const purposeText = b.purpose?.toLowerCase() || "";
      const searchTerm = search.toLowerCase();

      return matchesStatus && (
        !search || 
        userName.includes(searchTerm) || 
        userEmail.includes(searchTerm) ||
        purposeText.includes(searchTerm)
      );
    });
  }, [filterStatus, search, initialBookings]);

  const handleDecision = async (id: string, decision: 'confirmed' | 'rejected') => {
    setProcessingId(id);
    try {
      await updateBookingStatus(id, decision, adminId);
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Search & Filter Bar - Stacked on Mobile */}
      <div className="flex flex-col lg:flex-row gap-4 bg-card p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            placeholder="Search requestor..." 
            className="w-full pl-11 pr-4 py-2.5 bg-muted/30 rounded-xl outline-none text-xs md:text-sm border border-transparent focus:border-[#D7492A]/50 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {["all", "pending", "confirmed", "rejected"].map((s) => (
            <button 
              key={s} 
              onClick={() => setFilterStatus(s)} 
              className={cn(
                "px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider border transition-all flex-shrink-0",
                filterStatus === s ? "bg-[#D7492A] text-white border-[#D7492A]" : "bg-muted/30 text-muted-foreground border-transparent"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PC VIEW: TABLE */}
      <div className="hidden md:block bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">User / Purpose</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Room / Campus</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Schedule</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((booking) => (
              <BookingRow key={booking.id} booking={booking} processingId={processingId} handleDecision={handleDecision} setSelectedBooking={setSelectedBooking} setIsDetailOpen={setIsDetailOpen} />
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW: CARDS */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((booking) => (
          <BookingCard key={booking.id} booking={booking} processingId={processingId} handleDecision={handleDecision} setSelectedBooking={setSelectedBooking} setIsDetailOpen={setIsDetailOpen} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center bg-card border border-dashed border-border rounded-[2rem]">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">No bookings found</p>
        </div>
      )}

      <BookingDetailsModal booking={selectedBooking} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </div>
  );
}

{/* SUB-COMPONENT: MOBILE CARD */}
function BookingCard({ booking, processingId, handleDecision, setSelectedBooking, setIsDetailOpen }: any) {
  return (
    <div className="bg-card border border-border rounded-[1.5rem] p-5 space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D7492A]/10 flex items-center justify-center text-[#D7492A] font-black border border-[#D7492A]/20">
            {booking.profiles?.full_name?.charAt(0) || <Mail size={14} />}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-foreground truncate">{booking.profiles?.full_name || "Unknown"}</p>
            <p className="text-[9px] text-[#D7492A] font-black uppercase tracking-tighter truncate">{booking.purpose || "No Purpose"}</p>
          </div>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border",
          booking.status === "confirmed" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
        )}>
          {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
        <div className="space-y-1">
          <p className="text-[8px] font-black text-muted-foreground uppercase">Resource</p>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <DoorOpen size={12} className="text-[#D7492A]" /> {booking.rooms?.name}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black text-muted-foreground uppercase">Schedule</p>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Calendar size={12} className="text-[#D7492A]" /> {new Date(booking.start_time).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {booking.status === "pending" ? (
          <>
            <button onClick={() => handleDecision(booking.id, 'confirmed')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-green-500/20">
              {processingId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
            </button>
            <button onClick={() => handleDecision(booking.id, 'rejected')} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-600 rounded-xl text-[10px] font-black uppercase">
              {processingId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
            </button>
          </>
        ) : (
          <button onClick={() => { setSelectedBooking(booking); setIsDetailOpen(true); }} className="w-full py-2.5 bg-muted/50 text-muted-foreground rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
            <Eye size={14} /> View Full Logs
          </button>
        )}
      </div>
    </div>
  );
}

{/* SUB-COMPONENT: TABLE ROW (PC) */}
function BookingRow({ booking, processingId, handleDecision, setSelectedBooking, setIsDetailOpen }: any) {
  return (
    <tr className="hover:bg-muted/10 transition-colors">
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D7492A]/10 flex items-center justify-center text-[#D7492A] font-black border border-[#D7492A]/20">
            {booking.profiles?.full_name?.charAt(0) || <Mail size={16} />}
          </div>
          <div className="max-w-[200px]">
            <p className="font-bold text-foreground leading-tight truncate">{booking.profiles?.full_name || booking.profiles?.email}</p>
            <p className="text-[10px] text-[#D7492A] font-black uppercase tracking-tighter truncate mt-0.5">{booking.purpose}</p>
          </div>
        </div>
      </td>
      <td className="p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <DoorOpen size={16} className="text-[#D7492A]" /> {booking.rooms?.name}
        </div>
        <p className="text-[10px] font-black text-muted-foreground uppercase ml-6">{booking.rooms?.campus}</p>
      </td>
      <td className="p-6">
        <div className="flex items-center gap-2 text-foreground text-sm font-bold">
          <Calendar size={14} className="text-[#D7492A]" /> {new Date(booking.start_time).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black ml-5">
          <Clock size={12} /> {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </td>
      <td className="p-6 text-sm">
        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase", booking.status === "confirmed" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20")}>
          {booking.status}
        </div>
      </td>
      <td className="p-6">
        <div className="flex items-center justify-center gap-2">
          {booking.status === "pending" && (
            <>
              <button onClick={() => handleDecision(booking.id, 'confirmed')} className="p-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                {processingId === booking.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              </button>
              <button onClick={() => handleDecision(booking.id, 'rejected')} className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                {processingId === booking.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
              </button>
            </>
          )}
          <button onClick={() => { setSelectedBooking(booking); setIsDetailOpen(true); }} className="p-2 hover:bg-muted text-muted-foreground rounded-lg transition-colors">
            <Eye size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}