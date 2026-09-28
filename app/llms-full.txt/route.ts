import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { getCaseStudies } from "@/lib/case-studies-data";
import {
  CTO_PRICE_VALUE,
  CTO_MIN_MONTHS,
  CTO_NOTICE_MONTHS,
  CTO_TIERS,
} from "@/lib/cto-externalise";
import { OFFER_AMOUNT_CENTS, OFFER_ISSUES_PER_MONTH } from "@/lib/sentinelle-offer";
import {
  MAINTENANCE_COMMITMENT,
  MAINTENANCE_GRID_COLUMNS,
  MAINTENANCE_PATH,
  MAINTENANCE_PRICE_VALUE,
  MAINTENANCE_PRIX_VALIDES,
  MAINTENANCE_TIERS,
  SUIVI_INCLUS_MOIS,
  maintenancePriceLabel,
} from "@/lib/maintenance-offer";
import { OFFERS as CONSEIL_OFFERS } from "@/lib/visio-conseil";
import {
  TRAJECTOIRES,
  TRAJECTOIRE_ORDER,
  formatEuros,
  type TrajectoireSlug,
} from "@/lib/trajectoires";
import {
  BESOINS,
  PACKS_PATH,
  SITUATIONS,
  VEILLE,
  VEILLE_TITRE,
  packBudgetLabel,
  sansSommeDeParcours,
  packHref,
  packPrixEntree,
  trajectoireDuPack,
  packNom,
  situationsDuBesoin,
  type Situation,
} from "@/lib/situations";

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

// Three moments: Diagnose, Evolve, Manage (ADR-013), read by situation since
// ADR-014: three needs, seven situations, one pack per situation. A pack is NOT
// one more offer: it puts catalogue lines in order and gives their budget. The
// catalogue stays at seven lines. Sentinelle sits OUTSIDE the catalogue: it is
// described on its own, with its page and its price.
//
// No offer name, no price and no budget is copied here: each one is read from
// its source (lib/visio-conseil.ts, lib/trajectoires.ts,
// lib/cto-externalise.ts, lib/sentinelle-offer.ts, lib/maintenance-offer.ts,
// lib/situations.ts), so this file follows the displayed content when a name,
// a price or a situation changes.
//
// Care and maintenance: the lines that mention it depend on
// MAINTENANCE_PRIX_VALIDES. While the flag is false (page in noindex), the
// offer is left out of this file; it comes in when the flag turns true. Pack
// pages display a care budget: they follow the same flag.
const SENTINELLE_PRICE = OFFER_AMOUNT_CENTS / 100;

const price = (amount: number) => formatEuros(amount, "en");

/** A source string reused mid-sentence. */
const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

const conseilPrice = (id: string) =>
  price(CONSEIL_OFFERS.find((offer) => offer.id === id)!.tiers[0].value);
const AUDIT_PRICE = conseilPrice("architecture-projet-ia");

/** "Name (technical name, from price)", as displayed on the cards. */
const trajectoireLabel = (slug: TrajectoireSlug) => {
  const t = TRAJECTOIRES[slug];
  return `${t.name.en} (${t.technique.en}, from ${price(t.priceValue)})`;
};
const trajectoireUrl = (slug: TrajectoireSlug) => `${baseUrl}${TRAJECTOIRES[slug].href}`;
const trajectoireNames = TRAJECTOIRE_ORDER.map((slug) => TRAJECTOIRES[slug].name.en).join(", ");
const trajectoireSummary = TRAJECTOIRE_ORDER.map((slug) => {
  const t = TRAJECTOIRES[slug];
  return `${t.name.en}: ${t.technique.en}${t.recommended ? ", recommended" : ""}, from ${price(t.priceValue)} excl. VAT`;
}).join("; ");

/**
 * The two Redesign variants (ADR-031), read from lib/trajectoires.ts:
 * "Custom WordPress, from €2,250 excl. VAT (when …); Headless WordPress, …".
 */
const refonteVariants = (TRAJECTOIRES["forfait-headless"].variantes ?? [])
  .map((v) => `${v.technique.en}, from ${price(v.priceValue)} excl. VAT (${lowerFirst(v.quand.en).replace(/\.$/, "")})`)
  .join("; ");

