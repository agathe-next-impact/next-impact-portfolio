import type { DetectedComponent } from "@sentinelle/types";
import type { PageEvidence } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Détection fine de l'écosystème WordPress.
//
// Le moteur générique sait dire « c'est un WordPress ». Ce détecteur-ci va plus
// loin : il énumère les extensions et le thème réellement chargés côté public,
// parce que c'est là que se trouvent 90 % des failles qui concernent un client.
//
// C'est le seul endroit du scanner qui connaît une technologie en particulier,
// et c'est assumé : WordPress est le parc surveillé en priorité. Le jour où
// Drupal justifiera le même traitement, il aura son propre fichier voisin —
// sans que le moteur générique change.
//
// Tout est pur : on relit l'HTML déjà récupéré, aucune requête supplémentaire.
// ─────────────────────────────────────────────────────────────────────────────

// Ces expressions capturent l'URL ENTIÈRE (match[0]) et le slug (match[1]).
//
// C'est essentiel : la version se lit dans le `?ver=` de l'URL qui a matché, et
// nulle part ailleurs. Une première version de ce fichier cherchait le `?ver=`
// dans la source entière — donc dans tout le HTML — et attribuait la même
// version à tous les composants de la page. Constaté sur wordpress.org, où
// thème et extensions héritaient tous de la version de Gutenberg. En phase 3,
// chaque composant aurait été confronté aux plages affectées avec la version
// d'un autre.
const PLUGIN_URL = /[^"'\s()<>]*\/wp-content\/(?:mu-)?plugins\/([a-z0-9][a-z0-9._-]*)\/[^"'\s()<>]*/gi;
const THEME_URL = /[^"'\s()<>]*\/wp-content\/themes\/([a-z0-9][a-z0-9._-]*)\/[^"'\s()<>]*/gi;

/**
 * Slugs à ignorer : dossiers techniques qui ne sont pas des extensions.
 * Liste courte et explicite — mieux vaut un faux positif visible qu'un filtre
 * trop large qui masquerait une extension vulnérable.
 */
const NOT_A_PLUGIN = new Set(["index", "js", "css", "assets"]);

/** Transforme « Contact-Form_7 » en libellé lisible : « Contact Form 7 ». */
export function humanizeSlug(slug: string): string {
  const words = slug.replace(/[._-]+/g, " ").trim();
  return words.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

/**
 * Version portée par la query string d'une ressource : « ?ver=5.9.3 ».
 *
 * Convention WordPress, mais peu fiable : de nombreux thèmes y mettent la
 * version du SITE et non celle de l'extension. D'où `versionConfidence:
 * "medium"` systématique sur ce qu'on en tire — la fiche sera confirmée à
 * l'onboarding, et le matching doit s'en méfier avant toute alerte rouge.
 */
export function versionFromQuery(url: string): string | null {
  const found = /[?&]ver=([^&"']+)/i.exec(url);
  const value = found?.[1]?.trim();
  if (!value) return null;

  return isPlausibleVersion(value) ? value : null;
}

/**
 * Un numéro de version, ou un horodatage de cache ?
 *
 * Constaté en conditions réelles sur wordpress.org : `?ver=1785161844` est un
 * timestamp de purge de cache. Sans ce filtre il était rapporté comme « version
 * 1785161844 », et surtout il aurait été comparé à des plages affectées en
 * phase 3 — une comparaison qui n'a aucun sens.
 *
 * Règle : une version a des points (« 6.4.3 »), ou reste un petit entier
 * (« 3 »). Un grand entier sans point est un horodatage, pas une version.
 */
export function isPlausibleVersion(value: string): boolean {
  if (/^\d+(?:\.\d+)+$/.test(value)) return true;
  return /^\d{1,3}$/.test(value);
}

interface Occurrence {
  slug: string;
  version: string | null;
  source: string;
  /** Ressource d'une bibliothèque embarquée : son `?ver=` est celui de la bibliothèque. */
  bundled: boolean;
}

/**
 * Sous-dossiers où une extension range des bibliothèques tierces. Le `?ver=`
 * d'un fichier qui s'y trouve est celui de la bibliothèque, pas de l'extension :
 * constaté sur Elementor Pro, dont `assets/lib/smartmenus/…?ver=1.2.1` donnait
 * « Elementor Pro 1.2.1 » alors que tout le reste de l'extension portait 4.3.2.
 */
const BUNDLED_LIBRARY = /\/(?:lib|libs|vendor|vendors|third-party|node_modules)\//i;

function collect(sources: string[], pattern: RegExp): Occurrence[] {
  const occurrences: Occurrence[] = [];

  for (const source of sources) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      const slug = match[1].toLowerCase();
      if (NOT_A_PLUGIN.has(slug)) continue;

      // match[0] est l'URL qui a matché — et c'est la SEULE dans laquelle on a
      // le droit de chercher une version.
      const url = match[0];
      const inside = url.slice(url.toLowerCase().indexOf(`/${slug}/`) + slug.length + 1);
      occurrences.push({
        slug,
        version: versionFromQuery(url),
        source: url,
        bundled: BUNDLED_LIBRARY.test(inside),
      });
    }
  }

  return occurrences;
}

function toComponents(
  occurrences: Occurrence[],
  type: "cms_plugin" | "cms_theme",
): DetectedComponent[] {
  const bySlug = new Map<string, Occurrence[]>();
  for (const occurrence of occurrences) {
    bySlug.set(occurrence.slug, [...(bySlug.get(occurrence.slug) ?? []), occurrence]);
  }

  return [...bySlug].map(([slug, seen]) => {
    // Une même extension apparaît souvent plusieurs fois, avec parfois des
    // versions différentes : on retient la plus fréquente parmi les ressources
    // propres à l'extension. Une bibliothèque embarquée ne compte jamais ; sans
    // autre indice, mieux vaut ne pas de version qu'une version fausse.
    const votes = new Map<string, number>();
    for (const occurrence of seen) {
      if (occurrence.bundled || !occurrence.version) continue;
      votes.set(occurrence.version, (votes.get(occurrence.version) ?? 0) + 1);
    }
    const version = [...votes].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      type,
      slug,
      label: humanizeSlug(slug),
      ecosystem: "wordpress",
      version,
      versionConfidence: version ? "medium" : null,
      // La présence est certaine : le fichier est réellement chargé par la page.
      confidence: "high",
      evidence: type === "cms_theme" ? "thème chargé par la page" : "extension chargée par la page",
    } satisfies DetectedComponent;
  });
}

/**
 * Énumère les extensions et thèmes WordPress visibles côté public.
 * Renvoie un tableau vide si le site n'est pas un WordPress.
 */
export function detectWordPressComponents(evidence: PageEvidence): DetectedComponent[] {
  const sources = [...evidence.scripts, ...evidence.links, evidence.html];

  return [
    ...toComponents(collect(sources, PLUGIN_URL), "cms_plugin"),
    ...toComponents(collect(sources, THEME_URL), "cms_theme"),
  ];
}
