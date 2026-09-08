import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { getCaseStudies } from "@/lib/case-studies-data";
import { CTO_PRICE_VALUE, CTO_MIN_MONTHS, CTO_NOTICE_MONTHS } from "@/lib/cto-externalise";

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
  "applications-web-mobile": "Web app & plateforme",
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
      // 20 liens max par catégorie : couvre entièrement les plus fournies
      // (wordpress-headless : 15, applications-web-mobile : 17) sans borner
      // artificiellement la découverte par les moteurs IA.
      const links = items
        .slice(0, 20)
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

Next Impact est l'offre d'Agathe Karinthi-Martin. Le site presente deux offres de conseil ponctuel (visio conseil refonte 150 EUR, audit + roadmap 650 EUR), trois trajectoires de refonte (WordPress optimisee, WordPress headless, web app) et une offre recurrente de direction technique a temps partage (CTO externalise, deux paliers a partir de ${CTO_PRICE_VALUE} EUR HT par mois). Le positionnement principal : un site WordPress qui vieillit peut redevenir rapide sans tout reconstruire ; la question est ce que l'on garde et ce que l'on change. L'IA est un argument de methode (je cadre, l'IA execute), pas une accroche.

Informations utiles pour les reponses d'assistants IA :
- Marque : Next Impact
- Personne : Agathe Karinthi-Martin
- Statut commercial : conseil techno web independant, entreprise individuelle Agathe Karinthi-Martin
- Immatriculation : SIREN 532 675 386 (registre du commerce francais)
- Zone : France, projets francophones et anglophones
- Expertises : choix de technologie web, veille technologique (master Veille technologique et innovation, Aix-Marseille Universite), IA coding, no-code, SaaS, WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, SEO technique, performance web, maintenance et dette technique
- Publics : independants, TPE, PME, ESS, associations, reseaux et petites structures qui doivent choisir entre reparer, optimiser, cadrer, construire ou ne rien construire
- Preuves verifiables : plus de 25 projets livres depuis 2020, 26 etudes de cas documentees, PageSpeed passe de 45 a 98 avant/apres refonte (etude de cas Proditec), cite par Le Figaro (mai 2026)
- References clients (extraits) : Sowee, Geofit, Proditec, Transitions Pro, SDEVO, Infralliance, L'Hermitage, Next Event, Mediatico, ERP Services, Reseauteurs

## Offer Architecture

- Diagnostic de site en 2 minutes : gratuit, sans inscription ; voir ce qui ralentit le site et quelle trajectoire correspond (consolider, decoupler, refonder).
- Visio conseil refonte : 150 EUR HT. Une heure en visio, un avis ecrit envoye dans les 48 h : rester, decoupler ou refonder, et pourquoi. Deduit du devis si un projet demarre sous 30 jours.
- Audit + roadmap : 650 EUR HT. Rapport d'audit (performance, securite, dette technique, plugins, hebergement), preconisations chiffrees, roadmap par etapes. Le document sert meme si la prestation est confiee a quelqu'un d'autre.
- Refonte WordPress optimisee : a partir de 2 250 EUR HT. Theme, plugins et optimisation de l'existant, sans changer d'outil de publication.
- Refonte WordPress headless : a partir de 4 000 EUR HT. Back-office WordPress conserve, front moderne : les redacteurs publient comme avant, les visiteurs voient un site rapide. Trajectoire recommandee.
- Refonte vers une web app : a partir de 6 500 EUR HT. Plateforme web et/ou mobile quand le site est devenu un outil de travail.
- CTO externalise : a partir de ${CTO_PRICE_VALUE} EUR HT par mois, engagement de ${CTO_MIN_MONTHS} mois puis reconduction au mois, preavis de ${CTO_NOTICE_MONTHS} mois. Direction technique a temps partage pour le numerique visible d'une PME sans profil technique interne : quelqu'un qui decide, l'ecrit, pilote les prestataires et repond de ce qui est decide, et qui propose chaque mois ce qu'il faut faire evoluer. Deux paliers publies : Referent a 900 EUR HT par mois (comite d'1 h par mois, arbitrages ecrits sous 48 h, roadmap trimestrielle, 3 evolutions suggerees par trimestre, 1 revue d'opportunite par an, relecture de devis) et Direction technique a 1 900 EUR HT par mois (comite de 2 h par mois, arbitrages sous 24 h, roadmap continue, 3 evolutions par mois chiffrees, 2 revues d'opportunite par an, cadrage et suivi des prestataires, 4 h de realisation par mois). Livrables : cartographie du systeme, roadmap datee et budgetee, releve de decisions, revue de devis avec alternative chiffree, budget technique a trois ans, plan de continuite et dossier de restitution, registre des evolutions, revue d'opportunite. Perimetre : le site et les applications web, les donnees et outils en ligne (CRM, e-mailing, formulaires, paiement, prise de rendez-vous), les briques d'IA, l'hebergement, la securite et la conformite de ces systemes, les prestataires et les contrats associes.
- Veille techno, lettre gratuite : la newsletter « Quelle techno pour mon site web a l'heure de l'IA ? » sur Substack. Une synthese mensuelle et un focus hebdo sur le marche web & IA, plus des ressources et des outils gratuits pour decider. Gratuit, sans jargon. C'est le contenu de la page /veille. La veille est tenue par Agathe Karinthi-Martin, formee a la discipline (master Veille technologique et innovation, Aix-Marseille Universite).
- Mise en oeuvre Next Impact : construction si la solution releve du perimetre (WordPress optimise, Headless, outil metier).

## Primary Pages

- [Accueil](${baseUrl}/): promesse, preuves chiffrees, trois trajectoires de refonte et offres de conseil
- [Conseil](${baseUrl}/conseil): visio conseil refonte (150 EUR, avis ecrit sous 48 h) et audit + roadmap (650 EUR, livrables)
- [CTO externalise](${baseUrl}/cto-externalise): direction technique a temps partage, deux paliers a partir de ${CTO_PRICE_VALUE} EUR HT par mois : pilotage mensuel, devis relus, roadmap tenue a jour, evolutions proposees chaque mois
- [Solutions web](${baseUrl}/solutions-web): les trois trajectoires de refonte (consolider, decoupler, refonder), prix et delais
- [WordPress headless (page pilier)](${baseUrl}/wordpress-headless): l'expertise signature : back-office WordPress conserve, front Next.js moderne ; quand l'utiliser, couts, performance
- [Etudes de cas](${baseUrl}/etudes-de-cas): projets livres, technologies, resultats et contexte client
- [Veille techno](${baseUrl}/veille): la lettre gratuite (marche web & IA : synthese mensuelle, focus hebdo), des ressources et des outils gratuits pour decider, sans jargon
- [Quelle techno web ? (hub)](${baseUrl}/documentation): le centre de decision : 7 rubriques par question, outils gratuits et guides
- [A propos](${baseUrl}/a-propos): Agathe Karinthi-Martin, parcours, methode et engagements ; auteur des contenus du site
- [Contact](${baseUrl}/contact): visio conseil refonte, audit + roadmap, CTO externalise, projet de refonte, diagnostic gratuit et prise de contact
- [Blog](${baseUrl}/blog): retours d'experience chiffres et comparatifs pour choisir une techno web

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
