"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Animation « du code au site » — un éditeur écrit du code, qui se compile puis
 * révèle le site réel embarqué (iframe live, pas une copie) à son URL.
 * L'animation se joue une fois puis reste sur le site en direct. Respecte
 * prefers-reduced-motion (affiche directement le site). La coloration et le
 * chrome sont autonomes ; seul l'aperçu charge une ressource externe (le site).
 */

type Phase = "typing" | "build" | "preview";

const CODE = `import { fetchEvents } from "@/lib/api"

export default async function EventsPage() {
  const events = await fetchEvents()

  return (
    <EventGrid>
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </EventGrid>
  )
}`;

// ─── Coloration syntaxique minimale ──────────────────────────────────────────
const TOKEN_RE =
  /(\/\/[^\n]*)|("[^"]*"|'[^']*'|`[^`]*`)|\b(import|from|export|default|async|function|return|const|await|new)\b|(<\/?[A-Za-z][A-Za-z0-9]*)|(=>|[{}()<>;,.=])|([A-Za-z_$][\w$]*)|(\s+)/g;

function colorFor(match: RegExpExecArray): string {
  if (match[1]) return "#5c6a82"; // commentaire
  if (match[2]) return "#c3e88d"; // chaîne
  if (match[3]) return "#c792ea"; // mot-clé
  if (match[4]) return "#7ee787"; // balise / composant JSX
  if (match[5]) return "#89ddff"; // ponctuation
  if (match[6]) return /^[A-Z]/.test(match[6]) ? "#ffcb6b" : "#d6deeb"; // identifiant
  return "#d6deeb";
}

function Highlighted({ text }: { text: string }) {
  const parts: { v: string; c: string }[] = [];
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let last = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > last) parts.push({ v: text.slice(last, m.index), c: "#d6deeb" });
    parts.push({ v: m[0], c: colorFor(m) });
    last = m.index + m[0].length;
    if (m.index === TOKEN_RE.lastIndex) TOKEN_RE.lastIndex++;
  }
  if (last < text.length) parts.push({ v: text.slice(last), c: "#d6deeb" });
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.c }}>
          {p.v}
        </span>
      ))}
    </>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────
export function CodeToSite({
  url = "next-event.fr",
  src = "https://www.next-event.fr/",
}: {
  url?: string;
  src?: string;
}) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [shown, setShown] = useState(0);
  const mounted = useRef(true);

  // Mesure du conteneur pour rendre l'iframe en 1280px puis la réduire à l'échelle.
  const bodyRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    mounted.current = true;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setShown(CODE.length);
      setPhase("preview");
      return () => {
        mounted.current = false;
      };
    }

    let interval: number | undefined;
    setPhase("typing");
    setShown(0);
    let i = 0;
    interval = window.setInterval(() => {
      if (!mounted.current) return window.clearInterval(interval);
      i += 2;
      if (i >= CODE.length) {
        setShown(CODE.length);
        window.clearInterval(interval);
        window.setTimeout(() => mounted.current && setPhase("build"), 450);
        window.setTimeout(() => mounted.current && setPhase("preview"), 1500);
      } else {
        setShown(i);
      }
    }, 16);

    return () => {
      mounted.current = false;
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const visible = CODE.slice(0, shown);
  const lines = visible.split("\n");
  const isLive = phase === "preview";

  // 1280px de large en résolution logique, réduit pour tenir dans le cadre.
  const scale = box.w ? box.w / 1280 : 0;
  const iframeStyle: CSSProperties = scale
    ? {
        width: 1280,
        height: box.h / scale,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }
    : { width: "100%", height: "100%" };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#0b1120] font-sans">
      {/* Chrome navigateur — barre d'URL constante */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#0d1424] px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 transition-colors hover:bg-white/10"
          title={`Ouvrir ${url}`}
        >
          <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
            <path d="M4 5V4a2 2 0 1 1 4 0v1" fill="none" stroke="#7ee787" strokeWidth="1.1" />
            <rect x="2.5" y="5" width="7" height="5" rx="1" fill="#7ee787" opacity="0.9" />
          </svg>
          <span className="truncate font-mono text-[9px] text-white/70">https://{url}</span>
        </a>
        <span
          className={`font-mono text-[8px] uppercase tracking-wide transition-colors ${
            isLive ? "text-[#28c840]" : "text-white/40"
          }`}
        >
          {isLive ? "● live" : phase === "build" ? "build…" : "dev"}
        </span>
      </div>

      {/* Corps : code ↔ site réel embarqué (fondu enchaîné) */}
      <div ref={bodyRef} className="relative flex-1 overflow-hidden">
        {/* Site réel — rendu en 1280px puis réduit ; chargé dès le montage */}
        <iframe
          src={src}
          title={`Aperçu en direct de ${url}`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="no-referrer"
          style={iframeStyle}
          className={`absolute left-0 top-0 border-0 bg-white transition-opacity duration-500 ${
            isLive ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        {/* Éditeur de code (au-dessus tant qu'on n'est pas en live) */}
        <div
          className={`absolute inset-0 overflow-hidden bg-[#0b1120] px-3 py-2.5 transition-opacity duration-500 ${
            isLive ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden={isLive}
        >
          <pre className="whitespace-pre font-mono text-[9.5px] leading-[1.5] text-[#d6deeb]">
            {lines.map((line, i) => (
              <div key={i} className="min-h-[1.5em]">
                <Highlighted text={line} />
                {phase === "typing" && i === lines.length - 1 && (
                  <span className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-[#89ddff]" />
                )}
              </div>
            ))}
          </pre>

          {/* Overlay de build */}
          {phase === "build" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0b1120]/70 backdrop-blur-[1px]">
              <span className="font-mono text-[10px] text-[#7ee787]">▲ next build</span>
              <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 animate-[buildbar_1s_ease-in-out_infinite] rounded-full bg-[#2563eb]" />
              </div>
              <span className="font-mono text-[8px] text-white/50">Déploiement…</span>
            </div>
          )}
        </div>
      </div>

      {/* Keyframes locales pour la barre de build */}
      <style>{`
        @keyframes buildbar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(360%); }
        }
      `}</style>
    </div>
  );
}
