# Projet de refonte — next-impact.digital

**Cadrage et plan d'exécution**
Auteur du cadrage : architecture & dev web senior
Référence : alignement sur le profil Malt « Expert Création Site web | Web & Mobile App »

---

## 1. Contexte et déclencheur

Le profil Malt a évolué d'un positionnement de spécialiste technique WordPress vers un positionnement plus large : **Expert Création Site web | Web & Mobile App**. La description publique a été reformulée pour des décideurs non techniques, structurée autour de trois voies (site WordPress classique, site Headless WordPress + Next.js, application web ou mobile sur-mesure), sans mention d'Astro et en sous-entendant la stack Payload + Neon pour les applications.

Le site `next-impact.digital` reflète encore le positionnement antérieur : trois paliers techniques tous adossés à WordPress (monolithique optimisé / Headless + Astro / Headless + Next.js), un vocabulaire d'expert, une cible ESS/TPE/PME ancrée et une absence visible de l'offre applicative — alors même que **deux réalisations sur trois récentes sont déjà des applications pures sans WordPress**.

L'objet de ce document est de planifier le réalignement du site sur le nouveau positionnement, sans casser ce qui fonctionne (SEO acquis sur WordPress Headless, livre blanc, persona switch, argument OETH).

---

## 2. Diagnostic d'écart

### 2.1 Pivot stratégique sous-jacent

Le titre Malt révèle un repositionnement déjà engagé dans les faits mais pas dans la communication. Trois projets attestent du virage applicatif :

| Projet | Stack réelle | Famille |
|---|---|---|
| **Panorama Pub** (mai 2026) | Next.js + PostgreSQL + TS + Tailwind + Vercel | Web app pure (annuaire B2B / marketplace) |
| **Hermitage Jeu de piste** (avril 2026) | Next.js + PWA, sans WordPress | Application mobile pure |
| **Comme des fous - Jeux** (févr. 2026) | WP Headless + Next.js | Extension applicative sur site Headless |

Côté communication, ces projets sont noyés dans une page `/etudes-de-cas` qui les présente au même rang que des sites vitrines, parfois avec une stack mensongère (la fiche Hermitage affirme utiliser WordPress + Headless CMS — c'est faux ; la fiche Panorama Pub porte des meta-keywords incluant WordPress, Headless et Astro — c'est faux trois fois).

### 2.2 Décalages site / profil Malt

| Axe | État actuel du site | État cible | Sévérité |
|---|---|---|---|
| Architecture éditoriale | Trois paliers techniques WP | Deux jambes : Sites web / Apps web & mobile | 🔴 |
| Présence d'Astro | Pilier central (logo, meta, offres, doc) | Éradiqué | 🔴 |
| Offre applicative | Inexistante en page commerciale | Section dédiée sur `/services` | 🔴 |
| Vocabulaire | Très technique (API, Core Web Vitals, monolithique, stack) | Adressé aux décideurs | 🟡 |
| Cible | ESS/TPE/PME centrée | Universelle, OETH en avantage transverse | 🟡 |
| Diagnostic interactif `/contact` | 3 résultats orientés stack WP | 4 résultats orientés besoin | 🔴 |
| Fiche Hermitage | Stack erronée (WP/Headless) | Stack réelle (Next.js + PWA) | 🔴 |
| Meta Panorama Pub | Keywords mensongers (WP/Headless/Astro) | Keywords alignés (Next.js/PostgreSQL/marketplace) | 🔴 |
| Livre blanc | Unique, centré WP Headless | Maintenu + compagnon "Web app" | 🟡 |
| CTA récurrent | « back-office le plus utilisé au monde » | Formulation neutre | 🟡 |
| Image OG | alt="WordPress Headless & Next.js" | alt à élargir | 🟢 |
| Cohérence d'ancienneté | « 8+ ans d'expérience » vs récit 15+5 ans | À harmoniser | 🟢 |

---

## 3. Vision cible

### 3.1 Architecture éditoriale en deux jambes

```
                 NEXT IMPACT DIGITAL
        Création Site web | Web & Mobile App
                       │
       ┌───────────────┴───────────────┐
       │                               │
   SITES WEB                  WEB & MOBILE APP
       │                               │
  ┌────┴────┐                  ┌───────┴───────┐
  │         │                  │               │
  Site WP   Site Headless   Web app         App mobile
  classique (WP + Next.js)  sur-mesure      (PWA Next.js,
  (Elementor/                (Next.js +      ou natif si
  Gutenberg)                 PostgreSQL)     besoin)
```

### 3.2 Stack et préférences techniques par voie

Référence technique **interne** (pas exposée en pages commerciales) :

| Voie | Frontend | Back-office | Persistance | Hébergement |
|---|---|---|---|---|
| Site WP classique | Thème WP | WordPress | MySQL natif WP | Mutualisé / VPS |
| Site Headless | Next.js | WordPress (headless) | MySQL natif WP | Vercel + hébergeur WP |
| Web app sur-mesure | Next.js | Admin autonome sur-mesure (selon besoin) | Base PostgreSQL serverless | Vercel |
| App mobile / PWA | Next.js + PWA (manifest + service worker) | Aucun ou admin autonome selon projet | LocalStorage / IndexedDB ou base dédiée | Vercel |

