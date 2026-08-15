import type { DraftedAlert } from "@sentinelle/types";
import { FINGERPRINTS, FINGERPRINT_BY_SLUG } from "@sentinelle/scanner/fingerprints";
import { isAffected } from "@sentinelle/matching";
import { allowedComponents, type RedactionContext } from "./context";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux garde-fous qu'un schéma ne peut pas porter.
//
// Une sortie structurée garantit la FORME. Elle ne garantit rien du FOND : un
// modèle peut produire un JSON parfaitement valide qui annonce un rouge
// injustifié, ou qui cite une technologie que le client n'a pas. Ces deux
// erreurs-là coûtent un client, et c'est du code — pas un prompt — qui doit les
// arrêter.
//
//  1. **Pas de rouge hors plage ou hors sévérité haute.** La même règle que le
//     matching, réappliquée à la sortie : le prompt la demande, le code
//     l'impose. Corrigible sans risque — on abaisse en orange.
//  2. **Aucun composant cité qui ne figure pas dans le contexte.** Non
//     corrigible : un texte qui parle du mauvais composant n'est pas
//     rattrapable par une substitution, il est faux. Le brouillon est rejeté.
// ─────────────────────────────────────────────────────────────────────────────

/** Sévérités qui autorisent un rouge, telles que les sources les écrivent. */
const SEVERE = new Set(["high", "critical"]);

/**
 * Le rouge est-il justifié par les données ?
 *
 * Trois conditions cumulatives, les mêmes que côté matching : sévérité haute,
 * version réellement dans la plage, version certaine.
 */
export function redIsJustified(context: RedactionContext): boolean {
  const severe = SEVERE.has((context.intel.severity ?? "").toLowerCase());
  const certain = context.component.versionConfidence === "high";
  const affected = isAffected({
    version: context.component.version,
    affectedRange: context.intel.affectedRange,
    fixedIn: context.intel.fixedIn,
  });

  return severe && certain && affected;
}

/**
 * Noms de composants que le texte a le droit d'employer.
 *
 * Celui de l'alerte, plus la plateforme qui l'héberge : une alerte sur une
 * extension WordPress dit naturellement « votre site WordPress », et le lui
 * interdire produirait des rejets absurdes.
 */
export function allowedNames(context: RedactionContext): string[] {
  const names = allowedComponents(context);

  const platform = context.component.ecosystem
    ? FINGERPRINT_BY_SLUG.get(context.component.ecosystem)
    : undefined;
  if (platform) names.push(platform.label, platform.slug);

  return names.map((name) => name.toLowerCase());
}

function escape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Technologies nommées dans le texte alors qu'elles ne sont pas au contexte.
 *
 * Le vocabulaire de référence est le catalogue d'empreintes du scanner : c'est
 * la liste des technologies que le produit sait nommer, donc celles qu'un
 * modèle est susceptible d'inventer. Le contrôle est volontairement strict —
 * un faux positif ne fait que renvoyer la rédaction à plus tard, un faux
 * négatif envoie au client une alerte sur un composant qu'il n'a pas.
 */
export function citedOutsideContext(text: string, context: RedactionContext): string[] {
  const allowed = new Set(allowedNames(context));
  const found: string[] = [];

  for (const print of FINGERPRINTS) {
    if (allowed.has(print.label.toLowerCase())) continue;

    // Bornes de mot des deux côtés : « Vue.js » ne doit pas se déclencher sur
    // « la vue », ni « React » sur « réaction ».
    const pattern = new RegExp(`(?<![\\p{L}\\d])${escape(print.label)}(?![\\p{L}\\d])`, "iu");
    if (pattern.test(text) && !found.includes(print.label)) found.push(print.label);
  }

  return found;
}

export interface GuardOutcome {
  /** Brouillon après corrections applicables. */
  draft: DraftedAlert;
  /** Corrections appliquées — journalisées, jamais silencieuses. */
  corrections: string[];
  /** Manquements non corrigeables : le brouillon est refusé. */
  violations: string[];
  ok: boolean;
}

/** Texte du brouillon, tous champs confondus — ce que le client lira. */
function fullText(draft: DraftedAlert): string {
  return [draft.title, draft.body, draft.whatItChanges, draft.recommendedAction].join("\n");
}

export function guardDraft(draft: DraftedAlert, context: RedactionContext): GuardOutcome {
  const corrections: string[] = [];
  const violations: string[] = [];
  let guarded = draft;

  if (draft.verdict === "red" && !redIsJustified(context)) {
    guarded = { ...guarded, verdict: "orange" };
    corrections.push(
      "verdict rouge abaissé en orange : la sévérité, la plage ou la certitude de version ne le justifient pas",
    );
  }

  const invented = citedOutsideContext(fullText(guarded), context);
  if (invented.length > 0) {
    violations.push(`composants cités hors contexte : ${invented.join(", ")}`);
  }

  return { draft: guarded, corrections, violations, ok: violations.length === 0 };
}
