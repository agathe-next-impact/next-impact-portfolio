import type { Block } from "../notion/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// L'ordre de lecture d'un document long (proposition) : pur, testé.
//
// Le corps d'une page Notion est découpé à chaque grand titre. Ce qui résume
// (synthèse, recommandation, chiffrage d'ensemble) passe en tête, ouvert ; le
// détail suit, replié. Un document court se lit d'un trait, dans son ordre.
// ─────────────────────────────────────────────────────────────────────────────

/** Un chapitre du corps : son grand titre, puis ses blocs. */
export interface ChapitreCorps {
  id: string;
  titre: string;
  blocs: Block[];
}

const texteDe = (bloc: Block) => ("s" in bloc ? bloc.s.map((span) => span.t).join("").trim() : "");

/**
 * Découpe un corps en chapitres à chaque grand titre. Ce qui précède le premier
 * grand titre (un encadré de cadrage, le plus souvent) forme le préambule, lu
 * d'emblée.
 */
export function chapitresDuCorps(corps: Block[]): { preambule: Block[]; chapitres: ChapitreCorps[] } {
  const preambule: Block[] = [];
  const chapitres: ChapitreCorps[] = [];
  corps.forEach((bloc, index) => {
    if (bloc.k === "h1") {
      chapitres.push({ id: `chapitre-${index}`, titre: texteDe(bloc) || "Sans titre", blocs: [] });
    } else if (chapitres.length === 0) {
      preambule.push(bloc);
    } else {
      chapitres[chapitres.length - 1].blocs.push(bloc);
    }
  });
  return { preambule, chapitres };
}

/**
 * Ce qui résume : la synthèse, la recommandation, le chiffrage d'ensemble.
 * C'est ce qu'on vient chercher dans une proposition avant d'entrer dans le
 * détail.
 */
export function resume(titre: string): boolean {
  return /synth[eè]se|recommandation|en bref|l.essentiel|chiffrage|\btotal\b|budget/i.test(titre);
}

/**
 * Sous ce poids, un document se lit d'un trait : rien n'est replié ni
 * réordonné. Replier un devis d'une page cacherait jusqu'à son total.
 */
export const DOCUMENT_COURT = 25;

/**
 * Le poids de lecture d'un bloc : une ligne pour un paragraphe, une par ligne
 * de tableau, le contenu pour un encadré. Compter les blocs ne suffit pas : une
 * base inline mise à plat est UN bloc de trente lignes.
 */
export function poids(bloc: Block): number {
  if (bloc.k === "table") return bloc.rows.length + 1;
  if (bloc.k === "box") return 1 + bloc.c.reduce((total, enfant) => total + poids(enfant), 0);
  return 1;
}

/** Les chapitres dans l'ordre de lecture : ce qui résume d'abord, sauf pour un document court. */
export function ordreDeLecture(corps: Block[]): {
  preambule: Block[];
  ouverts: ChapitreCorps[];
  replies: ChapitreCorps[];
} {
  const { preambule, chapitres } = chapitresDuCorps(corps);
  const total = corps.reduce((somme, bloc) => somme + poids(bloc), 0);
  if (total <= DOCUMENT_COURT) return { preambule, ouverts: chapitres, replies: [] };
  return {
    preambule,
    ouverts: chapitres.filter((chapitre) => resume(chapitre.titre)),
    replies: chapitres.filter((chapitre) => !resume(chapitre.titre)),
  };
}
