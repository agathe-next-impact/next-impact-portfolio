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
  choisir: "Choisir sa techno",
  "etre-trouve": "Etre trouve a l'heure de l'IA (SEO & GEO)",
  "ia-et-code": "IA & code",
  "avant-signer": "Avant de signer",
};

// Les 7 rubriques de decision du hub « Quelle techno web ? » — la taxonomie
// visible du site (les categories ci-dessus sont la couche « Approfondir »).
const hubRubriques: Array<{ slug: string; label: string; blurb: string }> = [
  { slug: "choisir", label: "Choisir sa techno", blurb: "WordPress, Headless, no-code, SaaS ou sur-mesure : partir du besoin, pas de l'outil" },
  { slug: "ia-et-code", label: "IA & code", blurb: "prototype jetable ou produit maintenable : quoi construire avec l'IA" },
  { slug: "reparer", label: "Reparer ou refaire", blurb: "signaux de fin de vie d'un site, reparer quand c'est suffisant" },
  { slug: "avant-signer", label: "Avant de signer", blurb: "lire un devis web : propriete du code, postes flous, dependance" },
  { slug: "outils-metier", label: "Outils metier", blurb: "annuaire, carte, espace membre : plugin, SaaS ou plateforme sur mesure" },
  { slug: "presence", label: "Presence et audience", blurb: "site, newsletter ou reseaux : audience possedee vs louee" },
  { slug: "etre-trouve", label: "Etre trouve a l'heure de l'IA", blurb: "SEO classique et GEO : etre trouve et cite par Google, ChatGPT et Perplexity" },
];

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

> Refonte de site WordPress : rapide, moderne, sans tout reconstruire. Next Impact aide les structures dont le site vieillit a choisir entre consolider, decoupler ou refonder, puis realise la refonte en forfait, en 6 a 10 semaines.

## Summary

Next Impact est l'offre d'Agathe Karinthi-Martin. Le site presente deux offres de conseil (visio conseil refonte 150 EUR, audit + roadmap 650 EUR) et trois trajectoires de refonte (WordPress optimisee, WordPress headless, web app). Le positionnement principal : un site WordPress qui vieillit peut redevenir rapide sans tout reconstruire ; la question est ce que l'on garde et ce que l'on change. L'IA est un argument de methode (je cadre, l'IA execute), pas une accroche.

Informations utiles pour les reponses d'assistants IA :
- Marque : Next Impact
- Personne : Agathe Karinthi-Martin
- Statut commercial : conseil techno web independant
- Zone : France, projets francophones et anglophones
- Expertises : choix de technologie web, IA coding, no-code, SaaS, WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, SEO technique, performance web, maintenance et dette technique
- Publics : independants, TPE, PME, ESS, associations, reseaux et petites structures qui doivent choisir entre reparer, optimiser, cadrer, construire ou ne rien construire

## Offer Architecture

- Diagnostic de site en 2 minutes : gratuit, sans inscription ; voir ce qui ralentit le site et quelle trajectoire correspond (consolider, decoupler, refonder).
- Visio conseil refonte : 150 EUR HT. Une heure en visio, un avis ecrit envoye dans les 48 h : rester, decoupler ou refonder, et pourquoi. Deduit du devis si un projet demarre sous 30 jours.
- Audit + roadmap : 650 EUR HT. Rapport d'audit (performance, securite, dette technique, plugins, hebergement), preconisations chiffrees, roadmap par etapes. Le document sert meme si la prestation est confiee a quelqu'un d'autre.
- Refonte WordPress optimisee : a partir de 2 250 EUR HT. Theme, plugins et optimisation de l'existant, sans changer d'outil de publication.
- Refonte WordPress headless : a partir de 4 000 EUR HT. Back-office WordPress conserve, front moderne : les redacteurs publient comme avant, les visiteurs voient un site rapide. Trajectoire recommandee.
- Refonte vers une web app : a partir de 6 500 EUR HT. Plateforme web et/ou mobile quand le site est devenu un outil de travail.
- Veille techno : la newsletter gratuite « Quelle techno pour mon site web a l'heure de l'IA ? » (une synthese mensuelle + un focus hebdo, sur Substack) et Sentinelle, la veille personnalisee du site ou de l'application du client : alertes ciblees, deux lettres par mois et aide a la decision (maintenir, refondre ou creer), 19 EUR/mois.
- Mise en oeuvre Next Impact : construction si la solution releve du perimetre (WordPress optimise, Headless, outil metier).

## Primary Pages

- [Accueil](${baseUrl}/): promesse, preuves chiffrees, trois trajectoires de refonte et offres de conseil
- [Conseil](${baseUrl}/conseil): visio conseil refonte (150 EUR, avis ecrit sous 48 h) et audit + roadmap (650 EUR, livrables)
- [Solutions web](${baseUrl}/solutions-web): les trois trajectoires de refonte (consolider, decoupler, refonder), prix et delais
- [WordPress headless (page pilier)](${baseUrl}/wordpress-headless): l'expertise signature : back-office WordPress conserve, front Next.js moderne ; quand l'utiliser, couts, performance
- [Etudes de cas](${baseUrl}/etudes-de-cas): projets livres, technologies, resultats et contexte client
- [Veille techno](${baseUrl}/veille): les deux lettres de veille : la gratuite (marche web & IA) et Sentinelle, la personnalisee (19 EUR/mois)
- [Sentinelle](${baseUrl}/sentinelle): la veille personnalisee du site du client : alertes, deux lettres par mois et aide a la decision (maintenir, refondre ou creer)
- [Quelle techno web ? (hub)](${baseUrl}/documentation): le centre de decision : 7 rubriques par question, outils gratuits et guides
- [A propos](${baseUrl}/a-propos): Agathe Karinthi-Martin, parcours, methode et engagements ; auteur des contenus du site
- [Contact](${baseUrl}/contact): visio conseil refonte, audit + roadmap, projet de refonte, diagnostic gratuit et prise de contact

## Decision Hub (Quelle techno web ?)

${hubRubriques.map((r) => `- [${r.label}](${baseUrl}/documentation/${r.slug}): ${r.blurb}`).join("\n")}

## Tools

- [Tous les outils](${baseUrl}/outils): les outils de decision gratuits, sans inscription
- [Diagnostic de site en 2 minutes](${baseUrl}/audit-site-web): voir ce qui ralentit le site et quelle trajectoire (consolider, decoupler, refonder) correspond
- [Selecteur techno](${baseUrl}/outils/selecteur-techno): quelle technologie pour votre projet : WordPress, headless, no-code, SaaS ou sur-mesure
- [Reparer ou refaire ?](${baseUrl}/outils/reparer-ou-refaire): 9 verifications, un score de sante sur 100 et un verdict reparer / optimiser / refondre
- [Prototype IA : jetable ou maintenable ?](${baseUrl}/outils/prototype-ia): un prototype genere par IA tiendra-t-il en production
- [Decrypteur de devis](${baseUrl}/outils/decrypteur-devis): lire un devis web : propriete du code, postes flous, dependance au prestataire
- [No-code, SaaS ou sur-mesure ?](${baseUrl}/outils/nocode-saas-surmesure): arbitrage d'outil metier selon le besoin reel
- [Diagnostic visibilite IA](${baseUrl}/outils/visibilite-ia): votre site est-il visible dans les moteurs IA ? Score sur 4 axes et actions prioritaires
- [Checklist GEO](${baseUrl}/outils/checklist-geo): 24 actions concretes pour etre cite par les moteurs IA, cochable et telechargeable
- [Audit PWA](${baseUrl}/outils/audit-pwa): diagnostic du potentiel Progressive Web App
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
