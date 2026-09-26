import type { ReactNode } from "react";
import type {
  Action,
  Block,
  Axe,
  Carte,
  Chantier,
  Echeance,
  LettreStructuree,
  Pression,
  Section,
  Span,
  Urgence,
} from "@cto/letters";
import { texteDe } from "@cto/letters";
import { CorpsLettre, Texte } from "./lettre";
import { Label, Panel, Stat, Tag, type Tone } from "./ui";
import { ESPACE_PATH } from "./session";

// ─────────────────────────────────────────────────────────────────────────────
// Une lettre de l'atelier (générale, sectorielle ou personnalisée), en grille.
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
  hausse: { label: "En hausse", tone: "alerte" },
  surveiller: { label: "À surveiller", tone: "attention" },
  stable: { label: "Stable", tone: "neutre" },
  baisse: { label: "En baisse", tone: "fait" },
  inconnue: { label: "Non qualifié", tone: "neutre" },
};

const ORDRE_PRESSION: Pression[] = ["hausse", "surveiller", "stable", "baisse", "inconnue"];

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

function TitreSection({ id, titre, sousTitre }: { id: string; titre: Span[]; sousTitre?: ReactNode }) {
  return (
    <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-dark-gray pb-3">
      <h2 id={id} className="scroll-mt-8 font-sans text-xl font-light text-foreground">
        <Texte spans={titre} />
      </h2>
      {sousTitre ? <Label>{sousTitre}</Label> : null}
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

// ─── En un coup d'œil ────────────────────────────────────────────────────────

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
              className={`flex h-9 min-w-0 flex-1 items-center justify-center font-mono text-[10px] transition-opacity first:rounded-l-[4px] last:rounded-r-[4px] hover:opacity-80 ${FOND[tone]} ${
                tone === "neutre" ? "text-foreground" : "text-obsidian"
              }`}
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

function CoupDOeil({ structure, maintenant }: { structure: LettreStructuree; maintenant: Date }) {
  const trouve = <K extends Section["kind"]>(kind: K) =>
    structure.sections.find((s): s is Extract<Section, { kind: K }> => s.kind === kind);

  const axes = trouve("axes");
  const actions = trouve("actions");
  const echeancier = trouve("echeancier");
  const questions = trouve("questions");
  const avancement = trouve("avancement");

  const enHausse = axes?.axes.filter((a) => a.pression === "hausse").length ?? 0;
  const urgentes = actions?.actions.filter((a) => a.urgence === "semaine").length ?? 0;
  const prochaine = echeancier?.echeances
    .filter((e) => e.date && e.date.getTime() >= maintenant.getTime() - JOUR)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime())[0];
  const dans = prochaine?.date ? joursAvant(prochaine.date, maintenant) : null;

  const stats: ReactNode[] = [];
  if (axes)
    stats.push(
      <Stat
        key="axes"
        label="Axes en hausse"
        value={`${enHausse} / ${axes.axes.length}`}
        tone={enHausse > axes.axes.length / 2 ? "alerte" : enHausse > 0 ? "attention" : "neutre"}
        hint="La pression monte sur ces sujets ce mois-ci"
      />,
    );
  if (actions)
    stats.push(
      <Stat
        key="actions"
        label={normaliserTitre(actions.titre).startsWith("a decider") ? "À décider" : "Actions sur l'existant"}
        value={String(actions.actions.length)}
        tone={urgentes > 0 ? "alerte" : actions.actions.some((a) => a.urgence === "mois") ? "attention" : "neutre"}
        hint={
          urgentes > 0
            ? `dont ${urgentes} cette semaine`
            : actions.actions.length === 1 && actions.actions[0].echeance
              ? actions.actions[0].echeance
              : undefined
        }
      />,
    );
  if (echeancier)
    stats.push(
      <Stat
        key="echeance"
        label="Prochaine échéance"
        value={prochaine?.date ? formatCourt(prochaine.date) : "—"}
        tone={dans !== null && dans <= 14 ? "attention" : "neutre"}
        hint={
          dans === null ? "Aucune échéance à venir" : dans <= 0 ? "Aujourd'hui" : `Dans ${dans} jour${dans > 1 ? "s" : ""}`
        }
      />,
    );
  if (avancement) {
    const enCours = avancement.chantiers.filter((c) => c.pourcentage !== null && c.pourcentage < 100).length;
    stats.push(
      <Stat
        key="chantiers"
        label="Chantiers suivis"
        value={String(avancement.chantiers.length)}
        hint={enCours > 0 ? `dont ${enCours} en cours` : undefined}
      />,
    );
  }
  if (questions)
    stats.push(
      <Stat
        key="questions"
        label="Questions au prestataire"
        value={String(questions.questions.length)}
        hint="À poser avant la prochaine intervention"
      />,
    );

  // Quatre repères au plus : au-delà, ce n'est plus un coup d'œil.
  stats.splice(4);
  if (stats.length === 0 && !axes) return null;

  return (
    <section aria-label="En un coup d'œil" className="mt-8">
      <Panel>
        {stats.length > 0 ? (
          <div
            className={`grid grid-cols-2 ${
              stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "sm:grid-cols-3" : ""
            }`}
          >
            {stats}
          </div>
        ) : null}
        {axes ? (
          <div className="border-t border-dark-gray">
            <BarrePression axes={axes.axes} />
          </div>
        ) : null}
      </Panel>
    </section>
  );
}

function Sommaire({ sections }: { sections: Section[] }) {
  const items = sections.flatMap((section, index) =>
    section.titre ? [{ href: `#${ancreSection(index)}`, label: texteDe(section.titre) }] : [],
  );
  if (items.length < 2) return null;

  return (
    <nav aria-label="Sommaire de la lettre" className="mt-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="border border-dark-gray px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:border-accent-secondary hover:text-foreground"
        >
          {item.label.replace(/\s*:\s*quelles solutions envisager\s*$/i, "")}
        </a>
      ))}
    </nav>
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
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                Axe {String(axe.numero).padStart(2, "0")}
              </p>
              <Pastille tone={tone}>{label}</Pastille>
            </div>
            <h3 className="mt-3 font-sans text-base font-normal leading-snug text-foreground">{axe.nom}</h3>
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

