"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const samples = [
  {
    id: "titre",
    label: "Titre (Nunito)",
    font: "font-googletitre",
    sizes: [
      { label: "5xl", class: "text-5xl", px: "48px" },
      { label: "4xl", class: "text-4xl", px: "36px" },
      { label: "3xl", class: "text-3xl", px: "30px" },
      { label: "2xl", class: "text-2xl", px: "24px" },
      { label: "xl", class: "text-xl", px: "20px" },
    ],
  },
  {
    id: "texte",
    label: "Texte (Inter)",
    font: "font-googletexte",
    sizes: [
      { label: "lg", class: "text-lg", px: "18px" },
      { label: "base", class: "text-base", px: "16px" },
      { label: "sm", class: "text-sm", px: "14px" },
      { label: "xs", class: "text-xs", px: "12px" },
    ],
  },
];

export function TypographyShowcase() {
  const [activeFont, setActiveFont] = useState("titre");

  const current = samples.find((s) => s.id === activeFont)!;

  return (
    <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8 space-y-6">
      <h3 className="font-googletitre text-xl text-white font-medium">
        Typographie
      </h3>

      {/* Font selector */}
      <div className="flex gap-2">
        {samples.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveFont(s.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-googletexte transition-all duration-200 border",
              activeFont === s.id
                ? "bg-regularblue/30 text-white border-regularblue/40"
                : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:bg-darkblue/60 hover:text-white/80"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Size scale */}
      <div className="rounded-2xl bg-darkblue/60 border border-lightblue/10 p-6 space-y-4">
        {current.sizes.map((size) => (
          <div key={size.label} className="flex items-baseline gap-4">
            <span className="w-16 shrink-0 text-xs text-white/80 font-mono text-right">
              {size.px}
            </span>
            <span
              className={cn(
                size.class,
                current.font,
                "text-white font-medium truncate"
              )}
            >
              Next Impact
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
