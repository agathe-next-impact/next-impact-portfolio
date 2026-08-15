import type { Fingerprint } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Catalogue d'empreintes — DES DONNÉES, PAS DU CODE.
//
// Ajouter une technologie = ajouter une entrée ici. Aucun fichier du moteur ne
// bouge. C'est la condition pour qu'une veille reste agnostique : le jour où un
// client tourne sous Craft, Astro ou Bun, on l'ajoute en trois lignes.
//
// Deux règles de rédaction, apprises du fait qu'une fausse détection produit
// ensuite une fausse alerte :
//
//  1. `confidence: "high"` est réservé aux signatures qu'une autre technologie
//     ne peut pas produire par accident (un en-tête propriétaire, un
//     meta generator). Une chaîne devinable dans du HTML est "medium" ou "low".
//  2. Une version n'est capturée que quand la source la donne vraiment. Il vaut
//     mieux `version: null` — la fiche sera complétée à l'onboarding — qu'un
//     numéro inventé qui déclencherait une comparaison de plage erronée.
//
// `ecosystem` dit dans quel catalogue de failles chercher :
//   wordpress → WPScan / Wordfence · npm, packagist → OSV
//   endoflife → endoflife.date (fins de support)
//   null      → affiché dans la fiche, sans veille automatique
// ─────────────────────────────────────────────────────────────────────────────

