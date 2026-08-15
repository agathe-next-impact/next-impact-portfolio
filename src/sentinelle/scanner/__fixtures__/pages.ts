import type { RawResponse } from "../evidence";

// Trois pages de référence, comme demandé par specs/scanner.md, plus quelques
// cas non-WordPress : la veille doit être agnostique, les fixtures aussi.

function page(overrides: Partial<RawResponse>): RawResponse {
  return {
    url: "https://exemple.fr",
    finalUrl: "https://exemple.fr/",
    status: 200,
    headers: {},
    setCookies: [],
    html: "",
    ...overrides,
  };
}

/** WordPress typique : generator bavard, plugins et thème visibles, jQuery ancien. */
export const WORDPRESS_TYPIQUE = page({
  headers: {
    server: "Apache/2.4.57",
    "x-powered-by": "PHP/8.1.27",
    link: '<https://exemple.fr/wp-json/>; rel="https://api.w.org/"',
  },
  setCookies: ["wordpress_test_cookie=WP+Cookie+check; path=/"],
  html: `<!DOCTYPE html><html lang="fr"><head>
<meta name="generator" content="WordPress 6.4.3" />
<link rel="stylesheet" href="https://exemple.fr/wp-content/themes/astra/style.css?ver=4.6.2" />
<link rel="stylesheet" href="https://exemple.fr/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.9.3" />
<link rel="stylesheet" href="https://exemple.fr/wp-content/plugins/woocommerce/assets/css/woocommerce.css?ver=8.6.1" />
</head><body>
<script src="https://exemple.fr/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"></script>
<script src="https://exemple.fr/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.19.4"></script>
</body></html>`,
});

/** WordPress durci : generator retiré, versions masquées, derrière Cloudflare. */
export const WORDPRESS_DURCI = page({
  url: "https://durci.fr",
  finalUrl: "https://durci.fr/",
  headers: {
    server: "cloudflare",
    "cf-ray": "8a1b2c3d4e5f6789-CDG",
  },
  html: `<!DOCTYPE html><html lang="fr"><head>
<link rel="stylesheet" href="/wp-content/themes/maison/style.css" />
</head><body>
<script src="/wp-content/plugins/wordfence/js/admin.js"></script>
</body></html>`,
});

/** Site Next.js sur Vercel : ni CMS, ni PHP. */
export const SITE_NEXTJS = page({
  url: "https://studio.dev",
  finalUrl: "https://studio.dev/",
  headers: {
    server: "Vercel",
    "x-vercel-id": "cdg1::abcde-1234567890",
    "x-nextjs-cache": "HIT",
  },
  html: `<!DOCTYPE html><html lang="fr"><head>
<link rel="preload" href="/_next/static/css/abc123.css" as="style" />
</head><body>
<div id="__next"></div>
<script src="/_next/static/chunks/main-abc123.js"></script>
<script id="__NEXT_DATA__" type="application/json">{"props":{}}</script>
</body></html>`,
});

/** Drupal derrière nginx — vérifie qu'on ne suppose pas WordPress. */
export const SITE_DRUPAL = page({
  url: "https://collectivite.fr",
  finalUrl: "https://collectivite.fr/",
  headers: {
    server: "nginx/1.24.0",
    "x-generator": "Drupal 10 (https://www.drupal.org)",
    "x-powered-by": "PHP/8.2.15",
  },
  html: `<!DOCTYPE html><html lang="fr"><head>
<meta name="Generator" content="Drupal 10 (https://www.drupal.org)" />
</head><body>
<script src="/sites/default/files/js/js_abc.js"></script>
<script type="application/json" data-drupal-selector="drupal-settings-json">{}</script>
</body></html>`,
});

/** Boutique Shopify : plateforme SaaS, rien à mettre à jour côté client. */
export const SITE_SHOPIFY = page({
  url: "https://boutique.fr",
  finalUrl: "https://boutique.fr/",
  headers: {
    "x-shopid": "12345678",
    "x-shopify-stage": "production",
  },
  html: `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="https://cdn.shopify.com/s/files/1/theme.css" />
</head><body></body></html>`,
});

/** Page inexploitable : ni HTML, ni en-têtes parlants. */
export const SITE_MUET = page({
  url: "https://muet.fr",
  finalUrl: "https://muet.fr/",
  headers: {},
  html: "<!DOCTYPE html><html><head><title>Bienvenue</title></head><body><p>Bonjour</p></body></html>",
});
