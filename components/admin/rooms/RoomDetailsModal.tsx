"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  DoorOpen, Users, MapPin, Clock, X, AlertCircle, Lock, Unlock, Calendar, Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomDetailsModalProps {
  room: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDetailsModal({ room, isOpen, onClose }: RoomDetailsModalProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen && room?.id) {
      // ... (existing booking fetch logic is okay here) ...
       const fetchBookings = async () => {
        setLoading(true);
        const { data } = await supabase
          .from('reservations')
          .select('*, profiles(full_name)')
          .eq('room_id', room.id)
          .gte('end_time', new Date().toISOString())
          .order('start_time', { ascending: true });
        
        setBookings(data || []);
        setLoading(false);
      };
      fetchBookings();
    }
  }, [isOpen, room, supabase]);

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card w-full max-w-2xl border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8 relative">
        
        {/* Close Button (Absolute) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/20 backdrop-blur-md hover:bg-black/40 rounded-full transition-colors text-white">
            <X size={20} />
        </button>

        {/* IMAGE BANNER */}
        <div className="relative h-56 bg-muted/30 w-full flex items-center justify-center overflow-hidden">
            {room.image_url ? (
                <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                    <ImageIcon size={48} className="text-[#D7492A]/30" />
                    <p className="text-xs font-black uppercase tracking-widest">No Image Available</p>
                </div>
            )}
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            
            <div className="absolute bottom-6 left-8 flex gap-4 items-end">
                <div className="p-3 bg-[#D7492A] text-white rounded-xl shadow-lg shadow-[#D7492A]/20">
                <DoorOpen size={24} />
                </div>
                <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground leading-none mb-1">{room.name}</h2>
                <p className="text-muted-foreground font-mono uppercase text-sm font-bold">{room.room_number}</p>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* ... (The rest of the content remains exactly the same as before) ... */}
           <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Specifications</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <MapPin size={18} className="text-[#D7492A]" />
                  <div className="flex flex-col leading-tight">
                    <span>{room.building_id}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">Bloc {room.location} • Floor {room.floor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <Users size={18} className="text-[#D7492A]" />
                  {room.capacity} Seats Capacity
                </div>
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                  room.is_restricted ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"
                )}>
                  {room.is_restricted ? <Lock size={12} /> : <Unlock size={12} />}
                  {room.is_restricted ? "Restricted Access" : "General Access"}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Status Side */}
          <div className="bg-muted/30 rounded-3xl p-6 border border-border">
            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
              <Clock size={14} /> Schedule Status
            </h3>
            
            {loading ? (
              <div className="flex items-center gap-2 text-sm italic py-4 text-muted-foreground">
                <AlertCircle size={16} className="animate-spin" /> Fetching availability...
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-red-600 uppercase mb-2">Ongoing / Future Bookings</p>
                {bookings.map((b, i) => (
                  <div key={i} className="p-3 bg-background border border-border rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black text-foreground">
                            {new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                            {new Date(b.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <Calendar size={12} className="text-muted-foreground" />
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase italic">By: {b.profiles?.full_name || 'Staff User'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center space-y-2 border-2 border-dashed border-border rounded-2xl">
                <p className="text-xs font-black text-green-600 uppercase">Available</p>
                <p className="text-[10px] text-muted-foreground">No current reservations found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}