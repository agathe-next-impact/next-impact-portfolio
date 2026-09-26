import type { ReactNode } from "react";
import Link from "next/link";
import type { Deliverable, RoadmapPayload } from "@cto/deliverables";
import type { Action, Frise as FriseData, FriseMark, FriseTone, Mission, Verdict } from "@cto/espace";
import { auditPath, categoriePath, CATEGORIES, type CategorieKind } from "./livrables";
import { contactHref, sectionOuverte, type EspaceContext } from "./shell";
import { Dot, formatAmount, formatDay, Label, Tag, type Tone } from "./ui";

// ─────────────────────────────────────────────────────────────────────────────
// L'affichage des trois réponses : missions, site, actions.
//
// Les règles (quel moment, quelle gravité, quelle phrase) sont dans
// `@cto/espace/pilotage`, pures et testées. Ici, seulement la forme.
// ─────────────────────────────────────────────────────────────────────────────

/** L'entrée de la barre latérale qui porte un livrable. */
const SECTION_OF_KIND = {
  roadmap: "missions",
  prestation: "prestations",
  decision: "decisions",
  audit: "audit",
  cartographie: "cartographie",
  document: "documents",
  veille: "veille",
} as const;

/**
 * Où mène un livrable : sa section quand elle fait partie de l'accompagnement,
 * sa page de catégorie sinon (qui reste lisible hors services).
 */
export function livrableHref(item: Deliverable, context: EspaceContext, base: string): string {
  if (item.kind === "audit") return auditPath(item.notionPageId, base);
  const section = SECTION_OF_KIND[item.kind];
  if (section && sectionOuverte(context, section)) return `${base}/${section}`;
  return item.kind in CATEGORIES ? categoriePath(item.kind as CategorieKind, base) : base;
}

const LIEN =
  "font-inter-tight text-sm text-foreground underline-offset-4 transition-colors hover:text-accent-secondary hover:underline";

const LIEN_PIED =
  "block border-t border-dark-gray px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary transition-colors hover:text-foreground";

// ─── Cartes de l'accueil ─────────────────────────────────────────────────

/**
 * Une carte-réponse : la question, la réponse en une phrase, trois lignes au
 * plus pour l'étayer, et la porte vers le détail.
 */
export function CarteReponse({
  question,
  verdict,
  children,
  pied,
}: {
  question: string;
  verdict: Verdict;
  children: ReactNode;
  pied?: { href: string; label: string } | null;
}) {
  return (
    <article className="flex flex-col border border-dark-gray bg-jet/40">
      <header className="border-b border-dark-gray px-4 py-4">
        <Label>{question}</Label>
        <p className="mt-2 flex items-start gap-2.5 font-sans text-lg font-normal leading-snug text-foreground">
          <Dot tone={verdict.tone} label={TONE_MOT[verdict.tone]} />
          <span>{verdict.headline}</span>
        </p>
      </header>
      <ul className="divide-y divide-dark-gray">{children}</ul>
      {pied ? (
        <Link href={pied.href} className={`mt-auto ${LIEN_PIED}`}>
          {pied.label} →
        </Link>
      ) : null}
    </article>
  );
}

const TONE_MOT: Record<Tone, string> = {
  neutre: "Information",
  attention: "À surveiller",
  alerte: "À corriger",
  fait: "En ordre",
};

/** Une ligne de carte : un intitulé, une étiquette, une précision. */
export function LigneCarte({
  titre,
  href,
  tag,
  meta,
  avancement,
}: {
  titre: string;
  href?: string | null;
  tag?: ReactNode;
  meta?: string | null;
  avancement?: number | null;
}) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        {href ? (
          <Link href={href} className={`min-w-0 ${LIEN}`}>
            {titre}
          </Link>
        ) : (
          <span className="min-w-0 font-inter-tight text-sm text-foreground">{titre}</span>
        )}
        {tag ? <span className="shrink-0">{tag}</span> : null}
      </div>
      {typeof avancement === "number" ? <Barre valeur={avancement} titre={titre} /> : null}
      {meta ? <p className="mt-1 font-inter-tight text-xs text-mid-gray">{meta}</p> : null}
    </li>
  );
}

