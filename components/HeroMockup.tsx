"use client";

import { useEffect, useState, type ReactNode } from "react";

function useCountUp(target: number, duration = 1000, delay = 0) {
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

/**
 * HeroMockup — cadre « navigateur » blueprint (sans arrondi). Le contenu est un
 * slot : passez une preview (`children`) pour l'intégrer dynamiquement à
 * dimensions réduites ; sinon, une maquette animée placeholder s'affiche.
 */
export default function HeroMockup({
  children,
  url = "nextimpact.fr",
}: {
  children?: ReactNode;
  url?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden border border-dark-gray bg-jet">
      {/* Chrome navigateur */}
      <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-dark-gray bg-obsidian px-3.5 py-2.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[7px] w-[7px] rounded-full border border-charcoal" />
          ))}
        </div>
        <div className="flex flex-1 items-center gap-1.5 border border-dark-gray bg-jet px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2a7a2a]" />
          <span className="font-mono text-[10px] tracking-[0.04em] text-mid-gray">{url}</span>
        </div>
      </div>

      {/* Slot de contenu */}
      {children ? (
        <div className="relative w-full flex-1 overflow-hidden">{children}</div>
      ) : (
        <MockupPlaceholder />
      )}
    </div>
  );
}

function MockupPlaceholder() {
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
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-5 pt-[18px]">
        {/* Nav */}
        <div
          className="mb-5 flex items-center gap-2.5 border-b border-dark-gray pb-3.5"
          style={fade(phase >= 1)}
        >
          <span className="h-3.5 w-3.5 shrink-0 bg-foreground" />
          <div className="flex flex-1 gap-2.5">
            {[52, 40, 36, 44].map((w, i) => (
              <span key={i} className="h-[5px] bg-mid-gray/50" style={{ width: w }} />
            ))}
          </div>
          <span className="h-4 w-11 bg-foreground" />
        </div>

        {/* Titre */}
        <div className="mb-3.5" style={fade(phase >= 2)}>
          <div className="mb-2.5 text-[20px] leading-[1.15] text-foreground">
            Sites WordPress<br />
            <span className="text-accent-secondary">ultra rapides.</span>
          </div>
          <div className="mb-3.5 flex flex-col gap-[5px]">
            {[100, 85, 55].map((w, i) => (
              <span key={i} className="h-1 bg-dark-gray" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="flex gap-[7px]">
            <span className="h-[18px] w-[72px] bg-foreground" />
            <span className="h-[18px] w-[60px] border border-dark-gray" />
          </div>
        </div>

        {/* Stack */}
        <div style={fade(phase >= 3)}>
          <div className="flex flex-col gap-[3px] font-mono text-[9px] tracking-[0.08em] text-mid-gray">
            <span><span className="text-[#2a7a2a]">✓</span> WordPress Headless · API REST</span>
            <span><span className="text-[#2a7a2a]">✓</span> Next.js · SSG / ISR · TypeScript</span>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div
        className="mt-[18px] grid grid-cols-4 border-t border-dark-gray"
        style={fade(phase >= 4)}
      >
        {[
          { label: "Perf", value: perf, highlight: true, lcp: undefined as number | undefined },
          { label: "SEO", value: seo, highlight: false, lcp: undefined as number | undefined },
          { label: "A11y", value: a11y, highlight: false, lcp: undefined as number | undefined },
          { label: "LCP", value: null as number | null, highlight: false, lcp },
        ].map((s, i) => (
          <div
            key={s.label}
            className={i < 3 ? "border-r border-dark-gray px-2 py-3 text-center" : "px-2 py-3 text-center"}
          >
            <div
              className={s.highlight ? "text-accent-secondary" : "text-foreground"}
              style={{
                fontFamily: "var(--mono)",
                fontSize: s.lcp !== undefined ? 16 : 22,
                lineHeight: 1,
                marginBottom: 4,
                letterSpacing: s.lcp !== undefined ? "0.02em" : "0",
              }}
            >
              {s.lcp !== undefined ? `0.${String(s.lcp).padStart(2, "0")}s` : s.value}
            </div>
            <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-mid-gray">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
