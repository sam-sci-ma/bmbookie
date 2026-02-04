"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, DoorOpen, Users, ShieldCheck, ShieldAlert, Loader2, UploadCloud, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface EditRoomModalProps {
  room: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditRoomModal({ room, isOpen, onClose }: EditRoomModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);


  useEffect(() => {
    if (room) {
        setFormData(room);
        setImagePreview(room.image_url); // Set initial preview to existing URL
        setNewImageFile(null); // Reset new file
    }
  }, [room]);

  if (!isOpen || !formData) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = formData.image_url;

    // 1. Handle New Image Upload if selected
    if (newImageFile) {
        const fileExt = newImageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${formData.campus}/${fileName}`;
  
        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(filePath, newImageFile);
  
        if (uploadError) {
          alert("Error uploading new image: " + uploadError.message);
          setLoading(false);
          return;
        }
  
        const { data: { publicUrl } } = supabase.storage
          .from('room-images')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

    // 2. Update Database
    const { error } = await supabase
      .from("rooms")
      .update({
        name: formData.name,
        room_number: formData.room_number,
        building_id: formData.building_id,
        capacity: parseInt(formData.capacity),
        location: formData.location,
        floor: formData.floor,
        campus: formData.campus,
        is_restricted: formData.is_restricted,
        image_url: finalImageUrl // Update URL
      })
      .eq("id", room.id);

    if (!error) {
      router.refresh();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <form 
        onSubmit={handleSave}
        className="bg-card w-full max-w-2xl border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8"
      >
        {/* Header */}
        <div className="p-8 border-b border-border bg-muted/30 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="p-4 bg-[#D7492A] text-white rounded-2xl">
              <DoorOpen size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Edit Room</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Update institutional resource</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
             {/* Image Edit Section */}
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Room Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 rounded-2xl border border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-all group overflow-hidden"
                >
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold uppercase text-xs tracking-wider gap-2">
                                <Pencil size={16} /> Change Photo
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-[#D7492A] transition-colors">
                            <UploadCloud size={24} />
                            <p className="text-xs font-bold uppercase tracking-wider">Upload photo</p>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
            </div>

        {/* Form Content (The rest is the same inputs as before) */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Room Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Room Name</label>
            <input 
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-[#D7492A]/50 outline-none font-bold text-sm"
            />
          </div>

          {/* Room Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Room Number</label>
            <input 
              required
              value={formData.room_number || ""}
              onChange={(e) => setFormData({...formData, room_number: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-[#D7492A]/50 outline-none font-mono text-sm"
            />
          </div>

          {/* Building & Campus */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Building & Campus</label>
            <div className="flex gap-2">
              <input 
                value={formData.building_id || ""}
                onChange={(e) => setFormData({...formData, building_id: e.target.value})}
                placeholder="Building"
                className="w-2/3 px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-[#D7492A]/50 outline-none text-sm font-bold"
              />
              <select 
                value={formData.campus || ""}
                onChange={(e) => setFormData({...formData, campus: e.target.value})}
                className="w-1/3 px-2 py-3 rounded-xl bg-muted/50 border border-border text-[10px] font-black uppercase"
              >
                <option value="Benguerir">Benguerir</option>
                <option value="Rabat">Rabat</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Capacity (Seats)</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-[#D7492A]/50 outline-none text-sm font-bold"
              />
            </div>
          </div>

          {/* Bloc & Floor */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Bloc & Floor</label>
            <div className="flex gap-2">
              <input 
                placeholder="Bloc (e.g. A)"
                value={formData.location || ""}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-1/2 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm font-bold"
              />
              <input 
                placeholder="Floor"
                value={formData.floor || ""}
                onChange={(e) => setFormData({...formData, floor: e.target.value})}
                className="w-1/2 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm font-bold"
              />
            </div>
          </div>

          {/* Restricted Toggle */}
          <div className="space-y-1 flex flex-col justify-end">
            <button
              type="button"
              onClick={() => setFormData({...formData, is_restricted: !formData.is_restricted})}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                formData.is_restricted 
                  ? "bg-red-500/10 border-red-500/20 text-red-600" 
                  : "bg-green-500/10 border-green-500/20 text-green-600"
              )}
            >
              <span className="text-[10px] font-black uppercase">Restricted Access</span>
              {formData.is_restricted ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
            </button>
          </div>
        </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-muted/50 border-t border-border flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-black uppercase text-muted-foreground hover:text-foreground">Cancel</button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-[#D7492A] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#D7492A]/20 disabled:opacity-50 flex items-center gap-2"
          >
             {loading ? <Loader2 className="animate-spin" size={16} /> : <Pencil size={16} />}
             Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}