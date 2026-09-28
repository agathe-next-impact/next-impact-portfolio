# Charte éditoriale · Vitrine next-impact.digital · Refonte éditoriale

> Version 1.8 · 28 septembre 2026. Document de travail pour la refonte éditoriale de la vitrine. Il remplace, pour le site, la charte « Offre et site » générique et s'appuie sur l'état du site en production relevé le 27 août 2026 (version anglaise crawlée) et sur le catalogue d'offres déjà en place sur le site en développement : Visio conseil refonte 150 €, Audit + roadmap 650 €, Refonte WordPress optimisée, Refonte headless, Web app. La charte newsletter « Quelle techno pour mon site ? » reste le canon du registre informatif (page Veille, blog).
>
> **Amendement du 7 septembre 2026 (v1.2).** Le catalogue passe de cinq à **six lignes** : l'offre récurrente de direction technique, supprimée le 27 août, est réinstaurée sous le nom « CTO externalisé », sur sa propre page `/cto-externalise`. Trois passages de la v1.1 sont amendés en conséquence : le tableau du §1 et la phrase « ces cinq lignes », l'ordre des offres du §5, et la clause de fermeture de la page Conseil au §6. Décision tracée en ADR-007 (`docs/decisions.md`).
>
> **Amendement du 10 septembre 2026 (v1.3).** La sixième ligne se renomme « Expert technique externalisé » : décision explicite d'Agathe qui inverse le garde-fou du §1/§10 protégeant jusqu'ici « CTO » comme seul terme non traduit toléré en accroche. Le nouveau libellé est désormais le seul toléré, en français comme en anglais (« Outsourced technical expert »), partout où l'offre est nommée. L'URL `/cto-externalise` et les identifiants techniques ne changent pas. Décision tracée en ADR-010 (`docs/decisions.md`).
>
> **Amendement du 27 septembre 2026 (v1.4).** Le catalogue passe de six à **dix lignes**, rangées en **trois moments** que le visiteur reconnaît sans lire le catalogue : **Décider** (visio, audit + roadmap, veille gratuite), **Refaire** (les trois trajectoires, refonte ou création), **Tenir** (Sentinelle, Suivi et maintenance en deux paliers avec un état des lieux de démarrage, Expert technique externalisé). Sentinelle revient dans l'index ; l'espace en ligne devient une preuve visible. La navigation devient Décider · Refaire · Tenir · Études de cas · À propos ; le CTA froid unique devient l'analyse du site (`/scan`), libellé « Analysez votre site en 2 minutes » ; `/tarifs` redevient une page. Amendés : §1, §5, §6, §7, §10. Décision tracée en ADR-012 (`docs/decisions.md`). Les prix de l'offre Suivi et maintenance sont des propositions à valider (`MAINTENANCE_PRIX_VALIDES` dans `lib/maintenance-offer.ts`).
>
> **Amendement du 27 septembre 2026 (v1.5).** L'offre se simplifie. Le catalogue passe de dix à **sept lignes** et les trois moments se renomment **Diagnostiquer · Évoluer · Gérer** (anciennement Décider · Refaire · Tenir). On compte les offres, pas les paliers : le suivi et maintenance est une seule ligne à deux paliers, la mise sous suivi devient une condition de cette ligne. Sentinelle sort du catalogue : elle se vend depuis le rapport de l'analyse du site et reste incluse dans le suivi et maintenance, où elle se dit en pastille. L'Expert technique externalisé ne vit plus que dans « Gérer » : `/conseil` revient à deux offres et un renvoi, ce qui revient sur l'ADR-009. Chaque trajectoire porte un seul nom, Consolider, Découpler ou Refonder, la technique en sous-titre. La home ne montre en cartes que les trois trajectoires ; « Diagnostiquer » et « Gérer » y tiennent en une phrase chacune. Les URL et les identifiants techniques ne changent pas. Amendés : §1, §5, §6, §7, §10, §11. Décision tracée en ADR-013 (`docs/decisions.md`).
>
> **Amendement du 27 septembre 2026 (v1.6).** L'offre se lit **par situation**, plus par type d'offre : le visiteur part de son **besoin**, reconnaît sa **situation**, arrive au **pack** qui y répond. Trois besoins, dits à la première personne (« Je veux pouvoir décider », « Je veux faire évoluer mon site web », « Je veux agir dans la durée »), six situations, un pack par situation, avec son budget calculé. Décision explicite d'Agathe, qui inverse le garde-fou du §10 sur les packs ; le mot « pack » s'affiche. Les trois prestations se renomment **Optimisation** (ex-Consolider), **Refonte** (ex-Découpler, recommandée) et **Évolution** (ex-Refonder). La **veille technique et stratégique** devient la caractéristique différenciante de toutes les offres : première analyse dans l'audit et les prestations, en continu dans le suivi et maintenance et la direction technique. Les prix du suivi et maintenance sont validés, avec une grille par type de site qui remplace la règle « Actif obligatoire en headless ». Le catalogue reste de sept lignes. Six pages nouvelles sous `/packs`. Amendés : §1, §5, §6, §7, §10, §11. Décision tracée en ADR-014 (`docs/decisions.md`).
>
> **Précision du 27 septembre 2026 (v1.6, ADR-015).** Sur les cartes des trois prestations, le nom de l'offre devient le titre, très visible, suivi immédiatement de ce que c'est techniquement : le nom technique, puis une phrase en clair. La situation vient juste après. Demande explicite d'Agathe, qui amende pour ces seules cartes la règle « le titre d'une carte est une situation ». Les autres cartes, les cases du menu, les lignes de `/packs` et les pages de pack gardent la situation en titre. Précisés : §1, §6, §11.
>
> **Précision du 27 septembre 2026 (v1.6, ADR-016).** Chaque pack se désigne par **un seul terme**, jamais par sa phrase de situation : **Arbitrage, Optimisation, Refonte, Évolution, Maintenance, Pilotage**. Ce terme titre les cartes, les cases du menu, les lignes de `/packs` et de `/tarifs`, le surtitre et le fil d'Ariane des pages de pack, les schémas et llms. La situation devient une ligne « pour qui », sous le nom. Demande explicite d'Agathe, qui remplace la règle « il se désigne par sa situation » et étend à tous les packs la forme des cartes de prestation (ADR-015). Précisés : §1, §6, §11.
>
> **Amendement du 27 septembre 2026 (v1.7).** Le héros de la home ne se centre plus sur la douleur mais sur **trois idées** : l'**expertise de projet web**, la **veille constante** et la **direction externalisée**. Titre retenu par Agathe : « Pilotage de *projet web* », sous-titre : « Surveiller, maintenir, réaliser. » ; la description, dessous, porte le mesurable. La douleur quitte le héros de la home ; elle reste l'entrée des pages d'offre et des pages de pack, qui reçoivent la prospection. Les idées de veille et de direction peuvent titrer la home ; les offres récurrentes, elles, n'y sont toujours ni nommées ni chiffrées. Demande explicite d'Agathe, qui amende le point 5 de l'ADR-018 (héros sur la variante 1). Amendés : §1, §5, §6, §9, §10, §11. Décision tracée en ADR-019 (`docs/decisions.md`).
>
> **Amendement du 27 septembre 2026 (v1.7, ADR-023).** La **visio conseil refonte payante** (150 € HT, une heure, avis écrit sous 48 h, déduite du devis) **est supprimée**. Elle est remplacée par un **Échange de 15 minutes, gratuit**, sans engagement, réservé en ligne (Calendly). Le bouton chaud « Discutons de votre projet » réserve cet échange partout sur le site. Conséquences : l'avantage « visio déduite du devis » disparaît des packs ; le pack Arbitrage devient gratuit, l'audit + roadmap y reste en option ; les budgets des packs Optimisation et Refonte ne changent pas. Source unique : `ECHANGE_URL`, `ECHANGE_NAME` et `CTA_CHAUD` dans `lib/visio-conseil.ts`. Amendés : §1, §5, §6, §7. Décision tracée en ADR-023 (`docs/decisions.md`).
>
> **Précision du 27 septembre 2026 (v1.7, ADR-024).** Le cartouche de résumé citable (TL;DR, ex-« En bref ») se titre **« L'essentiel »** (EN « Key points ») et se place **juste avant la FAQ**, plus sous le héros. Il reste visible, jamais replié ni masqué, et garde sa classe cible du balisage Speakable. Le haut de page porte la preuve ; la phrase citable du haut de page, c'est le chapô du héros.

