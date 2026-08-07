# Lot 0 — Reconnaissance (29/07/2026)

Rapport exigé par les directives v3.1 avant tout code. Périmètre : cartographie
du repo, pages réelles vs attendues, écarts à trancher avant le Lot A.

## Stack et infrastructure

- Next.js 16.1.6, React 19, App Router, next-intl 4 (FR par défaut sans
  préfixe, EN sous `/en`), Tailwind 3.
- Contenus : mixte — pages TSX codées en dur + MDX (`content/` FR,
  `content/en/`) + chaînes i18n (`messages/fr.json`, `messages/en.json`).
- 301 : centralisées dans `next.config.mjs` (`redirects()`). C'est là que la
  table du Lot A s'implémente.
- Sitemap : `app/sitemap.xml/route.ts`. Fichiers IA : `app/llms.txt/route.ts`
  et `app/llms-full.txt/route.ts` — les trois contiennent « boussole » et
  « OETH », à purger dans la même PR.
- Analytics : Microsoft Clarity (`lib/track.ts`) + gtag (autorisé par la CSP).
- Qualité : `lint`, `build` ; attention `typescript.ignoreBuildErrors: true`
  dans next.config.mjs — le typecheck ne bloque pas le build.

## Pages attendues vs réelles

Les 13 pages attendues existent toutes, aux slugs exacts : `/`, `/conseil`,
`/solutions-web`, `/etudes-de-cas` (+ `la-petite-vitrine` dans
`lib/case-studies-data.ts:84`), `/outils`, `/outils/boussole`,
`/audit-site-web`, `/avantage-oeth`, `/a-propos`, `/documentation`,
`/apporteurs`, `/agences`, `/contact`.

- `/outils/selecteur-techno` n'existe pas encore : destination du renommage,
  à créer au Lot A.
- `/bras-droit-ia` n'existe pas : attendu (Lot C).

## Empreinte lexicale à purger (Lot A)

- **« boussole »** : 116 occurrences / 39 fichiers, dont ~20 de code réel :
  `app/[locale]/outils/boussole/page.tsx`, `components/outils/boussole.tsx`,
  `components/header.tsx`, `components/json-ld.tsx`, `lib/metadata.ts`,
  `lib/hub-themes.ts`, `lib/home-content.ts`, sitemap, llms.txt,
  `messages/fr.json` + `en.json`, bento outils, hub-rubriques.
- **AGEFIPH / OETH / TIH** : 403 occurrences / 71 fichiers. Code réel :
  `/avantage-oeth` (page + `AvantageOethClient`, ~53 occ.),
  `/outils/simulateur-agefiph` (page + composant, ~41 occ.),
  `home-tih-teaser`, `footer`, `PricingCards`, `AppsSection`,
  `outils-bento-grid`, `home-offres`, `home-cta`, `multi-subject-form`,
  `json-ld`, `metadata`, sitemap, llms*, messages fr/en, mentions incidentes
  dans ~8 MDX blog/doc, et 2 articles entièrement dédiés (voir écart n° 1).
- **« petite vitrine »** : `lib/case-studies-data.ts` (14),
  `components/case-studies/realisations.tsx` (7), page études de cas (1).
- **« Diagnostic 2 min »** : 1 seule occurrence (`messages/fr.json`) —
  renommage trivial en « Pré-diagnostic express (2 min) ».

## Écarts signalés (à trancher AVANT le Lot A)

1. **Deux articles entiers dédiés AGEFIPH/TIH non listés** dans la table 301 :
   `/articles/reduire-contribution-agefiph-sous-traitance-tih` et
   `/articles/attestation-deductibilite-tih-guide-entreprises`. L'acceptation
   A.3 (zéro occurrence hors `/a-propos` et légal) impose leur dépublication,
   mais la suppression de pages non listées exige un accord préalable
   (règle transverse 7). Proposition : 301 → `/a-propos`.
2. **`/outils/simulateur-agefiph` sans destination 301** : le retrait est listé
   (A.2) mais absent de la table A.1, et le motif générique ne couvre que
   « boussole » / « petite-vitrine ». Proposition : 301 → `/outils`.
3. **Site bilingue** : les directives n'évoquent pas l'i18n ; purge et 301
   appliquées en FR et EN (préfixe `/en`), pattern déjà en place dans le repo
   (ADR-002).
4. **Mentions AGEFIPH incidentes dans des MDX conservés** (articles prix
   blog/doc) : purge par édition du passage, pas de suppression de page
   (ADR-003).
5. **Ligne factuelle TIH sur `/a-propos`** : texte à fournir par Agathe. Le
   Lot A est livrable sans (retrait complet), la ligne s'ajoutera ensuite.

## Hors-scope détectés (aucun impact)

- `docs/src/` : template « aspect » (chantier refonte visuelle), non routé.
- signauxfaibles.io / metrics.json : aucune intégration existante — attendu,
  c'est le Lot C qui la crée.
