"use client";

import { useState } from "react";
import { 
  Plus, Settings2, LayoutGrid, Building2, 
  Clock, Trash2, Save, Layers, ChevronDown,
  CheckCircle2, ShieldCheck, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import ClusterForm from "./ClusterForm";

export default function AdminSettingsView({ initialClusters, initialDepartments, initialRules }: any) {
  const [activeTab, setActiveTab] = useState("clusters");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [savingRule, setSavingRule] = useState<string | null>(null);
  const supabase = createClient();

  // 1. TOAST NOTIFICATION LOGIC
  const triggerToast = (msg: string) => {
    setToast({ message: msg });
    setTimeout(() => setToast(null), 3000);
  };

  // 2. HIERARCHY UPDATE LOGIC
  const handleClusterUpdate = async (deptId: string, clusterId: string) => {
    const { error } = await supabase
      .from("departments")
      .update({ cluster_id: clusterId || null })
      .eq("id", deptId);
    
    if (!error) triggerToast("Department Hierarchy Updated");
  };

  // 3. BOOKING RULES UPDATE LOGIC
  const handleRuleUpdate = async (ruleId: string, updates: any) => {
    setSavingRule(ruleId);
    const { error } = await supabase
      .from("booking_rules")
      .update(updates)
      .eq("id", ruleId);

    if (!error) {
      triggerToast("Booking Protocols Synced");
      setTimeout(() => setSavingRule(null), 1000);
    }
  };

  const tabs = [
    { id: "rules", label: "Booking Rules", icon: Clock },
    { id: "clusters", label: "Clusters", icon: LayoutGrid },
    { id: "departments", label: "Departments", icon: Building2 },
  ];

  return (
    <div className="space-y-10 relative">
      
      {/* --- FLOATING TOAST --- */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#D7492A] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <CheckCircle2 size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}

      {/* --- 1. THE TAB BAR --- */}
      <div className="flex bg-[#141414] p-1.5 rounded-2xl w-fit border border-white/5 mx-auto shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all",
              activeTab === tab.id 
                ? "bg-[#D7492A] text-white shadow-xl shadow-[#D7492A]/20" 
                : "text-[#A3A3A3] hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-4">
        
        {/* --- 2. BOOKING RULES PANEL --- */}
        {activeTab === "rules" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {initialRules.map((rule: any) => (
              <div key={rule.id} className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#D7492A]">{rule.role_type} Policy</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Registry Access Level</p>
                  </div>
                  <ShieldCheck size={20} className="text-white/20" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Max Hours / Session</label>
                    <div className="relative">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        type="number"
                        defaultValue={rule.max_duration_hours}
                        onBlur={(e) => handleRuleUpdate(rule.id, { max_duration_hours: parseInt(e.target.value) })}
                        className="w-full bg-[#1A1A1A] border-none rounded-2xl px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">Advance Notice (Days)</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        type="number"
                        defaultValue={rule.max_advance_days}
                        onBlur={(e) => handleRuleUpdate(rule.id, { max_advance_days: parseInt(e.target.value) })}
                        className="w-full bg-[#1A1A1A] border-none rounded-2xl px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 outline-none"
                      />
                    </div>
                  </div>
                </div>
                {savingRule === rule.id && (
                  <div className="flex items-center justify-center gap-2 text-[9px] font-black text-[#D7492A] uppercase animate-pulse">
                    <Save size={12} /> Syncing Protocol...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- 3. CLUSTERS CONTENT --- */}
        {activeTab === "clusters" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {initialClusters.map((cluster: any) => (
              <div key={cluster.id} className="group relative bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 hover:border-[#D7492A]/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/5 p-4 rounded-2xl text-[#D7492A]"><Layers size={24} /></div>
                  <button className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">{cluster.name}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {initialDepartments.filter((d: any) => d.cluster_id === cluster.id).length} Entities Assigned
                </p>
              </div>
            ))}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-8 rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-[#D7492A]/50 flex flex-col items-center justify-center gap-4 group transition-all"
            >
              <div className="p-4 bg-white/5 rounded-full text-gray-600 group-hover:bg-[#D7492A] group-hover:text-white transition-all"><Plus size={24} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Create Cluster</span>
            </button>
          </div>
        )}

        {/* --- 4. DEPARTMENTS CONTENT --- */}
        {activeTab === "departments" && (
          <div className="bg-[#141414] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1A1A1A] text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3]">
                  <th className="p-8">Name</th>
                  <th className="p-8">Cluster Assignment</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {initialDepartments.map((dept: any) => (
                  <tr key={dept.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8">
                      <p className="text-sm font-bold text-white">{dept.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">2026 Registry Member</p>
                    </td>
                    <td className="p-8">
                      <div className="relative w-fit">
                        <select 
                          defaultValue={dept.cluster_id || ""}
                          onChange={(e) => handleClusterUpdate(dept.id, e.target.value)}
                          className="bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 pr-10 rounded-xl border-none outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#D7492A]/50"
                        >
                          <option value="">Unassigned</option>
                          {initialClusters.map((c: any) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button className="p-3 text-gray-600 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Settings2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL FOR NEW CLUSTER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <ClusterForm onComplete={() => {
            setIsModalOpen(false);
            triggerToast("Institutional Cluster Created");
          }} />
        </div>
      )}
    </div>
  );
}