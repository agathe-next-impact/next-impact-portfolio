import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, X, Gauge, Shield, Layers } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { generatePageMetadata, siteConfig } from "@/lib/metadata";
import {
  BreadcrumbJsonLd,
  ArticleJsonLd,
  FAQJsonLd,
  JsonLd,
} from "@/components/json-ld";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 24h — page evergreen.
export const revalidate = 86400;

const PILLAR_PATH = "/wordpress-headless";
// Date du dernier remaniement éditorial — à mettre à jour quand le contenu change
// substantiellement. Sert au schema TechArticle et au bloc « mis à jour le ».
const LAST_UPDATED = "2026-06-24";

const ACCENT = "text-accent-secondary";
const BTN_PRIMARY =
  "inline-flex h-12 items-center gap-2 rounded-sm border border-charcoal bg-vermilion px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_SECONDARY =
  "inline-flex h-12 items-center gap-2 rounded-sm border border-mid-gray/50 bg-transparent px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-accent-secondary hover:text-accent-secondary";

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return generatePageMetadata({
    title: isEn
      ? "Headless WordPress with Next.js: when to use it, costs, performance"
      : "WordPress Headless avec Next.js : quand l'utiliser, coûts, performance",
    description: isEn
      ? "What headless WordPress means in plain terms: WordPress keeps content in its back-end, Next.js renders the public site. Comparison vs classic WordPress, performance benchmarks, cost ranges, when to migrate and when to stay."
      : "Le WordPress headless expliqué clairement : WordPress garde la gestion de contenu, Next.js prend en charge le rendu public. Comparatif vs WordPress classique, performances mesurées, fourchettes de coût, quand migrer et quand rester.",
    path: PILLAR_PATH,
    eyebrow: isEn ? "Headless WordPress" : "WordPress Headless",
    keywords: isEn
      ? [
          "headless WordPress",
          "WordPress headless",
          "WordPress Next.js",
          "decoupled WordPress",
          "WPGraphQL",
          "Core Web Vitals WordPress",
          "WordPress migration",
        ]
      : [
          "WordPress headless",
          "headless WordPress",
          "WordPress Next.js",
          "WordPress découplé",
          "WPGraphQL",
          "Core Web Vitals WordPress",
          "migration WordPress",
        ],
    locale,
  });
}

// ─── Contenu FAQ ─────────────────────────────────────────────────────────────

