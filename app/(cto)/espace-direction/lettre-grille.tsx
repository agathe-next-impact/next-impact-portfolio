import type { ReactNode } from "react";
import type {
  Action,
  Block,
  Axe,
  Carte,
  Chantier,
  Echeance,
  Intensite,
  Lecture,
  LettreStructuree,
  Pression,
  Section,
  SectionPlacee,
  Span,
  Urgence,
} from "@cto/letters";
import { echeancesDatees, estNoteDeMethode, lecture, premierePhrase, priorites, texteDe } from "@cto/letters";
import { CorpsLettre, Texte } from "./lettre";
import { Label, Panel, Tag, type Tone } from "./ui";
import { ESPACE_PATH } from "./session";

// ─────────────────────────────────────────────────────────────────────────────
// Une lettre de veille en grille, quelle que soit sa source (atelier, Signaux
// Faibles, Sentinelle) : la grille ne connaît que les formes que
// `structureLettre` a reconnues.
//
// La lecture est rangée en trois temps (`lecture`) : ce qu'il faut faire, ce
// qui bouge, le reste replié. Le premier écran porte l'essentiel en clair —
// les actions à faire en premier, ce qui pèse, les prochaines échéances —
// chaque ligne menant à son détail.
//
// Le texte est le même que dans le rendu linéaire (`CorpsLettre`), mot pour
// mot : seule la mise en page change. Ce qui se compare (la pression des douze
// axes, l'urgence des actions, la date des échéances) passe en badges et en
// frise au premier plan ; ce qui s'explique (contexte d'une action, détail d'un
// axe) reste à un clic, dans un `<details>` natif, sans JavaScript.
//
// Les couleurs sont celles des livrables (`Tone`) : rouge = ça presse, jaune =
// ça approche, neutre = rien à faire. Aucune n'est seule — chaque pastille porte
// son mot, et chaque segment de graphique son numéro.
// ─────────────────────────────────────────────────────────────────────────────

const PRESSION: Record<Pression, { label: string; tone: Tone }> = {
  traiter: { label: "À traiter", tone: "alerte" },
  hausse: { label: "En hausse", tone: "alerte" },
  surveiller: { label: "À surveiller", tone: "attention" },
  stable: { label: "Stable", tone: "neutre" },
  baisse: { label: "En baisse", tone: "fait" },
  inconnue: { label: "Non qualifié", tone: "neutre" },
};

const ORDRE_PRESSION: Pression[] = ["traiter", "hausse", "surveiller", "stable", "baisse", "inconnue"];

const INTENSITE: Record<Intensite, { label: string; tone: Tone }> = {
  fort: { label: "Signal fort", tone: "alerte" },
  moyen: { label: "Signal moyen", tone: "attention" },
  faible: { label: "Signal faible", tone: "neutre" },
  ras: { label: "RAS", tone: "neutre" },
};

function Signal({ signal }: { signal?: Intensite }) {
  if (!signal) return null;
  return <Pastille tone={INTENSITE[signal].tone}>{INTENSITE[signal].label}</Pastille>;
}

const URGENCE_TONE: Record<Urgence, Tone> = {
  semaine: "alerte",
  mois: "attention",
  "plus-tard": "neutre",
};

const FOND: Record<Tone, string> = {
  alerte: "bg-[#ff8a7a]",
  attention: "bg-[#f2c94c]",
  neutre: "bg-mid-gray/40",
  fait: "bg-[#7fd8a4]",
};

const JOUR = 86_400_000;

const ancreSection = (index: number) => `section-${index}`;

const normaliserTitre = (titre: Span[]) =>
  texteDe(titre)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
const ancreAxe = (numero: number) => `axe-${numero}`;

function joursAvant(date: Date, maintenant: Date): number {
  return Math.ceil((date.getTime() - maintenant.getTime()) / JOUR);
}

function formatCourt(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" }).format(date);
}

// ─── Briques ─────────────────────────────────────────────────────────────────

function Pastille({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <Tag tone={tone}>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span aria-hidden className={`h-1.5 w-1.5 ${FOND[tone]}`} />
        {children}
      </span>
    </Tag>
  );
}

function TitreSection({
  id,
  titre,
  sousTitre,
  signal,
}: {
  id: string;
  titre: Span[];
  sousTitre?: ReactNode;
  signal?: Intensite;
}) {
  return (
    <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-dark-gray pb-3">
      <h3 id={id} className="scroll-mt-8 font-sans text-xl font-light text-foreground">
        <Texte spans={titre} />
      </h3>
      {sousTitre || signal ? (
        <div className="flex flex-wrap items-center gap-3">
          {sousTitre ? <Label>{sousTitre}</Label> : null}
          <Signal signal={signal} />
        </div>
      ) : null}
    </div>
  );
}

