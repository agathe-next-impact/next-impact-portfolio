"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 1000, delay = 0) {
  // Jamais 0 au chargement : valeur réelle d'emblée, animation depuis un
  // plancher non-nul (60 % de la cible). Une preuve ne doit pas ressembler
  // à un état vide.
  const [value, setValue] = useState(target);
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    const from = Math.round(target * 0.6);
    setValue(from);
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(from + eased * (target - from)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

export default function HeroMockup() {
  const [phase, setPhase] = useState(0);
  const perf = useCountUp(99, 1000, 900);
  const seo = useCountUp(100, 900, 1100);
  const a11y = useCountUp(95, 900, 1300);
  const lcp = useCountUp(34, 700, 1500);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 850);
    const t4 = setTimeout(() => setPhase(4), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const fade = (active: boolean, delay = "0s") => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(6px)",
    transition: `opacity 0.4s ${delay}, transform 0.4s ${delay}`,
  });

  return (
    <div style={{
      border: "1px solid var(--rule)",
      background: "var(--paper)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── Browser chrome ── */}
      <div style={{
        background: "var(--paper-2)",
        borderBottom: "1px solid var(--rule)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 7, height: 7,
              border: "1px solid var(--rule-strong)",
              borderRadius: "50%",
            }} />
          ))}
        </div>
        <div style={{
          flex: 1,
          background: "var(--paper)",
          border: "1px solid var(--rule)",
          padding: "4px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <div style={{ width: 6, height: 6, background: "#2a7a2a", borderRadius: "50%", flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--muted-color)",
            letterSpacing: "0.04em",
          }}>
            nextimpact.fr
          </span>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ padding: "18px 20px 0", flex: 1 }}>

        {/* Nav */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingBottom: 14,
          borderBottom: "1px solid var(--rule)",
          marginBottom: 20,
          ...fade(phase >= 1),
        }}>
          <div style={{ width: 14, height: 14, background: "var(--ink)", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", gap: 10 }}>
            {[52, 40, 36, 44].map((w, i) => (
              <div key={i} style={{ width: w, height: 5, background: "var(--rule-strong)" }} />
            ))}
          </div>
          <div style={{ width: 44, height: 16, background: "var(--ink)" }} />
        </div>

        {/* Hero heading */}
        <div style={{ ...fade(phase >= 2), marginBottom: 14 }}>
          <div style={{
            fontFamily: "var(--serif)",
            fontSize: 20,
            lineHeight: 1.15,
            color: "var(--ink)",
            marginBottom: 10,
          }}>
            Sites WordPress<br />
            <em style={{ color: "var(--ink)" }}>ultra rapides.</em>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
            {[100, 85, 55].map((w, i) => (
              <div key={i} style={{ width: `${w}%`, height: 4, background: "var(--rule)" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <div style={{ width: 72, height: 18, background: "var(--ink)" }} />
            <div style={{ width: 60, height: 18, border: "1px solid var(--rule)" }} />
          </div>
        </div>

        {/* Stack trace */}
        <div style={{ ...fade(phase >= 3), marginBottom: 0 }}>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.08em",
            color: "var(--muted-color)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}>
            <span><span style={{ color: "#2a7a2a" }}>✓</span> WordPress Headless · API REST</span>
            <span><span style={{ color: "#2a7a2a" }}>✓</span> Next.js 15 · SSG / ISR · TypeScript</span>
          </div>
        </div>
      </div>

      {/* ── Scores bar ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        borderTop: "1px solid var(--rule)",
        marginTop: 18,
        ...fade(phase >= 4),
      }}>
        {[
          { label: "Perf", value: perf, highlight: true },
          { label: "SEO", value: seo, highlight: false },
          { label: "A11y", value: a11y, highlight: false },
          { label: "LCP", value: null, lcp: lcp, highlight: false },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: "12px 8px",
            borderRight: i < 3 ? "1px solid var(--rule)" : "none",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: s.lcp !== undefined ? 16 : 22,
              lineHeight: 1,
              color: s.highlight ? "var(--accent-color)" : "var(--ink)",
              marginBottom: 4,
              letterSpacing: s.lcp !== undefined ? "0.02em" : "0",
            }}>
              {s.lcp !== undefined
                ? `0.${String(s.lcp).padStart(2, "0")}s`
                : s.value}
            </div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 7,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
