# Refonte visuelle — Plan complet (Blueprint + Digital Serenity)

> Compagnon de `.claude/DESIGN-SYSTEM.md`. **Objectif** : réhabiller **tout** le site dans
> le langage actuel — grille **blueprint** (aspect) + esthétique **Digital Serenity** (épurée,
> lumineuse) — **contenu et i18n 100 % préservés**. Ce plan remplace la version initiale
> (périmée : elle parlait de vermillon, sans Serenity ni bibliothèque de visuels).

## 0. Langage figé (rappel des décisions)

| Sujet | Décision |
|---|---|
| Thème | **Sombre par défaut** + bascule claire (next-themes). Tokens **sémantiques** (`bg-obsidian`/`text-foreground`). |
| Accent | **Primaire indigo `#021373`** (éclairci en sombre) + **secondaire doré/champagne** (lignes néon blanc→doré→champagne). `--accent`/`--accent-2`/`--accent-champagne`/`--accent-deep`. |
| Typo | **Figtree** (titres/UI, souvent `font-light`/`extralight`) · **Inter Tight** (corps) · **Geist Mono** (labels). |
| Grille | **Blueprint** : sections plein cadre, container 1200 à rails `dark-gray`, cellules en filets 1px, séparateurs. Traits **0.5px**, **courbes/cercles/sinusoïdes**, faibles opacités. |
| Hero | **Fiber** (`components/visuals/fiber.tsx`). |
| Élément design retenu | **Les Ondes** (`components/visuals/neon-arcs.tsx`). |
| Galerie générative | `fiber`, `sonar`, `topography`, `waveform` (tech + art). |
| UI Serenity (transverse) | `WordAppear`, `Hairline`, `FloatingParticles`, `MouseGlow`, `CornerFrame`, hero `DigitalSerenity`. |

