import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getAllSlugs } from "@/lib/case-studies-data";

const baseUrl = "https://www.next-impact.digital";
const contentRoots = ["content", path.join("content", "en")];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UrlOptions = {
  changefreq: "weekly" | "monthly" | "yearly";
  priority: number;
  lastmod?: string;
};

type ContentEntry = {
  slug: string;
  lastmod?: string;
  isMdx?: boolean;
};

function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

async function pathLastmod(relativePath: string): Promise<string | undefined> {
  try {
    const stat = await fs.stat(path.join(process.cwd(), relativePath));
    return toIsoDate(stat.mtime);
  } catch {
    return undefined;
  }
}

async function maxLastmod(paths: string[]): Promise<string | undefined> {
  const dates = (await Promise.all(paths.map(pathLastmod))).filter(Boolean) as string[];
  return dates.sort().at(-1);
}

async function readContentFiles(section: "documentation" | "blog") {
  const entries = new Map<string, ContentEntry>();

  for (const root of contentRoots) {
    const sectionDir = path.join(process.cwd(), root, section);
    try {
      const firstLevel = await fs.readdir(sectionDir, { withFileTypes: true });
      for (const entry of firstLevel) {
        if (section === "blog" && entry.isFile() && entry.name.endsWith(".mdx")) {
          const slug = entry.name.replace(/\.mdx$/, "");
          const previous = entries.get(slug);
          if (!previous) entries.set(slug, { slug, isMdx: true });
        }

        if (section === "documentation" && entry.isDirectory()) {
          const categoryDir = path.join(sectionDir, entry.name);
          const files = await fs.readdir(categoryDir);
          for (const file of files) {
            if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
            const slug = `${entry.name}/${file.replace(/\.mdx?$/, "")}`;
            const previous = entries.get(slug);
            if (!previous || file.endsWith(".mdx")) {
              entries.set(slug, { slug, isMdx: file.endsWith(".mdx") });
            }
          }
        }
      }
    } catch {
      // Optional localized content directories may be absent.
    }
  }

  return [...entries.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

async function getDocumentationCategories(): Promise<ContentEntry[]> {
  const docs = await readContentFiles("documentation");
  const entries = docs.reduce((groups, doc) => {
    const category = doc.slug.split("/")[0];
    const previous = groups.get(category);
    if (!previous || (previous.lastmod || "") < (doc.lastmod || "")) {
      groups.set(category, { slug: category, lastmod: doc.lastmod });
    }
    return groups;
  }, new Map<string, ContentEntry>());

  return [...entries.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

function localizedUrlEntry(pathSegment: string, opts: UrlOptions) {
  const cleaned = pathSegment.replace(/^\/+|\/+$/g, "");
  const frUrl = cleaned ? `${baseUrl}/${cleaned}` : `${baseUrl}/`;
  const enUrl = cleaned ? `${baseUrl}/en/${cleaned}` : `${baseUrl}/en`;
  const lastmodTag = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : "";
  const alternates = `
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />`;

  return [
    `
  <url>
    <loc>${frUrl}</loc>${lastmodTag}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${opts.priority.toFixed(1)}</priority>${alternates}
  </url>`,
    `
  <url>
    <loc>${enUrl}</loc>${lastmodTag}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${Math.max(opts.priority - 0.1, 0.1).toFixed(1)}</priority>${alternates}
  </url>`,
  ].join("");
}

function singleUrlEntry(pathSegment: string, opts: UrlOptions) {
  const cleaned = pathSegment.replace(/^\/+|\/+$/g, "");
  const url = cleaned ? `${baseUrl}/${cleaned}` : `${baseUrl}/`;
  const lastmodTag = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : "";

  return `
  <url>
    <loc>${url}</loc>${lastmodTag}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${opts.priority.toFixed(1)}</priority>
  </url>`;
}

export async function GET() {
  try {
    const localizedPages = [
      { path: "", source: "app/[locale]/page.tsx", changefreq: "weekly", priority: 1.0 },
      { path: "services", source: "app/[locale]/services/page.tsx", changefreq: "weekly", priority: 0.9 },
      { path: "depannage-wordpress", source: "app/[locale]/depannage-wordpress/page.tsx", changefreq: "monthly", priority: 0.9 },
      { path: "services/eligibilite", source: "app/[locale]/services/eligibilite/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "etudes-de-cas", source: "app/[locale]/etudes-de-cas/page.tsx", changefreq: "weekly", priority: 0.8 },
      { path: "documentation", source: "app/[locale]/documentation/page.tsx", changefreq: "weekly", priority: 0.8 },
      { path: "audit-site-ia", source: "app/[locale]/audit-site-ia/page.tsx", changefreq: "monthly", priority: 0.8 },
      { path: "outils", source: "app/[locale]/outils/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "outils/audit-pwa", source: "app/[locale]/outils/audit-pwa/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "outils/simulateur-agefiph", source: "app/[locale]/outils/simulateur-agefiph/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "demo", source: "app/[locale]/demo/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "solutions", source: "app/[locale]/solutions/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "cahier-des-charges", source: "app/[locale]/cahier-des-charges/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "a-propos", source: "app/[locale]/a-propos/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "contact", source: "app/[locale]/contact/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "avantage-oeth", source: "app/[locale]/avantage-oeth/page.tsx", changefreq: "weekly", priority: 0.8 },
      { path: "blog", source: "app/[locale]/blog/page.tsx", changefreq: "weekly", priority: 0.7 },
      { path: "articles", source: "app/[locale]/articles/page.tsx", changefreq: "monthly", priority: 0.6 },
    ] as const;

    const singlePages = [
      // `vous-etes` est volontairement `noindex` (robots.index=false) → exclu du sitemap.
      { path: "articles/reduire-contribution-agefiph-sous-traitance-tih", source: "app/[locale]/articles/reduire-contribution-agefiph-sous-traitance-tih/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "articles/attestation-deductibilite-tih-guide-entreprises", source: "app/[locale]/articles/attestation-deductibilite-tih-guide-entreprises/page.tsx", changefreq: "monthly", priority: 0.7 },
    ] as const;

    const staticUrls = await Promise.all(
      localizedPages.map(async (page) =>
        localizedUrlEntry(page.path, {
          changefreq: page.changefreq,
          priority: page.priority,
          lastmod: await pathLastmod(page.source),
        }),
      ),
    );

    const singleUrls = await Promise.all(
      singlePages.map(async (page) =>
        singleUrlEntry(page.path, {
          changefreq: page.changefreq,
          priority: page.priority,
          lastmod: await pathLastmod(page.source),
        }),
      ),
    );

    const caseStudyLastmod = await maxLastmod([
      "lib/case-studies-data.ts",
      "lib/case-studies-profiles.ts",
      "lib/case-studies-profiles-en.ts",
    ]);
    const caseStudyUrls = getAllSlugs().map((slug) =>
      localizedUrlEntry(`etudes-de-cas/${slug}`, {
        changefreq: "monthly",
        priority: 0.7,
        lastmod: caseStudyLastmod,
      }),
    );

    const blogUrls = (await readContentFiles("blog")).map((post) =>
      localizedUrlEntry(`blog/${post.slug}`, {
        changefreq: "monthly",
        priority: 0.6,
        lastmod: post.lastmod,
      }),
    );

    const docCategoryUrls = (await getDocumentationCategories()).map((cat) =>
      localizedUrlEntry(`documentation/${cat.slug}`, {
        changefreq: "weekly",
        priority: 0.7,
        lastmod: cat.lastmod,
      }),
    );

    const documentationUrls = (await readContentFiles("documentation")).map((doc) =>
      localizedUrlEntry(`documentation/${doc.slug}`, {
        changefreq: "monthly",
        priority: 0.6,
        lastmod: doc.lastmod,
      }),
    );

    const allUrls = [
      ...staticUrls,
      ...singleUrls,
      ...caseStudyUrls,
      ...blogUrls,
      ...docCategoryUrls,
      ...documentationUrls,
    ].join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      },
    );
  }
}
