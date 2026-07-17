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
| 2 | A4, A6, A7, F1 | (chaîne verdict→rédaction) | ⬜ à faire | — |
| 3 | C7 + checklist GEO + C3/C4 | (chaîne verdict→rédaction) | ⬜ à faire | — |
| 4 | F3, B0, B4 | (chaîne verdict→rédaction) | ⬜ à faire | — |
| 5 | Élagage Headless 35→~15 (plan soumis à Agathe AVANT modification) | architecte-fusion | ⬜ à faire | — |

## Bloquants / à confirmer par Agathe

- Tarif 150/490 retenu par défaut (statu quo live). Si 180/390 préféré :
  corriger les occurrences listées en cartographie §8.7 avant tout contenu.
- **B1 (bloque la publication de C2)** : fourchette « 2 000–6 000 € en
  prestation GEO » non sourcée, présente 3× dans `guide-geo-pme.mdx` (dont
  FAQPage JSON-LD) — Agathe doit valider/sourcer ou faire retirer.
- Avertissements audit vague 1 (corrigeables après publication, A1 en
  priorité — contradiction GPTBot/OAI-SearchBot entre C1, la rubrique et
  l'outil) : voir audit-vague-1.md.
- Meta title du hub : variantes alternatives dans le message du commit
  `1968e8d` si un autre angle est préféré.
- Push : jamais sans demande explicite d'Agathe (commits locaux seulement).

## Notes

- Cartographie complète : `.claude/docs/cartographie-contenu.md` (2026-07-17).
- Décisions actées : section « Décisions actées » de `contexte-fusion.md`.
- Doublons potentiels clusters vs existant : cartographie §8.5 (à passer au
  vérificateur avant chaque rédaction).
