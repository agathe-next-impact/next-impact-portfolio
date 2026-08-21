# Verdicts mode 1 — Vague 5+ (clusters D et E)

> Rendu par verificateur-coherence le 2026-08-21, lecture seule. Persisté par
> l'orchestrateur. Sources : `contexte-fusion.md`, `cartographie-contenu.md`,
> `etat-chantier.md`, `verdicts-vague-{2,3,4}.md`, `content/documentation/README.md`,
> `lib/hub-themes.ts`, grep exhaustif de `content/**`.

## Verdict en un coup d'œil

13 sujets, **13 × CRÉER**. Aucun RENONCER, aucun METTRE À JOUR : les deux
clusters sont un terrain vierge (zéro occurrence substantielle sur E-E-A-T,
images IA, RGPD/AI Act, chatbot, RAG, personnalisation, recherche sémantique
dans les 84 contenus du repo). Contrairement aux vagues précédentes (A6→A4,
B2 fusionné dans B0), pas de doublon interne à dissoudre — mais un risque de
cannibalisation réel **entre** les 13 sujets, à cadrer strictement à la
rédaction (frontières détaillées ci-dessous).

| # | Sujet | Verdict |
|---|---|---|
| D0 | Contenu IA : opportunité/risque | CRÉER |
| D1 | Rédiger avec l'IA sans pénalité | CRÉER |
| D2 | E-E-A-T | CRÉER |
| D3 | Images IA (droit, crédibilité) | CRÉER |
| D4 | Design assisté | CRÉER |
| D5 | RGPD/AI Act | CRÉER |
| D6 | Le contenu moyen ne convertit pas | CRÉER |
| E0 | Quels composants IA ont leur place | CRÉER |
| E1 | Chatbot | CRÉER |
| E2 | Recherche sémantique | CRÉER |
| E3 | Personnalisation | CRÉER |
| E4 | Automatisation formulaires/CRM | CRÉER |
| E5 | RAG/base de connaissances | CRÉER |
| E6 | IA dans une web app métier | CRÉER |

## Point de méthode structurant (à lire avant toute rédaction D0/E0)

Les rubriques `presence` et `outils-metier` (`lib/hub-themes.ts` lignes
756-891 et 897-1010) **existaient avant ce chantier** avec leur propre
cadrage produit, sans rapport avec l'IA :
- `outils-metier` = « Annuaire, carte, espace membre : plugin, SaaS ou
  plateforme sur mesure ? » (zéro mention IA)
- `presence` = « Site, newsletter, LinkedIn : où investir ? » (zéro mention IA)

Précédent applicable : **B0** (rubrique préexistante, cadrage propre
conservé), **pas C0** (rubrique créée de toutes pièces, intro absorbante).
D0 et E0 doivent être des **articles séparés**, chapeaux de leur cluster —
ne pas les faire absorber par l'intro de `hub-themes.ts`, sous peine
d'écraser un cadrage produit/éditorial valide et sans rapport.

`ce-que-l-ia-change-dans-la-creation-d-un-site-web.mdx` (B0, publié)
contient déjà : *« Le tri entre les composants qui méritent leur place et les
autres est l'objet de la rubrique Outils métier, qui les passe en revue un
par un »* — promesse en ligne non tenue, qu'E0/E1/E2/E4/E5 réalisent.

## Prérequis infra avant toute rédaction (architecte-fusion)

Même défaut que celui corrigé pour `ia-et-code` (vague 2) et `avant-signer`
(vague 4) : les deux rubriques cibles n'ont aujourd'hui aucun dossier de
contenu propre.
1. Créer `content/documentation/presence/` et `content/documentation/outils-metier/`.
2. Étendre `categoryLabels`/`RELATED_CATEGORIES` dans `[category]/[slug]/page.tsx`.
3. Ajouter un bloc `reading`/`options` aux deux entrées `hub-themes.ts`
   (`presence`, `outils-metier`) qui reconnaisse D0-D6 et E0-E6, sans quoi
   les articles restent orphelins de leur rubrique parente.