const CTO_REFERENT = CTO_TIERS.find((tier) => tier.id === "referent")!;
const CTO_DIRECTION = CTO_TIERS.find((tier) => tier.id === "direction")!;

const maintenanceTier = (id: "essentiel" | "actif") =>
  MAINTENANCE_TIERS.find((tier) => tier.id === id)!;

/**
 * Care and maintenance grid, by site type and by tier (ADR-014): "WordPress
 * site: Essential €89 excl. VAT per month, Active €249 excl. VAT per month;
 * Headless site or web app: …". Read from lib/maintenance-offer.ts.
 */
const maintenanceGrid = MAINTENANCE_GRID_COLUMNS.map((col) => {
  const tiers = MAINTENANCE_TIERS.map(
    (tier) => `${tier.name.en} ${maintenancePriceLabel(tier.id, col.kind, "en")}`,
  ).join(", ");
  // Label kept as written: "WordPress site" starts with a proper noun.
  return `${col.label.en}: ${tiers}`;
}).join("; ");

const maintenanceSummary = MAINTENANCE_PRIX_VALIDES
  ? `care and maintenance (two tiers, from ${price(MAINTENANCE_PRICE_VALUE)} excl. VAT per month depending on the type of site, continuous watch with Sentinelle included) and `
  : "";

const maintenanceOffer = MAINTENANCE_PRIX_VALIDES
  ? `- Care and maintenance (two tiers, from ${price(MAINTENANCE_PRICE_VALUE)}/month): someone keeps the site running. Uptime monitored, daily backup, checked updates, vulnerabilities fixed, a monthly report in the online workspace. Continuous watch on the installed components, with Sentinelle included. Two tiers, ${maintenanceTier("essentiel").name.en} and ${maintenanceTier("actif").name.en}, for every type of site. Monthly grid: ${maintenanceGrid}. A headless site or a web app means two environments to keep running, each with its own updates. ${MAINTENANCE_COMMITMENT.en} Care starts with a review of the site. Presented on ${baseUrl}${MAINTENANCE_PATH} (French only), the page of the Manage moment, alongside the outsourced technical expert.
`
  : "";

const maintenanceKeyUrl = MAINTENANCE_PRIX_VALIDES
  ? `- WordPress maintenance, maintain and evolve over time (the Manage moment page, French only: care and maintenance, with monitoring, backups, checked updates, monthly report, continuous watch with Sentinelle included, two tiers ${maintenanceTier("essentiel").name.en} and ${maintenanceTier("actif").name.en}, grid by type of site, from ${price(MAINTENANCE_PRICE_VALUE)}/month, tiers detailed on /packs/site-a-tenir; and the outsourced technical expert, two tiers ${CTO_REFERENT.name.en} and ${CTO_DIRECTION.name.en}, from ${price(CTO_PRICE_VALUE)}/month, tiers detailed on /packs/decisions-techniques and /cto-externalise): ${baseUrl}${MAINTENANCE_PATH}
`
  : "";

// No offer name and no link while care and maintenance is left out of this file.
const sentinelleIncluded = MAINTENANCE_PRIX_VALIDES
  ? "included in care and maintenance"
  : "included in site care";
const careIncluded =
  SUIVI_INCLUS_MOIS > 0
    ? `Every service, redesign or new site, includes ${SUIVI_INCLUS_MOIS} months of care after launch.

`
    : "";

// ─── Technical and strategic watch (ADR-014) ────────────────────────────────
// Defined once, in VEILLE (lib/situations.ts): this file quotes it, it does not
// rewrite it. Where each form applies follows the care flag, like the rest.
const watchContinuousWhere = MAINTENANCE_PRIX_VALIDES
  ? `${lowerFirst(VEILLE.continu.ou.en)} (the outsourced technical expert)`
  : "in the outsourced technical expert";

const watchSection = `- ${VEILLE["premiere-analyse"].label.en}, ${lowerFirst(VEILLE["premiere-analyse"].ou.en)}. As the site defines it: "${VEILLE["premiere-analyse"].detail.en}"
- ${VEILLE.continu.label.en}, ${watchContinuousWhere}. As the site defines it: "${VEILLE.continu.detail.en}"`;

