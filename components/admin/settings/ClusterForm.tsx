"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LayoutGrid, Type, AlignLeft, Save, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClusterForm({ onComplete }: { onComplete: () => void }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from("clusters")
      .insert([
        { 
          name: formData.name, 
          description: formData.description 
        }
      ]);

    setLoading(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onComplete();
      }, 2000);
    }
  };

  return (
    <div className="bg-[#141414] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">New Institutional Cluster</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Registry Governance 2026</p>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl text-[#D7492A]">
          <LayoutGrid size={20} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* CLUSTER NAME */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white uppercase tracking-widest ml-2">
            Cluster Name
          </label>
          <div className="relative">
            <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Business & Management"
              className="w-full bg-[#1A1A1A] border-none rounded-2xl px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 outline-none transition-all placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white uppercase tracking-widest ml-2">
            Description (Optional)
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-5 top-6 text-gray-600" size={16} />
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Define the purpose of this cluster..."
              rows={4}
              className="w-full bg-[#1A1A1A] border-none rounded-2xl px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 outline-none transition-all resize-none placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* SUBMIT ACTION */}
        <div className="pt-4 flex gap-3">
          <button 
            type="button"
            onClick={onComplete}
            className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className={cn(
              "flex-[2] py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
              saved ? "bg-green-600 text-white" : "bg-white text-black hover:bg-[#D7492A] hover:text-white"
            )}
          >
            {loading ? "Processing..." : saved ? <><Check size={16}/> Registered</> : <><Save size={16}/> Create Cluster</>}
          </button>
        </div>
      </form>
    </div>
  );
}