export function LigneVide({ children }: { children: ReactNode }) {
  return <li className="px-4 py-4 font-inter-tight text-sm text-mid-gray">{children}</li>;
}

function Barre({ valeur, titre }: { valeur: number; titre: string }) {
  return (
    <div
      className="mt-2 h-1 w-full bg-dark-gray"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={valeur}
      aria-label={`Avancement de ${titre}`}
    >
      <div className="h-full bg-accent-secondary" style={{ width: `${valeur}%` }} />
    </div>
  );
}

// ─── Missions ────────────────────────────────────────────────────────────

const KIND_MOT: Record<Mission["kind"], string> = {
  chantier: "Chantier",
  prestation: "Prestation",
  decision: "Décision",
  audit: "Audit",
};

/** L'étiquette d'état d'une mission : le retard prime, puis le moment. */
export function MissionTag({ mission }: { mission: Mission }) {
  if (mission.overdue) return <Tag tone="alerte">En retard</Tag>;
  if (mission.phase === "passe") return <Tag tone="fait">{mission.status === "Fait" || mission.status === "Terminée" ? "Fait" : mission.status}</Tag>;
  if (mission.phase === "a-venir") return <Tag>À venir</Tag>;
  return <Tag tone="attention">{mission.status === "Suspendue" ? "Suspendue" : "En cours"}</Tag>;
}

/** La précision d'une mission : sa nature, sa date, et ce que la date veut dire. */
export function missionMeta(mission: Mission): string {
  const morceaux: string[] = [KIND_MOT[mission.kind]];
  if (mission.progress !== null && mission.phase !== "passe") morceaux.push(`${mission.progress} %`);
  if (mission.date) {
    const quand = formatDay(mission.date);
    if (mission.phase === "passe") morceaux.push(quand);
    else if (mission.kind === "prestation") morceaux.push(`livraison le ${quand}`);
    else morceaux.push(`échéance le ${quand}`);
  }
  return morceaux.join(" · ");
}

/** La liste d'un moment, sur la page Missions. */
export function ListeMissions({
  missions,
  context,
  base,
  vide,
}: {
  missions: Mission[];
  context: EspaceContext;
  base: string;
  vide: string;
}) {
  if (missions.length === 0) {
    return <p className="mt-4 border border-dark-gray bg-jet/40 px-5 py-4 font-inter-tight text-sm text-mid-gray">{vide}</p>;
  }
  return (
    <ul className="mt-4 divide-y divide-dark-gray border border-dark-gray bg-jet/40">
      {missions.map((mission) => (
        <LigneCarte
          key={mission.item.id}
          titre={mission.title}
          href={livrableHref(mission.item, context, base)}
          tag={<MissionTag mission={mission} />}
          meta={missionMeta(mission)}
          avancement={mission.phase === "en-cours" ? mission.progress : null}
        />
      ))}
    </ul>
  );
}

// ─── Actions ─────────────────────────────────────────────────────────────

export function ActionTag({ action }: { action: Action }) {
  if (action.kind === "opportunite") return <Tag>À arbitrer</Tag>;
  if (action.kind === "retard") return <Tag tone="alerte">En retard</Tag>;
  if (action.kind === "echeance") {
    return <Tag tone={action.tone}>{action.date ? formatDay(action.date) : "Échéance"}</Tag>;
  }
  return <Tag tone={action.tone}>{action.tone === "alerte" ? "À corriger" : "À surveiller"}</Tag>;
}

/** La précision d'une action : son détail, et pour une opportunité ses deux axes et son budget. */
export function actionMeta(action: Action): string | null {
  if (action.kind === "opportunite" && action.item) {
    const payload = action.item.payload as RoadmapPayload;
    const morceaux = [
      payload.effort && payload.effet ? `Effort ${payload.effort.toLowerCase()} · effet ${payload.effet.toLowerCase()}` : null,
      formatAmount(payload.budget) ? `~${formatAmount(payload.budget)}` : null,
    ].filter(Boolean);
    return morceaux.length > 0 ? morceaux.join(" · ") : null;
  }
  return action.detail;
}

