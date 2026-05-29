import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Récupère dynamiquement les catégories et articles de documentation
async function getDocumentationStructure() {
  const docsDir = path.join(process.cwd(), "content/documentation");
  const categories = await fs.readdir(docsDir, { withFileTypes: true });
  const structure: { category: string; articles: string[] }[] = [];

  for (const entry of categories) {
    if (entry.isDirectory()) {
      const categoryDir = path.join(docsDir, entry.name);
      const files = await fs.readdir(categoryDir);
      const articles = files
        .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx?$/, ""));
      structure.push({ category: entry.name, articles });
    }
  }
  return structure;
}

// Labels lisibles pour les catégories
const categoryLabels: Record<string, string> = {
  "blog": "Blog",
  "design-ui-ux": "Design UI/UX",
  "headless-cms": "CMS Headless",
  "marketing-digital": "Marketing Digital",
  "projet-site-web": "Gestion de Projet Web",
  "seo": "SEO & Référencement",
  "wordpress": "WordPress",
};

export async function GET() {
  const baseUrl = "https://www.next-impact.digital";

  const docStructure = await getDocumentationStructure();

  const docSection = docStructure
    .map((cat) => {
      const label = categoryLabels[cat.category] || cat.category;
      const articleLinks = cat.articles
        .map(
          (article) =>
            `  - [${article.replace(/-/g, " ")}](${baseUrl}/documentation/${cat.category}/${article})`
        )
        .join("\n");
      return `### ${label}\n${articleLinks}`;
    })
    .join("\n\n");

  const content = `# Next Impact

> Studio indépendant spécialisé dans les sites web et applications performants, pour les PME et structures de l'ESS. Sites clé en main, délai et budget fixés dès le départ.

## A propos

Next Impact est un studio indépendant, basé en France, qui conçoit et livre clé en main des sites web et des applications pour les PME et les structures de l'ESS. Le client gère son activité, le studio gère la technique : sites vitrines, sites haute performance et plateformes métier sur-mesure. Prestataire TIH — 30 % du coût de main-d'œuvre déductible de la contribution AGEFIPH.

## Services principaux

- [Services & tarifs](${baseUrl}/services): Trois forfaits sites web (Classique, Headless, Web app) + applications sur-mesure
- [Éligibilité OETH / TIH](${baseUrl}/services/eligibilite): Vérifier la déductibilité AGEFIPH de votre prestation
- [Solutions](${baseUrl}/solutions): Vue d'ensemble des solutions proposées
- [Avantage OETH](${baseUrl}/avantage-oeth): 30 % du coût main-d'œuvre déductible de la contribution AGEFIPH

## Outils & Ressources

- [Outils](${baseUrl}/outils): Ensemble des outils interactifs
- [Simulateur AGEFIPH](${baseUrl}/outils/simulateur-agefiph): Estimez votre déduction de contribution AGEFIPH
- [Audit PWA](${baseUrl}/outils/audit-pwa): Analysez le niveau PWA de votre site
- [Cahier des charges](${baseUrl}/cahier-des-charges): Créez votre cahier des charges en ligne
- [Audit IA](${baseUrl}/audit-site-ia): Audit de site propulsé par l'intelligence artificielle

## Études de cas

- [Toutes les études de cas](${baseUrl}/etudes-de-cas)

## Documentation

${docSection}

## Contact

- [Contact & demande de devis](${baseUrl}/contact)
- Site web: ${baseUrl}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
