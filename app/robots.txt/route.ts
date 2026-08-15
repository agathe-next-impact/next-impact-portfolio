import { NextResponse } from "next/server";

const baseUrl = "https://www.next-impact.digital";

// Routes internes, exclues pour tous les robots sans exception.
//
// Les pages Sentinelle portent déjà un `noindex` dans leur layout ; c'est la
// seconde ceinture demandée par le plan (§ phase 2 bis). Le noindex empêche
// l'indexation d'une page visitée, le Disallow empêche la visite : ni l'espace
// abonné, ni l'admin, ni les rapports d'analyse — dont l'URL n'est pas secrète,
// seulement difficile à deviner — n'ont à se retrouver dans un index.
const PRIVATE_PATHS = ["/scan", "/admin", "/espace"];

// Pages de test internes, historiquement exclues des seuls moteurs de recherche.
const TEST_PATHS = ["/demo/metadata-test", "/en/demo/metadata-test"];

function block(agent: string, { api = true, tests = false } = {}): string {
  const lines = [`User-agent: ${agent}`, "Allow: /"];
  if (api) lines.push("Disallow: /api/");
  if (tests) for (const path of TEST_PATHS) lines.push(`Disallow: ${path}`);
  for (const path of PRIVATE_PATHS) lines.push(`Disallow: ${path}`);
  return lines.join("\n");
}

/** Moteurs de recherche : exclusion des pages de test en plus du reste. */
const SEARCH_ENGINES = ["*", "Googlebot", "Bingbot"];

/**
 * Moteurs de réponse et robots d'IA.
 *
 * OAI-SearchBot, GPTBot et ChatGPT-User sont traités à part : les deux premiers
 * indexent (mêmes exclusions qu'un moteur de recherche), le troisième agit à la
 * demande explicite d'un utilisateur.
 */
const AI_ENGINES = [
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "Meta-ExternalAgent",
  "cohere-ai",
  "DuckAssistBot",
];

export async function GET() {
  const content = [
    "# Next Impact - robots.txt",
    "# Public content is crawlable. API, internal test and Sentinelle routes are excluded.",
    "",
    ...SEARCH_ENGINES.map((agent) => `${block(agent, { tests: true })}\n`),
    "# AI search and answer engines",
    `${block("OAI-SearchBot", { tests: true })}\n`,
    `${block("GPTBot", { tests: true })}\n`,
    // ChatGPT-User agit à la demande explicite d'un utilisateur : l'API lui
    // reste ouverte, les routes privées non.
    `${block("ChatGPT-User", { api: false })}\n`,
    ...AI_ENGINES.map((agent) => `${block(agent)}\n`),
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
