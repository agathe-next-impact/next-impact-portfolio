import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { getCaseStudies } from "@/lib/case-studies-data";
import { CTO_PRICE_VALUE, CTO_MIN_MONTHS, CTO_NOTICE_MONTHS } from "@/lib/cto-externalise";
import { OFFER_AMOUNT_CENTS, OFFER_ISSUES_PER_MONTH } from "@/lib/sentinelle-offer";
import { SUIVI_INCLUS_MOIS } from "@/lib/maintenance-offer";

const baseUrl = "https://www.next-impact.digital";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MarkdownEntry = {
  url: string;
  title: string;
  description: string;
  content: string;
  order: number;
};

function cleanMarkdown(content: string): string {
  return content
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function excerpt(content: string, maxLength = 2500): string {
  const cleaned = cleanMarkdown(content);
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}...`;
}

function readDirectoryEntries(root: string, urlPrefix: string): MarkdownEntry[] {
  if (!fs.existsSync(root)) return [];

  const files = fs
    .readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isDirectory()) {
        return fs
          .readdirSync(path.join(root, entry.name))
          .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
          .map((file) => ({ category: entry.name, file }));
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [{ category: "", file: entry.name }];
      }

      return [];
    });

  const entries = new Map<string, MarkdownEntry>();

  for (const item of files) {
    const filePath = item.category
      ? path.join(root, item.category, item.file)
      : path.join(root, item.file);
    const slug = item.file.replace(/\.mdx?$/, "");
    const key = item.category ? `${item.category}/${slug}` : slug;
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    const previous = entries.get(key);
    const current = {
      url: item.category
        ? `${baseUrl}/${urlPrefix}/${item.category}/${slug}`
        : `${baseUrl}/${urlPrefix}/${slug}`,
      title: data.title || slug.replace(/-/g, " "),
      description: data.description || data.excerpt || "",
      content: excerpt(content),
      order: typeof data.order === "number" ? data.order : 99,
    };

    if (!previous || item.file.endsWith(".mdx")) entries.set(key, current);
  }

  return [...entries.values()].sort((a, b) => a.url.localeCompare(b.url) || a.order - b.order);
}

// Care and maintenance (lib/maintenance-offer.ts) deliberately left out of this
// file while MAINTENANCE_PRIX_VALIDES is false (charte v1.4, ADR-012).
const SENTINELLE_PRICE = OFFER_AMOUNT_CENTS / 100;
const careIncluded =
  SUIVI_INCLUS_MOIS > 0
    ? `Every package, redesign or new site, includes ${SUIVI_INCLUS_MOIS} months of care after launch.

`
    : "";

export async function GET() {
  const docs = readDirectoryEntries(
    path.join(process.cwd(), "content", "documentation"),
    "documentation",
  );
  const blogPosts = readDirectoryEntries(path.join(process.cwd(), "content", "blog"), "blog");
  const caseStudies = getCaseStudies("fr");

  const caseStudiesSection = caseStudies
    .map(
      (study) => `## ${study.title}

URL: ${baseUrl}/etudes-de-cas/${study.slug}
Client: ${study.clientName}
Technologies: ${study.technologies.join(", ")}
Description: ${study.description}
Results: ${study.results.join(" | ")}
`,
    )
    .join("\n");

  const markdownEntries = [...blogPosts, ...docs]
    .map(
      (entry) => `## ${entry.title}

URL: ${entry.url}
Description: ${entry.description}

${entry.content}
`,
    )
    .join("\n");

  const content = `# Next Impact - extended LLM context

> Extended Markdown context for agents that need to understand Next Impact, its services, case studies and educational resources.

## Entity Summary

Next Impact is a WordPress redesign studio in France led by Agathe Karinthi-Martin. Its core positioning: an aging WordPress site can become fast and modern again without rebuilding everything; the real question is what you keep and what you change. Three trajectories (consolidate: optimized WordPress; decouple: headless WordPress, recommended; rebuild: web app), fixed price and timeline, performance measured before and after. AI is a method argument (the human frames, AI executes), not the pitch. The offers are arranged in three moments. Decide: advisory call, audit + roadmap, free newsletter. Redo: the three trajectories, for a redesign or a new site. Keep it running, once the site is live: Sentinelle (personalized watch, €${SENTINELLE_PRICE} per month) and the outsourced technical expert (two tiers, from €${CTO_PRICE_VALUE} excl. VAT per month), for organisations that need ongoing technical direction without hiring. The /tarifs page lists every price by moment. The /conseil page carries the three advisory offers in order of increasing commitment (advisory call #choix-techno-ia, audit + roadmap #architecture-projet-ia, outsourced technical expert #cto-externalise); the retainer itself is detailed and subscribed on /cto-externalise. Legal entity: sole proprietorship Agathe Karinthi-Martin, French company register SIREN 532 675 386. Core expertise: WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, technical debt, SEO, technology watch (Master's degree in Technology Watch and Innovation, Aix-Marseille) and project scoping. Verifiable proof: 25+ projects delivered since 2020, 28 documented case studies, PageSpeed score raised from 45 to 98 after redesign (Proditec case study), featured in Le Figaro (May 2026).

## Offer Architecture

Three moments: Decide, Redo, Keep it running. Every price, by moment: ${baseUrl}/tarifs.

### Free entry point

- Free site analysis: one address, a report in two minutes, no access requested. It lists the site's components (CMS, plugins, server, libraries) and the ones at risk; it does not measure speed. At ${baseUrl}/scan.

### Decide

- Redesign advisory call (€150): one hour on a call, a written opinion within 48h: stay, decouple or rebuild, and why. Deducted from the quote if a project starts within 30 days. Presented on ${baseUrl}/conseil#choix-techno-ia.
- Audit + roadmap (€650): audit report (performance, security, technical debt, plugins, hosting), costed recommendations and a step-by-step roadmap. The document serves even if the work goes to someone else. Presented on ${baseUrl}/conseil#architecture-projet-ia.
- Tech watch, free newsletter: "Quelle techno pour mon site web a l'heure de l'IA ?" on Substack (monthly digest + weekly focus on the web & AI market), plus free resources and tools to decide. This is the content of the /veille page. The watch is kept by Agathe Karinthi-Martin, trained in the discipline (Master's degree in Technology Watch and Innovation, Aix-Marseille Universite).

### Redo (redesign or new site: same packages, price and timeline written before starting, 6 to 10 weeks)

${careIncluded}- Optimized WordPress redesign (from €2,250): theme, plugins and optimization of the existing site, without changing the publishing tool.
- Headless WordPress redesign (from €4,000): WordPress back office kept, modern front end: editors publish as before, visitors see a fast site. Recommended trajectory.
- Web app redesign (from €6,500): web and/or mobile platform when the site has become a working tool.

### Keep it running (subscriptions, once the site is live)

- Sentinelle (€${SENTINELLE_PRICE}/month, cancel at any time, no notice): watches the components the site actually runs and warns when one of them becomes a problem (published vulnerability, abandoned plugin, end-of-life version); ${OFFER_ISSUES_PER_MONTH} letters a month (on the 1st and the 15th) reviewed by a human before sending, with what it changes for what comes next: consolidate, evolve or rebuild. Sentinelle warns and advises, it does not intervene on the site. Based on the site's public elements. Presented and subscribed on ${baseUrl}/sentinelle (French only).
- Outsourced technical expert (two tiers, from €${CTO_PRICE_VALUE}/month, ${CTO_MIN_MONTHS}-month commitment then rolling monthly with ${CTO_NOTICE_MONTHS} months' notice): technical direction on shared time for the customer-facing digital estate of a company with no technical profile in-house. Someone who decides, writes it down, steers the vendors and answers for what is decided, and who proposes every month what should evolve. Adviser tier, €900/month: a one-hour committee each month, decisions in writing within 48h, a quarterly roadmap, three qualified evolutions a quarter, one opportunity review a year, quote review. Technical direction tier, €1,900/month: a two-hour committee, decisions within 24h, a continuously updated roadmap, three costed evolutions a month, two opportunity reviews a year, vendor scoping and follow-up, four hours of implementation a month. Deliverables: system map, dated and budgeted roadmap, record of technical decisions, quote review with a costed alternative, three-year technology budget, continuity plan and handover pack, register of proposed evolutions, opportunity review. Scope: the website and web applications, online data and tools (CRM, emailing, forms, payments, appointment booking), AI components, hosting, security and compliance of those systems, vendors and the contracts that go with them. Presented on ${baseUrl}/conseil#cto-externalise, detailed and subscribed on ${baseUrl}/cto-externalise, which remains the reference page for this offer.

### Included

- Online workspace: every engagement is tracked in an online workspace (audit, site health, monthly reports, decisions, watch letters), organised by question (Missions, Your site, Act, Watch), passwordless login, everything downloadable. Presented on ${baseUrl}/espace-client (French only).
- Implementation: build only when the solution is clear and justified.

## Key URLs

- Home: ${baseUrl}/
- Redesign advice, three offers in order of increasing commitment (advisory call €150 #choix-techno-ia, audit + roadmap €650 #architecture-projet-ia, outsourced technical expert presented at #cto-externalise): ${baseUrl}/conseil
- Outsourced technical expert (monthly technical direction): ${baseUrl}/cto-externalise
- Solutions web (three trajectories, redesign or new site): ${baseUrl}/solutions-web
- Headless WordPress pillar page: ${baseUrl}/wordpress-headless
- Free site analysis (components and the ones at risk, two minutes, no access requested): ${baseUrl}/scan
- Prices (every offer and tier, by moment): ${baseUrl}/tarifs
- Sentinelle (personalized watch on your site's components, €${SENTINELLE_PRICE}/month): ${baseUrl}/sentinelle
- Client area (tour of the online workspace and client logins): ${baseUrl}/espace-client
- Case studies: ${baseUrl}/etudes-de-cas
- Tech watch (free newsletter, resources and tools): ${baseUrl}/veille
- Documentation (decision hub "Which web tech?"): ${baseUrl}/documentation
- Tools (free decision tools, no sign-up): ${baseUrl}/outils
- Blog (data-backed field lessons and comparisons): ${baseUrl}/blog
- About (Agathe Karinthi-Martin, background and method): ${baseUrl}/a-propos
- Be found in the AI era (SEO & GEO section): ${baseUrl}/documentation/etre-trouve
- Contact: ${baseUrl}/contact
- Sitemap: ${baseUrl}/sitemap.xml

# Case Studies

${caseStudiesSection}

# Resources and Articles

${markdownEntries}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