**Référence commerciale** (ce qui est mis en avant côté décideur) : la **possibilité d'administration autonome**. Le client garde la main sur ses contenus, ses données et ses utilisateurs, sans dépendance technique récurrente — comme avec WordPress, mais conçu pour la logique métier du projet.

Les noms d'outils spécifiques (CMS, base de données, hébergement) ne sont **jamais nommés en page commerciale grand public**. Ils apparaissent uniquement dans la documentation persona « Développeur » et dans les fiches projets, à titre informatif.

### 3.3 Cartographie des études de cas

| Projet | Voie principale | Tag mis en avant |
|---|---|---|
| Panorama Pub | Web app sur-mesure | Web app, Marketplace |
| Hermitage Jeu de piste | App mobile | App mobile, PWA |
| Comme des fous - Jeux | Site Headless (extension applicative) | Site Headless, Web app |
| Comme des fous (média) | Site Headless | Site Headless |
| Café citoyen | Site Headless | Site Headless |
| Les Doléances | Site Headless | Site Headless |
| États Généraux Communaux | Site Headless | Site Headless |
| Next Event | Site Headless (démo) | Démo, Site Headless |

La jambe Apps dispose donc dès aujourd'hui de **trois preuves sociales**, dont deux pures (Panorama Pub, Hermitage) et une hybride (Comme des fous Jeux).

---

## 4. Plan d'exécution en 3 vagues

### 🔴 Vague 1 — Repositionnement structurel (J+0 → J+5)

Objectif : qu'un visiteur consultant simultanément Malt et le site ne perçoive aucune dissonance.

| # | Action | Pages concernées |
|---|---|---|
| 1.1 | Éradication d'Astro (meta, contenu, logo, diagnostic, offres, doc, `/avantage-oeth`) | Globale |
| 1.2 | Correction de la stack annoncée sur la fiche Hermitage | `/etudes-de-cas/hermitage-jeu-de-piste` |
| 1.3 | Correction des meta-keywords Panorama Pub | `/etudes-de-cas/panorama-pub` |
| 1.4 | Refonte de la home en deux jambes | `/` |
| 1.5 | Mise en vitrine de Panorama Pub (1re position, bandeau "Réalisation phare") | `/`, `/etudes-de-cas` |
| 1.6 | Nouvelle taxonomie des filtres études de cas | `/etudes-de-cas` |
| 1.7 | Refonte du diagnostic interactif (3 → 4 résultats orientés besoin) | `/contact` |
| 1.8 | Mise à jour des meta globales (title, OG, Twitter, description) | Toutes les pages |
| 1.9 | **Harmonisation de la nomenclature des forfaits** (Solidaire/Équilibre/Soutien partout) | Home, `/avantage-oeth`, `/services` |
| 1.10 | **Audit technique du persona switch** : implémentation réelle ou cosmétique ? | Globale (audit code) |

### 🟡 Vague 2 — Refonte éditoriale et nouvelle offre (J+5 → J+15)

| # | Action | Pages concernées |
|---|---|---|
| 2.1 | Refonte de `/services` en deux sections (Sites web / Applications) + bascule cible universelle | `/services` |
| 2.2 | Nouveau récit `/a-propos` (dualité site/app assumée) | `/a-propos` |
| 2.3 | **Refonte de `/avantage-oeth`** : hero élargi, simulateur 4 options, transversalité aux deux jambes | `/avantage-oeth` |
| 2.4 | **Maillage OETH transverse** : encart « Avantage OETH applicable » sur la section Apps de `/services` | `/services` |
| 2.5 | Réécriture pour décideurs : neutralisation du jargon | Pages grand public |
| 2.6 | **Déclinaison persona switch** : version Utilisateur + Développeur de chaque page refondue | Pages critiques (cf. §5.11) |
| 2.7 | CTA récurrent : remplacement de la formulation back-office | Globale |
| 2.8 | Création du livre blanc compagnon « Web app sur-mesure » | Ressource PDF |
| 2.9 | Footer : deux liens livre blanc parallèles | Footer global |
| 2.10 | Refonte de la fiche Hermitage (récit, stack réelle, screenshots mobile) | `/etudes-de-cas/hermitage-jeu-de-piste` |
| 2.11 | Audit des outils en ligne (simulateur ROI biaisé Headless WP) | `/outils/*` |
| 2.12 | Mise à jour de l'image OG et de son alt | Assets globaux |

### 🟢 Vague 3 — Consolidation (J+15 → J+30)

