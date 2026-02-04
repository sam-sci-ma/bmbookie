// app/loading.tsx
import { BookOpen } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[9999]">
      <div className="relative">
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        
        {/* Animated Book Icon */}
        <div className="relative bg-card p-6 rounded-2xl border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(215,73,42,1)] animate-bounce">
          <BookOpen className="w-12 h-12 text-primary" strokeWidth={2.5} />
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
          Opening Booky
        </span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}