function Plus({ resume, children }: { resume: string; children: ReactNode }) {
  return (
    <details className="group mt-4 border-t border-dark-gray pt-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        {resume}
        <span aria-hidden className="group-open:text-accent-secondary">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="mt-3 space-y-3 font-inter-tight text-sm leading-relaxed text-foreground/85">{children}</div>
    </details>
  );
}

function Carreau({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <article id={id} className={`flex scroll-mt-8 flex-col border border-dark-gray bg-jet/40 p-5 ${className}`}>
      {children}
    </article>
  );
}

// ─── Pression des axes ───────────────────────────────────────────────────────

/**
 * Répartition des axes par niveau de pression : une barre de douze cases,
 * regroupées par niveau, chacune portant le numéro de son axe et menant à sa
 * carte. La légende donne les effectifs en toutes lettres.
 */
function BarrePression({ axes }: { axes: Axe[] }) {
  const tries = [...axes].sort(
    (a, b) => ORDRE_PRESSION.indexOf(a.pression) - ORDRE_PRESSION.indexOf(b.pression) || a.numero - b.numero,
  );
  const effectifs = ORDRE_PRESSION.map((p) => ({ p, n: axes.filter((a) => a.pression === p).length })).filter(
    (e) => e.n > 0,
  );

  return (
    <figure className="px-4 py-5">
      <figcaption>
        <Label>Pression sur les {axes.length} axes</Label>
      </figcaption>
      <div className="mt-4 flex gap-[2px]" role="list">
        {tries.map((axe) => {
          const { label, tone } = PRESSION[axe.pression];
          return (
            <a
              key={axe.numero}
              role="listitem"
              href={`#${ancreAxe(axe.numero)}`}
              title={`${axe.numero}. ${axe.nom} — ${label}`}
              aria-label={`Axe ${axe.numero}, ${axe.nom} : ${label}`}
              // Chiffre blanc sur toutes les gravités ; la légère ombre le
              // détache des fonds clairs (jaune, vert).
              className={`cto-lien-plein flex h-9 min-w-0 flex-1 items-center justify-center font-mono text-[10px] text-white transition-opacity [text-shadow:0_1px_1px_rgb(0_0_0/0.45)] first:rounded-l-[4px] last:rounded-r-[4px] hover:opacity-80 ${FOND[tone]}`}
            >
              {axe.numero}
            </a>
          );
        })}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {effectifs.map(({ p, n }) => (
          <li key={p} className="flex items-center gap-2 font-inter-tight text-xs text-mid-gray">
            <span aria-hidden className={`h-2 w-2 ${FOND[PRESSION[p].tone]}`} />
            {PRESSION[p].label} <span className="text-foreground">{n}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

// ─── Premier écran : l'essentiel ─────────────────────────────────────────────

const ancreAction = (section: number, numero: number) => `action-${section}-${numero}`;
const ancreCarte = (section: number, carte: number) => `carte-${section}-${carte}`;
const ancreEcheance = (section: number, rang: number) => `echeance-${section}-${rang}`;

/** Une ligne de l'essentiel : un repère, puis dessous le libellé qui mène à son détail. */
function LigneEssentiel({ href, repere, children }: { href: string; repere: ReactNode; children: ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="group flex flex-col items-start gap-1.5 py-2.5 transition-colors hover:text-accent-secondary"
      >
        <span>{repere}</span>
        <span className="font-inter-tight text-sm leading-snug text-foreground group-hover:text-accent-secondary">
          {children}
        </span>
      </a>
    </li>
  );
}

function ColonneEssentiel({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="px-5 py-5">
      <Label>{titre}</Label>
      <ul className="mt-2 divide-y divide-dark-gray">{children}</ul>
    </div>
  );
}

/** Le résumé de tête (« L'essentiel du jour ») en liste courte, quelle que soit sa forme. */
function EnBref({ placee, base }: { placee: SectionPlacee; base: string }) {
  const { section } = placee;
  if (section.kind === "cartes") {
    return (
      <ul className="mt-3 space-y-2 font-inter-tight text-[15px] leading-relaxed text-foreground/90">
        {section.cartes.map((carte, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 bg-accent-secondary" />
            <span>
              <strong className="font-medium text-foreground">{carte.titre}</strong>
              {carte.texte.length > 0 ? (
                <>
                  {" "}
                  <Texte spans={carte.texte} />
                </>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if (section.kind === "prose") return <CorpsLettre body={section.blocs} base={base} />;
  return <RenduSection section={section} index={placee.index} axes={new Map()} maintenant={new Date()} base={base} avecTitre={false} />;
}

/**
 * Le premier écran : ce qu'il faut faire d'abord, ce qui pèse, ce qui approche.
 * Des contenus, pas des compteurs : chaque ligne dit la chose et mène à son
 * détail plus bas.
 */
function Essentiel({
  structure,
  lu,
  maintenant,
  base,
}: {
  structure: LettreStructuree;
  lu: Lecture;
  maintenant: Date;
  base: string;
}) {
  const prio = priorites(structure, maintenant);
  // Les signaux de « L'essentiel du jour » sont déjà lus juste au-dessus, en
  // liste sans ancre : les reprendre donnerait des liens morts.
  const signaux = prio.signaux.filter((s) => s.index !== lu.enBref?.index);
  const axesSection = structure.sections.find((s): s is Extract<Section, { kind: "axes" }> => s.kind === "axes");

  const colonnes: ReactNode[] = [];
  if (prio.actions.length > 0)
    colonnes.push(
      <ColonneEssentiel key="agir" titre="À faire en premier">
        {prio.actions.map(({ action, index }) => (
          <LigneEssentiel
            key={`${index}-${action.numero}`}
            href={`#${ancreAction(index, action.numero)}`}
            repere={<Pastille tone={URGENCE_TONE[action.urgence]}>{action.echeance ?? "Sans date"}</Pastille>}
          >
            {action.titre}
          </LigneEssentiel>
        ))}
      </ColonneEssentiel>,
    );
  if (signaux.length > 0)
    colonnes.push(
      <ColonneEssentiel key="signaux" titre="Ce qui pèse">
        {signaux.map((s, i) => (
          <LigneEssentiel
            key={i}
            href={`#${s.carte === null ? ancreSection(s.index) : ancreCarte(s.index, s.carte)}`}
            repere={<Signal signal={s.signal} />}
          >
            {s.titre}
          </LigneEssentiel>
        ))}
      </ColonneEssentiel>,
    );
  else if (prio.axes.length > 0)
    colonnes.push(
      <ColonneEssentiel key="axes" titre="Ce qui pèse">
        {prio.axes.slice(0, 4).map((axe) => (
          <LigneEssentiel
            key={axe.numero}
            href={`#${ancreAxe(axe.numero)}`}
            repere={<Pastille tone={PRESSION[axe.pression].tone}>{PRESSION[axe.pression].label}</Pastille>}
          >
            {axe.nom}
          </LigneEssentiel>
        ))}
      </ColonneEssentiel>,
    );
  if (prio.echeances.length > 0)
    colonnes.push(
      <ColonneEssentiel key="echeances" titre="Prochaines échéances">
        {prio.echeances.map(({ echeance, index, rang }) => {
          const jours = joursAvant(echeance.date, maintenant);
          return (
            <LigneEssentiel
              key={`${index}-${rang}`}
              href={`#${ancreEcheance(index, rang)}`}
              repere={
                <Pastille tone={jours <= 7 ? "alerte" : jours <= 30 ? "attention" : "neutre"}>
                  {formatCourt(echeance.date)}
                </Pastille>
              }
            >
              {premierePhrase(echeance.texte).phrase || echeance.libelle}
            </LigneEssentiel>
          );
        })}
      </ColonneEssentiel>,
    );

  if (!lu.enBref && colonnes.length === 0 && !axesSection) return null;

  return (
    <section aria-labelledby="essentiel" className="mt-8">
      <h2 id="essentiel" className="sr-only">
        L&rsquo;essentiel
      </h2>
      <Panel>
        {lu.enBref ? (
          <div className="px-5 py-5">
            <Label>{lu.enBref.section.titre ? texteDe(lu.enBref.section.titre) : "En bref"}</Label>
            <div className="max-w-[80ch]">
              <EnBref placee={lu.enBref} base={base} />
            </div>
          </div>
        ) : null}
        {colonnes.length > 0 ? (
          // Empilées, jamais côte à côte : en colonnes, les libellés longs se
          // coupaient à chaque mot.
          <div className={`divide-y divide-dark-gray ${lu.enBref ? "border-t border-dark-gray" : ""}`}>
            {colonnes}
          </div>
        ) : null}
        {axesSection ? (
          <div className="border-t border-dark-gray">
            <BarrePression axes={axesSection.axes} />
          </div>
        ) : null}
      </Panel>
    </section>
  );
}

// ─── Les trois temps de la lecture ───────────────────────────────────────────

const GROUPES = {
  agir: { id: "a-faire", titre: "À faire" },
  suivre: { id: "ce-qui-bouge", titre: "Ce qui bouge" },
  plus: { id: "plus-loin", titre: "Pour aller plus loin" },
} as const;

function NavGroupes({ comptes }: { comptes: { cle: keyof typeof GROUPES; n: number }[] }) {
  const visibles = comptes.filter((c) => c.n > 0);
  if (visibles.length < 2) return null;
  return (
    <nav aria-label="Parties de la lettre" className="mt-6 flex flex-wrap gap-2">
      {visibles.map(({ cle, n }) => (
        <a
          key={cle}
          href={`#${GROUPES[cle].id}`}
          className="flex items-center gap-2 border border-dark-gray px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:border-accent-secondary hover:text-foreground"
        >
          {GROUPES[cle].titre}
          <span className="text-foreground">{n}</span>
        </a>
      ))}
    </nav>
  );
}

function Groupe({ cle, sousTitre, children }: { cle: keyof typeof GROUPES; sousTitre?: string; children: ReactNode }) {
  const { id, titre } = GROUPES[cle];
  return (
    <section aria-labelledby={id} className="mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-foreground/30 pb-3">
        <h2 id={id} className="scroll-mt-8 font-sans text-2xl font-light text-foreground">
          {titre}
        </h2>
        {sousTitre ? <Label>{sousTitre}</Label> : null}
      </div>
      {children}
    </section>
  );
}

/** Une section repliée : son titre suffit à décider de l'ouvrir. */
function Repli({ id, titre, resume, children }: { id?: string; titre: ReactNode; resume?: ReactNode; children: ReactNode }) {
  return (
    <details id={id} className="group scroll-mt-8 border-b border-dark-gray">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-sans text-base font-normal text-foreground">{titre}</span>
          {resume ? <span className="mt-1 block font-inter-tight text-sm text-mid-gray">{resume}</span> : null}
        </span>
        <span aria-hidden className="pt-0.5 font-mono text-sm text-mid-gray group-open:text-accent-secondary">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function GrilleAxes({ axes }: { axes: Axe[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {axes.map((axe) => {
        const { label, tone } = PRESSION[axe.pression];
        return (
          <Carreau key={axe.numero} id={ancreAxe(axe.numero)}>
            <div className="flex flex-col items-start gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                Axe {String(axe.numero).padStart(2, "0")}
              </p>
              <Pastille tone={tone}>{label}</Pastille>
            </div>
            <h4 className="mt-3 font-sans text-base font-normal leading-snug text-foreground">{axe.nom}</h4>
            {axe.verdict ? (
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">{axe.verdict}</p>
            ) : null}
            {axe.detail.length > 0 || axe.rubriques.length > 0 ? (
              <div className="mt-auto">
                <Plus resume="Le détail">
                  {axe.detail.length > 0 ? (
                    <p>
                      <Texte spans={axe.detail} />
                    </p>
                  ) : null}
                  {axe.rubriques.map((r, i) => (
                    <p key={i}>
                      {r.titre ? <strong className="font-medium text-foreground">{r.titre}. </strong> : null}
                      <Texte spans={r.texte} />
                    </p>
                  ))}
                </Plus>
              </div>
            ) : null}
          </Carreau>
        );
      })}
    </div>
  );
}

function CarteAction({ action, axes, id }: { action: Action; axes: Map<number, string>; id: string }) {
  const tone = URGENCE_TONE[action.urgence];
  const [concerne, ...sources] = action.sources;
  // Une décision sans « À faire » (lettre rédigée à la main, geste Signaux
  // Faibles) : sa première phrase de contexte EST le contenu et reste visible,
  // le reste (étapes, pourquoi, quand) passe sous le pli.
  const visible = action.aFaire ? null : (action.contexte[0] ?? null);
  const replie = action.aFaire ? action.contexte : action.contexte.slice(1);

  return (
    <Carreau id={id} className={tone === "alerte" ? "border-t-2 border-t-[#ff8a7a]/70" : ""}>
      <div className="flex flex-col items-start gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {action.aFaire || action.periode ? `Action ${action.numero}` : `Point ${action.numero}`}
          {action.periode ? ` · ${action.periode}` : ""}
        </p>
        {action.echeance ? <Pastille tone={tone}>{action.echeance}</Pastille> : null}
      </div>
      <h4 className="mt-3 font-sans text-base font-normal leading-snug text-foreground">{action.titre}</h4>

      {action.axes.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Axes concernés">
          {action.axes.map((numero) => (
            <li key={numero}>
              <a
                href={axes.has(numero) ? `#${ancreAxe(numero)}` : undefined}
                title={axes.get(numero)}
                className="inline-block border border-dark-gray px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] text-mid-gray transition-colors hover:border-accent-secondary hover:text-foreground"
              >
                Axe {numero}
                {axes.get(numero) ? <span className="sr-only"> : {axes.get(numero)}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {action.aFaire ? (
        <div className="mt-4 border-l-2 border-l-accent-secondary pl-3">
          <Label>À faire</Label>
          <p className="mt-1 font-inter-tight text-sm leading-relaxed text-foreground">
            <Texte spans={action.aFaire} />
          </p>
        </div>
      ) : null}

      {visible ? (
        <p className="mt-4 border-l-2 border-l-accent-secondary pl-3 font-inter-tight text-sm leading-relaxed text-foreground">
          {visible.titre ? <strong className="font-medium">{visible.titre} : </strong> : null}
          <Texte spans={visible.texte} />
        </p>
      ) : null}

      {replie.length > 0 || concerne ? (
        <div className="mt-auto">
          <Plus resume={action.aFaire ? "Contexte, impact et coût" : "Le détail"}>
            {replie.map((c, i) => (
              <p key={i}>
                {c.titre ? <strong className="font-medium text-foreground">{c.titre}. </strong> : null}
                <Texte spans={c.texte} />
              </p>
            ))}
            {concerne ? (
              <p className="text-xs text-mid-gray">
                <span className="font-mono uppercase tracking-[0.12em]">Concerne</span> · {concerne}
              </p>
            ) : null}
            {sources.length > 0 ? (
              <p className="text-xs text-mid-gray">
                <span className="font-mono uppercase tracking-[0.12em]">Sources</span> · {sources.join(" · ")}
              </p>
            ) : null}
          </Plus>
        </div>
      ) : null}
    </Carreau>
  );
}

const OPTION_TONE: [RegExp, Tone][] = [
  [/^à considérer/i, "fait"],
  [/^à différer/i, "attention"],
  [/^à éviter/i, "alerte"],
];

function GrilleOptions({ options }: { options: Carte[] }) {
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      {options.map((option, index) => {
        const tone = OPTION_TONE.find(([re]) => re.test(option.titre))?.[1] ?? "neutre";
        return (
          <Carreau key={index}>
            <div>
              <Pastille tone={tone}>{option.titre}</Pastille>
            </div>
            <p className="mt-4 font-inter-tight text-sm leading-relaxed text-foreground/90">
              <Texte spans={option.texte} />
            </p>
          </Carreau>
        );
      })}
    </div>
  );
}

/** L'avancement des chantiers : une jauge par chantier chiffré, un statut sinon. */
function GrilleChantiers({ chantiers }: { chantiers: Chantier[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {chantiers.map((chantier, index) => (
        <Carreau key={index}>
          <div className="flex flex-col items-start gap-2">
            {chantier.statut ? (
              <Pastille tone={chantier.statut === "Livré" ? "fait" : "neutre"}>{chantier.statut}</Pastille>
            ) : null}
            <h4 className="font-sans text-base font-normal leading-snug text-foreground">{chantier.titre}</h4>
          </div>
          {chantier.pourcentage !== null ? (
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <Label>Avancement</Label>
                <p className="font-sans text-xl font-light leading-none text-foreground">{chantier.pourcentage} %</p>
              </div>
              <div
                role="progressbar"
                aria-label={`Avancement de ${chantier.titre}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={chantier.pourcentage}
                className="mt-2 h-2 w-full rounded-[4px] bg-mid-gray/25"
              >
                <div
                  className="h-2 rounded-[4px] bg-accent-secondary"
                  style={{ width: `${Math.max(2, chantier.pourcentage)}%` }}
                />
              </div>
            </div>
          ) : null}
          {chantier.texte.length > 0 ? (
            <p className="mt-4 font-inter-tight text-sm leading-relaxed text-foreground/85">
              <Texte spans={chantier.texte} />
            </p>
          ) : null}
        </Carreau>
      ))}
    </div>
  );
}

/** Au-delà, le texte d'une carte passe sous le pli : la carte se lit d'un coup d'œil. */
const CARTE_COURTE = 220;

function GrilleCartes({ cartes, section }: { cartes: Carte[]; section: number }) {
  return (
    <div className={`mt-6 grid gap-3 ${cartes.length > 1 ? "sm:grid-cols-2 xl:grid-cols-3" : ""}`}>
      {cartes.map((carte, index) => {
        const courte = !carte.suite && texteDe(carte.texte).length <= CARTE_COURTE;
        const { phrase, reste } = premierePhrase(carte.texte);
        const replie = !courte && (reste.length > 0 || carte.suite || carte.sources);
        return (
          <Carreau
            key={index}
            id={ancreCarte(section, index)}
            className={carte.signal === "fort" ? "border-t-2 border-t-[#ff8a7a]/70" : ""}
          >
            {carte.signal ? (
              <div className="mb-3">
                <Signal signal={carte.signal} />
              </div>
            ) : null}
            <h4 className="font-sans text-base font-normal leading-snug text-foreground">{carte.titre}</h4>
            {carte.texte.length > 0 ? (
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-foreground/85">
                {courte ? <Texte spans={carte.texte} /> : phrase}
              </p>
            ) : null}
            {courte && carte.sources ? <SourcesCarte sources={carte.sources} /> : null}
            {replie ? (
              <div className="mt-auto">
                <Plus resume="Lire la suite">
                  {reste.length > 0 ? (
                    <p>
                      <Texte spans={reste} />
                    </p>
                  ) : null}
                  {carte.suite?.map((spans, i) => (
                    <p key={i}>
                      <Texte spans={spans} />
                    </p>
                  ))}
                  {carte.sources ? <SourcesCarte sources={carte.sources} /> : null}
                </Plus>
              </div>
            ) : null}
          </Carreau>
        );
      })}
    </div>
  );
}

function SourcesCarte({ sources }: { sources: Span[][] }) {
  return (
    <div className="mt-auto space-y-1 pt-4">
      {sources.map((spans, i) => (
        <p key={i} className="font-inter-tight text-xs leading-relaxed text-mid-gray">
          <Texte spans={spans} />
        </p>
      ))}
    </div>
  );
}

/**
 * La frise des échéances : un axe du temps de l'édition à la dernière
 * échéance, graduée par mois, avec la date du jour. Deux marqueurs trop
 * proches passent sur une seconde ligne plutôt que de se chevaucher.
 */
function Frise({
  echeances,
  section,
  maintenant,
}: {
  echeances: (Echeance & { date: Date })[];
  section: number;
  maintenant: Date;
}) {
  const premiere = echeances[0].date;
  const derniere = echeances[echeances.length - 1].date;
  const debut = new Date(Date.UTC(premiere.getUTCFullYear(), premiere.getUTCMonth(), 1));
  const fin = new Date(Date.UTC(derniere.getUTCFullYear(), derniere.getUTCMonth() + 1, 1));
  const etendue = fin.getTime() - debut.getTime();
  const position = (date: Date) => ((date.getTime() - debut.getTime()) / etendue) * 100;

  const mois: Date[] = [];
  for (let d = new Date(debut); d < fin; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) {
    mois.push(d);
  }

  // Deux lignes de marqueurs : on alterne dès que le précédent est trop près.
  const ECART = 7;
  let derniereLigne0 = -Infinity;
  const places = echeances.map((e, index) => {
    const x = position(e.date);
    const ligne = x - derniereLigne0 < ECART ? 1 : 0;
    if (ligne === 0) derniereLigne0 = x;
    return { e, index, x, ligne };
  });

  const auj = maintenant >= debut && maintenant < fin ? position(maintenant) : null;

  return (
    <figure className="mt-6 border border-dark-gray bg-jet/40 px-5 pb-4 pt-5" aria-label="Frise des échéances">
      <div className="relative h-20">
        {/* Graduations mensuelles */}
        {mois.map((m) => (
          <div
            key={m.toISOString()}
            className="absolute bottom-0 top-0 border-l border-dark-gray"
            style={{ left: `${position(m)}%` }}
          >
            <span className="absolute bottom-0 left-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
              {new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: "UTC" }).format(m)}
            </span>
          </div>
        ))}
        {/* Ligne de temps */}
        <div className="absolute inset-x-0 top-[38px] h-px bg-mid-gray/50" />
        {auj !== null ? (
          <div className="absolute top-0 h-[52px] border-l border-dashed border-accent-secondary" style={{ left: `${auj}%` }}>
            <span className="absolute -top-0.5 left-1 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-accent-secondary">
              Auj.
            </span>
          </div>
        ) : null}
        {places.map(({ e, index, x, ligne }) => {
          const passee = e.date.getTime() < maintenant.getTime() - JOUR;
          return (
            <a
              key={index}
              href={`#${ancreEcheance(section, index + 1)}`}
              title={`${e.libelle}${passee ? " (passée)" : ""}`}
              aria-label={`Échéance ${index + 1} : ${e.libelle}${passee ? ", passée" : ""}`}
              className={`cto-lien-plein absolute flex h-5 w-5 -translate-x-1/2 items-center justify-center font-mono text-[10px] transition-opacity hover:opacity-80 ${
                passee
                  ? "border border-dark-gray bg-obsidian text-mid-gray"
                  : "bg-accent-secondary text-obsidian"
              }`}
              style={{ left: `${x}%`, top: ligne === 0 ? 28 : 8 }}
            >
              {index + 1}
            </a>
          );
        })}
      </div>
    </figure>
  );
}

function Echeancier({
  echeances,
  section,
  maintenant,
}: {
  echeances: Echeance[];
  section: number;
  maintenant: Date;
}) {
  const datees = echeancesDatees(echeances);

  return (
    <>
      {datees.length >= 2 ? <Frise echeances={datees} section={section} maintenant={maintenant} /> : null}
      <ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {datees.map((e, index) => {
          const jours = joursAvant(e.date, maintenant);
          const passee = jours < 0;
          const tone: Tone = passee ? "neutre" : jours <= 7 ? "alerte" : jours <= 30 ? "attention" : "neutre";
          return (
            <li key={index} id={ancreEcheance(section, index + 1)} className="scroll-mt-8">
              <Carreau className={`h-full ${passee ? "opacity-70" : ""}`}>
                <div className="flex flex-col items-start gap-2">
                  <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
                    <span
                      aria-hidden
                      className={`inline-flex h-5 w-5 items-center justify-center text-[10px] ${
                        passee ? "border border-dark-gray text-mid-gray" : "bg-accent-secondary text-obsidian"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {e.libelle}
                  </p>
                  <Pastille tone={tone}>
                    {passee ? "Passée" : jours === 0 ? "Aujourd'hui" : `J-${jours}`}
                  </Pastille>
                </div>
                <p className="mt-3 font-inter-tight text-sm leading-relaxed text-foreground/85">
                  <Texte spans={e.texte} />
                </p>
              </Carreau>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function Questions({ questions }: { questions: Span[][] }) {
  return (
    <ol className="mt-6 grid gap-3 lg:grid-cols-3">
      {questions.map((question, index) => (
        <li key={index}>
          <Carreau className="h-full">
            <p className="font-sans text-3xl font-light leading-none text-accent-secondary" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-4 font-inter-tight text-sm leading-relaxed text-foreground/90">
              <Texte spans={question} />
            </p>
          </Carreau>
        </li>
      ))}
    </ol>
  );
}

function Reste({ blocs, base }: { blocs: Block[]; base: string }) {
  if (blocs.length === 0) return null;
  return (
    <div className="mt-6">
      <CorpsLettre body={blocs} base={base} />
    </div>
  );
}

function RenduSection({
  section,
  index,
  axes,
  maintenant,
  base,
  avecTitre = true,
}: {
  section: Section;
  index: number;
  axes: Map<number, string>;
  maintenant: Date;
  base: string;
  /** Faux dans un repli, dont le résumé porte déjà le titre. */
  avecTitre?: boolean;
}) {
  const id = ancreSection(index);
  const signal = section.signal;
  const titre = (sousTitre?: string) =>
    avecTitre && section.titre ? (
      <TitreSection id={id} titre={section.titre} sousTitre={sousTitre} signal={signal} />
    ) : null;
  const labelle = avecTitre && section.titre ? id : undefined;

  switch (section.kind) {
    case "prose":
      return (
        <section aria-labelledby={labelle}>
          {titre()}
          <CorpsLettre body={section.blocs} base={base} />
        </section>
      );
    case "axes":
      return (
        <section aria-labelledby={labelle}>
          {titre(`${section.axes.length} axes`)}
          <GrilleAxes axes={section.axes} />
        </section>
      );
    case "actions": {
      const urgentes = section.actions.filter((a) => a.urgence === "semaine").length;
      const unite = normaliserTitre(section.titre).startsWith("a decider") ? "point" : "action";
      return (
        <section aria-labelledby={labelle}>
          {titre(
            `${section.actions.length} ${unite}${section.actions.length > 1 ? "s" : ""}${
              urgentes > 0 ? ` · ${urgentes} cette semaine` : ""
            }`,
          )}
          <Reste blocs={section.chapeau} base={base} />
          <div className="mt-6 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {section.actions.map((action) => (
              <CarteAction
                key={action.numero}
                id={ancreAction(index, action.numero)}
                action={action}
                axes={axes}
              />
            ))}
          </div>
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    }
    case "options":
      return (
        <section aria-labelledby={labelle}>
          {titre()}
          <Reste blocs={section.chapeau} base={base} />
          <GrilleOptions options={section.options} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "avancement":
      return (
        <section aria-labelledby={labelle}>
          {titre(`${section.chantiers.length} chantier${section.chantiers.length > 1 ? "s" : ""}`)}
          <Reste blocs={section.chapeau} base={base} />
          <GrilleChantiers chantiers={section.chantiers} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "cartes":
      return (
        <section aria-labelledby={labelle}>
          {titre()}
          <Reste blocs={section.chapeau} base={base} />
          <GrilleCartes cartes={section.cartes} section={index} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "echeancier":
      return (
        <section aria-labelledby={labelle}>
          {titre(`${section.echeances.length} échéance${section.echeances.length > 1 ? "s" : ""}`)}
          <Echeancier echeances={section.echeances} section={index} maintenant={maintenant} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "questions":
      return (
        <section aria-labelledby={labelle}>
          {titre()}
          <Questions questions={section.questions} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
  }
}

/**
 * La lettre en trois temps : l'essentiel au premier écran, puis ce qu'il faut
 * faire, ce qui bouge, et le reste replié.
 */
export function LettreEnGrille({
  structure,
  chapo,
  base = ESPACE_PATH,
  maintenant = new Date(),
}: {
  structure: LettreStructuree;
  chapo: string | null;
  base?: string;
  maintenant?: Date;
}) {
  const lu = lecture(structure);

  // Un chapô qui n'est qu'une note de méthode descend avec le reste : le
  // premier écran est réservé à ce qui se décide.
  const methode = chapo !== null && estNoteDeMethode(chapo);
  // Les éditions ouvrent souvent sur la même ligne que le chapô : l'afficher
  // deux fois de suite n'apprend rien.
  const intro = structure.intro.filter(
    (bloc) => !(chapo && bloc.k === "p" && texteDe(bloc.s).trim() === chapo.trim()),
  );

  const axes = new Map<number, string>();
  for (const section of structure.sections) {
    if (section.kind === "axes") for (const axe of section.axes) axes.set(axe.numero, axe.nom);
  }

  const rendu = ({ section, index }: SectionPlacee, avecTitre = true) => (
    <RenduSection
      key={index}
      section={section}
      index={index}
      axes={axes}
      maintenant={maintenant}
      base={base}
      avecTitre={avecTitre}
    />
  );

  const nbPlus = lu.reste.length + (methode || intro.length > 0 ? 1 : 0);
  let rubriquePrecedente = "";

  return (
    <>
      {chapo && !methode ? (
        <p className="mt-8 max-w-[68ch] border-l-2 border-l-accent-secondary pl-4 font-inter-tight text-base leading-relaxed text-foreground">
          {chapo}
        </p>
      ) : null}

      <Essentiel structure={structure} lu={lu} maintenant={maintenant} base={base} />
      <NavGroupes
        comptes={[
          { cle: "agir", n: lu.agir.length },
          { cle: "suivre", n: lu.suivre.length + lu.sansSignal.length },
          { cle: "plus", n: nbPlus },
        ]}
      />

      {lu.agir.length > 0 ? <Groupe cle="agir">{lu.agir.map((p) => rendu(p))}</Groupe> : null}

      {lu.suivre.length + lu.sansSignal.length > 0 ? (
        <Groupe cle="suivre">
          {lu.suivre.map((placee) => {
            // Les thèmes d'une même rubrique (« Actualités par thème ») sous
            // un seul intertitre.
            const rubrique = placee.section.rubrique ? texteDe(placee.section.rubrique) : "";
            const intertitre = rubrique && rubrique !== rubriquePrecedente ? rubrique : null;
            rubriquePrecedente = rubrique;
            return (
              <div key={placee.index}>
                {intertitre ? (
                  <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">{intertitre}</p>
                ) : null}
                {rendu(placee)}
              </div>
            );
          })}
          {lu.sansSignal.length > 0 ? (
            <div className="mt-10 border-t border-dark-gray">
              <Repli
                titre={`Sans signal cette fois (${lu.sansSignal.length})`}
                resume={lu.sansSignal.map((p) => (p.section.titre ? texteDe(p.section.titre) : "")).join(" · ")}
              >
                {lu.sansSignal.map((p) => rendu(p))}
              </Repli>
            </div>
          ) : null}
        </Groupe>
      ) : null}

      {nbPlus > 0 ? (
        <Groupe cle="plus">
          <div className="mt-2">
            {lu.reste.map((placee) => (
              <Repli
                key={placee.index}
                id={ancreSection(placee.index)}
                titre={placee.section.titre ? <Texte spans={placee.section.titre} /> : "Suite"}
              >
                {rendu(placee, false)}
              </Repli>
            ))}
            {methode || intro.length > 0 ? (
              <Repli titre={methode ? "Note de méthode" : "Préambule"}>
                {methode ? (
                  <p className="font-inter-tight text-[15px] leading-relaxed text-foreground/90">{chapo}</p>
                ) : null}
                {intro.length > 0 ? <CorpsLettre body={intro} base={base} /> : null}
              </Repli>
            ) : null}
          </div>
        </Groupe>
      ) : null}
    </>
  );
}
