# Audit de vague 5 — mode 2 (verificateur-coherence, 2026-07-18)

Périmètre : `3e11a1f` → `6dd1cf9` (7 réécritures + 4 commits structure +
suppression de 64 fichiers). Grille : plan-fusion-headless.md + décisions
actées. Non vérifié : Search Console ; 301 vérifiées sur config, pas en HTTP.

## BLOQUANTS (3) — corrigés par l'orchestrateur le 18/07 (commit post-audit)

- **B1 — `ArchitectureDiagram` props invalides** (`name`/`components` au lieu
  de `label`/`items`, `color: coral` inexistant) dans nextjs FR + 2 miroirs
  EN → page article en erreur runtime (cible de 2 redirections 301).
  → FR corrigé ; les 2 EN réglés par la suppression des miroirs (A1).
- **B2 — `ComparisonTable` ne rend que 2 colonnes** : 3 tableaux à 3-4
  colonnes affichaient des données sous les mauvais en-têtes (matrice
  SSG/ISR/SSR/CSR de nextjs — contresens sur ISR ; App Passwords/JWT/OAuth de
  securite ; mutualisé/VPS/managé de deploiement). → Les 3 convertis en
  tableaux markdown à colonnes complètes ; le tableau Vercel/Netlify/Amplify
  réduit à 2 colonnes exactes.
- **B3 — Tarifs 2025 survivants** dans `comment-creer-un-headless` FR+EN
  (8-15k / 15-35k / 25-60k €) contredisant la référence 2026. → Remplacés par
  les forfaits publiés (2 250 / 4 000 / 6 500 €+) avec lien blog chiffré et
  renvoi web app pour les périmètres supérieurs.

## Avertissements — tous traités le 18/07

- **A1** — Miroirs EN des 7 absorbants désynchronisés (anciens seuils autour
  du diagnostic harmonisé, Gatsby encore recommandé). → **Supprimés** (7
  fichiers), fallback FR (pattern assumé depuis la vague 1). Les 8 EN des
  articles non réécrits sont conservés (dont comment-creer corrigé).
- **A2** — Visio conseil : « en une heure » dans comprendre/nextjs/deploiement
  alors que l'offre = 30 minutes. → Corrigé (3 occurrences).
- **A3** — Frontière migration doc/blog non posée. → Phrase de périmètre +
  renvois croisés posés dans les deux sens.
- **A4** — Tarifs headless divergents dans `applications-web-mobile`
  (quest-ce-quune-web-app : 4 000-15 000 ; site-ou-web-app : 2 250-8 000 /
  5 000-15 000). → Alignés sur les bornes publiées (1 500-3 000 classique,
  2 250-6 500+ headless, zone grise 6 500-12 000).
- **A5** — FAQ quasi jumelles plugins (comprendre vs gerer-le-contenu). →
  Question de comprendre recentrée sur le principe (pourquoi certains plugins
  perdent leur rôle), le détail plugin par plugin reste à gerer-le-contenu.
- **A6** — Mineurs (TL;DR de deploiement en gras, accents des cellules
  nextjs) : accents réglés par la conversion markdown (B2) ; TldrCallout de
  deploiement laissé (cosmétique).

## Observations (conformes)

1. 301 : 24 règles = plan §3 à l'identique ; ordre orphelin/catch-all correct.
2. Suppressions : 64 fichiers exacts (+7 miroirs EN en correction A1 = 71).
3. Zéro lien mort vers les 11 slugs supprimés (content, components, lib, app,
   miroirs EN).
4. Diagnostic harmonisé (2 250/4 000/6 500), hrefs vivants, partage d'URL OK.
5. Structure : category-theme-cards = 15 slugs ; catégorie « blog » éteinte ;
   sitemap/llms.txt assainis ; garde 404 active.
6. Socle GEO des 7 : TL;DR, 35 FAQ distinctes, updated + dates d'origine,
   verdicts, INP, position balisage alignée C3, AGEFIPH absent, escalier CTA.
7. Absorption réelle conforme 7/7 (après correction B2 de la matrice).
8. Vagues 1-4 intactes.

## Verdict

Après corrections B1-B3 + A1-A5 (18/07, build vert) : **vague 5 publiable**.
L'élagage est complet : 25 → 15 articles documentation (+ 9 blogs 2026),
24 règles 301, stock headless cohérent avec la référence tarifaire unique.
