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
import { TRAJECTOIRES, TRAJECTOIRE_ORDER, type TrajectoireSlug } from "@/lib/trajectoires";
import {
  BESOINS,
  PACKS_PATH,
  SITUATIONS,
  VEILLE,
  VEILLE_TITRE,
  packBudgetLabel,
  packHref,
  packPrixEntree,
  trajectoireDuPack,
  packNom,
  situationsDuBesoin,
  type Situation,
} from "@/lib/situations";

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

// Les 7 rubriques de decision du hub « Quelle techno web ? » : la taxonomie
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

// Catalogue en trois moments : Diagnostiquer, Évoluer, Gérer (ADR-013), lu par
// situation depuis l'ADR-014 : trois besoins, sept situations, un pack par
// situation. Un pack n'est PAS une offre de plus : il met des lignes du
// catalogue dans l'ordre et en donne le budget. Le catalogue reste de sept
// lignes. Sentinelle est HORS catalogue : elle est décrite à part, avec sa
// page et son prix.
//
// Aucun nom d'offre, aucun prix, aucun budget n'est recopié ici : chacun est lu
// dans sa source (lib/visio-conseil.ts, lib/trajectoires.ts,
// lib/cto-externalise.ts, lib/sentinelle-offer.ts, lib/maintenance-offer.ts,
// lib/situations.ts). Ce fichier suit donc le contenu affiché quand un nom, un
// tarif ou une situation change.
//
// Suivi et maintenance : les lignes qui le citent dépendent de
// MAINTENANCE_PRIX_VALIDES. Tant que le drapeau vaut false (page en noindex),
// l'offre est absente de ce fichier ; elle y entre quand il passe à true. Les
// pages de pack affichent un budget de suivi : elles suivent le même drapeau.
const SENTINELLE_PRICE = OFFER_AMOUNT_CENTS / 100;

/** Ce fichier est écrit en texte normalisé : sans accent. */
const ascii = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Milliers séparés par une espace simple, même convention. */
const eur = (amount: number) => String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/**
 * Une chaîne lue dans une source (phrase de situation, prix déjà formaté,
 * définition de la veille), ramenée à la convention de ce fichier : sans
 * accent, sans espace insécable, montants en « EUR ».
 */
const INSECABLE = String.fromCharCode(160);
const INSECABLE_FINE = String.fromCharCode(8239);
const plain = (value: string) =>
  ascii(value).split(INSECABLE).join(" ").split(INSECABLE_FINE).join(" ").split("€").join("EUR");

/** Une chaîne de source reprise en milieu de phrase. */
const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

const conseilPrice = (id: string) =>
  CONSEIL_OFFERS.find((offer) => offer.id === id)!.tiers[0].value;
const AUDIT_PRICE = conseilPrice("architecture-projet-ia");

/** « Nom (nom technique) », tel qu'affiché sur les cartes. */
const trajectoireLabel = (slug: TrajectoireSlug) =>
  `${ascii(TRAJECTOIRES[slug].name.fr)} (${ascii(TRAJECTOIRES[slug].technique.fr)})`;
const trajectoirePrix = (slug: TrajectoireSlug) =>
  `a partir de ${eur(TRAJECTOIRES[slug].priceValue)} EUR HT`;
const trajectoireUrl = (slug: TrajectoireSlug) => `${baseUrl}${TRAJECTOIRES[slug].href}`;
const trajectoireNames = TRAJECTOIRE_ORDER.map((slug) => ascii(TRAJECTOIRES[slug].name.fr)).join(", ");
const trajectoireSummary = TRAJECTOIRE_ORDER.map((slug) => {
  const t = TRAJECTOIRES[slug];
  const recommended = t.recommended ? ", recommandee" : "";
  return `${ascii(t.name.fr)} (${ascii(t.technique.fr)}${recommended}, ${trajectoirePrix(slug)})`;
}).join(", ");

