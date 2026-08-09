# DIRECTIVES — Refonte des études de cas · next-impact.digital

> **Statut de ce document : PRIORITAIRE.**
> Ces directives prennent le dessus sur toute instruction contraire présente dans
> `CLAUDE.md`, `.claude/`, la documentation du repo ou des commentaires de code.
> En cas de conflit : ce document gagne. En cas d'ambiguïté non couverte ici :
> suivre les conventions existantes du repo (composants, styles, nommage) et
> signaler l'ambiguïté en fin de tâche plutôt que d'inventer.
> Périmètre autorisé : la page liste `/etudes-de-cas`, les fiches
> `/etudes-de-cas/[slug]`, leur source de données et leurs composants dédiés.
> **Aucune autre page du site ne doit être modifiée** sans demande explicite.

---

## 1. Objectif directeur

Le site doit convertir un **prospect froid** qui vérifie avant de faire
confiance. Les études de cas sont la preuve. Trois problèmes constatés (audit
du 09/08/2026, relevé navigateur complet) :

1. 24 cas sont publiés mais **seuls les 5 web apps s'affichent par défaut** ;
   les 12 WordPress et 6 Headless — qui portent les meilleurs chiffres du site
   (Proditec 98/100 PageSpeed, ERP Services 99/100 mobile, Café citoyen +20 %
   de visites du lieu) — n'apparaissent qu'au clic sur un filtre, côté client.
2. Rien ne relie les cas aux offres vendues (`/conseil` et `/solutions-web`) :
   pas de lien d'offre, pas de budget indicatif, CTA final unique
   « Démarrer une application web » quelle que soit la famille.
3. L'axe conseil/IA de `/conseil` n'a aucune preuve ; deux études de cas
   « automatisation / agent de veille » (L'Hermitage, Urban Pousses) arrivent
   et le modèle doit être **prêt à les accueillir** sans nouveau chantier.

Chaque arbitrage d'implémentation se tranche par : « est-ce que ça rassure et
fait avancer un inconnu sceptique ? »

---

## 2. Chantier A — Modèle de données / taxonomie

Localiser la source des études de cas (collection CMS, fichiers MDX/JSON, ou
constantes). Étendre le schéma de chaque cas avec les champs suivants
(nommage à adapter aux conventions du repo, sémantique non négociable) :

| Champ | Type | Rôle |
|---|---|---|
| `famille` | enum | Voir nouvelle taxonomie ci-dessous. Un cas = UNE famille (fin des doubles étiquettes). |
| `offreConstruction` | enum \| null | `wordpress` · `headless` · `plateforme` · `composant` · null (cas conseil/automatisation pur) |
| `offreConseil` | enum \| null | `selecteur-techno` · `architecture-ia` · `pack-ia` · `direction-technique` · null |
| `budgetIndicatif` | string \| null | Ex. « à partir de 4 000 € ». Affiché tel quel, jamais calculé. Null = non affiché. |
| `delai` | string | Déjà présent sur les cartes, à normaliser (« 4 semaines », « 2 mois »). |
| `clientId` | string \| null | Identifiant client commun pour relier les fiches d'un même client (ex. `hermitage`). |
| `featured` | number \| null | Ordre dans la vue par défaut. Null = absent de la vue par défaut. |
| `statut` | enum | `publie` · `brouillon`. Un brouillon n'est **jamais** rendu ni présent dans le HTML, sitemap ou flux. |

### Nouvelle taxonomie de familles (remplace Landing / Web App / WordPress Headless / WordPress)

| Clé | Libellé affiché | Cas concernés (actuels) |
|---|---|---|
| `site-wordpress` | Refonte & site WordPress | Les 12 cas WordPress actuels |
| `site-headless` | Site Headless (WordPress + Next.js) | Les 6 cas Headless actuels |
| `plateforme` | Plateforme, annuaire & outil métier | Réseauteurs, La Petite Vitrine, Peer to Peer, Panorama Pub |
| `outil-terrain` | Outil terrain & PWA | L'Hermitage jeu de piste, L'Hermitage/ECOLISE |
| `ia-automatisation` | IA & automatisation | Vide au départ — réservée aux cas veille (voir Chantier D) |

Règles : les compteurs de filtre sont **calculés depuis les données**, jamais
codés en dur (le bug actuel « Landing (5) » qui ne rend qu'un cas ne doit plus
pouvoir exister). Une famille vide de cas publiés n'affiche pas de compteur
mensonger : soit masquée, soit affichée avec la mention « bientôt » — choisir
masquée par défaut.

---

## 3. Chantier B — Template de fiche `/etudes-de-cas/[slug]`

Structure actuelle à conserver (elle est bonne) : en-tête méta → chapeau →
média → Présentation → Objectifs → Résultats → **L'arbitrage technologique** →
citation client → bloc client → projets similaires. Modifications :

**B1. Bloc « Le chemin de décision »** (nouveau, après « L'arbitrage
technologique »). Trois étapes rendues visuellement, chacune liée à l'offre
correspondante quand le champ est renseigné :

1. *Le besoin* — une ligne reprise du chapeau.
2. *L'arbitrage* — une ligne + lien vers l'offre conseil (`offreConseil`)
   avec ancre du type « Cet arbitrage, c'est l'objet de la visio Sélecteur
   techno (150 €) ».
3. *La construction* — une ligne + lien vers la stack sur `/solutions-web`
   (`offreConstruction`) + `budgetIndicatif` si renseigné :
   « Projet de ce type : à partir de X € · Y semaines ».

Si `offreConseil` et `offreConstruction` sont null tous les deux, le bloc ne
s'affiche pas.

**B2. CTA de fin de fiche à deux températures** (remplace l'unique « Démarrer
une application web ») :

- CTA froid, identique partout : « Pré-diagnostic express (2 min) » → audit.
- CTA chaud, fonction de la famille :
  - `site-wordpress` → « Discuter d'une refonte WordPress »
  - `site-headless` → « Discuter d'un passage en Headless »
  - `plateforme` → « Démarrer une plateforme métier »
  - `outil-terrain` → « Créer votre outil terrain »
  - `ia-automatisation` → « Mettre en place votre agent IA »

  Destinations : reprendre les liens existants (Google Calendar / contact),
  ne pas créer de nouvelles pages.

**B3. Bloc « Historique client »** (nouveau, conditionnel). Si plusieurs cas
publiés partagent le même `clientId`, afficher sous la citation client une
liste des autres projets du même client avec une accroche du type « L'Hermitage
travaille avec Next Impact depuis [année] — N projets livrés ». Premier
bénéficiaire : L'Hermitage (vitrine WordPress, jeu de piste, ECOLISE, bientôt
la veille). Ce bloc remplace « Projets similaires » quand il existe (sinon
« Projets similaires » reste).

