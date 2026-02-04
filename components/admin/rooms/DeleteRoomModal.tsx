"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteRoomModalProps {
  room: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteRoomModal({ room, isOpen, onClose }: DeleteRoomModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  if (!isOpen || !room) return null;

  const handleDelete = async () => {
    if (confirmName !== room.name) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", room.id);

    if (!error) {
      router.refresh();
      onClose();
      setConfirmName("");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md border-2 border-red-500/20 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Warning Header */}
        <div className="p-6 bg-red-500/5 flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground">Confirm Deletion</h2>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">This action is permanent</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            You are about to remove <span className="font-black text-foreground">{room.name}</span> from the institutional registry. All associated metadata will be lost.
          </p>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
              Type <span className="text-red-500">{room.name}</span> to confirm
            </label>
            <input 
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Enter room name"
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-red-500/50 outline-none font-bold text-sm text-center"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-xs font-black uppercase text-muted-foreground hover:bg-muted rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={loading || confirmName !== room.name}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            Delete Room
          </button>
        </div>
      </div>
    </div>
  );
}