// ─── The offer by situation (ADR-014) ───────────────────────────────────────
// Three needs, seven situations, one pack per situation. Everything is read from
// lib/situations.ts: phrases, steps, step prices, computed budget. A pack is
// not a catalogue line, it assembles some.
const WHEN = { avant: "before", pendant: "during", apres: "after" } as const;

const packLine = (situation: Situation) => {
  const steps = situation.steps
    .map((step) => `${WHEN[step.quand]}, ${step.offre.en} (${lowerFirst(step.prix.en)})`)
    .join("; ");
  // Service page (page.solution): it shows the fixed price of the service, no
  // longer the first-year budget (which stays on /tarifs).
  const service = situation.page.solution && trajectoireDuPack(situation);
  const variant = !service && !sansSommeDeParcours(situation) && situation.budget.variante
    ? ` ${situation.budget.variante.label.en}: ${price(situation.budget.variante.total)} excl. VAT.`
    : "";
  const cost = service
    ? `Fixed price: ${lowerFirst(packPrixEntree(situation, "en"))}`
    : sansSommeDeParcours(situation)
      ? `Price: ${lowerFirst(packPrixEntree(situation, "en"))}`
      : `Floor budget: ${packBudgetLabel(situation, "en")}`;
  const recommended = situation.recommended ? " Recommended path." : "";
  return `- ${packNom(situation, "en")}: for the situation "${situation.phrase.en}". Offer at the centre of the path, ${situation.offre.en}. ${situation.resultat.en} Steps: ${steps}. ${cost}.${variant}${recommended} ${situation.lienExterne ? `Booking: ${situation.lienExterne}` : `Page (French only): ${baseUrl}${packHref(situation.slug)}`}`;
};

const packsSection = MAINTENANCE_PRIX_VALIDES
  ? `## Offer by Situation

The offer reads by situation, no longer by type of offer: the visitor starts from a need, recognises a situation, and reaches the path that answers it. ${BESOINS.length} needs, ${SITUATIONS.length} situations, one path per situation. A path is not one more offer: it puts catalogue offers in order (before, during, after) and gives their budget. Each path is named by a single term (${SITUATIONS.map((situation) => packNom(situation, "en")).join(", ")}). It creates no price and no discount: its budget is a floor, excluding VAT, the sum of public prices. The catalogue remains the one in the next section. Pack index (French only): ${baseUrl}${PACKS_PATH}.

${BESOINS.map(
  (besoin) => `### ${besoin.moment.en}: "${besoin.phrase.en}"

Offers detailed on ${baseUrl}${besoin.href}.

${situationsDuBesoin(besoin.key).map(packLine).join("\n")}`,
).join("\n\n")}

`
  : "";

const packsKeyUrl = MAINTENANCE_PRIX_VALIDES
  ? `- Offers by situation (${BESOINS.length} needs, ${SITUATIONS.length} situations, one path per situation with what comes before, during and after, and its budget; French only): ${baseUrl}${PACKS_PATH}
`
  : "";

const packsSummary = MAINTENANCE_PRIX_VALIDES
  ? `The offer reads by situation: ${BESOINS.length} needs (${BESOINS.map((besoin) => `"${besoin.phrase.en}"`).join(", ")}), ${SITUATIONS.length} situations, one path per situation with its budget (/packs page); a path assembles catalogue offers, it adds none. `
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

> Extended Markdown context for agents that need to understand Next Impact, its services, case studies and educational resources. The website itself is published in French only: every URL below serves French content (this file is an English summary).

## Entity Summary

