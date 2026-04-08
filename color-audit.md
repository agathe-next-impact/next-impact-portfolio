# Audit couleurs / système de thème — next-impact-portfolio

> Phase 1 du plan light mode. **Lecture seule, aucune modification de code.**

---

## 0. Découverte critique préalable

Il existe **deux fichiers `globals.css`** dans le repo :

| Fichier | Lignes | Statut | Importé ? |
|---|---|---|---|
| `app/globals.css` | 380 | **ACTIF** | ✅ `app/layout.tsx:4` + `components.json` |
| `styles/globals.css` | 96 | **MORT** | ❌ aucun import nulle part |

**Conséquence** : toutes les itérations précédentes de light mode qui éditaient `styles/globals.css` n'avaient aucun effet sur le rendu réel. **Tout ce qui suit cible exclusivement `app/globals.css`.**

---

## 1. Système de design actuel

### Tailwind (`tailwind.config.ts`)
- `darkMode: ["class"]` → mode dark basé sur la classe `.dark` sur `<html>`. **Mais cette classe n'est jamais posée nulle part dans le projet.**
- Palette brand custom (lignes 44-53) — hex statiques :
  - `darkblue: #020F59`
  - `mediumblue: #021373`
  - `regularblue: #1F54BF`
  - `lightblue: #719ED9`
  - `extralightblue: #D0DCF2`
  - `white: #FFFFFF`
  - `orange: #F29F05`
  - `coral: #FF6B6B`
  - `lightyellow: #F2E57E`
- Tokens shadcn/ui complets en HSL via CSS vars (`background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-*`, `sidebar-*`).

### shadcn/ui
- ✅ `components.json` présent (`baseColor: "neutral"`, `cssVariables: true`).
- 68 composants UI dans `components/ui/`.

### CSS variables (`app/globals.css`)
- `:root` (lignes 60-103) :
  - Tokens shadcn light (`--background: 0 0% 100%`, `--foreground: 220.13, 72.07%, 43.53%`, etc.)
  - **Variables brand en dur** (hex) : `--darkblue`, `--mediumblue`, `--regularblue`, `--lightblue`, `--extralightblue`, `--white`, `--complementary1/2/3`. **Non redéfinies dans `.dark`.**
- `.dark` (lignes 104-137) : tokens shadcn dark uniquement, **sans les variables brand**.

### Cascade typographique du base layer (lignes 144-181) — **point clé**
```css
body            { @apply text-regularblue; }
h1              { @apply text-4xl text-regularblue; }
h2              { @apply text-mediumblue; }
h3, h4          { @apply text-mediumblue; }
h5, h6          { @apply text-darkblue; }
p, span, li,
input, textarea { @apply text-mediumblue; }
a               { @apply text-regularblue; }
```
→ **Le base layer est en réalité du texte BLEU sur fond TRANSPARENT.** Le rendu visuel "dark" actuel vient :
1. du SVG `chipset-tech-background.svg` plein écran fixé en `app/layout.tsx:168` (fond bleu nuit),
2. des composants (Header, Footer, Hero, Cards…) qui posent leurs propres `bg-darkblue`/`bg-mediumblue` + `text-white` par-dessus.

**Conclusion** : il n'y a **aucun vrai dark mode** au sens shadcn/next-themes. Le site est un "faux dark" obtenu par composition. C'est ce qui rend l'ajout d'un light mode délicat : on ne peut pas simplement basculer une classe.

### next-themes
- ✅ `next-themes@0.4.4` installé.
- ✅ `components/theme-provider.tsx` existe (wrapper trivial).
- ❌ **Jamais monté** dans `app/layout.tsx`.
- ❌ Aucun `data-theme` ni `class="dark"` posé sur `<html>`.

### Autres
- Aucun CSS Module / styled-components / emotion.
- Une seule occurrence de `prefers-color-scheme` (`components/logo-loop.css`).
- 54 occurrences de variant `dark:` dans des composants UI (cards prose, audit-form, métadonnées) — usage minoritaire.

---

## 2. Palette brand — fréquence d'utilisation

| Token | Hex | Occurrences (toutes classes) |
|---|---|---|
| `darkblue` | #020F59 | ~261 |
| `mediumblue` | #021373 | ~240 |
| `regularblue` | #1F54BF | ~252 |
| `lightblue` | #719ED9 | ~272 |
| `extralightblue` | #D0DCF2 | ~79 |
| `white` | #FFFFFF | **~1364** |
| `coral` | #FF6B6B | ~162 |
| `orange` | #F29F05 | ~96 |
| `lightyellow` | #F2E57E | ~195 |
| `bg-black` | #000000 | ~67 |

Total : **~3000+** occurrences hardcodées de couleurs brand/texte. Aucune valeur hex ou rgba en dur dans les `.tsx` (tout passe par Tailwind ou les vars CSS).

---

## 3. Cartographie des couleurs hardcodées

