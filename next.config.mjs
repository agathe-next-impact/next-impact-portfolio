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
        destination: '/services',
        permanent: true,
      },
      {
        source: '/tarifs/eligibilite',
        destination: '/services/eligibilite',
        permanent: true,
      },
      {
        source: '/audit',
        destination: '/outils',
        permanent: true,
      },
      {
        source: '/articles/wordpress-headless-impact-social-pme-engagees',
        destination: '/services',
        permanent: true,
      },
      ...disabledToolRedirects,
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
