"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function PuzzleAnimation() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevents server-side rendering glitches

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <AnimatePresence>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.05, 0.15, 0.05], // Kept it subtle for the institutional look
              scale: [1, 1.1, 1],
              x: [0, i % 2 === 0 ? 50 : -50, 0],
              y: [0, i % 2 === 0 ? -30 : 30, 0],
            }}
            transition={{ 
              duration: 15 + i, 
              repeat: Infinity, 
              ease: "linear", // Linear is smoother for background "drift"
              delay: i * 0.2 
            }}
            className="absolute border-2 border-[#D7492A]/10 bg-[#D7492A]/5 rounded-[3rem] backdrop-blur-[1px]"
            style={{
              width: `${200 + (i * 40)}px`,
              height: `${160 + (i * 25)}px`,
              top: `${(i * 15) + 5}%`,
              left: `${(i * 20) % 75}%`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}