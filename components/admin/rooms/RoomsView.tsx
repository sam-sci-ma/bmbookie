"use client";

import { useState, useMemo } from "react";
import RoomFilters from "./RoomFilters";
import RoomDetailsModal from "./RoomDetailsModal";
import EditRoomModal from "./EditRoomModal";
import DeleteRoomModal from "./DeleteRoomModal";
import { 
  DoorOpen, Users, Pencil, Trash2, Eye, Lock, Unlock, MapPin 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoomsView({ initialRooms }: { initialRooms: any[] }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    campus: "",
    building_id: "",
    location: "", 
    is_restricted: ""
  });

  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [activeModal, setActiveModal] = useState<"view" | "edit" | "delete" | null>(null);

  const filteredRooms = useMemo(() => {
    return initialRooms.filter((room) => {
      const matchesSearch = 
        !search || 
        room.name?.toLowerCase().includes(search.toLowerCase()) ||
        room.room_number?.toLowerCase().includes(search.toLowerCase());

      const matchesCampus = !filters.campus || room.campus === filters.campus;
      const matchesBuilding = !filters.building_id || room.building_id === filters.building_id;
      const matchesBloc = !filters.location || room.location === filters.location;
      const matchesAccess = filters.is_restricted === "" || String(room.is_restricted) === filters.is_restricted;

      return matchesSearch && matchesCampus && matchesBuilding && matchesBloc && matchesAccess;
    });
  }, [search, filters, initialRooms]);

  const openModal = (room: any, type: "view" | "edit" | "delete") => {
    setSelectedRoom(room);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      <RoomFilters 
        onSearch={(val) => setSearch(val)}
        onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
        onClear={() => {
          setSearch("");
          setFilters({ campus: "", building_id: "", location: "", is_restricted: "" });
        }}
      />

      {/* --- PC VIEW: TABLE --- */}
      <div className="hidden lg:block bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm mt-8 transition-all">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Room Details</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Location</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Capacity</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Access</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-muted/30 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#D7492A]/10 rounded-xl">
                      <DoorOpen className="text-[#D7492A]" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{room.name || "N/A"}</p>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">{room.room_number}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm font-medium">
                   <div className="flex items-center gap-2">
                     <span className="text-foreground">{room.building_id}</span>
                     <span className="text-[9px] font-black px-1.5 py-0.5 bg-[#D7492A]/10 text-[#D7492A] rounded uppercase">
                       {room.campus}
                     </span>
                   </div>
                   <p className="text-[10px] text-muted-foreground uppercase mt-1">Bloc {room.location} • Floor {room.floor}</p>
                </td>
                <td className="p-6 text-muted-foreground font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} /> {room.capacity}
                  </div>
                </td>
                <td className="p-6 text-center">
                   {room.is_restricted ? <Lock className="text-red-500" size={16}/> : <Unlock className="text-green-500" size={16}/>}
                </td>
                <td className="p-6 text-center">
                   <ActionButtons room={room} openModal={openModal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW: CARD GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 mt-8">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-card border border-border p-5 rounded-[1.5rem] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D7492A]/10 rounded-lg">
                  <DoorOpen className="text-[#D7492A]" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{room.name}</h4>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">{room.room_number}</p>
                </div>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-md text-[8px] font-black uppercase border",
                room.is_restricted ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
              )}>
                {room.is_restricted ? "Restricted" : "Public"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1"><MapPin size={10} className="text-[#D7492A]"/> {room.campus}</div>
              <div className="flex items-center gap-1"><Users size={10} className="text-[#D7492A]"/> {room.capacity} Seats</div>
            </div>

            <div className="pt-2 border-t border-border/50">
               <ActionButtons room={room} openModal={openModal} fullWidth />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="p-20 text-center text-muted-foreground font-black uppercase text-[10px] tracking-widest border border-dashed rounded-[2rem]">
          No rooms match your active filters.
        </div>
      )}

      {/* Modals */}
      <RoomDetailsModal room={selectedRoom} isOpen={activeModal === "view"} onClose={closeModal} />
      <EditRoomModal room={selectedRoom} isOpen={activeModal === "edit"} onClose={closeModal} />
      <DeleteRoomModal room={selectedRoom} isOpen={activeModal === "delete"} onClose={closeModal} />
    </div>
  );
}

{/* REUSABLE ACTION BUTTONS */}
function ActionButtons({ room, openModal, fullWidth }: any) {
  return (
    <div className={cn("flex items-center gap-2", fullWidth ? "justify-between" : "justify-center")}>
      <button onClick={() => openModal(room, "view")} className="p-2.5 bg-muted/50 rounded-xl text-muted-foreground hover:text-blue-500 transition-colors">
        <Eye size={18} />
      </button>
      <button onClick={() => openModal(room, "edit")} className="p-2.5 bg-muted/50 rounded-xl text-muted-foreground hover:text-[#D7492A] transition-colors">
        <Pencil size={18} />
      </button>
      <button onClick={() => openModal(room, "delete")} className="p-2.5 bg-muted/50 rounded-xl text-muted-foreground hover:text-red-500 transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  );
}