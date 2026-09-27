# Plan · Offres par situation

2026-09-27, branche `offres-trois-moments`. Statut : mis en œuvre le jour même,
non commité. Décision tracée : ADR-014 (`docs/decisions.md`). Charte amendée en
v1.6.

## Objectif

Structurer l'offre par situation et par besoin, et non par type d'offre. Le
visiteur part de son besoin, reconnaît sa situation, arrive au pack qui y
répond. Chaque page de pack est la page d'atterrissage d'un message de
prospection : un message par situation, une page par message.

## Arbitrages d'Agathe (2026-09-27)

| Question | Arbitrage |
|---|---|
| Prix du suivi, site WordPress | Essentiel 89 € HT, Actif 249 € HT par mois |
| Prix du suivi, site headless | Essentiel 129 € HT, Actif 299 € HT par mois |
| Prix du suivi, web app | Essentiel 129 € HT, Actif 299 € HT par mois |
| Mot affiché | « Pack » |
| Structure | Par groupe de besoin ; le besoin mène au pack par la situation précise |
| Besoins | « Je veux pouvoir décider » · « Je veux faire évoluer mon site web » · « Je veux agir dans la durée » |
| Pages | Pages nouvelles |
| Noms des prestations | Optimisation (ex-Consolider) · Refonte (ex-Découpler) · Évolution (ex-Refonder) |
| Veille technique et stratégique | Dans chaque offre : première analyse dans l'audit et les prestations, en continu dans le suivi et la direction technique. Caractéristique différenciante, à mettre en avant |

## Les six packs

Chaque pack se désigne par un seul terme (ADR-016) : Arbitrage, Optimisation,
Refonte, Évolution, Maintenance, Pilotage, dans l'ordre du tableau. La
situation n'est plus qu’une ligne « pour qui ».

Budgets planchers, hors taxes, calculés dans `lib/situations.ts`.

| Besoin | Situation | Avant | Pendant | Après | Budget |
|---|---|---|---|---|---|
| Je veux pouvoir décider | « J'ai un devis à juger, ou une décision à prendre » | Analyse du site, gratuite | Visio conseil refonte 150 € | Audit + roadmap 650 € si la décision engage un budget | 150 €, en une fois (800 € avec l'audit) |
| Je veux faire évoluer mon site web | « Mon site est devenu ingérable » | Visio 150 €, déduite | Optimisation, à partir de 2 250 € | 3 mois inclus, puis Essentiel 89 € par mois | 3 051 € la première année |
| Je veux faire évoluer mon site web | « Mon site est lent, et mon équipe publie dans WordPress » (recommandé) | Visio 150 €, déduite | Refonte, à partir de 4 000 € | 3 mois inclus, puis Essentiel 129 € par mois | 5 161 € la première année |
| Je veux faire évoluer mon site web | « Mon site est devenu un outil de travail » | Audit + roadmap 650 € | Évolution, à partir de 6 500 € | 3 mois inclus, puis Essentiel 129 € par mois | 8 311 € la première année |
| Je veux agir dans la durée | « Mon site tourne, je veux qu'il le reste » | Analyse du site, gratuite | Mise sous suivi 290 €, une fois | Essentiel 89 € par mois | 1 358 € la première année (1 180 € payé à l'année) |
| Je veux agir dans la durée | « Des décisions techniques reviennent tous les mois, personne pour les trancher » | Audit + roadmap 650 € | Expert technique externalisé, Référent 900 € par mois | Reconduction au mois | 6 050 € les six premiers mois |

Chaque budget donne aussi sa variante : palier Actif après les mois inclus,
paiement annuel, palier Direction technique.

## Ce qui a été fait

| Élément | Fichier |
|---|---|
| Nom et montant des trois prestations | `lib/trajectoires.ts` (nouveau) |
| Besoins, situations, packs, budgets, veille, contenu des pages | `lib/situations.ts` (nouveau) |
| Grille du suivi par type de site, drapeau de validation à true | `lib/maintenance-offer.ts` |
| Pages de pack et index | `app/[locale]/packs/[slug]/page.tsx`, `app/[locale]/packs/page.tsx` (nouveaux) |
| Briques partagées : bloc de veille, ligne de situation, paire de boutons | `components/packs/pack-parts.tsx` (nouveau) |
| Home : trois colonnes par besoin, cartes de situation, bloc de veille | `components/home-offres.tsx` |
| Menu : panneaux par besoin, cases par situation | `lib/mega-menu.ts` |
| Tarifs : packs par besoin, puis catalogue ; grille du suivi | `components/tarifs/tarifs-moments.tsx` |
| Suivi et maintenance : grille, veille en continu, FAQ | `app/[locale]/maintenance-wordpress/page.tsx` |
| Prestations : noms et prix lus dans la source, veille dans « ce qui est inclus » | `components/services/PricingCards.tsx`, `components/services/ServicesClient.tsx` |
| Audit + roadmap : première analyse de veille dans les puces | `lib/visio-conseil.ts` |
| « En bref » et FAQ de la home, onglet du héros | `lib/home-content.ts`, `components/hero.tsx` |

## Règles à tenir

- Un pack assemble, il ne crée rien : ni ligne, ni prix, ni remise. Il se
  désigne par un seul terme (ADR-016), jamais par sa phrase de situation.
- Le titre d'une carte, d'une case du menu ou d'une page de pack est une
  situation.
- Un budget est calculé, jamais écrit en dur.
- Une offre se présente avec sa veille : première analyse ou en continu.
- Les abonnements restent la dernière étape d'un parcours et la dernière
  colonne de la home.
- Pas de bloc AGEFIPH : les directives v3.1 l'ont retirée du site.

## Reste à arbitrer par Agathe

1. Le montant de la mise sous suivi, 290 € HT, repris de la proposition.
2. La règle « Actif obligatoire en headless » a été retirée : les deux paliers
   existent pour chaque type de site. Les trois mois inclus sont au palier
   Essentiel. À confirmer.
3. Les noms des paliers : Essentiel et Actif sont conservés. « Maintenance
   simple » contient un mot banni par la charte §3.
4. Le moment « Évoluer » contient la prestation « Évolution » ; l'onglet
   « Refonte » du héros désigne les trois prestations.
5. La carte de la prestation web app annonce encore « Support prioritaire 12
   mois », contre trois mois de suivi inclus (déjà relevé dans l'ADR-013).

## Reste à faire

- Version anglaise des pages de pack, après validation du français.
- Les noms Consolider, Découpler, Refonder dans la documentation, les outils,
  les études de cas et le hub : passe de cohérence, par lot.
- Les textes de prospection (cold mail, LinkedIn) : un message par situation,
  vers la page de pack correspondante.
