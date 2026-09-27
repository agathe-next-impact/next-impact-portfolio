import type { SiteSignals } from "@sentinelle/types";
import type { PageEvidence } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Signaux éditoriaux et de dispositif, lus sur la page d'accueil déjà servie.
//
// Le diagnostic en quatre cases (src/sentinelle/diagnostic/) a besoin de savoir
// ce que le site DIT (titre, promesse, rubriques, réseaux) et comment il est
// SERVI (poids, temps de réponse, en-têtes, images sans texte alternatif).
// Tout se lit dans la réponse que le scanner a déjà : aucune requête en plus,
// la liste blanche de fetch.ts ne bouge pas (règle 5).
//
// Pur, comme evidence.ts : expressions régulières sur du HTML public souvent mal
// formé, bornées en taille. Ce qui sort d'ici entre tel quel dans le contexte
// du modèle : chaque liste est plafonnée.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_EXCERPT = 1_500;
const MAX_HEADINGS = 10;
const MAX_NAV = 20;
const MAX_HOSTS = 15;

const SOCIAL_HOSTS = [
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "tiktok.com",
  "pinterest.com",
  "vimeo.com",
  "welcometothejungle.com",
];

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  laquo: "«",
  raquo: "»",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  eacute: "é",
  egrave: "è",
  ecirc: "ê",
  agrave: "à",
  ccedil: "ç",
  ocirc: "ô",
  ucirc: "û",
  icirc: "î",
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const value =
        code[1]?.toLowerCase() === "x"
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
      return Number.isFinite(value) && value > 0 && value < 0x110000
        ? String.fromCodePoint(value)
        : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

/** Texte lisible d'un fragment HTML : balises retirées, espaces réduits. */
export function textOf(fragment: string): string {
  return decodeEntities(fragment.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: string[], max: number): string[] {
  const seen: string[] = [];
  for (const value of values) {
    if (value && !seen.includes(value)) seen.push(value);
    if (seen.length >= max) break;
  }
  return seen;
}

function contentsOf(html: string, tag: string, max: number): string[] {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  return unique(
    [...html.matchAll(pattern)].map((match) => textOf(match[1] ?? "").slice(0, 200)),
    max,
  );
}

/** Valeur de `content` d'une balise meta repérée par `name` ou `property`. */
function metaContent(html: string, key: string): string | null {
  const keyPattern = new RegExp(`(?:name|property)\\s*=\\s*["']?${key}["']?(?:\\s|/|>)`, "i");
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!keyPattern.test(tag)) continue;
    const content = /content\s*=\s*("([^"]*)"|'([^']*)')/i.exec(tag);
    const value = content?.[2] ?? content?.[3];
    if (value?.trim()) return decodeEntities(value.trim()).slice(0, 400);
  }
  return null;
}

/** Les blocs JSON-LD, lus avec tolérance : un bloc invalide est ignoré. */
function jsonLd(html: string): unknown[] {
  const blocks: unknown[] = [];
  const pattern = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      const parsed: unknown = JSON.parse(match[1] ?? "");
      const graph =
        parsed && typeof parsed === "object" && "@graph" in parsed
          ? (parsed as { "@graph": unknown })["@graph"]
          : parsed;
      blocks.push(...(Array.isArray(graph) ? graph : [graph]));
    } catch {
      // JSON-LD cassé : fréquent, sans conséquence pour le diagnostic.
    }
  }
  return blocks;
}

function schemaTypes(nodes: unknown[]): string[] {
  const types: string[] = [];
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const type = (node as { "@type"?: unknown })["@type"];
    for (const value of Array.isArray(type) ? type : [type]) {
      if (typeof value === "string") types.push(value);
    }
  }
  return unique(types, MAX_HEADINGS);
}

/** Nom de l'organisation déclaré en JSON-LD (Organization et ses sous-types). */
function organisationName(nodes: unknown[]): string | null {
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const { "@type": type, name } = node as { "@type"?: unknown; name?: unknown };
    const types = Array.isArray(type) ? type : [type];
    const isOrg = types.some(
      (value) =>
        typeof value === "string" &&
        /Organization|Corporation|LocalBusiness|NGO|Store|Company/i.test(value),
    );
    if (isOrg && typeof name === "string" && name.trim()) return name.trim().slice(0, 200);
  }
  return null;
}

