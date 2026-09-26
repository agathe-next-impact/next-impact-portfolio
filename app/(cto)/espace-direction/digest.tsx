import Link from "next/link";
import {
  weekLabel,
  type DigestContent,
  type DigestLine,
  type DigestSignal,
  type DigestTone,
  type SignalLevel,
} from "@cto/digest";
import { lettresPath } from "./lettre";
import { ESPACE_PATH } from "./session";
import { Dot, Label, Panel, Stat, Tag, type Tone } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// Le digest de la semaine, en tête de l'espace Veille.
//
// Même contenu que l'e-mail, mis en page pour le coup d'œil : trois repères en
// tête (une case par veille), la veille technique en pleine largeur, les deux
// éditions Signaux Faibles côte à côte. Chaque couleur est doublée d'un mot —
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

const LEVEL_UI: Record<SignalLevel, Tone> = { FORT: "alerte", MOYEN: "attention", RAS: "neutre" };

/** Une référence Sentinelle en ancre HTML valide. */
function refAnchor(ref: string): string {
  return `fait-${ref.replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
}

function dateCourte(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

function Ligne({
  line,
  anchor = false,
  refsConnues,
}: {
  line: DigestLine;
  anchor?: boolean;
  refsConnues?: Set<string>;
}) {
  const tone = line.tone ? TONE_UI[line.tone] : "neutre";
  const mot = line.tone ? TONE_MOT[line.tone] : "Point";
  const renvoi = !anchor && line.ref && refsConnues?.has(line.ref) ? line.ref : null;

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
        {renvoi ? (
          <a
            href={`#${refAnchor(renvoi)}`}
            className="mt-1 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 transition-colors hover:text-accent-secondary"
          >
            Voir le constat technique
          </a>
        ) : null}
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

function CarteSignal({
  signal,
  base,
  refsConnues,
}: {
  signal: DigestSignal;
  base: string;
  refsConnues: Set<string>;
}) {
  const marquants = signal.axes.filter((axe) => axe.level === "FORT" || axe.level === "MOYEN");
  const calmes = signal.axes.length - marquants.length;

  return (
    <Panel className="flex flex-col px-5 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Label>Signaux faibles · {signal.label ?? "Veille"}</Label>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
          {dateCourte(signal.date)}
        </p>
      </div>
      <h3 className="mt-2 font-sans text-base font-light leading-snug text-foreground">{signal.title}</h3>

      {signal.axes.length > 0 ? (
        <ul aria-label="Axes de l'édition et leur niveau d'impact" className="mt-4 flex flex-wrap gap-2">
          {marquants.map((axe) => (
            <li key={axe.name}>
              <Tag tone={LEVEL_UI[axe.level as SignalLevel]}>
                {axe.name} · {axe.level}
              </Tag>
            </li>
          ))}
          {calmes > 0 ? (
            <li>
              <Tag>
                {calmes} axe{calmes > 1 ? "s" : ""} sans signal
              </Tag>
            </li>
          ) : null}
        </ul>
      ) : null}

      {signal.lines.length > 0 ? (
        <ul className="mt-3 divide-y divide-dark-gray/60">
          {signal.lines.map((line, index) => (
            <Ligne key={index} line={line} refsConnues={refsConnues} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-inter-tight text-sm text-mid-gray">
          Cette édition n&rsquo;a pas de rubrique « L&rsquo;essentiel » lisible : lisez-la en entier.
        </p>
      )}

      {signal.action ? (
        <div className="mt-4 border-l-2 border-accent-secondary bg-jet/60 px-4 py-3">
          <Label>Action de la semaine</Label>
          <p className="mt-1 font-inter-tight text-[15px] leading-snug text-foreground">{signal.action}</p>
        </div>
      ) : null}

      <div className="mt-auto pt-5">
        <LienLettre href={`${lettresPath(base)}/${signal.letterKey}`}>Lire l&rsquo;édition complète</LienLettre>
      </div>
    </Panel>
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
  const { sentinelle, signaux } = content;
  const refsConnues = new Set(
    (sentinelle?.lines ?? []).flatMap((line) => (line.ref ? [line.ref] : [])),
  );
  const veillePath = `${base}/veille`;

  return (
    <section aria-labelledby="digest-titre" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-dark-gray pb-3">
        <div>
          <Label>Digest de la semaine</Label>
          <h2 id="digest-titre" className="mt-2 font-sans text-xl font-light text-foreground">
            {weekLabel(content.week)}
          </h2>
        </div>
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

      <Panel className="mt-5 grid grid-cols-1 sm:grid-cols-3">
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
        {signaux.map((signal) => {
          const forts = signal.axes.filter((axe) => axe.level === "FORT").length;
          const moyens = signal.axes.filter((axe) => axe.level === "MOYEN").length;
          return (
            <Stat
              key={signal.letterKey}
              label={`Signaux · ${signal.label ?? "Veille"}`}
              value={forts > 0 ? `${forts} fort${forts > 1 ? "s" : ""}` : moyens > 0 ? `${moyens} moyen${moyens > 1 ? "s" : ""}` : "RAS"}
              tone={forts > 0 ? "alerte" : moyens > 0 ? "attention" : "fait"}
              hint={`${signal.axes.length} axes suivis`}
            />
          );
        })}
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
          {sentinelle.letterKey ? (
            <div className="mt-4">
              <LienLettre href={`${lettresPath(base)}/${sentinelle.letterKey}`}>
                Lire la lettre de veille technique
              </LienLettre>
            </div>
          ) : null}
        </Panel>
      ) : null}

      {signaux.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {signaux.map((signal) => (
            <CarteSignal key={signal.letterKey} signal={signal} base={base} refsConnues={refsConnues} />
          ))}
        </div>
      ) : content.signauxAttendus ? (
        <Panel className="mt-6 px-5 py-5">
          <p className="font-inter-tight text-base text-mid-gray">
            Signaux faibles : pas de nouvelle édition cette semaine.
          </p>
        </Panel>
      ) : null}
    </section>
  );
}
