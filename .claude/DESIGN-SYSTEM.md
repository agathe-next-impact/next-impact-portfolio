# Next Impact — Design System « Blueprint » (dérivé du template *aspect*)

> **Source de vérité du design.** Ce document remplace le système « Édition Suisse »
> (papier/encre clair) pour la refonte visuelle 2026. Le système Suisse et son
> handoff (`.claude/handoff/`) sont désormais **LEGACY** — conservés pour archive,
> ne plus suivre.
>
> Le template de référence est **aspect** (`docs/src/`) : un template Next.js
> financier/SaaS, sombre, structuré par une **grille en bordures (blueprint)**.
> On en reprend la **typo, les couleurs, les structures de blocs et les
> micro-animations**, en **conservant 100 % du contenu** du portfolio et en
> **gardant un accent de marque** (désormais **indigo `#021373` + doré/champagne**, cf. §1–2 ;
> le vermillon initial est abandonné).
>
> **Direction UI générale « Digital Serenity » (MàJ 2026-06-08).** Au-delà de la grille
> blueprint, l'esthétique du site est **épurée et lumineuse** : typographie **très légère**
> (`font-light`/`extralight`), **apparition mot à mot** (`WordAppear`), **filets fins** à
> dégradé (`Hairline`), **particules flottantes** (`FloatingParticles`), **halo curseur**
> (`MouseGlow`), **cadres d'angle** (`CornerFrame`), traits 0.5px, courbes, faibles opacités.
> Hero de référence reconstitué : `components/heroplainscreen.tsx` (`DigitalSerenity`,
> paramétrable, theme-aware, reduced-motion-safe). Visuels animés tech + art dans
> `components/visuals/` : `fiber` (hero retenu), `neon-arcs` (forme retenue : « ondes »),
> `sonar`/`topography`/`waveform` (galerie générative). Primitives de mise en page dans
> `components/aspect/`. (La route de démo `/aspect-lab` a été supprimée.)

---

## 1. Décisions cadres (validées)

| Sujet | Décision |
|---|---|
| **Thème** | **Sombre par défaut** (obsidian, comme aspect) **+ vraie bascule claire** via `next-themes` (déjà branché, `defaultTheme="dark"`, `themes={['light','dark']}`). Un toggle ☾/☀ doit exister dans la navbar. |
| **Accent** | **Primaire indigo `#021373`** + **secondaire jaune `#F2E57E`** (MàJ 2026-06-08, remplace le vermillon). En **sombre** l'indigo est **éclairci** (`231 64% 64%`) pour rester lisible sur obsidian ; `--accent-deep` garde le `#021373` exact (surfaces, mode clair). Tokens Tailwind : `accent-primary` / `accent-secondary` / `accent-deep`. Alias rétro-compat : `vermilion`/`star` pointent désormais sur l'indigo. |
| **Direction visuelle** | **Épurée** (réf. composant `DigitalSerenity`) : traits **fins** (0.5px), **peu d'angles → courbes / sinusoïdes / cercles**, faibles opacités, typo **légère** (`font-light`/`extralight`), animations lentes et discrètes. Charts adoucis (courbes lisses, barres en pilules). |
| **Typo** | **Figtree** (titres + UI + corps par défaut) · **Inter Tight** (paragraphes de contenu, classe `.font-inter-tight`) · **Geist Mono conservé** (labels techniques `.label-mono`, métadonnées, code). **Instrument Serif abandonné.** |
| **Stack** | Next.js 16 · React 19 · **Tailwind v3** (≠ aspect qui est en v4 : on **porte les tokens dans `tailwind.config.ts`**, pas de `@theme inline`). next-intl · framer-motion 12 · recharts 2.15 · shadcn/Radix. |
| **Contenu** | **Intangible.** Aucune phrase, KPI, étude de cas, article ou label retiré. On réhabille les blocs, on ne réécrit pas. i18n `fr`/`en` préservé. |
| **Périmètre** | Toutes les pages `app/[locale]/`. Migration par phases (cf. `aspect-refonte-plan.md`). |

