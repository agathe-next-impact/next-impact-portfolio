# Plan de fusion — stock Headless (vague 5, phase 1)

Établi le 2026-07-18 par architecte-fusion sur `posit-conseil` (HEAD `cca2056`),
en lecture seule. **Soumis à validation d'Agathe avant toute exécution.**

Correction d'inventaire : 25 articles `.mdx` dans
`content/documentation/wordpress-headless/` (pas 26) ; le 26e contenu est
l'orphelin `content/documentation/blog/passage-wp-headless.mdx`. + 10 `.md`
doublons inertes dans le dossier. Périmètre headless total : 25 + 1 + 9 blogs
= 35.

## 1. Tableau maître

| # | Slug | Verdict | Cible / absorbant |
|---|---|---|---|
| 1 | comprendre-le-headless | **GARDER** (màj, absorbant ×3) | — |
| 2 | pourquoi-le-headless | FUSIONNER | → comprendre-le-headless |
| 3 | comment-fonctionne-le-headless | FUSIONNER | → comprendre-le-headless |
| 6 | wordpress-headless-en-pratique | FUSIONNER | → comprendre-le-headless (+ volet workflow → gerer-le-contenu) |
| 4 | dois-je-passer-au-headless | **GARDER** (màj, absorbant ×2, porte `<HeadlessDiagnostic />`) | — |
| 5 | quand-utiliser-wordpress-headless | FUSIONNER | → dois-je-passer-au-headless |
| — | blog/passage-wp-headless (orphelin) | FUSIONNER/SUPPRIMER | → dois-je-passer-au-headless (phase pilote 5 étapes reprise) |
| 7 | api-rest-wordpress | **GARDER** tel quel | — |
| 8 | wpgraphql | **GARDER** tel quel | — |
| 9 | custom-post-types-et-acf | **GARDER** tel quel | — |
| 10 | les-technos-frontend | FUSIONNER (daté : Gatsby) | → nextjs-pour-wordpress-headless |
| 11 | nextjs-pour-wordpress-headless | **GARDER** (màj, absorbant ×2) | — |
| 12 | rendu-nextjs-ssg-ssr-isr | FUSIONNER *(arbitrable)* | → nextjs-pour-wordpress-headless |
| 13 | gestion-des-medias-headless | FUSIONNER *(arbitrable)* | → performance-et-core-web-vitals |
| 14 | gerer-le-contenu | **GARDER** (màj, absorbant) | — |
| 15 | preview-et-workflow-editorial | FUSIONNER | → gerer-le-contenu |
| 16 | authentification-jwt-headless | FUSIONNER | → securite-wordpress-headless |
| 17 | securite-wordpress-headless | **GARDER** (màj, absorbant) | — |
| 18 | performance-et-core-web-vitals | **GARDER** (màj, absorbant) | — |
| 19 | seo-pour-architecture-headless | **GARDER** (màj GEO : renvoi etre-trouve/C3, tag seo) | — |
| 20 | herbergement-et-mise-en-ligne | FUSIONNER (typo slug) | → deploiement-vercel-nextjs |
| 21 | deploiement-vercel-nextjs | **GARDER** (màj, absorbant) | — |
| 22 | migration-monolithique-vers-headless | **GARDER** (màj, renvoi croisé blog migration SEO) | — |
| 23 | comment-creer-un-headless | **GARDER** (màj) | — |
| 24 | woocommerce-headless | **GARDER** tel quel | — |
| 25 | internationalisation-headless | **GARDER** tel quel | — |

**Résultat : 15 articles documentation** (11 URLs redirigées). Avec les 9
blogs 2026 conservés : 35 → 24 contenus headless publiés, dont 15 consolidés
côté documentation.

Variante agressive (déconseillée) si cible « ~15 headless TOUT compris » :
fusionner en plus api-rest + wpgraphql (« API WordPress : REST ou
GraphQL ? ») et comment-creer-un-headless → migration.

## 2. Grappes (résumé)

- **Débutant (1,2,3,6 → 1)** : quatre articles de mars 2025 quasi
  interchangeables → un guide de référence `comprendre-le-headless` (le plus
  lié du site). Reprendre : tableau perf + 3 bénéfices (pourquoi), exemple
  multi-canal + « ce qui ne change pas » (comment-fonctionne), section
  Gutenberg + « selon votre rôle » (en-pratique).
- **Décision (4,5,orphelin → 1)** : `dois-je` porte le diagnostic interactif ;
  absorbe la grille 6 profils (quand-utiliser, en tableau) et la « phase
  pilote en 5 étapes » de l'orphelin. Sa suppression éteint la catégorie doc
  « blog ».
- **Frontend (10,11,12 → 1)** : les-technos daté (Gatsby), doublonné par le
  blog Astro/Nuxt/SvelteKit 2026 ; rendu-ssg-ssr-isr recouvre nextjs — seule
  sa matrice de décision est reprise. Arbitrable : garder rendu → 16 articles.