/**
 * Une action, sur les pages « Agir » : ce qu'il y a à faire, pourquoi, et le
 * bouton pour en parler — un e-mail dont le sujet nomme déjà la chose.
 */
export function ActionLigne({
  action,
  company,
  context,
  base,
}: {
  action: Action;
  company: string;
  context: EspaceContext;
  base: string;
}) {
  const payload = action.kind === "opportunite" && action.item ? (action.item.payload as RoadmapPayload) : null;
  const detail = actionMeta(action);

  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <ActionTag action={action} />
          {action.item && action.kind !== "opportunite" ? (
            <Link href={livrableHref(action.item, context, base)} className={LIEN}>
              {action.title}
            </Link>
          ) : (
            <span className="font-inter-tight text-sm text-foreground">{action.title}</span>
          )}
        </div>
        {detail ? <p className="mt-1.5 font-inter-tight text-xs leading-relaxed text-mid-gray">{detail}</p> : null}
        {payload?.detail ? (
          <p className="mt-2 max-w-prose font-inter-tight text-sm leading-relaxed text-mid-gray">{payload.detail}</p>
        ) : null}
        {payload?.source ? (
          <a
            href={payload.source}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray underline underline-offset-4 hover:text-accent-secondary"
          >
            Voir le document ↗
          </a>
        ) : null}
      </div>
      <a
        href={contactHref(company, action.title)}
        className="shrink-0 self-start border border-dark-gray px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:border-accent-secondary"
      >
        En parler
      </a>
    </li>
  );
}

// ─── Frise ───────────────────────────────────────────────────────────────

const MARK_FILL: Record<FriseTone, string> = {
  fait: "bg-[#7fd8a4]",
  cours: "bg-accent-secondary",
  attention: "bg-[#f2c94c]",
  alerte: "bg-[#ff8a7a]",
  neutre: "bg-mid-gray",
};

const SPAN_CLASS: Record<FriseTone, string> = {
  fait: "border-[#7fd8a4]/60 bg-[#7fd8a4]/10",
  cours: "border-accent-secondary/70 bg-accent-secondary/15",
  attention: "border-[#f2c94c]/60 bg-[#f2c94c]/10",
  alerte: "border-[#ff8a7a]/60 bg-[#ff8a7a]/10",
  neutre: "border-dark-gray bg-overlay-gray",
};

const LEGENDE: { tone: FriseTone; label: string }[] = [
  { tone: "fait", label: "Fait" },
  { tone: "cours", label: "En cours" },
  { tone: "attention", label: "Échéance proche" },
  { tone: "alerte", label: "En retard ou échu" },
  { tone: "neutre", label: "À venir" },
];

const ETIQUETTE = "font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray";

