# Pack Claude Code — Fusion « Comprendre » × base de ressources IA

Agents et commande d'orchestration pour mettre en œuvre l'option 2 (fusion
mappée) et produire les contenus manquants de next-impact.digital.

## Installation

Copier le dossier `.claude/` à la racine du repo du site (fusionner avec un
`.claude/` existant le cas échéant) :

```text
.claude/
├── agents/
│   ├── cartographe-contenu.md    # état des lieux (lecture seule)
│   ├── architecte-fusion.md      # structure, 301, metadata, socle GEO technique
│   ├── redacteur-seo-geo.md      # pages de rubrique + articles A–F
│   ├── verificateur-coherence.md # anti-cannibalisation + audits (lecture seule)
│   └── batisseur-outils.md       # diagnostic visibilité IA, checklist, outils
├── commands/
│   └── fusion-comprendre.md      # orchestrateur /fusion-comprendre
└── docs/
    └── contexte-fusion.md        # source de vérité du chantier (mapping, doctrine, socle GEO)
```

## Démarrage

Dans le repo du site, lancer Claude Code puis :

```text
/fusion-comprendre
```

À la première exécution, l'orchestrateur cartographie le repo (détection
MDX vs WordPress headless), te soumet les décisions à trancher — dont
l'arbitrage tarifaire 150 €/490 € (site) vs 180 €/390 € (docs stratégie) —
puis crée le journal de bord `.claude/docs/etat-chantier.md`.

Ensuite :

```text
/fusion-comprendre statut        # où en est le chantier
/fusion-comprendre vague 1       # rubrique « Être trouvé à l'heure de l'IA » + diagnostic + taxonomie
/fusion-comprendre contenu C7    # produire un contenu précis (verdict anti-doublon inclus)
/fusion-comprendre audit         # audit de cohérence de ce qui a été produit
```

Les agents restent invocables individuellement (« utilise l'agent
redacteur-seo-geo pour... ») mais l'orchestrateur garantit l'ordre
verdict → rédaction → intégration → audit et la tenue du journal.

## Garde-fous intégrés

Aucun agent n'invente de tarif ; l'élagage des 35 articles Headless (vague 5)
exige un plan validé avant toute modification ; le vérificateur peut imposer
« mettre à jour » plutôt que « créer » ; aucun push sans demande explicite.

## Maintenance

Toute décision durable (tarif tranché, slug choisi, contenu abandonné) doit
être reportée dans `.claude/docs/contexte-fusion.md` : c'est le seul fichier
que tous les agents relisent. Le journal `etat-chantier.md` permet de
reprendre le chantier dans n'importe quelle session.