> **Amendement du 28 septembre 2026 (v1.8, ADR-031).** La **Refonte** se livre en deux variantes **à égalité**, choisies selon la situation : **WordPress sur mesure** (thème écrit pour le site, à partir de 2 250 € HT) ou **WordPress headless** (à partir de 4 000 € HT). Elle s'affiche « à partir de 2 250 € HT », nom technique « WordPress sur mesure ou headless », et garde le badge « recommandée ». L'**Optimisation** devient la remise à niveau du site existant, sans reconstruction ni nouveau thème, à partir de 1 500 € HT. Le headless n'est plus l'option par défaut de la refonte. L'analyse du site (`/scan`) tranche entre les deux variantes. Amendés : §1, §5.

---

## 1. Ce que dit le site aujourd'hui, et ce qu'il doit dire demain

### Constat (état du 27 août 2026)

Site en production : positionnement « Web & AI Tech Compass », titre de la home « AI can code fast. A website that lasts is another matter. », entrée par l'IA, sélecteur techno à six options, anciennes offres de conseil IA (build pack, direction technique fractionnée), FAQ qui affirme que « le Headless n'est plus la réponse par défaut ».

Site en développement : le catalogue est déjà celui de la refonte (Visio conseil refonte 150 €, Audit + roadmap 650 €, trois prestations de développement). Les offres IA n'existent plus. La refonte éditoriale doit donc aligner tout le discours (héros, navigation, FAQ, métadonnées, footer, formulaire de contact) sur ce catalogue : aucune trace des anciennes offres ne doit subsister, ni dans les textes, ni dans les libellés de formulaire, ni dans les mots-clés.

Ce qui fonctionne et doit être conservé :
- Les preuves sont là et elles sont bonnes : 22 projets documentés, Le Figaro mai 2026, PageSpeed 45 → 98 (Proditec), Core Web Vitals mesurés en direct, témoignages nommés (nom, fonction, entreprise), étude de cas Réseauteurs avec chiffres (3 mois, Stripe, Next.js + Payload).
- La promesse de cadre : 6 à 10 semaines, prix et délai fixés avant, réponse sous 48 h, interlocutrice unique.
- La présence humaine : photo, prénom, parcours, « je ».
- Les trois blocs Veille / Décider / Construire, lisibles.

Ce qui freine un prospect froid :
- L'entrée par l'IA parle à des curieux, pas à un DIRCOM dont le site WordPress rame. La douleur n'est nommée nulle part au-dessus de la ligne de flottaison.
- Six options de techno en accroche : le prospect n'a pas de question techno, il a un site qui vieillit.
- Le Headless, expertise signature et sujet de l'article du Figaro, est rétrogradé en FAQ.
- Les anciennes offres de conseil IA sont encore présentes en production (home, page Conseil, sujets du formulaire, footer, mots-clés) : à purger intégralement au basculement.
- Les preuves arrivent après le discours sur l'IA au lieu de le précéder.
- Le tiret cadratin est partout (dates, citations, titres). Une seule règle typographique sur tous les canaux.
- Incohérence de chiffre : « 6 ans de développement » sur la home, « 8 ans » ailleurs dans les documents internes. Une seule valeur, partout.
- Le CTA final renvoie vers un agenda (chaud) ; le diagnostic 2 minutes (froid) est dans le footer.

### Cible de la refonte

Le site dit, dans l'ordre : votre site WordPress vieillit mal ; il peut redevenir rapide sans tout reconstruire ; voici la preuve ; voici les trois trajectoires et leurs prix ; voici qui le fait et comment ; voici le levier fiscal ; voici par où commencer.

L'angle « IA » ne disparaît pas. Il devient un argument de méthode (« je cadre, l'IA exécute ») et un sujet de veille. Il quitte l'accroche.

Catalogue de référence (site en dev), le seul que le site mentionne :

| Moment | Offre | Prix |
|---|---|---|
| Diagnostiquer | Échange de 15 minutes : poser la situation, savoir par où commencer (v1.7, ADR-023) | Gratuit |
| Diagnostiquer | Audit + roadmap : rapport d'audit, préconisations, roadmap | 650 € HT |
| Évoluer | Optimisation · WordPress optimisé : le site existant remis à niveau (vitesse, extensions, sécurité, hébergement), sans reconstruction | à partir de 1 500 € HT |
| Évoluer | Refonte · WordPress sur mesure ou headless, à égalité selon la situation (recommandée) | à partir de 2 250 € HT (sur mesure), 4 000 € HT (headless) |
| Évoluer | Évolution · web app : plateforme web et/ou mobile, administration sur mesure, sans WordPress | à partir de 6 500 € HT |
| Gérer | Suivi et maintenance : surveillance, sauvegardes, mises à jour vérifiées, rapport mensuel, veille en continu avec Sentinelle incluse. Deux paliers, Essentiel et Actif, et une grille par type de site (ci-dessous) | à partir de 89 € HT par mois |
| Gérer | Expert technique externalisé : direction technique à temps partagé, deux paliers (Référent, Direction technique) | à partir de 900 € HT par mois |

Grille du suivi et maintenance, validée par Agathe le 27 septembre 2026 (v1.6), par mois et hors taxes :

| Type de site | Essentiel | Actif |
|---|---|---|
| Site WordPress | 89 € | 249 € |
| Site WordPress headless | 129 € | 299 € |
| Web app ou plateforme | 129 € | 299 € |

Les deux paliers existent pour chaque type de site : la grille remplace l'ancienne règle « Actif obligatoire en headless ». Un site headless ou une web app compte deux environnements à tenir, d'où le prix.

On compte les offres, pas les paliers (v1.5). Les paliers Essentiel et Actif sont deux paliers d'une même ligne, comme Référent et Direction technique. La mise sous suivi (état des lieux de démarrage, 290 € HT une fois, offerte pour un site livré par Next Impact) est une condition du suivi et maintenance, pas une offre.

Hors catalogue, mais légitimes : Sentinelle (19 € par mois, sans engagement, source `lib/sentinelle-offer.ts`), vendue depuis le rapport de l'analyse du site et présentée sur `/sentinelle` ; la veille gratuite (`/veille`) ; l'analyse du site (`/scan`).

