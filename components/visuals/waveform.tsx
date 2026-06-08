"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { paletteSnapshot, prefersReducedMotion } from "./palette";

/**
 * Waveform — spectre de fréquences + formes d'onde animées avec rémanence
 * (inspiré de artifact-waveform). Champagne (onde) + indigo (spectre) + doré
 * (pics). Tech + artistique. En reduced-motion : une trame statique.
 */
export function Waveform({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = prefersReducedMotion();

    let W = 0, H = 0;
    const resize = () => {
      const r = cvs.getBoundingClientRect();
      W = r.width; H = r.height;
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    const N = 80;
    const seeds = Array.from({ length: N }, () => ({
      f1: 0.5 + Math.random() * 2,
      f2: 1 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      amp: 0.3 + Math.random() * 0.7,
    }));

    const render = (now: number, fade: boolean) => {
      const C = paletteSnapshot();
      ctx.fillStyle = fade ? C("--obsidian", 0.25) : C("--obsidian", 1);
      ctx.fillRect(0, 0, W, H);
      const midY = H * 0.5;

      ctx.strokeStyle = C("--accent", 0.1);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();

      const barArea = W * 0.96, barSpace = barArea / N, barW = Math.max(2, barSpace * 0.5), startX = (W - barArea) / 2;
      for (let i = 0; i < N; i++) {
        const s = seeds[i];
        const v = (Math.sin(now * s.f1 + s.phase) * 0.5 + 0.5) *
          (Math.sin(now * s.f2 + s.phase * 1.3) * 0.3 + 0.7) * s.amp;
        const h = v * H * 0.28;
        const x = startX + i * barSpace + (barSpace - barW) / 2;
        const g1 = ctx.createLinearGradient(0, midY - h, 0, midY);
        g1.addColorStop(0, C("--accent-champagne", Math.min(1, 0.9 * v + 0.1)));
        g1.addColorStop(1, C("--accent", 0.15));
        ctx.fillStyle = g1;
        ctx.fillRect(x, midY - h, barW, h);
        const g2 = ctx.createLinearGradient(0, midY, 0, midY + h);
        g2.addColorStop(0, C("--accent", 0.15));
        g2.addColorStop(1, C("--accent", 0.4 * v));
        ctx.fillStyle = g2;
        ctx.fillRect(x, midY, barW, h * 0.7);
        if (v > 0.7) {
          ctx.fillStyle = C("--accent-2", 1);
          ctx.shadowBlur = 8; ctx.shadowColor = C("--accent-2", 1);
          ctx.fillRect(x, midY - h - 2, barW, 2);
          ctx.shadowBlur = 0;
        }
      }

      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const u = x / W;
        const y = midY
          + Math.sin(u * 18 - now * 2.4) * 70 * (0.5 + 0.5 * Math.sin(now * 0.6 + u * 6))
          + Math.sin(u * 40 - now * 3.1) * 18
          + Math.sin(u * 90 + now * 4) * 6;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = C("--accent-champagne", 1);
      ctx.lineWidth = 2;
      ctx.shadowBlur = 14; ctx.shadowColor = C("--accent-champagne", 0.9);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const u = x / W;
        const y = midY + 40 + Math.sin(u * 12 - now * 1.8 + 1.2) * 30 + Math.sin(u * 60 - now * 2.5) * 8;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = C("--accent-2", 0.7);
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8; ctx.shadowColor = C("--accent-2", 1);
      ctx.stroke();
      ctx.shadowBlur = 0;

      const phX = ((now * 0.08) % 1) * W;
      ctx.strokeStyle = C("--accent-2", 0.4);
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(phX, 0); ctx.lineTo(phX, H); ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '10px ui-monospace, monospace';
      ctx.fillStyle = C("--accent", 0.4);
      const freqs = ["0 Hz", "2.4 GHz", "5.0 GHz", "6.8 GHz", "12 GHz", "24 GHz"];
      for (let i = 0; i < freqs.length; i++) {
        const x = startX + (i / (freqs.length - 1)) * barArea;
        ctx.fillText(freqs[i], x - 18, midY + H * 0.3 + 16);
      }
    };

    let raf = 0;
    const frame = (t: number) => {
      render(t / 1000, true);
      raf = requestAnimationFrame(frame);
    };
    if (reduce) render(1.2, false);
    else raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className={cn("block h-full w-full", className)} />;
}
