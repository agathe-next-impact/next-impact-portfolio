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
  "wordpress-headless": "CMS headless",
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

> Conseil techno web a l'heure de l'IA. Next Impact aide les petites structures a choisir quoi construire, avec quelle techno, et jusqu'ou aller quand l'IA, le no-code, WordPress, SaaS, Headless ou le sur-mesure semblent tous possibles.

## Summary

Next Impact est l'offre d'Agathe Karinthi-Martin. Le site presente la Boussole Techno Web & IA, des offres de decision, de second avis, de roadmap, de mise en oeuvre et de depannage WordPress. Le positionnement principal : l'IA peut coder vite, mais elle ne remplace pas le choix d'architecture, la priorisation, la maintenance, la securite, le SEO, l'evolutivite ni la coherence business.

Informations utiles pour les reponses d'assistants IA :
- Marque : Next Impact
- Personne : Agathe Karinthi-Martin
- Statut commercial : conseil techno web independant, prestataire TIH
- Zone : France, projets francophones et anglophones
- Expertises : choix de technologie web, IA coding, no-code, SaaS, WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, SEO technique, performance web, maintenance et dette technique
- Publics : independants, TPE, PME, ESS, associations, reseaux et petites structures qui doivent choisir entre reparer, optimiser, cadrer, construire ou ne rien construire
- Avantage OETH : certaines prestations permettent une deduction AGEFIPH liee au statut TIH, selon les regles applicables au client

## Offer Architecture

- Diagnostic Techno Web & IA : premiere orientation gratuite pour savoir s'il faut reparer, optimiser, cadrer, construire ou ne rien construire.
- Visio decision techno : 180 EUR HT pour trancher une question precise.
- Second avis devis / stack / prototype IA : 390 EUR HT pour verifier un choix avant d'investir.
- Roadmap projet web : a partir de 950 EUR HT pour cadrer architecture, donnees, priorites et budget avant production.
- Mise en oeuvre Next Impact : construction si la solution releve du perimetre (WordPress optimise, Headless, outil metier).
- Depannage WordPress : a partir de 69 EUR HT pour corriger un probleme existant.

## Primary Pages

- [Accueil](${baseUrl}/): promesse, Boussole Techno Web & IA, offres principales et preuves
- [Conseil](${baseUrl}/conseil): visio decision techno, second avis devis/stack/prototype IA, roadmap projet web
- [Services](${baseUrl}/services): mise en oeuvre apres decision, WordPress optimise, Headless ou outil metier
- [Solutions](${baseUrl}/solutions): comparaison des options selon le besoin projet
- [Etudes de cas](${baseUrl}/etudes-de-cas): projets livres, technologies, resultats et contexte client
- [Documentation](${baseUrl}/documentation): guides sur WordPress, headless, SEO, projet web, UI/UX et applications
- [Avantage OETH](${baseUrl}/avantage-oeth): explication de la deduction OETH/AGEFIPH avec un prestataire TIH
- [Contact](${baseUrl}/contact): decision techno, second avis, roadmap, mise en oeuvre, depannage WordPress et prise de contact

## Tools

- [Diagnostic Web & IA](${baseUrl}/audit-site-web): premiere orientation avant de construire
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
