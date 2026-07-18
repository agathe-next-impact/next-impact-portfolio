# Recommandation — animations React et UX (portfolio Next Impact)

Établie le 2026-07-18 sur inventaire exhaustif du repo (branche `posit-conseil`
+ delta `refonte-aspect`). Analyse seulement — aucune modification appliquée.

## Constat : le système motion existe déjà, et il est bon

- **Langage central cohérent** : `Reveal`/`Stagger` (`components/ui/reveal.tsx`,
  ease `[0.22,1,0.36,1]`, 0.5 s, y=12, `once`), adopté par 53 fichiers, avec
  une doctrine documentée (opacity + translateY seulement).
- **Signature visuelle** : 27 visuels canvas/SVG (`components/visuals/` :
  Sonar, RadialGauge, blueprint-grid…) — la personnalité « Blueprint » est là.
- **Accessibilité exemplaire** : triple garde-fou reduced-motion (CSS global
  `globals.css:1261` + `MotionConfig reducedMotion="user"` + hooks locaux).
- La question n'est donc PAS « quelles animations ajouter » mais « où le
  motion sert-il la conversion, et qu'est-ce qui la freine ».

## P1 — Retirer avant d'ajouter (perf = UX ; le site est sa propre démo)

> **✅ Exécuté le 2026-07-18** (commits `aad2bea`, `ccc4e76`, `936a522`).
> Mesuré : **-35,7 ko brut / ~-7,7 ko gzip sur toutes les pages**. 4 fichiers
> morts supprimés, 2 libs Lottie désinstallées, LazyMotion strict sur 46
> fichiers, tokens `lib/motion-tokens.ts`, filets posés. Restes signalés :
> `ogl` + `components/ui/threads.tsx` (non monté, candidat à suppression) ;
> `conseil/expand-cards.tsx` non migré (non monté, no-touch).

1. **Supprimer les deux libs Lottie mortes** (`lottie-react`,
   `@lottiefiles/react-lottie-player`) et leur code non monté
   (`components/ui/feature-carousel.tsx`, `components/tools.tsx`,
   `components/ui/lottie-animation.tsx`, chemin d'asset cassé
   `/lotties/thoughtful-astronaut.json`). Vérifier `ogl` (déclarée, aucun
   import trouvé). Gain : dépendances, lockfile, surface d'audit.
2. **Migrer framer-motion vers `LazyMotion` + `domAnimation`** (features `m.`
   au lieu de `motion.`) via le `MotionProvider` existant — le plus gros
   levier bundle restant (~-25/30 ko gzip sur toutes les pages). Aucun
   changement visuel.
3. **Tokens motion partagés** : les durées/easings divergent (Reveal 0.5 s /
   template 0.3 s easeInOut / CountUp 2 s ease-out / gauge 1.2 s). Créer
   `lib/motion-tokens.ts` : `EASE_OUT = [0.22,1,0.36,1]` (entrées),
   `DUR = { micro: .15, ui: .3, reveal: .5, chart: 1.2 }` — et consommer
   partout. La cohérence perçue est un signal de qualité pour un prospect qui
   évalue un studio.
4. Filets : ajouter `useReducedMotion` explicite à `app/[locale]/template.tsx`
   (aujourd'hui couvert seulement par le MotionConfig) ; commenter le bloc
   keyframes de `globals.css` comme critique (il a déjà été effacé une fois).

## P2 — Ajouter là où l'animation sert la doctrine « prouver avant de demander »

> **✅ Exécuté le 2026-07-18** (commits `437f90d`, `fa91866`).
> `StepTransition` créé (fade+slide 200 ms, reduced-motion OK) et intégré à la
> transition formulaire→résultat des 6 outils (constat : pas d'étapes
> question-par-question dans ces outils) ; verdicts en cascade généralisés.
> Laissés tels quels, justifié : headless-diagnostic (transition directionnelle
> spring existante), simulateur-agefiph (live, AnimatedEuro). ProofStrip animé
> (Stagger + CountUp sur 22 et 20 ans) mais **laissé non commité** avec le
> chantier refonte parallèle. Tests scoring verts, build vert.

5. **ProofStrip (refonte) : la preuve doit accrocher l'œil.** Le nouveau
   composant est 100 % statique. Recommandé : `Stagger` sur les cellules +
   `CountUp` (existant) sur les chiffres (22 projets, scores CWV…). C'est LE
   cas où une animation augmente la conversion : le regard du prospect froid
   est attiré par les chiffres qui se construisent. Coût quasi nul, composants
   déjà dans le repo.
6. **Transitions d'étapes dans les outils multi-étapes** (diagnostics,
   boussole, funnels contact) : standardiser un pattern unique
   `AnimatePresence` slide/fade 200 ms entre questions — continuité perçue,
   sentiment de progression. Aujourd'hui chaque outil fait sa sauce.
7. **Résultats d'outils** : le verdict (palier + actions) doit apparaître en
   cascade (`Stagger`) avec la jauge — déjà le cas sur visibilite-ia ;
   généraliser aux outils plus anciens pour homogénéité.

## P3 — Le froid du site : orienter dans les contenus longs

8. **Barre de progression de lecture** sur les articles documentation/blog
   (fine, en haut, `transform: scaleX` piloté par scroll — CSS/`useScroll`,
   coût nul en CLS). Les articles GEO sont longs ; la progression réduit
   l'abandon.
9. **Surlignage de la section active dans la TOC** (IntersectionObserver +
   `transition-colors`) — orientation dans les guides à 8-10 H2.
10. Rien de plus dans la prose : le corps d'article reste statique (lisibilité
    et extraction par les moteurs IA priment).

## À NE PAS faire

- Pas de parallax, scroll-jacking, curseurs custom, marquees sur les parcours
  de conversion : contraire à la doctrine « une décision par section » et
  coûteux en INP.
- Pas de réintroduction de Lottie (assets lourds, redondant avec la
  bibliothèque canvas maison).
- Pas d'animation qui retarde l'affichage de la preuve (chiffres, prix,
  verdicts doivent être visibles < 1 s même si l'animation est en cours —
  `CountUp` part déjà de 60 % de la valeur, bon réflexe à conserver).
- Ne pas toucher au triple garde-fou reduced-motion.

## Ordre suggéré

P1 (retraits + LazyMotion + tokens) → P2.5 ProofStrip (avec la refonte
aspect) → P2.6-7 outils → P3 articles. Chaque étape mesurée : bundle analyzer
avant/après pour P1, CWV (INP/CLS) inchangés en preview pour P2-P3.
