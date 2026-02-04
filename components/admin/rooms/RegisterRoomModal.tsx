"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Plus, DoorOpen, Users, MapPin, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RegisterRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterRoomModal({ isOpen, onClose }: RegisterRoomModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    room_number: "",
    building_id: "",
    capacity: 20,
    location: "", // Bloc
    floor: "",
    campus: "Benguerir",
    type: "Classroom",
    is_restricted: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("rooms")
      .insert([{
        ...formData,
        capacity: parseInt(formData.capacity.toString())
      }]);

    if (!error) {
      router.refresh();
      onClose();
      setFormData({
        name: "", room_number: "", building_id: "", capacity: 20,
        location: "", floor: "", campus: "Benguerir", type: "Classroom", is_restricted: false
      });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <form 
        onSubmit={handleSubmit}
        className="bg-card w-full max-w-2xl border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-8 border-b border-border bg-[#D7492A]/5 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="p-4 bg-[#D7492A] text-white rounded-2xl shadow-lg shadow-[#D7492A]/20">
              <Plus size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Register New Room</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Institutional Asset Creation</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground">
            <X size={24} />
          </button>
        </div>

        {/* Form Grid */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Room Name</label>
            <input required placeholder="e.g. Shared Hub A" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-[#D7492A]/50 outline-none font-bold text-sm" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Room Number</label>
            <input required placeholder="e.g. B-102" value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-[#D7492A]/50 outline-none font-mono text-sm uppercase" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Building & Campus</label>
            <div className="flex gap-2">
              <input required placeholder="Building" value={formData.building_id} onChange={e => setFormData({...formData, building_id: e.target.value})} className="w-2/3 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm font-bold" />
              <select value={formData.campus} onChange={e => setFormData({...formData, campus: e.target.value})} className="w-1/3 px-2 py-3 rounded-xl bg-muted/50 border border-border text-[9px] font-black uppercase">
                <option value="Benguerir">Benguerir</option>
                <option value="Rabat">Rabat</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Capacity</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm font-bold" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Bloc & Floor</label>
            <div className="flex gap-2">
              <input placeholder="Bloc (Location)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-1/2 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm font-bold" />
              <input placeholder="Floor" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} className="w-1/2 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm font-bold" />
            </div>
          </div>

          <div className="space-y-1 flex flex-col justify-end">
            <button type="button" onClick={() => setFormData({...formData, is_restricted: !formData.is_restricted})} className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                formData.is_restricted ? "bg-red-500/10 border-red-500/20 text-red-600" : "bg-green-500/10 border-green-500/20 text-green-600"
              )}>
              <span className="text-[10px] font-black uppercase">Access Control</span>
              {formData.is_restricted ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-muted/30 border-t border-border flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-black uppercase text-muted-foreground hover:text-foreground">Discard</button>
          <button type="submit" disabled={loading} className="px-10 py-3 bg-[#D7492A] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#D7492A]/20 disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
}