Next Impact is a WordPress redesign studio in France led by Agathe Karinthi-Martin. Its core positioning: an aging WordPress site can become fast and modern again without rebuilding everything; the real question is what you keep and what you change. Three services at a fixed price (${trajectoireSummary}), price and timeline written before starting, performance measured before and after. AI is a method argument (the human frames, AI executes), not the pitch. ${packsSummary}The catalogue has seven offers, arranged in three moments. Diagnose, before choosing: a free 15-minute call, audit + roadmap (${AUDIT_PRICE}). Evolve: the three services, for a redesign or a new site. Manage, once the site is live: ${maintenanceSummary}the outsourced technical expert (two tiers, from €${CTO_PRICE_VALUE} excl. VAT per month), for organisations that need ongoing technical direction without hiring. Every offer carries a technical and strategic watch: a first analysis in the audit + roadmap and in the three services, a continuous watch in the subscriptions of the Manage moment. Outside the catalogue: the free newsletter (/veille page) and Sentinelle (personalized watch on the site's components, €${SENTINELLE_PRICE} per month), subscribed from the free site analysis report and ${sentinelleIncluded}. The /tarifs page lists the paths and every price of the catalogue. The /conseil page carries the two offers of the Diagnose moment in order of increasing commitment (free 15-minute call #choix-techno-ia, audit + roadmap #architecture-projet-ia); a closing banner points to the outsourced technical expert, which is detailed and subscribed on /cto-externalise. Legal entity: sole proprietorship Agathe Karinthi-Martin, French company register SIREN 532 675 386. Core expertise: WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, technical debt, SEO, technology watch (Master's degree in Technology Watch and Innovation, Aix-Marseille) and project scoping. Verifiable proof: 25+ projects delivered since 2020, ${caseStudies.length} documented case studies, PageSpeed score raised from 45 to 98 after redesign (Proditec case study), featured in Le Figaro (May 2026).

${packsSection}## Offer Architecture

The catalogue: seven offers, arranged in three moments, Diagnose, Evolve, Manage. These are the only offers; paths assemble them. The paths and every price and tier of the catalogue: ${baseUrl}/tarifs.

### ${VEILLE_TITRE.en} (what sets each offer apart)

Technical: what threatens what the client already runs. Strategic: what the context makes possible and the site does not do yet. It takes two forms.

${watchSection}

### Free entry point

- Free site analysis: one address, no access requested, the result by email. The site compared with its competitors, what it does for the business, what it is made of (CMS, plugins, server, libraries), what is at risk, and the service that fits the situation. At ${baseUrl}/scan (French only).

### Diagnose (before choosing: two one-off offers)

- 15-minute call: free, no commitment. Fifteen minutes on a video call to lay out the situation and know where to start (site analysis, audit + roadmap or a quote). Booked online from ${baseUrl}/conseil#choix-techno-ia; it is also where the "Let's talk about your project" button leads across the site.
- Audit + roadmap (${AUDIT_PRICE}): audit report (performance, security, technical debt, plugins, hosting), a first technical and strategic watch analysis, costed recommendations, a step-by-step roadmap and a 1-hour debrief by video call. The document serves even if the work goes to someone else. Presented on ${baseUrl}/conseil#architecture-projet-ia.

### Free newsletter (outside the catalogue)

