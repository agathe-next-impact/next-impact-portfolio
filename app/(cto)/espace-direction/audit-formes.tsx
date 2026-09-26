import type { Block, Span } from "@cto/letters";
import {
  estColonneGravite,
  estColonneScore,
  estColonneSolution,
  etatVersion,
  lireGravite,
  lireReference,
  lireSolution,
  registreEncadre,
  statutScore,
  type EtatVersion,
  type Gravite,
  type Registre,
  type Statut,
} from "@cto/espace";
import { BadgeGravite } from "./gravite";
import { CorpsLettre, Texte } from "./lettre";
import { Label } from "./ui";

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
//  - scores PageSpeed : jauge aux seuils Lighthouse, libellé toujours écrit.
//
// La couleur ne porte jamais seule l'information : chaque teinte a son libellé.
// ─────────────────────────────────────────────────────────────────────────────

const texteDe = (spans: Span[] | undefined) => (spans ?? []).map((span) => span.t).join("");

/** Retire les `n` derniers caractères d'une suite de spans, mise en forme conservée. */
function couperFin(spans: Span[], n: number): Span[] {
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
}: {
  bloc: BoxBlock;
  large: boolean;
  base: string;
  marge?: boolean;
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
        <CorpsLettre body={bloc.c} large={large} base={base} />
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
}: {
  situation: BoxBlock;
  solution: BoxBlock;
  large: boolean;
  base: string;
}) {
  return (
    <div className="mt-6 grid items-stretch gap-3 lg:grid-cols-2">
      <Encadre bloc={situation} large={large} base={base} marge={false} />
      <Encadre bloc={solution} large={large} base={base} marge={false} />
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
export function TableauAudit({ bloc }: { bloc: TableBlock }) {
  const entetes = (bloc.head ?? []).map(texteDe);
  const colGravite = entetes.findIndex(estColonneGravite);
  const colSolution = entetes.findIndex(estColonneSolution);

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
        <div className="overflow-x-auto border border-dark-gray">
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
              <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-dark-gray px-5 py-3">
                {gravite ? <BadgeGravite gravite={gravite} /> : null}
                <h4 className="min-w-0 flex-1 font-sans text-base font-normal text-foreground">
                  <Texte spans={ligne[colTitre] ?? []} />
                </h4>
                {etiquettes.map(({ colonne, texte }) => (
                  <span
                    key={colonne}
                    title={entetes[colonne]}
                    className="border border-dark-gray px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray"
                  >
                    {texte}
                  </span>
                ))}
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
                  <p className="flex flex-wrap items-center gap-2">
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
