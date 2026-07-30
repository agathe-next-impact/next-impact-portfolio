# Décisions — évolution next-impact.digital (directives v3.1)

Journal ADR court exigé par la règle transverse 7. Une entrée par décision
prise en autonomie ; les modifications structurantes restent soumises à accord
préalable.

## ADR-001 — 2026-07-29 — Lot 0 mené avant tout code

Reconnaissance complète du repo (stack, routing, 301, analytics, empreinte
lexicale). Rapport : `.claude/docs/lot-0-reconnaissance.md`. Cinq écarts
identifiés, dont deux soumis à arbitrage d'Agathe avant le Lot A (articles
AGEFIPH/TIH non listés ; destination 301 du simulateur).

## ADR-002 — 2026-07-29 — Purge et 301 bilingues FR + EN

Les directives ne mentionnent pas l'i18n ; le site est bilingue (next-intl,
FR sans préfixe, EN sous `/en`). Toute dépublication, purge lexicale et 301 du
Lot A s'applique aux deux locales, en suivant le pattern de doublons FR/EN
déjà en place dans `next.config.mjs`.

## ADR-003 — 2026-07-29 — Mentions AGEFIPH incidentes : édition, pas suppression

Les MDX blog/doc qui mentionnent l'AGEFIPH au détour d'un passage (articles
prix notamment) sont conservés : seul le passage concerné est réécrit ou
retiré. La suppression de page ne s'applique qu'aux contenus entièrement
dédiés au sujet, listés dans la table 301 validée.

## ADR-004 — 2026-07-29 — Arbitrages d'Agathe sur les écarts du Lot 0

1. Les deux articles dédiés AGEFIPH/TIH
   (`/articles/reduire-contribution-agefiph-sous-traitance-tih`,
   `/articles/attestation-deductibilite-tih-guide-entreprises`) sont
   **conservés en ligne**. L'acceptation A.3 est adaptée : zéro occurrence
   AGEFIPH/OETH/TIH hors `/a-propos`, pages légales **et ces deux articles**
   (ainsi que leur listing dans l'index des articles).
2. `/outils/simulateur-agefiph` : 301 → `/outils` (équivalent le plus proche),
   FR et EN.

## ADR-005 — 2026-07-29 — Adaptations autonomes pendant le Lot A

1. Événement analytics `boussole_result` renommé `selecteur_techno_result` et
   source newsletter `boussole` → `selecteur-techno` (rupture de continuité
   des séries de mesure, assumée pour la purge lexicale).
2. Tableaux TCO des articles blog « headless vs classique » (FR/EN) : la ligne
   déduction AGEFIPH retirée, totaux recalculés (4 700 € net → 5 900 €).
3. Les deux articles TIH conservés pointaient vers `/avantage-oeth`
   (breadcrumb + CTA « Simuler mon économie ») : breadcrumb recâblé sur
   `/articles`, CTA remplacé par « En savoir plus sur le statut TIH » →
   `/a-propos`.
4. Étude de cas « Artisan Coiffeur » (client pilote) conservée ; seule la
   mention « La Petite Vitrine » de ses alt/descriptions est retirée. Le lien
   externe artisan-coiffeur.lapetitevitrine.com reste (domaine du client,
   pas d'occurrence du lexique interdit dans le HTML rendu).
5. Entrée métadonnées `simulateurTarifs` (pointait vers la page simulateur
   supprimée, aucun usage) retirée de `lib/metadata.ts`.
6. Clé de navigation i18n `nav.boussole` renommée `nav.selecteurTechno` ;
   clés footer devenues sans usage (`oethAdvantage`, `agefiphSimulator`,
   `tihMention`, `hero.tihMention`) supprimées des deux locales.

## ADR-006 — 2026-07-30 — Réintégration de l'étude de cas La Petite Vitrine

Sur demande explicite d'Agathe, l'étude de cas « La Petite Vitrine »
(dépubliée par le Lot A, commit 548023c) est restaurée à l'identique depuis
git : données FR/EN (`lib/case-studies-data.ts`), carte de la grille
(`components/case-studies/realisations.tsx`), image
`public/img/desktop-screen-lapetitevitrine.jpg`. Les 301
`/etudes-de-cas/la-petite-vitrine → /solutions-web` (FR + EN) sont retirées
de `next.config.mjs`. La mention retirée des alt/descriptions d'Artisan
Coiffeur (ADR-005 §4) n'est pas rétablie.
