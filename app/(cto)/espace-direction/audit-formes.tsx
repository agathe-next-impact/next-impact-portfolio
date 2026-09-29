import type { Block, Span } from "@cto/letters";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  estColonneGravite,
  estColonneScore,
  estColonneSolution,
  estMensuel,
  estTableauScenarios,
  etatVersion,
  lireGravite,
  lireNombre,
  lireNomScenario,
  lirePlanAction,
  lireReference,
  lireSolution,
  lireStatutScenario,
  registreEncadre,
  roleColonneScenario,
  statutScore,
  type EtatVersion,
  type Gravite,
  type PlanAction,
  type Registre,
  type RoleScenario,
  type Statut,
  type StatutScenario,
} from "@cto/espace";
import { BadgeGravite } from "./gravite";
import { CorpsLettre, Texte } from "./lettre";
import { formatAmount, Label } from "./ui";

/**
 * Retrouve la proposition publiée pour un scénario, par son nom : son adresse
 * et sa réponse. Null quand rien n'est publié (audit pas encore validé).
 */
export type PropositionDeScenario = (nomScenario: string) => { href: string; statut: string | null } | null;

// ─────────────────────────────────────────────────────────────────────────────
// Les formes d'un audit, pensées pour une lecture « situation → solutions
// préconisées ». La reconnaissance est dans `@cto/espace/lecture-audit`, pure
// et testée ; ici, seulement la mise en forme :
//
//  - encadrés : « Problèmes majeurs » en rouge (situation), « Actions
//    prioritaires » en accent (solutions), côte à côte quand ils se suivent ;
//  - puces : la référence finale « (SEC-05, 1 à 3 h) » devient des étiquettes ;
//  - tableaux de constats : une carte par ligne, situation à gauche, solution
//    préconisée à droite, triée par gravité ;
//  - scores PageSpeed : jauge aux seuils Lighthouse, libellé toujours écrit ;
//  - tableaux de scénarios : une carte par scénario, le retenu en tête, les
//    chiffres en repères et les textes longs (risques, conditions) repliés ;
//  - plan d'action chiffré : les tâches regroupées par proposition, chaque
//    groupe sous ses totaux (heures ponctuelles, heures par mois, coût) ;
//  - cellules longues d'un tableau ordinaire : repliées derrière un extrait.
//
// La couleur ne porte jamais seule l'information : chaque teinte a son libellé.
// ─────────────────────────────────────────────────────────────────────────────

const texteDe = (spans: Span[] | undefined) => (spans ?? []).map((span) => span.t).join("");

/** Retire les `n` derniers caractères d'une suite de spans, mise en forme conservée. */
export function couperFin(spans: Span[], n: number): Span[] {
  const out = spans.map((span) => ({ ...span }));
  let reste = n;
  while (reste > 0 && out.length > 0) {
    const dernier = out[out.length - 1];
    if (dernier.t.length <= reste) {
      reste -= dernier.t.length;
      out.pop();
    } else {
      dernier.t = dernier.t.slice(0, dernier.t.length - reste);
      reste = 0;
    }
  }
  return out;
}

// ── Étiquettes ───────────────────────────────────────────────────────────────

export function Code({ children }: { children: string }) {
  return (
    <span className="inline-flex whitespace-nowrap border border-dark-gray bg-obsidian px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] text-foreground">
      {children}
    </span>
  );
}

function Effort({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
      <span aria-hidden>◷</span>
      <span className="sr-only">Charge estimée :</span>
      {children}
    </span>
  );
}

/** Une puce d'audit : le texte, puis sa référence en étiquettes. */
export function PuceAudit({ spans }: { spans: Span[] }) {
  const brut = texteDe(spans);
  const ref = lireReference(brut);
  if (!ref) return <Texte spans={spans} />;
  const texte = couperFin(spans, brut.length - ref.reste.length);
  return (
    <>
      <Texte spans={texte} />
      <span className="ml-2 inline-flex flex-wrap items-center gap-1.5 align-middle">
        {ref.gravite ? <BadgeGravite gravite={ref.gravite} /> : null}
        {ref.codes.map((code) => (
          <Code key={code}>{code}</Code>
        ))}
        {ref.effort ? <Effort>{ref.effort}</Effort> : null}
      </span>
    </>
  );
}

// ── Encadrés ─────────────────────────────────────────────────────────────────

type BoxBlock = Extract<Block, { k: "box" }>;

