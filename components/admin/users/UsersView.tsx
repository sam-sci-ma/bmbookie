"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, ShieldAlert, Shield, 
  Trash2, Send, Building, Clock, X, MoreVertical
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateUserRole, updateDepartment, deleteProfile, sendUserMessage } from "@/lib/actions/users";

export default function UsersView({ initialUsers, departments, adminId }: any) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
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
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* --- PC VIEW: INSTITUTIONAL TABLE (Hidden on Mobile) --- */}
      <div className="hidden lg:block bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
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
                        {u.last_connected ? `Active ${formatDistanceToNow(new Date(u.last_connected))} ago` : "Never"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <DepartmentSelect user={u} departments={departments} />
                </td>
                <td className="p-6">
                   <RoleSelect user={u} adminId={adminId} isProcessing={isProcessing} onRoleChange={handleRoleChange} />
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedUser(u)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"><Send size={16} /></button>
                    <button onClick={() => deleteProfile(u.id)} disabled={u.id === adminId} className="p-2 hover:bg-red-500/10 hover:text-red-600 rounded-lg text-muted-foreground disabled:opacity-20 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW: USER CARDS (Visible only on Mobile) --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {initialUsers.map((u: any) => (
          <div key={u.id} className="bg-card border border-border p-5 rounded-[2rem] shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-black text-lg text-foreground border border-border">
                  {u.full_name?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-bold text-foreground text-base leading-tight">{u.full_name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-tighter">
                    Last active: {u.last_connected ? formatDistanceToNow(new Date(u.last_connected)) : "Never"}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(u)} className="p-3 bg-[#D7492A]/10 text-[#D7492A] rounded-xl"><Send size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-muted-foreground uppercase ml-1">Dept.</p>
                <DepartmentSelect user={u} departments={departments} mobile />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-muted-foreground uppercase ml-1">Access</p>
                <RoleSelect user={u} adminId={adminId} isProcessing={isProcessing} onRoleChange={handleRoleChange} mobile />
              </div>
            </div>

            {u.id !== adminId && (
              <button 
                onClick={() => deleteProfile(u.id)} 
                className="w-full py-2.5 text-[10px] font-black uppercase text-muted-foreground/50 hover:text-red-600 border border-dashed border-border rounded-xl transition-all"
              >
                Terminate Profile
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Institutional Messaging Dialog (Extracted for reusability) */}
      {selectedUser && (
        <MessageModal 
          user={selectedUser} 
          msgTitle={msgTitle} 
          msgBody={msgBody} 
          setMsgTitle={setMsgTitle} 
          setMsgBody={setMsgBody} 
          onSend={handleSendMessage} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}

{/* --- MINI COMPONENTS FOR CLEANER CODE --- */}

function DepartmentSelect({ user, departments, mobile }: any) {
  return (
    <div className={cn("flex items-center gap-2", mobile ? "bg-muted/30 p-2 rounded-xl" : "")}>
      <Building size={14} className="text-[#D7492A] shrink-0" />
      <select 
        defaultValue={user.department_id || ""}
        onChange={(e) => updateDepartment(user.id, e.target.value)}
        className="bg-transparent border-none text-xs md:text-sm font-bold text-foreground outline-none focus:ring-0 cursor-pointer hover:text-[#D7492A] transition-colors w-full"
      >
        <option value="">Unassigned</option>
        {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
    </div>
  );
}

function RoleSelect({ user, adminId, isProcessing, onRoleChange, mobile }: any) {
  return (
    <select
      defaultValue={user.role}
      disabled={user.id === adminId || isProcessing === user.id}
      onChange={(e) => onRoleChange(user.id, e.target.value)}
      className={cn(
        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all outline-none cursor-pointer w-full",
        user.role === 'admin' ? "bg-red-500/10 text-red-600 border-red-500/20" :
        user.role === 'staff' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
        "bg-muted text-muted-foreground border-border"
      )}
    >
      <option value="user">User</option>
      <option value="staff">Staff</option>
      <option value="admin">Admin</option>
    </select>
  );
}

function MessageModal({ user, msgTitle, msgBody, setMsgTitle, setMsgBody, onSend, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card border-2 border-foreground w-full max-w-lg rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(215,73,42,0.2)] overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b-2 border-foreground flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Institutional Dispatch</h2>
            <p className="text-[10px] text-muted-foreground font-bold mt-1">Recipient: {user.full_name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          <input 
            placeholder="Subject..." 
            className="w-full bg-muted/50 border-2 border-border focus:border-[#D7492A] rounded-xl px-4 py-3 text-sm outline-none"
            value={msgTitle} onChange={(e) => setMsgTitle(e.target.value)}
          />
          <textarea 
            placeholder="Official communication..." 
            rows={4} 
            className="w-full bg-muted/50 border-2 border-border focus:border-[#D7492A] rounded-xl px-4 py-4 text-sm outline-none resize-none"
            value={msgBody} onChange={(e) => setMsgBody(e.target.value)}
          />
          <button 
            onClick={onSend}
            className="w-full py-4 bg-[#D7492A] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            Send to Inbox
          </button>
        </div>
      </div>
    </div>
  );
}