- **Éditorial (14,15 → 1)** : gerer-le-contenu (angle décideur) absorbe le
  principe Draft Mode + schéma workflow de preview.
- **Sécurité (16,17 → 1)** : authentification-jwt = section « Authentification
  et sessions » de securite.
- **Mise en ligne (20,21 → 1)** : herbergement couvert par deploiement (qui a
  déjà une section hébergement). Reprendre : découpage backend/frontend + CDN.
- **Médias/perf (13,18 → 1, arbitrable)** : next/image + gains mesurables →
  section « Optimiser le LCP » de performance. Garder les deux → 16-17.

## 3. Redirections 301 (format next.config.mjs)

```js
// ── Élagage vague 5 : consolidation du stock WordPress headless ──
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
// Orphelin — règle spécifique AVANT le catch-all /documentation/blog.
{ source: '/documentation/blog/passage-wp-headless',    destination: '/documentation/wordpress-headless/dois-je-passer-au-headless', permanent: true },
{ source: '/en/documentation/blog/passage-wp-headless', destination: '/en/documentation/wordpress-headless/dois-je-passer-au-headless', permanent: true },
// Catégorie doc « blog » supprimée (collision avec le blog racine).
{ source: '/documentation/blog',    destination: '/blog',    permanent: true },
{ source: '/en/documentation/blog', destination: '/en/blog', permanent: true },
```

Chaînes : le catch-all `headless-cms/:path*` fera transiter les très vieilles
URLs par 2 sauts — acceptable, pas de règles directes supplémentaires.

## 4. Blogs 2026 : GARDER les 9, zéro doublon bloquant

- migration doc (guide 6 phases) vs blog migration SEO (checklist 7 étapes) :
  intentions distinctes ; poser renvois croisés + phrase de périmètre.
- dois-je (décision + diagnostic) vs blog comparatif 2026 : distincts.
- blog `combien-coute-wordpress-headless-2026-chiffre` = référence tarifaire
  unique du périmètre (2 250 / 4 000 / 6 500 €).

## 5. Scories incluses dans l'exécution

1. 40 fichiers `.md` doublons (wordpress-headless 10, design-ui-ux 10,
   marketing-digital 6, seo 5, projet-site-web 4, wordpress 4, blog 1) —
   suppression sûre (loader .mdx-first).
2. `applications-web-mobile/index.mdx` : supprimer + 301 `…/index` →
   `/documentation/applications-web-mobile` (vérifier miroir EN).
3. Rich snippets datés : `wordpress/bonnes-pratiques-wordpress.mdx` l.95 +
   l.220 + miroir EN (héritage A3 audit v3).
4. 11 miroirs EN à supprimer (10 fusionnés + orphelin), couverts par les 301
   `/en/...`.
5. Nettoyage code catégorie « blog » : `categoryLabels`/`categoryInfo`/
   `documentationCategories` (3 fichiers app), `cross-category-nav.tsx:107`,
   `documentation-internal-links.tsx:381-385`.

## 6. Références internes à corriger (86 occurrences, 12 fichiers)

- `lib/homepage-profiles.ts` + `-en.ts` : 10 liens vers slugs supprimés.
- `components/mind-map/mind-map.tsx` (FR+EN) : 12 liens.
- `components/documentation/headless-diagnostic.tsx` : 1 (quand-utiliser).
- `app/[locale]/wordpress-headless/page.tsx` (`getSiloLinks`, FR+EN) : 8.
- `components/documentation/category-theme-cards.tsx` : refondre les 5 groupes
  sur les 15 slugs gardés.
- `content/blog/refaire-wordpress-sans-destabiliser-equipe.mdx` :
  comment-fonctionne ×2 → comprendre.
- Sitemap/llms.txt : automatiques (readdir), rien à toucher. Garde 404 de la
  vague 1 en filet.

## 7. Socle GEO des 15 gardés (exécution ultérieure)

- P1 (au moment de la fusion) : les 7 absorbants (dois-je, comprendre,
  nextjs, gerer-le-contenu, securite, performance, deploiement).
- P2 : migration, seo-pour-architecture-headless (+ renvoi GEO), comment-creer.
- P3 : api-rest, wpgraphql, custom-post-types, woocommerce, i18n.

## 8. Points laissés à validation d'Agathe

1. Valider le plan global (15 articles doc, 11 URLs redirigées).
2. Deux fusions arbitrables : rendu-ssg-ssr-isr et gestion-des-medias
   (les garder → 16-17 articles).
3. Cible de comptage : ~15 documentation (recommandé) vs variante agressive.
4. **Tarifs** : harmoniser les chiffres survivants des fusions sur les
   fourchettes du blog 2026 (2 250/4 000/6 500 €) ? L'orphelin publie
   2 000-6 000/3 000-10 000 € et « maintenance +30-50 % » ; le diagnostic de
   dois-je utilise des seuils 2 000/5 000 €.
5. Anti-cannibalisation : verdicts mode 1 légers sur les 7 fusions avant
   rédaction (notamment frontière migration doc/blog).
