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

## ADR-007 — 2026-09-07 — Réinstauration de l'offre récurrente « CTO externalisé »

Sur demande explicite d'Agathe, l'offre récurrente de direction technique,
supprimée le 27 août 2026 par le commit `b8a328d` (« Direction technique
externalisée », 750 € HT/mois), est réinstaurée sous le nom **CTO externalisé**,
le terme réellement recherché.

Écarts assumés par rapport aux conditions de la suppression :

1. **Tarif et engagement révisés** : à partir de 950 € HT par mois, engagement de
   3 mois minimum puis reconduction au mois. L'ancien palier de 750 €/mois sans
   engagement n'est pas rétabli et ne doit plus être cité.
2. **Page dédiée plutôt que carte sur `/conseil`** : l'offre vit sur
   `/cto-externalise` (bilingue FR + EN). `/conseil` et `/solutions-web` s'y
   contentent d'un bandeau de renvoi en pied de page. Les cartes d'offre de
   `/conseil` restent les deux offres ponctuelles du catalogue.
3. **Accès par une entrée plate de la navigation principale**, pas par un menu
   déroulant : le panneau masqué du défunt menu « Ressources », retiré le
   16 août 2026, restait dans le DOM et déclenchait le prefetch Next de ses
   destinations à chaque page. Une entrée de plus coûte moins qu'un panneau.
4. **Deep-links historiques recâblés** : `?sujet=direction-technique` et
   `?sujet=accompagnement` atterrissent sur le nouveau sujet de contact
   `cto-externalise` au lieu de « Autre ».

La charte éditoriale a été amendée en conséquence (v1.2 du 7 septembre 2026) :
catalogue porté à six lignes au §1, offre récurrente placée en aval au §5,
clause de fermeture de la page Conseil réécrite au §6, et fiche de page
`/cto-externalise` ajoutée. Sans cet amendement, la charte primant sur
`CLAUDE.md`, la passe éditoriale suivante aurait purgé l'offre en toute
bonne foi.

Source de vérité unique du contenu et du prix : `lib/cto-externalise.ts`. Les
données structurées, les fichiers `llms.txt` / `llms-full.txt`, le sujet du
formulaire de contact et le sitemap en dérivent ; aucun ne réécrit le prix.

## ADR-008 — 2026-09-08 — Refonte de l'offre « CTO externalisé » : deux paliers publiés

Remplace les points 1 et 3 de l'[ADR-007](#adr-007--2026-09-07--réinstauration-de-loffre-récurrente--cto-externalisé-),
sur la base de la synthèse d'offre « Direction technique externalisée » remise
par Agathe. L'offre reste sur `/cto-externalise` et reste la seule ligne
récurrente du catalogue ; ce qui change, c'est sa structure et son prix.

1. **Prix d'entrée ramené de 950 à 900 € HT par mois**, et passage d'un tarif
   unique à **deux paliers publics** : Référent (900 €/mois, un système simple et
   des décisions ponctuelles) et Direction technique (1 900 €/mois, le cas
   courant : plusieurs outils, des prestataires, des échéances). Le troisième
   palier de la synthèse, Renforcée à 3 500 €/mois, n'est **pas** publié : il se
   cadre en conversation. Ne pas l'ajouter au site sans arbitrage.
2. **Engagement porté de 3 à 6 mois**, puis reconduction au mois, avec un préavis
   de 2 mois. Motif : six mois est la durée qu'il faut pour qu'un cycle complet
   se voie (cartographie, roadmap tenue, arbitrages rendus, première revue
   d'opportunité).
3. **La page décrit désormais les livrables**, pas seulement la couverture :
   cartographie du système, roadmap datée et budgétée, relevé de décisions,
   revue de devis avec alternative chiffrée, budget technique à trois ans, plan
   de continuité et dossier de restitution, registre des évolutions, revue
   d'opportunité. Ce sont eux qui distinguent une direction technique d'un
   abonnement au conseil, et ils rendent la prestation vérifiable.
4. **Périmètre resserré et garde-fous réécrits** : l'offre couvre le numérique
   visible (site, applications web, données et outils en ligne, briques d'IA,
   hébergement, sécurité, prestataires). Elle exclut le SI interne, l'infogérance
   et le support de niveau 1, l'astreinte 24/7, la communication et le marketing,
   et la réalisation au delà du quota du palier. L'ancien garde-fou « pas de
   développement inclus » est retiré : le palier Direction technique inclut 4 h
   de réalisation par mois.
5. **L'entrée de navigation plate de l'ADR-007 n'a jamais été mise en service** :
   le merge du 8 septembre a conservé le mega menu de la branche distante, où le
   CTO externalisé est un item du panneau « Conseil ». Le motif de l'ADR-007
   (éviter le prefetch fantôme d'un panneau masqué) reste satisfait, le panneau
   du mega menu n'étant monté qu'à l'ouverture.

Conséquence documentaire : charte v1.2 mise à jour au §1 (ligne du catalogue),
au §5 (mention « en aval ») et fiche de page `/cto-externalise` réécrite ;
`.claude/agents/coherence-seo-geo.md` réaligné, faute de quoi la passe SEO
suivante aurait rétabli 950 € et l'engagement de 3 mois en toute bonne foi.

Point laissé ouvert : la synthèse impose qu'**aucun contrat ne démarre sans
l'audit + roadmap préalable (650 € HT)**. La page l'indique dans son parcours de
démarrage, mais les autres sections de la synthèse (revue d'opportunité, flux
mensuel d'évolutions, traitement écrit du conflit d'intérêt) ne sont pas encore
publiées.