| # | Action | Pages concernées |
|---|---|---|
| 3.1 | Création d'une catégorie doc « Applications web & mobile » | `/documentation` |
| 3.2 | Articles prioritaires (cf. §7.3) | `/documentation/...` |
| 3.3 | Mise à jour de la mind map (élargissement au-delà du WP) | `/documentation/mind-map` |
| 3.4 | Nouveaux assets visuels (mockup mobile, capture Hermitage, vidéo gameplay) | Globale |
| 3.5 | SEO : ajout des mots-clés Apps, retrait de tout Astro | Meta, contenus |
| 3.6 | Redirections 301 si pages dédiées Astro existent | `next.config.js` |
| 3.7 | QA des personas switch (vérifier qu'elles diffèrent vraiment à l'œil) | Globale |
| 3.8 | Harmonisation de l'ancienneté revendiquée | Globale |
| 3.9 | Monitoring Search Console post-bascule | Suivi |

---

## 5. Spécifications page par page

### 5.1 Home (`/`)

**Hero** — remplacer le bloc actuel « Trois niveaux de modernisation du WordPress monolithique optimisé au headless Next.js » par une formulation orientée besoin :

> Du site vitrine à la plateforme métier sur-mesure.
> Je conçois et développe vos sites web et vos applications (web & mobile).

**Logos technos** — retirer le logo Astro. Conserver WordPress + Next.js. Envisager d'ajouter un picto représentatif de la jambe Apps (téléphone + Next.js, ou simplement deux blocs visuels Sites/Apps).

**Bandeau « Réalisation phare »** (nouveau) — bloc plein écran sous le hero pointant vers Panorama Pub, avec capture d'écran de l'annuaire et tagline « Marketplace B2B livrée en 2 mois ».

**Diagnostic interactif** — voir §5.7.

**Bloc pédagogique** — les trois cartes actuelles (« Fonctionnement du Headless », « Pourquoi choisir le Headless ? », « Pour quels objectifs ? ») restent pertinentes pour la jambe Sites Headless mais doivent être contrebalancées par un bloc équivalent côté Apps : « Pourquoi une web app ? », « PWA : l'app sans store », « Pour quels projets ? ».

### 5.2 Services (`/services`)

