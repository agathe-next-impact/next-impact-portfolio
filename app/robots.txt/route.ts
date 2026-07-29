import { NextResponse } from "next/server";

const baseUrl = "https://www.next-impact.digital";

export async function GET() {
  const content = `
# Next Impact - robots.txt
# Public content is crawlable. API and internal test routes are excluded.

User-agent: *
Allow: /
Disallow: /api/
Disallow: /demo/metadata-test
Disallow: /en/demo/metadata-test

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /demo/metadata-test
Disallow: /en/demo/metadata-test

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /demo/metadata-test
Disallow: /en/demo/metadata-test

# AI search and answer engines
User-agent: OAI-SearchBot
Allow: /
Disallow: /api/
Disallow: /demo/metadata-test
Disallow: /en/demo/metadata-test

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /
Disallow: /api/
Disallow: /demo/metadata-test
Disallow: /en/demo/metadata-test

User-agent: ClaudeBot
Allow: /
Disallow: /api/

User-agent: Claude-SearchBot
Allow: /
Disallow: /api/

User-agent: Claude-User
Allow: /
Disallow: /api/

User-agent: anthropic-ai
Allow: /
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Disallow: /api/

User-agent: Google-Extended
Allow: /
Disallow: /api/

User-agent: Applebot
Allow: /
Disallow: /api/

User-agent: Applebot-Extended
Allow: /
Disallow: /api/

User-agent: Claude-Web
Allow: /
Disallow: /api/

User-agent: Perplexity-User
Allow: /
Disallow: /api/

User-agent: CCBot
Allow: /
Disallow: /api/

User-agent: Amazonbot
Allow: /
Disallow: /api/

User-agent: Bytespider
Allow: /
Disallow: /api/

User-agent: Meta-ExternalAgent
Allow: /
Disallow: /api/

User-agent: cohere-ai
Allow: /
Disallow: /api/

User-agent: DuckAssistBot
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
