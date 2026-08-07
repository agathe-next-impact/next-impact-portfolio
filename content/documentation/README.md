# Contrat de contenu — articles de documentation

Ce dossier contient les articles de `/documentation/<category>/<slug>`. Un
fichier `.md` ou `.mdx` par article, dans le dossier de sa catégorie. Le nom du
fichier fait le slug, le dossier fait la catégorie : **les deux pilotent l'URL,
donc on ne les renomme pas sans plan de redirection 301**.

Deux régimes de rendu coexistent :

- **Rendu historique** — l'article n'a pas de champ `rubrique`. Rien ne change.
- **Gabarit « GEO-ready »** — l'article déclare `rubrique`, `enBref` et
  `dateModified`. Il bascule alors sur le gabarit complet décrit plus bas.

La migration se fait **par lots**, pas d'un coup.

## Front matter

| Champ | Obligatoire | Type | Rôle |
|---|---|---|---|
| `title` | oui | string | H1 de la page. **Formulé en question réelle** quand le sujet s'y prête. |
| `description` | oui | string | Meta description + chapô. |
| `category` | oui | string | Doit correspondre au dossier. Pilote l'URL. |
| `author` | oui | string | `"Agathe Karinthi-Martin"`. |
| `date` | oui | `YYYY-MM-DD` | Date de publication → `datePublished`. |
| `dateModified` | **oui (gabarit)** | `YYYY-MM-DD` | Date de mise à jour → `dateModified` + affichage « Mis à jour : mois année ». Alias historique accepté : `updated`. |
| `rubrique` | **oui (gabarit)** | enum | Rubrique éditoriale (les 7, ci-dessous). Pilote le fil d'Ariane **et le CTA de sortie**. |
| `enBref` | **oui (gabarit)** | string \| string[] | La réponse en 3 à 4 phrases autonomes. |
| `order` | non | number | Ordre dans la catégorie. |
| `faq` | non | `{question, answer}[]` | Génère le `FAQPage`. **Uniquement si la FAQ est aussi visible dans le corps.** |
| `howto` | non | `{name, text}[]` | Génère le `HowTo` (articles-méthode). |
| `howtoTotalTime` | non | ISO 8601 | Durée totale du `HowTo`. |
| `keyFigures` | non | `{value, label, source?}[]` | Bloc « chiffres clés ». Contenu **éditorial** : ne jamais inventer un chiffre. |

### `rubrique` — les 7 valeurs autorisées

`choisir` · `ia-et-code` · `reparer` · `avant-signer` · `outils-metier` ·
`presence` · `etre-trouve`

