# Copy rules — règles éditoriales

Le ton et la mise en mots font 50 % du système. Une page parfaitement gridée mais avec un copy bavard sortira de l'identité immédiatement.

---

## Ton général

- **Affirmatif, court, déclaratif.** Pas de superlatifs SaaS. Pas de « révolutionner », « transformer », « l'avenir de ». Le système parle comme un document technique : factuel, précis, presque sec.
- **Italique d'accent.** Une phrase clé par section met *un* mot ou *un* groupe nominal en italique serif. Cela remplace le gras (jamais utilisé).
- **Pas de ponctuation forte.** Pas d'exclamations. Les points de suspension uniquement dans les transitions de citation.
- **Tutoiement / vouvoiement.** Vouvoiement de courtoisie professionnelle (« vous »).

---

## Numérotation des sections

Chaque section porte un identifiant `№ 0X` (esperluette + zéro-leading + numéro). C'est non-négociable, c'est la signature.

- Format strict : `№ 01`, `№ 02`, … `№ 13` (jamais `#`, jamais `n°`).
- Affiché en mono 12 px, accent.
- À placer en haut-gauche du `.sec-head`, sur 1 colonne.
- Cohérence trans-pages : numéroter le document entier en continu, pas par page.

---

## Légendes (`Fig. 0X`)

Toute illustration, placeholder, schéma ou diagramme porte une légende `Fig. 0X` en pied ou en méta de section.

```
FIG. 01    ← format mono uppercase, le numéro en accent
```

Inclus aussi dans le `sec-meta` :
```
Capacités · Fig. 02
03 documents · Fig. 05
```

---

## Métadonnées de méta-section (`.sec-meta`)

Colonne droite du `.sec-head`. Toujours mono uppercase, max ~40 caractères.

**Formules canoniques :**
- `[Type] · Fig. [num]`
- `[N] [unité] · Fig. [num]`
- `[Statut] · [Édition]`

Exemples :
- `Catalogue · Fig. 03`
- `04 piliers · Fig. 02`
- `Référence sélectionnée · Fig. 04`
- `Process rodé · Fig. 11`

---

## Repères de marge

Coordonnées + version, en mono 9 px vertical à gauche d'écran. Cohérent sur tout le site, signature du document.

- `45°16′N · 02°37′E · TRIZAC / CANTAL` (coordonnées du siège, à conserver)
- `NI · vol. 02 · ed. 2026` (édition courante, à incrémenter annuellement)

Page-spécifique :
- `NI · doc 02 · services · ed. 2026`

---

## Footer / Colophon

Quatre champs mono uppercase 11 px sur une grille 4×3 :

1. `© [année] NEXT IMPACT DIGITAL`
2. `ED. [année] · VOL. [n] · BUILD [code]`
3. `SET EN [Police 1] / [Police 2]` — exemple : `SET EN INSTRUMENT SERIF / GEIST`
4. `↑ HAUT DE PAGE` (lien ancre)

C'est le seul endroit où l'on assume une mention typographique et un build code. Ils sont la touche éditoriale finale.

---

## Préfixes mono dans le texte

Le système utilise quelques préfixes récurrents en mono qui servent de fil rouge :

| Préfixe       | Usage                                                      |
|---------------|------------------------------------------------------------|
| `↳`           | Sous-mention, conséquence, élaboration                     |
| `→`           | Action (boutons, liens forward)                            |
| `←`           | Retour (breadcrumb, retour accueil)                        |
| `●`           | Statut actif / coche d'inclusion dans un tableau           |
| `＋ / −`       | Items de listes pros/cons                                  |
| `★`           | Mention d'avantage exceptionnel (OETH, ESS)                |
| `◼`           | Logotype textuel Next Impact (en header)                   |

Toujours en mono, jamais en emoji.

---

## Italique d'accent

L'italique serif est un *outil sémantique*, pas une décoration. Quelques règles :

- **Mots-clé** : `<em style="color: var(--accent)">…</em>` — l'italique est aussi en accent vermilion.
- **Citations** : `<em style="font-style: italic">…</em>` — italique seul, couleur héritée.
- **Une seule occurrence d'italique d'accent par titre.** Sinon le titre crie.

Exemples canoniques :

> *Quatre voies. Un seul partenaire, de la maquette à la mise en production.*

> *Sites web & applications sur-mesure.*

> Marketplace B2B pour le **sourcing fournisseurs.** (italique conclusif sans accent)

---

## Chiffres et statistiques

- Préférer les chiffres écrits **en serif géant** quand ils sont signifiants (durées projet, segments).
- Jamais d'unité accolée au chiffre — toujours séparée et plus petite : `02 mois`, `8 semaines`.
- Format `decimal-leading-zero` pour les numérotations de séquence (01, 02, …, 99).
- Tabular-nums pour les tableaux et comptes : `font-variant-numeric: tabular-nums`.

---

## Boutons

Trois variantes seulement :

1. **Primaire** — fond encre, texte papier, avec `dot` accent + `arrow →`. Une seule par section maximum.
2. **Secondaire** — outline encre. Pour les actions tertiaires.
3. **Lien mono** — `← RETOUR ACCUEIL`, en mono uppercase 11 px. Pour la navigation transversale.

Copywriting bouton :
- **Verbe + objet + qualificatif** : « Déterminer mon offre — 2 min », « Lire l'étude », « Démarrer le diagnostic ».
- Ne jamais dépasser ~32 caractères.
- Le suffixe ` — 2 min` ou ` — gratuit` est encouragé : il qualifie l'effort attendu.

---

## Tableaux et matrices

- En-têtes en mono uppercase 11 px.
- Numéroter chaque ligne : `01 · Critère`.
- Les vides → `—` en `--rule-strong`, pas blanc.
- Maximum 12 lignes par tableau, sinon découper en deux.

---

## Citations

Une citation occupe une colonne, jamais plus de 4 lignes.

```
« Pas de jargon. Pas de dépendance.
  Un livrable que vous savez maintenir. »

↳ AGATHE KARINTHI-MARTIN
  FONDATRICE · DÉVELOPPEUSE
```

- Guillemets typographiques français `« »` avec espaces insécables.
- Attribution en mono uppercase, signe `↳` en préfixe, accent sur le nom.
