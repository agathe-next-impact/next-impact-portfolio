import type { ApercuStatut, DetectedComponent, ScanResult, Verdict } from "@sentinelle/types";
import {
  decide,
  type MatchableIntel,
  type MatchableStackItem,
} from "@sentinelle/matching";

// ─────────────────────────────────────────────────────────────────────────────
// Dossier de l'aperçu de veille — la partie déterministe.
//
// Même règle que la lettre (CLAUDE.md, règle 3) : le modèle ne connaît rien, il
// reçoit tout. Ce fichier croise les composants du scan avec l'intel déjà en
// base via `decide()` — le même moteur que les alertes clients, pour que
// l'aperçu ne puisse pas être plus alarmiste que le produit — puis rend le
// dossier en texte. Tout est pur et se teste sans réseau ni base.
// ─────────────────────────────────────────────────────────────────────────────

/** Les cinq grands thèmes de la lettre, tels qu'affichés sur /veille. */
export const APERCU_THEMES = [
  { slug: "socle", label: "Socle technique & sécurité" },
  { slug: "visibilite", label: "Visibilité & contenu" },
  { slug: "performance", label: "Performance & expérience" },
  { slug: "ia-donnees", label: "IA, données & conformité" },
  { slug: "couts", label: "Coûts, prestataires & réversibilité" },
] as const;

export type ApercuThemeSlug = (typeof APERCU_THEMES)[number]["slug"];

export const APERCU_STATUTS: ApercuStatut[] = [
  "agir",
  "surveiller",
  "rien_a_signaler",
  "non_observable",
];

/** Un fait retenu par le croisement, prêt à entrer dans le dossier. */
export interface ApercuConstat {
  verdict: Verdict;
  composant: string;
  version: string | null;
  titre: string;
  severite: string | null;
  publieLe: string | null;
  source: string;
}

/**
 * Adapte un composant scanné au contrat du moteur de matching. Les identifiants
 * sont synthétiques : `decide()` ne s'en sert pas, il raisonne sur slug, type,
 * écosystème, version et confiance.
 */
export function toMatchable(component: DetectedComponent): MatchableStackItem {
  return {
    id: "apercu",
    clientId: "apercu",
    slug: component.slug,
    type: component.type,
    ecosystem: component.ecosystem,
    version: component.version,
    label: component.label,
    source: "scanned",
    meta: component.versionConfidence
      ? { versionConfidence: component.versionConfidence }
      : {},
  };
}

/**
 * Croise les composants du scan avec l'intel candidate. Le doute ne produit
 * rien : seuls les couples retenus par `decide()` entrent au dossier.
 */
export function croiser(
  result: ScanResult,
  intel: MatchableIntel[],
  now: Date,
): ApercuConstat[] {
  const constats: ApercuConstat[] = [];

  for (const component of result.components) {
    const stack = toMatchable(component);
    for (const item of intel) {
      const decision = decide(stack, item, now);
      if (!decision.matched) continue;
      constats.push({
        verdict: decision.verdict,
        composant: component.label,
        version: component.version,
        titre: item.title,
        severite: item.severity ?? null,
        publieLe: item.publishedAt ? item.publishedAt.toISOString().slice(0, 10) : null,
        source: item.source,
      });
    }
  }

  // Les plus graves d'abord, et un plafond : l'aperçu est un échantillon, pas
  // un inventaire — et le contexte du modèle n'a pas à grossir avec lui.
  const poids: Record<string, number> = { red: 0, orange: 1, info: 2 };
  constats.sort((a, b) => (poids[a.verdict] ?? 9) - (poids[b.verdict] ?? 9));
  return constats.slice(0, 12);
}

/**
 * Rend le dossier en texte pour la passe de rédaction. Tout ce que le modèle a
 * le droit d'affirmer est ici — et rien d'autre (pas d'e-mail, pas d'IP : le
 * scan public n'en connaît pas).
 */
export function renderDossier(result: ScanResult, constats: ApercuConstat[]): string {
  const lignes: string[] = [];

  lignes.push(`Site analysé : ${result.url}`);
  lignes.push(`Analyse externe du ${result.scannedAt.slice(0, 10)} — éléments publics uniquement.`);
  lignes.push(`Plateforme reconnue : ${result.platform ?? "aucune (rien de structurant identifié)"}`);
  lignes.push("");

  lignes.push("## Composants détectés");
  if (result.components.length === 0) {
    lignes.push("Aucun composant identifiable publiquement.");
  }
  for (const c of result.components) {
    const version = c.version
      ? `version ${c.version}${c.versionConfidence === "high" ? "" : " (déduite, à confirmer)"}`
      : "version inconnue";
    lignes.push(`- ${c.label} (${c.type}) — ${version}`);
  }
  lignes.push("");

  lignes.push("## Faits datés concernant ces composants");
  if (constats.length === 0) {
    lignes.push(
      "Aucun fait collecté ne concerne un composant détecté dans une version affectée. " +
        "C'est une information : rien d'observable n'appelle d'action aujourd'hui.",
    );
  }
  for (const constat of constats) {
    lignes.push(
      `- [${constat.verdict}] ${constat.composant}` +
        `${constat.version ? ` ${constat.version}` : ""} — ${constat.titre}` +
        `${constat.severite ? ` (sévérité ${constat.severite})` : ""}` +
        `${constat.publieLe ? `, publié le ${constat.publieLe}` : ""}` +
        ` — source ${constat.source}`,
    );
  }
  lignes.push("");

  lignes.push("## Thèmes attendus");
  for (const theme of APERCU_THEMES) {
    lignes.push(`- ${theme.slug} : ${theme.label}`);
  }

  return lignes.join("\n");
}
