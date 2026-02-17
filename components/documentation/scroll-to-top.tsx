"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className={cn(
        "fixed z-40 transition-all duration-300",
        "bottom-20 right-6 lg:bottom-6",
        "flex h-10 w-10 items-center justify-center rounded-full",
        "bg-darkblue/80 backdrop-blur-sm border border-lightblue/10",
        "text-white/80 hover:text-white hover:border-lightblue/30 hover:bg-darkblue",
        "shadow-lg shadow-darkblue/40",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