Toute page, tout formulaire, toute métadonnée qui cite une offre cite l'une de ces sept lignes, avec ce libellé et ce prix. Source unique de chaque prix : `lib/visio-conseil.ts`, `lib/trajectoires.ts` (nom et montant des trois prestations ; `components/services/PricingCards.tsx` en garde le détail rédactionnel), `lib/cto-externalise.ts`, `lib/sentinelle-offer.ts`, `lib/maintenance-offer.ts`. Source unique des besoins, des situations, des packs et de leurs budgets : `lib/situations.ts`.

Les cinq premières lignes se vendent au forfait, une fois. Les deux autres sont des abonnements : ils ne remplacent aucune des cinq, ils répondent à la question « qui tient le site une fois en ligne ? ». Ils ne sont jamais nommés ni chiffrés en accroche de la home ni dans un héros : ce sont des offres de fin de parcours, pour un lecteur qui a déjà compris ce qu'il achète. Les idées qu'ils portent, la veille constante et la direction externalisée, titrent en revanche le héros de la home (v1.7, §6).

**Les trois moments (v1.5).** Le visiteur ne voit jamais les sept lignes d'un coup, sauf sur `/tarifs`. Partout ailleurs, il se situe dans un moment et y voit trois choix au plus, dont un seul mis en avant :

| Moment | Besoin du visiteur | Offres | Page d'atterrissage |
|---|---|---|---|
| Diagnostiquer | « Je veux pouvoir décider » | Échange de 15 minutes · Audit + roadmap · veille gratuite | `/conseil` |
| Évoluer | « Je veux faire évoluer mon site web » | Optimisation · Refonte (recommandée) · Évolution | `/solutions-web` |
| Gérer | « Je veux agir dans la durée » | Suivi et maintenance · Expert technique externalisé | `/maintenance-wordpress` |

Les moments portent un seul nom chacun : Diagnostiquer, Évoluer, Gérer (en anglais : Diagnose, Evolve, Manage). Le menu principal a ses propres libellés depuis l'ADR-022 : Audit, Prestations, Pilotage, Veille, Études de cas. Le besoin est la phrase du visiteur : il titre le panneau du menu, la colonne de la home et le groupe de `/packs`. Les anciens noms Décider, Refaire et Tenir ne s'affichent plus comme noms de moment ; ils subsistent dans les identifiants techniques (`decider`, `refaire`, `tenir`, `TenirBanner`), qui ne changent pas.

**L'offre par situation (v1.6).** Le besoin mène au pack par la situation précise. Une situation est la phrase que le visiteur se dit ; un pack est le parcours qui y répond : avant, pendant, après, avec un budget.

| Besoin | Pack (nom) | Pour qui (situation) | Parcours | Page |
|---|---|---|---|---|
| Je veux pouvoir décider | Arbitrage | « J'ai un devis à juger, ou une décision à prendre » | Analyse du site, Échange de 15 minutes, puis Audit + roadmap si la décision engage un budget | `/packs/devis-a-juger` |
| Je veux pouvoir décider | Audit + roadmap | « Je prépare une décision qui engage un budget » | Analyse du site, Audit + roadmap, puis Expert technique externalisé si les décisions reviennent tous les mois | `/packs/etat-des-lieux` |
| Je veux faire évoluer mon site web | Optimisation | « Mon site est devenu ingérable : thème, extensions, mises à jour qui cassent » | Échange de 15 minutes, Optimisation, suivi | `/packs/site-wordpress-ingerable` |
| Je veux faire évoluer mon site web | Refonte (recommandé) | « Mon site est lent, et mon équipe publie dans WordPress » | Échange de 15 minutes, Refonte, suivi | `/packs/site-wordpress-lent` |
| Je veux faire évoluer mon site web | Évolution | « Mon site est devenu un outil de travail » | Audit + roadmap, Évolution, suivi | `/packs/site-outil-de-travail` |
| Je veux agir dans la durée | Maintenance | « Mon site tourne, je veux qu'il le reste » | Analyse du site, mise sous suivi, Suivi et maintenance | `/packs/site-a-tenir` |
| Je veux agir dans la durée | Pilotage | « Des décisions techniques reviennent tous les mois, personne pour les trancher » | Audit + roadmap, Expert technique externalisé | `/packs/decisions-techniques` |

Règles d'un pack :

- Il assemble, il ne crée rien : ni ligne de catalogue, ni prix, ni remise. Ses avantages sont ceux qui existent déjà (échange de 15 minutes gratuit, trois mois de suivi inclus, mise sous suivi offerte pour un site livré, deux mois offerts au paiement annuel).
- Il se désigne par un seul terme (ADR-016), lu dans `nom` de `lib/situations.ts` : « Refonte », jamais par sa phrase de situation. Le mot « pack » ne s'affiche plus (ADR-022) : le concept se dit « parcours » ; seules les adresses `/packs/...` le gardent. Pour les trois prestations, le terme est le nom de l'offre.
- Mise en avant (ADR-022) : l'offre gratuite et l'offre recommandée prennent la grande carte, bordée d'accent, avec une pastille ; les autres cartes sont plus compactes. Dans le menu Évoluer, le prix est celui de la prestation affiché sur `/solutions-web` et le sous-titre la solution technique. La section Diagnostiquer ne présente plus la veille.
- Son budget est calculé dans `lib/situations.ts`, jamais écrit en dur : la première année pour une prestation ou pour le suivi, les six premiers mois pour l'expert technique externalisé. C'est un plancher, dit hors taxes.
- Le titre d'une carte, d'une case du menu ou d'une ligne de pack est le nom du pack. La situation vient dessous, en ligne « pour qui », jamais en titre ni en libellé de lien.
- Cartes des trois prestations (ADR-015) : le nom, très visible, puis ce que c'est techniquement, par le nom technique puis par une phrase en clair. Autres cartes : le nom, puis l'offre au centre du pack. Dans les deux cas, la situation, puis le résultat, le prix et l'action.
- Le h1 d'une page de pack reste la douleur (§5) ; le nom du pack en est le surtitre.
- La création d'un site n'est pas une situation à part : mêmes packs, point de départ différent.

**La veille technique et stratégique (v1.6).** C'est ce qui distingue chaque offre, et cela se dit partout où une offre se présente. Technique : ce qui menace ce que le client fait déjà tourner (fins de support, failles, obligations). Stratégique : ce que le contexte rend possible et que le site ne fait pas encore. Elle a deux formes :

| Forme | Où | Ce que le client reçoit |
|---|---|---|
| Analyse technique et stratégique (première analyse) | Audit + roadmap, et chacune des trois prestations | L'état du terrain autour de son site, daté et sourcé, avant de décider et de construire |
| Veille écosystème et technos (en continu) | Suivi et maintenance, Expert technique externalisé | Le suivi des composants installés, une alerte quand l'un devient un risque, ce que ça change pour la suite |

Sentinelle est l'outil de la veille en continu du suivi et maintenance : elle s'y dit en pastille, elle ne redevient pas une offre. La veille se définit en un seul endroit, `VEILLE` dans `lib/situations.ts`.

