# Journal de bord — chantier fusion-comprendre

> Mis à jour par l'orchestrateur après chaque étape. Permet de reprendre le
> chantier dans une session fraîche. Branche de travail : `posit-conseil`.

## Tableau de suivi

| Vague | Tâche | Agent | Statut | Date |
|---|---|---|---|---|
| 0 | Cartographie du contenu (→ cartographie-contenu.md) | cartographe-contenu | ✅ fait | 2026-07-17 |
| 0 | Bascule du chantier sur la branche `posit-conseil` (WIP refonte-aspect sauvegardé : `ee86e9e`) | orchestrateur | ✅ fait | 2026-07-17 |
| 0 | Arbitrage tarifs : 150/490 retenu par défaut (à confirmer par Agathe) | orchestrateur | ✅ documenté | 2026-07-17 |
| 1 | Structure : rubrique `etre-trouve` (textes provisoires) + meta title hub + JSON-LD 7 rubriques + sitemap complété + frontmatter `updated` + garde 404 — build vert, commits `c891945`/`1968e8d`/`82cbeff`/`fbad5f1` | architecte-fusion | ✅ fait | 2026-07-17 |
| 1 | Verdict anti-cannibalisation C1, C2 + page de rubrique : **3 × CRÉER** (→ verdicts-vague-1.md) | verificateur-coherence (mode 1) | ✅ fait | 2026-07-17 |
| 1 | Rédaction page de rubrique etre-trouve : textes définitifs (H1 « Comment être visible dans ChatGPT… », TL;DR SEO/GEO/AEO — C0 rendu redondant, acté) | redacteur-seo-geo | ✅ fait | 2026-07-17 |
| 1 | Rédaction C1 — `comment-chatgpt-perplexity-choisissent-leurs-sources.mdx` (FAQ ×5, sources primaires OpenAI/Perplexity/Princeton) | redacteur-seo-geo | ✅ fait | 2026-07-17 |
| 1 | Rédaction C2 — `guide-geo-pme.mdx` (FAQ ×5, verdicts 3 profils, sources primaires) | redacteur-seo-geo | ✅ fait | 2026-07-17 |
| 1 | Diagnostic « votre site est-il visible dans les moteurs IA ? » (route `/outils/visibilite-ia`, scoring 4 axes, tests OK, carte /outils) | batisseur-outils | ✅ fait | 2026-07-17 |
| 1 | Audit de vague : **publiable sous réserve B1** (fourchette 2 000–6 000 € de C2 à arbitrer) — rapport : audit-vague-1.md | verificateur-coherence (mode 2) | ✅ fait | 2026-07-17 |
| 2 | Verdicts mode 1 : A4 CRÉER (absorbe A6), A6 RENONCER, A7 CRÉER, F1 CRÉER (→ verdicts-vague-2.md) | verificateur-coherence | ✅ fait | 2026-07-18 |
| 2 | Arbitrages Agathe : fusion A6→A4 ✓, AGEFIPH 30 % main-d'œuvre ✓ (blog corrigé), chiffres F1 = existant + découpage e-commerce par stack ✓ | orchestrateur | ✅ fait | 2026-07-18 |
| 2 | Infra catégorie `ia-et-code` (labels, reading, renvoi reparer→A7, lien pilier→A4, llms.txt) — commits `8e9408a`…`2cdda1f` | architecte-fusion | ✅ fait | 2026-07-18 |
| 2 | Rédaction A7 — `reprendre-un-site-genere-par-ia.mdx` (commit `c3f8226`) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 2 | Rédaction A4 — `site-genere-par-ia-vs-site-professionnel.mdx` (tableau 10 critères, verdicts 5 cas d'usage ex-A6) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 2 | Rédaction F1 — `choisir/combien-coute-un-site-web-en-2026.mdx` (100 % fourchettes publiées, e-commerce par stack) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 2 | Audit de vague : 3 bloquants + A1-A3 **corrigés le jour même** → **publiable** (rapport : audit-vague-2.md) | verificateur-coherence (mode 2) + orchestrateur | ✅ fait | 2026-07-18 |
| 3 | Verdicts mode 1 : **3 × CRÉER** + matrice des frontières (→ verdicts-vague-3.md) ; bloquant blog migration SEO (GPTBot) corrigé | verificateur-coherence + orchestrateur | ✅ fait | 2026-07-18 |
| 3 | Rédaction C7 — `structurer-une-page-citable-par-les-moteurs-ia.mdx` (howto 8 étapes) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 3 | Intégration : HowToJsonLd + frontmatter `howto` + reading rubrique + retouches C2 (commits `ed1e013`/`2051c39`/`3e4bd4f`) | architecte-fusion | ✅ fait | 2026-07-18 |
| 3 | Checklist GEO (`/outils/checklist-geo`, 24 actions, print-PDF, tests verts, llms.txt complété) — commits `5d1c26f`/`ae67648` | batisseur-outils | ✅ fait | 2026-07-18 |
| 3 | Rédaction C3 — `donnees-structurees-moteurs-ia.mdx` (fait vérifié : rich results FAQ retirés mai 2026) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 3 | Rédaction C4 — `llms-txt-robots-txt-crawlers-ia.mdx` (15 robots, 3 politiques) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 3 | Audit de vague : 3 bloquants + A1-A2 **corrigés le jour même** → **publiable** (rapport : audit-vague-3.md) | verificateur-coherence (mode 2) + orchestrateur | ✅ fait | 2026-07-18 |
| 4 | Verdicts mode 1 : F3 CRÉER, B4 CRÉER, B0 CRÉER recentré décideur (arbitré par Agathe ; B2 présumé fusionné) — verdicts-vague-4.md | verificateur-coherence + Agathe | ✅ fait | 2026-07-18 |
| 4 | Infra : dossier avant-signer + labels + reading (F3, B4, B0) + correction lien /tarifs — commits `2ab462e`/`6367827` | architecte-fusion + orchestrateur | ✅ fait | 2026-07-18 |
| 4 | Rédaction F3 — `avant-signer/12-questions-ia-a-poser-a-votre-prestataire.mdx` | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 4 | Rédaction B0 — `ia-et-code/ce-que-l-ia-change-dans-la-creation-d-un-site-web.mdx` (chapeau cluster B, 7 dimensions avec verdicts) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 4 | Rédaction B4 — `ia-et-code/dette-technique-du-code-genere-par-ia.mdx` (GitClear 2025, DORA 2024/2025) | redacteur-seo-geo | ✅ fait | 2026-07-18 |
| 4 | Audit de vague (build vert au préalable) | verificateur-coherence (mode 2) | 🔄 en cours | 2026-07-18 |
| 5 | Élagage Headless 35→~15 (plan soumis à Agathe AVANT modification) | architecte-fusion | ⬜ à faire | — |

## Bloquants / à confirmer par Agathe

- Tarif 150/490 retenu par défaut (statu quo live). Si 180/390 préféré :
  corriger les occurrences listées en cartographie §8.7 avant tout contenu.
- ~~B1~~ tranché par Agathe le 18/07 : fourchette 2 000–6 000 € RETIRÉE de C2
  (3 emplacements). Décision actée dans contexte-fusion.md.
- ~~A1-A4~~ corrigés le 18/07 : OAI-SearchBot ajouté (rubrique + outil),
  `updated` sur C2, lien Gartner posé, périmètre C5 consigné dans le contexte.
- **Pages React AGEFIPH (audit vague 2, point A4) — décision Agathe attendue** :
  `articles/attestation-deductibilite-tih-guide-entreprises` calcule une
  déduction de 9 % du HT (30 % × 30 %), en contradiction avec la règle actée
  « 30 % du coût main-d'œuvre » et avec l'autre page AGEFIPH. Meta title
  d'`/avantage-oeth` également inexact. Domaine réglementaire → ne pas
  corriger sans arbitrage.
- Meta title du hub : variantes alternatives dans le message du commit
  `1968e8d` si un autre angle est préféré.
- Push : jamais sans demande explicite d'Agathe (commits locaux seulement).

## Notes

- Cartographie complète : `.claude/docs/cartographie-contenu.md` (2026-07-17).
- Décisions actées : section « Décisions actées » de `contexte-fusion.md`.
- Doublons potentiels clusters vs existant : cartographie §8.5 (à passer au
  vérificateur avant chaque rédaction).
