# Audit de vague 2 — mode 2 (verificateur-coherence, 2026-07-18)

Périmètre : commits `bc4cce3` → `fc3506a` sur `posit-conseil`. Liens externes
testés (tous 200), grille Shopify vérifiée live le 18/07. Non vérifié :
Search Console.

## BLOQUANTS (3) — corrigés par l'orchestrateur le 18/07 (commit post-audit)

- **B1 — F1 publiait une borne modifiée** « 15 à 30 % du budget initial/an »
  (maintenance web app) en 3 emplacements dont FAQPage JSON-LD, alors que la
  source publie 15-25 % en année 1 puis 15-20 %/an. → Réaligné sur les bornes
  publiées (frontmatter, tableau, FAQ visible).
- **B2 — F1 orphelin de sa rubrique** : le `reading` de `choisir`
  (`lib/hub-themes.ts`) ne listait pas F1. → Entrée ajoutée (icône Calculator).
- **B3 — Blog headless : résidu AGEFIPH** « peut réduire ce coût de moitié »
  (l.133) contredisait le §TIH corrigé de la même page. → « d'environ 30 % ».

## Avertissements — traités le 18/07 sauf A4

- **A1 (traité)** — Question FAQ dupliquée verbatim A7/F1 (« Combien coûte la
  reprise d'un site généré par IA ? ») avec réponses divergentes. → Question
  A7 reformulée (« Comment un professionnel chiffre-t-il… »), fond harmonisé
  avec le qualitatif acté, lien vers F1 ajouté.
- **A2 (traité)** — A7 sans lien corps vers sa rubrique parente. → Lien
  `/documentation/ia-et-code` ajouté dans l'intro.
- **A3 (traité)** — Incohérence interne pré-existante du blog headless :
  intro « 200 à 600 €/an » vs tableau « 510 à 1 355 € ». → Intro alignée.
- **A4 (EN ATTENTE — décision Agathe)** — Pages React AGEFIPH pré-existantes :
  `app/[locale]/articles/attestation-deductibilite-tih-guide-entreprises/page.tsx`
  l.116 et l.247-252 combine « part main-d'œuvre = 30 % du HT » × « déduction
  = 30 % de la part main-d'œuvre » (soit 9 % du HT), en contradiction avec la
  règle actée et avec `reduire-contribution-agefiph-sous-traitance-tih`
  (l.317 : 30 % de la prestation). Le meta title d'`/avantage-oeth` (l.21
  « Déduisez 30 % de votre contribution AGEFIPH ») est aussi un raccourci
  inexact. Domaine réglementaire d'Agathe → à trancher avant correction.

## Observations mineures

1. (traité) TL;DR F1 minorait la fourchette web app (12–50 k€) → « 12 à
   150 k€ selon la complexité ».
2. F1 classe v0 en « builder IA » là où A4 le distingue en « générateur
   d'applications » — taxonomie à harmoniser un jour, non bloquant.
3. F1 généralise le TJM 350–650 € (publié comme TJM d'Agathe) en tarif de
   marché — même borne, portée élargie, non bloquant.
4. A4 : tableau 10 critères englobe les 5 critères du pilier mais appliqués à
   la comparaison à deux, avec déférence explicite — pas de cannibalisation,
   à surveiller.
5. `.gitkeep` résiduel dans `ia-et-code/` (sans effet).

## Conformité vérifiée

Chiffres F1 : conformes chiffre par chiffre aux sources (hors B1 corrigé) ;
e-commerce par stack comme acté ; Shopify 25→289 €/mois (annuel) confirmé
live ; reprise IA qualitative au mot près. A4/A7 : aucune fourchette de
prestation. Tarifs 150/490 partout. AGEFIPH : formulation actée, fin de
parcours, jamais en accroche. Anti-cannibalisation tenue (A4 vs pilier, A4 vs
A7, F1 vs sources). Maillage : toutes cibles valides, liens croisés A4↔A7
vivants, renvoi reparer→A7 cadré. Socle GEO : A4 10/10, A7 9,5/10, F1 9/10
(avant corrections). Aucune régression vague 1.

## Verdict

Après corrections des 3 bloquants et de A1-A3 (18/07) : **vague 2 publiable**.
Reste ouvert : A4 (pages React AGEFIPH) — décision Agathe.
