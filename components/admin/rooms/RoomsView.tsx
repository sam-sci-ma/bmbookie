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
  // 1. Filtering State
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    campus: "",
    building_id: "",
    location: "", // Bloc
    is_restricted: ""
  });

  // 2. Modal Management State
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [activeModal, setActiveModal] = useState<"view" | "edit" | "delete" | null>(null);

  // 3. Filtering Logic
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

  // Modal Trigger Helper
  const openModal = (room: any, type: "view" | "edit" | "delete") => {
    setSelectedRoom(room);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setActiveModal(null);
  };

  return (
    <>
      <RoomFilters 
        onSearch={(val) => setSearch(val)}
        onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
        onClear={() => {
          setSearch("");
          setFilters({ campus: "", building_id: "", location: "", is_restricted: "" });
        }}
      />

      {/* Table Section */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm mt-8 transition-all">
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
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
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
                  <td className="p-6">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-[#D7492A] mt-1" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{room.building_id || "Main Building"}</span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 bg-muted rounded border border-border uppercase text-muted-foreground">
                            {room.campus || "Benguerir"}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          Bloc: {room.location || "A"} • Floor: {room.floor || "0"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-muted-foreground font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-foreground" />
                      {room.capacity} Seats
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter",
                      room.is_restricted ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"
                    )}>
                      {room.is_restricted ? <Lock size={10} /> : <Unlock size={10} />}
                      {room.is_restricted ? "Restricted" : "Public"}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openModal(room, "view")}
                        className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openModal(room, "edit")}
                        className="p-2 text-muted-foreground hover:text-[#D7492A] hover:bg-[#D7492A]/10 rounded-lg transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => openModal(room, "delete")}
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-20 text-center text-muted-foreground font-medium italic">
                  No rooms match your active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modals Component Section --- */}
      <RoomDetailsModal 
        room={selectedRoom} 
        isOpen={activeModal === "view"} 
        onClose={closeModal} 
      />

      <EditRoomModal 
        room={selectedRoom} 
        isOpen={activeModal === "edit"} 
        onClose={closeModal} 
      />

      <DeleteRoomModal 
        room={selectedRoom} 
        isOpen={activeModal === "delete"} 
        onClose={closeModal} 
      />
    </>
  );
}