import type {
  Confidence,
  IntelItem,
  StackItem,
  StackItemMeta,
  StackItemType,
  Verdict,
} from "@sentinelle/types";
import { isAffected, parseRange, parseVersion } from "./versions";

// ─────────────────────────────────────────────────────────────────────────────
// Croisement intel × stack — le cœur du produit, et l'endroit où sa crédibilité
// se gagne ou se perd.
//
// Une seule idée gouverne le fichier : **le doute ne produit rien**. Un faux
// négatif se rattrape à la lettre d'information suivante ; un rouge injustifié
// coûte un client, et il ne revient pas. Toutes les règles ci-dessous vont dans
// ce sens, et chacune renvoie sa raison en clair pour que le journal explique un
// silence aussi bien qu'une alerte.
//
// Trois règles portent l'essentiel :
//
//  1. **Jointure sur (slug, type, ecosystem)**, jamais sur le seul slug. Le
//     paquet npm « wordpress » et le CMS du même nom sont deux choses ; les
//     croiser produirait des alertes absurdes chez le mauvais client.
//  2. **Pas d'alerte sans version connue.** Sans version, aucune comparaison de
//     plage n'a de sens — et deviner reviendrait à alerter tout le monde.
//  3. **Pas de rouge sur une version incertaine.** Une version lue dans un
//     `?ver=` peut être celle du site et non celle du composant : elle peut
//     fonder un orange « à vérifier », jamais un rouge.
// ─────────────────────────────────────────────────────────────────────────────

/** Fenêtre du radar : une fin de support annoncée au-delà n'alerte pas encore. */
export const RADAR_MONTHS = 6;

/** Sévérités qui autorisent un rouge, telles que les sources les écrivent. */
const SEVERE = new Set(["high", "critical"]);

/** Ce dont le matching a besoin d'un stack_item. */
export type MatchableStackItem = Pick<
  StackItem,
  "id" | "clientId" | "slug" | "type" | "ecosystem" | "version" | "label"
> & { source?: StackItem["source"]; meta?: unknown };

/** Ce dont le matching a besoin d'un intel_item. */
export type MatchableIntel = Pick<
  IntelItem,
  | "id"
  | "kind"
  | "source"
  | "targetSlug"
  | "targetType"
  | "targetEcosystem"
  | "affectedRange"
  | "fixedIn"
  | "severity"
  | "title"
> & { publishedAt?: Date | null };

export type MatchDecision =
  | { matched: false; reason: string }
  | { matched: true; verdict: Verdict; reason: string };

/**
 * Confiance dans la version enregistrée.
 *
 * Une valeur déclarée par le client vaut « high » : il a regardé son
 * administration. Un composant scanné sans métadonnée retombe sur « medium » —
 * le défaut prudent, celui qui interdit le rouge. Ne jamais inverser ce défaut :
 * une donnée manquante ne doit pas ouvrir la porte au verdict le plus grave.
 */
export function versionConfidenceOf(item: MatchableStackItem): Confidence {
  const meta = (item.meta ?? {}) as StackItemMeta;
  if (meta.versionConfidence) return meta.versionConfidence;
  return item.source === "declared" ? "high" : "medium";
}

function sameEcosystem(a: string | null, b: string | null): boolean {
  return (a ?? null) === (b ?? null);
}

/** Les deux lignes parlent-elles du même composant ? */
export function targets(item: MatchableStackItem, intel: MatchableIntel): boolean {
  return (
    item.slug === intel.targetSlug &&
    (item.type as StackItemType) === intel.targetType &&
    sameEcosystem(item.ecosystem, intel.targetEcosystem)
  );
}

function monthsBetween(from: Date, to: Date): number {
  return (
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth())
  );
}

/**
 * Faut-il alerter ce client sur ce fait, et avec quel verdict ?
 *
 * Fonction pure. Le pilote (`run.ts`) ne fait qu'appliquer sa décision : c'est
 * ce qui permet de tester les six cas qui comptent sans base ni réseau.
 */
export function decide(
  item: MatchableStackItem,
  intel: MatchableIntel,
  now: Date = new Date(),
): MatchDecision {
  if (!targets(item, intel)) {
    return { matched: false, reason: "composant différent (slug, type ou écosystème)" };
  }

  if (!parseVersion(item.version)) {
    return { matched: false, reason: "version inconnue chez le client" };
  }

  // Une plage illisible est un fait de veille qu'on laisse passer sciemment :
  // mieux vaut le manquer que l'interpréter de travers.
  if (intel.affectedRange && !parseRange(intel.affectedRange)) {
    return { matched: false, reason: `plage illisible (« ${intel.affectedRange} »)` };
  }

  if (!isAffected({ version: item.version, affectedRange: intel.affectedRange, fixedIn: intel.fixedIn })) {
    return { matched: false, reason: "version hors plage affectée" };
  }

  const confidence = versionConfidenceOf(item);

  switch (intel.kind) {
    case "vulnerability": {
      const severe = SEVERE.has((intel.severity ?? "").toLowerCase());
      if (severe && confidence === "high") {
        return { matched: true, verdict: "red", reason: "version affectée, sévérité haute, version certaine" };
      }
      return {
        matched: true,
        verdict: "orange",
        reason: severe
          ? `sévérité haute mais version ${confidence === "medium" ? "probable" : "incertaine"} — orange à vérifier`
          : "version affectée, sévérité modérée",
      };
    }

    case "eol": {
      const date = intel.publishedAt ?? null;
      if (!date) {
        return { matched: true, verdict: "info", reason: "fin de support sans date" };
      }
      if (date.getTime() <= now.getTime()) {
        return { matched: true, verdict: "orange", reason: "branche sans correctifs de sécurité" };
      }
      if (monthsBetween(now, date) > RADAR_MONTHS) {
        return {
          matched: false,
          reason: `fin de support au-delà du radar (${RADAR_MONTHS} mois)`,
        };
      }
      return { matched: true, verdict: "info", reason: "fin de support à moins de six mois" };
    }

    case "release":
      return { matched: true, verdict: "info", reason: "version plus récente disponible" };

    default:
      return { matched: true, verdict: "info", reason: "information de veille" };
  }
}
