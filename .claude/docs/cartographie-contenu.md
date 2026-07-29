# Cartographie de l'architecture de contenu — next-impact.digital

Date : 2026-07-17 · Repo : `C:\DEV\next-impact-portfolio` · Établi en lecture seule par l'agent cartographe-contenu.

## 0. Constat préalable critique : la branche locale n'est PAS la branche déployée

- Le working tree local est sur `refonte-aspect` (HEAD local `764acdc`, 2026-06-24). **Aucune des 6 rubriques de décision n'existe sur cette branche**, ni sur `master`, `dev`, `offre-v2`, `ux-optim`.
- Le site live (vérifié via WebFetch sur `/documentation` et `/documentation/choisir`) affiche le hub « Quelle techno web ? » avec les 6 rubriques. Ces routes existent uniquement sur la branche distante **`origin/posit-conseil`** (dernier commit `c90c65f` « conseil », 2026-07-13), dont `origin/refonte-aspect` est un ancêtre direct (fast-forward possible).
- Commits propres à `posit-conseil` : `96e39e7 reposiconseil` → `5027b40 evolutiontools` → `090f10b pagespiliers` → `d4d0dea positconseil` → `63556fa page pilier choix techno IA` → `c90c65f conseil`.
- **Risque n° 1 du chantier : tout agent qui travaille sur le checkout local actuel écrase ou ignore la structure hub/rubriques déployée.** L'orchestrateur doit faire basculer le chantier sur `posit-conseil` (ou merger) avant toute modification. Le reste de ce rapport décrit `origin/posit-conseil` (= le live), en signalant les différences avec le checkout local.

## 1. Source des contenus — verdict

**100 % fichiers Markdown/MDX versionnés dans le repo. Aucun WordPress headless, aucune API de contenu, aucune base externe.** Les occurrences de `wp-json`/`graphql` dans le code (`lib/audit/quick-audit.ts`, `components/cms-choice-quiz.tsx`, `lib/data/headless-explainer.ts`, etc.) sont soit du contenu pédagogique, soit l'outil d'audit qui détecte le CMS de sites tiers — pas une source de contenu.

