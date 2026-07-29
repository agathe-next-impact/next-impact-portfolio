# Verdicts vague 3 — mode 1 (C7, C3, C4)

Rendu par verificateur-coherence le 2026-07-18. Branche `posit-conseil`.
3 × CRÉER. Aucune décision Agathe nécessaire sur le fond. Dossier d'accueil
des trois : `content/documentation/etre-trouve/`.

## Slugs et ordres convenus (orchestrateur)

- C7 : `structurer-une-page-citable-par-les-moteurs-ia` (`order: 3`)
- C3 : `donnees-structurees-moteurs-ia` (`order: 4`)
- C4 : `llms-txt-robots-txt-crawlers-ia` (`order: 5`)

## C7 — « Structurer une page citable par les moteurs IA » : CRÉER

Promis deux fois par C2 (`guide-geo-pme.mdx` l.54). C7 = la méthode pas à pas
(HowTo), C2 = les principes.

- **Intention** : « comment réécrire/structurer concrètement une page pour
  qu'elle soit reprise et citée par ChatGPT, Perplexity, Gemini ; dans quel
  ordre, avec quel format ».
- **Requêtes** : « comment structurer une page pour ChatGPT », « écrire pour
  les moteurs IA », « rendre une page citable par l'IA », « optimiser un
  article pour Perplexity », « format de contenu GEO ».
- **Schema** : Article + **HowTo** — prérequis : composant `HowToJsonLd`
  inexistant dans `components/json-ld.tsx`, à créer (architecte) + câblage
  frontmatter.
- **Maillage** : rubrique parente (+ `reading` hub-themes), C2 (cadre), C1
  (pourquoi, 2-3 phrases + lien), C3 (balisage), checklist GEO (compagnon
  n° 1), `/outils/visibilite-ia`, `/conseil`.
- **Ne pas couvrir** : vs C2 — qui est concerné, budgets/efforts, verdicts
  par profil de C2, autorité externe ; vs C1 — zéro pédagogie
  crawl/sélection/citation/RAG ; vs C3 — le balisage = UNE étape avec lien,
  aucun type de schema détaillé ; vs C4 — une phrase de prérequis accès max ;
  vs C8 — vérification en une phrase. Aucune fourchette de prestation.

## C3 — « Données structurées pour être compris des moteurs IA » : CRÉER

Friction avec `wordpress-headless/seo-pour-architecture-headless` tranchée :
celui-ci = implémentation code Next.js pour développeurs ; C3 = « quels
schemas, lesquels comptent pour les IA, dans quel ordre, par qui » pour
décideurs. Promis par C2 l.58.

- **Intention** : « quelles données structurées installer sur un site de PME,
  lesquelles pèsent réellement pour les moteurs IA, priorités, qui peut le
  faire (plugin, prestataire) ».
- **Requêtes** : « données structurées IA », « schema.org ChatGPT », « JSON-LD
  référencement IA », « quelles données structurées pour mon site »,
  « FAQPage schema utile 2026 ».
- **Contrainte d'honnêteté** : C1/C2 ont publié la position Google « aucun
  balisage spécial requis pour les AI features » (sourcée). C3 tient la ligne :
  balisage = documenté pour la compréhension machine et les résultats enrichis,
  observé comme corrélé aux citations IA (logs internes, par lien) — jamais
  « requis » ni « garanti ».