---

## 2. Tokens couleur

Aspect utilise une astuce : **les mêmes noms de token** changent de valeur entre clair et sombre, et portent un **sens sémantique** (pas une teinte figée) :

- `obsidian` = **fond de page** (sombre en dark, clair en light)
- `foreground` = **texte principal** (clair en dark, encre en light)
- `dark-gray` = **traits de la grille** (bordures du blueprint)
- `jet` = **fond de panneau alternatif** (légèrement décollé du fond)
- `ebony` = **fond de bouton / teinte de carte**
- `charcoal` = **bordure de bouton**
- `mid-gray` = **texte atténué** (muted)
- `overlay-gray` = **cadre d'image** (liseré autour des visuels)

> Conséquence pratique : un bloc écrit `bg-obsidian text-foreground border-dark-gray`
> fonctionne **dans les deux thèmes sans condition**. C'est la base de la bascule claire.

### Valeurs (HSL, format Tailwind `H S% L%`)

```
                     DARK (défaut)              LIGHT (bascule)
--obsidian           0 0% 2%      #050505       0 0% 98%     #FAFAFA
--jet                240 10% 4%   #0A0A0B       240 10% 96%  #F4F4F5
--dark-gray          0 0% 14%     #232323       0 0% 86%     #DBDBDB
--mid-gray           0 0% 51%     #828282       0 0% 49%     #7D7D7D
--overlay-gray       0 0% 20%/.27               0 0% 80%/.27
--ebony              251 14% 15%  #24222D       251 14% 85%  #D8D5E2
--charcoal           0 0% 21%     #363636       0 0% 79%     #C9C9C9
--foreground         0 0% 100%    #FFFFFF       240 10% 4%   #09090B
--background         = obsidian                 = obsidian
```

### Accents indigo + jaune (theme-aware) — MàJ 2026-06-08

