export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[9999]">
      <div className="relative">
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse" />
        
 
        <div className="relative grid grid-cols-2 gap-1 animate-spin [animation-duration:3s]">
          {/* Top Left */}
          <div className="w-8 h-8 bg-[#D7492A] flex items-center justify-center rounded-sm shadow-sm">
             <span className="text-white font-black text-xs">U</span>
          </div>
          {/* Top Right */}
          <div className="w-8 h-8 bg-[#D7492A] flex items-center justify-center rounded-sm shadow-sm">
             <span className="text-white font-black text-xs">M</span>
          </div>
          {/* Bottom Left */}
          <div className="w-8 h-8 bg-[#D7492A] flex items-center justify-center rounded-sm shadow-sm">
             <span className="text-white font-black text-xs">6</span>
          </div>
          {/* Bottom Right */}
          <div className="w-8 h-8 bg-[#D7492A] flex items-center justify-center rounded-sm shadow-sm">
             <span className="text-white font-black text-xs">P</span>
          </div>
        </div>
      </div>

      {/* Loading Text & Status Dots */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/70">
          Booky System
        </span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-[#D7492A] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#D7492A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#D7492A] rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}