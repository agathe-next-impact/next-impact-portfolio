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
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
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

    return [
      {
        source: '/tarifs',
        destination: '/solutions-web',
        permanent: true,
      },
      {
        source: '/tarifs/eligibilite',
        destination: '/solutions-web/eligibilite',
        permanent: true,
      },
      {
        source: '/audit',
        destination: '/outils',
        permanent: true,
      },
      {
        source: '/articles/wordpress-headless-impact-social-pme-engagees',
        destination: '/solutions-web',
        permanent: true,
      },
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
      // Renommage de la page audit : audit-site-ia → audit-site-web
      // pour cibler la requête principale « audit site web ».
      {
        source: '/audit-site-ia',
        destination: '/audit-site-web',
        permanent: true,
      },
      {
        source: '/en/audit-site-ia',
        destination: '/en/audit-site-web',
        permanent: true,
      },
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
