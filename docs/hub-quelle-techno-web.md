# Hub « Quelle techno web ? » — navigation, hub éditorial & outils

Plan d'exécution dérivé de [evolution-offre-next-impact.md](./evolution-offre-next-impact.md)
(doctrine d'offre) et du brief hub. Ce document couvre la **navigation**, les
**bannières internes**, l'**organisation du hub** et les **outils en ligne**.

Validé le 2026-06-29.

---

## Décisions validées

1. **Nom du hub** en nav : « Quelle techno web ? » (distinctif, mémorisable,
   compatible newsletter).
2. **URL du hub** : re-thématiser la route existante `/documentation` (préserve
   le link-equity SEO) plutôt que créer un nouveau slug. Les 6 rubriques en
   sous-routes `/documentation/<rubrique>`. *À confirmer avec le chantier SEO
   avant exécution ; l'alternative `/quelle-techno-web` + 301 reste possible.*
3. **Dépannage WordPress** : nesté sous « Services » dans le header (header lean),
   tout en gardant son accès direct `/depannage-wordpress` pour les mailings.
4. **Pages Conseil manquantes** (second avis, roadmap, sparring) : la nav pointe
   en transition vers des ancres `/conseil#…` ; les pages dédiées sont créées
   ensuite.

---

## Principe directeur

La navigation doit **raconter le funnel**, pas lister un catalogue :

> Comprendre → Décider → Construire → Réparer

| Moment | Doc offre | Rôle du hub | Brique de nav |
|---|---|---|---|
| Comprendre | (avant-vente) | **le hub** | **Quelle techno web ?** |
| Décider / Cadrer | Visio · Second avis · Roadmap | oriente vers | **Conseil** |
| Construire | WordPress / Headless / plateforme | rend crédible | **Services** + **Réalisations** |
| Réparer | Dépannage | rubrique « Réparer ou refaire » | sous Services |

Le hub est le **moteur de contenu** qui irrigue les trois étages payants : il est
hissé au même rang qu'eux, plus rangé dans « Ressources ».

---

## 1. Header

Desktop — 5 entrées + zone CTA à deux températures :

```
[◼ NEXT IMPACT]  Quelle techno web ? ▾  Conseil ▾  Services ▾  Réalisations  À propos    [Audit gratuit]  Réserver une visio
```

### Méga-menu « Quelle techno web ? » (le hub)

Les 6 rubriques + la méthode + l'accès outils :

- Choisir sa techno · IA & code · Réparer ou refaire · Avant de signer · Outils
  métier · Signal techno
- Pied de menu : **La Boussole Techno Web & IA** · Tous les outils · Toutes les
  ressources

### Dropdown « Conseil » (pilier de monétisation)

- Visio décision techno — 180 € → `/conseil` *(existe)*
- Second avis techno — 390 € → `/conseil/second-avis` *(à créer)*
- Roadmap Techno Impact — dès 950 € → `/conseil/roadmap` *(à créer)*
- Sparring partner techno — abo → `/conseil/sparring` *(à créer)*
- Bas de menu (froid) : « Pas encore sûr ? → Audit gratuit »

### Dropdown « Services » (construire + réparer)

- WordPress optimisé — dès 2 250 €
- Headless + Next.js — dès 4 000 € → pillar `/wordpress-headless`
- Plateforme métier / sur-mesure — dès 6 500 €
- — séparateur —
- Réparer un site existant → `/depannage-wordpress`

**Réalisations** et **À propos** restent des liens plats : la preuve doit rester à
un clic (doctrine « prouver avant de demander »).

### CTA — deux températures

L'ancien dropdown « À la demande » est dissous (items redistribués). À la place :

- **Audit gratuit** (froid, vermillon, dominant) → `/audit-site-web`
- **Réserver une visio** (tiède, texte secondaire) → `/conseil`

**Mobile** : drawer en accordéon des 5 sections ; Audit gratuit en bouton plein
vermillon en tête, Visio en lien dessous.

> Variante minimale (moins de dev) : renommer seulement « Ressources » → « Quelle
> techno web ? » et fusionner « Outils en ligne » dedans, garder Conseil dans le
> CTA. On perd l'expression du funnel.

---

## 2. Bannières internes (système anti-cannibalisation)

Principe : **le contenu donne les critères, le conseil les applique au cas du
client.** Quatre bannières typées, jamais agressives :

1. **Bannière Boussole** (haut de hub / rubrique) — « 8 critères pour trancher ».
   Rôle : crédibiliser.
2. **Bannière prochaine étape** (fin de rubrique / d'article) — routée par
   rubrique, température adaptée :
   - Avant de signer → « Vous avez un devis ? Second avis — 390 € »
   - Réparer ou refaire → « WordPress bloque ? Dépannage dès 149 € »
   - Outils métier → « Projet structurant ? Roadmap dès 950 € »
   - Choisir sa techno → « Une question précise ? Visio — 180 € »

   Réutilise le pattern existant `VisioConseilBanner` / `WordpressExpressBanner` :
   on en fait une famille paramétrée par rubrique.
3. **Bannière Signal techno / Newsletter** — capture email, prolongement du hub.
4. **Micro-note d'indépendance** (sous chaque bannière offre) — « Le contenu suffit
   pour comprendre. Le conseil sert à décider pour *votre* cas. »

Sur la **home** : ajouter une bannière teaser Hub (sœur des bannières dépannage /
visio déjà en place) pointant vers « Quelle techno web ? ».

---

## 3. Organisation du hub

Le hub absorbe **Comprendre + les outils décisionnels** sur **deux couches**
(démonstratif au premier plan, explicatif en couche cliquable).

- **Couche 1 — Décision (par questions, en avant).** Les 6 rubriques. Chacune
  suit : *problème → réponse courte → options → critères (Boussole) → risques →
  reco → prochaine étape (offre)*.
- **Couche 2 — Bibliothèque (« Approfondir »).** Les 7 catégories actuelles de
  `/documentation` rétrogradées en couche cliquable : on préserve le SEO sans en
  faire l'accroche.

### Mapping : ce que chaque rubrique réutilise

| Rubrique (question) | Contenus « Comprendre » réutilisés | Outils rattachés | Offre cible |
|---|---|---|---|
| **Choisir sa techno** | Pillar `/wordpress-headless`, « Comprendre le headless », blog WP-Headless-vs-classique, quelle-techno-média | Quiz WP/Headless, Diagnostic projet, Simulateur de tarifs | Visio — 180 € |
| **IA & code** | *(à créer : IA peut coder mais faut-il construire ? · prototype vs produit · vibe coding · cadrer avant de générer)* | Diagnostic Web & IA | Visio / Roadmap |
| **Réparer ou refaire** | Blog « refaire WP sans déstabiliser l'équipe », passage WP-headless | Audit site (`/audit-site-web`) | Dépannage 149 € ou Visio |
| **Avant de signer** | *(à créer : lire un devis · questions avant refonte · pièges des stacks · quand un 2e avis)* | Cahier des charges, Simulateur de tarifs | **Second avis — 390 €** |
| **Outils métier** | Doc « anatomie d'une web app », *(à créer : annuaire · carte · espace membre · Airtable/Notion/SaaS)* | Diagnostic PWA, Diagnostic projet | Roadmap 950 €+ / Plateforme |
| **Signal techno** | Blog / veille décryptée | Inscription newsletter | Newsletter → Sparring |

**La Boussole** (besoin · usage · autonomie · budget · maintenance · données ·
évolutivité · time-to-value) = bandeau-méthode permanent, en tête de hub et de
chaque rubrique. C'est le fil rouge qui distingue le hub d'un blog.

**URL** : voir décision 2.

---

## 4. Outils en ligne

5 outils pensés comme **aides à la décision** : chacun répond à une question d'une
rubrique, rend un **signal** (jamais une réponse complète), et **route vers une
offre**. Tous réalisables en **questionnaire / calculateur client-side** (pas
d'API lourde, cohérent avec le choix sans Stripe et l'audit réel mocké). Les deux
marqués *(IA V2)* pourront recevoir une couche d'analyse Claude plus tard ; en V1
un questionnaire structuré suffit.

Critères : décisionnel · oriente sans forcer · léger · finit sur une offre ·
anti-hype.

### Tier 1 — à construire en premier

| Outil | Rubrique | Question | Signal de sortie | Offre cible |
|---|---|---|---|---|
| **La Boussole Techno Web & IA** | transversal / Choisir | « Par où commencer ? » | Note sur les 8 critères → famille recommandée (WP / no-code / Headless / SaaS / sur-mesure / réparer) | Visio 180 € / Roadmap |
| **Décrypteur de devis web** *(IA V2)* | Avant de signer | « Ce devis est-il bon ? » | Checklist (propriété du code, hébergement, dépendance, postes flous, maintenance, surdimensionnement) → *signer / ajuster / 2e avis* | **Second avis — 390 €** |
| **Réparer ou refaire ?** | Réparer ou refaire | « Mon WordPress est-il en bout de course ? » | Âge, version PHP/WP, nb plugins, fréquence de bugs, besoin d'évolution → *réparer / optimiser / refondre* | Dépannage 149 € ou Services |
| **IA : prototype jetable ou produit maintenable ?** *(IA V2)* | IA & code | « J'ai généré un truc avec l'IA, et maintenant ? » | Utilisateurs réels ? données sensibles ? qui maintient ? besoin d'évoluer ? → *OK proto / à cadrer / à reconstruire* | Visio / Roadmap |

Les deux plus différenciants : le **Décrypteur de devis** (match direct avec
Second avis, capte les prospects proches d'achat) et **prototype IA** (incarne
« l'IA code vite, Next Impact aide à choisir juste »).

### Tier 2 — ensuite

| Outil | Rubrique | Question | Signal de sortie | Offre cible |
|---|---|---|---|---|
| **No-code, SaaS ou sur-mesure ?** | Choisir / Outils métier | « Webflow, un SaaS, ou du développement ? » | Autonomie, budget, spécificité, données, volume → famille recommandée | Visio / Services |

### Outils existants à conserver et re-rattacher au hub (pas de doublon)

- Quiz WP/Headless → *Choisir*
- Audit `/audit-site-web` → *Réparer ou refaire*
- Cahier des charges + Simulateur de tarifs → *Avant de signer*
- Diagnostic PWA → *Outils métier*
- **Simulateur AGEFIPH : reste hors hub** (dans `/outils` + près du devis) —
  c'est le « 2e message », jamais une question de choix techno.

### Architecture des outils

Faire de **la Boussole l'aiguilleur maître** : point d'entrée neutre du hub qui,
selon les réponses, propose le bon outil spécialisé (devis, réparer/refaire,
prototype IA…). Évite le « catalogue d'outils » et garde une décision par écran.
Le `Diagnostic projet` (`/services/eligibilite`) reste, lui, le funnel orienté
*services* NI. La page `/outils` reste comme index plat « tous les outils »
(cible de deep-link).

---

## 5. Garde-fous anti-cannibalisation

- Chaque résultat d'outil se termine par : « ce signal vous oriente — pour
  l'appliquer à *votre* cas : Visio / Second avis. » L'outil qualifie, le conseil
  tranche.
- Le contenu de hub ne résout jamais tout gratuitement : assez de clarté pour
  comprendre la valeur d'un arbitrage payant, pas un cahier des charges.
- AGEFIPH / OETH = 2e message, jamais en accroche de hub ni d'outil.

---

## 6. Séquençage proposé

1. Header + bannières internes (re-câblage nav, clés i18n FR/EN).
2. Re-thématisation du hub `/documentation` (couche 1 décisionnelle + Boussole) +
   rétrogradation des catégories en couche « Approfondir ».
3. Outils Tier 1 (commencer par la Boussole, socle de l'aiguilleur).
4. Pages Conseil dédiées (second avis, roadmap, sparring).
5. Contenus manquants des rubriques IA & code / Avant de signer.
6. Outils Tier 2.
