import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Users, LayoutGrid, Info, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default async function SpaceDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: space } = await supabase.from("rooms").select("*").eq("id", params.id).single();

  if (!space) notFound();

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Photo Section */}
        <div className="space-y-4">
          <div className="aspect-video bg-[#141414] rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl">
            {space.image_url ? (
               <Image src={space.image_url} alt={space.name} fill className="object-cover" />
            ) : (
               <div className="flex items-center justify-center h-full text-gray-800 font-black uppercase text-xs">No Photo Registered</div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div className="aspect-square bg-[#141414] rounded-3xl border border-white/5"></div>
             <div className="aspect-square bg-[#141414] rounded-3xl border border-white/5"></div>
             <div className="aspect-square bg-[#141414] rounded-3xl border border-white/5"></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-10">
          <div>
            <span className="text-[10px] font-black text-[#D7492A] uppercase tracking-[0.3em] mb-4 block">Room Registry</span>
            <h1 className="text-5xl font-bold text-white tracking-tighter leading-none mb-4">{space.name}</h1>
            <p className="text-gray-400 font-medium leading-relaxed">{space.description || "Detailed institutional space intended for academic collaboration and strategic meetings."}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Capacity", value: `${space.capacity} Persons`, icon: Users },
              { label: "Location", value: space.location, icon: LayoutGrid },
              { label: "Campus", value: space.campus, icon: MapPin },
              { label: "Status", value: "Verified", icon: ShieldCheck },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-[#141414] rounded-[2rem] border border-white/5 flex flex-col gap-3">
                <item.icon size={20} className="text-[#D7492A]" />
                <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-bold text-white uppercase">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}