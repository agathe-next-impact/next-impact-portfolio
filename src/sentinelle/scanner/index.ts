import type { DetectedComponent, ScanResult } from "@sentinelle/types";
import { isPubliclyScannable, normalizeSiteUrl } from "@sentinelle/url";
import { buildEvidence } from "./evidence";
import { detect } from "./detect";
import { FINGERPRINTS } from "./fingerprints";
import { createBudget, fetchPage, type Budget } from "./fetch";
import { detectWordPressComponents } from "./detectors/wordpress";
import type { PageEvidence } from "./types";

export { detect } from "./detect";
export { buildEvidence } from "./evidence";
export { FINGERPRINTS } from "./fingerprints";
export { ALLOWED_PATHS, REQUEST_BUDGET, USER_AGENT, createBudget } from "./fetch";
export { detectWordPressComponents } from "./detectors/wordpress";
export type { Fingerprint, PageEvidence, Signal } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// scanSite — orchestration.
//
// Un scan = une page d'accueil lue, un catalogue d'empreintes appliqué, et au
// plus deux requêtes de confirmation quand le CMS le justifie. Le reste est du
// calcul pur.
// ─────────────────────────────────────────────────────────────────────────────

/** Limites énoncées dans le rapport — la spec impose de les dire, pas de les taire. */
const NOTE_PUBLIC = "Analyse fondée sur les seuls éléments publics de votre site : le code servi aux visiteurs et les en-têtes HTTP. Aucun test d'intrusion, aucune tentative d'accès.";
const NOTE_PARTIEL = "Seuls les composants chargés côté public sont détectables — en général 50 à 70 % des extensions installées. Votre fiche est complétée avec vous à l'activation.";
const NOTE_VERSIONS = "Certaines versions sont déduites des adresses de fichiers : elles sont indiquées comme telles et confirmées à l'activation.";
const NOTE_NON_CMS = "Ce site n'utilise pas de CMS détecté publiquement. La surveillance repose alors sur une fiche déclarative, remplie avec vous.";

function ordered(components: DetectedComponent[]): DetectedComponent[] {
  // Ordre de lecture pour le rapport : la plateforme d'abord, les détails après.
  const weight: Record<string, number> = {
    cms: 0,
    ecommerce: 1,
    framework: 2,
    cms_theme: 3,
    cms_plugin: 4,
    js_library: 5,
    runtime: 6,
    server: 7,
    hosting: 8,
    cdn: 9,
    analytics: 10,
  };

  return [...components].sort((a, b) => {
    const byType = (weight[a.type] ?? 99) - (weight[b.type] ?? 99);
    return byType !== 0 ? byType : a.label.localeCompare(b.label, "fr");
  });
}

/** Fusionne deux listes sans doublon de slug ; la première l'emporte. */
function merge(base: DetectedComponent[], extra: DetectedComponent[]): DetectedComponent[] {
  const bySlug = new Map(base.map((component) => [`${component.type}:${component.slug}`, component]));
  for (const component of extra) {
    const key = `${component.type}:${component.slug}`;
    if (!bySlug.has(key)) bySlug.set(key, component);
  }
  return [...bySlug.values()];
}

/**
 * Confirme WordPress et récupère sa version quand l'accueil ne l'a pas donnée.
 * Deux requêtes au maximum, uniquement sur des endpoints de la liste blanche.
 */
async function confirmWordPress(
  origin: string,
  budget: Budget,
  known: DetectedComponent | undefined,
): Promise<{ version: string | null; evidence: string | null }> {
  if (known?.version) return { version: known.version, evidence: null };

  const feed = await fetchPage(new URL("/feed/", origin).toString(), budget);
  if (feed.ok && feed.response.status === 200) {
    const found = /<generator>[^<]*wordpress\.org\/\?v=([\d.]+)/i.exec(feed.response.html);
    if (found?.[1]) return { version: found[1], evidence: "flux RSS" };
  }

  const api = await fetchPage(new URL("/wp-json/", origin).toString(), budget);
  if (api.ok && api.response.status === 200) {
    // Présence confirmée ; la version n'est exposée que sur certains réglages.
    return { version: null, evidence: "API REST /wp-json/" };
  }

  return { version: null, evidence: null };
}

export type ScanOutcome =
  | { ok: true; result: ScanResult }
  | { ok: false; reason: string };

/**
 * Analyse un site public et retourne les composants détectés.
 *
 * Ne lève pas : un site injoignable est un résultat, pas une exception.
 */
export async function scanSite(rawUrl: string): Promise<ScanOutcome> {
  const url = normalizeSiteUrl(rawUrl);
  if (!url) return { ok: false, reason: "adresse de site invalide" };
  if (!isPubliclyScannable(url)) {
    return { ok: false, reason: "cette adresse n'est pas un site public" };
  }

  const budget = createBudget();
  const home = await fetchPage(url, budget);
  if (!home.ok) return { ok: false, reason: home.reason };

  if (home.response.status >= 400) {
    return { ok: false, reason: `le site a répondu ${home.response.status}` };
  }

  const evidence: PageEvidence = buildEvidence(home.response);
  let components = detect(evidence, FINGERPRINTS);

  const wordpress = components.find((component) => component.slug === "wordpress");
  const isWordPress = Boolean(wordpress);

  if (isWordPress) {
    components = merge(components, detectWordPressComponents(evidence));

    const confirmation = await confirmWordPress(evidence.finalUrl || url, budget, wordpress);
    if (wordpress && confirmation.version && !wordpress.version) {
      wordpress.version = confirmation.version;
      wordpress.versionConfidence = "high";
      wordpress.evidence = [wordpress.evidence, confirmation.evidence]
        .filter(Boolean)
        .join(" · ");
    }
  }

  const notes = [NOTE_PUBLIC];
  if (isWordPress) notes.push(NOTE_PARTIEL);
  else notes.push(NOTE_NON_CMS);
  if (components.some((component) => component.versionConfidence === "medium")) {
    notes.push(NOTE_VERSIONS);
  }

  return {
    ok: true,
    result: {
      url,
      isWordPress,
      components: ordered(components),
      notes,
      scannedAt: new Date().toISOString(),
    },
  };
}