- Tech watch, free newsletter: "Quelle techno pour mon site web a l'heure de l'IA ?" on Substack (monthly digest + weekly focus on the web & AI market), plus free resources and tools to decide. It is presented on the /veille page, second after Sentinelle (outside the catalogue, see below). The watch is kept by Agathe Karinthi-Martin, trained in the discipline (Master's degree in Technology Watch and Innovation, Aix-Marseille Universite).

### Evolve (three services at a fixed price, redesign or new site: price and timeline written before starting, 6 to 10 weeks)

Each service carries a single name, the technical name as a subtitle, and starts with a first technical and strategic watch analysis.

${careIncluded}- ${trajectoireLabel("forfait-classique")}: the existing WordPress site is kept and brought up to standard (speed, plugin clean-up, security, hosting), with no rebuild and no new theme. Presented on ${trajectoireUrl("forfait-classique")}.
- ${trajectoireLabel("forfait-headless")}: the site is rebuilt and the team still publishes in WordPress. Two variants on an equal footing, chosen according to the situation (the site analysis decides): ${refonteVariants}. Recommended service. Presented on ${trajectoireUrl("forfait-headless")}.
- ${trajectoireLabel("forfait-webapp")}: web and/or mobile platform when the site has become a working tool. Presented on ${trajectoireUrl("forfait-webapp")}.

### Manage (subscriptions, once the site is live)

${maintenanceOffer}- Outsourced technical expert (two tiers, from €${CTO_PRICE_VALUE}/month, ${CTO_MIN_MONTHS}-month commitment then rolling monthly with ${CTO_NOTICE_MONTHS} months' notice): technical direction on shared time for the customer-facing digital estate of a company with no technical profile in-house. Someone who decides, writes it down, steers the vendors and answers for what is decided, and who proposes every month what should evolve. Adviser tier, ${price(CTO_REFERENT.price)}/month: a one-hour committee each month, decisions in writing within 48h, a quarterly roadmap, a dedicated watch of one page a month, three qualified evolutions a quarter, one opportunity review a year, quote review. Technical direction tier, ${price(CTO_DIRECTION.price)}/month: a two-hour committee, decisions within 24h, a continuously updated roadmap, a dedicated watch of one page a month plus a same-day alert, three costed evolutions a month, two opportunity reviews a year, vendor scoping and follow-up, four hours of implementation a month. The watch is continuous here: what puts at risk what already runs, and what the system could do and does not do yet. No retainer starts without the audit + roadmap first. Deliverables: system map, dated and budgeted roadmap, record of technical decisions, quote review with a costed alternative, three-year technology budget, continuity plan and handover pack, register of proposed evolutions, opportunity review. Scope: the website and web applications, online data and tools (CRM, emailing, forms, payments, appointment booking), AI components, hosting, security and compliance of those systems, vendors and the contracts that go with them. Detailed and subscribed on ${baseUrl}/cto-externalise, the reference page for this offer.

### Outside the catalogue: Sentinelle

- Sentinelle (€${SENTINELLE_PRICE}/month, cancel at any time, no notice): not a catalogue offer. It is subscribed from the free site analysis report (${baseUrl}/scan) and is ${sentinelleIncluded}. It is a tech watch letter on the client's project: ${OFFER_ISSUES_PER_MONTH} letters a month (on the 1st and the 15th), by email, prepared with AI and reviewed by a human before sending. Each letter has four parts: what changed (dated and sourced facts: vulnerability, end of support, new rule), the site in twelve points each concluded by act, watch or not concerned, three actions at most in order of urgency, and what comes next (three scenarios, consolidate, evolve or rebuild, with their order of cost, a six-month schedule and three questions to ask the provider). Between two letters, an alert if a severe vulnerability hits a version actually installed. Sentinelle warns and advises, it does not intervene on the site. Based on the site's public elements. Presented on ${baseUrl}/sentinelle and as the first section of ${baseUrl}/veille (both French only).

### Included

- Online workspace: every engagement is tracked in an online workspace (audit, site health, monthly reports, decisions, watch letters), organised by question (Missions, Your site, Act, Watch), passwordless login, everything downloadable. Presented on ${baseUrl}/espace-client (French only).
- Implementation: build only when the solution is clear and justified.

## Key URLs

- Home (promise, proof and the offer by situation, three columns, one per need): ${baseUrl}/
${packsKeyUrl}- Redesign advice, two offers in order of increasing commitment (free 15-minute call #choix-techno-ia, audit + roadmap ${AUDIT_PRICE} #architecture-projet-ia), plus a closing banner that points to the outsourced technical expert: ${baseUrl}/conseil
${maintenanceKeyUrl}- Outsourced technical expert (monthly technical direction, two tiers, from €${CTO_PRICE_VALUE}/month): ${baseUrl}/cto-externalise
- Solutions web (three services at a fixed price: ${trajectoireNames}; redesign or new site): ${baseUrl}/solutions-web
- Headless WordPress pillar page (one of the two Redesign variants, alongside custom WordPress): ${baseUrl}/wordpress-headless
- Free site analysis (compared with competitors, components, what is at risk, the fitting service; result by email, no access requested; French only): ${baseUrl}/scan
- Prices (the paths by need with their budget, then every offer and tier of the catalogue, by moment; French only): ${baseUrl}/tarifs
- Sentinelle, the tech watch letter for your website (outside the catalogue, subscribed from the site analysis report: ${OFFER_ISSUES_PER_MONTH} letters a month on your site, twelve points each concluded by act, watch or not concerned, three actions at most, an alert when a severe vulnerability hits an installed component, reviewed before sending, €${SENTINELLE_PRICE}/month, no commitment): ${baseUrl}/sentinelle
- Client area (tour of the online workspace and client logins): ${baseUrl}/espace-client
- Case studies: ${baseUrl}/etudes-de-cas
- Tech watch for decision-makers, in this order: Sentinelle, the personalized watch on your site (€${SENTINELLE_PRICE}/month, outside the catalogue), then the free newsletter, then free resources and tools (French only): ${baseUrl}/veille
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