function CarteAction({ action, axes }: { action: Action; axes: Map<number, string> }) {
  const tone = URGENCE_TONE[action.urgence];
  const [concerne, ...sources] = action.sources;

  return (
    <Carreau className={tone === "alerte" ? "border-t-2 border-t-[#ff8a7a]/70" : ""}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {action.aFaire || action.periode ? `Action ${action.numero}` : `Point ${action.numero}`}
          {action.periode ? ` · ${action.periode}` : ""}
        </p>
        {action.echeance ? <Pastille tone={tone}>{action.echeance}</Pastille> : null}
      </div>
      <h3 className="mt-3 font-sans text-base font-normal leading-snug text-foreground">{action.titre}</h3>

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

      {!action.aFaire && action.contexte.length > 0 ? (
        // Une décision sans « À faire » (lettre rédigée à la main) : son texte
        // EST le contenu, il reste visible.
        <div className="mt-4 space-y-2 border-l-2 border-l-accent-secondary pl-3 font-inter-tight text-sm leading-relaxed text-foreground">
          {action.contexte.map((c, i) => (
            <p key={i}>
              {c.titre ? <strong className="font-medium">{c.titre} : </strong> : null}
              <Texte spans={c.texte} />
            </p>
          ))}
        </div>
      ) : null}

      {(action.aFaire && action.contexte.length > 0) || concerne ? (
        <div className="mt-auto">
          <Plus resume="Contexte, impact et coût">
            {action.contexte.map((c, i) => (
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
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-sans text-base font-normal leading-snug text-foreground">{chantier.titre}</h3>
            {chantier.statut ? (
              <Pastille tone={chantier.statut === "Livré" ? "fait" : "neutre"}>{chantier.statut}</Pastille>
            ) : null}
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

function GrilleCartes({ cartes }: { cartes: Carte[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cartes.map((carte, index) => (
        <Carreau key={index}>
          <h3 className="font-sans text-base font-normal leading-snug text-foreground">{carte.titre}</h3>
          <p className="mt-2 font-inter-tight text-sm leading-relaxed text-foreground/85">
            <Texte spans={carte.texte} />
          </p>
        </Carreau>
      ))}
    </div>
  );
}

/**
 * La frise des échéances : un axe du temps de l'édition à la dernière
 * échéance, graduée par mois, avec la date du jour. Deux marqueurs trop
 * proches passent sur une seconde ligne plutôt que de se chevaucher.
 */
function Frise({ echeances, maintenant }: { echeances: (Echeance & { date: Date })[]; maintenant: Date }) {
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
              href={`#echeance-${index + 1}`}
              title={`${e.libelle}${passee ? " (passée)" : ""}`}
              aria-label={`Échéance ${index + 1} : ${e.libelle}${passee ? ", passée" : ""}`}
              className={`absolute flex h-5 w-5 -translate-x-1/2 items-center justify-center font-mono text-[10px] transition-opacity hover:opacity-80 ${
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

function Echeancier({ echeances, maintenant }: { echeances: Echeance[]; maintenant: Date }) {
  const datees = echeances
    .filter((e): e is Echeance & { date: Date } => e.date !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <>
      {datees.length >= 2 ? <Frise echeances={datees} maintenant={maintenant} /> : null}
      <ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {datees.map((e, index) => {
          const jours = joursAvant(e.date, maintenant);
          const passee = jours < 0;
          const tone: Tone = passee ? "neutre" : jours <= 7 ? "alerte" : jours <= 30 ? "attention" : "neutre";
          return (
            <li key={index} id={`echeance-${index + 1}`} className="scroll-mt-8">
              <Carreau className={`h-full ${passee ? "opacity-70" : ""}`}>
                <div className="flex items-start justify-between gap-3">
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
}: {
  section: Section;
  index: number;
  axes: Map<number, string>;
  maintenant: Date;
  base: string;
}) {
  const id = ancreSection(index);

  switch (section.kind) {
    case "prose":
      return (
        <section aria-labelledby={section.titre ? id : undefined}>
          {section.titre ? <TitreSection id={id} titre={section.titre} /> : null}
          <CorpsLettre body={section.blocs} base={base} />
        </section>
      );
    case "axes":
      return (
        <section aria-labelledby={id}>
          <TitreSection id={id} titre={section.titre} sousTitre={`${section.axes.length} axes`} />
          <GrilleAxes axes={section.axes} />
        </section>
      );
    case "actions": {
      const urgentes = section.actions.filter((a) => a.urgence === "semaine").length;
      return (
        <section aria-labelledby={id}>
          <TitreSection
            id={id}
            titre={section.titre}
            sousTitre={`${section.actions.length} ${
              normaliserTitre(section.titre).startsWith("a decider") ? "point" : "action"
            }${section.actions.length > 1 ? "s" : ""}${urgentes > 0 ? ` · ${urgentes} cette semaine` : ""}`}
          />
          <div className="mt-6 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {section.actions.map((action) => (
              <CarteAction key={action.numero} action={action} axes={axes} />
            ))}
          </div>
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    }
    case "options":
      return (
        <section aria-labelledby={id}>
          <TitreSection id={id} titre={section.titre} />
          <GrilleOptions options={section.options} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "avancement":
      return (
        <section aria-labelledby={id}>
          <TitreSection
            id={id}
            titre={section.titre}
            sousTitre={`${section.chantiers.length} chantier${section.chantiers.length > 1 ? "s" : ""}`}
          />
          <GrilleChantiers chantiers={section.chantiers} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "cartes":
      return (
        <section aria-labelledby={id}>
          <TitreSection id={id} titre={section.titre} />
          <GrilleCartes cartes={section.cartes} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "echeancier":
      return (
        <section aria-labelledby={id}>
          <TitreSection
            id={id}
            titre={section.titre}
            sousTitre={`${section.echeances.length} échéance${section.echeances.length > 1 ? "s" : ""}`}
          />
          <Echeancier echeances={section.echeances} maintenant={maintenant} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
    case "questions":
      return (
        <section aria-labelledby={id}>
          <TitreSection id={id} titre={section.titre} />
          <Questions questions={section.questions} />
          <Reste blocs={section.blocs} base={base} />
        </section>
      );
  }
}

/** La lettre en grille : coup d'œil, sommaire, puis chaque section dans sa forme. */
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
  // Les éditions « Veilles clients » ouvrent sur la même ligne que le chapô :
  // l'afficher deux fois de suite n'apprend rien.
  const intro = structure.intro.filter(
    (bloc) => !(chapo && bloc.k === "p" && texteDe(bloc.s).trim() === chapo.trim()),
  );

  const axes = new Map<number, string>();
  for (const section of structure.sections) {
    if (section.kind === "axes") for (const axe of section.axes) axes.set(axe.numero, axe.nom);
  }

  return (
    <>
      {chapo ? (
        <p className="mt-8 max-w-[68ch] border-l-2 border-l-accent-secondary pl-4 font-inter-tight text-base leading-relaxed text-foreground">
          {chapo}
        </p>
      ) : null}

      <CoupDOeil structure={structure} maintenant={maintenant} />
      <Sommaire sections={structure.sections} />

      {intro.length > 0 ? (
        <div className="mt-4">
          <CorpsLettre body={intro} base={base} />
        </div>
      ) : null}

      <article>
        {structure.sections.map((section, index) => (
          <RenduSection key={index} section={section} index={index} axes={axes} maintenant={maintenant} base={base} />
        ))}
      </article>
    </>
  );
}
