import type { Block, Span } from "../notion/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// La synthèse d'un audit, lue en structure.
//
// Pur, testé. La synthèse arrive de Notion en blocs (paragraphes, puces, un
// encadré) ; rendue telle quelle, c'est un mur de puces. Ce module en retrouve
// la forme que l'atelier lui donne déjà par convention :
//
//  - des **fiches** « Libellé : valeur » (site, auteur, rendez-vous) ;
//  - des **rubriques** ouvertes par un titre (Audit, Recommandations,
//    Roadmap…), faites de puces dont le début en gras est le titre ;
//  - une roadmap en **phases** « P0, immédiat : … — 500 € » ;
//  - la répartition des constats par **gravité** (« 2 critiques, 6 élevés… »).
//
// Rien n'est propre à un client : ce qui ne se reconnaît pas est rendu tel quel
// (`reste`, `autres`), et une synthèse sans rubrique rend null — l'affichage
// revient alors au rendu bloc par bloc.
// ─────────────────────────────────────────────────────────────────────────────

export interface Fiche {
  label: string;
  valeur: Span[];
}

export interface Point {
  /** Le début en gras (ou avant « : »), s'il y en a un. */
  titre: string | null;
  texte: Span[];
  /** La puce entière, en texte brut. */
  brut: string;
}

export interface Phase {
  code: string;
  delai: string | null;
  texte: string;
  montant: number | null;
}

export interface Rubrique {
  titre: string;
  points: Point[];
  /** Non null quand TOUTES les puces se lisent comme des phases. */
  phases: Phase[] | null;
  autres: Block[];
}

export type Gravite = "critique" | "eleve" | "modere" | "faible";

export interface Severites {
  total: number | null;
  niveaux: { gravite: Gravite; label: string; n: number }[];
}

export interface Synthese {
  fiches: Fiche[];
  severites: Severites | null;
  rubriques: Rubrique[];
  reste: Block[];
}

const texte = (spans: Span[]) => spans.map((span) => span.t).join("");

/** « AUTEUR » → « Auteur » ; « Site web » reste tel quel. */
function libelle(brut: string): string {
  const net = brut.trim();
  return net === net.toUpperCase() ? net.charAt(0) + net.slice(1).toLowerCase() : net;
}

/** Retire les premiers caractères d'une suite de spans, en gardant leur mise en forme. */
function couper(spans: Span[], n: number): Span[] {
  const out: Span[] = [];
  let reste = n;
  for (const span of spans) {
    if (reste >= span.t.length) {
      reste -= span.t.length;
      continue;
    }
    out.push({ ...span, t: span.t.slice(reste) });
    reste = 0;
  }
  return out;
}

/** Retire la ponctuation d'attache en tête (« : », « , », « - ») laissée par une coupe. */
function nettoyerTete(spans: Span[]): Span[] {
  const brut = texte(spans);
  const tete = brut.match(/^[\s:,;–—-]*/)?.[0].length ?? 0;
  return couper(spans, tete).filter((span) => span.t.length > 0);
}

const LIBELLE = /^\s*([^:\n]{2,40}?)\s*:\s*/;

function lireFiche(spans: Span[]): Fiche | null {
  const brut = texte(spans);
  const m = brut.match(LIBELLE);
  // Un lien n'est jamais un libellé (« https: »).
  if (!m || /\/\/|@/.test(m[1]) || spans[0]?.h) return null;
  return { label: libelle(m[1]), valeur: nettoyerTete(couper(spans, m[0].length)) };
}

function lirePoint(spans: Span[]): Point {
  return { ...decouper(spans), brut: texte(spans).trim() };
}

function decouper(spans: Span[]): Omit<Point, "brut"> {
  let gras = 0;
  while (gras < spans.length && spans[gras].b) gras += 1;
  if (gras > 0 && gras < spans.length) {
    return {
      titre: texte(spans.slice(0, gras)).trim().replace(/[\s:,]+$/, ""),
      texte: nettoyerTete(spans.slice(gras)),
    };
  }
  const brut = texte(spans);
  const deuxPoints = brut.indexOf(" : ");
  if (gras === 0 && deuxPoints > 0 && deuxPoints <= 40) {
    return { titre: brut.slice(0, deuxPoints).trim(), texte: nettoyerTete(couper(spans, deuxPoints)) };
  }
  return { titre: null, texte: spans };
}

const PHASE = /^\s*(P\d+)\s*(?:,\s*([^:]+?))?\s*:\s*(.+?)(?:\s*[—–-]\s*(\d[\d\s  .,]*)\s*€(?:\s*HT)?)?\s*\.?\s*$/;

