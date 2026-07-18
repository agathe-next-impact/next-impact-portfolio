# Audit de vague 1 — mode 2 (verificateur-coherence, 2026-07-17)

Périmètre : commits `c891945` → `cf4d2b7` sur `posit-conseil`. Constats sur
l'état commité ; le working tree porte des modifications hors périmètre
(contact, solutions-web, home…) non auditées.

## BLOQUANT (1)

**B1 — Fourchette « 2 000 à 6 000 € » non sourcée, publiée 3 fois dont dans le
JSON-LD FAQPage.** `guide-geo-pme.mdx` : frontmatter FAQ l.14, corps l.77, FAQ
visible l.123. Chiffre commercial engageant sans source ni arbitrage documenté,
injecté dans le balisage `FAQPage` donc directement citable par les moteurs IA.
**Ne pas publier C2 avant l'arbitrage d'Agathe** : sourcer/assumer la fourchette
(et l'acter dans contexte-fusion.md), ou la retirer des 3 emplacements.

## Avertissements (non bloquants)

- **A1 — Contradiction GPTBot/OAI-SearchBot.** C1 (l.13, 40-41, 112) dit
  correctement que bloquer GPTBot n'empêche pas d'apparaître dans ChatGPT
  Search (bot : OAI-SearchBot). Mais `lib/hub-themes.ts` l.990-994 et
  `lib/visibilite-ia.ts` l.60-91 utilisent le raccourci « GPTBot bloqué =
  invisible », OAI-SearchBot absent. Un prospect attentif voit la
  contradiction. Correction : ajouter OAI-SearchBot ou reformuler
  (« les robots de recherche IA »). À traiter vite.
- **A2 — C2 sans frontmatter `updated`** (l.6-7) : pas de « Mis à jour »
  visible ni `updatedIso` dans le JSON-LD, alors que l'article annonce
  « revu tous les 2-3 mois ». Ajouter `updated: "2026-07-17"`.
- **A3 — C1 § « Et Gemini et les AI Overviews ? » (l.62-64)** : empiètement
  léger sur C5 ; pas de cannibalisation aujourd'hui (la section défère), mais
  à retrancher du périmètre de C5 lors de son verdict mode 1 (vague 3+).
- **A4 — Source Gartner non liée** (C2 l.39 et l.142, « −25 % d'ici 2026 ») :
  chiffre réel (communiqué fév. 2024) mais sans URL — seule entorse au socle
  point 9.

## Observations (mineures)

1. Commentaire périmé « textes provisoires » `lib/hub-themes.ts` l.931-932.
2. Commentaire périmé sitemap l.153-154.
3. Clés mortes `documentationPage.title`/`.subtitle` (« Comprendre …
   WordPress Headless ») dans fr/en.json — aucun consommateur ; supprimer ou
   aligner.
4. llms.txt § Tools : le diagnostic visibilité IA n'y figure pas — ajouter.
5. `documentation-internal-links.tsx` l.519-527 : cas `default` pour
   `etre-trouve` ; entrée dédiée souhaitable (visibilite-ia + conseil).
6. Pas de `WebApplicationJsonLd` sur l'outil (cohérent avec les frères ;
   opportunité GEO).
7. Aucune étude de cas GEO à mailler (acceptable, socle « si pertinente »).
8. Grille hub 3 colonnes × 7 cartes → rangée de 1 en desktop (cosmétique).
9. `c891945` embarque un correctif non annoncé (clés `caseStudyDetail.arbitrage*`
   en.json — bénéfique).
10. Dates ISO brutes dans le header d'article (pattern pré-existant).
11. `.gitkeep` résiduel dans `content/documentation/etre-trouve/`.
12. Breadcrumb EN avec labels FR (pré-existant, toutes catégories).
13. Non vérifié : Search Console.

## Conformité (synthèse)

Anti-cannibalisation : conforme sur les 3 contenus (rubrique = arbitrage,
C1 = mécanique, C2 = plan d'action, renvois explicites). Maillage : tous les
liens testés valides, aucun lien mort. Socle GEO : 10/10 sur C1, 9/10 sur C2
(A2, A4). Tarifs : 150/490 partout, aucune occurrence 180/390 dans le repo,
AGEFIPH jamais en accroche. FR/EN : rubrique et outil bilingues, C1/C2 en
fallback FR propre. Anti-régression : aucun article existant modifié.

## Verdict global

**Vague 1 publiable sous une seule réserve : l'arbitrage B1 (fourchette
2 000–6 000 € de C2) — validation sourcée ou retrait avant mise en ligne.**
A1-A4 corrigeables après publication ; A1 en priorité.
