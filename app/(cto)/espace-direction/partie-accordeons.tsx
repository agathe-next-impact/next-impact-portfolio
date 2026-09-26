import type { Block, Span } from "@cto/letters";
import { EtatVersionFiche } from "./audit-formes";
import { CorpsLettre, Texte } from "./lettre";

// ─────────────────────────────────────────────────────────────────────────────
// Une partie d'audit faite d'un inventaire (« Plateforme technique » : cœur,
// thème, une fiche par extension), mise en grille d'accordéons.
//
// Rendue bloc par bloc, c'est une colonne de vingt fiches presque identiques
// (version actuelle, dernière version, prérequis, commentaire) qu'on fait
// défiler sans les comparer. Ici :
//
//  - chaque grand titre (h1) reste un titre de section ;
//  - ce qui précède son premier sous-titre (un encadré de préconisations, par
//    exemple) reste rendu tel quel, pleine largeur ;
//  - chaque sous-titre (h2) devient une case repliable, deux par ligne ;
//  - un sous-titre sans contenu (« Cœur de WordPress », qui ne fait
//    qu'annoncer les suivants) reste un intertitre pleine largeur.
//
// `<details>` natif : accessible au clavier sans une ligne de JavaScript.
// ─────────────────────────────────────────────────────────────────────────────

/** Parties rendues en accordéons, comparées sans casse ni accents. */
const PARTIES_EN_ACCORDEONS = ["plateforme technique"];

function normaliser(titre: string): string {
  return titre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function partieEnAccordeons(titre: string): boolean {
  return PARTIES_EN_ACCORDEONS.includes(normaliser(titre));
}

interface Case {
  titre: Span[];
  corps: Block[];
}

interface Section {
  titre: Span[] | null;
  intro: Block[];
  cases: Case[];
}

function decouper(corps: Block[]): Section[] {
  const sections: Section[] = [];
  let courante: Section | null = null;

  for (const bloc of corps) {
    if (bloc.k === "h1") {
      courante = { titre: bloc.s, intro: [], cases: [] };
      sections.push(courante);
      continue;
    }
    if (!courante) {
      courante = { titre: null, intro: [], cases: [] };
      sections.push(courante);
    }
    if (bloc.k === "h2") {
      courante.cases.push({ titre: bloc.s, corps: [] });
    } else if (courante.cases.length > 0) {
      courante.cases[courante.cases.length - 1].corps.push(bloc);
    } else {
      courante.intro.push(bloc);
    }
  }
  return sections;
}

export function PartieAccordeons({ corps, base }: { corps: Block[]; base: string }) {
  return (
    <>
      {decouper(corps).map((section, index) => (
        <div key={index}>
          {section.titre ? (
            <h3 className="mt-10 font-sans text-xl font-light text-foreground">
              <Texte spans={section.titre} />
            </h3>
          ) : null}
          {section.intro.length > 0 ? <CorpsLettre body={section.intro} large base={base} /> : null}
          {section.cases.length > 0 ? (
            <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">
              {section.cases.map((c, i) =>
                c.corps.length === 0 ? (
                  <p
                    key={i}
                    className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray lg:col-span-2"
                  >
                    <Texte spans={c.titre} />
                  </p>
                ) : (
                  <details key={i} className="group border border-dark-gray bg-jet/40">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-jet/70 [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0 font-sans text-base font-normal text-foreground">
                        <Texte spans={c.titre} />
                      </span>
                      <span className="ml-auto shrink-0">
                        <EtatVersionFiche corps={c.corps} />
                      </span>
                      <span aria-hidden className="font-mono text-sm text-mid-gray group-open:text-accent-secondary">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <div className="border-t border-dark-gray px-5 pb-5 [&>div>*:first-child]:mt-4">
                      <CorpsLettre body={c.corps} large base={base} />
                    </div>
                  </details>
                ),
              )}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}
