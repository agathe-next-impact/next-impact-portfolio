"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "secondary" | "ghost";

const variants: { label: string; value: ButtonVariant }[] = [
  { label: "Primaire", value: "default" },
  { label: "Secondaire", value: "secondary" },
  { label: "Contour", value: "outline" },
  { label: "Fantôme", value: "ghost" },
];

export function LiveButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>("default");
  const [label, setLabel] = useState("Cliquez-moi");

  return (
    <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8 space-y-6">
      <h3 className="font-googletitre text-xl text-white font-medium">
        Playground : Bouton interactif
      </h3>

      {/* Preview area */}
      <div className="flex items-center justify-center rounded-2xl bg-darkblue/60 border border-lightblue/10 p-8 min-h-[120px]">
        <motion.div
          key={variant}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button variant={variant} size="lg">
            {label}
          </Button>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Variant selector */}
        <div>
          <label className="text-sm text-white/80 mb-2 block font-googletexte">
            Variante
          </label>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.value}
                onClick={() => setVariant(v.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-googletexte transition-all duration-200 border",
                  variant === v.value
                    ? "bg-regularblue/30 text-white border-regularblue/40"
                    : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:bg-darkblue/60 hover:text-white/80"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Label input */}
        <div>
          <label className="text-sm text-white/80 mb-2 block font-googletexte">
            Texte du bouton
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-xl bg-darkblue/50 border border-lightblue/10 px-3 py-2 text-white text-sm font-googletexte outline-none focus:border-lightblue/30 transition-colors"
            maxLength={30}
          />
        </div>
      </div>
    </div>
  );
}
