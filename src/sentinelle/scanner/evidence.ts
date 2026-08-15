import type { PageEvidence } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Construction de la PageEvidence à partir d'une réponse HTTP.
//
// Extraction par expressions régulières et non par un parseur DOM : on lit du
// HTML public souvent mal formé, on n'a besoin que de quelques attributs, et
// une dépendance de parsing supplémentaire coûterait plus qu'elle ne rapporte.
// Tout est pur — aucune requête réseau ici.
// ─────────────────────────────────────────────────────────────────────────────

/** Extrait les valeurs d'un attribut pour une balise donnée. */
function extractAttribute(html: string, tag: string, attribute: string): string[] {
  const tagPattern = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  const attributePattern = new RegExp(`\\b${attribute}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s">]+))`, "i");

  const values: string[] = [];
  for (const match of html.matchAll(tagPattern)) {
    const found = attributePattern.exec(match[0]);
    const value = found?.[2] ?? found?.[3] ?? found?.[4];
    if (value?.trim()) values.push(value.trim());
  }
  return values;
}

/** Contenu de <meta name="generator" content="…">, insensible à l'ordre des attributs. */
export function extractGenerator(html: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!/name\s*=\s*["']?generator["']?/i.test(tag)) continue;

    const content = /content\s*=\s*("([^"]*)"|'([^']*)'|([^\s">]+))/i.exec(tag);
    const value = content?.[2] ?? content?.[3] ?? content?.[4];
    if (value?.trim()) return value.trim();
  }
  return null;
}

/**
 * Noms des cookies posés par la réponse — jamais les valeurs.
 *
 * Une valeur de cookie peut être un identifiant de session : elle n'a rien à
 * faire dans un rapport de scan, ni en base.
 */
export function extractCookieNames(setCookieHeaders: string[]): string[] {
  const names: string[] = [];
  for (const header of setCookieHeaders) {
    for (const part of header.split(/,(?=[^;]+=)/)) {
      const name = part.split("=")[0]?.trim();
      if (name && !names.includes(name)) names.push(name);
    }
  }
  return names;
}

export interface RawResponse {
  url: string;
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  setCookies: string[];
  html: string;
}

/** Assemble tout ce que le moteur de détection sait lire. */
export function buildEvidence(response: RawResponse): PageEvidence {
  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(response.headers)) {
    headers[name.toLowerCase()] = value;
  }

  return {
    url: response.url,
    finalUrl: response.finalUrl,
    status: response.status,
    headers,
    html: response.html,
    cookieNames: extractCookieNames(response.setCookies),
    scripts: extractAttribute(response.html, "script", "src"),
    links: extractAttribute(response.html, "link", "href"),
    generator: extractGenerator(response.html),
  };
}