**Stack** : Next 16 · React 19 · **Tailwind v3** (pas de syntaxe v4) · next-intl · framer-motion 12 ·
recharts 2.15 · shadcn/Radix. **Branche** : `refonte-aspect` (⚠️ **rien n'est commité** — committer pour protéger).

---

## 1. Inventaire des surfaces (30 routes)

**Vitrines / marketing**
`/` (accueil) · `/services` · `/solutions` · `/tarifs` (+ `/tarifs/eligibilite`, `/services/eligibilite`) ·
`/etudes-de-cas` (+ `/[slug]`) · `/avantage-oeth` · `/a-propos` · `/contact`.

**Outils / data-viz**
`/outils` · `/outils/simulateur-agefiph` · `/outils/audit-pwa` · `/audit-site-ia` · `/cahier-des-charges`.

**Ressources / contenu (MDX)**
`/blog` (+ `/[slug]`) · `/articles` (+ `/[slug]` + 2 articles dédiés) ·
`/documentation` (+ `/[category]`, `/[category]/[slug]`, `/playground`, `/mind-map`).

**Légal / divers**
`/mentions-legales` · `/vous-etes` (hors locale, noindex, en dépréciation) · `/demo`, `/demo/metadata-test` (bac à sable — **noindex, à traiter en dernier ou exclure**).

---

## 2. Mapping cible par surface

### Accueil (`HomeClient` → 7 sections)
| Section | Composant | Traitement cible |
|---|---|---|
| § Hero | `hero.tsx` (+`home-client`) | `BlueprintSection` obsidian + backdrop **Fiber** + `WordAppear`/`Hairline`/`MouseGlow`. **Conserver** la promesse i18n + CTA unique. |
| § Réalisation phare | `featured-realisation.tsx` | pattern **dashboard aspect** (grand visuel cadré + 4 colonnes Problème→Résultat→Stack). |
| § Offres (3 stacks) | `home-offres.tsx` | **FeatureGrid** bordée + `SpotlightCard`. |
| § Méthode | `process.tsx` | étapes en filet vertical + `Reveal` (déjà animé) → tokens + `Hairline`. |
| § Avantage TIH | `home-tih-teaser.tsx` | bande pleine, kicker mono + chiffre, accent indigo, `RadialGauge` (éligibilité). |
| § Diagnostic | `home-diagnostic.tsx` | bloc interactif → tokens, **Ondes** en backdrop discret. |
| § CTA final | `home-cta.tsx` | bande obsidian/jet + `AuroraGlow` léger, CTA primaire indigo. |

### Offre : Services / Solutions / Tarifs
`services/ServicesClient`, `ServicesOffers`, `ServicesComparisonTable`, `ServicesFAQ`, `ServicesGuide`,
`AppsSection`, `PricingCards`, `SolutionsPageClient`, `applications-tabs`, `technical-comparaison`,
`details-services`, `strategie-prix`, `pour-qui-section`, `quest-ce-que-headless`, `pourquoi-headless`,
`services-dev`, `decision-helper`.
→ héros `features-hero` ; **pricing** (switch annuel/mensuel) ; **tabs** ; **comparatif** en table hairline ;
**FAQ** accordion (`data-[state=open]:bg-jet`) ; split sections ; backdrops **Ondes**/`SignalPaths`.

### Réalisations / Études de cas
`case-studies/CaseStudiesClient`, `realisations`, `CaseStudyProfileContent`, `CaseStudyCTA`, `HeroMockup`.
→ grille post (cartes bordées + `SpotlightCard`) ; détail = **dashboard** (visuel cadré + stack en sidebar) ;
`HeroMockup`/`AiAuditBannerSVG`/`DataFlowAnimatedSVG` **restylés** aux tokens.

### Avantage OETH/AGEFIPH + Outils (data-viz)
`avantage-oeth/AvantageOethClient`, `outils/{simulateur-agefiph,roi-simulator,tools}`,
`audit/{website-audit-tool,results,category-details,tabs,input,progress}`, `benchmarking/*`,
`tarifs/EligibilityForm`, `cahier-des-charges/*`, `headless-diagnostic`.
→ **charts** `AreaTrend`/`BarBreakdown`/`RadialGauge` (recharts theme-aware) ; jauges ; compteurs `count-up` ;
formulaires stylés DS (cf. §3) ; `headless-diagnostic` en densités d'encre + accent.

### Ressources : Blog / Articles / Documentation (MDX)
`blog/{BlogIndex,BlogCard,BlogLayout}`, `articles/{ArticlesIndex,ArticleCard,ArticleHeader,ArticleLayout,
ArticleSidebar,ArticleKpiCard,ArticleCallout}`, `documentation/*` (~32 : toolbar, TOC, mobile-toc,
sequential-nav, related, reading-progress, bento, mdx-gallery, playground, learning-path, search…).
→ index = blog-header + post-grid ; **gabarit article = prose Serenity** (cf. §3) ; TOC filet gauche accent ;
reading-progress accent indigo ; cartes KPI `ArticleKpiCard` = chiffre indigo + label mono.

### Contact / À propos / Légal
`contact-form`, `MultiSubjectContactForm`, `floating-contact`, `about/AboutClient`, `mentions-legales`.
→ contact = contact-hero + formulaire bordé ; à-propos = about-hero + `WordAppear` + timeline ;
légal = prose simple obsidian.

### Header / Footer — ✅ FAIT (blueprint, i18n intact).

---

## 3. Chantiers transverses (à faire une fois, profitent à tout le site)

1. **UI primitives shadcn** (`components/ui/`) : porter `button` (variante **primary indigo**),
   `card`, `accordion`, `switch`, `tabs`, `input`, `textarea`, `select`, `checkbox`, `radio` aux tokens
   (ebony/charcoal, focus ring indigo). **Une fois fait, ~70 composants UI suivent.**
2. **Dette « bleu legacy »** : ~40+ composants utilisent `text-mediumblue`/`bg-darkblue`/`text-regularblue`…
   en dur (la section *LIGHT MODE OVERRIDES* de `globals.css` ne couvre que le clair). → **sweep** :
   remplacer ces classes par des tokens sémantiques (`text-foreground`/`text-mid-gray`/`bg-jet`/
   `text-accent-primary`). Prioriser les composants des pages migrées.
3. **Prose MDX « Serenity »** : thème de contenu pour `.prose`/`.article-text` sur obsidian
   (corps Inter Tight, titres Figtree light, liens accent indigo, `code`/`pre` en `bg-jet`,
   citations filet accent). Remplace les overrides bleus de `globals.css`.
4. **Formulaires** : champs `bg-jet border-dark-gray`, focus ring indigo, labels mono ; boutons primary.
   Vérifier `react-hook-form`/`zod` (logique inchangée, style only).
5. **Visuels existants à restyler** : `HeroMockup`, `AiAuditBannerSVG`, `DataFlowAnimatedSVG`,
   `logo-loop`, `threads`, `lens` → tokens DS.
6. **Bibliothèque** : `components/visuals/*` + `components/aspect/*` déjà prêts — **réutiliser, ne pas dupliquer**.

---

## 3bis. Micro-animations & micro-interactions (couche transverse)

> Exigence du brief : « micro-animations et micro-interactions discrètes ». Délivrées surtout
> via les **primitives partagées + le CSS global** → c'est une **brique de Phase 2**. Tout est
> sous garde-fou **reduced-motion** (MotionProvider + `@media prefers-reduced-motion` dans `globals.css`).

**Tokens de mouvement** : hover/press/focus **≤180 ms** ease-out · reveals d'entrée **~500 ms**
easing `[0.22,1,0.36,1]` (`once`) · ambient (dérive/comètes/marquee) lent en boucle.

| Interaction | Comportement | Vecteur | Statut |
|---|---|---|---|
| Lien texte | soulignement qui se déploie / passage à l'accent | `.ni-link` + CSS global | existe → généraliser |
| Flèche lien/bouton | nudge `translateX(3px)` au survol | CSS global `.lucide-arrow-right` | ✅ existe |
| Bouton | bg shift + léger scale-down au press | `ui/button` (variants) | à porter |
| **Focus clavier** | anneau **indigo** visible (a11y) | `focus-visible:ring-accent-primary` | à généraliser |
| Carte | halo qui suit le curseur + filet qui s'éclaire | `SpotlightCard` | ✅ existe |
| Section (hero/à-propos) | halo curseur ambiant | `MouseGlow` | ✅ existe |
| Titre / accroche | apparition **mot à mot** + flou | `WordAppear` | ✅ existe |
| Filet / séparateur | tracé `scaleX` | `Hairline` / `SectionRule` | ✅ existe |
| Bloc au scroll | fade + translateY (once) | `Reveal` / `Stagger` | ✅ existe |
| Chiffres clés | comptage progressif | `ui/count-up` | ✅ existe |
| Jauge / score | arc qui se trace (pathLength) | `RadialGauge` | ✅ existe |
| Accordion / Tabs / Drawer / Dropdown | data-state (hauteur/opacité) | Radix + keyframes | à restyler |
| Toggle thème / langue | transition douce | `theme-toggle` / `locale-switcher` | ✅ existe |
| Formulaires | états erreur/succès, focus, bouton « loading » | `ui/*` + `sonner` | à styliser |
| Chargement | skeleton / typewriter | `skeleton`, `typewriter-loading`, `loading-carousel` | ✅ existe |
| Toasts | entrée/sortie | `sonner` | ✅ existe |
| Backdrops ambiants | aurora / comètes / orbites / particules / marquee | `visuals/*` | ✅ existe |

**Famille « lignes animées fines » (l'ADN visuel — discret, épuré, ≤1px)**
| Motif | Composant | Statut |
|---|---|---|
| **Ligne qui fuse / tracer** | `LineStreak` — fins traits parcourus par une lueur qui file | ✅ NEW |
| **Néon fin** | `NeonField` (champ de courbes) + traits néon (gradient blanc→doré→champagne + halo) | ✅ existe |
| **Fiber** | `Fiber` (câbles → hub, impulsions le long des courbes) — *hero retenu* | ✅ existe |
| **Onde** | `NeonArcs` (anneaux qui se propagent) + `SignalPaths` (sinusoïdes) — *forme retenue* | ✅ existe |
| **Comète** (primitive le long d'un chemin) | `animate-dash-flow` + dégradé accent + `drop-shadow` | ✅ existe |
| **Filet qui se trace** | `Hairline` / `SectionRule` | ✅ existe |

> **Règle dure** : traits **0.5–1px**, **faibles opacités**, **lent**, en **backdrop** — jamais au
> premier plan, ni clignotant ni agressif ; toujours coupé en reduced-motion. C'est la signature
> « épurée à lignes fines » du site.

**Règle par surface migrée** : présenter au minimum **hover + focus-visible** sur tous les
interactifs, des **reveals d'entrée** sur les blocs, et au moins un accent de micro-interaction
cohérent — le tout désactivable en reduced-motion. **Discret avant tout** (pas de scale agressif,
pas d'ombre lourde).

---

## 3ter. Charts & data-viz (dynamiques, animés)

> En **complément des outils** (simulateur AGEFIPH, ROI, audit, benchmarking, diagnostic…), chaque
> sortie chiffrée a une **représentation graphique** : theme-aware (tokens), **tracé animé**, et
> surtout **redessinée dynamiquement** quand l'utilisateur change ses entrées (recharts ré-anime à
> chaque changement de données). Épurés, traits fins, reduced-motion-safe.

| Besoin | Composant | Statut |
|---|---|---|
| Tendance / évolution | `AreaTrend` · `Sparkline` (inline KPI) | ✅ / ✅ NEW |
| Répartition / part | `DonutBreakdown` (anneau fin, label central) | ✅ NEW |
| Comparaison (séries, avant/après) | `MultiTrend` (lignes) · `BarBreakdown` (barres) | ✅ NEW / ✅ |
| Score / progression | `RadialGauge` (arc) · `MeterBar` (barre fine) | ✅ / ✅ NEW |
| KPI / chiffre clé | `ui/count-up` (+ `Sparkline`) | ✅ |
| Data-viz artistique | `Waveform` · `Topography` · `Sonar` | ✅ |

Tous dans `components/visuals/charts.tsx` (+ artefacts). **Usage** : alimenter par les sorties des
calculs (**logique métier inchangée**, style/affichage only) ; placer dans des cellules blueprint ou
cartes `SpotlightCard`. Cible : **Phase 6 (Outils)** + partout où un chiffre mérite une courbe
(héro, études de cas, OETH).

---

## 4. Phases séquencées + critères d'acceptation

> Pipeline par surface : `aspect-porter` migre → `aspect-design-reviewer` audite → `next build` + revue
> **deux thèmes** en fin de phase. **Commiter à la fin de chaque phase.**

| Phase | Périmètre | Critère d'acceptation (DoD) |
|---|---|---|
| **0 — Fondations** ✅ | tokens, polices, rayons, navbar, footer, toggle | build vert, header/footer blueprint deux thèmes |
| **1 — Biblio visuels** ✅ | `components/aspect/*`, `components/visuals/*`, Serenity kit, charts | build vert ; tous theme-aware + reduced-motion |
| **2 — Transverses** | §3 (UI shadcn, dette bleu, prose MDX, formulaires) + **§3bis micro-interactions** | aucune classe bleue en dur ; prose obsidian lisible ; formulaires DS ; **hover/focus/reveal cohérents partout**, reduced-motion OK |
| **3 — Accueil** | les 7 sections (§2) | accueil complet deux thèmes, contenu i18n intact, contraste AA |
| **4 — Offre** | Services / Solutions / Tarifs (+ eligibilité) | pricing+tabs+comparatif+FAQ stylés ; redirections conservées |
| **5 — Réalisations** | études de cas index + détail | dashboard + post-grid ; visuels restylés |
| **6 — OETH + Outils** | avantage-oeth, outils, audit, benchmarking, cahier-des-charges | charts recharts + jauges DS ; calculs inchangés |
| **7 — Ressources** | blog, articles, documentation (32 fichiers) | prose Serenity ; TOC/nav/reading-progress DS |
| **8 — Contact/À-propos/Légal** | contact, a-propos, mentions-legales | formulaires + about-hero ; envoi mail OK |
| **9 — QA finale** | tout | build (~119 pages) 0 erreur ; 2 thèmes ; reduced-motion ; i18n fr/en ; contraste ; purge reliquats Suisse/bleu |

---

## 5. Invariants & garde-fous (à ne jamais violer)

- **Contenu & i18n intangibles** : aucune chaîne retirée/réécrite ; `Link` depuis `@/i18n/navigation` ;
  `useTranslations`/`getTranslations` conservés ; SEO/JSON-LD/metadata préservés.
- **Tokens sémantiques only** : pas de couleur en dur (casse la bascule de thème).
- **Tailwind v3** : jamais `@theme inline` (syntaxe v4 d'aspect/docs).
- **Reduced-motion** : `<Reveal>`/MotionProvider + garde-fou CSS ; canvas/SVG → trame statique.
- **Micro-interactions systématiques** (§3bis) : chaque interactif a **hover + focus-visible** (anneau indigo) ; micro-anims **discrètes** (≤180 ms, opacity/transform), jamais agressives.
- **Accent discipliné** : indigo = structure/UI ; doré/champagne = lumière ponctuelle ; jamais en aplat.
- **Pas de churn** : réutiliser primitives/visuels ; pas de refactor opportuniste hors périmètre.
- **Commit par phase** (HEAD = ux-optim, tout est non commité → fragile aux reverts).

---

## 6. Risques / points ouverts

- **Volume** : ~239 composants. La **Phase 2 (transverses)** est le meilleur levier (UI shadcn + dette bleu
  + prose) — elle « débloque » mécaniquement la majorité des pages.
- **Contraste** : indigo éclairci & doré sur sombre — vérifier AA sur petit texte (préférer `foreground`/
  champagne si limite).
- **Data-viz/outils** : logique métier (calculs AGEFIPH/ROI/audit) **ne pas toucher**, style only.
- **MDX** : la prose est le plus gros risque de lisibilité en sombre → traiter tôt (Phase 2).
- **`/demo` & `/vous-etes`** : noindex/dépréciés → traiter en dernier ou exclure du périmètre.
- **Reverts** : committer chaque phase ; sinon un `git checkout` détruit tout.

---

## 7. Réponse à « est-ce totalement planifié ? »

**Oui désormais** : ce document couvre (a) le langage figé, (b) l'inventaire complet des 30 routes,
(c) le **mapping cible par surface**, (d) les **chantiers transverses** qui débloquent le gros du site,
(e) les **phases + critères d'acceptation**, (f) les **invariants** et (g) les **risques**. Reste à
**exécuter** (Phase 2 d'abord, fort effet de levier), surface par surface, en commitant à chaque étape.
