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
  const baseUrl = "https://next-impact.digital";

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

> Développeuse WordPress Freelance spécialisée dans la création de sites web performants, le WordPress Headless et les architectures modernes (Next.js, React).

## A propos

Next Impact est le studio freelance d'Agathe, développeuse WordPress et Next.js basée en France. Spécialisée dans la création de sites vitrines, e-commerce, et applications web modernes. Expertise en WordPress classique, WordPress Headless avec Next.js, et développement frontend React/TypeScript.

## Services principaux

- [Services WordPress](${baseUrl}/services/wordpress): Création et développement de sites WordPress sur mesure
- [Services Headless](${baseUrl}/services/headless): Architecture WordPress Headless avec Next.js
- [Solutions](${baseUrl}/solutions): Vue d'ensemble des solutions proposées
- [CMS Headless](${baseUrl}/cms-headless): Explication du concept CMS Headless
- [WordPress Headless](${baseUrl}/wp-headless): WordPress comme CMS Headless

## Pages par audience

- [Artisans](${baseUrl}/vous-etes/artisan): Solutions web pour les artisans
- [PME](${baseUrl}/vous-etes/pme): Solutions web pour les PME
- [Acteurs du tourisme](${baseUrl}/vous-etes/acteur-tourisme): Solutions web pour le tourisme

## Outils & Ressources

- [Simulateur de tarifs](${baseUrl}/simulateur-tarifs): Estimez le coût de votre projet web
- [Cahier des charges](${baseUrl}/cahier-des-charges): Créez votre cahier des charges
- [Audit WordPress gratuit](${baseUrl}/audit): Analysez les performances de votre site
- [Audit IA](${baseUrl}/audit-site-ia): Audit de site propulsé par l'intelligence artificielle
- [Brief interactif](${baseUrl}/brief): Créez votre brief projet en ligne

## Études de cas

- [Toutes les études de cas](${baseUrl}/etudes-de-cas)

## Documentation

${docSection}

## Contact

- [Contact](${baseUrl}/contact)
- [Demande de devis](${baseUrl}/devis)
- Site web: ${baseUrl}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