export function lirePhase(brut: string): Phase | null {
  const m = brut.match(PHASE);
  if (!m) return null;
  const montant = m[4] ? Number(m[4].replace(/[\s  .]/g, "").replace(",", ".")) : null;
  return {
    code: m[1],
    delai: m[2]?.trim() || null,
    texte: m[3].trim().replace(/\.$/, ""),
    montant: montant !== null && Number.isFinite(montant) ? montant : null,
  };
}

const GRAVITES: { gravite: Gravite; label: string; motif: RegExp }[] = [
  { gravite: "critique", label: "Critiques", motif: /(\d+)\s+critiques?\b/i },
  { gravite: "eleve", label: "Élevés", motif: /(\d+)\s+(?:élevée?s?|eleve)/i },
  { gravite: "modere", label: "Modérés", motif: /(\d+)\s+modérée?s?/i },
  { gravite: "faible", label: "Faibles", motif: /(\d+)\s+faibles?\b/i },
];

/**
 * La gravité d'une cellule (« Critique », « élevée », « Modéré »…), ou null.
 * Sert aux tableaux d'audit : une colonne Gravité devient un badge.
 */
export function lireGravite(brut: string): Gravite | null {
  const t = brut.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  if (/^critiques?\b/.test(t)) return "critique";
  if (/^elevee?s?\b/.test(t)) return "eleve";
  if (/^moderee?s?\b/.test(t)) return "modere";
  if (/^faibles?\b/.test(t)) return "faible";
  return null;
}

/** Une colonne de tableau qui porte la gravité : « Gravité », « Sévérité », « Criticité ». */
export function estColonneGravite(entete: string): boolean {
  const t = entete.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  return t === "gravite" || t === "severite" || t === "criticite";
}

export function lireSeverites(brut: string): Severites | null {
  const niveaux = GRAVITES.flatMap(({ gravite, label, motif }) => {
    const m = brut.match(motif);
    return m ? [{ gravite, label, n: Number(m[1]) }] : [];
  });
  if (niveaux.length < 2) return null;
  const total = brut.match(/(\d[\d\s  ]*)\s+constats?\b/i);
  return { total: total ? Number(total[1].replace(/\D/g, "")) : null, niveaux };
}

function aplatir(blocks: Block[]): string {
  return blocks
    .map((block) => ("s" in block ? texte(block.s) : "") + ("c" in block ? ` ${aplatir(block.c)}` : ""))
    .join(" ");
}

export function lireSynthese(blocks: Block[]): Synthese | null {
  // Le corps : le premier encadré qui porte des titres, sinon la synthèse elle-même.
  const encadre = blocks.find(
    (block): block is Extract<Block, { k: "box" }> =>
      block.k === "box" && block.c.some((enfant) => enfant.k === "h1" || enfant.k === "h2" || enfant.k === "h3"),
  );
  const corps = encadre ? encadre.c : blocks;
  const dehors = encadre ? blocks.filter((block) => block !== encadre) : [];

  const rubriques: Rubrique[] = [];
  const avant: Block[] = [];
  for (const block of corps) {
    if (block.k === "h1" || block.k === "h2" || block.k === "h3") {
      rubriques.push({ titre: texte(block.s).trim(), points: [], phases: null, autres: [] });
      continue;
    }
    const courante = rubriques[rubriques.length - 1];
    if (!courante) {
      avant.push(block);
    } else if (block.k === "li" || block.k === "oli") {
      courante.points.push(lirePoint(block.s));
    } else if (block.k !== "hr") {
      courante.autres.push(block);
    }
  }
  if (rubriques.length === 0) return null;

  for (const rubrique of rubriques) {
    const phases = rubrique.points.map((point) => lirePhase(point.brut));
    if (rubrique.points.length > 0 && phases.every(Boolean)) rubrique.phases = phases as Phase[];
  }

  // Fiches : les paragraphes « Libellé : valeur » hors rubriques. Un libellé
  // sans valeur prend le paragraphe suivant (« Rendez-vous : » puis le lien).
  const fiches: Fiche[] = [];
  const reste: Block[] = [];
  const candidats = [...dehors, ...avant];
  for (let i = 0; i < candidats.length; i += 1) {
    const block = candidats[i];
    if (block.k === "hr") continue;
    if (block.k !== "p") {
      reste.push(block);
      continue;
    }
    const fiche = lireFiche(block.s);
    if (!fiche) {
      reste.push(block);
      continue;
    }
    const suivant = candidats[i + 1];
    if (fiche.valeur.length === 0 && suivant?.k === "p" && !lireFiche(suivant.s)) {
      fiche.valeur = suivant.s;
      i += 1;
    }
    fiches.push(fiche);
  }

  return { fiches, severites: lireSeverites(aplatir(corps)), rubriques, reste };
}