### Backgrounds (~800)
- `bg-darkblue`, `bg-mediumblue`, `bg-regularblue`, `bg-lightblue` (avec opacités `/10`, `/40`, `/60`)
- `bg-white`, `bg-black/40` (overlays modaux)
- Exemples :
  - `components/hero.tsx:89` — `bg-darkblue/60 backdrop-blur-md`
  - `components/footer.tsx:8` — `bg-mediumblue/10 backdrop-blur-sm`
  - `components/homepage-profile-banner.tsx:21` — `bg-mediumblue/60 backdrop-blur-md`

### Textes (~1200)
- `text-white`, `text-white/90`, `text-white/80`, `text-white/70`, `text-white/50`
- `text-darkblue`, `text-mediumblue`, `text-regularblue` (titres + base layer dans `app/globals.css`)
- `text-lightyellow`, `text-coral`, `text-orange` (accents)

### Bordures (~200)
- `border-white/10`, `border-white/20`
- `border-lightblue/20`, `border-orange/20`

### Gradients (~150 — **risque critique**)
Ces classes ne sont **pas** captées par les sélecteurs `[class*="bg-darkblue"]` :
- `from-darkblue/60 to-mediumblue/40` — `components/cta-section.tsx:50`
- `from-orange/10 via-mediumblue/40 to-darkblue/60` — `components/livre-blanc-banner.tsx:10`
- 25 fichiers utilisent des gradients brand (comptés via grep `from-(darkblue|mediumblue|regularblue|lightblue)`).

### Backdrop / blur / opacity
- `backdrop-blur-sm/md/xl` : ~1410 occurrences. Probablement OK dans les deux thèmes.
- `mix-blend-mode` : 0 occurrence (bon).

### Hex / rgba en dur dans le code
- Aucun dans les `.tsx`/`.ts`.
- Présent uniquement dans `tailwind.config.ts` (palette) et `app/globals.css` (vars brand `:root`).

---

## 4. Cas spéciaux / risques

### Logos blancs (à fournir en variante foncée pour light mode)
- `/img/logo-blanc-carre.png` et `.webp` — utilisé dans `components/header.tsx`
- `/img/logo-astro-blanc.png/webp`
- `/img/logo-nextjs-blanc.png/webp`
- `/img/logo-wordpress-blanc.png/webp`
→ **Invisibles sur fond clair**. Action : créer variantes "logo-couleur-*" + composant `<Logo>` qui swap selon `resolvedTheme`, ou filtre CSS de secours.

### Background SVG plein écran
- `app/layout.tsx:168` → `<Image src="/img/chipset-tech-background.svg" fill priority />`
- C'est la principale source du "dark feel". À conditionner : `hidden dark:block` + asset clair OU fond uni en light.

### SVG inline
- 1 seule occurrence : `components/ui/feature-carousel.tsx` avec `fill="white"`. Risque marginal.

### `.article-text` (lignes 215-377 de `app/globals.css`) — **gros bloc dark hardcodé**
- `text-white/80`, `text-white/70`, `text-white/90`
- `border-coral/60`, `border-lightyellow/40`
- `bg-darkblue` pour `<pre>`, `text-extralightblue/80`
- Tables : `text-white`, `border-white/10`, `bg-white/[0.02]`
- `.diagnostic-dark` : forcé en `text-white`
→ Toute la documentation/MDX hérite de ces règles. **Doit être traité spécifiquement.**

### Composants tiers
- **Recharts** : importé mais non utilisé visuellement (pas de chart rendu).
- **Lottie** : utilisé pour animations, pas de couleur custom détectée.
- **Framer Motion** : transitions `opacity/x/y`, pas de couleurs.
- **react-pdf** : ❌ non présent.

### Articles MDX
- 95 fichiers `.md(x)` dans `content/documentation/`.
- HTML inline minimal (1 occurrence). Le rendu passe par `.article-text` → géré côté CSS.

### Tailwind typography (`prose`)
- Classes `.prose h1/h3/code/li` redéfinies (lignes 200-211) avec `text-regularblue`/`text-mediumblue`. Pas de `dark:prose-invert`.

### Composants critiques
| Fichier | Couleurs |
|---|---|
| `components/header.tsx` | `bg-mediumblue/60 backdrop-blur-md`, navlinks `text-white/90`, icônes `text-white` |
| `components/footer.tsx` | `bg-mediumblue/10 backdrop-blur-sm border-white/10`, `text-white/70`, accents `coral`/`lightyellow` |
| `components/hero.tsx` | `bg-darkblue/60 backdrop-blur-md border-white/10`, `text-white/80` |
| `components/cta-section.tsx` | gradient `from-darkblue/60 to-mediumblue/40`, `border-lightblue/20`, badges `bg-lightyellow/10` |
| `components/livre-blanc-banner.tsx` | gradient `from-orange/10 via-mediumblue/40 to-darkblue/60` |
| `components/homepage-profile-banner.tsx` | `bg-mediumblue/60`, boutons `bg-darkblue/40 text-white/80` |
| `app/layout.tsx` | SVG fond plein écran, aucune classe couleur sur `<html>` ou `<body>` |

---

