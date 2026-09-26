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
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘]/g, "'").toLowerCase().trim();
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

// ── Scénarios ────────────────────────────────────────────────────────────────

export type StatutScenario = "retenu" | "possible" | "ecarte";

/** « Retenu », « Écarté », « Possible »… ; null si le mot n'est pas un statut. */
export function lireStatutScenario(brut: string): StatutScenario | null {
  const t = sansAccents(brut);
  if (/^(retenue?s?|recommandee?s?|choisie?s?|preconisee?s?)\b/.test(t)) return "retenu";
  if (/^(ecartee?s?|rejetee?s?|abandonnee?s?|exclue?s?)\b/.test(t)) return "ecarte";
  if (/^(possibles?|envisageables?|alternatives?|a l'etude|en option)\b/.test(t)) return "possible";
  return null;
}

/** Un tableau de scénarios : sa première colonne s'appelle « Scénario » (ou « Option »). */
export function estTableauScenarios(entetes: string[]): boolean {
  return entetes.length > 2 && /^(scenarios?|options?|pistes?)$/.test(sansAccents(entetes[0] ?? ""));
}

/** « 1. Optimisation (retenu) » → le nom nu et le statut glissé entre parenthèses. */
export function lireNomScenario(brut: string): { nom: string; statut: StatutScenario | null } {
  let nom = brut.trim().replace(/^\d+\s*[.)]\s*/, "");
  let statut: StatutScenario | null = null;
  const m = nom.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  if (m && lireStatutScenario(m[2])) {
    nom = m[1];
    statut = lireStatutScenario(m[2]);
  }
  return { nom, statut };
}

export type RoleScenario =
  | "nom"
  | "statut"
  | "note"
  | "cout"
  | "cout-min"
  | "cout-max"
  | "cout-3ans"
  | "cout-3ans-min"
  | "cout-3ans-max"
  | "delai"
  | "resolus"
  | "restants"
  | "resume"
  | "detail";

/** Le rôle d'une colonne d'un tableau de scénarios ; « detail » pour tout le reste (risques, conditions…). */
export function roleColonneScenario(entete: string, index: number): RoleScenario {
  if (index === 0) return "nom";
  const t = sansAccents(entete);
  if (/^(statut|decision|verdict)$/.test(t)) return "statut";
  if (/^note|score/.test(t)) return "note";
  if (/cout|budget|prix|montant/.test(t)) {
    const trois = /\d\s*ans|annees|tco/.test(t);
    const borne = /\bmin/.test(t) ? "-min" : /\bmax/.test(t) ? "-max" : "";
    return `${trois ? "cout-3ans" : "cout"}${borne}` as RoleScenario;
  }
  if (/delai|duree|calendrier|echeance/.test(t)) return "delai";
  if (/resolu/.test(t)) return "resolus";
  if (/restant|non resolu/.test(t)) return "restants";
  if (/^(resume|description|en bref|synthese)$/.test(t)) return "resume";
  return "detail";
}

/** « 15 700 », « 2 500 € HT », « 4,05 » → nombre ; null si la cellule n'est pas un nombre seul. */
export function lireNombre(brut: string): number | null {
  const net = brut.replace(/[\s  ]/g, "").replace(/€|HT$/gi, "").replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(net)) return null;
  return Number(net);
}

// ── Domaine d'un point de synthèse ───────────────────────────────────────────

export const DOMAINES = [
  "Sécurité",
  "Données personnelles",
  "Sauvegardes",
  "Maintenance",
  "Dette technique",
  "Performance",
  "Accessibilité",
  "SEO",
  "Mesure d'audience",
  "Contenu",
  "Budget",
] as const;

export type Domaine = (typeof DOMAINES)[number];

