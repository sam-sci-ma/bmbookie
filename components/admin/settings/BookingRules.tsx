"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, Calendar, Save, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingRules({ initialRules, onUpdate }: any) {
  const supabase = createClient();
  const [saving, setSaving] = useState<string | null>(null);

  const handleUpdateRule = async (ruleId: string, updates: any) => {
    setSaving(ruleId);
    const { error } = await supabase
      .from("booking_rules")
      .update(updates)
      .eq("id", ruleId);

    if (!error) {
      onUpdate("Rule Protocols Updated");
      setTimeout(() => setSaving(null), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      {initialRules.map((rule: any) => (
        <div 
          key={rule.id} 
          className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#D7492A]">
                {rule.role_type} Protocol
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Access Tier: {rule.role_type}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl text-white/40">
              <ShieldCheck size={20} />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                Max Duration (Hours)
              </label>
              <div className="relative">
                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  type="number"
                  defaultValue={rule.max_duration_hours}
                  onBlur={(e) => handleUpdateRule(rule.id, { max_duration_hours: parseInt(e.target.value) })}
                  className="w-full bg-[#1A1A1A] border-none rounded-2xl px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                Advance Booking (Days)
              </label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  type="number"
                  defaultValue={rule.max_advance_days}
                  onBlur={(e) => handleUpdateRule(rule.id, { max_advance_days: parseInt(e.target.value) })}
                  className="w-full bg-[#1A1A1A] border-none rounded-2xl px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-widest h-4">
            {saving === rule.id ? (
              <span className="text-[#D7492A] animate-pulse flex items-center gap-1.5">
                <Save size={10} /> Syncing with Registry...
              </span>
            ) : (
              <span className="text-green-500/50 flex items-center gap-1.5">
                <Check size={10} /> Protocol Active
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}