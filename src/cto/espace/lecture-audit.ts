import { lireGravite, type Gravite } from "./synthese";

// ─────────────────────────────────────────────────────────────────────────────
// Ce que la mise en page d'un audit sait reconnaître dans le texte, pour le
// montrer au lieu de le faire lire. Pur, testé.
//
// L'audit suit une convention d'écriture qu'on retrouve partout :
//
//  - une référence en fin de puce : « (SEC-05, 1 à 3 h) », « (C-001, critique) » ;
//  - une solution qui commence par son code : « SEC-02 : suppression… » ;
//  - des encadrés « Problèmes majeurs » (la situation) suivis d'« Actions
//    prioritaires » (les solutions préconisées) ;
//  - des scores PageSpeed sur 100 ;
//  - dans la plateforme technique, « Version actuelle » puis « Dernière version ».
//
// Rien de propre à un client : ce qui ne se reconnaît pas reste du texte.
// ─────────────────────────────────────────────────────────────────────────────

const CODE = /^[A-Z][A-Z0-9]{0,6}-\d{1,3}$/;
const EFFORT = /^\d+(?:[,.]\d+)?\s*(?:à\s*\d+(?:[,.]\d+)?\s*)?h$/i;

function sansAccents(texte: string): string {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export interface Reference {
  /** Le texte sans la parenthèse finale. */
  reste: string;
  codes: string[];
  effort: string | null;
  gravite: Gravite | null;
}

/**
 * La référence en fin de puce, si TOUTE la parenthèse se reconnaît (codes,
 * effort, gravité). « (data/44) » ou « (data/40, C-012) » restent du texte :
 * une source ne se transforme pas en étiquette.
 */
export function lireReference(brut: string): Reference | null {
  const m = brut.match(/^([\s\S]*?)\s*\(([^()]+)\)\s*\.?\s*$/);
  if (!m) return null;
  const ref: Reference = { reste: m[1], codes: [], effort: null, gravite: null };
  for (const partie of m[2].split(",").map((p) => p.trim())) {
    if (CODE.test(partie)) ref.codes.push(partie);
    else if (!ref.effort && EFFORT.test(partie)) ref.effort = partie.replace(/\s*h$/i, " h");
    else if (!ref.gravite && lireGravite(partie) && partie.split(/\s+/).length === 1) ref.gravite = lireGravite(partie);
    else return null;
  }
  return ref.codes.length > 0 || ref.effort || ref.gravite ? ref : null;
}

/** Une solution qui s'ouvre sur son ou ses codes : « SEC-03, EXPL-02 : durcissement… ». */
export function lireSolution(brut: string): { codes: string[]; texte: string } | null {
  const m = brut.match(/^\s*([A-Z][A-Z0-9]{0,6}-\d{1,3}(?:\s*(?:,|\+|et)\s*[A-Z][A-Z0-9]{0,6}-\d{1,3})*)\s*:\s*([\s\S]+)$/);
  if (!m) return null;
  return { codes: m[1].split(/\s*(?:,|\+|et)\s*/), texte: m[2].trim() };
}

export type Registre = "situation" | "solution";

/** Le registre d'un encadré, d'après son titre. Les solutions d'abord : « Préconisations importantes ». */
export function registreEncadre(titre: string): Registre | null {
  const t = sansAccents(titre);
  if (/preconis|recommand|action|solution|a faire/.test(t)) return "solution";
  if (/probleme|constat|situation|points? remarque|verdict|risque|diagnostic/.test(t)) return "situation";
  return null;
}

/** Une colonne de tableau qui porte la solution. */
export function estColonneSolution(entete: string): boolean {
  return /solution|recommand|preconis|action/.test(sansAccents(entete));
}

/** Une colonne de score PageSpeed / Lighthouse, sur 100. */
export function estColonneScore(entete: string, valeurs: string[]): boolean {
  if (!/perf|accessib|bonnes pratiques|seo|score/.test(sansAccents(entete))) return false;
  const remplies = valeurs.filter((v) => v.trim() !== "");
  return remplies.length > 0 && remplies.every((v) => /^\d{1,3}(?:[.,]\d+)?$/.test(v.trim()) && Number(v.replace(",", ".")) <= 100);
}

export type Statut = "bon" | "moyen" | "faible";

/** Les seuils de Lighthouse : 90 et plus, 50 à 89, moins de 50. */
export function statutScore(score: number): Statut {
  if (score >= 90) return "bon";
  if (score >= 50) return "moyen";
  return "faible";
}

export type EtatVersion = "a-jour" | "en-retard" | "a-supprimer" | "inconnu";

/** Version actuelle contre dernière version, telles que l'audit les écrit. */
export function etatVersion(actuelle: string, derniere: string): EtatVersion {
  const d = sansAccents(derniere);
  if (/suppression|supprimer|retrait/.test(d)) return "a-supprimer";
  const va = actuelle.match(/\d+(?:\.\d+)+/)?.[0];
  const vd = derniere.match(/\d+(?:\.\d+)+/)?.[0];
  if (/a jour|alignee|sans canal/.test(d) || (va && vd && va === vd)) return "a-jour";
  if (va && vd) return "en-retard";
  return "inconnu";
}