## Détail par sujet

### Cluster D — Contenu, design et IA (→ rubrique Présence et audience)

- **D0 — CRÉER.** Chapeau du cluster D (modèle B0) : dois-je utiliser l'IA
  pour mon contenu, dimension par dimension, verdict court, renvoi D1-D6.
  Existant : rien (grep large). Frontière : décision d'usage globale
  uniquement — pas le mécanisme du risque Google (D1), pas E-E-A-T (D2), pas
  le droit des images (D3), pas le design (D4), pas la conformité (D5), pas
  l'argument conversion (D6).
- **D1 — CRÉER.** « Google pénalise-t-il le contenu IA ? » — process
  actionnable (plan humain, vérification factuelle, relecture). Existant :
  rien, y compris dans C1/C2/C3/C4/C7 (proximité thématique avec
  `etre-trouve` vérifiée, aucun recouvrement). Frontière avec D2 : D1 =
  pénalité/qualité éditoriale, D2 = confiance/autorité de la source — si
  mélangés à la rédaction, fusionner plutôt que publier deux quasi-doublons.
- **D2 — CRÉER.** E-E-A-T côté contenu pour les prospects (bio auteur,
  preuves, transparence IA) — distinct de l'E-E-A-T technique déjà implémenté
  sur le site lui-même (schema, sameAs, SIREN — mémoire `chantier-geo-score`,
  Lot 2), que D2 peut citer en exemple. Frontière : pas de balisage JSON-LD
  (C3), pas de structuration de page (C7) — signaux de confiance humains
  seulement.
- **D3 — CRÉER.** Droit d'auteur/CGU des générateurs d'images, crédibilité
  perçue. Existant : rien. Frontière avec D5 : D3 = droit d'auteur/CGU
  images uniquement, D5 = conformité réglementaire large.
- **D4 — CRÉER, POINT DE VIGILANCE PRIORITAIRE.** Travail de design continu
  de la marque (visuels réseaux, charte graphique) hors contexte de commande
  de site. `ce-que-l-ia-change-dans-la-creation-d-un-site-web.mdx` (B0,
  publié, lignes 28-32) a déjà un H2 entier sur IA+maquettes avec verdict
  assumé, dans un angle proche (commande de site). **À vérifier
  explicitement à l'audit mode 2** : si la frontière n'est pas tenue, D4
  devient un quasi-doublon de B0.
- **D5 — CRÉER.** RGPD (données passées dans un outil IA tiers) + AI Act
  européen (transparence contenu IA, signalement chatbot — art. 50). Sujet
  d'actualité (paliers d'application jusqu'en 2026-2027). Existant : zéro
  occurrence « AI Act » dans tout le repo. Frontière : pas la sécurité des
  comptes (`applications-web-mobile/comptes-utilisateurs-et-securite.mdx`,
  en lien) ; transparence chatbot en 1-2 phrases avec renvoi vers E1 (E1 ne
  renvoie ici qu'en 1 phrase).
- **D6 — CRÉER.** Angle marketing/business : pourquoi le contenu générique
  IA ne convertit plus, comment se différencier. Existant : rien dans
  `marketing-digital` (proximité thématique, aucun recouvrement d'intention).
  Frontière avec D0/D1 : D6 = business/conversion, verdict par profil
  obligatoire (socle GEO point 7). Fusionner dans D0 plutôt que publier un
  triplon si la distinction ne tient pas à la rédaction.

### Cluster E — Composants IA (→ rubrique Outils métier)

- **E0 — CRÉER.** Chapeau du cluster E (grille de triage + verdicts courts),
  réalise la promesse de B0 ligne 52. Frontière : article séparé, pas une
  réécriture de l'intro `outils-metier` (qui garde son périmètre
  annuaire/carte/membre).
- **E1 — CRÉER.** Chatbot IA : usage réel, coût récurrent, risque, obligation
  de transparence. Existant : mentions courtes seulement dans B0 (déjà
  actées en vague 4). Frontière : pas de détail RAG (E5, lien) ; transparence
  légale en 1 phrase avec renvoi D5.
- **E2 — CRÉER.** Recherche classique vs sémantique, quand l'upgrade se
  justifie. `applications-web-mobile/marketplace-et-annuaire-b2b.mdx` a une
  section recherche technique (dev), angle différent (décideur) — lien
  obligatoire, pas de recouvrement d'intention. Frontière : pas l'arbitrage
  annuaire/catalogue lui-même (`outils-metier`) ; recherche sémantique
  seulement, une fois le besoin de recherche déjà acté.
- **E3 — CRÉER.** Personnalisation par IA : pour qui c'est utile (volume,
  catalogue). Existant : une phrase prospective dans `design-ui-ux/ux.mdx`
  sans traitement. Frontière avec E2 (requête explicite vs affichage adapté
  sans requête) et E4 (visiteur vs équipe commerciale).
