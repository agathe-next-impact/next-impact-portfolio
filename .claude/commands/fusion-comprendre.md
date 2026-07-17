---
description: >
  Pilote le chantier de fusion « Comprendre » × base de ressources IA :
  état des lieux, puis exécution vague par vague (structure, rubrique GEO,
  contenus, outils, audits) en déléguant aux agents spécialisés.
  Usage : /fusion-comprendre [statut | vague N | contenu <code> | audit]
---

Tu orchestres le chantier de fusion défini dans `.claude/docs/contexte-fusion.md`.
Lis ce fichier maintenant, ainsi que `.claude/docs/etat-chantier.md` s'il
existe (c'est ton journal de bord ; crée-le à la première exécution).

Argument reçu : $ARGUMENTS

## Répartition des rôles (ne fais pas toi-même ce qu'un agent fait mieux)

| Besoin | Agent |
|---|---|
| Savoir où vivent les contenus, inventaire | cartographe-contenu |
| Structure, routes, 301, metadata, robots/llms.txt, JSON-LD | architecte-fusion |
| Rédiger une page de rubrique ou un article (A1…F3) | redacteur-seo-geo |
| Verdict avant rédaction / audit après vague | verificateur-coherence |
| Diagnostic visibilité IA, checklist, outils interactifs | batisseur-outils |

## Comportement selon l'argument

**Sans argument ou `statut`** — Lis le journal de bord, résume : vagues
faites/en cours, contenus publiés vs mapping, bloquants (dont l'arbitrage
tarifaire 150/490 vs 180/390 s'il n'est pas tranché), et propose la prochaine
action. Ne lance rien sans confirmation.

**Première exécution (pas de journal)** — Séquence d'amorçage :
1. Lance cartographe-contenu ; persiste son rapport dans
   `.claude/docs/cartographie-contenu.md`.
2. Présente à Agathe les écarts détectés et les décisions à trancher
   (tarifs, cas ambigus de redirection). Attends ses réponses ; documente-les
   dans contexte-fusion.md (section « Incohérences connues »).
3. Crée `.claude/docs/etat-chantier.md` (tableau : vague, tâche, agent,
   statut, date) puis propose de lancer la vague 1.

**`vague N`** — Exécute la vague N du plan de déploiement du contexte :
- Vague 1 : architecte-fusion (rubrique etre-trouve + taxonomie/301 + metadata
  + socle GEO technique) ; en parallèle verificateur-coherence en mode 1 sur
  C1 et C2, puis redacteur-seo-geo pour la page de rubrique, C1 et C2 ;
  batisseur-outils pour le diagnostic visibilité IA. Termine par
  verificateur-coherence en mode 2 sur toute la vague.
- Vagues 2-4 : pour chaque contenu (voir mapping) : verdict verificateur
  (mode 1) → rédaction (ou mise à jour) → intégration. Audit de vague à la fin.
- Vague 5 : l'élagage Headless commence par une proposition de plan de fusion
  d'articles (quoi fusionner, quelles 301) soumise à Agathe AVANT toute
  modification.
Règle : les verdicts « METTRE À JOUR » remplacent la création — ne force
jamais un contenu neuf contre l'avis du vérificateur sans validation d'Agathe.

**`contenu <code>`** (ex. `contenu C7`, `contenu A4`) — Chaîne unitaire :
verificateur (mode 1) → redacteur-seo-geo → intégration (architecte-fusion si
la structure est touchée) → mise à jour du journal.

**`audit`** — verificateur-coherence en mode 2 sur tout ce qui a été produit
depuis le dernier audit ; présente les bloquants en premier.

## Règles d'orchestration

- Mets à jour `.claude/docs/etat-chantier.md` après CHAQUE étape — c'est ce
  qui permet de reprendre le chantier dans une session fraîche.
- Une décision utilisateur (tarif, slug ambigu, élagage) n'est jamais devinée :
  tu la demandes, tu la documentes dans contexte-fusion.md, puis les agents la
  lisent — jamais de décision qui ne vit que dans la conversation.
- Un bloquant relevé par le vérificateur suspend la publication de la vague,
  pas le reste du travail.
- Commits par étape logique, pas de push sans demande d'Agathe.
- Résume chaque fin de séquence en 3-5 lignes : fait, décidé, bloqué, suivant.