const CTO_REFERENT = CTO_TIERS.find((tier) => tier.id === "referent")!;
const CTO_DIRECTION = CTO_TIERS.find((tier) => tier.id === "direction")!;

const maintenanceTier = (id: "essentiel" | "actif") =>
  MAINTENANCE_TIERS.find((tier) => tier.id === id)!;

/**
 * Grille du suivi et maintenance, par type de site et par palier (ADR-014) :
 * « Site WordPress : Essentiel 89 EUR HT par mois, Actif 249 EUR HT par mois ;
 * Site headless ou web app : … ». Lue dans lib/maintenance-offer.ts.
 */
const maintenanceGrid = MAINTENANCE_GRID_COLUMNS.map((col) => {
  const paliers = MAINTENANCE_TIERS.map(
    (tier) => `${ascii(tier.name.fr)} ${plain(maintenancePriceLabel(tier.id, col.kind, "fr"))}`,
  ).join(", ");
  return `${ascii(col.label.fr)} : ${paliers}`;
}).join(" ; ");

const maintenanceSummary = MAINTENANCE_PRIX_VALIDES
  ? `le suivi et maintenance, deux paliers a partir de ${MAINTENANCE_PRICE_VALUE} EUR HT par mois selon le type de site, veille en continu avec Sentinelle incluse (page ${MAINTENANCE_PATH}), et `
  : "";

const maintenanceOffer = MAINTENANCE_PRIX_VALIDES
  ? `- Suivi et maintenance : a partir de ${MAINTENANCE_PRICE_VALUE} EUR HT par mois. Quelqu'un entretient le site : disponibilite surveillee, sauvegarde quotidienne, mises a jour verifiees, failles corrigees, rapport mensuel dans l'espace en ligne. Veille en continu sur les composants installes, avec Sentinelle incluse. Deux paliers, ${ascii(maintenanceTier("essentiel").name.fr)} et ${ascii(maintenanceTier("actif").name.fr)}, pour chaque type de site. Grille mensuelle : ${maintenanceGrid}. Un site headless ou une web app compte deux environnements a tenir, chacun avec ses mises a jour. ${plain(MAINTENANCE_COMMITMENT.fr)} Le suivi demarre par un etat des lieux du site. Presente sur ${baseUrl}${MAINTENANCE_PATH}, la page du moment Gerer, a cote de l'expert technique externalise.
`
  : "";

const maintenancePage = MAINTENANCE_PRIX_VALIDES
  ? `- [Maintenance WordPress : maintenir et evoluer dans la duree](${baseUrl}${MAINTENANCE_PATH}): la page du moment Gerer, ses deux services. Suivi et maintenance (maintenir) : surveillance, sauvegardes, mises a jour verifiees, rapport mensuel et veille en continu avec Sentinelle incluse ; deux paliers, ${ascii(maintenanceTier("essentiel").name.fr)} et ${ascii(maintenanceTier("actif").name.fr)}, grille par type de site, a partir de ${MAINTENANCE_PRICE_VALUE} EUR HT par mois, paliers detailles sur /packs/site-a-tenir. Expert technique externalise (evoluer) : deux paliers, ${ascii(CTO_REFERENT.name.fr)} et ${ascii(CTO_DIRECTION.name.fr)}, a partir de ${CTO_PRICE_VALUE} EUR HT par mois, paliers detailles sur /packs/decisions-techniques et /cto-externalise. Monitoring et veille couples, communs aux deux ; FAQ « lequel choisir ? »
`
  : "";

const maintenanceContact = MAINTENANCE_PRIX_VALIDES ? "suivi et maintenance, " : "";

// Sans nom d'offre ni lien tant que le suivi et maintenance n'est pas publié ici.
const sentinelleIncluse = MAINTENANCE_PRIX_VALIDES
  ? "incluse dans le suivi et maintenance"
  : "incluse dans le suivi du site";
