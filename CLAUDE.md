# CLAUDE.md — Projet vitrine Next Impact Digital

> PRIORITAIRE : pour tout travail éditorial sur la vitrine (contenus, titres,
> offres, CTA, métadonnées, navigation), lire et suivre
> ./DIRECTIVES-CHARTE-EDITORIALE.md (charte v1.1, 2026-08-27) — elle prime sur
> le présent fichier et fixe le catalogue d'offres de référence (5 lignes),
> le lexique, les règles typographiques et les garde-fous.

> PRIORITAIRE : pour tout travail sur les études de cas, lire et suivre
> ./DIRECTIVES-ETUDES-DE-CAS.md — il prime sur le présent fichier.

> PRIORITAIRE : pour tout travail sur **Sentinelle** (produit de veille par
> abonnement : `src/sentinelle/`, `app/(sentinelle)/`, `app/api/sentinelle/`),
> lire et suivre `docs/sentinelle/CLAUDE.md` — ses six règles d'architecture
> priment sur le présent fichier. Plan d'exécution et écarts constatés :
> `docs/sentinelle/plan-mise-en-oeuvre.md`. Sentinelle n'est PAS la vitrine :
> aucun code vitrine ne doit importer `@sentinelle/*`.

Constitution du dépôt. Lue à chaque session Claude Code. Source de vérité sur le
contexte et les règles de travail pour ce site.

> **Chantier en cours** : l'évolution du site (pivot « bras droit IA », lots
> 0/A/B/C/D) est gouvernée par
> `.claude/docs/directives-claude-code-next-impact.md` (cadrage v3.1). En cas de
> conflit avec la doctrine ci-dessous (notamment sur l'AGEFIPH), les directives
> v3.1 priment. Journal des décisions : `docs/decisions.md`.

## Ce qu'est ce projet

La vitrine **next-impact.digital** — studio web solo (EI Agathe Karinthi-Martin),
100 % remote. Stack du site : Next.js. Le site est sa propre démo de performance
(Core Web Vitals au vert), donc toute modif doit préserver perf, SEO et
accessibilité.

## Objectif business actuel (priorité absolue)

Sortir de la dépendance aux plateformes (Malt/Codeur) et au bouche-à-oreille en
attirant des **prospects froids**. Le site est le point d'atterrissage de tous
les canaux de prospection (cold mail, LinkedIn, pré-audit). Il doit donc
**convertir un inconnu sceptique** : prouver avant de demander.

## Règle d'or

> Le site PROUVE avant de DEMANDER. Chaque choix se tranche par : « est-ce que ça
> rassure et fait avancer un prospect froid qui vérifie ? »

## Doctrine (résumé — détail dans la skill audit-vitrine)

- Classer l'offre par **bénéfice**, jamais par techno en accroche.
- **Headless au centre**, WP classique en entrée secondaire, web app en haut de
  gamme secondaire. Casser la parité des 3 offres ; Headless = recommandé.
- Entrée par le **gain sans rupture** (« gardez WordPress + un front waouh de
  2026 »), waouh TOUJOURS adossé à du mesurable (perf garantie). Pas le fiscal.
- **AGEFIPH = 2e message**, jamais le 1er. Raison de préférer, pas d'acheter.
  Apparaît en fin de parcours, près du devis. Ne jamais le mettre en tête.
- Cible : structures 20–250 salariés au parc WordPress vieillissant.
- CTA hiérarchisés par **température** (froid : audit gratuit ; chaud : RDV).
- **Simplicité = une décision par section**, pas moins de contenu. Démonstratif
  (preuve, perfs, prix) au premier plan ; explicatif (méthode, specs, FAQ, détail
  AGEFIPH) en couche cliquable. Test des 5 secondes par section. Ne jamais couper
  la preuve pour « alléger ».

## À NE PAS faire

- Remettre l'AGEFIPH en accroche principale.
- Nommer « Headless » / « Next.js » comme titre d'accroche (réserver à
  l'explication technique).
- Supprimer l'offre WordPress classique (porte d'entrée de gamme).
- Créer un « catalogue de sites à customiser » : commoditise la marque et érode
  l'avantage AGEFIPH. Si catalogue il y a, c'est un catalogue de **solutions
  verticales métier** (ex. annuaire de fédération), pas de sites.
- Présenter un seul CTA d'une seule température.

## Commandes / agents disponibles

- `/audit-vitrine [page]` — audit complet structure + contenu d'une page
  (défaut : home). Voir `.claude/skills/audit-vitrine/SKILL.md`.

## Workflow attendu

1. Pour toute demande de refonte/contenu : d'abord `/audit-vitrine` sur la page
   concernée pour établir le réel, puis proposer les modifs.
2. Préserver perf/SEO/a11y à chaque édition de code.
3. Documenter les recommandations en markdown sobre (pas de sur-formatage).
