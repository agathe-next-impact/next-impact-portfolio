import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import matter from "gray-matter";
import { getAllSlugs } from "@/lib/case-studies-data";
import { getHubThemeSlugs } from "@/lib/hub-themes";
import { hasEnglishArticle } from "@/lib/markdown";
import { hasEnglishBlogPost } from "@/lib/blog";
import { ENGLISH_PUBLISHED } from "@/i18n/routing";
import { MAINTENANCE_PATH, MAINTENANCE_PRIX_VALIDES } from "@/lib/maintenance-offer";
import { PACKS_PATH, getSituationSlugs, packHref } from "@/lib/situations";

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

// Pas de date de modification tirée du système de fichiers : sur Vercel, le
// mtime des sources est normalisé (constaté le 2026-09-28 : les 132 <lastmod>
// du sitemap de production valaient 2018-10-20). Une date fausse est pire
// qu'aucune date — Google ignore les lastmod d'un sitemap qui ment. Seuls les
// contenus éditoriaux portent un lastmod, lu dans leur front matter
// (dateModified > updated > date).
function frontmatterLastmod(filePath: string, raw: string): string | undefined {
  try {
    const { data } = matter(raw);
    const value = data.dateModified ?? data.updated ?? data.date;
    if (value instanceof Date) return toIsoDate(value);
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  } catch {
    console.warn(`[sitemap] front matter illisible : ${filePath}`);
  }
  return undefined;
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
          if (!previous) {
            const filePath = path.join(sectionDir, entry.name);
            const lastmod = frontmatterLastmod(filePath, await fs.readFile(filePath, "utf8"));
            entries.set(slug, { slug, isMdx: true, lastmod });
          }
        }

        if (section === "documentation" && entry.isDirectory()) {
          const categoryDir = path.join(sectionDir, entry.name);
          const files = await fs.readdir(categoryDir);
          for (const file of files) {
            if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
            const slug = `${entry.name}/${file.replace(/\.mdx?$/, "")}`;
            const previous = entries.get(slug);
            // La version française (premier root lu) fait foi pour la date.
            if (!previous) {
              const filePath = path.join(categoryDir, file);
              const lastmod = frontmatterLastmod(filePath, await fs.readFile(filePath, "utf8"));
              entries.set(slug, { slug, isMdx: file.endsWith(".mdx"), lastmod });
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
  // Anglais fermé (ENGLISH_PUBLISHED) : les URL /en redirigent, elles ne
  // figurent pas au sitemap ; l'entrée française est émise sans hreflang.
  if (!ENGLISH_PUBLISHED) return singleUrlEntry(pathSegment, opts);
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
      // Page pilier WordPress Headless — cible SEO/GEO de fond, priorité haute.
      { path: "wordpress-headless", source: "app/[locale]/wordpress-headless/page.tsx", changefreq: "weekly", priority: 0.95 },
      { path: "solutions-web", source: "app/[locale]/solutions-web/page.tsx", changefreq: "weekly", priority: 0.9 },
      { path: "solutions-web/eligibilite", source: "app/[locale]/solutions-web/eligibilite/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "etudes-de-cas", source: "app/[locale]/etudes-de-cas/page.tsx", changefreq: "weekly", priority: 0.8 },
      { path: "documentation", source: "app/[locale]/documentation/page.tsx", changefreq: "weekly", priority: 0.8 },
      // Page offre conseil — cœur du funnel, était absente du sitemap.
      { path: "conseil", source: "app/[locale]/conseil/page.tsx", changefreq: "monthly", priority: 0.9 },
      // Offre récurrente de direction technique — bilingue FR + EN, donc dans
      // les pages localisées (alternates hreflang générés).
      { path: "cto-externalise", source: "app/[locale]/cto-externalise/page.tsx", changefreq: "monthly", priority: 0.8 },
      // audit-site-web retiré du sitemap : la route redirige (vers /scan depuis
      // l'ADR-012, next.config.mjs), ce n'est plus une page indexable.
      { path: "outils", source: "app/[locale]/outils/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "outils/audit-pwa", source: "app/[locale]/outils/audit-pwa/page.tsx", changefreq: "monthly", priority: 0.6 },
      // Outils de qualification rattachés aux rubriques du hub.
      { path: "outils/selecteur-techno", source: "app/[locale]/outils/selecteur-techno/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "outils/decrypteur-devis", source: "app/[locale]/outils/decrypteur-devis/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "outils/nocode-saas-surmesure", source: "app/[locale]/outils/nocode-saas-surmesure/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "outils/prototype-ia", source: "app/[locale]/outils/prototype-ia/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "outils/reparer-ou-refaire", source: "app/[locale]/outils/reparer-ou-refaire/page.tsx", changefreq: "monthly", priority: 0.6 },
      // Diagnostic « visible dans les moteurs IA ? » — route convenue avec le
      // chantier outils (vague 1) ; le lastmod tombera quand la page existera.
      { path: "outils/visibilite-ia", source: "app/[locale]/outils/visibilite-ia/page.tsx", changefreq: "monthly", priority: 0.7 },
      // Checklist GEO — pendant actionnable du diagnostic (chantier outils, vague 3).
      { path: "outils/checklist-geo", source: "app/[locale]/outils/checklist-geo/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "demo", source: "app/[locale]/demo/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "cahier-des-charges", source: "app/[locale]/cahier-des-charges/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "a-propos", source: "app/[locale]/a-propos/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "contact", source: "app/[locale]/contact/page.tsx", changefreq: "monthly", priority: 0.6 },
      { path: "blog", source: "app/[locale]/blog/page.tsx", changefreq: "weekly", priority: 0.7 },
      // `articles` retiré : liste vide (content/articles/ absent), en noindex.
    ] as const;

    const singlePages = [
      // `vous-etes` est volontairement `noindex` (robots.index=false) → exclu du sitemap.
      { path: "articles/reduire-contribution-agefiph-sous-traitance-tih", source: "app/[locale]/articles/reduire-contribution-agefiph-sous-traitance-tih/page.tsx", changefreq: "monthly", priority: 0.7 },
      { path: "articles/attestation-deductibilite-tih-guide-entreprises", source: "app/[locale]/articles/attestation-deductibilite-tih-guide-entreprises/page.tsx", changefreq: "monthly", priority: 0.7 },
      // Page veille (Sentinelle en tête, puis la lettre gratuite, ressources,
      // outils) — FR uniquement (locale EN en noindex), donc sans alternates hreflang.
      { path: "veille", source: "app/[locale]/veille/page.tsx", changefreq: "monthly", priority: 0.8 },
      // Sentinelle : retirée du SEO/GEO le 2026-09-04, de retour dans l'index le
      // 2026-09-27 (ADR-012). Hors catalogue depuis l'ADR-013 : elle se vend
      // depuis le rapport de l'analyse du site, sa page reste sa fiche produit.
      { path: "sentinelle", source: "app/[locale]/sentinelle/page.tsx", changefreq: "monthly", priority: 0.7 },
      // Récapitulatif de toutes les offres, par moment (ADR-012).
      { path: "tarifs", source: "app/[locale]/tarifs/page.tsx", changefreq: "monthly", priority: 0.8 },
      // Analyse gratuite du site : le CTA froid, indexé depuis le 2026-09-28.
      // Hors [locale] (groupe (sentinelle)), français seulement.
      { path: "scan", source: "app/(sentinelle)/scan/page.tsx", changefreq: "monthly", priority: 0.8 },
      // Visite de l'espace en ligne + accès aux deux connexions (ADR-012).
      { path: "espace-client", source: "app/[locale]/espace-client/page.tsx", changefreq: "monthly", priority: 0.5 },
      // Suivi et maintenance, page d'atterrissage du moment « Gérer » : au
      // sitemap seulement quand MAINTENANCE_PRIX_VALIDES vaut true
      // (lib/maintenance-offer.ts). Tant que le drapeau vaut false, la page est
      // en noindex et reste hors sitemap. Le même drapeau commande le noindex
      // de la page, les lignes llms et l'entrée du catalogue JSON-LD.
      ...(MAINTENANCE_PRIX_VALIDES
        ? ([
            {
              path: MAINTENANCE_PATH,
              source: "app/[locale]/maintenance-wordpress/page.tsx",
              changefreq: "monthly",
              priority: 0.8,
            },
          ] as const)
        : []),
      // L'offre par situation (charte v1.6, ADR-014) : l'index /packs et une
      // page par situation, lues dans lib/situations.ts. FR uniquement (locale
      // EN en noindex), donc en URL simple, sans alternates hreflang. Ces pages
      // affichent un budget de suivi : elles suivent le même drapeau que
      // /maintenance-wordpress et sortent du sitemap s'il repasse à false.
      ...(MAINTENANCE_PRIX_VALIDES
        ? [
            {
              path: PACKS_PATH,
              source: "app/[locale]/packs/page.tsx",
              changefreq: "monthly" as const,
              priority: 0.8,
            },
            ...getSituationSlugs().map((slug) => ({
              path: packHref(slug),
              // Le contenu d'une page de pack vit dans lib/situations.ts : c'est
              // sa date de modification qui fait foi, pas celle du gabarit.
              source: "lib/situations.ts",
              changefreq: "monthly" as const,
              priority: 0.8,
            })),
          ]
        : []),
      // Pages partenaires — FR uniquement (locale EN en noindex tant que la
      // traduction n'existe pas), donc sans alternates hreflang.
      { path: "apporteurs", source: "app/[locale]/apporteurs/page.tsx", changefreq: "monthly", priority: 0.5 },
      { path: "agences", source: "app/[locale]/agences/page.tsx", changefreq: "monthly", priority: 0.5 },
    ] as const;

    const staticUrls = await Promise.all(
      localizedPages.map(async (page) =>
        localizedUrlEntry(page.path, {
          changefreq: page.changefreq,
          priority: page.priority,
        }),
      ),
    );

    const singleUrls = await Promise.all(
      singlePages.map(async (page) =>
        singleUrlEntry(page.path, {
          changefreq: page.changefreq,
          priority: page.priority,
        }),
      ),
    );

    const caseStudyUrls = getAllSlugs().map((slug) =>
      localizedUrlEntry(`etudes-de-cas/${slug}`, {
        changefreq: "monthly",
        priority: 0.7,
      }),
    );

    // Un billet sans version anglaise est servi en français sous /en (repli,
    // noindex) : il n'entre au sitemap qu'en URL française, sans hreflang.
    const blogUrls = (await readContentFiles("blog")).map((post) => {
      const entry = hasEnglishBlogPost(post.slug) ? localizedUrlEntry : singleUrlEntry;
      return entry(`blog/${post.slug}`, {
        changefreq: "monthly",
        priority: 0.6,
        lastmod: post.lastmod,
      });
    });

    // Pages rubriques du hub « Quelle techno web ? » (segments statiques,
    // données dans lib/hub-themes.ts) — absentes de la découverte par dossier.
    const hubThemeSlugs = getHubThemeSlugs();
    const themeUrls = hubThemeSlugs.map((slug) =>
      localizedUrlEntry(`documentation/${slug}`, {
        changefreq: "weekly",
        priority: 0.8,
      }),
    );

    // Les catégories qui portent le même slug qu'une rubrique (ex. choisir,
    // etre-trouve) sont déjà émises ci-dessus : on les exclut du listing dossier.
    const docCategoryUrls = (await getDocumentationCategories())
      .filter((cat) => !hubThemeSlugs.includes(cat.slug))
      .map((cat) =>
        localizedUrlEntry(`documentation/${cat.slug}`, {
          changefreq: "weekly",
          priority: 0.7,
          lastmod: cat.lastmod,
        }),
      );

    // Exclure les fichiers index.mdx : leur URL doublonnerait la page catégorie.
    const documentationUrls = (await readContentFiles("documentation"))
      .filter((doc) => !doc.slug.endsWith("/index"))
      .map((doc) => {
        // Même règle que le blog : pas de version anglaise, pas d'URL /en.
        const [category, slug] = doc.slug.split("/");
        const entry = hasEnglishArticle(category, slug) ? localizedUrlEntry : singleUrlEntry;
        return entry(`documentation/${doc.slug}`, {
          changefreq: "monthly",
          priority: 0.6,
          lastmod: doc.lastmod,
        });
      });

    const allUrls = [
      ...staticUrls,
      ...singleUrls,
      ...caseStudyUrls,
      ...blogUrls,
      ...themeUrls,
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
