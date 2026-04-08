"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const palette = [
  { name: "Dark Blue", hex: "#020F59", bg: "bg-darkblue" },
  { name: "Medium Blue", hex: "#021373", bg: "bg-mediumblue" },
  { name: "Regular Blue", hex: "#1F54BF", bg: "bg-regularblue" },
  { name: "Light Blue", hex: "#719ED9", bg: "bg-lightblue" },
  { name: "Extra Light", hex: "#D0DCF2", bg: "bg-extralightblue" },
  { name: "Orange", hex: "#F29F05", bg: "bg-orange" },
  { name: "Coral", hex: "#FF6B6B", bg: "bg-coral" },
  { name: "Light Yellow", hex: "#F2E57E", bg: "bg-lightyellow" },
  { name: "Blanc", hex: "#FFFFFF", bg: "bg-white" },
];

function hexToRgb(hex: string): [number, number, number] {
  const val = parseInt(hex.slice(1), 16);
  return [(val >> 16) & 255, (val >> 8) & 255, val & 255];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getWcagLevel(ratio: number): { aa: boolean; aaLarge: boolean; aaa: boolean; aaaLarge: boolean } {
  return {
    aaLarge: ratio >= 3,
    aa: ratio >= 4.5,
    aaaLarge: ratio >= 4.5,
    aaa: ratio >= 7,
  };
}

export function ContrastChecker() {
  const [fgIndex, setFgIndex] = useState(8); // Blanc
  const [bgIndex, setBgIndex] = useState(0); // Dark Blue

  const fg = palette[fgIndex];
  const bg = palette[bgIndex];

  const ratio = useMemo(() => contrastRatio(fg.hex, bg.hex), [fg.hex, bg.hex]);
  const wcag = useMemo(() => getWcagLevel(ratio), [ratio]);

  return (
    <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8 space-y-6">
      <div>
        <h3 className="font-googletitre text-xl text-white font-medium">
          Vérificateur de contraste WCAG
        </h3>
        <p className="text-sm text-white/80 font-googletexte mt-1">
          Testez l&apos;accessibilité des combinaisons de couleurs du design system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color pickers */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-2 block">
              Texte (premier plan)
            </label>
            <div className="flex flex-wrap gap-2">
              {palette.map((c, i) => (
                <button
                  key={`fg-${c.hex}`}
                  onClick={() => setFgIndex(i)}
                  className={cn(
                    "h-8 w-8 rounded-lg border-2 transition-all duration-200 hover:scale-110",
                    c.bg,
                    fgIndex === i ? "border-white scale-110 " : "border-lightblue/20"
                  )}
                  title={c.name}
                />
              ))}
            </div>
            <p className="text-xs text-white/80 font-mono mt-1">{fg.name} — {fg.hex}</p>
          </div>

          <div>
            <label className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-2 block">
              Arrière-plan
            </label>
            <div className="flex flex-wrap gap-2">
              {palette.map((c, i) => (
                <button
                  key={`bg-${c.hex}`}
                  onClick={() => setBgIndex(i)}
                  className={cn(
                    "h-8 w-8 rounded-lg border-2 transition-all duration-200 hover:scale-110",
                    c.bg,
                    bgIndex === i ? "border-white scale-110 " : "border-lightblue/20"
                  )}
                  title={c.name}
                />
              ))}
            </div>
            <p className="text-xs text-white/80 font-mono mt-1">{bg.name} — {bg.hex}</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Live preview */}
          <div
            className="rounded-2xl p-6 border border-lightblue/10 min-h-[100px] flex flex-col justify-center"
            style={{ backgroundColor: bg.hex }}
          >
            <p
              className="font-googletitre text-2xl font-medium"
              style={{ color: fg.hex }}
            >
              Aperçu du texte
            </p>
            <p
              className="font-googletexte text-sm mt-1"
              style={{ color: fg.hex }}
            >
              Corps de texte en {fg.name} sur {bg.name}.
            </p>
          </div>

          {/* Ratio */}
          <div className="rounded-2xl bg-darkblue/60 border border-lightblue/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/80 font-googletexte uppercase tracking-wider">
                Ratio de contraste
              </span>
              <span
                className={cn(
                  "font-mono text-2xl font-bold",
                  ratio >= 7 ? "text-green-400" : ratio >= 4.5 ? "text-orange" : "text-coral"
                )}
              >
                {ratio.toFixed(2)}:1
              </span>
            </div>

            {/* WCAG badges */}
            <div className="grid grid-cols-2 gap-2">
              <div className={cn(
                "rounded-xl px-3 py-2 text-center border",
                wcag.aa
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-coral/10 border-coral/30 text-coral"
              )}>
                <p className="text-xs font-mono font-bold">AA</p>
                <p className="text-[10px] font-googletexte mt-0.5">Texte normal</p>
              </div>
              <div className={cn(
                "rounded-xl px-3 py-2 text-center border",
                wcag.aaLarge
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-coral/10 border-coral/30 text-coral"
              )}>
                <p className="text-xs font-mono font-bold">AA</p>
                <p className="text-[10px] font-googletexte mt-0.5">Grand texte</p>
              </div>
              <div className={cn(
                "rounded-xl px-3 py-2 text-center border",
                wcag.aaa
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-coral/10 border-coral/30 text-coral"
              )}>
                <p className="text-xs font-mono font-bold">AAA</p>
                <p className="text-[10px] font-googletexte mt-0.5">Texte normal</p>
              </div>
              <div className={cn(
                "rounded-xl px-3 py-2 text-center border",
                wcag.aaaLarge
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-coral/10 border-coral/30 text-coral"
              )}>
                <p className="text-xs font-mono font-bold">AAA</p>
                <p className="text-[10px] font-googletexte mt-0.5">Grand texte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
