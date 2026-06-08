// V6 — TOPOGRAPHIE : courbes de niveau animées, vue cartographique d'un
// relief de données. Évoque cartographie réseau, couverture, territoire.

function TopographyArtifact() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      const r = cvs.getBoundingClientRect();
      W = r.width; H = r.height;
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cvs);

    // Two metaball-style peaks that animate positions
    const peaks = [
      { x: 0.35, y: 0.45, r: 0.22 },
      { x: 0.62, y: 0.55, r: 0.18 },
      { x: 0.78, y: 0.35, r: 0.12 },
    ];

    // Pre-generate sample grid
    const GRID = 120;
    const field = new Float32Array((GRID+1) * (GRID+1));
    const computeField = (t) => {
      const p0x = peaks[0].x + Math.sin(t*0.3) * 0.03;
      const p0y = peaks[0].y + Math.cos(t*0.25) * 0.03;
      const p1x = peaks[1].x + Math.cos(t*0.4) * 0.04;
      const p1y = peaks[1].y + Math.sin(t*0.35) * 0.03;
      const p2x = peaks[2].x + Math.sin(t*0.5) * 0.05;
      const p2y = peaks[2].y + Math.cos(t*0.45) * 0.04;
      for (let gy = 0; gy <= GRID; gy++) {
        for (let gx = 0; gx <= GRID; gx++) {
          const u = gx / GRID, v = gy / GRID;
          const d0 = Math.hypot(u - p0x, v - p0y);
          const d1 = Math.hypot(u - p1x, v - p1y);
          const d2 = Math.hypot(u - p2x, v - p2y);
          const val = peaks[0].r/(d0+0.02) + peaks[1].r/(d1+0.02) + peaks[2].r/(d2+0.02);
          field[gy*(GRID+1) + gx] = val;
        }
      }
    };

    // Simplified marching-squares: draw contour line for a given threshold
    const drawContour = (threshold) => {
      const cw = W / GRID, ch = H / GRID;
      ctx.beginPath();
      for (let gy = 0; gy < GRID; gy++) {
        for (let gx = 0; gx < GRID; gx++) {
          const a = field[gy*(GRID+1) + gx];
          const b = field[gy*(GRID+1) + gx+1];
          const c = field[(gy+1)*(GRID+1) + gx+1];
          const d = field[(gy+1)*(GRID+1) + gx];
          let code = 0;
          if (a > threshold) code |= 1;
          if (b > threshold) code |= 2;
          if (c > threshold) code |= 4;
          if (d > threshold) code |= 8;
          if (code === 0 || code === 15) continue;
          const lerp = (v1, v2) => (threshold - v1) / (v2 - v1 + 1e-9);
          const x = gx * cw, y = gy * ch;
          const top =    { x: x + lerp(a, b) * cw, y };
          const right =  { x: x + cw, y: y + lerp(b, c) * ch };
          const bottom = { x: x + lerp(d, c) * cw, y: y + ch };
          const left =   { x, y: y + lerp(a, d) * ch };
          const segs = {
            1: [left, top], 2: [top, right], 3: [left, right],
            4: [right, bottom], 6: [top, bottom], 7: [left, bottom],
            8: [left, bottom], 9: [top, bottom], 11: [right, bottom],
            12: [left, right], 13: [top, right], 14: [left, top],
            5: [left, top, right, bottom], // ambiguous
            10: [top, right, left, bottom],
          }[code];
          for (let i = 0; i < segs.length; i += 2) {
            ctx.moveTo(segs[i].x, segs[i].y);
            ctx.lineTo(segs[i+1].x, segs[i+1].y);
          }
        }
      }
      ctx.stroke();
    };

    let raf;
    const frame = (t) => {
      const now = t / 1000;
      ctx.fillStyle = BRAND.bgDeep;
      ctx.fillRect(0, 0, W, H);

      computeField(now);

      // Draw many contour levels
      const levels = [1.0, 1.3, 1.7, 2.2, 2.8, 3.6, 4.6, 6.0, 8.0, 11.0, 15.0];
      for (let i = 0; i < levels.length; i++) {
        const alpha = 0.08 + (i / levels.length) * 0.35;
        ctx.strokeStyle = i >= levels.length - 2
          ? `rgba(255, 210, 122, ${alpha + 0.15})`
          : `rgba(79, 163, 227, ${alpha})`;
        ctx.lineWidth = i >= levels.length - 2 ? 1.2 : 0.8;
        drawContour(levels[i]);
      }

      // Pulse from peak #0
      const pulseT = (now * 0.4) % 1;
      const pulseX = peaks[0].x * W;
      const pulseY = peaks[0].y * H;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, pulseT * 300, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(125, 211, 252, ${1 - pulseT})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Markers on peaks
      for (let i = 0; i < peaks.length; i++) {
        const p = peaks[i];
        const px = p.x * W, py = p.y * H;
        const pulse = 0.5 + 0.5 * Math.sin(now * 2 + i);
        ctx.beginPath();
        ctx.arc(px, py, 6 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? BRAND.amber : BRAND.blueHi;
        ctx.shadowBlur = 12; ctx.shadowColor = i === 0 ? BRAND.amber : BRAND.blueHi;
        ctx.fill();
        ctx.shadowBlur = 0;
        // crosshair
        ctx.strokeStyle = `rgba(244, 246, 251, 0.4)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - 12, py); ctx.lineTo(px + 12, py);
        ctx.moveTo(px, py - 12); ctx.lineTo(px, py + 12);
        ctx.stroke();
      }

      // Coordinate readout top-left
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(125, 211, 252, 0.45)';
      const lat = (48.8 + Math.sin(now*0.5) * 0.05).toFixed(4);
      const lng = (2.35 + Math.cos(now*0.4) * 0.05).toFixed(4);
      ctx.fillText(`LAT ${lat}°N`, 24, H - 44);
      ctx.fillText(`LNG ${lng}°E`, 24, H - 28);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }}/>;
}

window.TopographyArtifact = TopographyArtifact;
