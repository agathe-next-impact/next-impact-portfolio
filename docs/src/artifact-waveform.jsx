// V5 — WAVEFORM : spectre de fréquences et forme d'onde animée,
// scanlines horizontales, évoque transmission radio/signal.

function WaveformArtifact() {
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

    // Spectrum bars
    const N_BARS = 96;
    const barSeeds = Array.from({length: N_BARS}, (_, i) => ({
      freq1: 0.5 + Math.random() * 2,
      freq2: 1 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      amp: 0.3 + Math.random() * 0.7,
    }));

    let raf;
    const frame = (t) => {
      const now = t / 1000;
      // Dark background with trail fade
      ctx.fillStyle = 'rgba(5, 10, 23, 0.25)';
      ctx.fillRect(0, 0, W, H);

      // Horizontal center line
      const midY = H * 0.5;
      ctx.strokeStyle = 'rgba(79, 163, 227, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();

      // Spectrum bars (mirrored above and below center)
      const barArea = W * 0.96;
      const barSpace = barArea / N_BARS;
      const barW = Math.max(2, barSpace * 0.55);
      const startX = (W - barArea) / 2;

      for (let i = 0; i < N_BARS; i++) {
        const s = barSeeds[i];
        const v = (Math.sin(now * s.freq1 + s.phase) * 0.5 + 0.5) *
                  (Math.sin(now * s.freq2 + s.phase * 1.3) * 0.3 + 0.7) * s.amp;
        const h = v * H * 0.28;
        const x = startX + i * barSpace + (barSpace - barW) / 2;

        // Gradient top half
        const grad1 = ctx.createLinearGradient(0, midY - h, 0, midY);
        grad1.addColorStop(0, `rgba(125, 211, 252, ${0.9 * v + 0.1})`);
        grad1.addColorStop(1, 'rgba(79, 163, 227, 0.15)');
        ctx.fillStyle = grad1;
        ctx.fillRect(x, midY - h, barW, h);

        // Gradient bottom half
        const grad2 = ctx.createLinearGradient(0, midY, 0, midY + h);
        grad2.addColorStop(0, 'rgba(79, 163, 227, 0.15)');
        grad2.addColorStop(1, `rgba(79, 163, 227, ${0.4 * v})`);
        ctx.fillStyle = grad2;
        ctx.fillRect(x, midY, barW, h * 0.7);

        // Top cap amber when loud
        if (v > 0.7) {
          ctx.fillStyle = BRAND.amber;
          ctx.shadowBlur = 8; ctx.shadowColor = BRAND.amber;
          ctx.fillRect(x, midY - h - 2, barW, 2);
          ctx.shadowBlur = 0;
        }
      }

      // Main waveform — smooth line
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const u = x / W;
        const y = midY
          + Math.sin(u * 18 - now * 2.4) * 70 * (0.5 + 0.5 * Math.sin(now * 0.6 + u * 6))
          + Math.sin(u * 40 - now * 3.1) * 18
          + Math.sin(u * 90 + now * 4) * 6;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = BRAND.blueHi;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 14; ctx.shadowColor = BRAND.blueHi;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary waveform — amber, offset
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const u = x / W;
        const y = midY + 40
          + Math.sin(u * 12 - now * 1.8 + 1.2) * 30
          + Math.sin(u * 60 - now * 2.5) * 8;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(245, 165, 36, 0.7)`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8; ctx.shadowColor = BRAND.amber;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Vertical playhead
      const phX = ((now * 0.08) % 1) * W;
      ctx.strokeStyle = 'rgba(255, 210, 122, 0.4)';
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(phX, 0); ctx.lineTo(phX, H); ctx.stroke();
      ctx.setLineDash([]);

      // Frequency labels (monospace)
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(125, 211, 252, 0.4)';
      const freqs = ['0 Hz', '2.4 GHz', '5.0 GHz', '6.8 GHz', '12 GHz', '24 GHz'];
      for (let i = 0; i < freqs.length; i++) {
        const x = startX + (i / (freqs.length-1)) * barArea;
        ctx.fillText(freqs[i], x - 20, midY + H * 0.3 + 18);
      }

      // dB scale left
      for (let i = 0; i <= 4; i++) {
        const y = midY - H * 0.28 + (i / 4) * H * 0.28;
        ctx.fillText(`${-i * 6} dB`, 16, y + 3);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }}/>;
}

window.WaveformArtifact = WaveformArtifact;