Conclusion explicite :
- **Les rubriques (pages d'arbitrage) vivent dans le code** : données dans `lib/hub-themes.ts` (945 lignes, objet `HubTheme` bilingue par rubrique), rendues par `components/hub/theme-page.tsx` via `components/hub/theme-route.tsx` ; le bloc hub est `components/hub/hub-rubriques.tsx`. (Tout cela sur `posit-conseil` uniquement.)
- **Les articles vivent dans `content/`** :
  - `content/documentation/<categorie>/<slug>.mdx|.md` — chargés par `lib/markdown.ts` (gray-matter ; `.mdx` prioritaire sur `.md` ; 40 fichiers `.md` sont des doublons legacy d'`.mdx`, dédupliqués par le loader).
  - `content/blog/<slug>.mdx` — chargés par `lib/blog.ts` (11 articles FR).
  - `content/en/…` — miroir EN partiel (69 docs + 5 blog), fallback FR automatique avec bannière (`isFallback`).
  - `lib/articles.ts` lit `content/articles/` qui **n'existe pas** → `/articles` ne liste rien via MDX ; les 2 articles AGEFIPH sont des pages React en dur (`app/[locale]/articles/<slug>/page.tsx`).

## 2. Carte des routes (App Router, `app/[locale]/…`, next-intl `as-needed` : FR sans préfixe, EN sous `/en`)

| Route | Type | Source | Notes |
|---|---|---|---|
| `/documentation` | hub statique | `app/[locale]/documentation/page.tsx` + `HubRubriques` | revalidate 86400 ; H1 « Quelle techno web ? » ; couche 2 = catégories « Approfondir » |
| `/documentation/choisir`, `/ia-et-code`, `/reparer`, `/avant-signer`, `/outils-metier`, `/presence` | 6 segments **statiques** (posit-conseil seulement) | `app/[locale]/documentation/<slug>/page.tsx` (3 lignes chacun) → `ThemeRoute` → `lib/hub-themes.ts` | priment sur la route dynamique `[category]` ; revalidate 86400 |
| `/documentation/[category]` | dynamique | `[category]/page.tsx`, `generateStaticParams` = dossiers de `content/documentation/` | 404 si catégorie vide |
| `/documentation/[category]/[slug]` | dynamique, **sans generateStaticParams** (rendu à la demande) | `[category]/[slug]/page.tsx` + `lib/markdown.ts` | metadata via `generatePageMetadata` ; `ArticleJsonLd` (+`TechArticle` si wordpress-headless) + `BreadcrumbJsonLd` + `FAQJsonLd` si frontmatter `faq` (posit-conseil) |
| `/documentation/mind-map`, `/documentation/playground` | pages annexes | — | à vérifier : indexables, hors sitemap |
| `/blog`, `/blog/[slug]` | listing + article | `lib/blog.ts`, `generateStaticParams` (posit-conseil) | `ArticleJsonLd` + breadcrumb, pas de FAQPage |
| `/articles` + 2 pages AGEFIPH en dur | statique | — | contenus TIH/AGEFIPH |
| `/wordpress-headless` | page pilier | `app/[locale]/wordpress-headless/page.tsx` | priorité 0.95 dans le sitemap |
| `/outils/boussole`, `/outils/decrypteur-devis`, `/outils/nocode-saas-surmesure`, `/outils/prototype-ia`, `/outils/reparer-ou-refaire` | outils (posit-conseil seulement) | `components/outils/*.tsx` | **absents du sitemap** |
| `/conseil` | page offre conseil | `lib/visio-conseil.ts` | **absente du sitemap** (à vérifier si volontaire) |

Pas de pagination nulle part (listes complètes). Pas de routes tags. API interne : `app/api/documentation-articles/route.ts` (JSON slug/title/description/category, usage interne).

## 3. Les 6 rubriques de décision (branche `posit-conseil`, données `lib/hub-themes.ts`)

| Slug | Titre nav (`messages/fr.json` nav) | Meta title (hub-themes) | № |
|---|---|---|---|
| `choisir` | Choisir sa techno | « Quelle techno pour mon site web ? WordPress, Headless, no-code ou sur-mesure » | 01 |
| `ia-et-code` | IA & code | « IA et site web : prototype jetable ou produit maintenable ? » | 02 |
| `reparer` | Réparer ou refaire | « Réparer ou refaire mon site WordPress ? » | 03 |
| `avant-signer` | Avant de signer | « Comment lire un devis de site web avant de signer ? » | 04 |
| `outils-metier` | Outils métier | « Annuaire, carte, espace membre : plugin, SaaS ou plateforme sur mesure ? » | 05 |
| `presence` | Présence et audience | « Site, newsletter ou LinkedIn : où construire son audience ? » | 06 |

Gabarit commun (`ThemePage`) : question (H1) → voies possibles → conseil minimal → « À lire » (optionnel) → outils gratuits → prestas par température (froid/tiède/chaud). Les 6 rubriques sont dans le header (`components/header.tsx`, `HUB_RUBRIQUES`) + « Toutes les ressources » → `/documentation`. Une seule rubrique a du contenu MDX rattaché : `choisir` (`content/documentation/choisir/quelle-techno-ia.md`, 2026-07-12, le seul article du site avec `faq` structuré en frontmatter → `FAQPage` JSON-LD).

## 4. Inventaire des articles

Comptes (FR, dédupliqués .md/.mdx) : **71 articles documentation** (posit-conseil ; 70 sur refonte-aspect) + **11 articles blog** + 2 pages AGEFIPH = 84 contenus. Champs non déterminables partout : date de mise à jour (aucun frontmatter `updated` ; le sitemap utilise le mtime fichier), liens internes sortants (inline dans le corps, non inventoriés un à un).

### 4.1 Stock « Headless » (~35 contenus, cible d'élagage vague 5)

`content/documentation/wordpress-headless/` — 26 articles (tous mdx ; « En bref » ≈ TL;DR détecté sur la quasi-totalité ; FAQ textuelle non balisée sur quelques-uns) :

| Slug | Titre | Date | Ordre |
|---|---|---|---|
| comprendre-le-headless | Comprendre le headless | 2025-03-20 | 1 |
| pourquoi-le-headless | Pourquoi le headless | 2025-03-15 | 2 |
| comment-fonctionne-le-headless | Comment fonctionne le headless | 2025-03-20 | 3 |
| dois-je-passer-au-headless | Dois-je passer au headless ? | 2025-03-15 | 4 |
| quand-utiliser-wordpress-headless | Quand utiliser WordPress headless ? | 2025-03-15 | 5 |
| wordpress-headless-en-pratique | WordPress headless en pratique | 2025-03-20 | 6 |
| api-rest-wordpress | L'API REST WordPress | 2025-05-15 | 7 |
| wpgraphql | WPGraphQL : requêter WordPress avec GraphQL | 2025-05-15 | 8 |
| custom-post-types-et-acf | Custom Post Types et ACF en mode headless | 2025-05-15 | 9 |
| les-technos-frontend | Qu'est ce que le frontend ? | 2025-03-15 | 10 |
| nextjs-pour-wordpress-headless | Next.js pour WordPress headless | 2025-05-15 | 11 |
| rendu-nextjs-ssg-ssr-isr | SSG, SSR et ISR avec Next.js | 2025-05-15 | 12 |
| gestion-des-medias-headless | Gestion des médias et optimisation d'images | 2025-05-15 | 13 |
| gerer-le-contenu | Gérer le contenu simplement en mode headless | 2025-03-15 | 14 |
| preview-et-workflow-editorial | Prévisualisation et workflow éditorial | 2025-05-15 | 15 |
| authentification-jwt-headless | Authentification et gestion des sessions | 2025-05-15 | 16 |
| securite-wordpress-headless | Sécuriser un WordPress headless | 2025-05-15 | 17 |
| performance-et-core-web-vitals | Performance et Core Web Vitals en headless | 2025-05-15 | 18 |
| seo-pour-architecture-headless | SEO technique pour architecture headless | 2025-05-15 | 19 |
| herbergement-et-mise-en-ligne | Hébergement et mise en ligne - La méthode | 2025-03-15 | 20 |
| deploiement-vercel-nextjs | Déployer un site headless avec Vercel et Next.js | 2025-05-15 | 21 |
| migration-monolithique-vers-headless | Migrer d'un WordPress classique vers le headless | 2025-05-15 | 22 |
| comment-creer-un-headless | Comment créer un site WordPress headless ? | 2025-03-15 | 23 |
| woocommerce-headless | WooCommerce en mode headless | 2025-05-15 | 24 |
| internationalisation-headless | Multilingue et internationalisation en headless | 2025-05-15 | 25 |

(+ `content/documentation/blog/passage-wp-headless.mdx`, « Passer de Wordress à WordPress Headless ? », 2025-06-19 — catégorie « blog » orpheline d'un seul article, en collision sémantique avec le blog racine.)

À quoi s'ajoutent 9 des 11 billets `content/blog/` tagués WordPress Headless — le total headless réel ≈ 35, cohérent avec « 35 → ~15 » du contexte :

| Slug blog | Titre | Date | Tags | FAQ |
|---|---|---|---|---|
| wordpress-headless-vs-classique-2026 | WordPress Headless vs classique : comparatif complet 2026 | 2026-04-14 | WP Headless, Performance, TCO, Décision | — |
| map-wordpress-sortir-google-map-headless | Map sur WordPress : sortir de Google Maps | 2026-05-28 | WordPress, Headless, Cartographie, Next.js | — |
| app-mobile-pwa-site-classique-stores | App mobile : faut-il vraiment passer par les stores ? | 2026-06-01 | PWA, App mobile, WordPress, Décision techno | — |
| administrer-jeux-interactifs-wordpress-headless | Administrer des jeux interactifs depuis WordPress… | 2026-06-09 | WP Headless, Jeux, Next.js, Plugin | texte |
| quelle-techno-media-en-ligne-2026 | Quelle techno pour un média en ligne en 2026 ? | 2026-06-09 | Média, WP Headless, Performance, SEO | — |
| pwa-application-sante-stores-peer-to-peer | PWA plutôt qu'application native… | 2026-06-12 | PWA, App mobile, Santé, Décision techno | — |
| refaire-wordpress-sans-destabiliser-equipe | Refaire son WordPress sans déstabiliser l'équipe | 2026-06-22 | WP Headless, Refonte, Équipe édito, Autonomie | — |
| combien-coute-wordpress-headless-2026-chiffre | Combien coûte un WordPress headless en 2026 | 2026-06-24 | WP Headless, Tarifs, TCO, Budget | — |
| migrer-wordpress-vers-headless-sans-casser-seo | Migrer un WordPress vers headless sans casser le SEO | 2026-06-24 | WP Headless, SEO, Migration, Checklist | texte |
| wordpress-headless-en-2026-ce-qui-a-change | WordPress headless en 2026 : ce qui a changé | 2026-06-24 | WP Headless, Next.js, État des lieux, WPGraphQL | texte |
| wordpress-headless-vs-astro-nuxt-sveltekit | WP headless vs Astro, Nuxt, SvelteKit | 2026-06-24 | WP Headless, Astro, Nuxt, SvelteKit, Comparatif | — |

### 4.2 Catégorie SEO (à absorber par la nouvelle rubrique)

`content/documentation/seo/` — 5 articles : `definir-l-arborescence` (Comment définir l'arborescence, 2025-03-15), `mots-cles-et-cocon-semantique` (2025-03-15), `outils-seo` (Comparatif SEO 2025 - SemRush vs SE Ranking vs Ubersuggest, 2025-07-15), `penser-seo-en-amont` (2025-03-15), `planifier-seo-en-amont` (2025-03-15). + `wordpress-headless/seo-pour-architecture-headless` et le blog `migrer-wordpress-vers-headless-sans-casser-seo` touchent aussi le SEO. **Aucun contenu GEO/AEO/AI Overviews existant** hors du nouvel article `choisir/quelle-techno-ia` (qui introduit le GEO dans sa FAQ) — le cluster C est un terrain vierge.

### 4.3 Autres catégories

- `applications-web-mobile` — 14 mdx (dont `index.mdx`), tous du 2026-05-14 : quest-ce-quune-web-app, site-ou-web-app-comment-choisir, quand-wordpress-nest-plus-le-bon-outil, anatomie-dune-web-app, pwa-vs-application-native, ladmin-autonome…, combien-coute-une-web-app-sur-mesure, delai-et-jalons…, marketplace-et-annuaire-b2b, plateforme-metier-vs-saas, installable-sans-store…, comptes-utilisateurs-et-securite, migrer-dun-saas…
- `design-ui-ux` — 10 (2025-03-15) : ui, ux, definir-son-ui, definir-son-ux, identite-visuelle, creer-son-identite-visuelle, charte-graphique, creer-une-charte-graphique, pourquoi-des-maquettes, comment-creer-des-maquettes.
- `marketing-digital` — 6 (2025-03-15) : strategie-marketing, definir-sa-strategie-marketing, strategie-de-marque, mettre-en-oeuvre-strategie-de-marque, presence-sur-les-reseaux-sociaux, definir-sa-strategie-de-medias-sociaux.
- `projet-site-web` — 4 (2025-03-15) : cahier-des-charges, creer-site-web-6-etapes, gestion-projet-web-guide-pratique, pourquoi-gerer-projet-web.
- `wordpress` — 4 (2025-03-20) : pourquoi-utiliser-wordpress, bonnes-pratiques-wordpress, les-plugins, les-themes.

## 5. Taxonomies

- **Catégories = dossiers de `content/documentation/`** ; libellés en dur à 4 endroits (à synchroniser lors de toute évolution) : `app/[locale]/documentation/page.tsx` (`documentationCategories`), `[category]/page.tsx` (`categoryInfo`), `[category]/[slug]/page.tsx` (`categoryLabels` + `RELATED_CATEGORIES`), `components/documentation/cross-category-nav.tsx` (`ALL_CATEGORIES_FR/EN` — 6 catégories, **sans** `applications-web-mobile` ni `blog` ni `choisir`).
- **Navigation** : sur `posit-conseil`, le header n'expose plus que les 6 rubriques + « Toutes les ressources » ; les catégories n'apparaissent que dans la couche « Approfondir » du hub (`AllCategoriesGrid`), les pages catégorie et le cross-linking d'articles. La rétrogradation « catégories → filtres/tags » de la vague 1 est donc **déjà à moitié faite** : retirées de la nav principale, mais toujours des pages d'atterrissage à part entière (URLs `/documentation/<categorie>` dans le sitemap, priorité 0.7).
- **Tags blog** : frontmatter `tags` affichés, non cliquables, pas de pages tag.

## 6. Redirections (`next.config.mjs`, version `posit-conseil`)

301 : `/tarifs` et `/tarifs/eligibilite` → `/solutions-web(/eligibilite)` ; `/services(/eligibilite)` et `/en/services(...)` → `/solutions-web(...)` ; `/solutions` → `/solutions-web` ; `/audit` → `/outils` ; `/articles/wordpress-headless-impact-social-pme-engagees` → `/solutions-web` ; `/documentation/headless-cms/:path*` → `/documentation/wordpress-headless/:path*` (FR+EN) ; `/audit-site-ia` → `/audit-site-web` (FR+EN) ; `/depannage-wordpress` → `/contact` (FR+EN). 307 : 4 outils désactivés (`benchmarking`, `estimateur-budget`, `simulateur-roi`, `tco-saas-vs-sur-mesure`) → `/`. Pas de `vercel.json` ; middleware = `proxy.ts` (next-intl uniquement). Précédent utile : le renommage `headless-cms → wordpress-headless` montre le pattern à réutiliser pour l'élagage vague 5.

## 7. Infrastructure SEO/GEO

- **Metadata** : centralisées dans `lib/metadata.ts` (`generatePageMetadata` : canonical absolu, hreflang fr/en/x-default, OG/Twitter). **Meta title du hub = `messages/fr.json:243` « Comprendre — WordPress Headless & Next.js »** (+ metaDescription assortie ligne 244), alors que H1/hubTitle = « Quelle techno web ? » — l'incohérence signalée au contexte est confirmée, live inclus.
- **Sitemap** : `app/sitemap.xml/route.ts` (force-dynamic, FR+EN+hreflang, lastmod = mtime). **Manquent : les 5 pages rubriques sans dossier contenu (`ia-et-code`, `reparer`, `avant-signer`, `outils-metier`, `presence`), les 5 nouveaux outils (`boussole`, `decrypteur-devis`, `nocode-saas-surmesure`, `prototype-ia`, `reparer-ou-refaire`), `/conseil`.** `choisir` y figure par effet de bord (dossier contenu existant). Scorie : `documentation/applications-web-mobile/index` émis comme URL doublon de la page catégorie.
- **robots.txt** : `app/robots.txt/route.ts` — GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, etc. tous autorisés. Conforme au socle GEO.
- **llms.txt / llms-full.txt** : `app/llms.txt/route.ts` et `app/llms-full.txt/route.ts`, dynamiques, réécrits sur `posit-conseil` avec le positionnement conseil ; listent les articles par catégorie (12 max/catégorie).
- **JSON-LD** (`components/json-ld.tsx`) : Organization/ProfessionalService (+Person liée), Article/TechArticle, BreadcrumbList (toutes les pages doc), FAQPage (`FAQJsonLd`, câblé aux articles via frontmatter `faq` — utilisé par 1 seul article), Service, CollectionPage (hub), Website, WebApplication, VideoObject. Auteur `Person` relié à `Organization` : présent. Pas de `HowTo`.
- **Socle GEO articles — état** : dates de publication visibles mais **pas de date de mise à jour** (ni frontmatter ni affichage) ; TL;DR non systématique (« En bref » sur le stock headless, intro en gras sur `quelle-techno-ia`) ; FAQ balisée sur 1 article/71 ; hiérarchie Hn correcte (TOC générée sur H2/H3).

## 8. Écarts vs structure cible et risques de migration

1. **Branche de travail erronée** (voir §0) — bloquant, à trancher avant toute vague.
2. **Rubrique 7 « Être trouvé à l'heure de l'IA » inexistante** : ni route, ni entrée `HUB_THEMES`, ni contenu cluster C. Créer = 1 entrée dans `lib/hub-themes.ts` + 1 page 3-lignes `app/[locale]/documentation/<slug>/page.tsx` + entrée `HUB_RUBRIQUES` (header) et `hub-rubriques.tsx` + **ajout manuel au sitemap** (les pages thèmes n'y sont pas automatiques — corriger ce trou pour les 5 existantes au passage).
3. **Meta title du hub** à corriger : `messages/fr.json` lignes 243-244 (et pendant EN) — la valeur alimente aussi le `CollectionPageJsonLd` du hub.
4. **Catégories** : plus dans la nav principale (fait) mais toujours pages indexées + 4 listes en dur à synchroniser ; le `CollectionPageJsonLd` du hub liste encore les 7 catégories (dont « Blog ») et pas les rubriques.
5. **Doublons potentiels avec les clusters** :
   - F1 (combien coûte un site 2026) vs `blog/combien-coute-wordpress-headless-2026-chiffre` et `applications-web-mobile/combien-coute-une-web-app-sur-mesure` — chevauchement partiel, angles différents ; consolider plutôt que créer à côté.
   - A0/A4 vs `choisir/quelle-techno-ia` (déjà en ligne, couvre build/AI-build/buy + critères + GEO en FAQ) — **l'intention « site IA vs pro » est partiellement prise** ; C0 devra s'articuler avec sa section GEO.
   - A5/A2 vs `/outils/prototype-ia` (outil, pas article) ; A7 vs `/outils/reparer-ou-refaire`.
   - E-cluster vs les 14 articles `applications-web-mobile` (chatbot/RAG absents, mais no-code/SaaS/sur-mesure déjà traité par `plateforme-metier-vs-saas` et l'outil `nocode-saas-surmesure`).
   - C3 (données structurées) vs `wordpress-headless/seo-pour-architecture-headless` — chevauchement à vérifier au contenu.
6. **Cas de redirection ambigus (vague 5)** : les 26 slugs `wordpress-headless/*` sont profonds (`/documentation/wordpress-headless/<slug>`) ; en cas de consolidation 35→15, chaque suppression exige un 301 dans `next.config.mjs` (pattern existant §6). La catégorie doc `blog` (1 article) devrait être fusionnée/redirigée vers `/blog`. `applications-web-mobile/index` fait doublon d'URL. `/documentation/[category]/[slug]` n'a pas de `generateStaticParams` : une URL supprimée rendra une erreur runtime (readFileSync) plutôt qu'un 404 propre — à vérifier/durcir avant l'élagage.
7. **Tarifs conseil — occurrences exactes (branche `posit-conseil` = live)** : le site affiche partout 150 €/490 € ; **aucune occurrence réelle de 180 €/390 €** (seul un commentaire d'exemple `lib/hub-themes.ts:58` mentionne « 180 € »). Occurrences 150/490 : `lib/hub-themes.ts:98,107,624` · `lib/visio-conseil.ts:45,82` · `components/hub/hub-rubriques.tsx:73,131,166` · `components/outils/boussole.tsx:84,448` · `components/outils/decrypteur-devis.tsx:445` · `components/outils/nocode-saas-surmesure.tsx:44` · `components/outils/prototype-ia.tsx:232` · `components/outils/reparer-ou-refaire.tsx:234,238` · `app/llms-full.txt/route.ts:123-124` · `content/documentation/choisir/quelle-techno-ia.md:129` (« 150 € HT… crédités sous 30 jours »). Attention : le `lib/visio-conseil.ts` du checkout local (`refonte-aspect`) affiche d'autres montants (100/90/120/220 €, lignes 62,101,107,113) — confirme que le local est obsolète. Conformément au contexte : ne rien propager avant arbitrage d'Agathe.
8. **Divers** : `/conseil` hors sitemap ; frontmatter sans champ `updated` (le socle GEO exige la date de mise à jour visible) ; 40 fichiers `.md` doublons à purger un jour (inertes mais bruit) ; contenu EN à 95 % ; `content/documentation/choisir/quelle-techno-ia.md` est en `.md` (seul le loader `.mdx`-first le sert correctement — OK mais incohérent avec le reste).

## Fichiers pivots

`lib/markdown.ts`, `lib/blog.ts`, `lib/metadata.ts`, `components/json-ld.tsx`, `app/[locale]/documentation/page.tsx`, `app/[locale]/documentation/[category]/[slug]/page.tsx`, `app/sitemap.xml/route.ts`, `app/robots.txt/route.ts`, `app/llms.txt/route.ts`, `next.config.mjs`, `messages/fr.json` ; et sur `origin/posit-conseil` : `lib/hub-themes.ts`, `components/hub/{hub-rubriques,theme-page,theme-route}.tsx`, `content/documentation/choisir/quelle-techno-ia.md`.
