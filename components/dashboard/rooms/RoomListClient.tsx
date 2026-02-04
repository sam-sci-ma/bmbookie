"use client";

import { useState } from "react";
import { LayoutGrid, MapPin, Users, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RoomDetailsModal from "@/components/dashboard/rooms/RoomDetailsModal";

export default function RoomListClient({ rooms, date, start, end, minSize }: any) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenView = (room: any) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rooms.length > 0 ? (
          rooms.map((room: any) => (
            <div 
              key={room.id} 
              className="group bg-[#141414] rounded-xl border border-white/5 p-5 hover:border-[#D7492A]/40 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded mb-2 block w-fit">
                    {room.type}
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-tight leading-none truncate text-white">
                    {room.name}
                  </h3>
                </div>
                {/* VIEW BUTTON */}
                <button 
                  onClick={() => handleOpenView(room)}
                  className="p-2 bg-white/5 hover:bg-[#D7492A] text-gray-400 hover:text-white rounded-xl transition-all"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-gray-500 uppercase">
                <div className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> {room.capacity} Max</div>
                <div className="flex items-center gap-1.5 truncate text-[9px]"><MapPin size={14} className="text-primary" /> {room.campus}</div>
              </div>

              <Link 
                href={`/dashboard/spaces/${room.id}/book?date=${date}&start=${start}&end=${end}&guests=${minSize}`} 
                className="mt-auto"
              >
                <Button className="w-full bg-white text-black hover:bg-[#D7492A] hover:text-white py-6 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all">
                  Book This Room <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 flex flex-col items-center justify-center gap-2">
            <Users className="w-8 h-8 text-white/10" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic leading-relaxed text-center">
              No rooms fit your criteria.
            </p>
          </div>
        )}
      </div>

      <RoomDetailsModal 
        room={selectedRoom} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}