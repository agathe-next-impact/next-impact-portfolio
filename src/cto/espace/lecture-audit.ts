import type { Block, Span } from "../notion/blocks";
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
  | "reponse"
  | "detail";

/** Le rôle d'une colonne d'un tableau de scénarios ; « detail » pour tout le reste (risques, conditions…). */
export function roleColonneScenario(entete: string, index: number): RoleScenario {
  if (index === 0) return "nom";
  const t = sansAccents(entete);
  // La réponse du client à la proposition née du scénario (`notion/scenarios.ts`), pas une donnée de comparaison.
  if (/^reponse/.test(t)) return "reponse";
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

// ── Plan d'action chiffré ────────────────────────────────────────────────────

/** Les heures ou les euros d'un groupe, ponctuels d'un côté, mensuels de l'autre. */
export interface Somme {
  ponctuel: number;
  mensuel: number;
}

export interface GroupePlan {
  nom: string;
  /** Indices des lignes du tableau, triées par axe puis dans l'ordre d'écriture. */
  lignes: number[];
  heures: Somme | null;
  cout: Somme | null;
}

export interface PlanAction {
  colGroupe: number;
  colAxe: number;
  colHeures: number;
  colFrequence: number;
  colCout: number;
  groupes: GroupePlan[];
}

/**
 * Un plan d'action chiffré : une base inline dont chaque tâche est rattachée à
 * une proposition (« Proposition », « Scénario ou volet », « Lot »…) et porte
 * des heures ou un coût. Notion la montre groupée par proposition ; mise à plat,
 * elle mêle les tâches de toutes les propositions. On la regroupe donc ici.
 *
 * Null si le tableau n'a pas de colonne de rattachement, pas de chiffre, ou un
 * seul groupe : il reste alors un tableau ordinaire.
 */
export function lirePlanAction(entetes: string[], lignes: string[][]): PlanAction | null {
  const t = entetes.map(sansAccents);
  const colGroupe = t.findIndex((e, i) => i > 0 && /^(propositions?|scenarios?|volets?|lots?|phases?|offres?)\b/.test(e));
  if (colGroupe < 0) return null;

  const colHeures = t.findIndex((e) => /^(heures?|charge|volume|jours?)\b/.test(e));
  const colCout = t.findIndex((e) => /cout|budget|prix|montant|€/.test(e));
  if (colHeures < 0 && colCout < 0) return null;
  const colFrequence = t.findIndex((e) => /^(frequence|recurrence|periodicite)\b/.test(e));
  const colAxe = t.findIndex((e, i) => i > 0 && i !== colGroupe && /^(axes?|domaines?|categories?|themes?)\b/.test(e));

  const ordre: string[] = [];
  const parGroupe = new Map<string, number[]>();
  lignes.forEach((ligne, index) => {
    const nom = (ligne[colGroupe] ?? "").trim() || "Autres actions";
    if (!parGroupe.has(nom)) {
      parGroupe.set(nom, []);
      ordre.push(nom);
    }
    parGroupe.get(nom)!.push(index);
  });
  if (ordre.length < 2) return null;

  // « Proposition 1 », « Scénario 2 » dans l'ordre de leur numéro ; le reste
  // (maintenance, options) ensuite, dans l'ordre où il apparaît.
  const numero = (nom: string) => Number(nom.match(/^\D*?(\d+)/)?.[1] ?? Number.POSITIVE_INFINITY);
  ordre.sort((a, b) => numero(a) - numero(b) || ordre.indexOf(a) - ordre.indexOf(b));

  const mensuel = (index: number) => colFrequence >= 0 && estMensuel(lignes[index][colFrequence] ?? "");
  const somme = (col: number, indices: number[]): Somme | null => {
    if (col < 0) return null;
    const s: Somme = { ponctuel: 0, mensuel: 0 };
    let lu = false;
    for (const index of indices) {
      const n = lireNombre(lignes[index][col] ?? "");
      if (n === null) continue;
      lu = true;
      s[mensuel(index) ? "mensuel" : "ponctuel"] += n;
    }
    return lu ? s : null;
  };
  const axe = (index: number) => (colAxe >= 0 ? sansAccents(lignes[index][colAxe] ?? "") : "");

  return {
    colGroupe,
    colAxe,
    colHeures,
    colFrequence,
    colCout,
    groupes: ordre.map((nom) => {
      const indices = parGroupe.get(nom)!;
      return {
        nom,
        lignes: [...indices].sort((a, b) => axe(a).localeCompare(axe(b), "fr") || a - b),
        heures: somme(colHeures, indices),
        cout: somme(colCout, indices),
      };
    }),
  };
}

/** Une ligne mensuelle du plan : la fréquence dit « Mensuel ». */
export function estMensuel(frequence: string): boolean {
  return /mensuel|par mois|\/\s*mois/.test(sansAccents(frequence));
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

// ── Efforts : la base ROADMAP fait foi ───────────────────────────────────────

/** Le code d'une action en tête de son intitulé : « SEC-02 : Suppression… ». */
const CODE_ACTION = /^([A-Z]{2,6}-\d{2,3})\b/;

/**
 * Les efforts de la base inline ROADMAP d'un audit, par code d'action :
 * « SEC-02 » → « 1 à 3 h ». Vide si l'audit n'a pas de ROADMAP chiffrée.
 */
export function effortsRoadmap(blocs: Block[]): Map<string, string> {
  const efforts = new Map<string, string>();
  const lire = (liste: Block[]) => {
    for (const bloc of liste) {
      if (bloc.k === "box") lire(bloc.c);
      if (bloc.k !== "table" || !bloc.head || sansAccents(bloc.title ?? "") !== "roadmap") continue;
      const entetes = bloc.head.map((cellule) => sansAccents(texteCellule(cellule)));
      const colMin = entetes.findIndex((e) => /^effort min/.test(e));
      const colMax = entetes.findIndex((e) => /^effort max/.test(e));
      if (colMin < 0 && colMax < 0) continue;
      for (const ligne of bloc.rows) {
        const code = texteCellule(ligne[0]).match(CODE_ACTION)?.[1];
        if (!code) continue;
        const min = colMin >= 0 ? texteCellule(ligne[colMin]) : "";
        const max = colMax >= 0 ? texteCellule(ligne[colMax]) : "";
        const effort = min && max && min !== max ? `${min} à ${max} h` : min || max ? `${min || max} h` : null;
        if (effort) efforts.set(code, effort);
      }
    }
  };
  lire(blocs);
  return efforts;
}

/** « (SEC-02, 1 à 3 h) », « (PERF-01 : 3 h) » : un code suivi de son effort, entre parenthèses. */
const MENTION_EFFORT = /\(([A-Z]{2,6}-\d{2,3})(\s*[,:–-]\s*)\d+(?:[.,]\d+)?(?:\s*(?:à|-|–)\s*\d+(?:[.,]\d+)?)?\s*h\)/g;

/**
 * Réécrit, dans tout le texte de l'audit, chaque effort cité à côté d'un code
 * d'action avec celui de la base ROADMAP. Le texte de l'audit recopie ces
 * heures à la main ; la base, elle, est tenue à jour. Un code absent de la base
 * garde le texte tel qu'il est écrit. Pur : rien n'est réécrit dans Notion.
 */
export function alignerEfforts<T extends { synthese: Block[]; sections: { corps: Block[] }[] }>(audit: T): T {
  const efforts = effortsRoadmap([...audit.synthese, ...audit.sections.flatMap((section) => section.corps)]);
  if (efforts.size === 0) return audit;

  return transformerSpans(audit, (s) => {
    const t = s.t.replace(MENTION_EFFORT, (mention, code: string, sep: string) =>
      efforts.has(code) ? `(${code}${sep}${efforts.get(code)})` : mention,
    );
    return [t === s.t ? s : { ...s, t }];
  });
}

/** « proposition », « propositions », en mot entier, sans casse. */
const MENTION_PROPOSITION = /\bpropositions?\b/gi;

/**
 * Fait de chaque mention d'une proposition dans le texte de l'audit un lien
 * vers les propositions de l'espace (`href`), où le client y répond. Un texte
 * déjà lié (un lien écrit dans Notion) reste tel quel. Pur.
 */
export function lierPropositions<T extends { synthese: Block[]; sections: { corps: Block[] }[] }>(audit: T, href: string): T {
  return transformerSpans(audit, (s) => {
    if (s.h || s.c || !MENTION_PROPOSITION.test(s.t)) return [s];
    MENTION_PROPOSITION.lastIndex = 0;
    const out: Span[] = [];
    let debut = 0;
    for (const m of s.t.matchAll(MENTION_PROPOSITION)) {
      if (m.index > debut) out.push({ ...s, t: s.t.slice(debut, m.index) });
      out.push({ ...s, t: m[0], h: href });
      debut = m.index + m[0].length;
    }
    if (debut < s.t.length) out.push({ ...s, t: s.t.slice(debut) });
    return out;
  });
}

/**
 * Applique `fn` à chaque morceau de texte de l'audit : paragraphes, encadrés,
 * cellules de tableau (pas les en-têtes, qui nomment des colonnes).
 */
function transformerSpans<T extends { synthese: Block[]; sections: { corps: Block[] }[] }>(
  audit: T,
  fn: (span: Span) => Span[],
): T {
  const spans = (liste: Span[]) => liste.flatMap(fn);
  const bloc = (b: Block): Block => {
    switch (b.k) {
      case "box":
        return { ...b, s: spans(b.s), c: b.c.map(bloc) };
      case "table":
        return { ...b, rows: b.rows.map((ligne) => ligne.map(spans)) };
      case "hr":
      case "code":
      case "img":
        return b;
      default:
        return { ...b, s: spans(b.s) };
    }
  };
  return {
    ...audit,
    synthese: audit.synthese.map(bloc),
    sections: audit.sections.map((section) => ({ ...section, corps: section.corps.map(bloc) })),
  };
}

function texteCellule(cellule: Span[] | undefined): string {
  return (cellule ?? []).map((s) => s.t).join("").trim();
}

// ── Rubriques d'inventaire : le détail en liste (mobile) ─────────────────────

/** Rubriques (grands titres) dont les paragraphes énumèrent des constats. */
const RUBRIQUES_EN_LISTE = ["architecture et fichiers"];

/** Une fin de phrase suivie d'une majuscule ou d'un chiffre : « …(74 fonctions). Le thème… ». */
const FIN_DE_PHRASE = /(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9])/;

/** Le grand titre ouvre-t-il une rubrique d'inventaire (« Architecture et fichiers ») ? */
export function estRubriqueEnListe(titre: Span[]): boolean {
  return RUBRIQUES_EN_LISTE.includes(sansAccents(texteCellule(titre)));
}

/**
 * Les constats d'un paragraphe d'inventaire, un par phrase — pour le lire en
 * liste sur un écran étroit, où un bloc de six phrases ne se parcourt pas.
 * Null s'il n'y a qu'une phrase, ou si le paragraphe porte un lien ou une mise
 * en forme, qui se perdraient à la coupe.
 */
export function phrasesEnListe(bloc: Block): string[] | null {
  if (bloc.k !== "p" || !bloc.s.every((span) => !span.h && !span.b && !span.i && !span.c)) return null;
  const phrases = texteCellule(bloc.s).split(FIN_DE_PHRASE).filter(Boolean);
  return phrases.length >= 2 ? phrases : null;
}
