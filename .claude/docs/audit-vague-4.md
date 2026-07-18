# Audit de vague 4 — mode 2 (verificateur-coherence, 2026-07-18)

Périmètre : commits `6dc1e75` → `becbfe1` sur `posit-conseil`. 5 URLs externes
testées (toutes 200), chiffres GitClear/DORA recoupés aux sources, 15 FAQ
nouvelles croisées avec les ~40 existantes. Non vérifié : Search Console.

## BLOQUANTS

Aucun.

## Avertissements — traités par l'orchestrateur le 18/07 (commit post-audit)

- **A1 (traité)** — La FAQ 2 de B0 (« Les agences web utilisent-elles l'IA ?
  Est-ce un problème ? ») empiétait sur la méta-question prescrite à F3
  (« Faut-il fuir un prestataire qui utilise l'IA ? »), mêmes conclusions.
  → FAQ 2 de B0 recentrée sur l'angle panorama (« Quelle proportion des
  professionnels du web travaille avec l'IA en 2026 ? », chiffre DORA
  conservé), avec lien vers F3.
- **A2 (traité)** — Liens internes résiduels vers `/tarifs` (301 →
  `/solutions-web`) : corrigés dans `hub-rubriques.tsx` (×4),
  `documentation-internal-links.tsx` (×2), `home-offres.tsx`,
  `app/[locale]/outils/page.tsx` (×2), `boussole.tsx`, `hub-themes.ts`
  (rubrique choisir), `tools.tsx` (×2). Conservé tel quel :
  `cta-section.tsx:346` (matcher de préfixes de routes, pas un lien).
  Réserve d'étiquette : « Simulateur de tarifs » pointe une page solutions,
  pas un simulateur — reformulation ou vrai outil à prévoir (hérité).

## Observations (conformes)

1. Frontière interne F3/B0/B4 tenue ; requête interdite d'A4 évitée ; aucun
   lien mort vers B1/B5/B6 futurs.
2. F3 : exactement 12 questions, pattern pourquoi/bonne réponse/signal
   d'alarme tenu, FAQ = 5 méta-questions distinctes.
3. B4 : chiffres GitClear 2025 et DORA 2024/2025 vérifiés aux sources, tous
   exacts ; aucune fourchette de coût ; Stanford une phrase + lien A4.
4. Socle GEO : F3 10/10, B4 10/10, B0 9,5/10 (verdicts par dimension plutôt
   que par profil — défendable pour un panorama).
5. Maillage : toutes cibles existantes ; liens croisés F3↔B0↔B4 vivants dans
   les deux sens.
6. Infra avant-signer propre (labels, breadcrumb, reading, llms.txt) ; orders
   ia-et-code sans collision (A4=1, A7=2, B0=3, B4=4).
7. Cohérence commerciale : 150/490 uniquement, escalier respecté, AGEFIPH
   strictement absent (y compris F3 sur garantie/responsabilité).
8. Anti-régression : aucune modification d'article existant, vagues 1-3
   intactes ; héritage A3 (rich snippets WordPress) toujours pour la vague 5.
9. Mineurs ouverts : `.gitkeep` redondants ; EN en fallback FR (assumé) ;
   cas `default` de documentation-internal-links pour les 4 rubriques
   (observation v1) ; adjacence B0-FAQ5/B4-FAQ1 à surveiller.

## Verdict

**Vague 4 publiable en l'état** (zéro bloquant). A1-A2 traités le jour même.