Chaque offre se présente sur une carte au même gabarit : pour vous si (la situation), vous obtenez (le résultat), un prix « à partir de », une action. Les paliers ne s'affichent que sur la page de l'offre et sur `/tarifs`. Ce qui est inclus (Sentinelle dans la maintenance, trois mois de suivi dans chaque forfait, l'espace en ligne) se dit en pastille, jamais comme une offre. La création d'un site n'est pas une ligne à part : mêmes forfaits, point de départ différent.

**Un seul nom par prestation (v1.6).** Optimisation, Refonte, Évolution, à la place de Consolider, Découpler, Refonder (v1.5). Le nom technique (WordPress optimisé, WordPress headless, web app) vient en sous-titre, jamais à la place du nom. Sur une carte de prestation, ce sous-titre s'écrit en caractères lisibles, pas en petites capitales, et il est suivi d'une phrase qui dit en clair ce que c'est (ADR-015). Le nom technique et la phrase se lisent dans `lib/trajectoires.ts` (`technique`, `enClair`). Le mot « refonte » reste un mot courant du site (« refonte de site WordPress ») ; avec une majuscule, il désigne la prestation Refonte, en WordPress sur mesure ou en headless (v1.8). Les libellés « Vitrine simple », « Site complexe », « Plateforme et app » et le bouton « Choisir cette stack » sont retirés : ils classaient par type de site et détournaient la cible de la trajectoire recommandée.

## 2. Objectif directeur et lecteur

Le site doit convertir un prospect froid : il arrive d'un cold mail, d'un post LinkedIn, d'un lien de pré-audit ou de l'article du Figaro. Il ne connaît pas Agathe. Il vérifie avant de faire confiance.

Chaque section se juge à une question : est-ce que ça rassure et fait avancer un inconnu sceptique ? Règle d'or : prouver avant de demander.

Lecteur principal : DIRCOM ou responsable marketing d'une structure de 20 à 250 salariés, parc WordPress vieillissant, pas de profil technique interne. Lecteur secondaire : DAF ou DRH, qui arbitre le budget et entend l'argument AGEFIPH en fin de parcours.

## 3. Voix et règles de style (rappel, applicables à toutes les pages)

- « Vous » pour le prospect, « je » pour Agathe. Jamais « nous », jamais « l'agence », jamais « notre équipe ». Une seule personne produit : c'est une garantie, pas une excuse.
- Phrases courtes, une idée par phrase. Ni peur, ni hype, ni storytelling. La métaphore « l'IA est le meilleur stagiaire » quitte la home ; elle peut vivre sur la page À propos si elle y est utile.
- Aucun terme technique en titre. Le terme apparaît dans le corps, suivi de sa traduction en conséquence (temps, argent, risque, ce que voient les visiteurs).
- Tiret cadratin interdit sur tout le site : titres, dates, citations, méta-descriptions, bannières. Le remplacent : deux-points, virgule, point, point médian « · ».
- Prix avec espace insécable : 2 250 € HT. « À partir de », jamais « sur devis » seul.
- Pas de « simple », « facile », « en deux clics », « il suffit de ».
- Accords vérifiés avant publication (refonte optimisée, site renouvelé, spécialisée).
- Une majuscule par titre. Pas d'emoji sur les pages d'offre.
- Version française rédigée d'abord ; la version anglaise est une traduction fidèle, jamais une réécriture.

## 4. Lexique du site

Mots-pivots à répéter : refonte, évolution, sans tout reconstruire, garder, préserver, découpler, forfait, délai annoncé, mesuré, vérifiable, dette technique, obsolescence, interlocutrice unique.

Verbes porteurs : préserver, assainir, découpler, moderniser, fiabiliser, sécuriser, accélérer, interconnecter, automatiser, livrer, mesurer.

Traductions obligatoires dès qu'un terme apparaît :

| Terme | Traduction à écrire à côté |
|---|---|
| Headless | Vos rédacteurs continuent de publier dans WordPress ; vos visiteurs voient un site rapide et moderne |
| Next.js, Astro, Payload | Site généré à l'avance, affiché en moins de deux secondes |
| Core Web Vitals | Les trois mesures de vitesse que Google utilise pour classer votre site |
| PageSpeed 45 → 98 | Score de vitesse Google, avant et après refonte |
| Plugins réduits | Moins de mises à jour, moins de failles, moins de pannes |
| Migration, redirections 301 | Aucune page perdue, aucun référencement perdu |
| PWA | Une application mobile sans passer par les stores |
| API, interconnexion | Vos outils (CRM, ERP, paiement) parlent au site |
| Dette technique | Ce qui coûte un peu chaque mois et beaucoup le jour où ça casse |

Mots bannis : agence, nous, nos experts, innovant, ultra, révolutionnaire, solution digitale, synergie, clé en main, « compass », « sélecteur » (jargon interne, opaque pour le prospect).

## 5. Architecture argumentaire du site

Ordre de conviction, respecté en version courte par chaque page d'offre et chaque page de pack. La home fait exception au premier point (v1.7) : elle s'ouvre sur le positionnement, les trois idées (§6), et la douleur n'y apparaît plus dans le héros :

1. Douleur : votre site WordPress vieillit mal.
2. Promesse : rapide et moderne, sans tout reconstruire, 6 à 10 semaines.
3. Preuve : chiffre vérifiable, avant / après, étude de cas chiffrée, Le Figaro.
4. Offre : le pack de la situation, avec son budget ; trois prestations, prix affichés, Refonte (headless) recommandée ; la veille technique et stratégique qui distingue l'offre.
5. Réassurance : forfait, délai, interlocutrice unique, parcours.
6. Accélérateur : AGEFIPH, après la valeur.
7. CTA froid (diagnostic 2 min) puis CTA chaud (rendez-vous).

Le recadrage signature du site : « La vraie question n'est pas WordPress ou pas WordPress, c'est ce que vous gardez et ce que vous changez. » Il remplace « The real choice is no longer only WordPress vs Headless. It is WordPress, no-code, AI coding… ».

Les trois prestations, la techno en sous-titre :

| Prestation | Quand | Technique | Prix |
|---|---|---|---|
| Optimisation | Le site tient encore : on le garde et on le remet à niveau, sans reconstruire | WordPress optimisé | à partir de 1 500 € HT |
| Refonte · recommandée | Le site est lent ou daté, l'équipe publie dans WordPress | WordPress sur mesure (à partir de 2 250 € HT) ou headless (à partir de 4 000 € HT), selon la situation | à partir de 2 250 € HT |
| Évolution | Le site est devenu un outil de travail | Web app, plateforme, PWA | à partir de 6 500 € HT |

En amont : l'Échange de 15 minutes (gratuit) et l'Audit + roadmap (650 € HT). L'échange et le diagnostic 2 minutes sont les portes d'entrée gratuites ; l'audit est la porte d'entrée payante (v1.7, ADR-023).

En aval, le moment « Gérer », du plus léger au plus engageant : Suivi et maintenance (à partir de 89 € HT par mois, entretenir ; Sentinelle incluse), Expert technique externalisé (deux paliers, à partir de 900 € HT par mois, engagement de 6 mois puis reconduction au mois, préavis de 2 mois ; piloter). Ces abonnements ne se proposent qu'après la valeur, au même rang que l'AGEFIPH dans l'ordre de conviction : jamais comme premier message, jamais en CTA froid. Chaque forfait de refonte inclut trois mois de suivi Essentiel (`SUIVI_INCLUS_MOIS`) : la reconduction se propose avec le bilan du troisième mois, jamais automatiquement.

Le cartouche « L'essentiel » (v1.7, ADR-024) : sur chaque page d'offre qui en a un, le résumé citable se place juste avant la FAQ, qu'il ouvre comme une synthèse. Visible, non replié, sans animation d'apparition ; ses lignes se lisent dans la même source que llms.txt. Il ne remonte pas sous le héros : le haut de page est à la preuve.

## 6. Charte page par page

### Home `/`

Ordre cible des sections :

1. Héros. Titre sur les trois idées (v1.7) + sous-titre en trois verbes + description qui porte le mesurable + deux CTA.
2. Preuve immédiate : bandeau de chiffres (PageSpeed 45 → 98, Core Web Vitals mesurés en direct sur ce site, 25 projets livrés, Le Figaro mai 2026).
3. L'offre par famille (v1.7, ADR-020) : trois onglets, un par famille, dans l'ordre Diagnostiquer, Évoluer, Gérer ; Évoluer est ouvert par défaut. Chaque onglet donne le besoin, puis ses packs en cartouches pleine largeur, réduits à l'essentiel : le nom du pack (ADR-016), ce que c'est techniquement pour une prestation ou l'offre au centre sinon (ADR-015), la situation en ligne « pour qui », le budget et un lien vers la page du pack. Le pack Refonte porte seul le badge « recommandé ». Sous les onglets, les deux boutons.
3 bis. La spécificité (v1.7, ADR-021) : surtitre « Analyse et veille continue », titre « La veille comme base de qualité » (27 septembre 2026, demande d'Agathe). Deux cartes, « Analyse technique et stratégique » et « Veille écosystème et technos », chacune suivie des packs qui la contiennent, en badges à bord carré vers la page du pack. Noms et textes lus dans `VEILLE`, liste calculée par `packsAvecVeille()` (`lib/situations.ts`).
4. Une étude de cas mise en avant avec résultat chiffré (Proditec 45 → 98 est plus parlant qu'une plateforme pour la cible WordPress ; Réseauteurs reste en second).
5. Témoignages nommés (conserver tels quels).
6. Qui le fait : photo, « 15 ans à publier dans WordPress avant d'en développer », « je cadre, l'IA exécute ».
7. AGEFIPH : un bloc court, orienté DAF.
8. FAQ : cinq questions maximum, réécrites (voir plus bas).
9. CTA final : diagnostic 2 minutes (principal), rendez-vous (secondaire).

Héros (v1.7). Le titre dit en trois ou quatre mots les trois idées du positionnement : l'expertise de projet web (concevoir, livrer), la veille constante (veiller), la direction externalisée (piloter, décider). Il ne nomme ni douleur, ni offre, ni prix, ni techno.

Retenu par Agathe (v1.7, ADR-019) :

- Titre : « Menons *votre projet web* » (amendé le 28 septembre 2026, demande d'Agathe). En anglais : « Let's lead *your web project* ».
- Sous-titre : « Surveiller, maintenir, réaliser. » En anglais : « Monitor, maintain, deliver. » Les trois verbes disent la veille constante, l'entretien et l'expertise de réalisation ; le titre dit la direction.
- Description : la phrase de promesse existante, qui porte le mesurable (prix et délai écrits avant de commencer, performance mesurée avant et après, veille à chaque étape).

Sources : `headline`, `subHeadline`, `tagline` et `description` de `HERO_VARIANTS.default` (`lib/homepage-profiles.ts`, `lib/homepage-profiles-en.ts`).

Variantes proposées et non retenues, gardées pour mémoire :

- Concevoir, *veiller*, piloter.
- Décider, livrer, *veiller*.
- Livrer, puis *veiller*. (la direction passe dans le sous-titre)
- Votre site, *piloté durablement*.
- Projet livré, *site veillé*.
- Votre direction web, *externalisée*.

Boutons : « Analysez votre site » (froid), « Échange gratuit » (chaud).

Les anciennes variantes centrées sur la douleur (« Votre site WordPress vieillit mal… », « De 45 à 98 sur PageSpeed… ») quittent le héros de la home ; elles restent utilisables en h1 des pages d'offre et de pack, et dans la prospection.

Conserver le motif de la marque : le bénéfice en italique dans le titre. Test pour chaque titre : un concurrent pourrait-il écrire le même ? Si oui, réécrire.

FAQ home, cinq questions cibles :
- Mon site WordPress est lent : refonte ou optimisation ?
- Qu'est-ce qu'une refonte headless, concrètement ?
- Mon équipe devra-t-elle réapprendre à publier ?
- Que se passe-t-il pour mon référencement ?
- Par où commencer : l'échange de 15 minutes ou l'audit à 650 € ?

Métadonnées cibles : `title` « Refonte de site WordPress : rapide, moderne, sans tout reconstruire · Next Impact » ; `meta description` « Votre site WordPress vieillit mal ? Refonte optimisée, headless ou web app, en forfait, en 6 à 10 semaines. Prix affichés, performance mesurée avant et après. »

### Conseil `/conseil`

Rôle : page d'atterrissage du moment « Diagnostiquer » et porte d'entrée payante à faible engagement. Elle présente les DEUX offres ponctuelles du catalogue, dans l'ordre d'engagement croissant (v1.5, ADR-013, qui revient sur l'ADR-009). Titre : « Audit pour *décider* » (choix d'Agathe du 27 septembre 2026, v1.7 ; en anglais « Audit in order *to decide* »). L'ancien titre cible, « Un avis tranché avant d'engager un budget », reste l'argument de la page.

- Échange de 15 minutes · gratuit (v1.7, ADR-023, remplace la visio conseil refonte à 150 € HT). Quinze minutes en visio pour poser la situation et savoir par où commencer : l'analyse du site, l'audit + roadmap ou directement un devis. Sans engagement, sans avis écrit : l'écrit, c'est l'audit.
- Audit + roadmap · 650 € HT. Rapport d'audit (performance, sécurité, dette, plugins, hébergement), préconisations chiffrées, roadmap par étapes. Argument : le document sert même si la prestation est confiée à quelqu'un d'autre. Le montant est déduit du devis si la refonte est confiée à Next Impact (à confirmer par Agathe ; si oui, l'écrire, c'est un levier).

Renvoi vers l'Expert technique externalisé (v1.5) : un bandeau en fin de page (`CtoExternaliseBanner`), sans section d'offre. Il garde l'ancre `#cto-externalise` pour les anciens liens. L'offre vit dans « Gérer » et se vend sur `/cto-externalise` : `/conseil` ne la présente plus comme l'une de ses offres et ne recopie ni prix ni condition, le bandeau lit `lib/cto-externalise.ts`.

Garde-fous (§5) : le CTA principal du héros réserve l'échange de 15 minutes ; le bandeau d'aperçu du héros ne montre que les deux offres ponctuelles. Sur `/solutions-web`, le bandeau « Après la livraison » (`TenirBanner`) présente les deux abonnements du moment « Gérer ». Rien d'autre ne figure sur la page : ni build pack, ni « sélecteur techno ».

### Expert technique externalisé `/cto-externalise`

Rôle : l'offre de direction technique du moment « Gérer », sur sa propre page. Elle ne vit ni sur `/conseil` (qui vend le ponctuel) ni sur `/solutions-web` (qui vend le forfait) : les deux y renvoient par un bandeau de pied de page. Titre cible : « Des décisions techniques à prendre, personne en interne pour les trancher ».

- Expert technique externalisé · deux paliers publiés. **Référent, 900 € HT par mois** : comité d'une heure par mois, arbitrages écrits sous 48 h, roadmap tenue à jour trimestriellement, veille dédiée d'une page par mois, 3 évolutions suggérées par trimestre, 1 revue d'opportunité par an, relecture des devis, espace client. **Direction technique, 1 900 € HT par mois** (le cas courant) : comité de deux heures, arbitrages sous 24 h, roadmap en continu, veille avec alerte à chaud, 3 évolutions par mois chiffrées, 2 revues d'opportunité par an, cadrage et suivi des prestataires, 4 h de réalisation incluses. Conditions communes : engagement de 6 mois puis reconduction au mois, préavis de 2 mois, clause de restitution documentée, 100 % à distance, 4 accompagnements simultanés au maximum.
- Le troisième palier de la synthèse d'offre (Renforcée, 3 500 € HT par mois) n'est PAS publié : il se cadre en conversation. Ne pas l'ajouter au site sans arbitrage.
- Le libellé officiel de l'offre est « Expert technique externalisé » (FR) / « Outsourced technical expert » (EN) : c'est le seul nom à utiliser, en titre comme dans le corps du texte — ne pas réintroduire « CTO » (arbitrage du 10 septembre 2026, ADR-010, qui remplace le raisonnement inverse de l'ADR-007 sur le mot tapé par le prospect). Le nom est traduit dès la ligne suivante : « une direction technique à temps partagé pour le numérique visible, quelques jours par mois, sans recruter ».
- La page NE met PAS en avant ce que l'offre ne comporte pas (arbitrage d'Agathe du 8 septembre 2026). Pas de section « ce que ce n'est pas », pas de liste de garde-fous en négatif : sur une offre de direction, elle place le lecteur devant un catalogue de refus avant qu'il ait fini de comprendre ce qu'il achète. Le périmètre se dit par ce qu'il COUVRE, le numérique visible : site et applications web, données et outils en ligne (CRM, e-mailing, formulaires, paiement, prise de rendez-vous), briques d'IA, hébergement, sécurité et conformité de ces systèmes, prestataires et contrats associés. Les limites subsistantes se traitent en FAQ, en réponse à une question posée.
- Argument d'indépendance à conserver : la réalisation est plafonnée au quota du palier, et toute recommandation qui débouche sur une prestation Next Impact est accompagnée d'une alternative externe chiffrée. Il justifie le prix et distingue l'offre d'une prestation de développement déguisée.
- Les livrables font la preuve, et se citent : cartographie du système, roadmap datée et budgétée, relevé de décisions techniques, revue de devis avec alternative chiffrée, budget technique à trois ans, plan de continuité et dossier de restitution, registre des évolutions, revue d'opportunité. Ce sont eux qui distinguent la direction technique d'un abonnement au conseil.
- Ordre des sections : douleur, pour qui (les symptômes), les deux paliers, les livrables et le périmètre, parcours de démarrage, « L'essentiel », FAQ, deux CTA de deux températures (v1.7, ADR-024). La page se termine sur le choix ponctuel / récurrent, avec un lien vers `/conseil`.
- Aucun accompagnement ne démarre sans l'audit + roadmap préalable (650 € HT) : il qualifie le besoin et devient la roadmap vivante du contrat.

Métadonnées cibles : `title` « Expert technique externalisé : votre direction technique sans embaucher » ; `meta description` « Direction technique à temps partagé, dès 900 € HT par mois : pilotage mensuel, devis relus, roadmap tenue à jour. Sans embaucher, engagement 6 mois. »

### Services `/solutions-web`

Rôle : page d'atterrissage du moment « Évoluer », la page des trois prestations, développée. Titre (h1) : « Réalisation de *projet web* » (en anglais « *Web project* delivery »), choix d'Agathe du 27 septembre 2026 (ADR-022) ; l'ancien titre cible, « Trois prestations pour un site WordPress qui vieillit », reste l'argument de la page. Chaque prestation porte son seul nom (Optimisation, Refonte, Évolution), la technique en sous-titre, et commence par une première analyse de veille technique et stratégique. Le bouton froid de la page et de chaque prestation est l'analyse du site (`/scan`) ; le test d'éligibilité reste un outil, plus un bouton d'appel à l'action. Une section par prestation, même gabarit : pour qui · ce qu'on garde · ce qu'on change · ce qui est livré · prix et délai · une preuve. Le simulateur de prix reste, sous les prestations. La comparaison détaillée présente les trois options côte à côte, avec Refonte en colonne centrale et le badge « recommandée ».

### WordPress headless `/wordpress-headless`

Rôle : page d'expertise signature et page d'atterrissage de l'article du Figaro. Titre cible : « Votre équipe publie dans WordPress. Vos visiteurs voient un site rapide et moderne. » Structure : le mécanisme en une phrase et un schéma ; le résultat chiffré (Core Web Vitals, temps de chargement) ; ce qui ne change pas pour les rédacteurs ; ce qui change pour la sécurité et la maintenance ; quand ce n'est pas la bonne réponse (honnêteté = réassurance) ; prix et délai ; CTA diagnostic.

### Études de cas `/etudes-de-cas`

Rôle : le déficit de preuve se comble ici. Gabarit obligatoire pour chaque étude : contexte (secteur, taille, situation de départ) · problème (chiffré si possible) · solution (trajectoire choisie, ce qui a été gardé) · résultat mesuré (vitesse, délai, conversion) · une citation nommée. Priorité de rédaction : les projets de refonte WordPress et headless, pour coller à la cible, avant les plateformes. Objectif : passer de 2 études détaillées à 6 dans les trois mois.

### À propos `/a-propos`

Rôle : la présence humaine et la double culture. Ordre : la phrase « j'ai été à votre place » (15 ans côté éditorial) ; le passage au développement (une seule valeur d'années, partout) ; la méthode « je cadre, l'IA exécute » ; le studio solo comme garantie (une interlocutrice, une responsabilité) ; le statut TIH, dit sobrement, sans en faire un argument commercial sur cette page. La métaphore du stagiaire peut vivre ici, en une phrase.

### AGEFIPH `/avantage-oeth`

Rôle : le second message, orienté DAF / DRH. Titre cible : « 30 % du coût de main-d'œuvre déductibles de votre contribution AGEFIPH ». Contenu : qui est concerné (20 salariés et plus, assujettis OETH), le mécanisme en trois lignes, la base légale (art. D.5212-7 et L.5212-10-1 du Code du travail), un exemple chiffré sur un projet à 4 000 €, la phrase « un argument pour votre DAF, une fois le projet validé ». Aucun lien vers cette page depuis le héros de la home.

### Diagnostic : l'analyse du site `/scan`

Rôle : le CTA froid unique (v1.4). `/audit-site-web` et `/audit-site-ia` redirigent vers `/scan` (redirection temporaire). Libellé fixe : « Analysez votre site » (28 septembre 2026, « en 2 minutes » retiré du bouton) (version courte : « Analyser mon site »). L'ancien libellé « Voyez ce qui ralentit votre site » est abandonné : l'analyse liste les composants du site et ceux qui sont à risque, elle ne mesure pas la vitesse. Promesse : une adresse, un rapport, aucun accès demandé. Le rapport est aussi le point de vente de Sentinelle (v1.5). À venir (code Sentinelle, hors vitrine) : le rapport oriente vers un seul moment selon le verdict (bon état vers Gérer, fragile vers la visio, à refaire vers les trajectoires).

### Suivi et maintenance `/maintenance-wordpress` (v1.6)

Rôle : page d'offre de la maintenance ET page d'atterrissage du moment « Gérer ». Titre (h1, demande d'Agathe du 27 septembre 2026) : « Maintenir et évoluer *dans la durée* » ; la douleur « Une mise à jour ratée ne devrait pas se découvrir par un client » ouvre la description du héros. Ordre : douleur ; les deux services (Maintenir : suivi et maintenance ; Évoluer : expert technique externalisé) ; le monitoring et la veille, couplés, socle des deux services (les cinq mesures que l'espace en ligne affiche déjà : disponibilité, sauvegardes, mises à jour, failles, vitesse ; ne rien promettre que l'espace ne sache montrer) ; FAQ ; deux CTA. Les paliers ne sont plus sur cette page : ceux du suivi et maintenance (grille par type de site, condition de démarrage) vivent sur `/packs/site-a-tenir`, ceux de l'expert technique externalisé sur `/packs/decisions-techniques` (`components/packs/gerer-paliers.tsx`, ancre `#paliers`) ; les cartes des deux services y mènent. Positionnement : les autres font les mises à jour, je dis ce qu'elles changent et quand réparer ne suffit plus. Ne jamais la présenter comme une intervention ponctuelle (l'offre Dépannage WordPress reste supprimée). Prix validés le 27 septembre 2026 : la page est indexable, au sitemap et dans llms. Si `MAINTENANCE_PRIX_VALIDES` repasse à false : noindex, hors sitemap, hors llms, et les pages de pack avec elle.

### Packs `/packs` et `/packs/<situation>` (v1.6)

Rôle : les pages d'atterrissage de la prospection. Un message par situation, une page par message. `/packs` range les sept situations par besoin. Chaque page de pack suit l'ordre de conviction du §5 : le héros (un h1 qui nomme le bénéfice, la promesse en description) ; la preuve, lue dans l'étude de cas qui correspond ; le pack en trois étapes, avant, pendant, après, chaque étape étant une offre du catalogue à son prix public ; la veille technique et stratégique ; le budget calculé et ce qui est inclus ; FAQ ; les autres situations, par besoin ; deux CTA. Aucun prix ni chiffre de preuve n'est écrit dans la page : tout vient de `lib/situations.ts` et de `lib/case-studies-data.ts`. Une page de pack ne recopie pas la page de l'offre : elle y renvoie pour les paliers et le détail. Contenu en français ; la locale anglaise est en noindex.

Pages des trois prestations, Optimisation, Refonte, Évolution (27 septembre 2026, demande d'Agathe) : elles n'affichent pas le budget de la première année mais le **prix du forfait** (« à partir de … HT »), dans le héros comme dans le titre de section. Après le héros, **une seule section**, « La solution » : le nom de la prestation en surtitre, la solution technique en titre (ex. « WordPress headless »), le prix du forfait à part, hors du titre ; puis un accordéon : 01 la solution technique (ce que je fais, la stack traduite, ce qui est inclus, dont la veille), ouvert par défaut ; 02 les situations types pour ce besoin ; 03 le processus, nommé avant, pendant, après ; 04 la preuve. Puis les deux CTA. Pas de budget détaillé ni de FAQ sur ces pages : le budget de la première année reste sur `/tarifs`. Textes dans `page.solution` (`lib/situations.ts`).

### Sentinelle `/sentinelle` (v1.5)

Hors catalogue depuis la v1.5, toujours dans l'index. Elle se vend depuis le rapport de l'analyse du site (`/scan`) et reste incluse dans le suivi et maintenance, où elle se dit en pastille. Sa page reste sa fiche produit : elle prévient, elle n'intervient pas, et renvoie vers le suivi et maintenance pour qui veut qu'on intervienne. Elle n'apparaît ni dans le menu ni en carte d'offre ; le footer garde son lien et `/tarifs` donne son prix en note. `/veille` reste la page de la veille gratuite, sans prix.

### Espace client `/espace-client` (v1.4)

Rôle double : preuve pour le prospect (ce qu'il verra chaque mois), accès pour le client (lien « Espace client » du header et du footer, aiguillage vers `/espace-direction` et vers l'espace abonné Sentinelle). Nom dans le texte : « espace en ligne ». Aucune capture de vrai client : un schéma présenté comme tel. Arguments : rangé par question (Missions, Votre site, Agir, Veille), ce que chaque offre y ouvre, connexion sans mot de passe, tout se télécharge.

### Tarifs `/tarifs` (v1.6)

La seule page qui montre à la fois les packs et le catalogue : d'abord les sept packs, par besoin, avec leur budget ; ensuite les sept lignes et leurs paliers, par moment, dont chaque budget est la somme. Depuis l'ADR-022, le moment Diagnostiquer n'y a plus de section : l'échange gratuit et l'audit + roadmap se lisent avec leur prix dans la section des parcours. La grille du suivi et maintenance s'y lit par type de site. La condition de démarrage du suivi se lit dans le détail de la ligne. Sentinelle y figure en note sous « Gérer », avec son prix, pas en ligne. Elle sert le prospect qui vérifie ; elle est reliée depuis la home et le footer.

### Contact `/contact`

Rôle : le CTA chaud. Le formulaire de production propose six sujets alignés sur les anciennes offres ; il passe à cinq, alignés sur le catalogue : Une décision à trancher (avec renvoi vers l'échange de 15 minutes) · Audit + roadmap (650 €) · Projet de refonte (WordPress, headless ou web app) · Diagnostic gratuit de mon site · Autre. Les libellés parlent situation ou offre, jamais techno seule. Conserver : réponse sous 24 h, coordonnées directes, un témoignage nommé.

### Veille `/veille` et blog

Registre de la charte newsletter, inchangé : impersonnel, informatif, sans offre ni prix. C'est le seul endroit du site où le « vous » est absent. Un seul pont vers le commercial : un encadré discret en fin de page, « Votre site est concerné ? Diagnostic en 2 minutes ».

### Apporteurs `/apporteurs` et agences `/agences`

Hors cible prospect froid. Même voix, argument unique : forfait, délai, une interlocutrice, marge ou commission claire. Pas de refonte prioritaire.

## 7. CTA et navigation

- Navigation principale (v1.6) : Diagnostiquer · Évoluer · Gérer · Études de cas · À propos, puis un lien « Espace client » et le bouton « Contact », qui mène à `/contact` (amendé le 28 septembre 2026, demande d'Agathe) : la page présente chaque mode de contact dans un onglet (message, visio, téléphone, e-mail, newsletter) et le rail de contact n'y apparaît pas. Chaque moment ouvre un mega menu de trois cases au plus (`lib/mega-menu.ts`). Le panneau porte le besoin en titre ; ses cases sont des situations, chacune mène à la page de son pack, avec le nom de l'offre en description et le budget en badge. « Diagnostiquer » ajoute la veille gratuite. L'analyse du site (`/scan`) reste dans le tiroir mobile, les héros et les fins de page.
- Chaque page d'offre se termine par deux CTA : froid (analyse du site) en principal, chaud (rendez-vous) en secondaire. Jamais un seul CTA d'une seule température.
- Libellés fixes : « Analysez votre site » (froid), « Échange gratuit » (EN « Free call », chaud), « Voir l'étude de cas » (preuve). Depuis le 28 septembre 2026 (demande d'Agathe), tout CTA vers le Calendly de l'échange gratuit porte « Échange gratuit » ; « Discutons de votre projet » n'est plus employé. De même, tout lien vers `/contact` (boutons, liens de texte, contenus MDX) se nomme « Contact ».
- Le bouton chaud « Échange gratuit » réserve l'échange de 15 minutes (v1.7, ADR-023) : lien externe `CTA_CHAUD` (`lib/visio-conseil.ts`), ouvert dans un nouvel onglet. `/contact` est le bouton de la navigation et reste accessible depuis le footer.
- **Héros (27 septembre 2026, ADR-028)** : dans tous les héros, le premier bouton (plein) est l'échange gratuit, libellé « Échange gratuit » (EN « Free call ») depuis le 28 septembre 2026, en `text-sm` semi-gras, vers Calendly (`CTA_ECHANGE`, `lib/visio-conseil.ts`), ouvert dans un nouvel onglet. L'analyse du site (`/scan`) passe en bouton secondaire (filet), à côté des autres boutons du héros. Les deux températures restent présentes. Les fins de page gardent la règle ci-dessus.

## 8. Éléments de langage prêts à l'emploi

Accroches : Votre site WordPress vieillit mal · Ce que voient vos visiteurs n'est plus au niveau · Un site deux fois plus rapide, votre équipe qui publie comme avant · Six à dix semaines, prix et délai annoncés.

Recadrages : La vraie question n'est pas WordPress ou pas WordPress, c'est ce que vous gardez et ce que vous changez · Le problème n'est pas votre contenu, c'est ce qui l'affiche · Une refonte se juge à la vitesse mesurée le jour de la livraison, pas à la maquette.

Réassurance : Prix et délai écrits avant de commencer · Quinze ans à publier dans WordPress avant d'en développer · Une interlocutrice du devis à la mise en ligne · Performance mesurée avant, performance mesurée après · Je cadre, l'IA exécute.

Fermetures : On change ce qui est visible, on garde ce qui fonctionne · Un site se juge à ce qu'il coûte dans deux ans · Choisir la bonne techno. Construire utile. Éviter la complexité.

## 9. Plan de refonte éditoriale

Si trois choses seulement :
1. Réécrire le héros de la home (les trois idées + sous-titre mesurable + CTA diagnostic, v1.7) et remonter le bandeau de preuves juste dessous.
2. Réorganiser les trois offres en trajectoires nommées par bénéfice, Découpler recommandée, prix visibles ; réécrire la FAQ en conséquence.
3. Sortir le diagnostic du footer : navigation principale, héros, fin de chaque page.

Ensuite, par ordre d'impact :
4. Page WordPress headless réécrite comme page d'atterrissage Figaro.
5. Deux études de cas de refonte WordPress au gabarit, avec chiffres.
6. Page AGEFIPH avec exemple chiffré ; lien depuis la fin des pages d'offre uniquement.
7. Purge des anciennes offres IA sur tout le site : textes, sujets du formulaire, footer, mots-clés, métadonnées ; redirections des anciennes URL le cas échéant.
8. Passe typographique : suppression des tirets cadratins, unification du chiffre d'années de développement, accords.
9. Métadonnées de toutes les pages réécrites (titre, description) sur le lexique du §4.
10. Version anglaise alignée, page par page.

Quick wins (contenu, ordre, typographie) : points 1, 2, 3, 8, 9. Chantiers (production) : 4, 5, 6, 7, 10.

## 10. Garde-fous

- Ne pas remettre l'IA, ni l'AGEFIPH, en accroche de la home.
- Ne pas classer les offres par techno en titre.
- Ne pas supprimer l'offre WordPress classique.
- Ne pas créer de catalogue de sites à personnaliser, ni de packs d'heures : commoditise la marque. Un pack est un parcours par situation, composé des lignes du catalogue (v1.6).
- Ne pas donner à un pack un prix ou une remise qui lui soit propre, ni écrire son budget en dur. Ne pas le désigner autrement que par son seul nom (ADR-016), jamais par sa phrase de situation.
- Ne pas titrer une carte, une case du menu ou une ligne de pack par la phrase de situation : le titre est le nom du pack (ADR-016).
- Ne pas centrer le héros de la home sur la douleur, ni y nommer ou chiffrer une offre récurrente : il porte les trois idées, expertise de projet web, veille constante, direction externalisée (v1.7).
- Ne pas présenter une offre sans sa veille technique et stratégique : première analyse ou en continu, selon l'offre.
- Ne pas laisser un seul CTA d'une seule température sur une page.
- Ne pas laisser cohabiter deux chiffres pour la même réalité (années, projets, délais).
- Ne pas afficher les sept lignes ailleurs que sur `/tarifs` : ailleurs, trois choix au plus par besoin, un seul mis en avant.
- Ne pas donner deux noms à une prestation ni à un moment : Optimisation, Refonte, Évolution ; Diagnostiquer, Évoluer, Gérer. Ne pas réintroduire Consolider, Découpler, Refonder comme noms de prestation.
- Ne pas compter un palier ou une condition de démarrage comme une offre.
- Ne pas remettre Sentinelle en carte d'offre ni dans le menu : elle se dit en pastille et se vend depuis l'analyse du site.
- Ne pas présenter l'Expert technique externalisé comme une offre de `/conseil` : un renvoi suffit.
- Ne pas recopier un prix : chaque prix se lit dans sa source unique (§1).
- Ne pas présenter la maintenance comme une intervention ponctuelle ni rouvrir l'offre Dépannage WordPress.
- Ne pas laisser subsister une mention des anciennes offres IA au format d'origine (build pack, « direction technique fractionnée », sélecteur techno) sur aucune page, formulaire ou métadonnée. Exception cadrée : l'**Expert technique externalisé** (à partir de 900 € HT par mois), offre de conseil récurrente du catalogue §1, sous ce seul libellé — ne pas réintroduire « CTO externalisé » ni « CTO » (ADR-010).
- Ne pas traduire en anglais avant que le français soit figé.

## 11. Contrôle avant mise en ligne d'une page

- [ ] Le h1 nomme une douleur ou un bénéfice, pas une techno ; le bénéfice est en italique. Home : le h1 est « Menons *votre projet web* », le sous-titre « Surveiller, maintenir, réaliser. » (v1.7), pas la douleur.
- [ ] Une preuve chiffrée apparaît avant la première offre.
- [ ] Les trois prestations portent leurs prix et un seul nom chacune ; Refonte porte le badge « recommandée ».
- [ ] Un pack est désigné par son seul nom (Arbitrage, Audit + roadmap, Optimisation, Refonte, Évolution, Maintenance, Pilotage), jamais par sa phrase de situation ; le budget du pack est calculé, pas écrit.
- [ ] Une carte de prestation porte le nom de l'offre en titre, très visible, et dit aussitôt ce que c'est techniquement : nom technique, puis une phrase en clair.
- [ ] La veille technique et stratégique est dite : première analyse ou en continu.
- [ ] Chaque terme technique est suivi de sa traduction.
- [ ] Deux CTA, deux températures, libellés fixes.
- [ ] L'AGEFIPH n'apparaît qu'après la valeur.
- [ ] Zéro « nous », zéro tiret cadratin, zéro superlatif, zéro « simple ».
- [ ] Chiffres cohérents avec toutes les autres pages ; offres et prix identiques au catalogue du §1.
- [ ] Titre et méta-description réécrits sur le lexique.
- [ ] Test concurrent : un concurrent pourrait-il écrire le même titre ? Si oui, réécrire.
- [ ] Version anglaise traduite après validation du français.