Refonte en deux sections clairement séparées visuellement, avec une **cible désormais universelle** (le solidaire n'est plus le premier rideau de positionnement).

**Restructuration du cadre tarifaire — décision tranchée**

Les trois forfaits actuels (Solidaire / Équilibre / Soutien) ne sont plus présentés comme un fléchage par typologie de structure, mais comme un **système d'éligibilité tarifaire** : la même prestation peut être facturée à trois niveaux selon le profil et la mission sociale du client. La philosophie solidaire de Next Impact reste lisible et assumée, mais ne préside plus à l'organisation de la page.

Implication concrète : un visiteur PME ou grand compte arrivant sur `/services` ne doit plus se sentir « hors-cible » dans les trois premières secondes de lecture. Le cadrage ESS apparaît dans un second temps, comme une dimension de l'offre, pas comme la porte d'entrée.

**Section 1 — Création de sites web**

Conserver la structure des trois forfaits en supprimant la mention « Astro » de l'offre Équilibre. Reformulation des en-têtes :

| Forfait | Stack | Cible indicative | Tarif |
|---|---|---|---|
| Solidaire (2 250 €) | WP classique ou Headless léger | TPE, associations, projets en démarrage | TJM 350 € |
| Équilibre (4 000 €) | WP Headless + Next.js | PME, SCOP, SCIC, associations employeuses, fondations | TJM 450 € |
| Soutien (5 000 €) | WP Headless complexe / multisites | PME / ETI, grands comptes, structures à fort CA | TJM 650 € |

Le bloc « Impact social » et la mention « Mécène de la transition numérique » sont **conservés mais déplacés en bas de section**, comme une caractéristique transverse de l'offre Soutien, et non plus comme un argument central de la page.

Les critères d'éligibilité tarifaire (justificatif financier, statuts ESS) sont déplacés dans une zone repliable « Conditions tarifaires solidaires » plutôt qu'affichés en évidence.

**Section 2 — Applications web & mobile sur-mesure** (nouvelle)

Pas de forfait fixe : sur devis, après cadrage. Structure :

- **Caractéristiques** : logique métier propre, comptes utilisateurs, paiement, données temps réel, fonctionnalités mobiles natives (géolocalisation, mode hors-ligne, installation sur écran d'accueil)
- **Cas d'usage** : marketplace, outil interne, plateforme métier, jeu en ligne, simulateur, application terrain
- **Avantage différenciant** (à mettre en avant) : *« Vous gardez la main. Comme WordPress vous permet de gérer votre site sans dépendre d'un développeur au quotidien, chaque application livrée s'accompagne d'une interface d'administration autonome, conçue sur-mesure pour votre logique métier. Vous gérez vos contenus, vos données et vos utilisateurs en toute autonomie. »*
- **Avantages** : sur-mesure intégral, performances maximales, autonomie de gestion comparable à WordPress, pas de limites imposées par un CMS générique
- **Limites** : budget plus conséquent, maintenance continue, équipe technique nécessaire pour les évolutions structurelles
- **Preuves** : cards directes vers Panorama Pub (web app avec admin autonome) et Hermitage (application mobile PWA)

Aucune mention de nom de CMS, de base de données ou d'hébergeur sur cette page. Ces informations restent en interne ou dans les fiches projets détaillées.

L'avantage OETH s'applique aux deux sections de manière **transverse** : la déduction est annoncée comme bénéfice de toute prestation Next Impact (Sites web comme Apps), sans distinction.

### 5.3 À propos (`/a-propos`)

Le récit en trois actes reste, mais le troisième acte mute :

- **2005 — Le terrain** : 15 ans à utiliser WordPress (inchangé)
- **2020 — Le retour au code** : passage au développement (inchangé)
- **Aujourd'hui — Next Impact** : reformulé

Proposition de réécriture du 3ᵉ acte :

> **Deux métiers, une exigence**
>
> Aujourd'hui, Next Impact ce sont deux savoir-faire complémentaires : moderniser les sites WordPress qui en valent la peine, et bâtir des applications web et mobiles quand WordPress n'est plus le bon outil.
>
> - **L'expertise WordPress** : 15 ans côté édition, 5 ans côté code. Je sais ce qu'il faut absolument préserver de l'admin et ce qu'on peut révolutionner sous le capot.
> - **Le sur-mesure applicatif** : Next.js, base de données dédiée, PWA mobile. Pour les marketplaces, outils métier, simulateurs, jeux en ligne — là où le CMS atteint ses limites.
> - **L'accélération par l'IA** : outils d'audit et workflows pour livrer vite, aux standards de la Tech.

Citation finale conservée, légèrement adaptée :

> « WordPress n'est pas le problème. C'est ce qu'on en fait qui peut l'être — et c'est ce que je modernise. Quand il n'est pas la bonne réponse, je construis autre chose. »

### 5.4 Index études de cas (`/etudes-de-cas`)

**Filtres** — nouvelle taxonomie en deux dimensions :

| Famille (filtre principal) | Secteur (filtre secondaire) |
|---|---|
| Site vitrine | Corporate |
| Site Headless | Institutionnel |
| Web app | ESS |
| App mobile / PWA | Média |

**Ordre par défaut** : Panorama Pub en première position (réalisation la plus récente + pièce maîtresse de la jambe Apps), suivi des autres projets par antériorité.

### 5.5 Fiche Panorama Pub

**Corrections meta** :
- `meta-keywords` : supprimer WordPress, WordPress Headless, CMS Headless, Astro. Ajouter : web app, application web, marketplace, annuaire B2B, PostgreSQL, base de données, Next.js, Vercel.
- `meta-og:image:alt` : à reformuler — supprimer toute mention WP/Headless si présente.
- `meta-twitter:description` : OK (ne mentionne pas de stack).

**Bloc « Technologies utilisées »** : conserver en l'état (Next.js, PostgreSQL, TypeScript, Tailwind CSS, Vercel).

**Tag mis en avant** : ajouter « Web app sur-mesure » comme tag principal au-dessus des tags secteur.

### 5.6 Fiche Hermitage Jeu de piste

Refonte intégrale du contenu.

**Stack réelle confirmée** : PWA (Next.js + manifest + service worker), **sans backend serveur**. Persistance entièrement côté client (LocalStorage ou IndexedDB pour la progression et les scores). Géolocalisation via l'API navigateur native.

**Sous-titre actuel à supprimer** :

> « Création d'un jeu de piste en ligne […] utilisant une architecture WordPress Headless avec Next.js pour offrir une expérience ludique et interactive. »

**Sous-titre cible** :

> Création d'une application mobile (PWA) pour le domaine forestier du Tiers Lieu L'Hermitage. Une expérience ludique et géolocalisée, installable sur smartphone sans passer par les stores et fonctionnant sans connexion permanente.

**Présentation du projet** : supprimer toutes les mentions « WordPress Headless » du corps du texte (3 occurrences). Réécrire en mettant en avant :
- L'absence totale de serveur dédié (la PWA tourne entièrement sur le smartphone des visiteurs)
- La géolocalisation comme moteur du jeu (énigmes contextuelles selon la position dans le domaine)
- La persistance locale (la progression reste sur l'appareil, pas besoin de compte)
- L'installation sans store (ajout à l'écran d'accueil iOS/Android)

**Bloc « Technologies utilisées »** — remplacer par :

> Next.js • PWA • Géolocalisation • Persistance locale • Tailwind CSS • Vercel

**Tags** : retirer WordPress, Headless, Next.js (Next.js reste dans la stack mais n'est pas un tag de différenciation). Ajouter : **App mobile**, **PWA**, **Géolocalisation**, **Gamification**, **Hors-ligne**.

**Visuels** : remplacer le logo Hermitage actuel par une capture d'écran réelle en mode mobile, idéalement avec mockup smartphone. Une seconde capture pourrait montrer le mode plein écran après installation sur l'écran d'accueil (pour matérialiser l'aspect "vraie app").

**Cohérence narrative** : cette fiche devient la preuve technique la plus claire de l'offre "App mobile" de la nouvelle section `/services`. Le couple Panorama Pub (web app avec admin autonome) + Hermitage (app mobile autonome) couvre les deux cas d'usage de la jambe Apps.

### 5.7 Diagnostic interactif (`/contact`)

Reprogrammation de la logique de scoring. Aujourd'hui les 4 questions aboutissent à 3 recommandations WP. Cible :

**Question existante 1 — Type de projet**
- Site vitrine ou institutionnel → biais Voie A ou B
- Plateforme métier ou applicative → biais Voie C
- Outil mobile / sur le terrain → biais Voie D

**Question existante 2 — Volumétrie de trafic**
- Inchangée (sert à départager A et B)

**Question existante 3 — API / intégrations sur-mesure**
- Inchangée (renforce B ou C)

**Question existante 4 — Raison de modernisation**
- Ajouter une option « Logique métier ou fonctionnalités avancées » (renforce C/D)

**Nouvelle question** :
- « Vos utilisateurs auront-ils besoin d'un compte ? d'une expérience mobile dédiée ? »
  - Oui, compte utilisateur → C ou D
  - Oui, expérience mobile → D
  - Non → A ou B

**Résultats possibles** :
1. Présence Essentielle (Voie A — WP classique)
2. Croissance Accélérée (Voie B — WP Headless + Next.js)
3. Plateforme Sur-Mesure (Voie C — Web app)
4. Application Mobile (Voie D — PWA Next.js)

### 5.8 Documentation (`/documentation`)

**Nouvelle catégorie** : « Applications web & mobile » (à côté des 6 catégories existantes).

**Articles prioritaires à créer** :
- *Site web ou web app : comment choisir ?*
- *PWA vs application mobile native : avantages, limites, coûts*
- *Qu'est-ce qu'un CMS Headless ?* (généraliste, pas que WordPress)
- *Quand WordPress n'est plus le bon outil*

**Mind map** : élargir au-delà du WP pour cartographier les deux jambes.

**Articles existants** : audit complet pour traquer les mentions Astro résiduelles. Catégorie « Headless CMS » (35 articles) à passer en revue en priorité.

### 5.9 Navigation et footer

**Navigation principale** — option modérée recommandée : conserver la structure actuelle mais reformuler `/services` pour qu'elle reflète les deux jambes dès l'arrivée sur la page.

**Footer** — modifications :
- Lien « Livre blanc WordPress Headless » → scindé en deux entrées parallèles
- Ajouter « Démarrer une application web » dans la colonne CTA
- Conserver la mention TIH / OETH (avantage transverse)

### 5.10 Livre blanc

**Existant** : « Qu'est-ce que WordPress Headless ? » — conservé, audit nécessaire pour retirer les éventuelles mentions Astro.

**Nouveau** : « Du site web à la web app — Guide de l'application sur-mesure ». Structure recommandée :
1. Quand un site ne suffit plus
2. Web app, PWA, app native : les trois familles
3. Cas concrets (Panorama Pub et Hermitage, nommés ou anonymisés selon arbitrage)
4. Méthode de cadrage et coûts indicatifs
5. La promesse d'autonomie : pourquoi une application sur-mesure ne signifie pas dépendance technique (l'angle « admin autonome » comme pont avec la familiarité WordPress)

### 5.11 Persona switch — framework éditorial

Le switch Décideur / Utilisateur / Développeur est **maintenu** sur les trois personas. Conséquence : chaque page refondue doit être rédigée en trois versions cohérentes. Cette section pose le cadre.

**Grille de différenciation des trois personas**

| Dimension | Décideur | Utilisateur | Développeur |
|---|---|---|---|
| Objectif de lecture | Décider d'investir | Comprendre ce qu'on lui livre | Évaluer la faisabilité technique |
| Vocabulaire | Business : ROI, time-to-market, TCO, charges, équipe | Métier : workflow, formation, autonomie, accessibilité | Technique : stack, architecture, performance, sécurité |
| Bénéfices mis en avant | Économies, conformité, image, croissance | Simplicité, gain de temps quotidien, maîtrise | Robustesse, maintenabilité, standards |
| Preuves attendues | Chiffres, ROI, OETH, références clients | Captures, démos, témoignages utilisateurs | Stack, indicateurs Lighthouse, schémas d'architecture |
| Longueur préférée | Synthétique, scannable | Moyenne, illustrée | Dense, références techniques |
| CTA dominant | Démarrer un projet, simuler le ROI / l'OETH | Voir une démo, télécharger un guide | Voir une étude de cas technique, consulter la doc |

**Workflow de rédaction recommandé**

Pour chaque page à refondre :

1. **Décideur d'abord** — c'est la version la plus stratégique (volume de visites, conversion) et celle qui pilote le cadrage commercial. Elle pose le sens.
2. **Utilisateur en second** — adaptation depuis la version Décideur en réorientant vers le quotidien d'usage. La structure de la page est conservée, les blocs sont reformulés.
3. **Développeur en dernier** — version la plus technique. Peut intégrer des éléments invisibles aux deux autres personas (extraits de code, diagrammes, mentions de Payload/Neon/PostgreSQL).

**Mécanique technique à valider**

Aujourd'hui le switch est visible mais sa profondeur d'implémentation n'est pas évidente à l'œil nu. À auditer dès le début de la vague 1 :

- Le switch est-il implémenté via un state React qui swap réellement des blocs de contenu, ou via une simple bascule cosmétique (titres + descriptions seulement) ?
- Comment le contenu différencié est-il stocké : variables conditionnelles dans le JSX, structures de données dédiées (un objet par persona), ou champs custom dans un éventuel back-office ?
- La persistance du choix entre les pages est-elle assurée (localStorage, cookie, contexte global) ?

Cet audit conditionne l'effort réel de la refonte éditoriale : sur une vraie implémentation, on multiplie par 3 le volume rédactionnel ; sur un système cosmétique, la refonte se limite aux titres et CTA.

**Charge éditoriale estimée**

À volume de pages constant, prévoir un coefficient **×2,5 à ×3** sur l'effort rédactionnel de chaque page refondue (les versions Utilisateur et Développeur ne sont pas des copies-collés, mais des reformulations complètes). Les éléments structurels (mise en page, visuels, navigation) ne sont pas dupliqués.

**Priorité d'application**

Toutes les pages refondues n'ont pas le même besoin de différenciation persona :

- 🔴 **Critique** : Home, `/services`, `/avantage-oeth`, `/a-propos`, `/documentation` (page d'accueil de la doc)
- 🟡 **Important** : Fiches études de cas phares (Panorama Pub, Hermitage, Comme des fous), pages de catégorie de la documentation
- 🟢 **Optionnel** : Fiches projets secondaires, pages utilitaires (mentions légales, etc.)

Sur les pages 🟢, le persona switch peut être conservé visuellement sans réelle différenciation du contenu (la persona Décideur sert de base par défaut).

### 5.12 Avantage OETH (`/avantage-oeth`)

Cette page est **conservée et valorisée**, mais son angle est élargi pour refléter la transversalité de l'OETH sur les deux jambes.

**Hero — reformulation**

Actuel :
> « Réduisez votre contribution AGEFIPH en investissant dans votre site web — Prestataire TIH spécialisé WordPress Headless : 30% du coût de main-d'œuvre déductible »

Cible :
> « Réduisez votre contribution AGEFIPH en investissant dans votre projet web. Prestataire TIH spécialisé création de sites et d'applications : 30 % du coût de main-d'œuvre déductible de votre obligation d'emploi, quelle que soit la nature du projet (site vitrine, site Headless, web app ou application mobile). »

**Simulateur de déduction AGEFIPH**

Le simulateur actuel propose trois options de montant correspondant aux anciens libellés de la home (« Présence Essentielle 2 250 €, Croissance Accélérée 4 000 €, Plateforme Sur-Mesure 5 000 €). Refonte nécessaire :

- **Aligner les libellés sur la nomenclature `/services`** : Solidaire / Équilibre / Soutien (cf. §6 sur la cohérence des nomenclatures)
- **Ajouter une 4ᵉ option « Application sur-mesure »** avec un montant indicatif type 15 000 € ou « Sur devis (saisie libre) », pour refléter la jambe Apps
- **Permettre la saisie libre d'un montant** — c'est la modalité la plus universelle, surtout pour les Apps qui sont toujours sur devis

**Bloc « Pourquoi choisir un prestataire TIH spécialisé »**

Le titre actuel « Pourquoi choisir un prestataire TIH spécialisé WordPress Headless ? » est à reformuler en « Pourquoi choisir un prestataire TIH spécialisé en création web ? » pour couvrir les deux jambes.

Le bloc « Performance technique » mentionne explicitement « avec Next.js ou Astro » — à corriger en V1 (cf. §6, bug Astro).

Reformulation du bloc « Performance technique » :
> « Des standards techniques élevés sur tous les projets : performances optimales, sécurité renforcée, SEO et accessibilité soignés — que vous nous confiiez un site WordPress, un site Headless ou une application sur-mesure. »

**Articles ressources**

Les deux articles liés (« Réduire sa contribution AGEFIPH » et « Attestation de déductibilité TIH ») sont conservés en l'état — leur contenu RH/comptable est neutre vis-à-vis du repositionnement et n'a pas besoin d'évoluer.

**FAQ**

Conservée. Audit léger pour vérifier qu'aucune question ne sous-entend une restriction à la jambe Sites web.

**Maillage interne**

Ajouter sur `/services` (Section Apps) un encart visible « Avantage OETH applicable » avec lien vers `/avantage-oeth`. Aujourd'hui le maillage va de `/avantage-oeth` vers `/services`, pas l'inverse pour la jambe Apps.

---

## 6. Bugs et corrections ponctuelles

| Bug | Localisation | Action |
|---|---|---|
| Stack mensongère WP/Headless sur Hermitage | `/etudes-de-cas/hermitage-jeu-de-piste` (sous-titre, présentation, bloc technos, tags) | Réécrire avec la stack réelle |
| Meta-keywords mensongères sur Panorama Pub | `<head>` de `/etudes-de-cas/panorama-pub` | Nettoyer (cf. §5.5) |
| Logo Astro encore présent | Home `/` | Retirer l'asset et la balise |
| Mention « Astro ou Next.js » dans l'offre Équilibre | `/services` | Remplacer par « WordPress + Next.js » |
| Mention « Next.js ou Astro » dans Performance technique | `/avantage-oeth` | Retirer Astro, reformuler (cf. §5.12) |
| Fichier `logo-astro-blanc.webp` | `/public/img/` | Supprimer |
| CTA « back-office le plus utilisé au monde » | Toutes pages | Formulation neutre |
| « 8+ ans d'expérience » vs récit 20 ans | Globale | Harmoniser (« 20 ans d'expérience digitale dont 6 en développement ») |
| Alt OG « WordPress Headless & Next.js » | `<meta property="og:image:alt">` | Élargir |
| **Incohérence de nomenclature des forfaits** | Home (diagnostic) + `/avantage-oeth` (simulateur) utilisent « Présence Essentielle / Croissance Accélérée / Plateforme Sur-Mesure » ; `/services` utilise « Solidaire / Équilibre / Soutien » | Choisir **une** nomenclature et l'appliquer partout. Recommandation : retenir Solidaire / Équilibre / Soutien (cohérent avec la philosophie). Mettre à jour la home et `/avantage-oeth` en conséquence. |
| Simulateur AGEFIPH non aligné sur l'offre élargie | `/avantage-oeth` | Ajouter une 4ᵉ option « Application sur-mesure » + saisie libre du montant (cf. §5.12) |
| Hero `/avantage-oeth` exclusif WP Headless | « Prestataire TIH spécialisé WordPress Headless » | Élargir aux deux jambes (cf. §5.12) |
| Bloc « Pourquoi choisir un prestataire TIH spécialisé WordPress Headless ? » | `/avantage-oeth` | Reformuler en « spécialisé en création web » (cf. §5.12) |

---

## 7. Arbitrages

### 7.1 Arbitrages tranchés

- ✅ **Astro** : éradication totale, pas d'historique conservé.
- ✅ **Stack Hermitage** : PWA Next.js sans backend, persistance locale (LocalStorage/IndexedDB), géolocalisation via API navigateur. Fiche à refondre en conséquence (cf. §5.6).
- ✅ **Payload, Neon, PostgreSQL et autres noms d'outils** : jamais nommés en page commerciale grand public. La référence commerciale différenciante de la jambe Apps est la **possibilité d'administration autonome** (analogie avec WordPress, sans dépendance technique récurrente). Les outils techniques restent en interne et dans la documentation persona « Développeur ».
- ✅ **Livres blancs** : deux livres parallèles. Le premier (« Qu'est-ce que WordPress Headless ? ») est conservé pour la jambe Sites web. Le second (« Du site web à la web app ») est à créer pour la jambe Apps.
- ✅ **Cible** : élargissement universel assumé. Le site n'est plus ESS-centré en premier rideau. L'avantage OETH devient un argument **transverse** applicable aux deux jambes (Sites web + Apps), pas un argument central de la marque. La fibre solidaire reste lisible mais cesse de structurer l'argumentaire principal.
- ✅ **Persona switch** : conservé sur les trois personas (Décideur / Utilisateur / Développeur). Implique un cadre éditorial dédié et une charge de maintenance triple sur chaque page modifiée (cf. §5.11).

### 7.2 Arbitrages encore en suspens

Aucun bloquant. Reste un point d'optimisation à benchmarker en cours de route :

- **Effort réel du persona switch maintenu** : à mesurer sur les premières pages refondues. Si la charge éditoriale s'avère trop lourde pour la valeur ajoutée perçue, possibilité de simplifier (deux personas) sera réévaluée à mi-parcours, sans remettre en cause le principe.

---

## 8. SEO et redirections

**Mots-clés à conserver** : WordPress Headless, Next.js, freelance Next.js France, création site web, WordPress freelance.

**Mots-clés à ajouter** : web app sur-mesure, application web Next.js, développeur PWA, marketplace Next.js, application mobile freelance, freelance PostgreSQL Next.js, web app freelance France.

**Mots-clés à abandonner** : tout terme contenant « Astro ».

**Redirections 301 à prévoir** : si des URLs Astro-spécifiques existent (`/astro-headless`, articles de blog dédiés, etc.), redirection vers la page Headless WordPress + Next.js équivalente.

**Monitoring post-bascule** : surveiller la perte sur les requêtes « WordPress Astro freelance » et la montée sur les requêtes Apps. Période d'observation : 4 à 6 semaines minimum.

---

## 9. Assets visuels à produire

| Asset | Usage | Priorité |
|---|---|---|
| Mockup smartphone Hermitage en usage | Fiche Hermitage, section App mobile `/services` | Haute |
| Capture haute résolution Panorama Pub | Bandeau home, fiche projet | Haute |
| Picto / illustration jambe Apps | Home, navigation | Moyenne |
| Vidéo courte gameplay Hermitage | Fiche Hermitage, démo | Moyenne |
| Nouvelle image OG (sans mention WP exclusive) | Meta globale | Moyenne |
| Mind map élargie | `/documentation/mind-map` | Basse |

---

## 10. Risques et points de vigilance

- **Perte SEO court terme** sur les requêtes Astro — acceptée par l'arbitrage business.
- **Dissonance temporaire** entre pages mises à jour et pages en V1 → déploiement atomique recommandé (toutes les pages clés de la vague 1 dans une seule PR).
- **Crédibilité de la stack annoncée** : la correction Hermitage doit être faite avant toute mise en avant — il est plus risqué de pousser une fiche projet en home si elle ment sur la stack.
- **Cohérence du diagnostic interactif** : si on patche au lieu de refondre, l'incohérence sera durable et visible.
- **Charge de maintenance des personas switch** : maintenir trois versions éditoriales de chaque page est exigeant. À benchmarker tôt.
- **Livre blanc compagnon** : la création prend du temps (rédaction + maquette + PDF). À démarrer en parallèle de la vague 2, pas en attendant la fin.

---

## 11. Séquencement recommandé

```
Semaine 1 (J+1 à J+5)        — Vague 1
  J+1     Audit Astro exhaustif + inventaire assets
          + AUDIT TECHNIQUE PERSONA SWITCH (cf. §5.11)
  J+2     Correction Hermitage + meta Panorama Pub (bugs critiques)
  J+3-4   Refonte home (Décideur) + meta globales + suppression Astro
          + harmonisation nomenclatures forfaits (home, /avantage-oeth, /services)
  J+5     Refonte diagnostic interactif + taxonomie études de cas

Semaines 2-3 (J+6 à J+15)    — Vague 2
  J+6-8   Refonte /services (cible universelle) + section Apps
          + refonte /a-propos + refonte /avantage-oeth (transverse OETH)
  J+9-12  Réécriture éditoriale décideur sur pages clés
          + DÉCLINAISON Utilisateur + Développeur des pages critiques
  J+10-15 Production du livre blanc compagnon (en parallèle)
  J+13-15 Audit /outils + audit livre blanc existant
          + maillage OETH transverse vers section Apps

Semaines 4-5 (J+16 à J+30)   — Vague 3
  J+16-22 Documentation : nouvelle catégorie + 4 articles prioritaires
          + déclinaison persona switch sur les nouveaux articles
  J+18-25 Production des assets visuels manquants
  J+23-28 SEO technique + redirections + QA personas approfondie
  J+29-30 Monitoring Search Console + ajustements + bilan persona switch
          (décision maintien ×3 ou simplification ×2)
```

**Quick wins en moins de 48 h** si besoin de débloquer la cohérence Malt avant la refonte complète :

1. Retrait de toutes les occurrences Astro (mécanique).
2. Correction de la fiche Hermitage (mensonge factuel à résoudre).
3. Mise en première position de Panorama Pub dans `/etudes-de-cas`.
4. Ajout d'un bandeau « Réalisation phare » sur la home.

Ces quatre actions, isolément, ramènent le site dans un état présentable et aligné avant que la refonte structurelle complète soit livrée.

---

## Annexe — Glossaire des reformulations pour décideurs

| Terme technique | Reformulation grand public |
|---|---|
| API REST / GraphQL | Communication automatisée entre le back-office et le site visible |
| Core Web Vitals / Lighthouse | Score de performance Google |
| Architecture monolithique | Site WordPress classique |
| Stack / pile technique | Approche, solution |
| Front / Back | Partie visible / Back-office |
| Architecture découplée | Site séparé en deux : gestion du contenu et affichage |
| Headless | (à expliquer la première fois puis utilisable) Modèle où le contenu est géré d'un côté et affiché par une autre technologie de l'autre |
| PWA | Application installable sur smartphone sans passer par les stores |
| Serverless | Hébergement automatique sans serveur à gérer |
| TypeScript / Tailwind | (à ne pas nommer en page commerciale) |

---

*Document de cadrage — version 1.2 — à mettre à jour à chaque arbitrage tranché.*

*Changelog v1.1 : trois arbitrages résolus — stack Hermitage confirmée (PWA sans backend), noms d'outils techniques (Payload, Neon, etc.) jamais exposés en pages commerciales, l'argument différenciant de la jambe Apps devient la possibilité d'administration autonome, deux livres blancs parallèles confirmés.*

*Changelog v1.2 : deux arbitrages structurels résolus — cible élargie universelle (la fibre solidaire reste lisible mais ne pilote plus l'argumentaire principal, l'OETH devient transverse aux deux jambes), persona switch maintenu sur 3 personas avec framework éditorial dédié (§5.11). Ajout de la spécification page `/avantage-oeth` (§5.12) — hero élargi, simulateur enrichi d'une 4ᵉ option Apps, bloc « Performance technique » réécrit sans Astro. Détection d'une incohérence transverse de nomenclature des forfaits (Solidaire/Équilibre/Soutien vs Présence Essentielle/Croissance Accélérée/Plateforme Sur-Mesure) ajoutée aux bugs avec action d'harmonisation en V1. Plan d'exécution enrichi de 5 actions (refonte /avantage-oeth, maillage OETH transverse, audit technique du persona switch, harmonisation des nomenclatures, déclinaison persona des pages refondues). Séquencement révisé en conséquence.*
