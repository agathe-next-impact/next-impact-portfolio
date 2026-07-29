"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { paletteSnapshot, prefersReducedMotion } from "./palette";

type Pt = { x: number; y: number };

/**
 * Topography — courbes de niveau animées (marching squares sur un champ de pics),
 * façon carte de relief de données (inspiré de artifact-topography). Indigo +
 * doré, repères + lecture de coordonnées. En reduced-motion : une trame statique.
 */
export function Topography({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
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

    const peaks = [
      { x: 0.34, y: 0.46, r: 0.22 },
      { x: 0.62, y: 0.55, r: 0.18 },
      { x: 0.78, y: 0.34, r: 0.12 },
    ];
    const GRID = 72;
    const field = new Float32Array((GRID + 1) * (GRID + 1));

    const computeField = (t: number) => {
      const p = [
        [peaks[0].x + Math.sin(t * 0.3) * 0.03, peaks[0].y + Math.cos(t * 0.25) * 0.03],
        [peaks[1].x + Math.cos(t * 0.4) * 0.04, peaks[1].y + Math.sin(t * 0.35) * 0.03],
        [peaks[2].x + Math.sin(t * 0.5) * 0.05, peaks[2].y + Math.cos(t * 0.45) * 0.04],
      ];
      for (let gy = 0; gy <= GRID; gy++) {
        for (let gx = 0; gx <= GRID; gx++) {
          const u = gx / GRID, v = gy / GRID;
          let val = 0;
          for (let k = 0; k < 3; k++) {
            val += peaks[k].r / (Math.hypot(u - p[k][0], v - p[k][1]) + 0.02);
          }
          field[gy * (GRID + 1) + gx] = val;
        }
      }
    };

    const drawContour = (threshold: number) => {
      const cw = W / GRID, ch = H / GRID;
      ctx.beginPath();
      for (let gy = 0; gy < GRID; gy++) {
        for (let gx = 0; gx < GRID; gx++) {
          const a = field[gy * (GRID + 1) + gx];
          const b = field[gy * (GRID + 1) + gx + 1];
          const c = field[(gy + 1) * (GRID + 1) + gx + 1];
          const d = field[(gy + 1) * (GRID + 1) + gx];
          let code = 0;
          if (a > threshold) code |= 1;
          if (b > threshold) code |= 2;
          if (c > threshold) code |= 4;
          if (d > threshold) code |= 8;
          if (code === 0 || code === 15) continue;
          const lerp = (v1: number, v2: number) => (threshold - v1) / (v2 - v1 + 1e-9);
          const x = gx * cw, y = gy * ch;
          const top: Pt = { x: x + lerp(a, b) * cw, y };
          const right: Pt = { x: x + cw, y: y + lerp(b, c) * ch };
          const bottom: Pt = { x: x + lerp(d, c) * cw, y: y + ch };
          const left: Pt = { x, y: y + lerp(a, d) * ch };
          const segs: Record<number, Pt[]> = {
            1: [left, top], 2: [top, right], 3: [left, right], 4: [right, bottom],
            6: [top, bottom], 7: [left, bottom], 8: [left, bottom], 9: [top, bottom],
            11: [right, bottom], 12: [left, right], 13: [top, right], 14: [left, top],
            5: [left, top, right, bottom], 10: [top, right, left, bottom],
          };
          const seg = segs[code];
          if (!seg) continue;
          for (let i = 0; i < seg.length; i += 2) {
            ctx.moveTo(seg[i].x, seg[i].y);
            ctx.lineTo(seg[i + 1].x, seg[i + 1].y);
          }
        }
      }
      ctx.stroke();
    };

    const levels = [1.0, 1.4, 1.9, 2.5, 3.3, 4.4, 6.0, 8.5, 12.0];

    const render = (now: number) => {
      const C = paletteSnapshot();
      ctx.fillStyle = C("--obsidian", 1);
      ctx.fillRect(0, 0, W, H);
      computeField(now);

      for (let i = 0; i < levels.length; i++) {
        const alpha = 0.08 + (i / levels.length) * 0.32;
        const hi = i >= levels.length - 2;
        ctx.strokeStyle = hi ? C("--accent-2", alpha + 0.18) : C("--accent", alpha);
        ctx.lineWidth = hi ? 1.2 : 0.8;
        drawContour(levels[i]);
      }

      for (let i = 0; i < peaks.length; i++) {
        const px = peaks[i].x * W, py = peaks[i].y * H;
        const pulse = 0.5 + 0.5 * Math.sin(now * 2 + i);
        const col = i === 0 ? "--accent-2" : "--accent";
        ctx.beginPath();
        ctx.arc(px, py, 5 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = C(col, 1);
        ctx.shadowBlur = 12; ctx.shadowColor = C(col, 1);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = C("--mid-gray", 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - 11, py); ctx.lineTo(px + 11, py);
        ctx.moveTo(px, py - 11); ctx.lineTo(px, py + 11);
        ctx.stroke();
      }

      ctx.font = '10px ui-monospace, monospace';
      ctx.fillStyle = C("--accent", 0.5);
      const lat = (48.8 + Math.sin(now * 0.5) * 0.05).toFixed(4);
      const lng = (2.35 + Math.cos(now * 0.4) * 0.05).toFixed(4);
      ctx.fillText(`LAT ${lat}°N`, 18, H - 30);
      ctx.fillText(`LNG ${lng}°E`, 18, H - 16);
    };

    let raf = 0;
    const frame = (t: number) => {
      render(t / 1000);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    if (reduce) render(0);
    else raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className={cn("block h-full w-full", className)} />;
}