/** Le registre d'un encadré : son texte propre, sinon son premier titre. */
export function registreBox(bloc: Block | undefined): Registre | null {
  if (!bloc || bloc.k !== "box") return null;
  if (bloc.s.length > 0) return registreEncadre(texteDe(bloc.s));
  const titre = bloc.c.find((enfant) => enfant.k === "h1" || enfant.k === "h2" || enfant.k === "h3");
  return titre && "s" in titre ? registreEncadre(texteDe(titre.s)) : null;
}

const REGISTRE: Record<Registre, { cadre: string; pastille: string; libelle: string }> = {
  situation: {
    cadre: "border-l-[#ff8a7a] bg-[#ff8a7a]/[0.05]",
    pastille: "border-[#ff8a7a]/50 text-[#ff8a7a]",
    libelle: "Situation",
  },
  solution: {
    cadre: "border-l-accent-secondary bg-accent-secondary/[0.06]",
    pastille: "border-accent-secondary/60 text-accent-secondary",
    libelle: "Solutions préconisées",
  },
};

export function Encadre({
  bloc,
  large,
  base,
  marge = true,
  propositions,
}: {
  bloc: BoxBlock;
  large: boolean;
  base: string;
  marge?: boolean;
  propositions?: PropositionDeScenario;
}) {
  const registre = registreBox(bloc);
  const style = registre ? REGISTRE[registre] : null;
  return (
    <div
      className={`${marge ? "mt-6" : ""} border border-dark-gray border-l-2 px-4 py-1 sm:px-5 ${
        style ? style.cadre : "border-l-accent-secondary bg-jet/30"
      }`}
    >
      {style ? (
        <p className="mt-4">
          <span className={`inline-flex border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${style.pastille}`}>
            {registre === "solution" ? "→ " : ""}
            {style.libelle}
          </span>
        </p>
      ) : null}
      {bloc.s.length > 0 ? (
        <p className="mt-4 font-inter-tight text-[15px] leading-relaxed text-foreground">
          <Texte spans={bloc.s} />
        </p>
      ) : null}
      <div className="pb-4">
        <CorpsLettre body={bloc.c} large={large} base={base} propositions={propositions} />
      </div>
    </div>
  );
}

/** Une situation suivie de ses solutions : côte à côte dès qu'il y a la place. */
export function PaireEncadres({
  situation,
  solution,
  large,
  base,
  propositions,
}: {
  situation: BoxBlock;
  solution: BoxBlock;
  large: boolean;
  base: string;
  propositions?: PropositionDeScenario;
}) {
  return (
    <div className="mt-6 grid items-stretch gap-3 lg:grid-cols-2">
      <Encadre bloc={situation} large={large} base={base} marge={false} propositions={propositions} />
      <Encadre bloc={solution} large={large} base={base} marge={false} propositions={propositions} />
    </div>
  );
}

// ── Scores ───────────────────────────────────────────────────────────────────

const STATUT: Record<Statut, { fond: string; libelle: string }> = {
  bon: { fond: "bg-[#7fd8a4]", libelle: "bon" },
  moyen: { fond: "bg-[#f2c94c]", libelle: "à améliorer" },
  faible: { fond: "bg-[#ff8a7a]", libelle: "faible" },
};

function Score({ valeur }: { valeur: string }) {
  const n = Number(valeur.replace(",", "."));
  const statut = STATUT[statutScore(n)];
  return (
    <span className="flex min-w-[4.5rem] flex-col gap-1" title={`${Math.round(n)} / 100, ${statut.libelle}`}>
      <span className="flex items-baseline gap-1.5">
        <span className="font-sans text-base tabular-nums text-foreground">{Math.round(n)}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">{statut.libelle}</span>
      </span>
      <span aria-hidden className="block h-1 w-full bg-dark-gray">
        <span className={`block h-full ${statut.fond}`} style={{ width: `${Math.max(0, Math.min(100, n))}%` }} />
      </span>
    </span>
  );
}

// ── Tableaux ─────────────────────────────────────────────────────────────────

type TableBlock = Extract<Block, { k: "table" }>;

const RANG: Record<Gravite, number> = { critique: 0, eleve: 1, modere: 2, faible: 3 };

/**
 * Un tableau d'audit. Avec une colonne de solution, il devient une liste de
 * constats en cartes ; sinon il reste un tableau, gravité en tête et scores
 * en jauges.
 */
