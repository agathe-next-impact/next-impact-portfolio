// Variation 12: SONAR — radar sweep rotating over a field of network nodes.
// Evokes: live supervision, monitoring, detection, NOC.

function SonarArtifact({ accent = BRAND.blue }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, cx = 0, cy = 0, RAD = 300, nodes = [];
    const build = () => {
      nodes = Array.from({ length: 70 }, () => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * RAD * 0.95;
        return { a, r, seed: Math.random(), lit: 0, amber: Math.random() > 0.85 };
      });
    };
    const resize = () => {
      const r = cvs.getBoundingClientRect();
      W = r.width; H = r.height;
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W * 0.56; cy = H * 0.5; RAD = Math.min(W, H) * 0.42;
      build();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cvs);

    let raf, t0 = performance.now();
    const SWEEP = 0.7; // rad/s
    const frame = (t) => {
      const dt = Math.min(33, t - t0) / 16.666; t0 = t;
      const now = t / 1000;
      ctx.fillStyle = 'rgba(5, 10, 23, 0.22)';
      ctx.fillRect(0, 0, W, H);

      const beam = (now * SWEEP) % (Math.PI * 2);

      ctx.save();
      ctx.translate(cx, cy);

      // range rings
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (RAD / 4) * i, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(79, 163, 227, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // cross hairs
      ctx.strokeStyle = 'rgba(79, 163, 227, 0.08)';
      ctx.beginPath(); ctx.moveTo(-RAD, 0); ctx.lineTo(RAD, 0);
      ctx.moveTo(0, -RAD); ctx.lineTo(0, RAD); ctx.stroke();

      // sweep wedge (gradient trailing the beam)
      const trail = 0.9;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, RAD);
      grad.addColorStop(0, 'rgba(125, 211, 252, 0.0)');
      grad.addColorStop(1, 'rgba(125, 211, 252, 0.20)');
      for (let k = 0; k < 1; k += 0.04) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, RAD, beam - trail * k - 0.02, beam - trail * k);
        ctx.closePath();
        ctx.fillStyle = `rgba(125, 211, 252, ${0.10 * (1 - k)})`;
        ctx.fill();
      }
      // leading beam line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(beam) * RAD, Math.sin(beam) * RAD);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(125,211,252,0.9)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // nodes — light up when the beam passes
      for (const n of nodes) {
        let diff = ((beam - n.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.18) n.lit = 1;
        n.lit *= Math.pow(0.985, dt);
        const x = Math.cos(n.a) * n.r, y = Math.sin(n.a) * n.r;
        const base = 0.18 + 0.1 * Math.sin(now + n.seed * 20);
        const lit = Math.max(base, n.lit);
        const [r, g, b] = n.amber ? [245, 165, 36] : [125, 211, 252];
        if (n.lit > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, 10 * n.lit, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${n.lit * 0.18})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, 2 + n.lit * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${lit})`;
        if (n.lit > 0.3) { ctx.shadowBlur = 10; ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`; }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // center hub
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = BRAND.amber;
      ctx.shadowBlur = 18; ctx.shadowColor = BRAND.amber;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }}/>;
}

window.SonarArtifact = SonarArtifact;
