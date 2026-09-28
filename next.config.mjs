import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Le prompt système de Sentinelle est lu sur le disque au moment de rédiger
  // une alerte (c'est un livrable produit, éditable sans toucher au code). Le
  // file tracing de Vercel n'embarque que ce qu'il voit importé : un fichier lu
  // par son chemin doit être déclaré, sans quoi la rédaction marche en local et
  // échoue en production.
  outputFileTracingIncludes: {
    '/api/sentinelle/inngest': ['./src/sentinelle/redaction/*.md'],
  },
  experimental: {
    // Compilation en worker conservée pour la vitesse, MAIS on retire
    // parallelServerCompiles : compiler serveur + client simultanément double
    // le pic mémoire et, sur une machine à 20 cœurs, fait tuer un worker par
    // l'OOM killer → « Jest worker encountered N child process exceptions ».
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
  },
  async redirects() {
    // Tools temporarily disabled — redirect to home so old bookmarks /
    // external links don't 404. permanent: false (HTTP 307) so browsers
    // don't cache forever if we re-enable them.
    const disabledTools = [
      'benchmarking',
      'estimateur-budget',
      'simulateur-roi',
      'tco-saas-vs-sur-mesure',
    ]
    const disabledToolRedirects = disabledTools.flatMap((slug) => [
      // FR (default locale, no prefix — next-intl localePrefix: "as-needed")
      { source: `/outils/${slug}`, destination: '/', permanent: false },
      // EN
      { source: `/en/outils/${slug}`, destination: '/en', permanent: false },
    ])

    // Version anglaise fermée (décision d'Agathe du 2026-09-28) : toute URL /en…
    // part en 301 vers son équivalent français, en un seul saut (règle placée
    // en tête). Doit suivre ENGLISH_PUBLISHED (i18n/routing.ts) : le fichier
    // .mjs ne peut pas lire ce module TypeScript, d'où la constante recopiée.
    const ENGLISH_PUBLISHED = false
    const englishClosedRedirects = ENGLISH_PUBLISHED
      ? []
      : [
          { source: '/en', destination: '/', permanent: true },
          { source: '/en/:path*', destination: '/:path*', permanent: true },
        ]

    // agat.dev (ancien domaine) : Vercel envoie agat.dev vers www.agat.dev, que
    // l'application sert. On consolide ici vers le domaine canonique, chemin
    // conservé (constat des logs du 2026-08-16, correction du 2026-09-28).
    const legacyDomainRedirects = [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?:www\\.)?agat\\.dev' }],
        destination: 'https://www.next-impact.digital/:path*',
        permanent: true,
      },
    ]

    return [
      ...legacyDomainRedirects,
      ...englishClosedRedirects,
      // /tarifs redevient une page (charte v1.4, ADR-012) : le récapitulatif de
      // toutes les offres et de leurs paliers, par moment. Seul l'ancien sous-
      // chemin /tarifs/eligibilite reste redirigé.
      {
        source: '/tarifs/eligibilite',
        destination: '/solutions-web/eligibilite',
        permanent: true,
      },
      {
        source: '/en/tarifs/eligibilite',
        destination: '/en/solutions-web/eligibilite',
        permanent: true,
      },
      {
        source: '/audit',
        destination: '/outils',
        permanent: true,
      },
      { source: '/en/audit', destination: '/en/outils', permanent: true },
      // Ancienne page « Vous êtes… » (personas par secteur, hors charte) :
      // placée hors de app/[locale], elle répondait 404 depuis l'i18n. Supprimée
      // le 2026-09-28 ; son intention (trouver l'offre qui me correspond) est
      // celle de l'offre par situation.
      { source: '/vous-etes/:path*', destination: '/packs', permanent: true },
      { source: '/en/vous-etes/:path*', destination: '/packs', permanent: true },
      {
        source: '/articles/wordpress-headless-impact-social-pme-engagees',
        destination: '/solutions-web',
        permanent: true,
      },
      {
        source: '/en/articles/wordpress-headless-impact-social-pme-engagees',
        destination: '/en/solutions-web',
        permanent: true,
      },
      // L'analyse du site (/scan, app/(sentinelle)) n'est pas localisée. Un
      // Link i18n rendu sur une page anglaise produit /en/scan, qui répondait
      // 404 (ex. CTA de /en/sentinelle) : on le ramène à l'URL unique.
      { source: '/en/scan', destination: '/scan', permanent: true },
      // La carte mentale de la documentation est retirée : la page faisait un
      // redirect() applicatif (307). Redirection permanente déclarée ici.
      { source: '/documentation/mind-map', destination: '/documentation', permanent: true },
      { source: '/en/documentation/mind-map', destination: '/en/documentation', permanent: true },
      // Renommage du slug /services → /solutions-web (+ page /solutions supprimée).
      // 301 pour préserver le SEO et ne casser aucun lien externe existant.
      // next-intl localePrefix "as-needed" : FR sans préfixe, EN préfixé /en.
      {
        source: '/services',
        destination: '/solutions-web',
        permanent: true,
      },
      {
        source: '/en/services',
        destination: '/en/solutions-web',
        permanent: true,
      },
      {
        source: '/services/eligibilite',
        destination: '/solutions-web/eligibilite',
        permanent: true,
      },
      {
        source: '/en/services/eligibilite',
        destination: '/en/solutions-web/eligibilite',
        permanent: true,
      },
      {
        source: '/solutions',
        destination: '/solutions-web',
        permanent: true,
      },
      {
        source: '/en/solutions',
        destination: '/en/solutions-web',
        permanent: true,
      },
      // Renommage du slug de catégorie documentation : headless-cms → wordpress-headless
      // pour aligner l'URL sur la requête cible « WordPress Headless ».
      // Le motif :path* couvre aussi le cas sans suffixe.
      {
        source: '/documentation/headless-cms/:path*',
        destination: '/documentation/wordpress-headless/:path*',
        permanent: true,
      },
      {
        source: '/en/documentation/headless-cms/:path*',
        destination: '/en/documentation/wordpress-headless/:path*',
        permanent: true,
      },
      // Retrait du sas d'audit automatique (outil déjà mocké, lib/audit/runAudit) :
      // /audit-site-web et son alias historique /audit-site-ia redirigeaient
      // vers la prise de RDV Calendly (décision 2026-09-10). Depuis l'ADR-012
      // (2026-09-27), ils redirigent vers l'analyse du site (/scan), le CTA
      // froid unique du site : tous les CTA internes qui pointent encore vers
      // /audit-site-web (footer, études de cas, doc…) retrouvent un diagnostic
      // gratuit au lieu d'une demande de rendez-vous. /scan est en français
      // seulement : la variante /en y mène aussi. Permanentes depuis le
      // 2026-09-28 : /scan est indexée, les anciennes adresses lui cèdent leur poids.
      {
        source: '/audit-site-web',
        destination: '/scan',
        permanent: true,
      },
      {
        source: '/en/audit-site-web',
        destination: '/scan',
        permanent: true,
      },
      {
        source: '/audit-site-ia',
        destination: '/scan',
        permanent: true,
      },
      {
        source: '/en/audit-site-ia',
        destination: '/scan',
        permanent: true,
      },
      // ── Élagage vague 5 : consolidation du stock WordPress headless ──
      // 25 articles doc → 15 ; les 10 slugs fusionnés redirigent vers leur
      // absorbant (FR + EN). Plan : .claude/docs/plan-fusion-headless.md §3.
      ...[
        ['pourquoi-le-headless',              'comprendre-le-headless'],
        ['comment-fonctionne-le-headless',    'comprendre-le-headless'],
        ['wordpress-headless-en-pratique',    'comprendre-le-headless'],
        ['quand-utiliser-wordpress-headless', 'dois-je-passer-au-headless'],
        ['les-technos-frontend',              'nextjs-pour-wordpress-headless'],
        ['rendu-nextjs-ssg-ssr-isr',          'nextjs-pour-wordpress-headless'],
        ['gestion-des-medias-headless',       'performance-et-core-web-vitals'],
        ['preview-et-workflow-editorial',     'gerer-le-contenu'],
        ['authentification-jwt-headless',     'securite-wordpress-headless'],
        ['herbergement-et-mise-en-ligne',     'deploiement-vercel-nextjs'],
      ].flatMap(([from, to]) => [
        { source: `/documentation/wordpress-headless/${from}`,    destination: `/documentation/wordpress-headless/${to}`,    permanent: true },
        { source: `/en/documentation/wordpress-headless/${from}`, destination: `/en/documentation/wordpress-headless/${to}`, permanent: true },
      ]),
      // ── Fusion des quasi-doublons de la documentation (2026-09-28) ──
      // Chaque paire « pourquoi / comment » ne forme plus qu'un article ; le
      // slug absorbé redirige vers l'absorbant. /en/… est déjà ramené au
      // français par la règle de tête (ENGLISH_PUBLISHED).
      ...[
        ['design-ui-ux', 'creer-une-charte-graphique', 'charte-graphique'],
        ['design-ui-ux', 'creer-son-identite-visuelle', 'identite-visuelle'],
        ['design-ui-ux', 'definir-son-ui', 'ui'],
        ['design-ui-ux', 'definir-son-ux', 'ux'],
        ['design-ui-ux', 'pourquoi-des-maquettes', 'comment-creer-des-maquettes'],
        ['marketing-digital', 'definir-sa-strategie-marketing', 'strategie-marketing'],
        ['marketing-digital', 'mettre-en-oeuvre-strategie-de-marque', 'strategie-de-marque'],
        ['marketing-digital', 'definir-sa-strategie-de-medias-sociaux', 'presence-sur-les-reseaux-sociaux'],
        ['seo', 'penser-seo-en-amont', 'planifier-seo-en-amont'],
        ['projet-site-web', 'pourquoi-gerer-projet-web', 'gestion-projet-web-guide-pratique'],
      ].map(([category, from, to]) => ({
        source: `/documentation/${category}/${from}`,
        destination: `/documentation/${category}/${to}`,
        permanent: true,
      })),
      // Orphelin — règle spécifique AVANT le catch-all /documentation/blog.
      { source: '/documentation/blog/passage-wp-headless',    destination: '/documentation/wordpress-headless/dois-je-passer-au-headless', permanent: true },
      { source: '/en/documentation/blog/passage-wp-headless', destination: '/en/documentation/wordpress-headless/dois-je-passer-au-headless', permanent: true },
      // Catégorie doc « blog » supprimée (collision avec le blog racine).
      { source: '/documentation/blog',    destination: '/blog',    permanent: true },
      { source: '/en/documentation/blog', destination: '/en/blog', permanent: true },
      // Scorie : applications-web-mobile/index.mdx supprimé (doublon de la
      // page de catégorie) — /index redirige vers la catégorie.
      { source: '/documentation/applications-web-mobile/index',    destination: '/documentation/applications-web-mobile',    permanent: true },
      { source: '/en/documentation/applications-web-mobile/index', destination: '/en/documentation/applications-web-mobile', permanent: true },
      // Offre « Dépannage WordPress » supprimée (2026-07-05). 301 vers /contact
      // pour ne pas casser les liens de mailings / bookmarks ni perdre le SEO.
      {
        source: '/depannage-wordpress',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/en/depannage-wordpress',
        destination: '/en/contact',
        permanent: true,
      },
      // ── Lot A — vague de dépublication unique (directives v3.1, docs/decisions.md) ──
      // Retrait AGEFIPH : la page d'offre rejoint /a-propos (seule page où une
      // ligne factuelle TIH peut subsister) ; le simulateur rejoint /outils
      // (équivalent le plus proche, ADR-004).
      { source: '/avantage-oeth',    destination: '/a-propos',    permanent: true },
      { source: '/en/avantage-oeth', destination: '/en/a-propos', permanent: true },
      { source: '/outils/simulateur-agefiph',    destination: '/outils',    permanent: true },
      { source: '/en/outils/simulateur-agefiph', destination: '/en/outils', permanent: true },
      // Renommage de l'outil : Boussole → Sélecteur techno web & IA.
      { source: '/outils/boussole',    destination: '/outils/selecteur-techno',    permanent: true },
      { source: '/en/outils/boussole', destination: '/en/outils/selecteur-techno', permanent: true },
      ...disabledToolRedirects,
    ]
  },
  async headers() {
    // En-têtes de sécurité (chantier GEO — catégorie « Sécurité technique »).
    // CSP volontairement pragmatique : les directives à forte valeur et sans risque
    // (object-src, base-uri, frame-ancestors, form-action, upgrade-insecure-requests)
    // sont strictes ; `script-src` reste permissif (`https:` + inline + eval) pour ne
    // rien casser (gtag, Clarity, scripts Next, embeds). Durcissement possible plus
    // tard via nonces (middleware).
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-src 'self' https:",
      "media-src 'self' https: blob:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default withBundleAnalyzer(withNextIntl(nextConfig));
