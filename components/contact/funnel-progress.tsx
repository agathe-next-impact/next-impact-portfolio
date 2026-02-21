"use client";

import { motion } from "framer-motion";

interface FunnelProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FunnelProgress({ currentStep, totalSteps }: FunnelProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3">
      <span className="text-sm text-white/60 font-googletexte uppercase tracking-widest">
        Étape {currentStep} sur {totalSteps}
      </span>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-coral to-lightyellow rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