export function TableauAudit({ bloc, propositions }: { bloc: TableBlock; propositions?: PropositionDeScenario }) {
  const entetes = (bloc.head ?? []).map(texteDe);
  const colGravite = entetes.findIndex(estColonneGravite);
  const colSolution = entetes.findIndex(estColonneSolution);

  if (bloc.head && estTableauScenarios(entetes) && bloc.rows.length > 0) {
    return <Scenarios bloc={bloc} entetes={entetes} propositions={propositions} />;
  }

  const plan = bloc.head ? lirePlanAction(entetes, bloc.rows.map((ligne) => ligne.map(texteDe))) : null;
  if (plan) return <PlanActionGroupe bloc={bloc} entetes={entetes} plan={plan} propositions={propositions} />;

  if (bloc.head && colSolution >= 0 && bloc.rows.length > 0) {
    return <Constats bloc={bloc} entetes={entetes} colGravite={colGravite} colSolution={colSolution} />;
  }

  const scores = new Set(
    entetes.flatMap((entete, i) => (estColonneScore(entete, bloc.rows.map((ligne) => texteDe(ligne[i]))) ? [i] : [])),
  );
  const ordre = (n: number) => {
    const indices = Array.from({ length: n }, (_, i) => i);
    return colGravite < 0 ? indices : [colGravite, ...indices.filter((i) => i !== colGravite)];
  };

  return (
    <figure className="mt-6">
      {bloc.title ? (
        <figcaption className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">{bloc.title}</figcaption>
      ) : null}
      {bloc.rows.length === 0 ? (
        <p className="font-inter-tight text-sm text-mid-gray">Aucune ligne.</p>
      ) : (
        <>
        {/* Mobile : une ligne = un accordéon. Le tableau défilant ne se lisait
            pas sur un écran étroit ; replié, chaque ligne montre son intitulé
            (et sa gravité), les autres colonnes s'empilent dessous. */}
        <ul className="divide-y divide-dark-gray border border-dark-gray sm:hidden">
          {bloc.rows.map((ligne, index) => {
            const colTitre = colGravite === 0 ? 1 : 0;
            const texteGravite = colGravite >= 0 ? texteDe(ligne[colGravite]) : "";
            const gravite = texteGravite ? lireGravite(texteGravite) : null;
            const autres = ordre(ligne.length).filter((colonne) => colonne !== colTitre && colonne !== colGravite);
            return (
              <li key={index}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none flex-col items-start gap-2 px-4 py-3 transition-colors hover:bg-jet/70 [&::-webkit-details-marker]:hidden">
                    {gravite ? <BadgeGravite gravite={gravite} /> : null}
                    <span className="flex w-full items-start justify-between gap-3">
                      <span className="min-w-0 font-inter-tight text-sm leading-snug text-foreground">
                        <Texte spans={ligne[colTitre] ?? []} />
                      </span>
                      <span aria-hidden className="shrink-0 font-mono text-sm text-mid-gray group-open:text-accent-secondary">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </span>
                  </summary>
                  <dl className="space-y-3 px-4 pb-4">
                    {autres.map((colonne) => {
                      const cellule = ligne[colonne];
                      const texte = texteDe(cellule);
                      if (!texte.trim()) return null;
                      return (
                        <div key={colonne}>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                            {bloc.head ? <Texte spans={bloc.head[colonne] ?? []} /> : null}
                          </dt>
                          <dd className="mt-1 font-inter-tight text-[13px] leading-relaxed text-foreground/90">
                            {scores.has(colonne) ? <Score valeur={texte} /> : <Texte spans={cellule} />}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </details>
              </li>
            );
          })}
        </ul>
        <div className="hidden overflow-x-auto border border-dark-gray sm:block">
          <table className="w-full min-w-[36rem] border-collapse text-left font-inter-tight text-[13px] leading-relaxed">
            {bloc.head ? (
              <thead className="bg-jet/50">
                <tr>
                  {ordre(bloc.head.length).map((index) => (
                    <th
                      key={index}
                      scope="col"
                      className="border-b border-dark-gray px-3 py-2 align-bottom font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-mid-gray"
                    >
                      <Texte spans={bloc.head![index]} />
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody className="divide-y divide-dark-gray">
              {bloc.rows.map((ligne, index) => (
                <tr key={index}>
                  {ordre(ligne.length).map((colonne) => {
                    const cellule = ligne[colonne];
                    const texte = texteDe(cellule);
                    const gravite = colonne === colGravite ? lireGravite(texte) : null;
                    return (
                      <td key={colonne} className="px-3 py-2 align-top text-foreground/90">
                        {gravite ? (
                          <BadgeGravite gravite={gravite} />
                        ) : scores.has(colonne) && texte.trim() ? (
                          <Score valeur={texte} />
                        ) : texte.length > CELLULE_LONGUE ? (
                          <CelluleRepliee spans={cellule} texte={texte} />
                        ) : (
                          <Texte spans={cellule} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
      {scores.size > 0 ? (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
          Seuils Lighthouse : 90 et plus bon · 50 à 89 à améliorer · moins de 50 faible
        </p>
      ) : null}
    </figure>
  );
}

/** Une cellule courte (« Prod », « mobile ») : une étiquette, pas un paragraphe. */
const estCourte = (texte: string) => texte.length > 0 && texte.length <= 24 && texte.split(/\s+/).length <= 3;

function Constats({
  bloc,
  entetes,
  colGravite,
  colSolution,
}: {
  bloc: TableBlock;
  entetes: string[];
  colGravite: number;
  colSolution: number;
}) {
  const colTitre = 0;
  const lignes = bloc.rows
    .map((ligne, index) => ({ ligne, index, gravite: colGravite >= 0 ? lireGravite(texteDe(ligne[colGravite])) : null }))
    .sort((a, b) => (a.gravite ? RANG[a.gravite] : 9) - (b.gravite ? RANG[b.gravite] : 9) || a.index - b.index);

  return (
    <section className="mt-6" aria-label={bloc.title || "Constats"}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        {bloc.title ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">{bloc.title}</p>
        ) : null}
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
          {lignes.length} {lignes.length > 1 ? "constats" : "constat"}
        </p>
      </div>
      <ol className="grid gap-3">
        {lignes.map(({ ligne, index, gravite }) => {
          const autres = ligne
            .map((cellule, colonne) => ({ colonne, texte: texteDe(cellule), cellule }))
            .filter(({ colonne }) => colonne !== colTitre && colonne !== colSolution && colonne !== colGravite);
          const etiquettes = autres.filter(({ texte }) => estCourte(texte));
          const details = autres.filter(({ texte }) => texte.length > 0 && !estCourte(texte));
          const solutionBrute = texteDe(ligne[colSolution]);
          const solution = lireSolution(solutionBrute);

          return (
            <li key={index} className="border border-dark-gray bg-jet/40">
              {/* Mobile : gravité, intitulé, puis étiquettes, empilés ; en ligne dès `sm`. */}
              <header className="flex flex-col items-start gap-2 border-b border-dark-gray px-5 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                {gravite ? <BadgeGravite gravite={gravite} /> : null}
                <h4 className="min-w-0 font-sans text-base font-normal text-foreground sm:flex-1">
                  <Texte spans={ligne[colTitre] ?? []} />
                </h4>
                {etiquettes.length > 0 ? (
                  <span className="flex flex-wrap gap-1.5 sm:contents">
                    {etiquettes.map(({ colonne, texte }) => (
                      <span
                        key={colonne}
                        title={entetes[colonne]}
                        className="border border-dark-gray px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray"
                      >
                        {texte}
                      </span>
                    ))}
                  </span>
                ) : null}
              </header>
              <div className="grid md:grid-cols-2">
                <div className="px-5 py-4">
                  <Label>Situation</Label>
                  {details.length === 0 ? (
                    <p className="mt-2 font-inter-tight text-sm text-mid-gray">—</p>
                  ) : (
                    details.map(({ colonne, cellule }) => (
                      <div key={colonne} className="mt-2">
                        {details.length > 1 ? (
                          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">{entetes[colonne]}</p>
                        ) : null}
                        <p className="font-inter-tight text-sm leading-relaxed text-foreground/90">
                          <Texte spans={cellule} />
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-dark-gray bg-accent-secondary/[0.06] px-5 py-4 md:border-l md:border-t-0">
                  <p className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
                      → Solution préconisée
                    </span>
                    {solution?.codes.map((code) => (
                      <Code key={code}>{code}</Code>
                    ))}
                  </p>
                  <p className="mt-2 font-inter-tight text-sm leading-relaxed text-foreground">
                    {solution ? (
                      solution.texte.charAt(0).toUpperCase() + solution.texte.slice(1)
                    ) : solutionBrute ? (
                      <Texte spans={ligne[colSolution]} />
                    ) : (
                      <span className="text-mid-gray">—</span>
                    )}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ── Plan d'action ────────────────────────────────────────────────────────────

const nombreFr = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

/** « 6,5 h · 3 h / mois », « 1 200 € · 90 € / mois ». */
function Totaux({ heures, cout }: { heures: { ponctuel: number; mensuel: number } | null; cout: { ponctuel: number; mensuel: number } | null }) {
  const parts: string[] = [];
  if (heures?.ponctuel) parts.push(`${nombreFr(heures.ponctuel)} h`);
  if (heures?.mensuel) parts.push(`${nombreFr(heures.mensuel)} h / mois`);
  if (cout?.ponctuel) parts.push(formatAmount(cout.ponctuel)!);
  if (cout?.mensuel) parts.push(`${formatAmount(cout.mensuel)} / mois`);
  if (parts.length === 0) return null;
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.1em] tabular-nums text-foreground">{parts.join(" · ")}</span>
  );
}

/**
 * Un plan d'action chiffré, groupé par proposition comme dans la vue Notion :
 * d'abord une ligne par proposition avec ses totaux, pour comparer d'un coup
 * d'œil ; puis chaque proposition et ses tâches, triées par axe. Toutes sont
 * repliées : les totaux ci-dessus suffisent à comparer.
 */
function PlanActionGroupe({
  bloc,
  entetes,
  plan,
  propositions,
}: {
  bloc: TableBlock;
  entetes: string[];
  plan: PlanAction;
  propositions?: PropositionDeScenario;
}) {
  // Groupé par proposition : chaque groupe mène à la sienne, quand elle est publiée.
  const parProposition = /^propos/i.test(entetes[plan.colGroupe] ?? "");
  const lien = (nom: string) => (parProposition && propositions ? propositions(nom) : null);
  const pris = new Set([0, plan.colGroupe, plan.colAxe, plan.colHeures, plan.colFrequence, plan.colCout]);
  const autres = entetes.map((_, i) => i).filter((i) => !pris.has(i));

  return (
    <section className="mt-6" aria-label={bloc.title || "Plan d'action"}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">{bloc.title || "Plan d'action"}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
          {bloc.rows.length} actions · {plan.groupes.length}{" "}
          {/^propos/i.test(entetes[plan.colGroupe] ?? "") ? "propositions" : "volets"}
        </p>
      </div>

      <ul className="grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 xl:grid-cols-3">
        {plan.groupes.map((groupe) => (
          <li key={groupe.nom} className="bg-jet/60 px-4 py-3">
            <p className="font-sans text-[15px] leading-snug text-foreground">{groupe.nom}</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <Totaux heures={groupe.heures} cout={groupe.cout} />
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                {groupe.lignes.length} {groupe.lignes.length > 1 ? "actions" : "action"}
              </span>
            </p>
            {lien(groupe.nom) ? <LienProposition {...lien(groupe.nom)!} className="mt-2 inline-block" /> : null}
          </li>
        ))}
      </ul>

      <div className="mt-3 grid gap-3">
        {plan.groupes.map((groupe) => (
          <details key={groupe.nom} className="group border border-dark-gray bg-jet/30">
            {/* Mobile : l'intitulé (et son +), puis les totaux, puis le nombre d'actions, empilés. */}
            <summary className="flex cursor-pointer list-none flex-col items-start gap-1.5 px-5 py-3 transition-colors hover:bg-jet/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 [&::-webkit-details-marker]:hidden">
              <span className="flex w-full min-w-0 items-start justify-between gap-3 sm:w-auto sm:flex-1">
                <span className="min-w-0 font-sans text-base text-foreground">{groupe.nom}</span>
                <SigneRepli className="sm:hidden" />
              </span>
              <Totaux heures={groupe.heures} cout={groupe.cout} />
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                {groupe.lignes.length} {groupe.lignes.length > 1 ? "actions" : "action"}
              </span>
              <SigneRepli className="hidden sm:inline" />
            </summary>
            <ol className="divide-y divide-dark-gray border-t border-dark-gray">
              {groupe.lignes.map((index) => {
                const ligne = bloc.rows[index];
                const cellule = (col: number) => (col >= 0 ? texteDe(ligne[col]).trim() : "");
                const mensuel = plan.colFrequence >= 0 && estMensuel(cellule(plan.colFrequence));
                const heures = lireNombre(cellule(plan.colHeures));
                const cout = lireNombre(cellule(plan.colCout));
                const suffixe = mensuel ? " / mois" : "";
                const axe = cellule(plan.colAxe) ? (
                  <span className="border border-dark-gray px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                    {cellule(plan.colAxe)}
                  </span>
                ) : null;
                const courtes = autres.map((col) =>
                  cellule(col) && cellule(col).length <= 40 ? (
                    <span key={col} title={entetes[col]} className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                      {cellule(col)}
                    </span>
                  ) : null,
                );
                const chiffre =
                  heures !== null || cout !== null ? (
                    <span className="whitespace-nowrap font-mono text-[11px] tabular-nums text-foreground sm:ml-auto sm:text-right">
                      {heures !== null ? `${nombreFr(heures)} h${suffixe}` : null}
                      {heures !== null && cout !== null ? " · " : null}
                      {cout !== null ? `${formatAmount(cout)}${suffixe}` : null}
                    </span>
                  ) : null;
                return (
                  <li key={index}>
                    {/* Mobile : l'action en accordéon, son axe et son chiffrage empilés dessous. */}
                    <details className="group/tache sm:hidden">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-jet/70 [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 font-inter-tight text-sm leading-relaxed text-foreground/90">
                          <Texte spans={ligne[0] ?? []} />
                        </span>
                        <span aria-hidden className="shrink-0 pt-0.5 font-mono text-sm text-mid-gray group-open/tache:text-accent-secondary">
                          <span className="group-open/tache:hidden">+</span>
                          <span className="hidden group-open/tache:inline">−</span>
                        </span>
                      </summary>
                      <div className="flex flex-col items-start gap-1.5 px-5 pb-3">
                        {axe}
                        {courtes}
                        {chiffre}
                      </div>
                    </details>
                    {/* Grand écran : une ligne, le chiffrage calé à droite. */}
                    <div className="hidden flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-2.5 sm:flex">
                      <span className="min-w-0 flex-1 basis-64 font-inter-tight text-sm leading-relaxed text-foreground/90">
                        <Texte spans={ligne[0] ?? []} />
                      </span>
                      {axe}
                      {courtes}
                      {chiffre}
                    </div>
                  </li>
                );
              })}
            </ol>
          </details>
        ))}
      </div>
    </section>
  );
}

// ── Accordéons ───────────────────────────────────────────────────────────────

/** Au-delà, une cellule de tableau ordinaire se replie derrière son extrait. */
const CELLULE_LONGUE = 160;

/** Un contenu long replié sous son titre. `<details>` natif : clavier et lecteur d'écran sans JavaScript. */
export function Accordeon({ titre, children }: { titre: ReactNode; children: ReactNode }) {
  return (
    <details className="group border-t border-dark-gray">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-jet/70 [&::-webkit-details-marker]:hidden">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray group-open:text-foreground">
          {titre}
        </span>
        <span aria-hidden className="font-mono text-sm text-mid-gray group-open:text-accent-secondary">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="px-5 pb-4 font-inter-tight text-sm leading-relaxed text-foreground/90">{children}</div>
    </details>
  );
}

/** Une cellule longue : son début, puis le reste à la demande. */
function CelluleRepliee({ spans, texte }: { spans: Span[]; texte: string }) {
  const extrait = texte.slice(0, 110).replace(/\s+\S*$/, "");
  return (
    <details className="group">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{extrait}… </span>
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
          <span className="group-open:hidden">Lire la suite +</span>
          <span className="hidden group-open:inline">Replier −</span>
        </span>
      </summary>
      <div className="mt-1">
        <Texte spans={spans} />
      </div>
    </details>
  );
}

// ── Scénarios ────────────────────────────────────────────────────────────────

const STATUT_SCENARIO: Record<StatutScenario, { rang: number; carte: string; badge: string; signe: string }> = {
  retenu: {
    rang: 0,
    carte: "border-accent-secondary bg-accent-secondary/[0.05]",
    badge: "border-accent-secondary bg-accent-secondary text-obsidian",
    signe: "✓ ",
  },
  possible: { rang: 1, carte: "border-dark-gray bg-jet/40", badge: "border-foreground/40 text-foreground", signe: "" },
  ecarte: { rang: 3, carte: "border-dark-gray bg-jet/20", badge: "border-dark-gray text-mid-gray", signe: "✕ " },
};

/** Une fourchette de montants : « 2 500 € », « 7 900 € à 15 700 € ». */
function fourchette(min: number | null, max: number | null): string | null {
  const a = formatAmount(min);
  const b = formatAmount(max);
  if (a && b) return min === max ? a : `${a} à ${b}`;
  return a ?? b;
}

function Repere({ label, children, large = false }: { label: string; children: ReactNode; large?: boolean }) {
  return (
    <div className={`bg-obsidian px-5 py-3 ${large ? "col-span-2" : ""}`}>
      <dt>
        <Label>{label}</Label>
      </dt>
      <dd className="mt-1 font-inter-tight text-sm leading-snug text-foreground">{children}</dd>
    </div>
  );
}

/**
 * Un tableau de scénarios, rendu en cartes comparables : treize colonnes ne se
 * lisent pas en ligne, trois cartes côte à côte, si. En tête de carte, ce qui
 * tranche (statut, note, coût, délai, constats résolus) ; le résumé ensuite ;
 * les textes longs (conditions de choix, risques) repliés en accordéons.
 */
function Scenarios({ bloc, entetes, propositions }: { bloc: TableBlock; entetes: string[]; propositions?: PropositionDeScenario }) {
  const roles = entetes.map(roleColonneScenario);
  const col = (role: RoleScenario) => roles.indexOf(role);
  const nombre = (ligne: Span[][], role: RoleScenario) => (col(role) >= 0 ? lireNombre(texteDe(ligne[col(role)])) : null);
  const aCout = roles.some((role) => role.startsWith("cout"));

  const scenarios = bloc.rows
    .map((ligne, index) => {
      const lu = lireNomScenario(texteDe(ligne[0]));
      const statutBrut = col("statut") >= 0 ? texteDe(ligne[col("statut")]).trim() : "";
      const statut = lireStatutScenario(statutBrut) ?? lu.statut;
      const libelle = statutBrut || (statut ? { retenu: "Retenu", possible: "Possible", ecarte: "Écarté" }[statut] : "");
      return { ligne, index, nom: lu.nom, statut, libelle, note: nombre(ligne, "note") };
    })
    .sort(
      (a, b) =>
        (a.statut ? STATUT_SCENARIO[a.statut].rang : 2) - (b.statut ? STATUT_SCENARIO[b.statut].rang : 2) ||
        (b.note ?? -1) - (a.note ?? -1) ||
        a.index - b.index,
    );

  return (
    <section className="mt-6" aria-label={bloc.title || "Scénarios"}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {scenarios.length > 1 ? `${scenarios.length} scénarios comparés` : "Le scénario"}
        </p>
        {scenarios.some((s) => s.note !== null) ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">Note pondérée sur 10</p>
        ) : null}
      </div>
      <ol className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
        {scenarios.map(({ ligne, index, nom, statut, libelle, note }) => {
          const style = statut ? STATUT_SCENARIO[statut] : null;
          const lien = propositions && nom ? propositions(nom) : null;
          const cout =
            fourchette(nombre(ligne, "cout-min"), nombre(ligne, "cout-max")) ??
            (col("cout") >= 0 ? texteDe(ligne[col("cout")]).trim() || null : null);
          const cout3 =
            fourchette(nombre(ligne, "cout-3ans-min"), nombre(ligne, "cout-3ans-max")) ??
            (col("cout-3ans") >= 0 ? texteDe(ligne[col("cout-3ans")]).trim() || null : null);
          const delai = col("delai") >= 0 ? texteDe(ligne[col("delai")]).trim() : "";
          const resolus = nombre(ligne, "resolus");
          const restants = nombre(ligne, "restants");
          const totalConstats = resolus !== null && restants !== null ? resolus + restants : null;
          const resume = col("resume") >= 0 ? ligne[col("resume")] : null;
          const details = roles
            .map((role, colonne) => ({ role, colonne, texte: texteDe(ligne[colonne]).trim() }))
            .filter(({ role, texte }) => role === "detail" && texte.length > 0);

          // Les petits repères d'abord, deux par ligne ; le délai, souvent une phrase, en pleine largeur.
          const reperes: { label: string; valeur: ReactNode; large: boolean }[] = [];
          if (aCout) {
            reperes.push({ label: "Coût", valeur: cout ?? <span className="text-mid-gray">Non chiffré</span>, large: false });
          }
          if (cout3) reperes.push({ label: "Coût sur 3 ans", valeur: cout3, large: false });
          if (resolus !== null && totalConstats !== null) {
            reperes.push({
              label: "Constats résolus",
              large: false,
              valeur: (
                <>
                  <span className="tabular-nums">
                    {resolus} sur {totalConstats}
                  </span>
                  <span aria-hidden className="mt-1.5 block h-1 w-full bg-dark-gray">
                    <span
                      className="block h-full bg-[#7fd8a4]"
                      style={{ width: `${totalConstats > 0 ? (resolus / totalConstats) * 100 : 0}%` }}
                    />
                  </span>
                </>
              ),
            });
          }
          if (delai) reperes.push({ label: "Délai", valeur: delai, large: true });

          return (
            <li key={index} className={`flex flex-col border ${style ? style.carte : "border-dark-gray bg-jet/40"}`}>
              <header className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  {libelle ? (
                    <span
                      className={`inline-flex border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                        style ? style.badge : "border-dark-gray text-mid-gray"
                      }`}
                    >
                      {style?.signe}
                      {libelle}
                    </span>
                  ) : (
                    <span />
                  )}
                  {note !== null ? (
                    <p className="text-right">
                      <span className="font-sans text-2xl font-light tabular-nums text-foreground">
                        {note.toLocaleString("fr-FR")}
                      </span>
                      <span className="font-mono text-[10px] text-mid-gray"> /10</span>
                    </p>
                  ) : null}
                </div>
                <h4
                  className={`mt-3 font-sans text-lg font-normal leading-snug ${
                    statut === "ecarte" ? "text-mid-gray" : "text-foreground"
                  }`}
                >
                  {nom}
                </h4>
                {note !== null ? (
                  <span aria-hidden className="mt-3 block h-1 w-full bg-dark-gray">
                    <span
                      className={`block h-full ${statut === "retenu" ? "bg-accent-secondary" : "bg-mid-gray"}`}
                      style={{ width: `${Math.max(0, Math.min(100, note * 10))}%` }}
                    />
                  </span>
                ) : null}
              </header>

              {resume && texteDe(resume).trim() ? (
                <p className="px-5 pb-4 font-inter-tight text-sm leading-relaxed text-foreground/90">
                  <Texte spans={resume} />
                </p>
              ) : null}

              <dl className="grid grid-cols-2 gap-px border-t border-dark-gray bg-dark-gray">
                {reperes.map((repere, i) => (
                  <Repere
                    key={repere.label}
                    label={repere.label}
                    // Un repère seul sur sa ligne en prend toute la largeur.
                    large={
                      repere.large ||
                      (i === reperes.findLastIndex((r) => !r.large) && reperes.filter((r) => !r.large).length % 2 === 1)
                    }
                  >
                    {repere.valeur}
                  </Repere>
                ))}
              </dl>

              {details.map(({ colonne, texte }) => (
                <Accordeon key={colonne} titre={entetes[colonne]}>
                  {texte.split(/(?<=\.)\s+(?=[A-ZÀ-Ý0-9])/).length > 2 ? (
                    <ul className="list-disc space-y-1.5 pl-4">
                      {texte.split(/(?<=\.)\s+(?=[A-ZÀ-Ý0-9])/).map((phrase, i) => (
                        <li key={i}>{phrase}</li>
                      ))}
                    </ul>
                  ) : (
                    <Texte spans={ligne[colonne]} />
                  )}
                </Accordeon>
              ))}

              {lien ? (
                <div className="mt-auto border-t border-dark-gray px-5 py-3">
                  <LienProposition {...lien} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Le « + » / « − » d'un repli. */
function SigneRepli({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`shrink-0 font-mono text-sm text-mid-gray group-open:text-accent-secondary ${className}`}>
      <span className="group-open:hidden">+</span>
      <span className="hidden group-open:inline">−</span>
    </span>
  );
}

/** Le lien d'un scénario ou d'un groupe du plan vers sa proposition, réponse comprise. */
function LienProposition({ href, statut, className = "" }: { href: string; statut: string | null; className?: string }) {
  return (
    <Link
      href={href}
      className={`font-mono text-[11px] uppercase tracking-[0.14em] text-foreground underline underline-offset-4 transition-colors hover:text-accent-secondary ${className}`}
    >
      {`Voir la proposition${statut ? ` · ${statut}` : ""} →`}
    </Link>
  );
}

// ── Versions (plateforme technique) ──────────────────────────────────────────

const ETAT: Record<Exclude<EtatVersion, "inconnu">, { classe: string; libelle: (a: string, d: string) => string }> = {
  "a-jour": { classe: "border-[#7fd8a4]/50 text-[#7fd8a4]", libelle: () => "À jour" },
  "en-retard": { classe: "border-[#f2c94c]/50 text-[#f2c94c]", libelle: (a, d) => `${a} → ${d}` },
  "a-supprimer": { classe: "border-[#ff8a7a]/50 text-[#ff8a7a]", libelle: () => "À supprimer" },
};

function versionDe(texte: string): string {
  return texte.match(/\d+(?:\.\d+)+/)?.[0] ?? texte;
}

/**
 * L'état de version d'une fiche de la plateforme technique, lu dans ses
 * sous-titres « Version actuelle » et « Dernière version ». Null si la fiche
 * ne suit pas ce gabarit (le cœur, par exemple, est écrit autrement).
 */
export function EtatVersionFiche({ corps }: { corps: Block[] }) {
  let actuelle: string | null = null;
  let derniere: string | null = null;
  corps.forEach((bloc, i) => {
    if (bloc.k !== "h3") return;
    const titre = texteDe(bloc.s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
    const suivant = corps[i + 1];
    const valeur = suivant && suivant.k === "p" ? texteDe(suivant.s) : null;
    if (titre === "version actuelle") actuelle = valeur;
    if (titre === "derniere version") derniere = valeur;
  });
  if (!actuelle || !derniere) return null;
  const etat = etatVersion(actuelle, derniere);
  if (etat === "inconnu") return null;
  const style = ETAT[etat];
  return (
    <span
      className={`whitespace-nowrap border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${style.classe}`}
    >
      {style.libelle(versionDe(actuelle), versionDe(derniere))}
    </span>
  );
}
