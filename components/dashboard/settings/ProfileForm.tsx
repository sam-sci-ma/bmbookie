"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Building, Save, Check, ChevronDown, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileForm({ 
  profile, 
  departments 
}: { 
  profile: any, 
  departments: any[] 
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    department_id: profile?.department_id || "",
    job_role: profile?.job_role || "", // New Job Role State
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({ 
        full_name: formData.full_name,
        department_id: formData.department_id,
        job_role: formData.job_role // Updated in Database
      })
      .eq("id", profile.id);

    setLoading(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="grid gap-6">
        
        {/* 1. FULL NAME */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] ml-2">
            Identity
          </label>
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1-2 text-gray-600" size={16} />
            <input 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="Your full name"
              className="w-full bg-[#1A1A1A] border-none rounded-[1.25rem] px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 transition-all outline-none placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* 2. JOB ROLE (NEW) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] ml-2">
            Professional Designation
          </label>
          <div className="relative">
            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              value={formData.job_role}
              onChange={(e) => setFormData({...formData, job_role: e.target.value})}
              placeholder="e.g. Senior Researcher, Student, Staff"
              className="w-full bg-[#1A1A1A] border-none rounded-[1.25rem] px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 transition-all outline-none placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* 3. DYNAMIC SCHOOL SELECTION */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-white uppercase tracking-[0.2em] ml-2">
            Institutional School
          </label>
          <div className="relative">
            <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <select 
              value={formData.department_id}
              onChange={(e) => setFormData({...formData, department_id: e.target.value})}
              className="w-full bg-[#1A1A1A] border-none rounded-[1.25rem] px-14 py-4 text-sm text-white focus:ring-2 focus:ring-[#D7492A]/40 transition-all outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="" disabled className="text-gray-500">Select School</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id} className="bg-[#141414] text-white">
                  {dept.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="pt-4">
        <button 
          type="submit"
          disabled={loading}
          className={cn(
            "w-full py-4 rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3",
            saved ? "bg-green-600 text-white" : "bg-white text-black hover:bg-[#D7492A] hover:text-white"
          )}
        >
          {loading ? "Updating..." : saved ? <><Check size={16}/> Applied</> : <><Save size={16}/> Update Profile</>}
        </button>
      </div>
    </form>
  );
}