const suiviInclus =
  SUIVI_INCLUS_MOIS > 0
    ? `Chaque prestation, refonte ou creation, inclut ${SUIVI_INCLUS_MOIS} mois de suivi apres la mise en ligne.

`
    : "";

// ─── La veille technique et stratégique (ADR-014) ───────────────────────────
// Définie une seule fois, dans VEILLE (lib/situations.ts) : ce fichier la cite,
// il ne la réécrit pas. Où chaque forme s'applique dépend du drapeau du suivi,
// comme le reste : sans suivi publié, la veille en continu ne cite que la
// direction technique.
const veilleContinuOu = MAINTENANCE_PRIX_VALIDES
  ? `${lowerFirst(ascii(VEILLE.continu.ou.fr))} (l'expert technique externalise)`
  : "dans l'expert technique externalise";

const veilleSection = `- ${ascii(VEILLE["premiere-analyse"].label.fr)}, ${lowerFirst(ascii(VEILLE["premiere-analyse"].ou.fr))}. Telle que le site la definit : « ${ascii(VEILLE["premiere-analyse"].detail.fr)} »
- ${ascii(VEILLE.continu.label.fr)}, ${veilleContinuOu}. Telle que le site la definit : « ${ascii(VEILLE.continu.detail.fr)} »`;

// ─── L'offre par situation (ADR-014) ────────────────────────────────────────
// Trois besoins, sept situations, un pack par situation. Tout est lu dans
// lib/situations.ts : nom du pack (packNom, ADR-016), phrase de situation,
// étapes, prix d'étape, budget calculé. Un pack n'est pas une ligne du
// catalogue, il en assemble.
const QUAND = { avant: "avant", pendant: "pendant", apres: "apres" } as const;

const packLine = (situation: Situation) => {
  const etapes = situation.steps
    .map((step) => `${QUAND[step.quand]}, ${ascii(step.offre.fr)} (${lowerFirst(plain(step.prix.fr))})`)
    .join(" ; ");
  // Page d'une prestation (page.solution) : elle affiche le prix du forfait,
  // plus le budget de la premiere annee (qui reste sur /tarifs).
  const prestation = situation.page.solution && trajectoireDuPack(situation);
  const variante = !prestation && situation.budget.variante
    ? ` ${ascii(situation.budget.variante.label.fr)} : ${eur(situation.budget.variante.total)} EUR HT.`
    : "";
  const prix = prestation
    ? `Prix du forfait : ${lowerFirst(plain(packPrixEntree(situation, "fr")))}`
    : `Budget plancher : ${plain(packBudgetLabel(situation, "fr"))}`;
  const recommande = situation.recommended ? " Parcours recommande." : "";
  return `- [${ascii(packNom(situation, "fr"))}](${situation.lienExterne ?? `${baseUrl}${packHref(situation.slug)}`}): pour la situation « ${ascii(situation.phrase.fr)} ». Offre au centre du parcours, ${ascii(situation.offre.fr)}. ${ascii(situation.resultat.fr)} Etapes : ${etapes}. ${prix}.${variante}${recommande}`;
};

const packsSection = MAINTENANCE_PRIX_VALIDES
  ? `## Offer by Situation

L'offre se lit par situation, plus par type d'offre : le visiteur part de son besoin, reconnait sa situation, arrive au parcours qui y repond. ${BESOINS.length} besoins, ${SITUATIONS.length} situations, un parcours par situation. Un parcours n'est pas une offre de plus : il met des offres du catalogue dans l'ordre (avant, pendant, apres) et en donne le budget. Il ne cree ni prix, ni remise : son budget est un plancher hors taxes, somme des prix publics. Le catalogue reste celui de la section suivante. Index des parcours : ${baseUrl}${PACKS_PATH}.

${BESOINS.map(
  (besoin) => `### ${ascii(besoin.moment.fr)} : « ${ascii(besoin.phrase.fr)} »