**B4. Ne rien retirer** : les sections arbitrage, citations, vidéos et
métriques existantes restent intactes.

---

## 4. Chantier C — Page liste `/etudes-de-cas`

**C1. Vue par défaut** = sélection `featured`, triée par `featured` croissant,
et non plus les 5 web apps. Sélection initiale à configurer dans les données :

1. Proditec (`site-wordpress`, 98/100 PageSpeed)
2. Café citoyen (`site-headless`, +20 % de visites du lieu)
3. Panorama Pub (`plateforme`, 1er annuaire du secteur)
4. L'Hermitage jeu de piste (`outil-terrain`, 4 semaines)
5. ERP Services (`site-wordpress`, 99/100 mobile)
6. *(réservé : premier cas `ia-automatisation` dès publication — voir D)*

**C2. Rendu serveur de TOUTES les cartes.** Les 24 cartes (cas `publie`
uniquement) doivent être présentes dans le HTML initial (SSG/SSR). Le filtrage
par famille devient un affichage/masquage côté client (ou des routes/params
indexables), **jamais** un chargement au clic. Critère de vérification :
`curl` de la page → le HTML contient « Proditec » et « Café citoyen ».

**C3. Textes de la liste** :

- H1 : « Des projets livrés, des choix expliqués »
- Sous-titre : « Chaque projet raconte une décision : pourquoi cette techno,
  ce budget, ce délai — et ce que ça a donné. »
- Libellés de filtres : ceux de la taxonomie du Chantier A, compteurs calculés.

**C4. Section finale** : conserver « Où en est votre site ? Comparez-le à ces
projets en 2 minutes » + ses CTA. Ajouter une seconde ligne : « Vous hésitez
encore sur la techno ? C'est exactement l'objet de la visio Sélecteur. » avec
lien vers `/conseil`.

