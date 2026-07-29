// Variation 2: FIBER CABLES — bezier curves with light pulses traveling.
// Evokes: fiber optics, cables, interconnexion filaire, transmission.

function FiberArtifact({ accent = BRAND.blue }) {
  const svgRef = React.useRef(null);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const loop = () => { setTick(t => (t + 1) % 10000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Define cable paths: curves from left/right edges converging toward a right-of-center hub
  const W = 1440, H = 820;
  const hub = { x: W * 0.68, y: H * 0.48 };
  const rnd = (s) => { let x = Math.sin(s*12.9898)*43758.5453; return x - Math.floor(x); };

  const cables = React.useMemo(() => {
    const arr = [];
    // Left bundle
    for (let i = 0; i < 9; i++) {
      const yStart = 80 + i * 80 + (i%2) * 20;
      const c1x = 200 + rnd(i+1) * 180;
      const c1y = yStart + (rnd(i+2)-0.5) * 120;
      const c2x = hub.x - 260 - rnd(i+3) * 160;
      const c2y = hub.y + (rnd(i+4)-0.5) * 220;
      arr.push({
        id: `L${i}`,
        d: `M -20 ${yStart} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${hub.x} ${hub.y + (rnd(i+5)-0.5)*30}`,
        delay: rnd(i+6) * 3,
        dur: 2.5 + rnd(i+7) * 2,
        hue: rnd(i+8) < 0.8 ? 'blue' : 'amber',
        width: 1 + rnd(i+9) * 0.6,
      });
    }
    // Bottom bundle
    for (let i = 0; i < 5; i++) {
      const xStart = 200 + i * 180;
      arr.push({
        id: `B${i}`,
        d: `M ${xStart} ${H+20} C ${xStart + 100} ${H - 200}, ${hub.x - 100} ${hub.y + 240}, ${hub.x} ${hub.y + 30}`,
        delay: rnd(i+20) * 3,
        dur: 3 + rnd(i+21) * 2,
        hue: rnd(i+22) < 0.85 ? 'blue' : 'amber',
        width: 1 + rnd(i+23) * 0.6,
      });
    }
    // Right bundle (short)
    for (let i = 0; i < 4; i++) {
      const yStart = 150 + i * 140;
      arr.push({
        id: `R${i}`,
        d: `M ${W+20} ${yStart} C ${W - 100} ${yStart + 40}, ${hub.x + 160} ${hub.y + (i-2)*60}, ${hub.x} ${hub.y + (i-1)*12}`,
        delay: rnd(i+40) * 2,
        dur: 2 + rnd(i+41) * 1.5,
        hue: 'blue',
        width: 1,
      });
    }
    return arr;
  }, []);

  const t = tick / 60; // seconds
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="hubGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1"/>
          <stop offset="10%" stopColor={BRAND.blueHi} stopOpacity="0.9"/>
          <stop offset="45%" stopColor={BRAND.blue} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={BRAND.blue} stopOpacity="0"/>
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="heavyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Base cables — faint */}
      {cables.map(c => (
        <path key={c.id+'-b'} d={c.d} fill="none"
          stroke={c.hue === 'blue' ? 'rgba(79, 163, 227, 0.18)' : 'rgba(245, 165, 36, 0.22)'}
          strokeWidth={c.width}/>
      ))}

      {/* Animated pulses — CSS dashoffset */}
      {cables.map(c => {
        const dur = c.dur;
        const delay = c.delay;
        const phase = ((t + delay) % dur) / dur;
        const color = c.hue === 'blue' ? BRAND.blueHi : BRAND.amberHi;
        return (
          <g key={c.id+'-p'} filter="url(#glow)">
            <path d={c.d} fill="none" stroke={color} strokeWidth={c.width + 0.5}
              strokeLinecap="round"
              strokeDasharray="60 2000"
              strokeDashoffset={-phase * 2060 + 60}
              opacity={0.95}/>
          </g>
        );
      })}

      {/* Hub glow */}
      <circle cx={hub.x} cy={hub.y} r="200" fill="url(#hubGlow)"/>

      {/* Hub hexagon */}
      <g filter="url(#heavyGlow)" transform={`translate(${hub.x}, ${hub.y})`}>
        <polygon points={hexPts(48)} fill="none" stroke={BRAND.white} strokeWidth="1.5" opacity="0.9"/>
        <polygon points={hexPts(68)} fill="none" stroke={BRAND.blueHi} strokeWidth="1" opacity="0.5"
          transform={`rotate(${(t * 8) % 360})`}/>
        <polygon points={hexPts(32)} fill={BRAND.white} opacity={0.85 + Math.sin(t*3)*0.15}/>
        <circle cx="0" cy="0" r="6" fill={BRAND.amber}/>
      </g>

      {/* Tick markers on hub */}
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = 90, r2 = 98;
        return (
          <line key={i}
            x1={hub.x + Math.cos(a)*r1} y1={hub.y + Math.sin(a)*r1}
            x2={hub.x + Math.cos(a)*r2} y2={hub.y + Math.sin(a)*r2}
            stroke={BRAND.blue} strokeWidth="1" opacity={0.5 + 0.5 * Math.sin(t*2 + i)}
          />
        );
      })}
    </svg>
  );
}

function hexPts(r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${Math.cos(a) * r},${Math.sin(a) * r}`);
  }
  return pts.join(' ');
}

window.FiberArtifact = FiberArtifact;
