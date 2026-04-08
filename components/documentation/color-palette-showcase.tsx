"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const colors = [
  {
    name: "Dark Blue",
    variable: "darkblue",
    hex: "#020F59",
    bg: "bg-darkblue",
  },
  {
    name: "Medium Blue",
    variable: "mediumblue",
    hex: "#021373",
    bg: "bg-mediumblue",
  },
  {
    name: "Regular Blue",
    variable: "regularblue",
    hex: "#1F54BF",
    bg: "bg-regularblue",
  },
  {
    name: "Light Blue",
    variable: "lightblue",
    hex: "#D0DCF2",
    bg: "bg-lightblue",
  },
  {
    name: "Extra Light",
    variable: "extralightblue",
    hex: "#F0F4FA",
    bg: "bg-extralightblue",
  },
  {
    name: "Orange",
    variable: "orange",
    hex: "#F29F05",
    bg: "bg-orange",
  },
  {
    name: "Coral",
    variable: "coral",
    hex: "#FF6B6B",
    bg: "bg-coral",
  },
  {
    name: "Light Yellow",
    variable: "lightyellow",
    hex: "#F2E57E",
    bg: "bg-lightyellow",
  },
];

export function ColorPaletteShowcase() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(hex);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8 space-y-6">
      <h3 className="font-googletitre text-xl text-white font-medium">
        Palette de couleurs
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {colors.map((color) => (
          <button
            key={color.variable}
            onClick={() => handleCopy(color.hex)}
            className="group text-left"
          >
            <div
              className={cn(
                color.bg,
                "h-16 rounded-2xl border border-lightblue/10 transition-all duration-200 group-hover:scale-105 relative overflow-hidden"
              )}
            >
              {copied === color.hex && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-mono">
                  Copié !
                </span>
              )}
            </div>
            <p className="text-xs text-white/80 font-googletexte mt-2">
              {color.name}
            </p>
            <p className="text-[10px] text-white/80 font-mono">{color.hex}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
