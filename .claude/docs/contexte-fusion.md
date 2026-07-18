# Contexte partagé — Fusion « Comprendre » × base de ressources IA

> Ce fichier est la source de vérité du chantier. Tous les agents le lisent
> avant d'agir. Ne pas dupliquer son contenu dans les agents : y référer.

## Décision actée (17/07/2026)

**Fusion mappée, pas remplacement.** La section « Comprendre » (/documentation,
hub « Quelle techno web ? ») garde sa colonne vertébrale de rubriques de
décision reliées aux offres payantes. La base de ressources « Créer un site web
à l'heure de l'IA » vient l'irriguer. Une seule création structurelle : la
7e rubrique « Être trouvé à l'heure de l'IA » (SEO + GEO).

## Structure cible de la section

```text
Quelle techno web ? (hub — /documentation)
├── Choisir sa techno              ← + F1, F2 (angle IA injecté)
├── IA & code                      ← + clusters A et B (gros du volume nouveau)
├── Être trouvé à l'heure de l'IA  ← NOUVELLE rubrique = cluster C (SEO, GEO, AI Overviews)
├── Réparer ou refaire             ← + A7 (réparer un site généré par IA)
├── Avant de signer                ← + F3 (12 questions IA à poser au prestataire)
├── Outils métier                  ← + cluster E (chatbot, recherche sémantique, RAG, automatisation)
└── Présence et audience           ← + cluster D (contenu IA, E-E-A-T, images IA, AI Act)

Catégories existantes (Headless CMS, WordPress, SEO, Design & UI/UX,
Marketing Digital, Projet de site web) → rétrogradées en filtres/tags,
retirées de la navigation principale. Une seule taxonomie visible : les 7 rubriques.
```

## Mapping clusters → rubriques (source : analyse du 17/07/2026)

