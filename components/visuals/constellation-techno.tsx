"use client";

import { cn } from "@/lib/utils";

/**
 * ConstellationTechno — visuel héro « Conseil techno web · IA ».
 *
 * Un cœur « PROJET WEB » entouré de 6 nœuds (l'éventail de réponses : NO CODE,
 * IA CODE, HEADLESS, APP, SaaS, WP/SEO) et de 3 contraintes qui clignotent
 * (BUDGET, MAINTENANCE, BESOIN) — la métaphore du conseil : on choisit la bonne
 * techno selon les contraintes.
 *
 * 100 % theme-aware : aucune couleur en dur, tout passe par les tokens
 * sémantiques (`--obsidian`/`--jet`/`--dark-gray`/`--mid-gray`/`--foreground`/
 * `--accent-2`). Le même SVG rend donc en sombre ET en clair sans condition.
 * En sombre `--accent-2` (≈ periwinkle) reproduit le bleu d'origine ; en clair
 * il devient un bleu moyen lisible sur fond papier.
 *
 * Animations en CSS pur : automatiquement neutralisées par le garde-fou global
 * `prefers-reduced-motion` de `globals.css` (toutes les keyframes finissent sur
 * un état stable et visible). Décoratif → `aria-hidden`.
 */
export function ConstellationTechno({
  className,
  showTags = true,
}: {
  className?: string;
  showTags?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden bg-obsidian",
        className,
      )}
      style={{
        aspectRatio: "1000 / 660",
        fontFamily: "var(--font-mono), ui-monospace, monospace",
      }}
    >
      <style>{CT_KEYFRAMES}</style>

      <svg
        viewBox="0 0 1000 660"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          {/* Vignette de fond : centre légèrement relevé (jet) → bords (obsidian). */}
          <radialGradient id="ct-bg" cx="500" cy="320" r="600" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--jet))" />
            <stop offset="0.55" stopColor="hsl(var(--obsidian))" />
            <stop offset="1" stopColor="hsl(var(--obsidian))" />
          </radialGradient>
          <radialGradient id="ct-radar" cx="500" cy="330" r="118" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--accent-2))" stopOpacity="0.28" />
            <stop offset="1" stopColor="hsl(var(--accent-2))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ct-coreglow" cx="500" cy="330" r="170" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="hsl(var(--accent-2))" stopOpacity="0.30" />
            <stop offset="1" stopColor="hsl(var(--accent-2))" stopOpacity="0" />
          </radialGradient>
          <filter id="ct-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <clipPath id="ct-coreclip">
            <circle cx="500" cy="330" r="118" />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="1000" height="660" fill="url(#ct-bg)" />

        {/* Toile radiale très faible, en rotation lente */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "ct-spin 120s linear infinite",
            opacity: 0.5,
          }}
        >
          <g style={{ stroke: "hsl(var(--accent-2))", strokeOpacity: 0.08, fill: "none" }}>
            <circle cx="500" cy="330" r="150" />
            <circle cx="500" cy="330" r="230" />
            <circle cx="500" cy="330" r="305" />
            <circle cx="500" cy="330" r="385" strokeDasharray="2 9" />
            <circle cx="500" cy="330" r="470" strokeDasharray="2 9" />
          </g>
          <g style={{ stroke: "hsl(var(--accent-2))", strokeOpacity: 0.05 }}>
            <line x1="500" y1="-150" x2="500" y2="810" />
            <line x1="44" y1="74" x2="956" y2="586" />
            <line x1="956" y1="74" x2="44" y2="586" />
            <line x1="20" y1="330" x2="980" y2="330" />
          </g>
        </g>

        {/* Étoiles scintillantes */}
        <g style={{ fill: "hsl(var(--accent-2))" }}>
          <circle cx="150" cy="120" r="1.6" style={{ animation: "ct-twinkle 4s ease-in-out infinite" }} />
          <circle cx="880" cy="560" r="1.6" style={{ animation: "ct-twinkle 5s ease-in-out infinite", animationDelay: "-1s" }} />
          <circle cx="120" cy="540" r="1.4" style={{ animation: "ct-twinkle 6s ease-in-out infinite", animationDelay: "-2s" }} />
          <circle cx="900" cy="120" r="1.4" style={{ animation: "ct-twinkle 4.5s ease-in-out infinite", animationDelay: "-3s" }} />
          <circle cx="60" cy="300" r="1.3" style={{ animation: "ct-twinkle 5.5s ease-in-out infinite", animationDelay: "-1.5s" }} />
        </g>

        {/* Orbites pointillées */}
        <circle
          cx="500"
          cy="330"
          r="285"
          style={{
            fill: "none",
            stroke: "hsl(var(--accent-2))",
            strokeOpacity: 0.16,
            strokeDasharray: "1 14",
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "ct-spin 60s linear infinite",
          }}
        />
        <circle
          cx="500"
          cy="330"
          r="200"
          style={{
            fill: "none",
            stroke: "hsl(var(--accent-2))",
            strokeOpacity: 0.12,
            strokeDasharray: "1 12",
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "ct-spinrev 45s linear infinite",
          }}
        />

        {/* Liens de connexion (sous les nœuds) */}
        <g style={{ stroke: "hsl(var(--accent-2))", strokeOpacity: 0.1, strokeWidth: 1.4 }}>
          {CONNECTIONS.map(([x2, y2], i) => (
            <line key={i} x1="500" y1="330" x2={x2} y2={y2} />
          ))}
        </g>
        <g style={{ stroke: "hsl(var(--accent-2))", strokeWidth: 1.4, strokeDasharray: "2 6", fill: "none" }}>
          {CONNECTIONS.map(([x2, y2], i) => (
            <line
              key={i}
              x1="500"
              y1="330"
              x2={x2}
              y2={y2}
              style={{ animation: "ct-flow 1.7s linear infinite", animationDelay: `${-0.3 * i}s` }}
            />
          ))}
        </g>

        {/* Cœur */}
        <circle
          cx="500"
          cy="330"
          r="160"
          fill="url(#ct-coreglow)"
          style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ct-breathe 5s ease-in-out infinite" }}
        />
        <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ct-breathe 5s ease-in-out infinite" }}>
          <circle
            cx="500"
            cy="330"
            r="62"
            style={{
              fill: "none",
              stroke: "hsl(var(--accent-2))",
              strokeOpacity: 0.5,
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "ct-corepulse 4s ease-out infinite",
            }}
          />
          <circle
            cx="500"
            cy="330"
            r="62"
            style={{
              fill: "none",
              stroke: "hsl(var(--accent-2))",
              strokeOpacity: 0.4,
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "ct-corepulse 4s ease-out infinite",
              animationDelay: "-2s",
            }}
          />
        </g>
        <circle
          cx="500"
          cy="330"
          r="120"
          style={{ fill: "hsl(var(--jet))", stroke: "hsl(var(--accent-2))", strokeOpacity: 0.55, strokeWidth: 1.4 }}
        />
        <g clipPath="url(#ct-coreclip)">
          <g style={{ transformBox: "view-box", transformOrigin: "500px 330px", animation: "ct-spin 6.5s linear infinite" }}>
            <path d="M500,330 L616,290 A118,118 0 0 1 616,370 Z" fill="url(#ct-radar)" />
            <line x1="500" y1="330" x2="616" y2="290" style={{ stroke: "hsl(var(--accent-2))", strokeOpacity: 0.6, strokeWidth: 1.5 }} />
          </g>
        </g>
        <circle
          cx="500"
          cy="330"
          r="78"
          style={{
            fill: "none",
            stroke: "hsl(var(--accent-2))",
            strokeOpacity: 0.18,
            strokeDasharray: "3 7",
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: "ct-spinrev 24s linear infinite",
          }}
        />
        <text x="500" y="324" textAnchor="middle" style={{ fill: "hsl(var(--foreground))", fontWeight: 600, fontSize: 19, letterSpacing: 4 }}>
          PROJET
        </text>
        <text x="500" y="352" textAnchor="middle" style={{ fill: "hsl(var(--accent-2))", fontWeight: 500, fontSize: 14, letterSpacing: 7 }}>
          WEB
        </text>

        {/* Nœuds */}
        {NODES.map((n) => (
          <g key={n.key}>
            <circle
              cx={n.x}
              cy={n.y}
              r="46"
              style={{ fill: "hsl(var(--accent-2))", filter: "url(#ct-soft)", animation: "ct-glow 4s ease-in-out infinite", animationDelay: `${n.glowDelay}s` }}
            />
            <circle cx={n.x} cy={n.y} r="42" style={{ fill: "hsl(var(--jet))", stroke: "hsl(var(--accent-2))", strokeOpacity: 0.85, strokeWidth: 1.6 }} />
            <circle
              cx={n.x}
              cy={n.y}
              r="42"
              style={{ fill: "none", stroke: "hsl(var(--accent-2))", strokeWidth: 2.4, filter: "url(#ct-soft)", opacity: 0, animation: "ct-active 9s ease-in-out infinite", animationDelay: `${n.activeDelay}s` }}
            />
            {n.lines.map((ln, j) => (
              <text
                key={j}
                x={n.x}
                y={ln.y}
                textAnchor="middle"
                style={{ fill: ln.accent ? "hsl(var(--accent-2))" : "hsl(var(--foreground))", fontWeight: ln.accent ? 500 : 600, fontSize: ln.size, letterSpacing: ln.ls }}
              >
                {ln.text}
              </text>
            ))}
          </g>
        ))}

        {/* Contraintes (tags) */}
        {showTags && (
          <g>
            {TAGS.map((tag, i) => (
              <g key={tag.text} style={{ animation: "ct-blink 5s ease-in-out infinite", animationDelay: `${-1.7 * i}s` }}>
                <rect x={tag.x} y={tag.y} width={tag.w} height="32" rx="2" style={{ fill: "hsl(var(--jet) / 0.7)", stroke: "hsl(var(--accent-2))", strokeOpacity: 0.3 }} />
                <text x={tag.x + tag.w / 2} y={tag.y + 20.5} textAnchor="middle" style={{ fill: "hsl(var(--mid-gray))", fontSize: 12, letterSpacing: 2 }}>
                  {tag.text}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Labels de coin */}
        <text x="38" y="44" style={{ fill: "hsl(var(--accent-2))", fillOpacity: 0.4, fontSize: 12.5, letterSpacing: 3 }}>
          // CONSEIL TECHNO WEB · IA
        </text>
        <rect x="38" y="55" width="16" height="16" style={{ fill: "hsl(var(--accent-2))" }} />
        <text x="962" y="630" textAnchor="end" style={{ fill: "hsl(var(--accent-2))", fillOpacity: 0.32, fontSize: 11.5, letterSpacing: 4 }}>
          NEXT · IMPACT · DIGITAL
        </text>
      </svg>
    </div>
  );
}

export default ConstellationTechno;

/** Extrémités des 6 liens partant du cœur (500,330). */
const CONNECTIONS: Array<[number, number]> = [
  [500, 45],
  [746.8, 187.5],
  [746.8, 472.5],
  [500, 615],
  [253.2, 472.5],
  [253.2, 187.5],
];

type NodeLine = { text: string; y: number; size: number; ls: number; accent?: boolean };
type Node = { key: string; x: number; y: number; glowDelay: number; activeDelay: number; lines: NodeLine[] };

const NODES: Node[] = [
  { key: "nocode", x: 500, y: 45, glowDelay: 0, activeDelay: 0, lines: [
    { text: "NO", y: 42, size: 13, ls: 1.5 },
    { text: "CODE", y: 59, size: 13, ls: 1.5 },
  ] },
  { key: "iacode", x: 746.8, y: 187.5, glowDelay: -0.7, activeDelay: -1.5, lines: [
    { text: "IA", y: 184.5, size: 13, ls: 1.5 },
    { text: "CODE", y: 201.5, size: 13, ls: 1.5 },
  ] },
  { key: "headless", x: 746.8, y: 472.5, glowDelay: -1.4, activeDelay: -3, lines: [
    { text: "HEAD", y: 469.5, size: 13, ls: 1 },
    { text: "LESS", y: 486.5, size: 13, ls: 1 },
  ] },
  { key: "app", x: 500, y: 615, glowDelay: -2.1, activeDelay: -4.5, lines: [
    { text: "APP", y: 620, size: 14, ls: 2 },
  ] },
  { key: "saas", x: 253.2, y: 472.5, glowDelay: -2.8, activeDelay: -6, lines: [
    { text: "SaaS", y: 478, size: 15, ls: 1 },
  ] },
  { key: "wpseo", x: 253.2, y: 187.5, glowDelay: -3.5, activeDelay: -7.5, lines: [
    { text: "WP", y: 184.5, size: 14, ls: 1.5 },
    { text: "SEO", y: 201.5, size: 11, ls: 2, accent: true },
  ] },
];

const TAGS = [
  { text: "BUDGET", x: 838, y: 120, w: 118 },
  { text: "MAINTENANCE", x: 800, y: 452, w: 166 },
  { text: "BESOIN", x: 40, y: 452, w: 118 },
];

const CT_KEYFRAMES = `
@keyframes ct-spin { to { transform: rotate(360deg); } }
@keyframes ct-spinrev { to { transform: rotate(-360deg); } }
@keyframes ct-flow { to { stroke-dashoffset: -34; } }
@keyframes ct-glow { 0%,100% { opacity: .14; } 50% { opacity: .5; } }
@keyframes ct-active { 0%,4% { opacity: 0; } 9% { opacity: 1; } 17% { opacity: 1; } 24% { opacity: 0; } 100% { opacity: 0; } }
@keyframes ct-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes ct-corepulse { 0% { transform: scale(.62); opacity: .55; } 70% { opacity: 0; } 100% { transform: scale(1.55); opacity: 0; } }
@keyframes ct-blink { 0%,100% { opacity: .3; } 50% { opacity: .8; } }
@keyframes ct-twinkle { 0%,100% { opacity: .12; } 50% { opacity: .4; } }
`;
