"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, ShieldAlert, Shield, 
  Trash2, Send, Building, Clock, X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateUserRole, updateDepartment, deleteProfile, sendUserMessage } from "@/lib/actions/users";

export default function UsersView({ initialUsers, departments, adminId }: any) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Restoration of messaging state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsProcessing(userId);
    await updateUserRole(userId, newRole);
    setIsProcessing(null);
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !msgTitle || !msgBody) return;
    
    // Find admin name for the 'sender_name' field
    const admin = initialUsers.find((u: any) => u.id === adminId);
    const senderName = admin?.full_name || "Institutional Admin";

    const res = await sendUserMessage(selectedUser.id, senderName, msgTitle, msgBody);
    
    if (res.success) {
      setSelectedUser(null);
      setMsgTitle("");
      setMsgBody("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Identity / Activity</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Department</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Authority Level</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialUsers.map((u: any) => (
              <tr key={u.id} className="hover:bg-muted/5 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-black text-foreground border border-border">
                      {u.full_name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{u.full_name}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium mt-1">
                        <Clock size={10} />
                        {u.last_connected 
                          ? `Active ${formatDistanceToNow(new Date(u.last_connected))} ago` 
                          : "Never connected"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-[#D7492A]" />
                    <select 
                      defaultValue={u.department_id || ""}
                      onChange={(e) => updateDepartment(u.id, e.target.value)}
                      className="bg-transparent border-none text-sm font-bold text-foreground outline-none focus:ring-0 cursor-pointer hover:text-[#D7492A] transition-colors"
                    >
                      <option value="">Unassigned</option>
                      {departments.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </td>

                <td className="p-6">
                  <select
                    defaultValue={u.role}
                    disabled={u.id === adminId || isProcessing === u.id}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all outline-none cursor-pointer",
                      u.role === 'admin' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                      u.role === 'staff' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* FIXED: Re-added the onClick handler here */}
                    <button 
                      onClick={() => setSelectedUser(u)}
                      className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
                    >
                      <Send size={16} />
                    </button>
                    
                    <button 
                      onClick={() => deleteProfile(u.id)}
                      disabled={u.id === adminId}
                      className="p-2 hover:bg-red-500/10 hover:text-red-600 rounded-lg text-muted-foreground disabled:opacity-20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RE-ADDED: Institutional Messaging Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border-2 border-foreground w-full max-w-lg rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(215,73,42,0.2)] overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b-2 border-foreground flex justify-between items-center bg-muted/30">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Institutional Dispatch</h2>
                <p className="text-[10px] text-muted-foreground font-bold mt-1">Recipient: {selectedUser.full_name}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">Subject</label>
                <input 
                  placeholder="e.g. 2026 Rollout Update"
                  className="w-full bg-muted/50 border-2 border-border focus:border-[#D7492A] rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  value={msgTitle}
                  onChange={(e) => setMsgTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">Message Body</label>
                <textarea 
                  placeholder="Enter official communication..."
                  rows={4}
                  className="w-full bg-muted/50 border-2 border-border focus:border-[#D7492A] rounded-xl px-4 py-4 text-sm outline-none resize-none transition-all"
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSendMessage}
                className="w-full py-4 bg-[#D7492A] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Send to Inbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}