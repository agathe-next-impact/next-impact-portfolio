"use client";

import { useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

const presets: { label: string; config: SpringConfig }[] = [
  { label: "Par défaut", config: { stiffness: 300, damping: 24, mass: 1 } },
  { label: "Rebond", config: { stiffness: 600, damping: 15, mass: 1 } },
  { label: "Fluide", config: { stiffness: 100, damping: 30, mass: 1 } },
  { label: "Lourd", config: { stiffness: 200, damping: 20, mass: 3 } },
];

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/80 font-googletexte">{label}</label>
        <span className="text-xs text-white/80 font-mono tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-darkblue/60 cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-regularblue
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/30
          [&::-webkit-slider-thumb]:hover:bg-lightblue [&::-webkit-slider-thumb]:transition-colors"
      />
    </div>
  );
}

export function SpringLab() {
  const [config, setConfig] = useState<SpringConfig>(presets[0].config);
  const [animKey, setAnimKey] = useState(0);

  const x = useMotionValue(0);
  const springX = useSpring(x, config);

  const trigger = useCallback(() => {
    x.set(250);
    setTimeout(() => x.set(0), 50);
    setAnimKey((k) => k + 1);
  }, [x]);

  return (
    <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8 space-y-6">
      <div>
        <h3 className="font-googletitre text-xl text-white font-medium">
          Laboratoire Spring Animation
        </h3>
        <p className="text-sm text-white/80 font-googletexte mt-1">
          Ajustez les paramètres physiques de <code className="text-regularblue/80 bg-regularblue/10 rounded px-1 text-xs font-mono">framer-motion useSpring</code> et observez le comportement en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          {/* Presets */}
          <div>
            <p className="text-xs text-white/80 font-googletexte uppercase tracking-wider mb-2">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setConfig(p.config)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-googletexte border transition-all",
                    config.stiffness === p.config.stiffness &&
                      config.damping === p.config.damping &&
                      config.mass === p.config.mass
                      ? "bg-regularblue/30 text-white border-regularblue/40"
                      : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:text-white/80"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <SliderControl
            label="Stiffness (raideur)"
            value={config.stiffness}
            min={10}
            max={1000}
            step={10}
            onChange={(v) => setConfig((c) => ({ ...c, stiffness: v }))}
          />
          <SliderControl
            label="Damping (amortissement)"
            value={config.damping}
            min={1}
            max={100}
            step={1}
            onChange={(v) => setConfig((c) => ({ ...c, damping: v }))}
          />
          <SliderControl
            label="Mass (masse)"
            value={config.mass}
            min={0.1}
            max={5}
            step={0.1}
            onChange={(v) => setConfig((c) => ({ ...c, mass: v }))}
          />

          {/* Code output */}
          <div className="rounded-xl bg-darkblue/60 border border-lightblue/10 p-3">
            <p className="text-[10px] text-white/80 font-mono mb-1">Configuration</p>
            <pre className="text-xs text-extralightblue/80 font-mono">
{`useSpring(value, {
  stiffness: ${config.stiffness},
  damping: ${config.damping},
  mass: ${config.mass},
})`}
            </pre>
          </div>
        </div>

        {/* Animation preview */}
        <div className="space-y-4">
          {/* Ball animation */}
          <div className="rounded-2xl bg-darkblue/60 border border-lightblue/10 p-6 min-h-[200px] flex flex-col justify-center items-center gap-6">
            <p className="text-xs text-white/80 font-googletexte">Translation horizontale</p>
            <div className="w-full h-12 relative flex items-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-lightblue/10" />
              </div>
              <motion.div
                style={{ x: springX }}
                className="relative h-10 w-10 rounded-full bg-gradient-to-br from-orange to-coral shadow-lg shadow-orange/30"
              />
            </div>
          </div>

          {/* Card animation */}
          <div className="rounded-2xl bg-darkblue/60 border border-lightblue/10 p-6 flex flex-col items-center gap-4">
            <p className="text-xs text-white/80 font-googletexte">Scale + opacity</p>
            <motion.div
              key={animKey}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: config.stiffness,
                damping: config.damping,
                mass: config.mass,
              }}
              className="h-20 w-32 rounded-2xl bg-gradient-to-br from-regularblue to-mediumblue border border-lightblue/20 flex items-center justify-center"
            >
              <span className="text-xs text-white/80 font-googletexte">Carte</span>
            </motion.div>
          </div>

          {/* Trigger button */}
          <button
            onClick={trigger}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-darkblue/40 border border-lightblue/10 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-lightblue/30 transition-all font-googletexte"
          >
            <RotateCcw className="h-4 w-4" />
            Rejouer l&apos;animation
          </button>
        </div>
      </div>
    </div>
  );
}
