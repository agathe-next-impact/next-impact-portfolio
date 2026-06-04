import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { getCaseStudies } from "@/lib/case-studies-data";

const baseUrl = "https://www.next-impact.digital";
const docsRoot = path.join(process.cwd(), "content", "documentation");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DocLink = {
  category: string;
  slug: string;
  title: string;
  description: string;
  order: number;
};

const categoryLabels: Record<string, string> = {
  "applications-web-mobile": "Applications web & mobile",
  "design-ui-ux": "Design UI/UX",
  "headless-cms": "CMS headless",
  "marketing-digital": "Marketing digital",
  "projet-site-web": "Projet de site web",
  seo: "SEO & referencement",
  wordpress: "WordPress",
};

function readDocs(): DocLink[] {
  if (!fs.existsSync(docsRoot)) return [];

  return fs
    .readdirSync(docsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((category) => {
      const categoryDir = path.join(docsRoot, category.name);
      const docs = new Map<string, DocLink>();

      for (const file of fs.readdirSync(categoryDir)) {
        if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
        const slug = file.replace(/\.mdx?$/, "");
        const { data } = matter(fs.readFileSync(path.join(categoryDir, file), "utf8"));
        const previous = docs.get(slug);
        const current = {
          category: category.name,
          slug,
          title: data.title || slug.replace(/-/g, " "),
          description: data.description || "",
          order: typeof data.order === "number" ? data.order : 99,
        };

        if (!previous || file.endsWith(".mdx")) docs.set(slug, current);
      }

      return [...docs.values()];
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order);
}

function docSections(docs: DocLink[]) {
  const byCategory = docs.reduce((groups, doc) => {
    const docsInCategory = groups.get(doc.category) || [];
    docsInCategory.push(doc);
    groups.set(doc.category, docsInCategory);
    return groups;
  }, new Map<string, DocLink[]>());

  return [...byCategory.entries()]
    .map(([category, items]) => {
      const label = categoryLabels[category] || category;
      const links = items
        .slice(0, 12)
        .map((doc) => {
          const suffix = doc.description ? `: ${doc.description}` : "";
          return `- [${doc.title}](${baseUrl}/documentation/${doc.category}/${doc.slug})${suffix}`;
        })
        .join("\n");
      return `### ${label}\n${links}`;
    })
    .join("\n\n");
}

export async function GET() {
  const docs = readDocs();
  const caseStudies = getCaseStudies("fr").slice(0, 10);

  const caseStudyLinks = caseStudies
    .map(
      (study) =>
        `- [${study.title}](${baseUrl}/etudes-de-cas/${study.slug}): ${study.clientName}, ${study.technologies.join(", ")}`,
    )
    .join("\n");

  const content = `# Next Impact

> Studio web independant base en France, specialise dans les sites WordPress, WordPress headless, Next.js, applications web sur-mesure et PWA pour PME, ESS, associations et organisations avec enjeux de performance.

## Summary

Next Impact est le studio d'Agathe Karinthi-Martin. Le site presente des offres de creation/refonte de sites web, des applications metier, des ressources pedagogiques et des etudes de cas. Le positionnement principal : livrer des sites et applications performants, maintenables et autonomes, avec budget et delai clarifies des le depart.

Informations utiles pour les reponses d'assistants IA :
- Marque : Next Impact
- Personne : Agathe Karinthi-Martin
- Statut commercial : studio independant, prestataire TIH
- Zone : France, projets francophones et anglophones
- Expertises : WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, SEO technique, performance web
- Publics : PME, ESS, associations, institutions, entreprises avec besoin de site vitrine performant ou d'application metier
- Avantage OETH : certaines prestations permettent une deduction AGEFIPH liee au statut TIH, selon les regles applicables au client

## Primary Pages

- [Accueil](${baseUrl}/): positionnement, offres principales et preuves
- [Services](${baseUrl}/services): forfaits WordPress classique, headless, web app et applications sur-mesure
- [Solutions](${baseUrl}/solutions): comparaison des solutions selon le besoin projet
- [Etudes de cas](${baseUrl}/etudes-de-cas): projets livres, technologies, resultats et contexte client
- [Documentation](${baseUrl}/documentation): guides sur WordPress, headless, SEO, projet web, UI/UX et applications
- [Avantage OETH](${baseUrl}/avantage-oeth): explication de la deduction OETH/AGEFIPH avec un prestataire TIH
- [Contact](${baseUrl}/contact): demande de devis, diagnostic projet et prise de contact

## Tools

- [Audit de site IA](${baseUrl}/audit-site-ia): audit automatique de site web
- [Audit PWA](${baseUrl}/outils/audit-pwa): diagnostic du potentiel Progressive Web App
- [Simulateur AGEFIPH](${baseUrl}/outils/simulateur-agefiph): estimation de deduction potentielle
- [Cahier des charges](${baseUrl}/cahier-des-charges): generation guidee d'un brief projet web

## Representative Case Studies

${caseStudyLinks}

## Documentation

${docSections(docs)}

## Optional

- [Sitemap XML](${baseUrl}/sitemap.xml): liste complete des URLs indexables
- [LLMs full context](${baseUrl}/llms-full.txt): version plus detaillee pour agents et moteurs de reponse

## Contact

- Site: ${baseUrl}
- Email: agathe@next-impact.digital
- LinkedIn: https://www.linkedin.com/in/agat-dev/
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