- **Maillage** : rubrique (+ `reading`), C2 (promesse l.58 → lien réel), C7
  (structure d'abord, balisage ensuite), `seo-pour-architecture-headless`
  (« pour l'implémentation headless Next.js »), blog headless-2026 (par lien),
  checklist GEO, `/outils/visibilite-ia`, `/conseil`.
- **Ne pas couvrir** : aucun code d'implémentation Next.js (generateMetadata,
  sitemap, hreflang, canonical — INTERDIT, lien) ; extraits JSON-LD courts
  admis, tutoriel non ; vs C7 — pas de méthode éditoriale (C3 = balisage de la
  FAQ, pas son écriture) ; vs C4 — ZÉRO llms.txt/robots.txt ; vs C5 réservé —
  AI Overviews une phrase sourcée max.

## C4 — « llms.txt, robots.txt et crawlers IA » : CRÉER

`llms.txt` : zéro occurrence dans tout `content/` — terrain vierge. Les
fragments robots.txt existants (C1, C2, outil) appellent tous cet
approfondissement.

- **Intention** : « faut-il un llms.txt et à quoi sert-il vraiment ; comment
  configurer robots.txt vis-à-vis des robots IA (CDN/pare-feu compris) ; qui
  sont ces crawlers et que fait chacun ».
- **Requêtes** : « llms.txt », « faut-il un llms.txt », « robots.txt GPTBot »,
  « bloquer les robots IA robots.txt », « OAI-SearchBot », « liste des
  crawlers IA 2026 ».
- **Colonne vertébrale** : la distinction actée du site — GPTBot =
  entraînement ; OAI-SearchBot = ChatGPT Search ; bloquer GPTBot n'empêche pas
  d'apparaître dans ChatGPT Search. Trois décisions distinctes : train vs
  search vs user-triggered.
- **Bloquant hérité** : blog `migrer-wordpress-vers-headless-sans-casser-seo`
  l.59 affirmait le contraire — **corrigé par l'orchestrateur le 18/07**.
- **Honnêteté llms.txt** : proposition communautaire, adoption non confirmée
  par Google/OpenAI ; verdict « à faire car 30 minutes, mais n'en attendez pas
  un levier ». Le site peut montrer son propre llms.txt en exemple.
- **Maillage** : rubrique (+ `reading`), C1, C2 (chantier 1), l'outil
  `/outils/visibilite-ia` (question robots), blog migration SEO (corrigé),
  checklist GEO, `/conseil`.
- **Ne pas couvrir** : vs C1 — pas de mécanique crawl/sélection/citation ni
  RAG ; C4 possède la politique d'accès + le tableau élargi des crawlers
  (Anthropic, Google-Extended, Applebot-Extended, CCBot, Meta, Bytespider…) ;
  vs C3 — rien sur les schemas (C4 = qui peut lire ; C3 = ce que les pages
  déclarent) ; vs C2/C7 — rien d'éditorial ; vs C8 — une mention logs + lien.

## Matrice des frontières (à respecter par les 3 rédactions parallèles)

| Sujet | C2 (publié) | C7 | C3 | C4 | C1 (publié) |
|---|---|---|---|---|---|
| Principes « pages en réponses » | Possède (principes) | Possède (méthode, HowTo) | — | — | 1 critère du tableau |
| Hn / TL;DR / FAQ éditoriale | Mention | **Possède** | Balisage seulement | — | — |
| Types de schemas, priorités, qui | Promesse l.58 | 1 étape + lien | **Possède** | — | 1 ligne |
| Implémentation code Next.js | — | — | INTERDIT (lien headless) | — | — |
| Rôles des bots | — | — | — | Tableau élargi + politique | Récit mécanique |
| robots.txt quoi écrire, CDN | 1 phrase | 1 phrase prérequis | INTERDIT | **Possède** | 1 phrase |
| llms.txt | — | — | INTERDIT | **Possède (exclusif)** | — |
| Mécanique crawl→sélection→citation | 3 phrases + lien | 2-3 phrases + lien | — | Lien | Possède |
| Budgets, profils PME | Possède | INTERDIT | Effort indicatif OK | Effort indicatif OK | Verdicts |
| AI Overviews | 1 phrase | — | 1 phrase sourcée max | 1 phrase | H2 court (base C5) |
| Mesure de visibilité | 2 phrases | 1 phrase | — | 1 mention + lien | FAQ |

## Checklist GEO (outil parallèle) — qui pointe vers elle

C7 en premier (compagnon de la méthode, contenu synchronisé), C3, C4, la
rubrique (bloc `tools`), C2 (CTA final l.136). Si non en ligne à la
publication : pointer `/outils`.

## Actions d'exécution

1. ~~Correction blog migration SEO l.59~~ — faite (orchestrateur, 18/07).
2. Architecte : composant `HowToJsonLd` + câblage frontmatter.
3. Architecte : `reading` etre-trouve + retouches C2 (promesses l.54/l.58 →
   liens réels C7/C3, + lien checklist au CTA final ; slug/title de C2
   intouchables).
4. Rappels : `updated` dès publication, sources primaires liées, AGEFIPH
   nulle part, aucune fourchette de prestation.
