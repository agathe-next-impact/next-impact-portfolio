# Verdicts vague 1 — audit anti-cannibalisation (mode 1)

Rendu par verificateur-coherence le 2026-07-17. Branche : `posit-conseil`.
À respecter par redacteur-seo-geo pour la page de rubrique, C1 et C2.

Vérifications : mapping du contexte, inventaire (cartographie §4.2 et §8.5),
lecture intégrale de `content/documentation/choisir/quelle-techno-ia.md`,
frontmatter + intro des 5 articles `content/documentation/seo/`, grep
GEO/ChatGPT/Perplexity/AI Overviews/AEO/llms.txt sur tout `content/`, lecture
des sections IA de `blog/wordpress-headless-en-2026-ce-qui-a-change.mdx` et
`blog/wordpress-headless-vs-classique-2026.mdx`, recherche live
`site:next-impact.digital`. **Non vérifié : Search Console** (aucun export).

## Instruction des points de friction

1. **`choisir/quelle-techno-ia.md`** — simple mention, pas de chevauchement
   bloquant. Le GEO y apparaît comme *critère de choix de techno* : 1 question
   de FAQ (l.13-14 et 115-117) et 1 sous-section « SEO + GEO » de ~6 lignes
   (l.87-89). L'intention servie est « quelle techno choisir », pas « comment
   être visible dans les IA ».
2. **Les 5 articles `content/documentation/seo/`** — zéro chevauchement avec
   C1/C2. Fondamentaux SEO classique. Cibles de maillage « Approfondir », pas
   des concurrents.
3. **`blog/migrer-wordpress-vers-headless-sans-casser-seo`** — 1 seule mention
   IA (l.59, GPTBot dans robots.txt). Pas de chevauchement.
4. **`wordpress-headless/seo-pour-architecture-headless`** — SEO technique du
   headless, aucune mention IA. Chevauchement futur possible avec **C3**
   (vague 3), pas avec C1/C2.
5. **Cas limite : `blog/wordpress-headless-en-2026-ce-qui-a-change.mdx`**,
   section « AI search : le critère de tri a changé » (l.52-62) — observations
   chiffrées sur le tri par les bots IA (TTFB < 800 ms, pages schema.org citées
   4-7× plus). Adjacent à C1, non cannibalisant, mais **C1 doit le mailler et
   ne pas recopier ses chiffres tels quels**.
6. Le cluster C est un terrain vierge (grep + recherche live concordants).

## 1. Page de rubrique `/documentation/etre-trouve` — verdict : CRÉER

- **Intention exacte** : arbitrage — « mon site doit-il faire du SEO, du GEO,
  les deux ? par où commencer pour être visible dans ChatGPT/Perplexity/AI
  Overviews ? »
- **Requêtes cibles** : « être visible dans ChatGPT », « référencement IA »,
  « SEO ou GEO », « comment apparaître dans les réponses des IA »,
  « AI Overviews site web ».
- **Maillage** : C1 et C2 (« À lire »), les 5 articles `seo/` en couche
  « Approfondir », `choisir/quelle-techno-ia`, le diagnostic visibilité IA
  (**seulement s'il est en ligne à la publication**, sinon `/outils`),
  `/conseil` (150 €/490 € — statu quo acté).
- **Contraintes** :
  - Respecter le gabarit `ThemePage` : page d'arbitrage, **pas un article**.
  - Définitions courtes SEO/GEO/AEO possibles, mais alors **C0 devient
    probablement redondant** — réévaluer C0 avant sa création (verdict mode 1
    obligatoire). Ne pas écrire les deux.
  - Ne pas re-arbitrer les technos (pris par `quelle-techno-ia`) : lier.

## 2. C1 « Comment ChatGPT et Perplexity choisissent leurs citations » — verdict : CRÉER

- **Intention exacte** : informationnelle — « pourquoi/comment mon site est-il
  (ou non) cité par ChatGPT, Perplexity, Gemini ; quels critères font qu'une
  page est reprise dans une réponse IA ».
- **Requêtes cibles** : « comment ChatGPT choisit ses sources », « être cité
  par ChatGPT », « comment Perplexity choisit ses citations », « pourquoi mon
  site n'apparaît pas dans ChatGPT », « sources ChatGPT Search ».
- **Maillage** : rubrique `etre-trouve` (parent), C2 (« et maintenant, que
  faire »), `blog/wordpress-headless-en-2026-ce-qui-a-change` (observations
  terrain), diagnostic visibilité IA ou `/outils`, `/conseil`.
- **Contraintes — ne PAS couvrir** : le plan d'action pratique (C2) ;
  l'implémentation des données structurées (C3) ; le how-to
  llms.txt/robots.txt/crawlers (C4 — une phrase max) ; AI Overviews (C5) ;
  « le SEO est-il mort » (C6) ; la mesure de visibilité (C8). Rester sur la
  **mécanique** : crawl → sélection → citation, critères observables, chiffres
  sourcés. Stats internes du billet headless-2026 par lien, pas par duplication.

## 3. C2 « Guide GEO pour PME » — verdict : CRÉER

- **Intention exacte** : informationnelle-transactionnelle — « qu'est-ce que le
  GEO concrètement et comment une PME l'applique-t-elle, avec quels moyens et
  quelles priorités ».
- **Requêtes cibles** : « GEO PME », « Generative Engine Optimization guide
  français », « optimiser son site pour les IA », « référencement génératif »,
  « GEO SEO différence » (secondaire, partagée avec la rubrique — la rubrique
  arbitre, le guide exécute).
- **Maillage** : rubrique `etre-trouve` (parent), C1 (prérequis),
  `seo/mots-cles-et-cocon-semantique` et `seo/definir-l-arborescence`,
  `choisir/quelle-techno-ia`, diagnostic visibilité IA ou `/outils`, `/conseil`.
- **Contraintes (les plus strictes — un « guide » aspire tout par défaut)** :
  - **Ne pas couvrir en profondeur** : mécanique des citations (2-3 phrases +
    lien C1) ; méthode « structurer une page citable » (C7 — principes ici,
    méthode HowTo là-bas) ; données structurées en détail (C3) ;
    llms.txt/crawlers (C4) ; mesure (C8) ; rédiger avec l'IA (D1) ; E-E-A-T
    approfondi (D2).
  - **Ne pas refaire** les fondamentaux SEO : lier les 5 articles `seo/`.
  - Verdicts par profil obligatoires : « PME vitrine 10 pages / PME lead-gen /
    e-commerce ».

## Synthèse

3 × CRÉER. Aucune cannibalisation avec l'existant. Risque réel : interne
(C1/C2/rubrique se marchant dessus) et prospectif (C0 vs page de rubrique ;
C3 vs `seo-pour-architecture-headless` en vague 3) — neutralisé si les
contraintes ci-dessus sont respectées. Réserve : croisement Search Console non
effectué.