/** Les mots qui signent un domaine, comparés sans casse ni accents. */
const MOTS_DOMAINE: Record<Domaine, RegExp> = {
  Sécurité: /securit|executable|malware|pirat|intrusion|faille|mots? de passe|wordfence|origine inconnue|compromis/,
  "Données personnelles": /donnees personnelles|rgpd|cnil|comptes? exportable|consentement/,
  Sauvegardes: /sauvegard|restauration/,
  Maintenance: /mises? a jour|en retard|version anterieure|obsolete|extensions?\b|plugins?\b|c(?:oe|œ)ur\b/,
  "Dette technique": /code metier|dette|theme|wpbakery|evolutif|gutenberg|\bfse\b|constructeur de page/,
  Performance: /performance|vitesse|\blcp\b|pagespeed|core web vitals|chargement|affiche a \d/,
  Accessibilité: /accessibilit|rgaa|zoom bloque|contraste/,
  SEO: /\bseo\b|referencement|redirection|indexation/,
  "Mesure d'audience": /analytics|conversion|evenements? cles?|matomo/,
  Contenu: /\bcontenus?\b|editorial/,
  Budget: /\d\s*€|€\s*ht|forfait|budget|\bprix\b|\bcouts?\b/,
};

/** Le domaine d'un point : celui dont un mot apparaît le plus tôt dans le texte. */
export function lireDomaine(brut: string): Domaine | null {
  const t = sansAccents(brut);
  let meilleur: { domaine: Domaine; position: number } | null = null;
  for (const domaine of DOMAINES) {
    const m = MOTS_DOMAINE[domaine].exec(t);
    if (m && (!meilleur || m.index < meilleur.position)) meilleur = { domaine, position: m.index };
  }
  return meilleur?.domaine ?? null;
}

/** Ce que le texte dit de la gravité, faute de mention explicite. */
const MOTS_GRAVITE: [Gravite, RegExp][] = [
  ["critique", /origine inconnue|executable|exposees?\b|sans controle|aucune sauvegarde|fuite|malware|compromis/],
  ["eleve", /en retard|obsolete|n'est pas evolutif|non evolutif|impasse|perte du code|version anterieure|ne fonctionnera plus|depend de/],
  ["modere", /erreurs? d'accessibilite|performance mobile|zoom bloque|lenteur|\d+,\d+\s*s\b/],
];

export interface EtiquettesPoint {
  domaine: Domaine | null;
  gravite: Gravite | null;
  /** Nombre de caractères à retirer en fin de texte : la mention explicite, si elle y est. */
  coupe: number;
}

/**
 * Le domaine et la gravité d'un point de synthèse.
 *
 * Une mention explicite en fin de puce l'emporte : « … (Sécurité, critique) ».
 * Sinon, lus dans le texte ; ce qui ne se reconnaît pas reste sans badge.
 */
export function lireEtiquettesPoint(brut: string): EtiquettesPoint {
  const m = brut.match(/\s*\(([^()]+)\)\s*\.?\s*$/);
  if (m) {
    const parties = m[1].split(/[,·;]/).map((p) => p.trim()).filter(Boolean);
    const domaine = DOMAINES.find((d) => parties.some((p) => sansAccents(p) === sansAccents(d))) ?? null;
    const gravite = parties.map(lireGravite).find(Boolean) ?? null;
    const reconnues = parties.every((p) => lireGravite(p) || DOMAINES.some((d) => sansAccents(p) === sansAccents(d)));
    if (reconnues && (domaine || gravite)) {
      const reste = brut.slice(0, brut.length - m[0].length);
      return {
        domaine: domaine ?? lireDomaine(reste),
        gravite: gravite ?? MOTS_GRAVITE.find(([, motif]) => motif.test(sansAccents(reste)))?.[0] ?? null,
        coupe: m[0].length,
      };
    }
  }
  const t = sansAccents(brut);
  return {
    domaine: lireDomaine(brut),
    gravite: MOTS_GRAVITE.find(([, motif]) => motif.test(t))?.[0] ?? null,
    coupe: 0,
  };
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
