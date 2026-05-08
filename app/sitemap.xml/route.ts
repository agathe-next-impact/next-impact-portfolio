import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const baseUrl = "https://www.next-impact.digital";

// Récupère dynamiquement les slugs de la documentation (avec catégories)
async function getDocumentationSlugs() {
  const docsDir = path.join(process.cwd(), "content/documentation");
  const categories = await fs.readdir(docsDir, { withFileTypes: true });
  const slugs: { slug: string; lastmod: string }[] = [];

  for (const entry of categories) {
    if (entry.isDirectory()) {
      const categoryDir = path.join(docsDir, entry.name);
      const files = await fs.readdir(categoryDir);
      for (const file of files) {
        if (file.endsWith(".md") || file.endsWith(".mdx")) {
          const filePath = path.join(categoryDir, file);
          const stat = await fs.stat(filePath);
          slugs.push({
            slug: `${entry.name}/${file.replace(/\.mdx?$/, "")}`,
            lastmod: stat.mtime.toISOString().split("T")[0],
          });
        }
      }
    }
  }
  return slugs;
}

// Récupère dynamiquement les catégories de documentation
async function getDocumentationCategories() {
  const docsDir = path.join(process.cwd(), "content/documentation");
  const categories = await fs.readdir(docsDir, { withFileTypes: true });
  const result: { slug: string; lastmod: string }[] = [];

  for (const entry of categories) {
    if (entry.isDirectory()) {
      const categoryDir = path.join(docsDir, entry.name);
      const stat = await fs.stat(categoryDir);
      result.push({
        slug: entry.name,
        lastmod: stat.mtime.toISOString().split("T")[0],
      });
    }
  }
  return result;
}

// Études de cas — tous les slugs existants
const caseStudiesSlugs = [
  "cafe-citoyen",
  "comme-des-fous-jeux",
  "comme-des-fous",
  "proditec",
  "doleances",
  "french-touch-seeds",
  "sowee",
  "salon-de-la-carrosserie",
  "hermitage",
  "erp-services",
  "senza-nature",
  "wagner-hamisky",
  "next-event",
  "les-etats-generaux-communaux",
  "mediatico",
  "infralliance",
  "connexion-plus",
];

// Pour chaque page localisée, on émet une <url> par locale avec
// xhtml:link rel="alternate" hreflang vers chaque locale + x-default.
function localizedUrlEntry(
  pathSegment: string,
  opts: { changefreq: string; priority: number; lastmod?: string }
) {
  const cleaned = pathSegment.replace(/^\/+|\/+$/g, "");
  const frUrl = cleaned ? `${baseUrl}/${cleaned}` : `${baseUrl}/`;
  const enUrl = cleaned ? `${baseUrl}/en/${cleaned}` : `${baseUrl}/en`;

  const alternates = `
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}" />`;

  const lastmodTag = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : "";

  return [
    `
  <url>
    <loc>${frUrl}</loc>${lastmodTag}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${opts.priority}</priority>${alternates}
  </url>`,
    `
  <url>
    <loc>${enUrl}</loc>${lastmodTag}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${(opts.priority - 0.1).toFixed(1)}</priority>${alternates}
  </url>`,
  ].join("");
}

// FR-only URL (legal pages, French-specific articles)
function frOnlyUrlEntry(
  pathSegment: string,
  opts: { changefreq: string; priority: number; lastmod?: string }
) {
  const cleaned = pathSegment.replace(/^\/+|\/+$/g, "");
  const url = cleaned ? `${baseUrl}/${cleaned}` : `${baseUrl}/`;
  const lastmodTag = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : "";
  return `
  <url>
    <loc>${url}</loc>${lastmodTag}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${opts.priority}</priority>
  </url>`;
}

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Pages statiques avec priorités hiérarchisées (publiées en FR et EN)
    const localizedPages: {
      path: string;
      changefreq: string;
      priority: number;
      lastmod: string;
    }[] = [
      { path: "", changefreq: "weekly", priority: 1.0, lastmod: today },
      { path: "services", changefreq: "weekly", priority: 0.9, lastmod: today },
      { path: "services/eligibilite", changefreq: "monthly", priority: 0.7, lastmod: today },
      { path: "etudes-de-cas", changefreq: "weekly", priority: 0.8, lastmod: today },
      { path: "documentation", changefreq: "weekly", priority: 0.8, lastmod: today },
      { path: "documentation/mind-map", changefreq: "monthly", priority: 0.6, lastmod: today },
      { path: "audit-site-ia", changefreq: "monthly", priority: 0.8, lastmod: today },
      { path: "outils", changefreq: "monthly", priority: 0.7, lastmod: today },
      { path: "outils/benchmarking", changefreq: "monthly", priority: 0.6, lastmod: today },
      { path: "outils/simulateur-roi", changefreq: "monthly", priority: 0.6, lastmod: today },
      { path: "demo", changefreq: "monthly", priority: 0.7, lastmod: today },
      { path: "solutions", changefreq: "monthly", priority: 0.7, lastmod: today },
      { path: "cahier-des-charges", changefreq: "monthly", priority: 0.7, lastmod: today },
      { path: "a-propos", changefreq: "monthly", priority: 0.6, lastmod: today },
      { path: "contact", changefreq: "monthly", priority: 0.6, lastmod: today },
      { path: "avantage-oeth", changefreq: "weekly", priority: 0.8, lastmod: today },
    ];

    // Pages FR uniquement (mentions légales = obligation FR; articles spécifiques au droit français)
    const frOnlyPages: {
      path: string;
      changefreq: string;
      priority: number;
      lastmod: string;
    }[] = [
      { path: "mentions-legales", changefreq: "yearly", priority: 0.3, lastmod: today },
      { path: "articles/reduire-contribution-agefiph-sous-traitance-tih", changefreq: "monthly", priority: 0.7, lastmod: today },
      { path: "articles/attestation-deductibilite-tih-guide-entreprises", changefreq: "monthly", priority: 0.7, lastmod: today },
    ];

    // Études de cas (publiées en FR et EN)
    const caseStudiesUrls = caseStudiesSlugs.map((slug) =>
      localizedUrlEntry(`etudes-de-cas/${slug}`, {
        changefreq: "monthly",
        priority: 0.7,
        lastmod: today,
      })
    );

    // Catégories de documentation
    const docCategories = await getDocumentationCategories();
    const docCategoryUrls = docCategories.map((cat) =>
      localizedUrlEntry(`documentation/${cat.slug}`, {
        changefreq: "weekly",
        priority: 0.7,
        lastmod: cat.lastmod,
      })
    );

    // Articles de documentation dynamiques (avec lastmod réel)
    const documentationSlugs = await getDocumentationSlugs();
    const documentationUrls = documentationSlugs.map((doc) =>
      localizedUrlEntry(`documentation/${doc.slug}`, {
        changefreq: "monthly",
        priority: 0.6,
        lastmod: doc.lastmod,
      })
    );

    // Assemblage final
    const allUrls = [
      ...localizedPages.map((page) => localizedUrlEntry(page.path, page)),
      ...frOnlyPages.map((page) => frOnlyUrlEntry(page.path, page)),
      ...caseStudiesUrls,
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
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (e) {
    console.error("Erreur génération sitemap:", e);
    return new NextResponse(
      '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        status: 200,
        headers: { "Content-Type": "application/xml" },
      }
    );
  }
}
