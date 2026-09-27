# Plan · Offres en trois moments (Décider · Refaire · Tenir)

Branche `offres-trois-moments`, partie de `dev` (b610a6d) le 2026-09-27.
Maquette de référence : canvas « Offres en trois moments » (claude.ai).
Décision tracée : ADR-012 (`docs/decisions.md`). Charte amendée en v1.4.

> Amendé le 2026-09-27 par l'ADR-013 (charte v1.5). Les moments s'appellent
> désormais Diagnostiquer · Évoluer · Gérer. Le catalogue compte sept lignes.
> Sentinelle sort du catalogue, « Gérer » présente deux offres, la home ne
> montre en cartes que les trois trajectoires. Ce plan reste le relevé de ce
> qui a été fait pour l'ADR-012 ; les principes 1 et 5 ci-dessous se lisent
> avec ces amendements.

## Objectif

Rendre le catalogue lisible pour un prospect froid alors qu'il passe de six à
dix lignes : Sentinelle (veille et alertes personnalisées) et une offre de
suivi et maintenance entrent au catalogue, l'espace en ligne devient une
preuve visible. Le visiteur ne choisit pas dans dix lignes : il se situe dans
un des trois moments, ou le diagnostic le situe pour lui.

## Principes de cohérence (valables sur tout le site)

1. Trois moments, trois offres au plus par moment, une seule mise en avant.
   - Décider : Visio conseil refonte 150 € HT · Audit + roadmap 650 € HT · la
     veille gratuite (lettre, ressources, outils).
   - Refaire : Consolider · Découpler (recommandée) · Refonder. Refonte ou
     création, mêmes forfaits.
   - Tenir : Sentinelle 19 €/mois · Suivi et maintenance (à partir de 89 € HT
     par mois) · Expert technique externalisé (à partir de 900 € HT par mois).
2. Une carte d'offre au même gabarit partout : situation, résultat, un prix
   « à partir de », une action.
3. Les paliers ne vivent que sur la page de l'offre et sur `/tarifs`.
4. Un seul bouton froid : l'analyse du site (`/scan`), libellé fixe
   « Analysez votre site en 2 minutes » (l'ancien libellé « Voyez ce qui
   ralentit votre site » promettait une mesure de vitesse que l'analyse ne
   fait pas). Le bouton chaud reste « Discutons de votre projet ».
5. Les abonnements n'entrent jamais dans un héros ni dans le bouton froid ;
   dans le menu et sur la home ils arrivent en dernier.
6. Chaque prix est lu depuis sa source unique dans `lib/` : aucun prix recopié.

## Sources de vérité

| Donnée | Fichier |
|---|---|
| Suivi et maintenance (paliers, conditions, drapeau de validation) | `lib/maintenance-offer.ts` (nouveau) |
| Sentinelle | `lib/sentinelle-offer.ts` (existant) |
| Expert technique externalisé | `lib/cto-externalise.ts` (existant) |
| Menu Décider · Refaire · Tenir | `lib/mega-menu.ts` |

## Lots

1. **Charte et décision** : charte v1.4 (§1 catalogue, §5, §6 nouvelles pages,
   §7 navigation et libellés fixes, §10 garde-fous), ADR-012, CLAUDE.md.
2. **Source de l'offre maintenance** : `lib/maintenance-offer.ts`, avec
   `MAINTENANCE_PRIX_VALIDES = false` tant qu'Agathe n'a pas validé les prix :
   la page reste en noindex, hors sitemap et hors llms.
3. **Navigation** : mega menu Décider · Refaire · Tenir, clés i18n `nav`,
   bouton du header vers `/scan`, lien « Espace client ».
4. **Home** : `home-offres.tsx` réécrit en trois moments ; `home-diagnostic`
   pointe vers l'analyse du site.
5. **Nouvelles pages** : `/maintenance-wordpress` (page d'offre + page
   d'atterrissage du moment Tenir) et `/espace-client` (visite de l'espace en
   ligne + accès aux deux connexions).
6. **Sentinelle** : retour dans l'index (sitemap, llms), tirets cadratins
   retirés, pont vers la maintenance.
7. **Pages d'offre** : `/solutions-web` (bandeau « Après la livraison »,
   création), `/cto-externalise` et `/conseil` (renvois), `/tarifs`,
   formulaire de contact (sujets), footer.
8. **Redirection** : `/audit-site-web` et `/audit-site-ia` vers `/scan` au lieu
   de Calendly (tous les anciens liens froids du site retrouvent un diagnostic).
9. **SEO/GEO** : agent `coherence-seo-geo`, puis build.

## Hors périmètre (à faire ensuite)

- Rapport de `/scan` : pont vers la visio quand le verdict est mauvais (code
  Sentinelle, soumis à `docs/sentinelle/CLAUDE.md`).
- Service `projet` dans l'espace en ligne (suivi d'une refonte).
- Version anglaise des nouvelles pages (charte §3 : après validation du FR).

## Intégration sans conflit

- Travail dans un worktree séparé ; le répertoire de travail de `dev` (espace
  CTO en cours) n'est pas touché.
- Aucun fichier de `src/cto/`, `app/(cto)/`, `src/sentinelle/`,
  `app/(sentinelle)/` modifié.
- Avant de rendre la branche : fusion d'essai avec la pointe de `dev`
  (`git merge-tree`) et vérification qu'aucun fichier modifié ici ne figure
  dans les modifications non commitées de `dev`.