Offres detaillees sur ${baseUrl}${besoin.href}.

${situationsDuBesoin(besoin.key).map(packLine).join("\n")}`,
).join("\n\n")}

`
  : "";

const packsPage = MAINTENANCE_PRIX_VALIDES
  ? `- [Offres par situation](${baseUrl}${PACKS_PATH}): l'offre lue par situation : ${BESOINS.length} besoins, ${SITUATIONS.length} situations, un parcours par situation, avec ce qui vient avant, pendant et apres, et son budget
`
  : "";

const packsSummary = MAINTENANCE_PRIX_VALIDES
  ? `L'offre se lit par situation : ${BESOINS.length} besoins (${BESOINS.map((besoin) => `« ${ascii(besoin.phrase.fr)} »`).join(", ")}), ${SITUATIONS.length} situations, un parcours par situation avec son budget (page ${PACKS_PATH}) ; un parcours assemble des offres du catalogue, il n'en ajoute aucune. `
  : "";

export async function GET() {
  const docs = readDocs();
  // Le nombre d'études publiées est lu dans la source, jamais écrit en dur.
  const allCaseStudies = getCaseStudies("fr");
  const caseStudies = allCaseStudies.slice(0, 10);

  const caseStudyLinks = caseStudies
    .map(
      (study) =>
        `- [${study.title}](${baseUrl}/etudes-de-cas/${study.slug}): ${study.clientName}, ${study.technologies.join(", ")}`,
    )
    .join("\n");

  const content = `# Next Impact

> Refonte de site WordPress : rapide, moderne, sans tout reconstruire. Next Impact aide les structures dont le site vieillit a decider ce qu'elles gardent et ce qu'elles changent (garder, faire evoluer ou refaire), puis realise la prestation au forfait, en 6 a 10 semaines.

## Summary

Next Impact est l'offre d'Agathe Karinthi-Martin. ${packsSummary}Le catalogue compte sept offres, rangees en trois moments. Diagnostiquer, avant de choisir : echange de 15 minutes gratuit, audit + roadmap ${AUDIT_PRICE} EUR HT (page /conseil) et la veille gratuite (page /veille). Evoluer, refonte ou creation, trois prestations au forfait : ${trajectoireSummary}, sur la page /solutions-web. Gerer, une fois le site en ligne : ${maintenanceSummary}l'expert technique externalise, direction technique a temps partage, deux paliers a partir de ${CTO_PRICE_VALUE} EUR HT par mois (page /cto-externalise). Chaque offre porte une veille technique et strategique : une premiere analyse dans l'audit + roadmap et dans les trois prestations, une veille en continu dans les abonnements du moment Gerer. Hors catalogue : Sentinelle, veille personnalisee sur les composants du site, ${SENTINELLE_PRICE} EUR par mois, souscrite depuis le rapport de l'analyse gratuite du site et ${sentinelleIncluse} (page /sentinelle). La page /tarifs reunit les parcours et tous les prix du catalogue. Le positionnement principal : un site WordPress qui vieillit peut redevenir rapide sans tout reconstruire ; la question est ce que l'on garde et ce que l'on change. L'IA est un argument de methode (je cadre, l'IA execute), pas une accroche.

Informations utiles pour les reponses d'assistants IA :
- Marque : Next Impact
- Personne : Agathe Karinthi-Martin
- Statut commercial : conseil techno web independant, entreprise individuelle Agathe Karinthi-Martin
- Immatriculation : SIREN 532 675 386 (registre du commerce francais)
- Zone : France, projets francophones et anglophones
- Expertises : choix de technologie web, veille technologique (master Veille technologique et innovation, Aix-Marseille Universite), IA coding, no-code, SaaS, WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, SEO technique, performance web, maintenance et dette technique
- Publics : independants, TPE, PME, ESS, associations, reseaux et petites structures qui doivent choisir entre reparer, optimiser, cadrer, construire ou ne rien construire
- Preuves verifiables : plus de 25 projets livres depuis 2020, ${allCaseStudies.length} etudes de cas documentees, PageSpeed passe de 45 a 98 avant/apres refonte (etude de cas Proditec), cite par Le Figaro (mai 2026)
- References clients (extraits) : Sowee, Geofit, Proditec, Transitions Pro, SDEVO, Infralliance, L'Hermitage, Next Event, Mediatico, ERP Services, Reseauteurs

${packsSection}## Offer Architecture

Le catalogue : sept offres, rangees en trois moments, Diagnostiquer, Evoluer, Gerer. Ce sont les seules offres ; les parcours les assemblent. Les parcours et tous les prix et paliers du catalogue : ${baseUrl}/tarifs.

### ${ascii(VEILLE_TITRE.fr)} (ce qui distingue chaque offre)

Technique : ce qui menace ce que le client fait deja tourner. Strategique : ce que le contexte rend possible et que son site ne fait pas encore. Elle a deux formes.

${veilleSection}

### Point d'entree gratuit

- Analyse gratuite du site : une adresse, un rapport en deux minutes, aucun acces demande. L'analyse liste les composants du site (CMS, extensions, serveur, bibliotheques) et ceux qui sont a risque ; elle ne mesure pas la vitesse. Sur ${baseUrl}/scan.

### Diagnostiquer (avant de choisir : deux offres ponctuelles et la veille gratuite)

- Echange de 15 minutes : gratuit, sans engagement. Quinze minutes en visio pour poser la situation et savoir par ou commencer (analyse du site, audit + roadmap ou devis). Reservation en ligne depuis ${baseUrl}/conseil#choix-techno-ia ; c'est aussi la destination du bouton "Discutons de votre projet" sur tout le site.
- Audit + roadmap : ${AUDIT_PRICE} EUR HT. Rapport d'audit (performance, securite, dette technique, plugins, hebergement), premiere analyse de veille technique et strategique, preconisations chiffrees, roadmap par etapes, 1 h de restitution en visio. Le document sert meme si la prestation est confiee a quelqu'un d'autre. Presente sur ${baseUrl}/conseil#architecture-projet-ia.
- Veille techno, lettre gratuite : la newsletter « Quelle techno pour mon site web a l'heure de l'IA ? » sur Substack. Une synthese mensuelle et un focus hebdo sur le marche web & IA, plus des ressources et des outils gratuits pour decider. Gratuit, sans jargon. Elle est presentee sur la page /veille, en deuxieme position apres Sentinelle (hors catalogue, voir plus bas). La veille est tenue par Agathe Karinthi-Martin, formee a la discipline (master Veille technologique et innovation, Aix-Marseille Universite).

### Evoluer (trois prestations au forfait, refonte ou creation : prix et delai ecrits avant de commencer, 6 a 10 semaines)

Chaque prestation porte un seul nom, la technique en sous-titre, et commence par une premiere analyse de veille technique et strategique.

${suiviInclus}- ${trajectoireLabel("forfait-classique")} : ${trajectoirePrix("forfait-classique")}. Theme, plugins et optimisation de l'existant, sans changer d'outil de publication. Presentee sur ${trajectoireUrl("forfait-classique")}.
- ${trajectoireLabel("forfait-headless")} : ${trajectoirePrix("forfait-headless")}. Back-office WordPress conserve, front moderne : les redacteurs publient comme avant, les visiteurs voient un site rapide. Prestation recommandee. Presentee sur ${trajectoireUrl("forfait-headless")}.
- ${trajectoireLabel("forfait-webapp")} : ${trajectoirePrix("forfait-webapp")}. Plateforme web et/ou mobile quand le site est devenu un outil de travail. Presentee sur ${trajectoireUrl("forfait-webapp")}.

### Gerer (abonnements, une fois le site en ligne)

${maintenanceOffer}- Expert technique externalise : a partir de ${CTO_PRICE_VALUE} EUR HT par mois, engagement de ${CTO_MIN_MONTHS} mois puis reconduction au mois, preavis de ${CTO_NOTICE_MONTHS} mois. Direction technique a temps partage pour le numerique visible d'une PME sans profil technique interne : quelqu'un qui decide, l'ecrit, pilote les prestataires et repond de ce qui est decide, et qui propose chaque mois ce qu'il faut faire evoluer. Deux paliers publies : Referent a ${eur(CTO_REFERENT.price)} EUR HT par mois (comite d'1 h par mois, arbitrages ecrits sous 48 h, roadmap trimestrielle, veille dediee d'une page par mois, 3 evolutions suggerees par trimestre, 1 revue d'opportunite par an, relecture de devis) et Direction technique a ${eur(CTO_DIRECTION.price)} EUR HT par mois (comite de 2 h par mois, arbitrages sous 24 h, roadmap continue, veille dediee d'une page par mois plus une alerte a chaud, 3 evolutions par mois chiffrees, 2 revues d'opportunite par an, cadrage et suivi des prestataires, 4 h de realisation par mois). La veille y est en continu : ce qui met en cause l'existant, et ce que le systeme pourrait faire et ne fait pas encore. Aucun accompagnement ne demarre sans l'audit + roadmap prealable. Livrables : cartographie du systeme, roadmap datee et budgetee, releve de decisions, revue de devis avec alternative chiffree, budget technique a trois ans, plan de continuite et dossier de restitution, registre des evolutions, revue d'opportunite. Perimetre : le site et les applications web, les donnees et outils en ligne (CRM, e-mailing, formulaires, paiement, prise de rendez-vous), les briques d'IA, l'hebergement, la securite et la conformite de ces systemes, les prestataires et les contrats associes. Detaille et souscrit sur ${baseUrl}/cto-externalise, la fiche de reference de l'offre.

### Hors catalogue : Sentinelle

- Sentinelle : ${SENTINELLE_PRICE} EUR par mois, resiliable a tout moment, sans preavis. Elle ne figure pas au catalogue d'offres : elle se souscrit depuis le rapport de l'analyse gratuite du site (${baseUrl}/scan) et elle est ${sentinelleIncluse}. C'est une lettre de veille techno sur le projet du client : ${OFFER_ISSUES_PER_MONTH} lettres par mois (le 1er et le 15), par e-mail, preparees avec l'IA et relues par un humain avant envoi. Chaque lettre a quatre parties : ce qui a change (faits dates et sources : faille, fin de support, nouvelle regle), le site en douze points conclus chacun par agir, surveiller ou non concerne, trois actions au plus par ordre d'urgence, et la suite (trois scenarios, consolider, faire evoluer ou refondre, avec leur ordre de cout, un echeancier a six mois et trois questions a poser au prestataire). Entre deux lettres, une alerte si une faille severe touche une version reellement installee. Sentinelle previent et conseille, elle n'intervient pas sur le site. Fondee sur les elements publics du site. Presentee sur ${baseUrl}/sentinelle, et en premiere section de la page ${baseUrl}/veille.

### Inclus dans les prestations

- Mise en oeuvre Next Impact : construction si la solution releve du perimetre (WordPress optimise, Headless, outil metier).
- Espace en ligne : chaque prestation se suit dans un espace en ligne (audit, etat du site, rapports mensuels, decisions, lettres de veille), rangee par question (Missions, Votre site, Agir, Veille), connexion sans mot de passe, tout se telecharge. Presente sur ${baseUrl}/espace-client.

## Primary Pages

- [Accueil](${baseUrl}/): promesse, preuves chiffrees et l'offre par situation, en trois colonnes, une par besoin (Diagnostiquer, Evoluer, Gerer) ; les trois prestations (${trajectoireNames}) et la veille technique et strategique
${packsPage}- [Tarifs](${baseUrl}/tarifs): la seule page qui montre a la fois les parcours, par besoin, avec leur budget, et les sept offres du catalogue avec leurs paliers, par moment (Diagnostiquer, Evoluer, Gerer) ; prix hors taxes, ecrits avant de commencer ; le prix de Sentinelle y figure en note
- [Analyse gratuite du site](${baseUrl}/scan): une adresse, un rapport en deux minutes, aucun acces demande : les composants du site et ceux qui sont a risque
- [Conseil](${baseUrl}/conseil): les deux offres du moment Diagnostiquer, dans l'ordre d'engagement croissant : echange de 15 minutes (gratuit, ancre #choix-techno-ia) et audit + roadmap (${AUDIT_PRICE} EUR HT, livrables, ancre #architecture-projet-ia) ; un bandeau de fin de page renvoie vers l'expert technique externalise, vendu sur /cto-externalise
${maintenancePage}- [Expert technique externalise](${baseUrl}/cto-externalise): direction technique a temps partage, deux paliers a partir de ${CTO_PRICE_VALUE} EUR HT par mois : pilotage mensuel, devis relus, roadmap tenue a jour, evolutions proposees chaque mois
- [Solutions web](${baseUrl}/solutions-web): les trois prestations au forfait, refonte ou creation, ${TRAJECTOIRE_ORDER.map(trajectoireLabel).join(", ")}, prix et delais
- [Sentinelle : la lettre de veille techno de votre site web](${baseUrl}/sentinelle): hors catalogue, souscrite depuis le rapport de l'analyse du site : ${OFFER_ISSUES_PER_MONTH} lettres par mois (le 1er et le 15) sur le site, douze points conclus par agir, surveiller ou non concerne, trois actions au plus, scenarios et echeancier a six mois ; alerte entre deux lettres si une faille severe touche un composant installe ; relue avant envoi ; ${SENTINELLE_PRICE} EUR par mois, sans engagement, resiliable a tout moment
- [Espace client](${baseUrl}/espace-client): la visite de l'espace en ligne ou se suit chaque prestation (Missions, Votre site, Agir, Veille) et l'acces aux connexions clients
- [WordPress headless (page pilier)](${baseUrl}/wordpress-headless): l'expertise signature : back-office WordPress conserve, front Next.js moderne ; quand l'utiliser, couts, performance
- [Etudes de cas](${baseUrl}/etudes-de-cas): projets livres, technologies, resultats et contexte client
- [Veille techno](${baseUrl}/veille): la veille pour decideurs, dans cet ordre : Sentinelle, la veille personnalisee du site (${SENTINELLE_PRICE} EUR par mois, hors catalogue, depuis l'analyse gratuite du site), puis la lettre gratuite (marche web & IA : synthese mensuelle, focus hebdo), puis des ressources et des outils gratuits pour decider, sans jargon
- [Quelle techno web ? (hub)](${baseUrl}/documentation): le centre de decision : 7 rubriques par question, outils gratuits et guides
- [A propos](${baseUrl}/a-propos): Agathe Karinthi-Martin, parcours, methode et engagements ; auteur des contenus du site
- [Contact](${baseUrl}/contact): audit + roadmap, projet de refonte ou de creation, ${maintenanceContact}expert technique externalise, diagnostic gratuit et prise de contact
- [Blog](${baseUrl}/blog): retours d'experience chiffres et comparatifs pour choisir une techno web

## Decision Hub (Quelle techno web ?)

${hubRubriques.map((r) => `- [${r.label}](${baseUrl}/documentation/${r.slug}): ${r.blurb}`).join("\n")}

## Tools

- [Tous les outils](${baseUrl}/outils): les outils de decision gratuits, sans inscription
- [Analyse gratuite du site](${baseUrl}/scan): une adresse, un rapport en deux minutes, aucun acces demande : liste les composants du site et ceux qui sont a risque (ne mesure pas la vitesse)
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
