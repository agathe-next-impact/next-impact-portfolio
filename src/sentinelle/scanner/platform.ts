import type { DetectedComponent } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Plateforme du site et notes du rapport — deux dérivations pures.
//
// Elles vivent hors de `index.ts` parce qu'elles sont le seul endroit du
// scanner qu'un client lit mot pour mot : elles doivent se tester sans réseau,
// sur des fixtures, et ne jamais régresser en silence.
//
// Ce que la phase 2 avait raté et que ce fichier corrige : la note était
// conditionnée à « le site est-il sous WordPress ? » et non à « un CMS a-t-il
// été détecté ? ». Un site Drupal lisait donc « Ce site n'utilise pas de CMS
// détecté publiquement » à trois lignes d'une ligne affichant « Drupal 10 ».
// Constaté en conditions réelles sur drupal.org le 2026-08-15.
// ─────────────────────────────────────────────────────────────────────────────

/** Limites énoncées dans le rapport — la spec impose de les dire, pas de les taire. */
export const NOTE_PUBLIC =
  "Analyse fondée sur les seuls éléments publics de votre site : le code servi aux visiteurs et les en-têtes HTTP. Aucun test d'intrusion, aucune tentative d'accès.";

/** Cas 1 — WordPress : les extensions sont partiellement visibles. */
export const NOTE_WORDPRESS =
  "Seuls les composants chargés côté public sont détectables — en général 50 à 70 % des extensions installées. Votre fiche est complétée avec vous à l'activation.";

/** Cas 2 — un autre CMS ou une plateforme e-commerce : rien d'interne n'est exposé. */
export function noteAutrePlateforme(label: string): string {
  return `Les composants internes de ${label} — extensions, modules, thème — ne sont pas visibles publiquement : ils ne peuvent pas être détectés depuis l'extérieur. Votre fiche se complète avec vous à l'activation.`;
}

/** Cas 3 — aucun CMS ni e-commerce détecté : la fiche est déclarative. */
export const NOTE_DECLARATIF =
  "Aucun gestionnaire de contenu ni plateforme e-commerce n'a été détecté publiquement sur ce site. La surveillance repose alors sur une fiche déclarative, remplie avec vous.";

export const NOTE_VERSIONS =
  "Certaines versions sont déduites des adresses de fichiers : elles sont indiquées comme telles et confirmées à l'activation.";

/**
 * Familles qui font office de « plateforme », par ordre de priorité.
 *
 * Un CMS prime sur une boutique (WooCommerce implique WordPress, et c'est
 * WordPress qu'on met à jour), une boutique prime sur un méta-framework
 * (PrestaShop d'abord, la bibliothèque JS ensuite).
 */
const PLATFORM_TYPES = ["cms", "ecommerce", "framework"] as const;

/** Familles qui déclenchent la note « composants internes non visibles ». */
const MANAGED_TYPES = ["cms", "ecommerce"] as const;

const CONFIDENCE_RANK = { low: 0, medium: 1, high: 2 } as const;

/** Le composant le plus sûr parmi ceux d'une famille — ordre du catalogue à égalité. */
function strongestOfType(
  components: DetectedComponent[],
  type: DetectedComponent["type"],
): DetectedComponent | null {
  let best: DetectedComponent | null = null;
  for (const component of components) {
    if (component.type !== type) continue;
    if (!best || CONFIDENCE_RANK[component.confidence] > CONFIDENCE_RANK[best.confidence]) {
      best = component;
    }
  }
  return best;
}

function firstOfTypes(
  components: DetectedComponent[],
  types: readonly DetectedComponent["type"][],
): DetectedComponent | null {
  for (const type of types) {
    const found = strongestOfType(components, type);
    if (found) return found;
  }
  return null;
}

/**
 * Plateforme du site : CMS, boutique ou méta-framework détecté.
 *
 * Remplace l'ancien `isWordPress: boolean`, seul endroit du modèle qui nommait
 * une technologie en dur — ce que la règle 6 du CLAUDE.md interdit. Renvoie un
 * slug du catalogue d'empreintes (« wordpress », « drupal », « shopify »,
 * « next »…) ou `null` quand rien de structurant n'a été reconnu.
 */
export function detectPlatform(components: DetectedComponent[]): string | null {
  return firstOfTypes(components, PLATFORM_TYPES)?.slug ?? null;
}

/**
 * Notes affichées sous le rapport de scan.
 *
 * Toujours la limite du scan public, puis **exactement une** note de portée,
 * choisie sur ce qui a été détecté et non sur une technologie présumée, puis
 * l'avertissement sur les versions déduites s'il y a lieu.
 */
export function buildNotes(components: DetectedComponent[]): string[] {
  const notes = [NOTE_PUBLIC];

  const managed = firstOfTypes(components, MANAGED_TYPES);
  if (!managed) {
    notes.push(NOTE_DECLARATIF);
  } else if (managed.slug === "wordpress") {
    notes.push(NOTE_WORDPRESS);
  } else {
    notes.push(noteAutrePlateforme(managed.label));
  }

  if (components.some((component) => component.versionConfidence === "medium")) {
    notes.push(NOTE_VERSIONS);
  }

  return notes;
}