export const FINGERPRINTS: Fingerprint[] = [
  // ── CMS ───────────────────────────────────────────────────────────────────
  {
    slug: "wordpress",
    label: "WordPress",
    type: "cms",
    ecosystem: "wordpress",
    signals: [
      { on: "generator", match: /WordPress/i, version: /WordPress\s*([\d.]+)/i, confidence: "high" },
      { on: "html", match: /\/wp-content\/|\/wp-includes\//i, confidence: "high" },
      { on: "html", match: /api\.w\.org/i, confidence: "high" },
      { on: "cookie", match: /^wordpress_|^wp-settings-/i, confidence: "high" },
    ],
  },
  {
    slug: "drupal",
    label: "Drupal",
    type: "cms",
    ecosystem: "drupal",
    signals: [
      { on: "generator", match: /Drupal/i, version: /Drupal\s*(\d+(?:\.\d+)*)/i, confidence: "high" },
      { on: "header", name: "x-generator", match: /Drupal/i, version: /Drupal\s*(\d+(?:\.\d+)*)/i, confidence: "high" },
      { on: "html", match: /\/sites\/(?:all|default)\/files\//i, confidence: "medium" },
      { on: "html", match: /drupal-settings-json/i, confidence: "high" },
    ],
  },
  {
    slug: "joomla",
    label: "Joomla",
    type: "cms",
    ecosystem: "joomla",
    signals: [
      { on: "generator", match: /Joomla/i, version: /Joomla!?\s*([\d.]+)/i, confidence: "high" },
      { on: "html", match: /\/media\/jui\/|option=com_/i, confidence: "medium" },
    ],
  },
  {
    slug: "typo3",
    label: "TYPO3",
    type: "cms",
    ecosystem: "typo3",
    signals: [
      { on: "generator", match: /TYPO3/i, confidence: "high" },
      { on: "html", match: /typo3temp\/|typo3conf\//i, confidence: "high" },
    ],
  },
  {
    slug: "spip",
    label: "SPIP",
    type: "cms",
    ecosystem: "spip",
    signals: [
      // Très présent dans le secteur public et associatif français.
      { on: "generator", match: /SPIP/i, version: /SPIP\s*([\d.]+)/i, confidence: "high" },
      { on: "html", match: /spip\.php\?|\/squelettes\//i, confidence: "medium" },
    ],
  },
  {
    slug: "ghost",
    label: "Ghost",
    type: "cms",
    ecosystem: "npm",
    signals: [
      { on: "generator", match: /Ghost/i, version: /Ghost\s*([\d.]+)/i, confidence: "high" },
    ],
  },
  {
    slug: "craft-cms",
    label: "Craft CMS",
    type: "cms",
    ecosystem: "packagist",
    signals: [
      { on: "header", name: "x-powered-by", match: /Craft CMS/i, confidence: "high" },
      { on: "cookie", match: /^CraftSessionId$/i, confidence: "high" },
    ],
  },
  {
    slug: "shopify",
    label: "Shopify",
    type: "cms",
    ecosystem: null, // SaaS hébergé : pas de version à surveiller côté client
    signals: [
      { on: "header", name: "x-shopid", confidence: "high" },
      { on: "header", name: "x-shopify-stage", confidence: "high" },
      { on: "html", match: /cdn\.shopify\.com/i, confidence: "high" },
      { on: "url", match: /\.myshopify\.com/i, confidence: "high" },
    ],
  },
  {
    slug: "wix",
    label: "Wix",
    type: "cms",
    ecosystem: null,
    signals: [
      { on: "header", name: "x-wix-request-id", confidence: "high" },
      { on: "html", match: /static\.parastorage\.com/i, confidence: "high" },
    ],
  },
  {
    slug: "squarespace",
    label: "Squarespace",
    type: "cms",
    ecosystem: null,
    signals: [
      { on: "generator", match: /Squarespace/i, confidence: "high" },
      { on: "html", match: /static1\.squarespace\.com/i, confidence: "high" },
    ],
  },
  {
    slug: "webflow",
    label: "Webflow",
    type: "cms",
    ecosystem: null,
    signals: [
      { on: "generator", match: /Webflow/i, confidence: "high" },
      { on: "html", match: /website-files\.com/i, confidence: "high" },
    ],
  },

  // ── E-commerce ────────────────────────────────────────────────────────────
  {
    slug: "woocommerce",
    label: "WooCommerce",
    type: "ecommerce",
    ecosystem: "wordpress",
    implies: ["wordpress"],
    signals: [
      { on: "html", match: /\/plugins\/woocommerce\//i, version: /woocommerce[^"']*?[?&]ver=([\d.]+)/i, confidence: "high" },
      { on: "cookie", match: /^woocommerce_|^wp_woocommerce_session_/i, confidence: "high" },
    ],
  },
  {
    slug: "prestashop",
    label: "PrestaShop",
    type: "ecommerce",
    ecosystem: "prestashop",
    signals: [
      { on: "generator", match: /PrestaShop/i, confidence: "high" },
      { on: "cookie", match: /^PrestaShop-/i, confidence: "high" },
      { on: "html", match: /\/modules\/ps_/i, confidence: "medium" },
    ],
  },
  {
    slug: "magento",
    label: "Magento",
    type: "ecommerce",
    ecosystem: "packagist",
    signals: [
      { on: "header", name: "x-magento-vary", confidence: "high" },
      { on: "html", match: /\/static\/version\d+\/frontend\/|Magento_/i, confidence: "medium" },
    ],
  },

  // ── Frameworks front et méta-frameworks ───────────────────────────────────
  {
    slug: "next",
    label: "Next.js",
    type: "framework",
    ecosystem: "npm",
    signals: [
      { on: "header", name: "x-powered-by", match: /Next\.js/i, version: /Next\.js\s*([\d.]+)/i, confidence: "high" },
      { on: "html", match: /\/_next\/static\/|__NEXT_DATA__/i, confidence: "high" },
      { on: "header", name: "x-nextjs-cache", confidence: "high" },
    ],
  },
  {
    slug: "nuxt",
    label: "Nuxt",
    type: "framework",
    ecosystem: "npm",
    signals: [
      { on: "html", match: /\/_nuxt\/|__NUXT__/i, confidence: "high" },
    ],
  },
  {
    slug: "sveltekit",
    label: "SvelteKit",
    type: "framework",
    ecosystem: "npm",
    signals: [
      { on: "html", match: /\/_app\/immutable\/|__sveltekit/i, confidence: "high" },
    ],
  },
  {
    slug: "remix",
    label: "Remix",
    type: "framework",
    ecosystem: "npm",
    signals: [{ on: "html", match: /__remixContext|__remixManifest/i, confidence: "high" }],
  },
  {
    slug: "astro",
    label: "Astro",
    type: "framework",
    ecosystem: "npm",
    signals: [
      { on: "generator", match: /Astro/i, version: /Astro\s*v?([\d.]+)/i, confidence: "high" },
      { on: "html", match: /astro-island|astro-slot/i, confidence: "medium" },
    ],
  },
  {
    slug: "gatsby",
    label: "Gatsby",
    type: "framework",
    ecosystem: "npm",
    signals: [
      { on: "generator", match: /Gatsby/i, version: /Gatsby\s*([\d.]+)/i, confidence: "high" },
      { on: "html", match: /___gatsby|\/page-data\//i, confidence: "high" },
    ],
  },
  {
    slug: "angular",
    label: "Angular",
    type: "framework",
    ecosystem: "npm",
    signals: [
      // ng-version porte le numéro exact : signature rare et précieuse.
      { on: "html", match: /ng-version="/i, version: /ng-version="([\d.]+)"/i, confidence: "high" },
    ],
  },
  {
    slug: "vue",
    label: "Vue.js",
    type: "js_library",
    ecosystem: "npm",
    signals: [
      { on: "asset", match: /\bvue(?:@|[.-])([\d.]+)?[^/]*\.js/i, version: /\bvue(?:@|[.-])([\d.]+)/i, confidence: "medium" },
      { on: "html", match: /data-v-app/i, confidence: "low" },
    ],
  },
  {
    slug: "react",
    label: "React",
    type: "js_library",
    ecosystem: "npm",
    signals: [
      // Sans build tool identifié, React ne laisse que des traces faibles.
      { on: "html", match: /data-reactroot|__REACT_DEVTOOLS_GLOBAL_HOOK__/i, confidence: "low" },
      { on: "asset", match: /react(?:-dom)?(?:@|[.-])([\d.]+)?[^/]*\.js/i, version: /react(?:-dom)?(?:@|[.-])([\d.]+)/i, confidence: "medium" },
    ],
  },
  {
    slug: "hugo",
    label: "Hugo",
    type: "framework",
    ecosystem: null,
    signals: [
      { on: "generator", match: /Hugo/i, version: /Hugo\s*([\d.]+)/i, confidence: "high" },
    ],
  },
  {
    slug: "jekyll",
    label: "Jekyll",
    type: "framework",
    ecosystem: null,
    signals: [
      { on: "generator", match: /Jekyll/i, version: /Jekyll\s*v?([\d.]+)/i, confidence: "high" },
    ],
  },

  // ── Frameworks serveur ────────────────────────────────────────────────────
  {
    slug: "laravel",
    label: "Laravel",
    type: "framework",
    ecosystem: "packagist",
    signals: [{ on: "cookie", match: /^laravel_session$/i, confidence: "high" }],
  },
  {
    slug: "symfony",
    label: "Symfony",
    type: "framework",
    ecosystem: "packagist",
    signals: [
      { on: "header", name: "x-powered-by", match: /Symfony/i, confidence: "high" },
      { on: "header", name: "x-debug-token", confidence: "medium" },
    ],
  },
  {
    slug: "django",
    label: "Django",
    type: "framework",
    ecosystem: "pypi",
    signals: [{ on: "cookie", match: /^csrftoken$|^django_language$/i, confidence: "medium" }],
  },
  {
    slug: "express",
    label: "Express",
    type: "framework",
    ecosystem: "npm",
    signals: [
      { on: "header", name: "x-powered-by", match: /^Express$/i, confidence: "high" },
    ],
  },

  // ── Serveurs et exécutions ────────────────────────────────────────────────
  {
    slug: "nginx",
    label: "nginx",
    type: "server",
    ecosystem: "endoflife",
    signals: [
      { on: "header", name: "server", match: /nginx/i, version: /nginx\/([\d.]+)/i, confidence: "high" },
    ],
  },
  {
    slug: "apache",
    label: "Apache HTTP Server",
    type: "server",
    ecosystem: "endoflife",
    signals: [
      { on: "header", name: "server", match: /Apache/i, version: /Apache\/([\d.]+)/i, confidence: "high" },
    ],
  },
  {
    slug: "litespeed",
    label: "LiteSpeed",
    type: "server",
    ecosystem: null,
    signals: [{ on: "header", name: "server", match: /LiteSpeed/i, confidence: "high" }],
  },
  {
    slug: "caddy",
    label: "Caddy",
    type: "server",
    ecosystem: null,
    signals: [{ on: "header", name: "server", match: /Caddy/i, confidence: "high" }],
  },
  {
    slug: "iis",
    label: "Microsoft IIS",
    type: "server",
    ecosystem: "endoflife",
    signals: [
      { on: "header", name: "server", match: /Microsoft-IIS/i, version: /Microsoft-IIS\/([\d.]+)/i, confidence: "high" },
    ],
  },
  {
    slug: "php",
    label: "PHP",
    type: "runtime",
    ecosystem: "endoflife",
    signals: [
      // La version de PHP est l'un des faits de veille les plus utiles : les
      // fins de support sont datées et publiques.
      { on: "header", name: "x-powered-by", match: /PHP/i, version: /PHP\/([\d.]+)/i, confidence: "high" },
      { on: "cookie", match: /^PHPSESSID$/i, confidence: "medium" },
    ],
  },

  // ── Hébergement, CDN, plateformes ─────────────────────────────────────────
  {
    slug: "cloudflare",
    label: "Cloudflare",
    type: "cdn",
    ecosystem: null,
    signals: [
      { on: "header", name: "cf-ray", confidence: "high" },
      { on: "header", name: "server", match: /cloudflare/i, confidence: "high" },
    ],
  },
  {
    slug: "vercel",
    label: "Vercel",
    type: "hosting",
    ecosystem: null,
    signals: [
      { on: "header", name: "x-vercel-id", confidence: "high" },
      { on: "header", name: "server", match: /Vercel/i, confidence: "high" },
    ],
  },
  {
    slug: "netlify",
    label: "Netlify",
    type: "hosting",
    ecosystem: null,
    signals: [
      { on: "header", name: "x-nf-request-id", confidence: "high" },
      { on: "header", name: "server", match: /Netlify/i, confidence: "high" },
    ],
  },
  {
    slug: "cloudfront",
    label: "Amazon CloudFront",
    type: "cdn",
    ecosystem: null,
    signals: [{ on: "header", name: "x-amz-cf-id", confidence: "high" }],
  },
  {
    slug: "github-pages",
    label: "GitHub Pages",
    type: "hosting",
    ecosystem: null,
    signals: [
      { on: "header", name: "x-github-request-id", confidence: "high" },
      { on: "header", name: "server", match: /GitHub\.com/i, confidence: "high" },
    ],
  },
  {
    slug: "o2switch",
    label: "o2switch",
    type: "hosting",
    ecosystem: null,
    signals: [{ on: "header", name: "server", match: /o2switch/i, confidence: "high" }],
  },
  {
    slug: "infomaniak",
    label: "Infomaniak",
    type: "hosting",
    ecosystem: null,
    signals: [{ on: "header", name: "server", match: /Infomaniak/i, confidence: "high" }],
  },

  // ── Bibliothèques JavaScript ──────────────────────────────────────────────
  {
    slug: "jquery",
    label: "jQuery",
    type: "js_library",
    ecosystem: "npm",
    signals: [
      // jQuery est la bibliothèque qui traîne le plus de versions anciennes et
      // de failles connues sur les sites vitrines : elle mérite sa signature.
      // Version dans le nom du fichier : « jquery-3.6.0.min.js », « jquery@3.7.1 ».
      { on: "asset", match: /jquery[.\-@]\d+\.\d+/i, version: /jquery[.\-@](\d+\.\d+(?:\.\d+)?)/i, confidence: "high" },
      // Version dans la query string : « jquery.min.js?ver=3.7.1 ». Convention
      // WordPress, fiable en pratique pour jQuery — mais `?ver=` peut porter la
      // version du site, d'où la confiance dégradée SUR LA VERSION seulement.
      {
        on: "asset",
        match: /jquery[^/?]*\.js/i,
        version: /[?&]ver=(\d+\.\d+(?:\.\d+)?)/i,
        confidence: "high",
        versionConfidence: "medium",
      },
      { on: "html", match: /jQuery v?\d+\.\d+/i, version: /jQuery v?(\d+\.\d+(?:\.\d+)?)/i, confidence: "high" },
    ],
  },
  {
    slug: "bootstrap",
    label: "Bootstrap",
    type: "js_library",
    ecosystem: "npm",
    signals: [
      { on: "asset", match: /bootstrap[.\-@]?[\d.]*(?:\.min)?\.(?:js|css)/i, version: /bootstrap[.\-@/]?v?(\d+\.\d+(?:\.\d+)?)/i, confidence: "medium" },
    ],
  },

  // ── Mesure d'audience ─────────────────────────────────────────────────────
  {
    slug: "google-analytics",
    label: "Google Analytics",
    type: "analytics",
    ecosystem: null,
    signals: [
      { on: "html", match: /googletagmanager\.com\/gtag\/js|gtag\(/i, confidence: "high" },
    ],
  },
  {
    slug: "google-tag-manager",
    label: "Google Tag Manager",
    type: "analytics",
    ecosystem: null,
    signals: [{ on: "html", match: /googletagmanager\.com\/gtm\.js/i, confidence: "high" }],
  },
  {
    slug: "matomo",
    label: "Matomo",
    type: "analytics",
    ecosystem: null,
    signals: [{ on: "html", match: /matomo\.js|piwik\.js/i, confidence: "high" }],
  },
  {
    slug: "plausible",
    label: "Plausible",
    type: "analytics",
    ecosystem: null,
    signals: [{ on: "html", match: /plausible\.io\/js/i, confidence: "high" }],
  },
  {
    slug: "microsoft-clarity",
    label: "Microsoft Clarity",
    type: "analytics",
    ecosystem: null,
    signals: [{ on: "html", match: /clarity\.ms/i, confidence: "high" }],
  },
];

/** Empreintes indexées par slug — pratique pour les déductions et les tests. */
export const FINGERPRINT_BY_SLUG = new Map(
  FINGERPRINTS.map((print) => [print.slug, print]),
);