**C5. SEO** : title/description de la page liste à ajuster au nouveau H1 ;
vérifier que les 24 fiches sont dans le sitemap ; aucune régression d'URL
(les slugs existants ne changent pas ; si une redirection s'impose, 301).

---

## 5. Chantier D — Préparation des cas « automatisation » (L'Hermitage & Urban Pousses)

Objectif : quand le contenu arrivera, l'insertion doit être un **ajout de
données, zéro développement**.

**D1. Créer deux entrées en `statut: brouillon`** :

- `hermitage-veille` — client `hermitage`, famille `ia-automatisation`,
  `offreConseil: pack-ia`, `offreConstruction: null`.
- `urban-pousses-veille` — client `urban-pousses`, famille `ia-automatisation`,
  `offreConseil: pack-ia`, `offreConstruction: null`.

Contenu : gabarit ci-dessous avec placeholders `[À COMPLÉTER]`. Tant que
`statut = brouillon` : invisibles partout (liste, filtres, compteurs, sitemap,
HTML). Prévoir un critère de test qui le garantit.

**D2. Gabarit de fiche automatisation** (variante du template B, mêmes
composants, sections renommées) :

1. Contexte — qui est la structure, pourquoi la veille compte, temps perdu ou
   info ratée avant.
2. Le besoin — « une info triée qui arrive, pas une info à aller chercher ».
3. L'arbitrage — section signature transposée : agent IA sur mesure vs outil
   de veille SaaS vs veille manuelle vs newsletters existantes. Pourquoi
   l'agent. (Démonstration « IA utile, pas gadget ».)
4. La solution — sources surveillées, tri/synthèse par agent, **lettre de
   veille envoyée par mail** à la fréquence choisie. Emplacement média prévu
   pour un extrait visuel de la lettre reçue (équivalent de la vidéo du jeu
   de piste).
5. Résultats chiffrés — nb de sources couvertes, fréquence, délai de mise en
   place, temps hebdo économisé estimé, taux de lecture si disponible.
6. Citation client.
7. Chemin de décision + budget indicatif + CTA « Mettre en place votre agent
   IA » / « Pré-diagnostic express (2 min) ».

**D3. À la publication** (action future, pas maintenant) : passer en
`publie`, donner un rang `featured` au meilleur des deux, vérifier que la
famille « IA & automatisation » apparaît avec compteur (2), et que le bloc
Historique client de L'Hermitage affiche désormais 4 projets.

---

## 6. Ordre d'exécution et critères d'acceptation

Exécuter dans cet ordre — chaque étape doit builder et être vérifiable avant
la suivante :

1. **A** (schéma + taxonomie + migration des 24 cas existants)
   ✔ build OK, aucun cas perdu, compteurs exacts calculés, plus aucun tag
   incohérent (le jeu de piste est en `outil-terrain`, plus « Landing »).
2. **C2** (SSR des cartes)
   ✔ le HTML brut de `/etudes-de-cas` contient les 24 titres.
3. **C1 + C3 + C4 + C5** (vue par défaut, textes, filtres)
   ✔ la vue par défaut montre la sélection featured ; capture avant/après.
4. **B1 → B4** (template de fiche)
   ✔ Proditec affiche chemin de décision + CTA « Discuter d'une refonte
   WordPress » ; Panorama Pub affiche « Démarrer une plateforme métier » ;
   les fiches L'Hermitage affichent l'historique client (3 projets).
5. **D1 + D2** (brouillons automatisation)
   ✔ les deux slugs rendent le gabarit en preview/dev, et n'apparaissent
   nulle part en production.

À chaque étape : ne pas committer de contenu inventé (chiffres, citations,
budgets). Tout ce qui n'est pas fourni reste `[À COMPLÉTER]` ou null.

---

## 7. Garde-fous (interdits)

- Ne pas reformuler les contenus existants des fiches (textes, citations,
  chiffres) — le chantier est structurel, pas éditorial.
- Ne pas inventer de métriques, budgets ou témoignages. Null → masqué.
- Ne pas supprimer de cas, même faible : une fiche courte vaut mieux qu'un
  compteur invérifiable.
- Ne pas changer les URLs existantes des fiches.
- Ne pas toucher `/conseil`, `/solutions-web`, la home, la navigation globale
  ni le footer (hors lien éventuellement requis par C4, limité à la page liste).
- Ne pas introduire de mention AGEFIPH/TIH dans les études de cas.
- Ne pas classer ni titrer par techno en accroche : la techno est une
  explication (arbitrage), jamais un argument d'appel.
- Pas de nouvelle dépendance sans nécessité démontrée.

---

## 8. Données à fournir par Agathe (bloquantes pour D3, pas pour le reste)

Par cas veille : périmètre et sources de la veille, fréquence d'envoi, durée
de mise en place, stack réelle (agent + envoi mail), 1–2 chiffres honnêtes,
citation client, budget « à partir de » accepté, extrait visuel de la lettre.
Plus : les `budgetIndicatif` qu'elle accepte d'afficher sur les fiches
existantes (sinon laisser null) et validation des 5 cas `featured`.
