import Link from "next/link";
import {
  weekLabel,
  type DigestContent,
  type DigestLine,
  type DigestTone,
} from "@cto/digest";
import { lettresPath } from "./lettre";
import { ESPACE_PATH } from "./session";
import { Dot, Label, Panel, Stat, type Tone } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// Le digest de la semaine, en tête de l'espace Veille.
//
// Même contenu que l'e-mail, mis en page pour le coup d'œil : un repère en
// tête, puis la veille technique en pleine largeur. Chaque couleur est doublée d'un mot —
// l'écran reste lisible pour qui ne distingue pas le rouge du vert, et pour un
// lecteur d'écran.
//
// Composant serveur, sans animation : rien ne bouge, rien ne s'hydrate.
// ─────────────────────────────────────────────────────────────────────────────

const TONE_UI: Record<DigestTone, Tone> = {
  critique: "alerte",
  attention: "attention",
  ok: "fait",
  info: "neutre",
};

const TONE_MOT: Record<DigestTone, string> = {
  critique: "Critique",
  attention: "À surveiller",
  ok: "RAS",
  info: "Info",
};

/** Une référence Sentinelle en ancre HTML valide. */
function refAnchor(ref: string): string {
  return `fait-${ref.replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
}

function Ligne({ line, anchor = false }: { line: DigestLine; anchor?: boolean }) {
  const tone = line.tone ? TONE_UI[line.tone] : "neutre";
  const mot = line.tone ? TONE_MOT[line.tone] : "Point";

  return (
    <li
      id={anchor && line.ref ? refAnchor(line.ref) : undefined}
      className="flex scroll-mt-24 gap-3 py-2.5"
    >
      <Dot tone={tone} label={mot} />
      <div className="min-w-0">
        {line.tag ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
            {line.tag}
            {line.tone ? <span aria-hidden="true"> · {mot}</span> : null}
          </p>
        ) : null}
        <p className="font-inter-tight text-[15px] leading-snug text-foreground">{line.text}</p>
      </div>
    </li>
  );
}

function LienLettre({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground underline underline-offset-4 transition-colors hover:text-accent-secondary"
    >
      {children} →
    </Link>
  );
}

export function DigestSemaine({
  content,
  semaines,
  base = ESPACE_PATH,
}: {
  content: DigestContent;
  /** Les semaines disponibles, la plus récente en tête. */
  semaines: string[];
  base?: string;
}) {
  const { sentinelle } = content;
  const veillePath = `${base}/veille`;

  return (
    <section aria-labelledby="digest-titre" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dark-gray py-3">
        <h2 id="digest-titre" className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
          {`Digest · ${weekLabel(content.week)}`}
        </h2>
        {semaines.length > 1 ? (
          <nav aria-label="Semaines précédentes" className="flex flex-wrap gap-2">
            {semaines.slice(0, 6).map((semaine) => {
              const active = semaine === content.week;
              return (
                <Link
                  key={semaine}
                  href={`${veillePath}?semaine=${semaine}`}
                  aria-current={active ? "page" : undefined}
                  className={`border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "border-accent-secondary text-foreground"
                      : "border-dark-gray text-mid-gray hover:border-accent-secondary hover:text-foreground"
                  }`}
                >
                  S{Number(semaine.slice(-2))}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>

      <Panel className="mt-1 grid grid-cols-1">
        {sentinelle ? (
          <Stat
            label="Veille technique"
            value={
              sentinelle.stats.alerts === 0
                ? "RAS"
                : `${sentinelle.stats.alerts} alerte${sentinelle.stats.alerts > 1 ? "s" : ""}`
            }
            tone={sentinelle.stats.critiques > 0 ? "alerte" : sentinelle.stats.attention > 0 ? "attention" : "fait"}
            hint={`${sentinelle.stats.components} composants suivis`}
          />
        ) : null}
      </Panel>

      {sentinelle ? (
        <Panel className="mt-6 px-5 py-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <Label>Veille technique · votre site</Label>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              {sentinelle.lines.length} ligne{sentinelle.lines.length > 1 ? "s" : ""}
            </p>
          </div>
          <ul className="mt-3 divide-y divide-dark-gray/60">
            {sentinelle.lines.map((line, index) => (
              <Ligne key={index} line={line} anchor />
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <LienLettre href={`${base}/veille-technique`}>Toutes les alertes et la fiche</LienLettre>
            {sentinelle.letterKey ? (
              <LienLettre href={`${lettresPath(base)}/${sentinelle.letterKey}`}>
                Lire la lettre de veille technique
              </LienLettre>
            ) : null}
          </div>
        </Panel>
      ) : null}
    </section>
  );
}