```
                     DARK (défaut)              LIGHT
--accent (primaire)  231 64% 64% (éclairci)     231 96% 23%  #021373
--accent-2 (second.) 53 82% 72%  #F2E57E         53 82% 72%   #F2E57E
--accent-deep        231 96% 23% #021373         231 96% 23%  #021373
--accent-soft        accent / 0.14              accent / 0.12
```
Tailwind : `accent-primary`, `accent-secondary`, `accent-deep` (avec `<alpha-value>` →
les modificateurs d'opacité `/xx` marchent). **Rétro-compat** : `--vermilion` et le
token Tailwind `vermilion`/`star` pointent sur l'indigo (les composants existants en
`*-vermilion` adoptent l'accent sans réécriture).

**Discipline d'accent :** l'indigo (primaire) **structure** (CTA, liens, traits actifs) ;
le jaune (secondaire) **ponctue** la lumière (points, comètes, halos, barre mise en avant,
point qui orbite). Ni l'un ni l'autre **en aplat de grande surface**. Le `#021373` exact
brille sur fond clair / en surface ; sur sombre on emploie sa version éclaircie ou le jaune.

### Câblage Tailwind v3 (`tailwind.config.ts`)

Ajouter dans `theme.extend.colors` (en gardant `vermilion`/`action` existants) :

```ts
obsidian:      "hsl(var(--obsidian))",
jet:           "hsl(var(--jet))",
"dark-gray":   "hsl(var(--dark-gray))",
"mid-gray":    "hsl(var(--mid-gray))",
"overlay-gray":"hsl(var(--overlay-gray))",
ebony:         "hsl(var(--ebony))",
charcoal:      "hsl(var(--charcoal))",
star:          "hsl(var(--vermilion))",   // alias : aspect `star` → vermillon
"vermilion-bright": "hsl(var(--vermilion-bright))",
```

Et déclarer les variables dans `app/globals.css` sous `:root` (dark = défaut puisque
`defaultTheme="dark"`) **et** `.light`/`.dark` selon la convention next-themes du repo
(`attribute="class"`). ⚠️ Le repo met la classe sur `<html>` ; vérifier si le défaut
sombre vit sous `:root` ou `.dark` et rester cohérent.

---

## 3. Typographie

| Rôle | Police | Variable | Poids | Notes |
|---|---|---|---|---|
| Titres + UI + corps défaut | **Figtree** | `--font-sans` | 400 / 500 / 700 | Remplace Geist. Charger via `next/font/google`. |
| Paragraphes de contenu | **Inter Tight** | `--font-inter-tight` | 400 / 500 | Classe utilitaire `.font-inter-tight` (utilisée telle quelle dans le markup aspect). |
| Labels techniques, méta, code | **Geist Mono** | `--font-mono` | 300 / 400 / 500 | Conservé. Porte la signature « tech » + `.label-mono` vermillon. |
| ~~Serif~~ | ~~Instrument Serif~~ | `--font-serif` | — | **Abandonné.** Transition : aliaser `--font-serif` → Figtree pour ne rien casser, puis purger `.ni-serif`/`font-serif` composant par composant. |

**Échelle de titres (aspect) — légère et serrée, pas grasse :**

```
h1 hero   text-3xl sm:text-4xl md:text-5xl lg:text-6xl  tracking-tight   (poids 400/500)
h1 page   text-3xl tracking-tight
h2        text-2xl md:text-4xl lg:text-5xl tracking-tight text-balance
h3        text-xl / text-2xl font-medium/semibold
corps     text-base md:text-lg lg:text-xl  text-mid-gray  .font-inter-tight
kicker    .label-mono : Geist Mono, ~11px, uppercase, tracking large, vermillon
```

> Les titres aspect sont **grands, fins, `tracking-tight`**. Ne pas alourdir en `font-bold`
> systématique. Le contraste vient de la taille et de la grille, pas de la graisse.

---

## 4. La signature : la grille « blueprint »

C'est **le** geste visuel d'aspect. Chaque section est une bande pleine largeur dont
le contenu vit dans un **container 1200px encadré de rails verticaux**, et dont les
cellules internes sont séparées par des **traits 1px `dark-gray`**. Les sections
s'enchaînent collées, formant deux rails continus qui descendent toute la page.

**Anatomie d'une section :**

```tsx
<section className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0">
  {/* container = rails verticaux gauche/droite */}
  <div className="container border-l-dark-gray border-r-dark-gray border-l border-r px-0">
    {/* en-tête de section */}
    <div className="border-b-dark-gray border-b px-6 py-12 lg:px-8 lg:py-20">
      <p className="label-mono text-vermilion">№ 01 — Services</p>
      <h2 className="text-foreground text-3xl tracking-tight">Titre</h2>
      <p className="font-inter-tight text-mid-gray">Sous-titre…</p>
    </div>
    {/* corps : cellules séparées par des traits */}
    <div className="grid md:grid-cols-3">
      {items.map((it,i) => (
        <div className="border-b-dark-gray md:border-r-dark-gray border-b md:border-r p-6">…</div>
      ))}
    </div>
  </div>
</section>
```

**Règles de grille :**
- Section : `bg-obsidian px-2.5 lg:px-0` (mini-marge mobile, plein cadre desktop).
- Container : `border-l/r-dark-gray` (les rails). On ajoute `border-t`/`border-b` selon
  l'enchaînement pour ne pas doubler les traits entre deux sections collées.
- Cellules : `border-b-dark-gray` + `md:border-r-dark-gray`, retirer la bordure droite
  de la dernière colonne (`last:border-r-0` ou nth-child).
- **Séparateur** entre blocs : `<AspectSeparator>` = un container vide `h-20` bordé
  (`docs/src/components/sections/aspect-separator.tsx`). Respire + maintient les rails.
- Cadre d'image : `bg-overlay-gray rounded-md p-2 md:p-4` autour d'un visuel
  `rounded-sm overflow-hidden`. **Seuls les visuels/boutons sont arrondis** ; la grille
  reste à angle droit.

**Rayon de bordure :** aspect utilise `rounded-sm`/`rounded-md` (≈4–8px) sur les
**cadres d'image, cartes et boutons** uniquement. Le repo force aujourd'hui tous les
rayons à `0`. → Introduire `sm: .25rem`, `md: .5rem`, `lg: .75rem` dans `borderRadius`
et **auditer** les composants Suisse qui présupposaient `0` (souvent inoffensif car ils
n'utilisent pas `rounded-*`).

---

## 5. Catalogue de blocs aspect → usage portfolio

Sources : `docs/src/components/sections/aspect-*.tsx`. Lire le fichier source **avant**
de migrer la section correspondante (le porter agent le fait).

| Bloc aspect | Pattern | Sections portfolio cibles |
|---|---|---|
| `aspect-hero` | Titre + sous-titre + 2 CTA + visuel encadré, sur fond image | `components/hero.tsx`, héros de pages |
| `aspect-logos` | Marquee 2 groupes `animate-marquee` | `logos.tsx`, bandeau techno / confiance |
| `aspect-features` | Bento 5 cellules bordées (1 large) + image en cadre | `home-offres.tsx`, `advantages.tsx`, features services |
| `aspect-split-section` | 50/50 image carrée ⇆ texte, bordure médiane | `quest-ce-que-headless`, sections alternées, `solution-landing` |
| `aspect-separator` | Spacer bordé `h-20` | Entre **toutes** les sections |
| `aspect-dashboard` | En-tête 2 col + grand visuel cadré + 4 colonnes features | `featured-realisation`, `HeroMockup`, détail étude de cas |
| `aspect-world-map` | Carte pointillée + tracés animés (SVG) | Section « portée / réseau » ; sinon `NodeNetwork` (cf. §7) |
| `aspect-testimonials` | 2 col, logo + citation + avatar, badge ★ | `testimonials.tsx` |
| `aspect-pricing` / `aspect-pricing-table` | Switch annuel/mensuel + 3 cartes bordées | `PricingCards`, `services/ServicesOffers`, `/tarifs` |
| `aspect-faq` / `aspect-faq-page` | Accordion Radix, ligne active `bg-jet` | `faq.tsx`, `ServicesFAQ` |
| `aspect-tabs` | Onglets + panneaux | `applications-tabs.tsx`, `technical-comparaison` |
| `aspect-team-carousel` | Carousel Embla de profils | `about/AboutClient`, parcours |
| `aspect-blog-header` / `aspect-post-grid` / `aspect-featured-post` | Index blog + grille + une | `blog/BlogIndex`, `articles/ArticlesIndex` |
| `aspect-blog-post` | Gabarit article (prose) | `blog/BlogLayout`, `articles/ArticleLayout` |
| `aspect-about-hero` | Héros éditorial | `/a-propos` |
| `aspect-contact-hero` + `aspect-contact-form` | Héros + formulaire bordé | `contact-form.tsx`, `/contact` |
| `aspect-features-hero` / `aspect-support-hero` | Héros de page secondaire | héros `/services`, `/solutions`, outils |
| `aspect-open-positions` | Liste lignes bordées | listes (réalisations, ressources) |
| `navbar` / `footer` | Header/footer bordés blueprint | `header.tsx`, `footer.tsx` |

---

## 6. Composants UI (boutons, cartes, etc.)

**Boutons** (`docs/src/components/ui/button.tsx`) — porter les variantes dans le repo :

| Variante | Style |
|---|---|
| `default` | `bg-ebony text-foreground border border-charcoal hover:bg-ebony/90` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `border border-dark-gray text-foreground hover:bg-accent` |
| `outline` | `border border-input bg-background hover:bg-accent` |
| `link` | `text-foreground underline-offset-4 hover:underline` |
| **`primary` (À AJOUTER)** | `bg-vermilion text-white hover:bg-vermilion-bright` — **CTA forts uniquement** |

Tailles : `default h-12 px-6` · `sm h-9 px-3 text-xs` · `lg h-10 px-8` · `icon size-9`.
Rayon `rounded-sm`. Les flèches `lucide-arrow-right`/`ChevronRight` se nudge au hover
(micro-interaction déjà en place dans `globals.css`).

**Cartes** : `border-dark-gray border rounded-lg bg-transparent` (ou `bg-jet` pour un
panneau décollé). Carte « populaire » : fond image `pricing-background` + liseré vermillon.

**Accordion / Switch / NavigationMenu / Tabs** : composants Radix déjà présents dans
`components/ui/` — il suffit de **reskinner** (tokens obsidian/dark-gray/jet, état ouvert
`data-[state=open]:bg-jet`). Ne pas réintroduire de dépendances.

---

## 7. Animations & visuels « tech » (exigence du brief)

> Le brief demande **micro-animations/micro-interactions discrètes** + **charts et SVG
> animés de type tech**. Tout doit respecter `prefers-reduced-motion` (déjà géré par
> `<MotionProvider>` = `MotionConfig reducedMotion="user"`).

### 7.1 Couche micro-interactions (existante, à conserver)
- `components/ui/reveal.tsx` : `<Reveal>` (fade + translateY 12px, once), `<Stagger>`/`<StaggerItem>`. Easing `[0.22,1,0.36,1]`, ~500ms. **Réutiliser pour toute nouvelle section.**
- `components/ui/section-rule.tsx` : trait qui se trace (scaleX).
- CSS : nudge des flèches au hover, `.ni-link` (underline scaleX), garde-fou reduced-motion.

### 7.2 Patterns d'animation aspect (à porter)
- **Tracé SVG** : `motion.path` `initial={{pathLength:0}} animate={{pathLength:1}}` (carte du monde, diagrammes de flux).
- **Pulsations SMIL** : `<circle><animate attributeName="r"…/></circle>` (points qui pulsent).
- **Marquee** : keyframe `marquee` (translateX 0→-100%, 25s linear infinite) — bandeau logos.
- **Draw-in de chart** : recharts avec `isAnimationActive` + `animationEasing="ease-out"`.

### 7.3 Bibliothèque de visuels tech — `components/visuals/` + `components/aspect/`
> **Statut : socle construit (Phase 1).** Déjà disponibles et theme-aware :
> `aspect/section.tsx` (`BlueprintSection` à `tone`/`framed`/`backdrop`/`ticks`,
> `SectionHeading`, `Separator`, `CornerTicks`) ; `visuals/aurora-glow`,
> `visuals/blueprint-grid`, `visuals/node-network`, `visuals/signal-paths`,
> `visuals/radial-gauge`, `visuals/charts` (`AreaTrend`/`BarBreakdown`, recharts),
> `visuals/spotlight-card`, `visuals/marquee`. **Démo vivante : `/aspect-lab`**
> (sections hétérogènes, deux thèmes). À RÉUTILISER ; n'en recréez pas de doublon.
> Reste à porter au besoin : `DataFlowDiagram` (restyle `DataFlowAnimatedSVG`),
> `WorldMap` (option, `dotted-map`).

À styliser en tokens DS (traits `dark-gray`, points/halos `vermilion`, fond `obsidian/jet`) :

| Composant | Rôle | Base technique | Section cible |
|---|---|---|---|
| `BlueprintBackdrop` | Fond grille pointillée discret (masqué en dégradé) | SVG/CSS | héros, séparateurs |
| `NodeNetwork` | Constellation de nœuds + liens, points qui pulsent | SVG + framer-motion + SMIL | héros tech, section « réseau » |
| `DataFlowDiagram` | Flux Headless : WordPress → API → Next.js, paquets animés sur les chemins | restyler `components/DataFlowAnimatedSVG.tsx` | « qu'est-ce que le headless », architecture |
| `WorldMap` (option) | Carte pointillée + tracés (portée nationale AGEFIPH) | port `docs/src/components/ui/world-map.tsx` (`motion/react`→`framer-motion`, `lineColor=vermilion`) ; **nécessite `dotted-map`** | section portée/réseau |
| `AnimatedAreaChart` / `AnimatedBarChart` | Courbes perf, économies AGEFIPH, ROI | **recharts (déjà installé)** + draw-in | outils, études de cas, OETH |
| `RadialGauge` | Jauge (éco-score, perf Lighthouse, éligibilité) | SVG `pathLength` | audit, diagnostic, simulateurs |
| `AnimatedCounter` | KPIs qui s'incrémentent | `components/ui/count-up.tsx` (existe) | héros, chiffres clés |
| `Marquee` | Bandeau défilant générique | keyframe `marquee` | logos, techno |

> Restyler en priorité l'existant : `DataFlowAnimatedSVG.tsx`, `AiAuditBannerSVG.tsx`,
> `HeroMockup.tsx` sont déjà des SVG/visuels — les reskinner aux tokens DS avant d'en créer.

---

## 8. Accessibilité & garde-fous

- **Contraste** : sur fond obsidian sombre, `mid-gray #828282` sur `#050505` ≈ 4.6:1 (texte secondaire OK). Vermillon `#d83a1a` sur obsidian ≈ 4.3:1 — OK pour gros texte/éléments ; pour petit texte critique, préférer `vermilion-bright` ou `foreground`. **Vérifier chaque usage.**
- **Bascule claire** : tester chaque page dans les deux thèmes (le piège = couleurs codées en dur au lieu des tokens sémantiques).
- **Reduced-motion** : aucune animation essentielle à la compréhension ; `<Reveal>`/MotionProvider gèrent déjà l'opt-out.
- **i18n** : `Link` depuis `@/i18n/navigation`, `useTranslations`/`getTranslations` conservés. Aucune chaîne en dur.
- **Sémantique** : un seul `h1` par page, hiérarchie `h2/h3` respectée, `aria-label` sur les boutons icône, `alt` sur les visuels décoratifs = `""`.

---

## 9. À FAIRE / À NE PAS FAIRE

✅ **À faire**
- Encadrer chaque section dans la grille blueprint (rails `dark-gray`).
- Penser **sémantique de token** (`bg-obsidian`/`text-foreground`) pour que la bascule claire marche.
- Réutiliser `<Reveal>`/`<Stagger>` et les composants Radix existants.
- Garder le vermillon **ponctuel**.
- Conserver tout le contenu et l'i18n.

❌ **À ne pas faire**
- Réintroduire l'accent lavande « star » (→ vermillon).
- Coder des couleurs en dur (casse la bascule de thème).
- Alourdir les titres en `font-bold` (aspect = fin + `tracking-tight`).
- Mettre du vermillon en aplat de surface.
- Copier la syntaxe Tailwind **v4** d'aspect (`@theme inline`) — on est en **v3**.
- Toucher au contenu / réécrire les textes.
- Réintroduire `framer-motion` brut là où `<Reveal>` suffit, ni casser le reduced-motion.

---

## 10. Fichiers de référence

- **Template source** : `docs/src/components/sections/aspect-*.tsx`, `docs/src/components/ui/`, `docs/src/components/layout/{navbar,footer}.tsx`, `docs/src/app/globals.css` (tokens v4 à transposer).
- **Plan de refonte phasé** : `.claude/aspect-refonte-plan.md`.
- **Agents** : `.claude/agents/aspect-porter.md` (migration), `.claude/agents/aspect-design-reviewer.md` (audit DS).
- **Legacy (ne plus suivre)** : `.claude/handoff/**` (système Suisse), tokens `--ink/--paper/--accent-color`.