function hostOf(url: string, base: string): string | null {
  try {
    return new URL(url, base).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function socialLinks(html: string, base: string): string[] {
  const hrefs = [...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map(
    (match) => match[1] ?? "",
  );
  return unique(
    hrefs.filter((href) => {
      const host = hostOf(href, base);
      return host !== null && SOCIAL_HOSTS.some((social) => host === social || host.endsWith(`.${social}`));
    }),
    8,
  );
}

function navLabels(html: string): string[] {
  const labels: string[] = [];
  for (const nav of html.match(/<nav\b[\s\S]*?<\/nav>/gi) ?? []) {
    labels.push(...contentsOf(nav, "a", MAX_NAV).filter((label) => label.length <= 60));
  }
  return unique(labels, MAX_NAV);
}

/**
 * Le texte visible de la page, sans scripts, styles ni SVG. Navigation et pied
 * de page sont retirés : les rubriques voyagent déjà dans `navLabels`, et
 * l'extrait borné doit porter le discours, pas les menus.
 */
function visibleText(html: string): string {
  const body = /<body\b[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  return textOf(
    body
      .replace(/<(script|style|noscript|svg|template|nav|footer)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " "),
  );
}

// ── Signaux commerciaux ─────────────────────────────────────────────────────
// Ce qu'un dirigeant juge d'un site : montre-t-il des preuves, invite-t-il à
// agir, peut-on le contacter ? Détection par vocabulaire, donc indicative : le
// brief le présente comme « repéré sur la page », jamais comme un constat fort.

const PREUVES: Array<[string, RegExp]> = [
  ["témoignages", /t[ée]moignage/i],
  ["avis clients", /\bavis (?:client|de nos|google)|\bnote moyenne|\d[,.]\d\s*\/\s*5\b/i],
  ["références clients", /ils nous font confiance|nos clients|nos r[ée]f[ée]rences|r[ée]f[ée]rences clients/i],
  ["études de cas", /[ée]tudes? de cas|cas clients?|r[ée]alisations/i],
  ["chiffres clés", /\b\d[\d\s]*\s?(?:%|clients|entreprises|ans d'exp|projets|apprenants|dipl[ôo]m)/i],
  ["certifications ou labels", /certifi|qualiopi|\blabel|\brncp\b|agr[ée]{2}/i],
  ["partenaires", /\bpartenaires?\b/i],
  ["garanties", /\bgaranti/i],
  ["prix affichés", /\d\s?(?:€|euros)|\btarifs?\b/i],
];

const APPEL = /contact|devis|rendez-vous|\brdv\b|essai|d[ée]mo|appel|inscri|r[ée]serv|command|achet|candidat|t[ée]l[ée]charg|parlons|discutons|demander/i;

function appelsAction(html: string): string[] {
  const libelles = [
    ...contentsOf(html, "a", 400),
    ...contentsOf(html, "button", 100),
  ].filter((texte) => texte.length >= 3 && texte.length <= 50 && APPEL.test(texte));
  return unique(libelles, 8);
}

function formulaires(html: string): number {
  return (html.match(/<form\b[\s\S]*?<\/form>/gi) ?? []).filter(
    (form) => !/type\s*=\s*["']?search|role\s*=\s*["']?search/i.test(form),
  ).length;
}

export function buildSignals(evidence: PageEvidence, responseMs: number | null): SiteSignals {
  const { html, headers } = evidence;
  const base = evidence.finalUrl || evidence.url;
  const nodes = jsonLd(html);
  const text = visibleText(html);
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  const siteHost = hostOf(base, base);

  const thirdPartyHosts = unique(
    evidence.scripts
      .map((src) => hostOf(src, base))
      .filter((host): host is string => host !== null && host !== siteHost),
    MAX_HOSTS,
  );

  return {
    title: contentsOf(html, "title", 1)[0] ?? null,
    description: metaContent(html, "description"),
    lang: /<html\b[^>]*\blang\s*=\s*["']?([\w-]+)/i.exec(html)?.[1] ?? null,
    h1: contentsOf(html, "h1", 3),
    h2: contentsOf(html, "h2", MAX_HEADINGS),
    siteName: organisationName(nodes) ?? metaContent(html, "og:site_name"),
    schemaTypes: schemaTypes(nodes),
    socialLinks: socialLinks(html, base),
    navLabels: navLabels(html),
    excerpt: text.slice(0, MAX_EXCERPT),
    wordCount: text ? text.split(" ").length : 0,
    proofs: PREUVES.filter(([, motif]) => motif.test(text)).map(([libelle]) => libelle),
    callsToAction: appelsAction(html),
    formCount: formulaires(html),
    contactLinks: (html.match(/href\s*=\s*["'](?:tel|mailto):/gi) ?? []).length,
    htmlBytes: new TextEncoder().encode(html).byteLength,
    responseMs,
    imageCount: images.length,
    imagesWithoutAlt: images.filter((tag) => !/\balt\s*=/i.test(tag)).length,
    scriptCount: (html.match(/<script\b/gi) ?? []).length,
    thirdPartyHosts,
    hasViewport: metaContent(html, "viewport") !== null,
    hasCanonical: /<link\b[^>]*rel\s*=\s*["']?canonical/i.test(html),
    hasOpenGraph: metaContent(html, "og:title") !== null,
    https: base.startsWith("https://"),
    securityHeaders: {
      hsts: "strict-transport-security" in headers,
      csp: "content-security-policy" in headers,
      xFrameOptions: "x-frame-options" in headers,
    },
  };
}