| Cluster | Contenus | Rubrique d'accueil |
|---|---|---|
| A — Créer son site avec l'IA | A0 panorama générateurs IA · A1 ChatGPT/IA générative · A2 v0/Lovable/Bolt · A3 builders IA (Wix, Hostinger, Framer) · A4 site IA vs pro (comparatif) · A5 vibe coding · A6 quand l'IA suffit/piège · A7 reprendre un site généré par IA | IA & code (A7 → aussi Réparer ou refaire) |
| B — L'IA dans la stack | B0 ce que l'IA change dans la stack · B1 WordPress et IA · B2 dev assisté par IA · B3 Next.js/Astro et moteurs génératifs · B4 dette technique du code IA · B5 maintenance à l'heure de l'IA · B6 sécurité des sites construits avec l'IA | IA & code + tags WordPress/Headless |
| C — Visibilité moteurs IA ⭐ | C0 SEO/GEO/AEO · C1 comment ChatGPT/Perplexity choisissent leurs citations · C2 guide GEO pour PME · C3 données structurées · C4 llms.txt/robots.txt/crawlers IA · C5 AI Overviews · C6 le SEO est-il mort · C7 structurer une page citable (méthode) · C8 mesurer sa visibilité IA | **Être trouvé à l'heure de l'IA** (nouvelle) — absorbe la catégorie SEO |
| D — Contenu, design et IA | D0 contenu IA opportunité/risque · D1 rédiger avec l'IA sans pénalité · D2 E-E-A-T · D3 images IA (droit, crédibilité) · D4 design assisté · D5 RGPD/AI Act · D6 le contenu moyen ne convertit pas | Présence et audience |
| E — Composants IA | E0 quels composants IA ont leur place · E1 chatbot · E2 recherche sémantique · E3 personnalisation · E4 automatisation formulaires/CRM · E5 RAG/base de connaissances · E6 IA dans une web app métier | Outils métier |
| F — Décider/cadrer | UNIQUEMENT F1 (combien coûte un site en 2026, tableaux chiffrés) et F3 (12 questions à poser au prestataire sur l'IA). F0/F2/F4/F5 : NE PAS créer — déjà couverts par Choisir sa techno / Avant de signer | F1 → Choisir sa techno · F3 → Avant de signer |

## Ordre de déploiement

1. **Vague 1 (prioritaire)** : rubrique « Être trouvé à l'heure de l'IA » (page
   d'arbitrage + C1 + C2) + diagnostic « votre site est-il visible dans les
   moteurs IA ? » + rétrogradation des catégories en tags + correction du meta
   title du hub.
2. **Vague 2** : A4, A6, A7 + F1.
3. **Vague 3** : C7 + checklist GEO téléchargeable + C3/C4.
4. **Vague 4** : F3, B0, B4.
5. **Vague 5** : élagage du stock Headless (35 → ~15 articles consolidés,
   redirections 301) puis clusters D et E au fil de l'eau.

Cadence : ~2 articles/mois. Ne jamais bloquer une vague pour finir la précédente
à 100 % — mais respecter l'ordre des priorités.

## Doctrine (à appliquer, pas à débattre)

- Le site doit **prouver avant de demander**. Chaque rubrique = page
  d'arbitrage + outil gratuit + escalier de CTA (outil gratuit → visio → cadrage).
- Classer par **bénéfice/question du prospect**, jamais par techno en accroche.
- L'angle d'entrée est la **douleur**, pas l'IA pour l'IA. Le fil rouge :
  « que doit faire votre site, pour qui, avec quelle équipe derrière ? »
- L'AGEFIPH/OETH est un accélérateur de fin de parcours, jamais l'argument d'entrée.
- **Un seul contenu par intention de recherche** : vérifier l'existant avant de créer.
- Ton : clair, pédagogique, expert sans jargon, honnête sur les limites,
  orienté décision. Public : décideurs non techniciens (DIRCOM, dirigeants,
  responsables com/marketing de structures 20–250 salariés).

## Socle GEO obligatoire (toute page nouvelle ou refondue)

1. TL;DR de 3-4 phrases citable sous le H1 (réponse directe, pas un teaser).
2. Hiérarchie Hn propre ; chaque H2 = une sous-question réelle, section autonome extractible.
3. FAQ en fin de page (3-7 questions) balisée `FAQPage`.
4. Schema JSON-LD : `Article` (+ `HowTo` si méthode pas à pas), `BreadcrumbList`,
   auteur `Person` (Agathe Karinthi-Martin) relié à `Organization` (Next Impact).
5. Dates de publication ET de dernière mise à jour visibles.
6. Tableaux comparatifs et chiffres explicites quand le sujet s'y prête
   (les moteurs IA citent les pages qui donnent des chiffres et des verdicts).
7. Verdict explicite par profil (« Pour une PME avec catalogue : non, parce que… »).
8. Maillage minimum : rubrique parente + 1 outil + 1 offre (conseil ou service)
   + 1 article complémentaire + 1 étude de cas si pertinente.
9. Liens sortants vers sources primaires (Google Search Central, CNIL, textes officiels).
10. robots.txt : GPTBot, ClaudeBot, PerplexityBot autorisés ; llms.txt à la racine.

## Incohérences connues à corriger

- Meta title du hub encore « Comprendre — WordPress Headless & Next.js » →
  aligner sur « Quelle techno web ? … à l'heure de l'IA ». (À corriger en vague 1 :
  `messages/fr.json` lignes 243-244 + pendant EN.)

## Décisions actées (journal des arbitrages)

- **Branche de travail (17/07/2026, décision par défaut — orchestrateur)** : le
  chantier vit sur la branche **`posit-conseil`** (branche déployée, seule à
  porter le hub « Quelle techno web ? » et les 6 rubriques). Le local
  `refonte-aspect` était obsolète ; son travail en cours est sauvegardé par le
  commit WIP `ee86e9e`. Tous les agents travaillent sur `posit-conseil`.
- **Tarifs conseil (17/07/2026, décision par défaut — à confirmer par Agathe)** :
  on retient **150 € (visio conseil) / 490 € (architecture)** = statu quo du
  site live, cohérent partout (aucune occurrence réelle de 180/390 dans le
  code — voir cartographie-contenu.md §8.7). Aucun agent n'introduit 180/390.
  Si Agathe tranche autrement, corriger les occurrences listées dans la
  cartographie AVANT tout nouveau contenu.
- **Slug de la 7e rubrique** : `etre-trouve` (route
  `/documentation/etre-trouve`), conforme à la commande d'orchestration.
- **Fourchette tarifaire GEO (18/07/2026, tranché par Agathe)** : la fourchette
  « 2 000–6 000 € en prestation GEO » est RETIRÉE de C2 (`guide-geo-pme.mdx`).
  Aucun contenu ne publie de fourchette de prestation GEO sans arbitrage
  explicite ; renvoyer vers le diagnostic gratuit puis `/conseil`.
- **Périmètre C5 (AI Overviews, à acter au verdict mode 1 de C5)** : C1
  (`comment-chatgpt-perplexity-choisissent-leurs-sources.mdx`) contient déjà un
  H2 court « Et Gemini et les AI Overviews ? » au niveau mécanique. C5 devra
  partir de là (angle : spécificités AI Overviews/AI Mode, pas la mécanique
  générale) pour éviter le doublon.
- **C0 (SEO/GEO/AEO) rendu redondant (17/07/2026)** : la page de rubrique
  `etre-trouve` porte les définitions SEO/GEO/AEO. Ne pas créer C0 sans
  verdict mode 1 explicite.
- **A6 fusionné dans A4 (18/07/2026, tranché par Agathe)** : A6 n'existe pas
  comme article ; A4 (`ia-et-code/site-genere-par-ia-vs-site-professionnel`)
  porte la section « Quand l'IA suffit / quand c'est un piège » avec verdicts
  par cas d'usage.
- **Chiffres F1 (18/07/2026, tranché par Agathe)** : F1 n'introduit AUCUNE
  fourchette de prestation nouvelle. E-commerce : traité en découpage par
  stack/CMS (WooCommerce sur WordPress, SaaS type Shopify, headless/sur-mesure)
  en s'appuyant sur les fourchettes déjà publiées par stack + les tarifs
  publics des SaaS (sourcés) — pas de fourchette e-commerce globale. Coût de
  reprise d'un site IA : qualitatif seulement (« de quelques centaines d'euros
  pour une stabilisation à un budget de refonte si tout est à reconstruire »),
  renvoi visio 150 €.
- **Règle AGEFIPH/TIH (18/07/2026, tranché par Agathe)** : la formulation
  correcte est « déduction de 30 % du coût de la main-d'œuvre de la
  prestation, plafonnée à 50 % ou 75 % de la contribution selon le taux
  d'emploi ». Le blog `combien-coute-wordpress-headless-2026-chiffre` (qui
  disait « 50 % du montant HT ») a été corrigé le 18/07. Tout contenu futur
  utilise cette formulation. AGEFIPH toujours en fin de parcours.

## Références projet (Claude.ai, projet « Next Impact »)

Arborescence détaillée avec requêtes cibles par cluster :
`claude/arborescence-ressources-ia-next-impact.md` · Analyse remplacement vs
fusion : `claude/analyse-comprendre-vs-base-ressources-ia.md` · Offre :
`synthese-offre-next-impact.md` et `evolution-offre-next-impact.md`.
Si un agent a besoin des requêtes cibles détaillées, demander à Agathe de
coller l'extrait pertinent, ou consulter ces docs si le projet est accessible.
