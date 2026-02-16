import { NextResponse } from "next/server";

export async function GET() {
  const content = `
# Next Impact — robots.txt
# https://www.next-impact.digital

# Règles par défaut — autoriser l'indexation
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

# Google — accès complet
User-agent: Googlebot
Allow: /

# Bing
User-agent: Bingbot
Allow: /

# LLMs & AI Crawlers — accès autorisé pour la visibilité IA
User-agent: GPTBot
Allow: /documentation/
Allow: /etudes-de-cas/
Allow: /services/
Allow: /solutions/
Allow: /vous-etes/
Allow: /cms-headless
Allow: /wp-headless
Allow: /
Disallow: /api/

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Cohere-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# Sitemaps
Sitemap: https://www.next-impact.digital/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