Attention : **la rubrique n'est pas la catégorie.** La catégorie est le dossier
de contenu (11 valeurs, pilote l'URL) ; la rubrique est la taxonomie éditoriale
visible du hub (7 valeurs, pilote le parcours). Trois rubriques — `reparer`,
`outils-metier`, `presence` — n'ont d'ailleurs pas de dossier de contenu :
elles agrègent des articles venus d'autres catégories.

### `enBref` — le champ le plus important

C'est le bloc que les moteurs de réponse (ChatGPT, Perplexity, AI Overviews)
citent. Trois règles :

1. **Autonome** — chaque phrase doit se comprendre sans le reste de l'article.
   Pas de « comme on l'a vu », pas de « ce dernier », pas de pronom orphelin.
2. **3 à 4 phrases**, pas plus. Une réponse, pas un résumé.
3. **Extractible telle quelle** — si un LLM copie ce bloc dans sa réponse, il ne
   doit rien avoir à réécrire.

Deux formes acceptées :

```yaml
enBref: "Une seule phrase-réponse dense, si le sujet s'y prête."
```

```yaml
enBref:
  - "Première phrase autonome."
  - "Deuxième phrase autonome."
  - "Troisième phrase autonome."
```

Quand l'article ouvrait sur un paragraphe TL;DR en gras, **le déplacer ici et le
retirer du corps** — sinon la réponse est affichée deux fois.

## Ce que le gabarit rend, dans cet ordre

1. **Fil d'Ariane** visible — Accueil → Documentation → Rubrique → Article,
   doublé d'un `BreadcrumbList` JSON-LD identique.
2. **H1** = `title`, formulé en question quand c'est possible.
3. **Bloc « En bref »** — `enBref`, en tête d'article.
4. **Sommaire ancré** — généré depuis les H2, affiché au-delà de 3 sections.
5. **Corps** — hiérarchie stricte H2/H3. Pour un comparatif : un `<table>` HTML
   **nommé**, via `<DataTable caption="…">` (voir ci-dessous).
   **Jamais de comparatif en image.**
6. **Chiffres clés** (si `keyFigures`), puis **encart auteur** — composant unique
   partagé, jamais recopié.
7. **Date de mise à jour** visible, issue de `dateModified`.
8. **Un seul CTA de sortie**, choisi par la rubrique.

## Comparatifs : `<DataTable>`

Un tableau comparatif doit porter un `<caption>` — c'est ce qui le rend
extractible par un moteur de réponse. En MDX, on garde l'écriture markdown et on
l'enveloppe (les **lignes vides sont obligatoires** autour du tableau) :

```mdx
<DataTable caption="Ce que vous récupérez selon la famille d'outil">

| Famille d'outils | Ce que vous récupérez | Ce qui reste bloqué |
|---|---|---|
| … | … | … |

</DataTable>
```

Jamais de comparatif en image : un `<img>` ne se cite pas.

## CTA par rubrique

Température **froide par défaut** : l'outil gratuit d'abord. La documentation
prouve, elle ne vend pas — c'est sa crédibilité qui la rend citable.

| Rubrique | CTA | Cible |
|---|---|---|
| `choisir` | Lancer la Boussole techno | `/outils/boussole` |
| `ia-et-code` | Prototype IA : jetable ou maintenable ? | `/outils/prototype-ia` |
| `reparer` | Auditer mon site (gratuit, 2 min) | `/audit-site-web` |
| `avant-signer` | Décrypter mon devis + avis indépendant 150 € | `/outils/decrypteur-devis` puis `/conseil` |
| `outils-metier` | No-code, SaaS ou sur-mesure ? | `/outils/nocode-saas-surmesure` |
| `presence` | Diagnostic Web & IA (gratuit) | `/audit-site-web` |
| `etre-trouve` | Visible dans les moteurs IA ? | `/outils/visibilite-ia` |

`avant-signer` est la **seule** rubrique autorisée à pousser la visio payante :
son lecteur est déjà en phase d'achat. Partout ailleurs, l'outil gratuit est la
seule sortie. Aucun CTA intermédiaire dans le corps de l'article.

La table vit dans [`lib/documentation-rubriques.ts`](../../lib/documentation-rubriques.ts) —
c'est là qu'on la modifie, pas dans les articles.

## Contrôle au build

`npm run build` lance d'abord `npm run check:docs`. Un article qui déclare
`rubrique` sans `enBref` ou sans `dateModified` **casse le build** :

```
[doc-contract] ✗ 119 articles · 1 sur le gabarit GEO · 118 à migrer · 1 non conforme(s)

1 article(s) non conforme(s) :
  ✗ content/documentation/etre-trouve/guide-geo-pme.mdx
      `enBref` manquant
```

Les articles **non encore migrés** (sans champ `rubrique`) ne sont pas des
erreurs : ils gardent le rendu historique. La migration se fait par lots.

```bash
npm run check:docs                                       # strict, sort 1 si non conforme
node scripts/check-documentation-contract.mjs            # rapport seul, sort 0
node scripts/check-documentation-contract.mjs --backlog  # liste les articles à migrer
```

En dev, un article incomplet retombe sur le rendu historique et logue :

```
[doc-contract] ia-et-code/mon-article : gabarit GEO désactivé — `enBref` (obligatoire).
```

## Traductions

L'anglais vit dans `content/en/documentation/<category>/<slug>.mdx`, même
contrat. Sans fichier EN, l'article FR s'affiche avec un bandeau de repli.

## Données structurées générées

- `Article` (ou `TechArticle` pour `wordpress-headless`) — `headline`,
  `description`, `datePublished`, `dateModified`, `inLanguage`, `author`
  (`Person`, `@id` partagé du site, url `/a-propos`), `publisher`
  (`Organization`, `@id` partagé).
- `BreadcrumbList` — les 4 niveaux du fil d'Ariane visible.
- `FAQPage` — **seulement** si `faq` est renseigné ET la FAQ visible à l'écran.
- `HowTo` — seulement si `howto` est renseigné.