function getFaq(isEn: boolean): Array<{ q: string; a: string }> {
  if (isEn) {
    return [
      {
        q: "What is headless WordPress in plain terms?",
        a: "Headless WordPress means the WordPress back-end (database, admin, editorial workflow) stays in place, but a separate front-end — usually Next.js — handles what visitors see. The two communicate via an API (WPGraphQL or REST). Editors keep their familiar interface; the public site gets a modern stack.",
      },
      {
        q: "Is headless WordPress worth it for a small site?",
        a: "Not always. For a brochure site under 20 pages with no performance issue and a happy editorial team, classic WordPress remains the simpler choice. Headless pays off when you need top Core Web Vitals, advanced security isolation, multi-channel content delivery, or specific front-end features that the WordPress theme layer makes painful.",
      },
      {
        q: "How much does a headless WordPress site cost in 2026?",
        a: "At Next Impact, a standard headless WordPress + Next.js site starts at €4,000 (4–6 weeks). A more complex headless platform with custom integrations or multisite ranges from €6,500 to €15,000+ (6–10 weeks). Classic WordPress remains available from €2,250 if headless isn't justified.",
      },
      {
        q: "Does headless WordPress break my SEO?",
        a: "No — done correctly, it improves it. Pages are pre-rendered (SSG/ISR), Core Web Vitals jump, structured data and meta tags are explicit. The risk is during migration: URLs must be preserved one-to-one, 301 redirects set up for any changed slug, and sitemap.xml regenerated. With those steps respected, SEO improves rather than degrades.",
      },
      {
        q: "Can editors keep using Gutenberg / Elementor in headless?",
        a: "Gutenberg yes — its block JSON can be consumed and rendered by Next.js. Elementor and other visual builders that produce shortcode-heavy HTML are problematic because their rendering logic lives in the WordPress theme. Migrating an Elementor site to headless usually means rebuilding the page templates in the front-end.",
      },
      {
        q: "WPGraphQL or WordPress REST API — which one to choose?",
        a: "WPGraphQL is recommended for new headless projects: a single endpoint, only the fields you ask for, much better TypeScript ergonomics in Next.js. The native REST API still works and is sometimes simpler for very small sites or specific integrations, but for a real production site WPGraphQL is the default.",
      },
      {
        q: "Is headless WordPress more secure than classic WordPress?",
        a: "Yes, materially. The WordPress admin can be isolated (behind a private subdomain, IP-restricted, basic-auth). The public-facing site is static or pre-rendered HTML served from a CDN — no PHP execution exposed to visitors, no plugin XSS reaching the front. Most automated WordPress attack vectors no longer apply.",
      },
      {
        q: "How long does a WordPress to headless migration take?",
        a: "A standard migration of a 30–100 page site: 4 to 6 weeks. Steps include content audit, URL mapping (critical for SEO), API setup (WPGraphQL), Next.js front rebuild matching the existing design, redirects and progressive cutover. Sites with heavy WooCommerce, multilingual, or custom-plugin dependencies need longer planning.",
      },
      {
        q: "Where is headless WordPress hosted?",
        a: "Two halves, two hosts. The WordPress back-end stays on a standard PHP/MySQL host (existing host is usually fine). The Next.js front is deployed on a JAMstack-friendly platform: Vercel, Netlify, or self-hosted Node. The combined monthly cost is comparable to a single optimized WordPress hosting plan.",
      },
      {
        q: "Can I go back to classic WordPress if headless doesn't fit?",
        a: "Yes. Since WordPress remains intact as the back-end, reverting to a classic theme rendering is always possible. The Next.js front is an additional layer, not a replacement of the CMS. This makes headless a low-risk evolution path.",
      },
    ];
  }
  return [
    {
      q: "C'est quoi le WordPress headless en termes simples ?",
      a: "WordPress headless signifie que le back-end WordPress (base de données, admin, workflow éditorial) reste en place, mais qu'un front-end séparé — généralement Next.js — gère ce que voient les visiteurs. Les deux communiquent via une API (WPGraphQL ou REST). Les éditeurs gardent leur interface, le site public passe sur une stack moderne.",
    },
    {
      q: "Le WordPress headless vaut-il le coup pour un petit site ?",
      a: "Pas toujours. Pour un site vitrine de moins de 20 pages sans problème de performance et avec une équipe éditoriale satisfaite, le WordPress classique reste le choix le plus simple. Le headless devient rentable quand il faut viser le vert sur Core Web Vitals, une isolation sécurité avancée, une diffusion multi-canal, ou des fonctionnalités front que la couche thème WordPress rend difficiles.",
    },
    {
      q: "Combien coûte un site WordPress headless en 2026 ?",
      a: "Chez Next Impact, un site WordPress Headless + Next.js standard démarre à 4 000 € (4 à 6 semaines). Une plateforme headless plus complexe avec intégrations sur-mesure ou multisite va de 6 500 € à 15 000 €+ (6 à 10 semaines). Le WordPress classique reste proposé à partir de 2 250 € si le headless n'est pas justifié.",
    },
    {
      q: "Le passage au headless casse-t-il le SEO ?",
      a: "Non — bien fait, il l'améliore. Les pages sont pré-rendues (SSG/ISR), les Core Web Vitals progressent nettement, les données structurées et meta sont explicites. Le risque est pendant la migration : conserver chaque URL à l'identique, poser des redirects 301 pour toute slug modifiée, régénérer le sitemap.xml. Avec ces étapes respectées, le SEO progresse au lieu de chuter.",
    },
    {
      q: "Les éditeurs peuvent-ils garder Gutenberg / Elementor en headless ?",
      a: "Gutenberg oui — son JSON de blocs est consommable et rendu par Next.js. Elementor et les page builders visuels qui produisent du HTML chargé en shortcodes posent problème car leur logique de rendu vit dans le thème WordPress. Migrer un site Elementor en headless implique généralement de reconstruire les gabarits côté front.",
    },
    {
      q: "WPGraphQL ou API REST WordPress — laquelle choisir ?",
      a: "WPGraphQL est recommandé pour les nouveaux projets headless : un seul endpoint, uniquement les champs demandés, ergonomie TypeScript bien meilleure dans Next.js. L'API REST native fonctionne toujours et reste parfois plus simple pour de très petits sites ou des intégrations ciblées, mais pour un vrai site en production, WPGraphQL est le défaut.",
    },
    {
      q: "Le WordPress headless est-il plus sécurisé que le classique ?",
      a: "Oui, nettement. L'admin WordPress peut être isolée (sous-domaine privé, restriction IP, basic-auth). Le site public est du HTML statique ou pré-rendu servi par CDN — pas d'exécution PHP exposée aux visiteurs, pas de faille plugin atteignant le front. La majorité des vecteurs d'attaque automatisés contre WordPress ne s'appliquent plus.",
    },
    {
      q: "Combien de temps prend une migration WordPress vers headless ?",
      a: "Migration standard d'un site de 30 à 100 pages : 4 à 6 semaines. Étapes : audit de contenu, mapping des URL (critique pour le SEO), mise en place de l'API (WPGraphQL), reconstruction du front Next.js calé sur le design existant, redirects et bascule progressive. Les sites avec WooCommerce massif, multilingue ou plugins custom demandent une planification plus longue.",
    },
    {
      q: "Où est hébergé un WordPress headless ?",
      a: "Deux moitiés, deux hébergeurs. Le back-end WordPress reste sur un hébergeur PHP/MySQL classique (l'hébergeur actuel suffit le plus souvent). Le front Next.js est déployé sur une plateforme JAMstack : Vercel, Netlify ou Node auto-hébergé. Le coût mensuel cumulé est comparable à un hébergement WordPress optimisé.",
    },
    {
      q: "Peut-on revenir au WordPress classique si le headless ne convient pas ?",
      a: "Oui. Comme WordPress reste intact en back-end, retourner à un rendu par thème classique est toujours possible. Le front Next.js est une couche additionnelle, pas un remplacement du CMS. Cela fait du headless une évolution à faible risque.",
    },
  ];
}

