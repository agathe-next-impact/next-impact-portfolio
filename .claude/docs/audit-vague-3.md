# Audit de vague 3 — mode 2 (verificateur-coherence, 2026-07-18)

Périmètre : commits `73f446a` → `5046af6` sur `posit-conseil`. 21 URLs
externes testées, toutes 200. Non vérifié : Search Console.

## BLOQUANTS (3) — corrigés par l'orchestrateur le 18/07 (commit `3b82f42`)

- **B1** — Le blog EN `content/en/blog/migrer-wordpress-vers-headless-sans-
  casser-seo.mdx` l.59 gardait la fausse affirmation « Blocking GPTBot removes
  your site from ChatGPT Search » (la correction du 18/07 n'avait touché que le
  FR), en contradiction frontale avec C4. → Aligné sur la formulation FR.
- **B2** — La checklist (`lib/checklist-geo.ts` item `llms-txt`) qualifiait le
  llms.txt de « standard récent… signal d'avance », à rebours du verdict
  d'honnêteté de C4 (« proposition communautaire, aucun système ne l'utilise
  actuellement — pas un levier »). → Requalifié (FR+EN), répercuté dans le PDF
  (même source de texte).
- **B3** — Résurgence de la confusion rôles de bots : la carte conseil de la
  rubrique (`hub-themes.ts`), la question du diagnostic (`visibilite-ia.ts`)
  et l'item robots.txt de la checklist étiquetaient GPTBot/ClaudeBot « robots
  de recherche IA » dont le blocage rend invisible — C4 établit qu'ils servent
  à l'entraînement, sans coût de visibilité. → Les trois surfaces distinguent
  désormais recherche (OAI-SearchBot, PerplexityBot) et entraînement
  (GPTBot, ClaudeBot).

## Avertissements — traités le 18/07 sauf A3

- **A1 (traité)** — C3 sans lien corps vers sa rubrique parente. → Lien ajouté
  au CTA final.
- **A2 (traité)** — `app/robots.txt/route.ts` ne nommait pas Claude-SearchBot,
  Claude-User ni CCBot (présents dans le tableau de C4 qui renvoie vers ce
  fichier). → Ajoutés ; user-agents dépréciés (anthropic-ai, Claude-Web)
  conservés (inoffensifs).
- **A3 (vague 5)** — `wordpress/bonnes-pratiques-wordpress.mdx` l.95/l.220
  (FR+EN) promet encore des « rich snippets » génériques — daté depuis le
  retrait des rich results FAQ (mai 2026, sourcé dans C3). À raboter lors de
  l'élagage. Le stock `seo/*` est propre sur ce point.

## Observations (conformes)

1. Frontières internes C7/C3/C4 : tenues ligne par ligne contre la matrice ;
   aucune FAQ dupliquée entre les 5 articles etre-trouve (25 questions
   distinctes).
2. HowTo : frontmatter C7 conforme au format câblé, JSON-LD valide, 8 steps =
   8 H2 visibles.
3. Checklist ↔ contenus : fidèle (hors B2/B3 corrigés) ; escalier CTA conforme.
4. Socle GEO : C7 10/10 ; C3 et C4 9,5/10 (demi-points : A1 corrigé ; CTA C4
   sans barreau 490 € — mineur).
5. Maillage : toutes cibles existantes, liens croisés vivants, sitemap et
   llms.txt à jour (obs. 4 de l'audit v1 soldée par le batisseur).
6. Tarifs 150/490 uniquement, AGEFIPH absent, aucune fourchette de prestation.
7. Anti-régression : seul `guide-geo-pme.mdx` modifié, strictement dans le
   mandat ; vagues 1-2 intactes.
8. Mineurs ouverts : articles EN en fallback FR (assumé) ; cas `default` de
   `documentation-internal-links.tsx` pour etre-trouve (obs. v1 toujours
   ouverte).

## Verdict

Après corrections B1-B3 + A1-A2 (18/07, commit `3b82f42`, tests checklist
verts, build vert) : **vague 3 publiable**. Reste pour la vague 5 : A3
(rich snippets datés dans le stock WordPress).