- **E4 — CRÉER.** Automatisation formulaire → CRM par IA. `plateforme-metier-vs-saas.mdx`
  tranche déjà le choix du CRM lui-même (SaaS dans 90 % des cas) — question
  différente, lien obligatoire pour ne pas rouvrir ce débat dans E4. Preuve
  concrète disponible : études de cas « Automatisations »
  (`hermitage-veille`, `urban-pousses-veille`, `offreConseil: pack-ia`).
- **E5 — CRÉER, POINT DE VIGILANCE PRIORITAIRE.** RAG en langage décideur —
  brique technique commune à E1 et E2. Doit rester le concept transversal
  (mécanisme, limite aux hallucinations, coût de maintenance) sans
  retrancher « dois-je avoir un chatbot/une recherche sémantique » (E1/E2).
  Existant : zéro occurrence RAG/embeddings dans tout le repo. **Publier
  après E1/E2**, sinon risque de répéter 75 % de leur contenu.
- **E6 — CRÉER.** IA dans une web app métier sur-mesure (workflow interne,
  tableau de bord, copilote) — audience interne/authentifiée, distincte des
  visiteurs publics d'E1-E4. Existant : rien dans les 14 articles
  `applications-web-mobile` (aucune occurrence IA). Frontière : pas de
  redéfinition de « qu'est-ce qu'une web app » ni du comparatif SaaS/sur-mesure
  (liens uniquement vers l'existant).

## Risques de cannibalisation à surveiller à l'audit de vague (mode 2)

1. **D4 vs B0** — recouvrement le plus net du lot (section maquettes déjà
   publiée dans B0). Priorité de vérification.
2. **D0/D1/D6** — trois angles du même comportement (contenu IA médiocre) :
   décision / risque SEO / risque conversion. Garder distincts ou fusionner
   à deux plutôt que publier un triplon.
3. **E0/E1/E2/E5** — chaîne triage → chatbot/recherche → RAG. Discipline
   « 1-2 phrases + lien » (déjà validée sur C7/C3/C4 et F3/B0/B4), sinon E5
   recopie 75 % d'E1/E2. **Ordre de rédaction recommandé : E0 → E1/E2 → E5.**
4. E0/D0 ne doivent pas être absorbés dans l'intro des rubriques existantes
   (précédent B0, pas C0).

## Point de tension avec la doctrine du chantier — signalé à Agathe

`contexte-fusion.md` fixe une cadence de **~2 articles/mois**. 13× CRÉER
d'un coup contredit cette cadence si tout est rédigé en une seule séquence.
Contrairement aux vagues 1-4 (2-4 contenus par vague, arbitrages ponctuels),
cette vague est volumineuse et sans arbitrage de fond à trancher (aucun
RENONCER, aucun tarif à discuter) — mais son ampleur mérite une décision
explicite sur le rythme de publication avant de lancer la rédaction en
masse.