// ─── Articles de doc liés (silo interne) ─────────────────────────────────────

function getSiloLinks(isEn: boolean): Array<{ title: string; href: string }> {
  const base = "/documentation/wordpress-headless";
  // Silo refondu sur les 15 articles conservés après l'élagage vague 5
  // (pourquoi/quand/rendu/preview fusionnés dans leurs absorbants).
  if (isEn) {
    return [
      { title: "What is headless?", href: `${base}/comprendre-le-headless` },
      { title: "Should I go headless?", href: `${base}/dois-je-passer-au-headless` },
      { title: "Next.js for headless WordPress", href: `${base}/nextjs-pour-wordpress-headless` },
      { title: "How a headless site is built", href: `${base}/comment-creer-un-headless` },
      { title: "WordPress REST API", href: `${base}/api-rest-wordpress` },
      { title: "WPGraphQL guide", href: `${base}/wpgraphql` },
      { title: "Core Web Vitals on headless", href: `${base}/performance-et-core-web-vitals` },
      { title: "Security on headless WordPress", href: `${base}/securite-wordpress-headless` },
      { title: "Migrating from monolithic", href: `${base}/migration-monolithique-vers-headless` },
      { title: "Vercel deployment", href: `${base}/deploiement-vercel-nextjs` },
      { title: "Managing content day to day", href: `${base}/gerer-le-contenu` },
      { title: "Headless SEO architecture", href: `${base}/seo-pour-architecture-headless` },
    ];
  }
  return [
    { title: "Comprendre le headless", href: `${base}/comprendre-le-headless` },
    { title: "Dois-je passer au headless ?", href: `${base}/dois-je-passer-au-headless` },
    { title: "Next.js pour WordPress headless", href: `${base}/nextjs-pour-wordpress-headless` },
    { title: "Comment se construit un site headless", href: `${base}/comment-creer-un-headless` },
    { title: "API REST WordPress", href: `${base}/api-rest-wordpress` },
    { title: "Guide WPGraphQL", href: `${base}/wpgraphql` },
    { title: "Core Web Vitals en headless", href: `${base}/performance-et-core-web-vitals` },
    { title: "Sécurité du WordPress headless", href: `${base}/securite-wordpress-headless` },
    { title: "Migrer depuis un WordPress monolithique", href: `${base}/migration-monolithique-vers-headless` },
    { title: "Déploiement sur Vercel", href: `${base}/deploiement-vercel-nextjs` },
    { title: "Gérer le contenu au quotidien", href: `${base}/gerer-le-contenu` },
    { title: "SEO pour architecture headless", href: `${base}/seo-pour-architecture-headless` },
  ];
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function WordPressHeadlessPillarPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const faq = getFaq(isEn);
  const silo = getSiloLinks(isEn);

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    {
      name: isEn ? "Headless WordPress" : "WordPress Headless",
      url: PILLAR_PATH,
    },
  ];

  // Définition extractable (paragraphe-réponse) — clé pour les citations LLM.
  const definition = isEn
    ? "Headless WordPress is an architecture where WordPress keeps managing content in its admin and database, while a separate front-end — typically built with Next.js — fetches that content via an API (WPGraphQL or REST) and renders the public site. Editors keep their familiar workflow; visitors get a modern, fast, pre-rendered site."
    : "Le WordPress headless est une architecture où WordPress conserve la gestion du contenu dans son admin et sa base de données, pendant qu'un front-end séparé — typiquement construit avec Next.js — récupère ce contenu via une API (WPGraphQL ou REST) et rend le site public. Les éditeurs gardent leur workflow habituel ; les visiteurs reçoivent un site moderne, rapide, pré-rendu.";

  // Speakable cible le H1 et la définition — pour assistants vocaux et lecture IA.
  const speakableWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}${PILLAR_PATH}#webpage`,
    url: `${siteConfig.url}${PILLAR_PATH}`,
    name: isEn
      ? "Headless WordPress with Next.js"
      : "WordPress Headless avec Next.js",
    inLanguage: isEn ? "en-US" : "fr-FR",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    primaryImageOfPage: `${siteConfig.url}${siteConfig.ogImage}`,
    dateModified: LAST_UPDATED,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#pillar-h1", "#pillar-definition"],
    },
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <JsonLd data={speakableWebPage} />
      <ArticleJsonLd
        type="TechArticle"
        title={
          isEn
            ? "Headless WordPress with Next.js: when to use it, costs, performance"
            : "WordPress Headless avec Next.js : quand l'utiliser, coûts, performance"
        }
        description={definition}
        image={siteConfig.ogImage}
        datePublished="2026-06-24"
        dateModified={LAST_UPDATED}
        author="Agathe Karinthi-Martin"
        url={PILLAR_PATH}
        proficiencyLevel="Intermediate"
        dependencies="WordPress, Next.js, Node.js, WPGraphQL"
      />
      <FAQJsonLd questions={faq.map((f) => ({ question: f.q, answer: f.a }))} />

      <main>
        {/* ── 1. HERO + DÉFINITION EXTRACTABLE ─────────────────────────── */}
        <BlueprintSection tone="obsidian" ticks innerClassName="px-6 py-20 md:px-12 md:py-28">
          <Reveal>
            <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
              <span>№ 01 — {isEn ? "REFERENCE" : "REFERENCE"}</span>
              <span className="text-mid-gray">
                {isEn ? "Updated" : "Mis à jour le"}{" "}
                <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
              </span>
            </div>
            <h1
              id="pillar-h1"
              className="mt-6 max-w-4xl text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              {isEn ? (
                <>
                  Headless WordPress with{" "}
                  <span className={ACCENT}>Next.js</span>
                </>
              ) : (
                <>
                  WordPress Headless avec{" "}
                  <span className={ACCENT}>Next.js</span>
                </>
              )}
            </h1>
            <p
              id="pillar-definition"
              className="mt-8 max-w-3xl font-inter-tight text-lg leading-relaxed text-foreground/90 md:text-xl"
            >
              {definition}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/audit-site-web" className={BTN_PRIMARY}>
                {isEn ? "Free site audit" : "Audit gratuit du site"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/solutions-web" className={BTN_SECONDARY}>
                {isEn ? "See offers and pricing" : "Voir les offres et tarifs"}
              </Link>
            </div>
          </Reveal>
        </BlueprintSection>

        <Separator />

        {/* ── 2. TL;DR — BULLETS EXTRACTABLES ──────────────────────────── */}
        <BlueprintSection tone="jet" innerClassName="px-6 py-16 md:px-12 md:py-20">
          <SectionHeading
            index="№ 02"
            kicker={isEn ? "AT A GLANCE" : "EN BREF"}
            title={
              isEn
                ? "Headless WordPress in five facts"
                : "Le WordPress headless en cinq faits"
            }
          />
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {(isEn
              ? [
                  "WordPress remains the editorial back-end. Editors keep their admin, posts, plugins.",
                  "Next.js renders the public site. Pages are pre-rendered (SSG/ISR) and served from a CDN.",
                  "The two halves talk via an API — usually WPGraphQL, sometimes the REST API.",
                  "Performance: Core Web Vitals consistently in the green, often impossible with a heavy classic theme.",
                  "Pricing: from €4,000 for a standard site, 4 to 6 weeks. Migration possible without breaking SEO.",
                ]
              : [
                  "WordPress reste le back-end éditorial. Les éditeurs gardent leur admin, leurs articles, leurs plugins.",
                  "Next.js rend le site public. Les pages sont pré-rendues (SSG/ISR) et servies depuis un CDN.",
                  "Les deux moitiés communiquent par API — généralement WPGraphQL, parfois l'API REST.",
                  "Performance : Core Web Vitals au vert de façon stable, souvent impossible avec un thème classique chargé.",
                  "Tarifs : à partir de 4 000 € pour un site standard, 4 à 6 semaines. Migration possible sans casser le SEO.",
                ]
            ).map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 border border-dark-gray bg-obsidian/40 p-5"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border border-accent-secondary/60 font-mono text-[10px] text-accent-secondary">
                  {i + 1}
                </span>
                <span className="font-inter-tight text-base leading-relaxed text-foreground/90">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </BlueprintSection>

        <Separator />

        {/* ── 3. COMMENT ÇA MARCHE — 3 ÉTAPES ─────────────────────────── */}
        <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 md:px-12 md:py-20">
          <SectionHeading
            index="№ 03"
            kicker={isEn ? "HOW IT WORKS" : "COMMENT ÇA MARCHE"}
            title={isEn ? "Three moving parts" : "Trois pièces mobiles"}
            description={
              isEn
                ? "A headless setup splits one monolith into three clear roles."
                : "Une architecture headless découpe un monolithe en trois rôles distincts."
            }
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                num: "1",
                icon: Layers,
                title: isEn ? "WordPress back-end" : "Back-end WordPress",
                body: isEn
                  ? "Standard WordPress install. Editors create and update content as before. Plugins and Gutenberg blocks remain available."
                  : "Installation WordPress standard. Les éditeurs créent et mettent à jour le contenu comme avant. Plugins et blocs Gutenberg restent disponibles.",
              },
              {
                num: "2",
                icon: ArrowRight,
                title: isEn ? "API layer" : "Couche API",
                body: isEn
                  ? "WPGraphQL (recommended) or the native REST API exposes the content. Authenticated, cacheable, typed in TypeScript."
                  : "WPGraphQL (recommandé) ou l'API REST native expose le contenu. Authentifiée, cacheable, typée en TypeScript.",
              },
              {
                num: "3",
                icon: Gauge,
                title: isEn ? "Next.js front-end" : "Front-end Next.js",
                body: isEn
                  ? "Next.js fetches content at build time (SSG) or on-demand (ISR), renders the public pages, ships them through a global CDN."
                  : "Next.js récupère le contenu au build (SSG) ou à la demande (ISR), rend les pages publiques, les diffuse via un CDN mondial.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="border border-dark-gray bg-jet p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center border border-accent-secondary/60 font-mono text-[12px] text-accent-secondary">
                      {step.num}
                    </span>
                    <Icon className={`h-5 w-5 ${ACCENT}`} aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-light tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </BlueprintSection>

        <Separator />

        {/* ── 4. TABLEAU COMPARATIF ─────────────────────────────────────── */}
        <BlueprintSection tone="jet" innerClassName="px-6 py-16 md:px-12 md:py-20">
          <SectionHeading
            index="№ 04"
            kicker={isEn ? "SIDE BY SIDE" : "FACE À FACE"}
            title={
              isEn
                ? "Classic WordPress vs headless WordPress"
                : "WordPress classique vs WordPress headless"
            }
            description={
              isEn
                ? "Each row is a real trade-off, not a vendor pitch."
                : "Chaque ligne est un arbitrage réel, pas un argument commercial."
            }
          />
          <div className="mt-10 overflow-x-auto border border-dark-gray">
            <table className="w-full min-w-[700px] border-collapse text-left font-inter-tight text-sm">
              <thead>
                <tr className="border-b border-dark-gray bg-obsidian/60">
                  <th className="p-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                    {isEn ? "Criterion" : "Critère"}
                  </th>
                  <th className="p-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                    {isEn ? "Classic WordPress" : "WordPress classique"}
                  </th>
                  <th className="p-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                    {isEn ? "Headless WordPress" : "WordPress headless"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                {(isEn
                  ? [
                      ["Core Web Vitals", "Often orange/red on heavy themes", "Consistently green (SSG/ISR + CDN)"],
                      ["Editorial UX", "Native, familiar", "Identical — admin unchanged"],
                      ["Front-end flexibility", "Limited by theme + PHP", "Total (React, animations, custom UI)"],
                      ["Public-facing security", "Plugins exposed", "Static HTML, admin hidden"],
                      ["Hosting", "1 host (PHP/MySQL)", "2 hosts (WP + JAMstack platform)"],
                      ["Build complexity", "Low", "Medium"],
                      ["Setup time", "2–4 weeks", "4–6 weeks"],
                      ["Entry price (Next Impact)", "€2,250", "€4,000"],
                      ["Best for", "Brochure sites, small editorial teams", "Performance-critical sites, image-conscious brands, multi-channel content"],
                    ]
                  : [
                      ["Core Web Vitals", "Souvent orange/rouge sur thèmes chargés", "Vert stable (SSG/ISR + CDN)"],
                      ["UX éditoriale", "Native, familière", "Identique — admin inchangée"],
                      ["Flexibilité du front", "Bornée par thème + PHP", "Totale (React, animations, UI sur-mesure)"],
                      ["Sécurité côté public", "Plugins exposés", "HTML statique, admin masquée"],
                      ["Hébergement", "1 hébergeur (PHP/MySQL)", "2 hébergeurs (WP + plateforme JAMstack)"],
                      ["Complexité de build", "Faible", "Moyenne"],
                      ["Délai de mise en place", "2 à 4 semaines", "4 à 6 semaines"],
                      ["Tarif d'entrée (Next Impact)", "2 250 €", "4 000 €"],
                      ["Idéal pour", "Sites vitrines, petites équipes éditoriales", "Sites à forte exigence perf, marques soucieuses d'image, contenu multi-canal"],
                    ]
                ).map(([crit, classic, headless], i) => (
                  <tr
                    key={i}
                    className="border-b border-dark-gray last:border-b-0"
                  >
                    <td className="p-4 font-medium text-foreground">{crit}</td>
                    <td className="p-4 text-mid-gray">{classic}</td>
                    <td className="p-4">{headless}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BlueprintSection>

        <Separator />

        {/* ── 5. QUAND L'UTILISER / QUAND L'ÉVITER ──────────────────────── */}
        <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 md:px-12 md:py-20">
          <SectionHeading
            index="№ 05"
            kicker={isEn ? "DECISION" : "DÉCISION"}
            title={
              isEn
                ? "When to choose headless, when to stay classic"
                : "Quand choisir le headless, quand rester sur classique"
            }
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border border-accent-secondary/40 bg-jet p-6">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                <Check className="h-4 w-4" />
                {isEn ? "Choose headless if" : "Choisir le headless si"}
              </div>
              <ul className="mt-4 space-y-3 font-inter-tight text-sm text-foreground/90">
                {(isEn
                  ? [
                      "Core Web Vitals matter for SEO or conversion.",
                      "The existing WordPress is slow despite caching.",
                      "Brand image demands a polished, animated UI.",
                      "Content needs to be reused across web, mobile, embeds.",
                      "Security incidents have hit the WordPress front before.",
                      "The site is a growth asset, not a brochure.",
                    ]
                  : [
                      "Les Core Web Vitals comptent pour le SEO ou la conversion.",
                      "Le WordPress actuel est lent malgré le cache.",
                      "L'image de marque exige un front soigné, animé.",
                      "Le contenu doit être réutilisé web, mobile, embeds.",
                      "Des incidents sécurité ont déjà touché le front WordPress.",
                      "Le site est un actif de croissance, pas une simple vitrine.",
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${ACCENT}`} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-mid-gray/30 bg-jet p-6">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
                <X className="h-4 w-4" />
                {isEn ? "Stay on classic if" : "Rester sur classique si"}
              </div>
              <ul className="mt-4 space-y-3 font-inter-tight text-sm text-foreground/90">
                {(isEn
                  ? [
                      "The site is under 20 static pages with no perf issue.",
                      "The editorial team relies on Elementor or a heavy page builder.",
                      "Budget is below €3,000 with no headless-specific need.",
                      "WordPress plugins central to the site only ship server-rendered HTML.",
                      "Maintenance must stay strictly in one PHP host.",
                    ]
                  : [
                      "Le site fait moins de 20 pages statiques sans souci de perf.",
                      "L'équipe éditoriale s'appuie sur Elementor ou un page builder lourd.",
                      "Le budget est sous 3 000 € sans besoin spécifique au headless.",
                      "Des plugins WordPress centraux ne fournissent que du HTML côté serveur.",
                      "La maintenance doit rester strictement sur un seul hébergeur PHP.",
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-mid-gray" aria-hidden />
                    <span className="text-mid-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BlueprintSection>

        <Separator />

        {/* ── 6. CHIFFRES PERFORMANCE / COÛTS ──────────────────────────── */}
        <BlueprintSection tone="jet" innerClassName="px-6 py-16 md:px-12 md:py-20">
          <SectionHeading
            index="№ 06"
            kicker={isEn ? "BY THE NUMBERS" : "EN CHIFFRES"}
            title={
              isEn
                ? "What headless WordPress changes, measured"
                : "Ce que change le WordPress headless, mesuré"
            }
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                value: isEn ? "< 1.2 s" : "< 1,2 s",
                label: isEn
                  ? "LCP target on a headless build"
                  : "LCP visé sur un build headless",
                sub: isEn
                  ? "Typical classic theme: 2.5 – 4 s."
                  : "Thème classique typique : 2,5 – 4 s.",
                icon: Gauge,
              },
              {
                value: "4–6",
                label: isEn ? "Weeks to ship a standard build" : "Semaines pour un build standard",
                sub: isEn
                  ? "Migration of 30–100 pages, design parity, redirects."
                  : "Migration de 30–100 pages, parité design, redirects.",
                icon: Layers,
              },
              {
                value: isEn ? "€4,000" : "4 000 €",
                label: isEn ? "Entry price, Next Impact" : "Tarif d'entrée, Next Impact",
                sub: isEn
                  ? "Fixed budget agreed up-front. Classic from €2,250."
                  : "Budget fixé dès le départ. Classique à partir de 2 250 €.",
                icon: Shield,
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="border border-dark-gray bg-obsidian/60 p-6"
                >
                  <Icon className={`h-5 w-5 ${ACCENT}`} aria-hidden />
                  <div className="mt-4 text-4xl font-light tracking-tight text-foreground md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-inter-tight text-sm text-foreground/90">
                    {stat.label}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.10em] text-mid-gray">
                    {stat.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </BlueprintSection>

        <Separator />

        {/* ── 7. FAQ ────────────────────────────────────────────────────── */}
        <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 md:px-12 md:py-20">
          <SectionHeading
            index="№ 07"
            kicker={isEn ? "FAQ" : "FAQ"}
            title={
              isEn
                ? "Headless WordPress, questions actually asked"
                : "WordPress headless, vraies questions posées"
            }
            description={
              isEn
                ? "Phrased the way prospects type them in search and AI chatbots."
                : "Formulées comme les prospects les tapent dans la recherche et les chatbots IA."
            }
          />
          <div className="mt-10 grid grid-cols-1 gap-4">
            {faq.map((item, i) => (
              <details
                key={i}
                className="group border border-dark-gray bg-jet p-5 transition-colors hover:border-accent-secondary/60 open:border-accent-secondary/60"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-inter-tight text-base font-medium leading-snug text-foreground md:text-lg">
                      {item.q}
                    </h3>
                    <span
                      className={`mt-1 font-mono text-[14px] ${ACCENT} transition-transform group-open:rotate-45`}
                      aria-hidden
                    >
                      +
                    </span>
                  </div>
                </summary>
                <p className="mt-4 max-w-[68ch] font-inter-tight text-sm leading-relaxed text-mid-gray md:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </BlueprintSection>

        <Separator />

        {/* ── 8. SILO INTERNE — ARTICLES DE DOC LIÉS ───────────────────── */}
        <BlueprintSection tone="jet" innerClassName="px-6 py-16 md:px-12 md:py-20">
          <SectionHeading
            index="№ 08"
            kicker={isEn ? "DIG DEEPER" : "POUR ALLER PLUS LOIN"}
            title={
              isEn
                ? "Full documentation on headless WordPress"
                : "Documentation complète sur le WordPress headless"
            }
            description={
              isEn
                ? "Twenty-five in-depth articles covering every facet, free."
                : "Vingt-cinq articles approfondis couvrant chaque facette, en libre accès."
            }
          />
          <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {silo.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as never}
                  className="group flex items-center justify-between gap-3 border border-dark-gray bg-obsidian/40 p-4 transition-colors hover:border-accent-secondary"
                >
                  <span className="font-inter-tight text-sm text-foreground/90 group-hover:text-foreground">
                    {link.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-mid-gray transition-colors group-hover:text-accent-secondary" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/documentation/wordpress-headless"
              className={BTN_SECONDARY}
            >
              {isEn ? "All headless docs" : "Toute la doc headless"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </BlueprintSection>

        <Separator />

        {/* ── 9. CTA FROIDE — AUDIT GRATUIT ────────────────────────────── */}
        <BlueprintSection tone="obsidian" ticks innerClassName="px-6 py-20 md:px-12 md:py-24">
          <Reveal>
            <div className="flex flex-col items-start gap-6 md:max-w-3xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                {isEn ? "Next step" : "Prochaine étape"}
              </div>
              <h2 className="text-3xl font-light leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {isEn
                  ? "Wondering if your WordPress is a headless candidate?"
                  : "Vous vous demandez si votre WordPress est candidat au headless ?"}
              </h2>
              <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
                {isEn
                  ? "Free AI-assisted audit of your existing WordPress: Core Web Vitals, security exposure, editorial weight, headless ROI verdict. No commitment, no follow-up sales call."
                  : "Diagnostic Web & IA de votre WordPress actuel : Core Web Vitals, exposition sécurité, charge éditoriale, verdict de pertinence du headless. Sans engagement, sans relance commerciale."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/audit-site-web" className={BTN_PRIMARY}>
                  {isEn ? "Run the free audit" : "Lancer l'audit gratuit"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className={BTN_SECONDARY}>
                  {isEn ? "Or talk to me" : "Ou m'écrire"}
                </Link>
              </div>
            </div>
          </Reveal>
        </BlueprintSection>
      </main>
    </>
  );
}
