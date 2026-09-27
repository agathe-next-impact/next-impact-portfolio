import type Anthropic from "@anthropic-ai/sdk";
import { normalizeUrl } from "@sentinelle/lettre/guards";
import type { DiagnosticBesoin, DiagnosticCase, DiagnosticExamen } from "@sentinelle/types";
import {
  MAX_CARACTERES,
  MAX_FAITS,
  MAX_LIGNES,
  MAX_MOTS,
  MAX_OBJECTIF,
  ISSUES,
  type Fait,
  type Grille,
} from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Garde-fous du diagnostic — le code borne ce que le modèle a écrit.
//
//  · Un fait externe n'entre dans la rédaction que si sa source est une URL
//    réellement renvoyée par la recherche web (ou une page du site analysé).
//    C'est la frontière de la règle 3 : la passe de rédaction ne reçoit que ce
//    qui l'a franchie.
//  · Une case compte cinq lignes au plus, chacune bornée en longueur, sans
//    tiret cadratin (charte éditoriale, règles typographiques).
// ─────────────────────────────────────────────────────────────────────────────

/** Les URLs que la recherche web a réellement renvoyées, sur toute la passe. */
export function urlsObtenues(messages: Anthropic.Message[]): Set<string> {
  const urls = new Set<string>();
  for (const message of messages) {
    for (const block of message.content) {
      if (block.type !== "web_search_tool_result" || !Array.isArray(block.content)) continue;
      for (const result of block.content) urls.add(normalizeUrl(result.url));
    }
  }
  return urls;
}

