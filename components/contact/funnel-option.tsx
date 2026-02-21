"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FunnelOptionProps {
  icon: string;
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
}

export function FunnelOption({ icon, label, description, selected, onClick }: FunnelOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border text-left transition-all duration-300 cursor-pointer",
        "bg-mediumblue/60 backdrop-blur-lg hover:shadow-lg",
        selected
          ? "border-lightyellow/40 shadow-lg"
          : "border-white/10 hover:border-lightblue/30"
      )}
    >
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <span className="font-googletitre font-semibold text-white text-base">{label}</span>
        {description && (
          <span className="text-sm font-googletexte text-white/60">{description}</span>
        )}
      </div>
    </motion.button>
  );
}