## 5. Synthèse et risques

### Le codebase est dark-only par composition, pas par convention
- ❌ Pas de classe `.dark` posée nulle part.
- ❌ Variables brand absentes du bloc `.dark` de `app/globals.css`.
- ✅ Infrastructure shadcn + next-themes en place mais inerte.
- 🔥 **Le base layer typographique (`body`/`h*`/`p`) est paradoxalement déjà en couleurs bleues (light-friendly).** C'est uniquement les composants qui imposent le visuel sombre via `bg-darkblue` + `text-white`.

### Volumétrie pour migration "tokens propres"
- ~113 composants à toucher → trop coûteux pour cette itération.
- Conserver l'approche **surcharge CSS scopée sous `.light`** dans `app/globals.css`, en l'ajustant pour :
  1. Cibler le bon fichier (`app/globals.css`, pas `styles/globals.css`).
  2. Inclure les **gradients** (`from-/to-/via-brand-*`) — précédemment oubliés.
  3. Surcharger le bloc `.article-text` (texte blanc → bleu).
  4. Conditionner le SVG fond plein écran.
  5. Gérer le swap des logos blancs.

### Risques identifiés
| # | Risque | Mitigation |
|---|---|---|
| R1 | Le sélecteur `.dark` n'étant jamais posé, le `defaultTheme="dark"` de next-themes va devoir poser activement `class="dark"` — or les composants ne dépendent pas de cette classe pour leur rendu actuel. → **Le rendu dark devrait rester identique** car il ne dépend pas de la classe, mais à valider. | Test pixel-perfect : `npm run dev` avant/après mount du ThemeProvider sans rien d'autre. |
| R2 | Les `text-white/70` etc. dans `.article-text` ne sont pas des classes utilitaires mais des `@apply` dans `app/globals.css` → ne seront pas captés par `[class*="text-white"]`. | Réécrire `.light .article-text *` explicitement. |
| R3 | Les gradients `from-/to-` brand. | Surcharge dédiée annulant `background-image` + couleur unie. |
| R4 | Logos blancs invisibles en light. | Composant `<Logo />` qui sélectionne l'asset selon `useTheme()`, OU filtre CSS `filter: invert(...)` (acceptable temporaire). |
| R5 | SVG fond plein écran. | `hidden dark:block` + fond uni clair en light, OU asset clair dédié. |
| R6 | `MetadataDebugger`, `ClarityScript`, JSON-LD : composants neutres → aucun risque. | – |
| R7 | Composants shadcn déjà avec `dark:` variants : casser leur comportement. | Ne pas surcharger leurs tokens shadcn — uniquement ajouter un bloc `.light` qui redéfinit les vars HSL si nécessaire. |

---

## 6. Recommandation pour Phase 2

**Approche : tokens sémantiques minimum + surcharge CSS scopée sous `.light`**, dans `app/globals.css` uniquement.

1. **Dark intouché** : ne rien modifier hors de l'ajout d'un nouveau bloc `.light`. Le rendu actuel est garanti car il ne dépend pas de la classe `.dark`.
2. **Light = ensemble exhaustif de surcharges** ciblant :
   - Les classes brand (bg/text/border) avec sélecteurs `[class*=…]` pour capter les opacités.
   - Les **gradients** brand (`from-/to-/via-`) → annulés.
   - Le bloc `.article-text` réécrit explicitement sous `.light`.
   - Le SVG de fond conditionné.
3. **Mount `ThemeProvider`** dans `app/layout.tsx` : `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, `disableTransitionOnChange`.
4. **`ThemeToggle`** dans header desktop + menu mobile.
5. **Logos** : approche pragmatique → composant wrapper `<BrandLogo />` qui swappe l'asset, ou filtre CSS de secours si pas d'asset clair fourni.
6. **Anti-FOUC** : `next-themes` gère via script inline si `attribute="class"` + `suppressHydrationWarning` sur `<html>`.

**Volumétrie estimée Phase 2+3** : ~200 lignes ajoutées dans `app/globals.css`, 1 fichier créé (`theme-toggle.tsx`), 4 fichiers édités (`layout.tsx`, `header.tsx`, peut-être `header.tsx` mobile, et 1 wrapper logo).

---

## Validation requise

Avant Phase 2, confirme-moi :

1. ✅ / ❌ Tu valides que `styles/globals.css` est mort et que toutes les modifs vont dans `app/globals.css` ?
2. **Logos blancs en light mode** : (a) fournis-tu des assets `logo-couleur-*` ? (b) sinon, OK pour utiliser un filtre CSS temporaire ? (c) ou OK pour un wrapper React qui import les deux assets et swap selon le thème ?
3. **SVG fond plein écran en light** : (a) asset clair à venir ? (b) fond uni clair acceptable en attendant ?
4. **`.article-text`** (toute la documentation MDX) : OK pour le réécrire en bleu/foncé sur clair en light mode ?
5. Approche **surcharge CSS scopée** validée, ou tu préfères la migration vers tokens sémantiques (refactor 100+ composants) ?