function hote(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Retient les faits dont la source est vérifiable : obtenue par la recherche,
 * ou page du site analysé lui-même. Les doublons d'énoncé sont écartés.
 */
export function retenirFaits(faits: Fait[], obtenues: Set<string>, siteUrl: string): Fait[] {
  const siteHote = hote(siteUrl);
  const vus = new Set<string>();

  return faits
    .filter((fait) => {
      // La source devient un lien dans le rapport : http(s) seulement.
      if (!/^https?:\/\//i.test(fait.source.trim())) return false;
      const source = normalizeUrl(fait.source);
      const duSite = siteHote !== null && hote(fait.source) === siteHote;
      if (!obtenues.has(source) && !duSite) return false;
      const cle = fait.enonce.trim().toLowerCase();
      if (vus.has(cle)) return false;
      vus.add(cle);
      return true;
    })
    .slice(0, MAX_FAITS);
}

/**
 * Tiret cadratin, et demi-cadratin d'incise (entouré d'espaces), remplacés par
 * une virgule. Le demi-cadratin d'intervalle (« 2020–2024 ») reste.
 */
export function sansTiret(texte: string): string {
  return texte
    .replace(/\s*—\s*|\s+–\s+/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/^,\s*/, "")
    .trim();
}

/**
 * Charte éditoriale (§3, §4) : mots bannis et superlatif « très » retirés
 * hors citation. Seuls les retraits sans perte de sens sont automatiques ; le
 * reste (« agence », « innovant »…) est tenu par le prompt.
 */
// Frontières de mot en Unicode : sans elles, « maîtres » perdrait « tres ».
const BANNIS: RegExp[] = [
  /\s*,?\s*(?<!\p{L})cl[ée]s? en main(?!\p{L})/giu,
  /(?<!\p{L})très\s+/giu,
  /(?<!\p{L})ultra-?\s*(?=\p{L})/giu,
];

export function selonCharte(texte: string): string {
  // Les passages entre guillemets français sont des citations : on n'y touche pas.
  return texte
    .split(/(«[^»]*»)/)
    .map((morceau) =>
      morceau.startsWith("«") ? morceau : BANNIS.reduce((t, motif) => t.replace(motif, ""), morceau),
    )
    .join("")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, (_, p: string) => (p === ":" || p === ";" ? ` ${p}` : p))
    .trim();
}

/**
 * Vingt mots au plus. Au-delà, on coupe à la dernière ponctuation forte ou
 * faible située dans les vingt premiers mots, sinon au vingtième mot, avec
 * une ellipse.
 */
export function bornerMots(ligne: string, max: number = MAX_MOTS): string {
  const mots = ligne.split(/\s+/).filter(Boolean);
  if (mots.length <= max) return ligne;
  const tete = mots.slice(0, max).join(" ");
  const ponctuation = Math.max(tete.lastIndexOf(". "), tete.lastIndexOf(" : "), tete.lastIndexOf(", "));
  if (ponctuation > tete.length / 2) return `${tete.slice(0, ponctuation).trim()}.`;
  return `${tete.replace(/[,;:.\s]+$/, "")}…`;
}

/** Coupe une ligne trop longue au dernier mot entier, avec une ellipse. */
function couper(ligne: string, max: number = MAX_CARACTERES): string {
  if (ligne.length <= max) return ligne;
  const coupe = ligne.slice(0, max - 1);
  const espace = coupe.lastIndexOf(" ");
  return `${(espace > 60 ? coupe.slice(0, espace) : coupe).replace(/[,;:.\s]+$/, "")}…`;
}

export function bornerLignes(lignes: string[]): string[] {
  return lignes
    .map((ligne) => enPhrase(couper(bornerMots(selonCharte(sansTiret(ligne.replace(/^[-•*·]\s*/, "")))))))
    .filter((ligne) => ligne.length > 0)
    .slice(0, MAX_LIGNES);
}

/** Une carte se lit en phrases : chaque ligne finit par une ponctuation forte. */
function enPhrase(ligne: string): string {
  return !ligne || /[.!?…»"]$/.test(ligne) ? ligne : `${ligne}.`;
}

/** Une ligne de la charte : tirets, mots bannis, vingt mots, longueur, point final. */
function ligneBornee(texte: string): string {
  return enPhrase(couper(bornerMots(selonCharte(sansTiret(texte)))));
}

const POIDS: Record<DiagnosticBesoin, number> = { necessaire: 2, utile: 1, pas_prioritaire: 0 };

/**
 * Les trois examens, un par prestation, dans l'ordre du catalogue ; `null`
 * s'il en manque un ou qu'un texte est vide. Un doublon : le premier gagne.
 */
export function bornerExamens(examens: DiagnosticExamen[]): DiagnosticExamen[] | null {
  const bornes: DiagnosticExamen[] = [];
  for (const prestation of ISSUES) {
    const examen = examens.find((e) => e.prestation === prestation);
    if (!examen) return null;
    const borne = {
      ...examen,
      strategique: ligneBornee(examen.strategique),
      commercial: ligneBornee(examen.commercial),
    };
    if (!borne.strategique || !borne.commercial) return null;
    bornes.push(borne);
  }
  return bornes;
}

/**
 * La recommandation suit les examens : la prestation retenue est celle dont
 * le besoin est le plus fort (à égalité, le choix du modèle l'emporte), et son
 * degré de besoin est celui de son examen. Le bandeau ne peut donc pas dire
 * « Refonte : utile » quand l'examen dit Optimisation nécessaire.
 */
export function accorderConclusion(
  conclusion: Grille["conclusion"],
  examens: DiagnosticExamen[],
): Grille["conclusion"] {
  const choisi = examens.find((e) => e.prestation === conclusion.issue);
  const plusFort = Math.max(...examens.map((e) => POIDS[e.besoin]));
  const retenu =
    choisi && POIDS[choisi.besoin] === plusFort
      ? choisi
      : examens.find((e) => POIDS[e.besoin] === plusFort)!;
  return { ...conclusion, issue: retenu.prestation, besoin: retenu.besoin };
}

/**
 * La grille bornée, ou `null` si une case s'est retrouvée vide — un
 * diagnostic à trois cases n'en est pas un, on préfère ne rien afficher.
 */
export function bornerGrille(grille: Grille): Grille | null {
  const borner = (c: DiagnosticCase): DiagnosticCase => ({ ...c, lignes: bornerLignes(c.lignes) });

  const examens = bornerExamens(grille.examens);
  if (!examens) return null;

  const bornee: Grille = {
    organisation: borner(grille.organisation),
    ecosysteme: borner(grille.ecosysteme),
    dispositif: borner(grille.dispositif),
    conclusion: accorderConclusion(
      {
        ...grille.conclusion,
        objectif: couper(selonCharte(sansTiret(grille.conclusion.objectif)), MAX_OBJECTIF),
        lignes: bornerLignes(grille.conclusion.lignes),
      },
      examens,
    ),
    examens,
  };

  const vide =
    bornee.conclusion.objectif.length === 0 ||
    [bornee.organisation, bornee.ecosysteme, bornee.dispositif, bornee.conclusion].some(
      (c) => c.lignes.length === 0,
    );
  return vide ? null : bornee;
}