function Repere({ mark, href, texte }: { mark: FriseMark; href: string; texte: boolean }) {
  const libelle = `${mark.title}${mark.date ? `, ${formatDay(mark.date)}` : ""}`;

  if (mark.to !== null) {
    return (
      <Link
        href={href}
        title={libelle}
        className={`absolute top-1.5 flex h-5 items-center overflow-hidden border px-1.5 font-inter-tight text-[11px] text-foreground hover:border-accent-secondary ${SPAN_CLASS[mark.tone]}`}
        style={{ left: `${mark.from}%`, width: `${Math.max(mark.to - mark.from, 1.5)}%` }}
      >
        <span className="truncate">{mark.title}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      title={libelle}
      className="group absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5"
      style={{ left: `calc(${mark.from}% - 5px)` }}
    >
      <span className={`h-2.5 w-2.5 shrink-0 ring-2 ring-obsidian group-hover:outline group-hover:outline-1 group-hover:outline-accent-secondary ${MARK_FILL[mark.tone]}`} />
      {texte ? (
        <span className="max-w-[9rem] truncate font-inter-tight text-[11px] text-foreground group-hover:text-accent-secondary">
          {mark.title}
        </span>
      ) : (
        <span className="sr-only">{libelle}</span>
      )}
    </Link>
  );
}

/**
 * La frise : trois mois derrière, trois devant, aujourd'hui au milieu.
 *
 * Le passé est hachuré — il ne bouge plus. Les repères sont des liens vers leur
 * section ; leur date est dans l'info-bulle et, pour le lecteur d'écran, dans
 * la liste qui double la frise.
 */
export function Frise({
  frise,
  context,
  base,
  titre = "Passé, présent, à venir",
}: {
  frise: FriseData;
  context: EspaceContext;
  base: string;
  titre?: string;
}) {
  const marques = frise.lanes.flatMap((lane) => lane.rows.flat().map((mark) => ({ lane: lane.label, mark })));

  return (
    <section aria-labelledby="frise-titre" className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-dark-gray pb-3">
        <h2 id="frise-titre" className="font-sans text-lg font-light text-foreground">
          {titre}
        </h2>
        <span className={ETIQUETTE}>
          {formatMois(frise.start)} → {formatMois(new Date(frise.end.getTime() - 86_400_000))}
        </span>
      </div>

      {frise.count === 0 ? (
        <p className="mt-5 border border-dark-gray bg-jet/40 px-5 py-4 font-inter-tight text-sm text-mid-gray">
          Rien de daté sur ces sept mois. Les décisions, missions et échéances de contrats s&rsquo;y
          placeront dès leur publication.
        </p>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto border border-dark-gray bg-jet/40" aria-hidden>
            <div className="min-w-[640px] px-4 pb-4 pt-3">
              <div className="relative ml-[92px] h-5">
                {frise.months.map((mois) => (
                  <span key={mois.at} className={`absolute ${ETIQUETTE}`} style={{ left: `${mois.at}%` }}>
                    {mois.label}
                  </span>
                ))}
              </div>
              {frise.lanes.map((lane, laneIndex) =>
                lane.rows.map((row, rowIndex) => (
                  <div key={`${lane.key}-${rowIndex}`} className="grid grid-cols-[92px_minmax(0,1fr)] items-center">
                    <span className={ETIQUETTE}>{rowIndex === 0 ? lane.label : ""}</span>
                    <div className={`relative h-8 ${rowIndex === 0 ? "border-t border-dashed border-dark-gray" : ""}`}>
                      <div
                        className="absolute inset-y-0 left-0 bg-[repeating-linear-gradient(135deg,transparent_0_5px,hsl(var(--dark-gray))_5px_6px)] opacity-60"
                        style={{ width: `${frise.today}%` }}
                      />
                      {frise.months.map((mois) => (
                        <span key={mois.at} className="absolute inset-y-0 w-px bg-dark-gray/50" style={{ left: `${mois.at}%` }} />
                      ))}
                      <span className="absolute -bottom-px -top-px w-0.5 bg-accent-secondary" style={{ left: `${frise.today}%` }} />
                      {laneIndex === 0 && rowIndex === 0 ? (
                        <span
                          className="absolute top-0.5 ml-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary"
                          style={{ left: `${frise.today}%` }}
                        >
                          Aujourd&rsquo;hui
                        </span>
                      ) : null}
                      {row.map((mark) => (
                        <Repere
                          key={mark.id}
                          mark={mark}
                          href={livrableHref(mark.item, context, base)}
                          texte={lane.key === "missions"}
                        />
                      ))}
                    </div>
                  </div>
                )),
              )}
              <ul className="ml-[92px] mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {LEGENDE.map((entree) => (
                  <li key={entree.tone} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 ${MARK_FILL[entree.tone]}`} />
                    <span className={ETIQUETTE}>{entree.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* La frise est un dessin : son contenu, pour qui ne la voit pas. */}
          <ul className="sr-only">
            {marques.map(({ lane, mark }) => (
              <li key={`${lane}-${mark.id}`}>
                <Link href={livrableHref(mark.item, context, base)}>
                  {lane} : {mark.title}
                  {mark.date ? `, ${formatDay(mark.date)}` : ""}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function formatMois(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}
