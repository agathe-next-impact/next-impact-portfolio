"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { paletteSnapshot, prefersReducedMotion } from "./palette";

/**
 * Sonar — balayage radar tournant sur un champ de nœuds qui s'allument au passage
 * du faisceau (inspiré de artifact-sonar). Indigo + doré, halo. Tech + artistique.
 * En reduced-motion : rendu statique (anneaux + nœuds, sans balayage).
 */
export function Sonar({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = prefersReducedMotion();

    let W = 0, H = 0, cx = 0, cy = 0, RAD = 300;
    let nodes: { a: number; r: number; seed: number; lit: number; gold: boolean }[] = [];
    const build = () => {
      nodes = Array.from({ length: 64 }, () => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * RAD * 0.95;
        return { a, r, seed: Math.random(), lit: 0, gold: Math.random() > 0.85 };
      });
    };
    const resize = () => {
      const rect = cvs.getBoundingClientRect();
      W = rect.width; H = rect.height;
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W * 0.56; cy = H * 0.5; RAD = Math.min(W, H) * 0.42;
      build();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    const SWEEP = 0.7;
    let raf = 0, t0 = performance.now();

    const draw = (t: number) => {
      const C = paletteSnapshot();
      const dt = Math.min(33, t - t0) / 16.666;
      t0 = t;
      const now = t / 1000;
      ctx.fillStyle = reduce ? C("--obsidian", 1) : C("--obsidian", 0.22);
      ctx.fillRect(0, 0, W, H);
      const beam = reduce ? Math.PI * 1.75 : (now * SWEEP) % (Math.PI * 2);

      ctx.save();
      ctx.translate(cx, cy);

      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (RAD / 4) * i, 0, Math.PI * 2);
        ctx.strokeStyle = C("--accent", 0.13);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.strokeStyle = C("--accent", 0.08);
      ctx.beginPath();
      ctx.moveTo(-RAD, 0); ctx.lineTo(RAD, 0);
      ctx.moveTo(0, -RAD); ctx.lineTo(0, RAD);
      ctx.stroke();

      if (!reduce) {
        const trail = 0.9;
        for (let k = 0; k < 1; k += 0.04) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, RAD, beam - trail * k - 0.02, beam - trail * k);
          ctx.closePath();
          ctx.fillStyle = C("--accent-champagne", 0.1 * (1 - k));
          ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(beam) * RAD, Math.sin(beam) * RAD);
        ctx.strokeStyle = C("--accent-champagne", 0.7);
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 16; ctx.shadowColor = C("--accent-champagne", 0.9);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      for (const n of nodes) {
        const diff = ((beam - n.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (!reduce && diff < 0.18) n.lit = 1;
        n.lit *= Math.pow(0.985, dt);
        const x = Math.cos(n.a) * n.r, y = Math.sin(n.a) * n.r;
        const base = 0.18 + 0.1 * Math.sin(now + n.seed * 20);
        const lit = Math.max(base, n.lit);
        const col = n.gold ? "--accent-2" : "--accent";
        if (n.lit > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, 10 * n.lit, 0, Math.PI * 2);
          ctx.fillStyle = C(col, n.lit * 0.18);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, 2 + n.lit * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = C(col, lit);
        if (n.lit > 0.3) { ctx.shadowBlur = 10; ctx.shadowColor = C(col, 1); }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = C("--accent-2", 1);
      ctx.shadowBlur = 18; ctx.shadowColor = C("--accent-2", 1);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className={cn("block h-full w-full", className)} />;
}
