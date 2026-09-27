# Charte éditoriale · Vitrine next-impact.digital · Refonte éditoriale

> Version 1.4 · 27 septembre 2026. Document de travail pour la refonte éditoriale de la vitrine. Il remplace, pour le site, la charte « Offre et site » générique et s'appuie sur l'état du site en production relevé le 27 août 2026 (version anglaise crawlée) et sur le catalogue d'offres déjà en place sur le site en développement : Visio conseil refonte 150 €, Audit + roadmap 650 €, Refonte WordPress optimisée, Refonte headless, Web app. La charte newsletter « Quelle techno pour mon site ? » reste le canon du registre informatif (page Veille, blog).
>
> **Amendement du 7 septembre 2026 (v1.2).** Le catalogue passe de cinq à **six lignes** : l'offre récurrente de direction technique, supprimée le 27 août, est réinstaurée sous le nom « CTO externalisé », sur sa propre page `/cto-externalise`. Trois passages de la v1.1 sont amendés en conséquence : le tableau du §1 et la phrase « ces cinq lignes », l'ordre des offres du §5, et la clause de fermeture de la page Conseil au §6. Décision tracée en ADR-007 (`docs/decisions.md`).
>
> **Amendement du 10 septembre 2026 (v1.3).** La sixième ligne se renomme « Expert technique externalisé » : décision explicite d'Agathe qui inverse le garde-fou du §1/§10 protégeant jusqu'ici « CTO » comme seul terme non traduit toléré en accroche. Le nouveau libellé est désormais le seul toléré, en français comme en anglais (« Outsourced technical expert »), partout où l'offre est nommée. L'URL `/cto-externalise` et les identifiants techniques ne changent pas. Décision tracée en ADR-010 (`docs/decisions.md`).
>
> **Amendement du 27 septembre 2026 (v1.4).** Le catalogue passe de six à **dix lignes**, rangées en **trois moments** que le visiteur reconnaît sans lire le catalogue : **Décider** (visio, audit + roadmap, veille gratuite), **Refaire** (les trois trajectoires, refonte ou création), **Tenir** (Sentinelle, Suivi et maintenance en deux paliers avec un état des lieux de démarrage, Expert technique externalisé). Sentinelle revient dans l'index ; l'espace en ligne devient une preuve visible. La navigation devient Décider · Refaire · Tenir · Études de cas · À propos ; le CTA froid unique devient l'analyse du site (`/scan`), libellé « Analysez votre site en 2 minutes » ; `/tarifs` redevient une page. Amendés : §1, §5, §6, §7, §10. Décision tracée en ADR-012 (`docs/decisions.md`). Les prix de l'offre Suivi et maintenance sont des propositions à valider (`MAINTENANCE_PRIX_VALIDES` dans `lib/maintenance-offer.ts`).

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

| Famille | Offre | Prix |
|---|---|---|
| Conseil | Visio conseil refonte | 150 € HT |
| Conseil | Audit + roadmap : rapport d'audit, préconisations, roadmap | 650 € HT |
| Développement | Refonte WordPress optimisée : thème, plugin, optimisation de l'existant | à partir de 2 250 € HT |
| Développement | Refonte WordPress headless : back-office conservé, front moderne | à partir de 4 000 € HT |
| Développement | Refonte vers une web app : plateforme web et/ou mobile | à partir de 6 500 € HT |
| Accompagnement | Expert technique externalisé : direction technique à temps partagé, deux paliers (Référent, Direction technique) | à partir de 900 € HT par mois |
| Accompagnement | Sentinelle : lettre de veille et alertes personnalisées sur les composants du site | 19 € par mois, sans engagement |
| Accompagnement | Suivi et maintenance · Essentiel : surveillance, sauvegardes, mises à jour vérifiées, rapport mensuel, Sentinelle incluse | à partir de 89 € HT par mois (à valider) |
| Accompagnement | Suivi et maintenance · Actif : mises à jour hebdomadaires, 2 h d'intervention par mois, obligatoire en headless | 229 € HT par mois (à valider) |
| Accompagnement | Mise sous suivi : état des lieux de démarrage, offert pour un site livré par Next Impact | 290 € HT, une fois (à valider) |

Toute page, tout formulaire, toute métadonnée qui cite une offre cite l'une de ces dix lignes, avec ce libellé et ce prix. Source unique de chaque prix : `lib/visio-conseil.ts`, `components/services/PricingCards.tsx` (`getTiers`), `lib/cto-externalise.ts`, `lib/sentinelle-offer.ts`, `lib/maintenance-offer.ts`.

Les cinq premières lignes se vendent au forfait, une fois. Les autres sont des abonnements (la mise sous suivi en est le démarrage) : ils ne remplacent aucune des cinq, ils répondent à la question « qui tient le site une fois en ligne ? ». Ils n'apparaissent jamais en accroche de la home ni dans un héros : ce sont des offres de fin de parcours, pour un lecteur qui a déjà compris ce qu'il achète.

**Les trois moments (v1.4).** Le visiteur ne voit jamais les dix lignes d'un coup, sauf sur `/tarifs`. Partout ailleurs, il se situe dans un moment et y voit trois choix au plus, dont un seul mis en avant :

| Moment | Question du visiteur | Offres | Page d'atterrissage |
|---|---|---|---|
| Décider | « Je ne sais pas quoi faire, ou j'ai un devis à juger » | Visio conseil refonte · Audit + roadmap · veille gratuite | `/conseil` |
| Refaire | « Mon site vieillit, ou je n'en ai pas encore » | Consolider · Découpler (recommandée) · Refonder | `/solutions-web` |
| Tenir | « Mon site tourne, je veux qu'il le reste » | Sentinelle · Suivi et maintenance · Expert technique externalisé | `/maintenance-wordpress` |

Chaque offre se présente sur une carte au même gabarit : pour vous si (la situation), vous obtenez (le résultat), un prix « à partir de », une action. Les paliers ne s'affichent que sur la page de l'offre et sur `/tarifs`. Ce qui est inclus (Sentinelle dans la maintenance, trois mois de suivi dans chaque forfait, l'espace en ligne) se dit en pastille, jamais comme une offre. La création d'un site n'est pas une ligne à part : mêmes forfaits, point de départ différent.

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

Ordre de conviction, respecté par la home et, en version courte, par chaque page d'offre :

1. Douleur : votre site WordPress vieillit mal.
2. Promesse : rapide et moderne, sans tout reconstruire, 6 à 10 semaines.
3. Preuve : chiffre vérifiable, avant / après, étude de cas chiffrée, Le Figaro.
4. Offre : trois trajectoires, prix affichés, Headless recommandé.
5. Réassurance : forfait, délai, interlocutrice unique, parcours.
6. Accélérateur : AGEFIPH, après la valeur.
7. CTA froid (diagnostic 2 min) puis CTA chaud (rendez-vous).

Le recadrage signature du site : « La vraie question n'est pas WordPress ou pas WordPress, c'est ce que vous gardez et ce que vous changez. » Il remplace « The real choice is no longer only WordPress vs Headless. It is WordPress, no-code, AI coding… ».

Les trois trajectoires, nommées par bénéfice, la techno en sous-titre :

| Trajectoire | Quand | Offre | Prix |
|---|---|---|---|
| Consolider | Le problème, c'est le thème et l'empilement de plugins, pas WordPress | Refonte WordPress optimisée | à partir de 2 250 € HT |
| Découpler · recommandé | Le site est lent, l'équipe éditoriale est installée | Refonte WordPress headless | à partir de 4 000 € HT |
| Refonder | Le site est devenu un outil de travail | Web app, plateforme, PWA | à partir de 6 500 € HT |

En amont : Visio conseil refonte (150 € HT) et Audit + roadmap (650 € HT). Ce sont les portes d'entrée payantes ; le diagnostic 2 minutes est la porte d'entrée gratuite.

En aval, le moment « Tenir », du plus léger au plus engageant : Sentinelle (19 € par mois, prévenir), Suivi et maintenance (à partir de 89 € HT par mois, entretenir ; Sentinelle incluse), Expert technique externalisé (deux paliers, à partir de 900 € HT par mois, engagement de 6 mois puis reconduction au mois, préavis de 2 mois ; décider). Ces abonnements ne se proposent qu'après la valeur, au même rang que l'AGEFIPH dans l'ordre de conviction : jamais comme premier message, jamais en CTA froid. Chaque forfait de refonte inclut trois mois de suivi Essentiel (`SUIVI_INCLUS_MOIS`) : la reconduction se propose avec le bilan du troisième mois, jamais automatiquement.

## 6. Charte page par page

### Home `/`

Ordre cible des sections :

1. Héros. Titre + sous-titre + bénéfice chiffré + deux CTA.
2. Preuve immédiate : bandeau de chiffres (PageSpeed 45 → 98, Core Web Vitals mesurés en direct sur ce site, 25 projets livrés, Le Figaro mai 2026).
3. Les trois trajectoires, parité visuelle cassée, badge « recommandée » sur Découpler, prix visibles, lien vers le diagnostic.
4. Une étude de cas mise en avant avec résultat chiffré (Proditec 45 → 98 est plus parlant qu'une plateforme pour la cible WordPress ; Réseauteurs reste en second).
5. Témoignages nommés (conserver tels quels).
6. Qui le fait : photo, « 15 ans à publier dans WordPress avant d'en développer », « je cadre, l'IA exécute ».
7. AGEFIPH : un bloc court, orienté DAF.
8. FAQ : cinq questions maximum, réécrites (voir plus bas).
9. CTA final : diagnostic 2 minutes (principal), rendez-vous (secondaire).

Héros, quatre variantes à tester (titre / sous-titre / CTA) :

- Votre site WordPress vieillit mal. Il peut redevenir rapide *sans tout reconstruire*. / Refonte, headless ou web app : prix et délai annoncés, performance mesurée, 6 à 10 semaines. / Voyez ce qui ralentit votre site en 2 minutes
- Un site deux fois plus rapide. Votre équipe qui publie *comme avant*. / Je garde votre WordPress en back-office et je refais tout ce qui est visible. / Voyez ce qui ralentit votre site en 2 minutes
- Ce que voient vos visiteurs n'est plus au niveau de ce qu'ils voient *ailleurs*. / Trois trajectoires pour un site WordPress qui vieillit : consolider, découpler, refonder. Prix affichés. / Voyez ce qui ralentit votre site en 2 minutes
- De 45 à 98 sur PageSpeed, *sans changer d'outil de publication*. / Refonte WordPress, headless ou web app, en forfait, en 6 à 10 semaines. / Voyez ce qui ralentit votre site en 2 minutes

Conserver le motif de la marque : le bénéfice en italique dans le titre. Test pour chaque titre : un concurrent pourrait-il écrire le même ? Si oui, réécrire.

FAQ home, cinq questions cibles :
- Mon site WordPress est lent : refonte ou optimisation ?
- Qu'est-ce qu'une refonte headless, concrètement ?
- Mon équipe devra-t-elle réapprendre à publier ?
- Que se passe-t-il pour mon référencement ?
- Par où commencer : visio à 150 € ou audit à 650 € ?

Métadonnées cibles : `title` « Refonte de site WordPress : rapide, moderne, sans tout reconstruire · Next Impact » ; `meta description` « Votre site WordPress vieillit mal ? Refonte optimisée, headless ou web app, en forfait, en 6 à 10 semaines. Prix affichés, performance mesurée avant et après. »

### Conseil `/conseil`

Rôle : porte d'entrée payante à faible engagement, qui présente les TROIS lignes Conseil du catalogue, dans l'ordre d'engagement croissant : les deux offres ponctuelles, puis l'Expert technique externalisé (amendement du 10 septembre 2026, ADR-009 — il remplace la règle des deux seules offres). Titre cible : « Un avis tranché avant d'engager un budget ».

- Visio conseil refonte · 150 € HT. Une heure en visio, un avis écrit envoyé dans les 48 h : rester, découpler ou refonder, et pourquoi. Argument : le coût d'une mauvaise trajectoire se compte en mois, celui de l'avis en euros.
- Audit + roadmap · 650 € HT. Rapport d'audit (performance, sécurité, dette, plugins, hébergement), préconisations chiffrées, roadmap par étapes. Argument : le document sert même si la prestation est confiée à quelqu'un d'autre. Le montant est déduit du devis si la refonte est confiée à Next Impact (à confirmer par Agathe ; si oui, l'écrire, c'est un levier).

- Expert technique externalisé · à partir de 900 € HT par mois. Section d'offre en dernière position (§ 06, ancre `#cto-externalise`), au même gabarit que les deux précédentes : deux paliers, comité mensuel, devis relus, roadmap tenue à jour, livrables dans l'espace en ligne, engagement de 6 mois.

Distinction à tenir : la section de `/conseil` PRÉSENTE l'offre récurrente, elle ne la VEND pas. Son CTA (« Voir l'offre complète ») part vers `/cto-externalise`, qui reste la fiche complète — paliers détaillés, livrables, périmètre, FAQ — et la destination de l'item du mega menu. Aucun prix ni condition de l'expert technique externalisé n'est recopié sur `/conseil` : le contenu de la section dérive de `lib/cto-externalise.ts`.

Garde-fous inchangés (§5) : l'offre récurrente n'ouvre jamais la page. Le héros, son titre et son CTA principal restent sur la visio conseil ; l'expert technique externalisé n'apparaît dans le bandeau d'aperçu du héros qu'en dernière position et sans mention « recommandée ». Le bandeau de renvoi `CtoExternaliseBanner` est retiré de `/conseil` (il ferait doublon avec la section) ; sur `/solutions-web`, il est remplacé en v1.4 par le bandeau « Après la livraison » (`TenirBanner`), qui présente les trois abonnements du moment « Tenir ». Rien d'autre ne figure sur la page : ni build pack, ni « sélecteur techno ».

### Expert technique externalisé `/cto-externalise`

Rôle : la seule offre récurrente du catalogue, sur sa propre page. Elle ne vit ni sur `/conseil` (qui vend le ponctuel) ni sur `/solutions-web` (qui vend le forfait) : les deux y renvoient par un bandeau de pied de page. Titre cible : « Des décisions techniques à prendre, personne en interne pour les trancher ».

- Expert technique externalisé · deux paliers publiés. **Référent, 900 € HT par mois** : comité d'une heure par mois, arbitrages écrits sous 48 h, roadmap tenue à jour trimestriellement, veille dédiée d'une page par mois, 3 évolutions suggérées par trimestre, 1 revue d'opportunité par an, relecture des devis, espace client. **Direction technique, 1 900 € HT par mois** (le cas courant) : comité de deux heures, arbitrages sous 24 h, roadmap en continu, veille avec alerte à chaud, 3 évolutions par mois chiffrées, 2 revues d'opportunité par an, cadrage et suivi des prestataires, 4 h de réalisation incluses. Conditions communes : engagement de 6 mois puis reconduction au mois, préavis de 2 mois, clause de restitution documentée, 100 % à distance, 4 accompagnements simultanés au maximum.
- Le troisième palier de la synthèse d'offre (Renforcée, 3 500 € HT par mois) n'est PAS publié : il se cadre en conversation. Ne pas l'ajouter au site sans arbitrage.
- Le libellé officiel de l'offre est « Expert technique externalisé » (FR) / « Outsourced technical expert » (EN) : c'est le seul nom à utiliser, en titre comme dans le corps du texte — ne pas réintroduire « CTO » (arbitrage du 10 septembre 2026, ADR-010, qui remplace le raisonnement inverse de l'ADR-007 sur le mot tapé par le prospect). Le nom est traduit dès la ligne suivante : « une direction technique à temps partagé pour le numérique visible, quelques jours par mois, sans recruter ».
- La page NE met PAS en avant ce que l'offre ne comporte pas (arbitrage d'Agathe du 8 septembre 2026). Pas de section « ce que ce n'est pas », pas de liste de garde-fous en négatif : sur une offre de direction, elle place le lecteur devant un catalogue de refus avant qu'il ait fini de comprendre ce qu'il achète. Le périmètre se dit par ce qu'il COUVRE, le numérique visible : site et applications web, données et outils en ligne (CRM, e-mailing, formulaires, paiement, prise de rendez-vous), briques d'IA, hébergement, sécurité et conformité de ces systèmes, prestataires et contrats associés. Les limites subsistantes se traitent en FAQ, en réponse à une question posée.
- Argument d'indépendance à conserver : la réalisation est plafonnée au quota du palier, et toute recommandation qui débouche sur une prestation Next Impact est accompagnée d'une alternative externe chiffrée. Il justifie le prix et distingue l'offre d'une prestation de développement déguisée.
- Les livrables font la preuve, et se citent : cartographie du système, roadmap datée et budgétée, relevé de décisions techniques, revue de devis avec alternative chiffrée, budget technique à trois ans, plan de continuité et dossier de restitution, registre des évolutions, revue d'opportunité. Ce sont eux qui distinguent la direction technique d'un abonnement au conseil.
- Ordre des sections : douleur, en bref, pour qui (les symptômes), les deux paliers, les livrables et le périmètre, parcours de démarrage, FAQ, deux CTA de deux températures. La page se termine sur le choix ponctuel / récurrent, avec un lien vers `/conseil`.
- Aucun accompagnement ne démarre sans l'audit + roadmap préalable (650 € HT) : il qualifie le besoin et devient la roadmap vivante du contrat.

Métadonnées cibles : `title` « Expert technique externalisé : votre direction technique sans embaucher » ; `meta description` « Direction technique à temps partagé, dès 900 € HT par mois : pilotage mensuel, devis relus, roadmap tenue à jour. Sans embaucher, engagement 6 mois. »

### Services `/solutions-web`

Rôle : la page des trois trajectoires, développée. Titre cible : « Trois trajectoires pour un site WordPress qui vieillit ». Une section par trajectoire, même gabarit : pour qui · ce qu'on garde · ce qu'on change · ce qui est livré · prix et délai · une preuve. Le simulateur de prix reste, sous les trajectoires. La comparaison détaillée présente les trois options côte à côte, avec Découpler en colonne centrale et le badge « recommandée ».

### WordPress headless `/wordpress-headless`

Rôle : page d'expertise signature et page d'atterrissage de l'article du Figaro. Titre cible : « Votre équipe publie dans WordPress. Vos visiteurs voient un site rapide et moderne. » Structure : le mécanisme en une phrase et un schéma ; le résultat chiffré (Core Web Vitals, temps de chargement) ; ce qui ne change pas pour les rédacteurs ; ce qui change pour la sécurité et la maintenance ; quand ce n'est pas la bonne réponse (honnêteté = réassurance) ; prix et délai ; CTA diagnostic.

### Études de cas `/etudes-de-cas`

Rôle : le déficit de preuve se comble ici. Gabarit obligatoire pour chaque étude : contexte (secteur, taille, situation de départ) · problème (chiffré si possible) · solution (trajectoire choisie, ce qui a été gardé) · résultat mesuré (vitesse, délai, conversion) · une citation nommée. Priorité de rédaction : les projets de refonte WordPress et headless, pour coller à la cible, avant les plateformes. Objectif : passer de 2 études détaillées à 6 dans les trois mois.

### À propos `/a-propos`

Rôle : la présence humaine et la double culture. Ordre : la phrase « j'ai été à votre place » (15 ans côté éditorial) ; le passage au développement (une seule valeur d'années, partout) ; la méthode « je cadre, l'IA exécute » ; le studio solo comme garantie (une interlocutrice, une responsabilité) ; le statut TIH, dit sobrement, sans en faire un argument commercial sur cette page. La métaphore du stagiaire peut vivre ici, en une phrase.

### AGEFIPH `/avantage-oeth`

Rôle : le second message, orienté DAF / DRH. Titre cible : « 30 % du coût de main-d'œuvre déductibles de votre contribution AGEFIPH ». Contenu : qui est concerné (20 salariés et plus, assujettis OETH), le mécanisme en trois lignes, la base légale (art. D.5212-7 et L.5212-10-1 du Code du travail), un exemple chiffré sur un projet à 4 000 €, la phrase « un argument pour votre DAF, une fois le projet validé ». Aucun lien vers cette page depuis le héros de la home.

### Diagnostic : l'analyse du site `/scan`

Rôle : le CTA froid unique (v1.4). `/audit-site-web` et `/audit-site-ia` redirigent vers `/scan` (redirection temporaire). Libellé fixe : « Analysez votre site en 2 minutes » (version courte : « Analyser mon site »). L'ancien libellé « Voyez ce qui ralentit votre site » est abandonné : l'analyse liste les composants du site et ceux qui sont à risque, elle ne mesure pas la vitesse. Promesse : une adresse, un rapport, aucun accès demandé. À venir (code Sentinelle, hors vitrine) : le rapport oriente vers un seul moment selon le verdict (bon état vers Tenir, fragile vers la visio, à refaire vers les trajectoires).

### Suivi et maintenance `/maintenance-wordpress` (v1.4)

Rôle : page d'offre de la maintenance ET page d'atterrissage du moment « Tenir ». Titre : « Une mise à jour ratée ne devrait pas se découvrir par un client ». Ordre : douleur ; ce qui est surveillé (les cinq mesures que l'espace en ligne affiche déjà : disponibilité, sauvegardes, mises à jour, failles, vitesse ; ne rien promettre que l'espace ne sache montrer) ; les deux paliers et le démarrage ; l'échelle Prévenir · Entretenir · Décider ; FAQ ; deux CTA. Positionnement : les autres font les mises à jour, je dis ce qu'elles changent et quand réparer ne suffit plus. Ne jamais la présenter comme une intervention ponctuelle (l'offre Dépannage WordPress reste supprimée). Tant que `MAINTENANCE_PRIX_VALIDES` vaut false : noindex, hors sitemap, hors llms.

### Sentinelle `/sentinelle` (v1.4)

De retour dans l'index (retirée le 4 septembre, réintégrée le 27). Première marche de « Tenir » : elle prévient, elle n'intervient pas, et renvoie vers le suivi et maintenance pour qui veut qu'on intervienne. `/veille` reste la page de la veille gratuite, sans prix.

### Espace client `/espace-client` (v1.4)

Rôle double : preuve pour le prospect (ce qu'il verra chaque mois), accès pour le client (lien « Espace client » du header et du footer, aiguillage vers `/espace-direction` et vers l'espace abonné Sentinelle). Nom dans le texte : « espace en ligne ». Aucune capture de vrai client : un schéma présenté comme tel. Arguments : rangé par question (Missions, Votre site, Agir, Veille), ce que chaque offre y ouvre, connexion sans mot de passe, tout se télécharge.

### Tarifs `/tarifs` (v1.4)

La seule page qui liste les dix lignes et leurs paliers, par moment. Elle sert le prospect qui vérifie ; elle est reliée depuis la home et le footer.

### Contact `/contact`

Rôle : le CTA chaud. Le formulaire de production propose six sujets alignés sur les anciennes offres ; il passe à cinq, alignés sur le catalogue : Visio conseil refonte (150 €) · Audit + roadmap (650 €) · Projet de refonte (WordPress, headless ou web app) · Diagnostic gratuit de mon site · Autre. Les libellés parlent situation ou offre, jamais techno seule. Conserver : réponse sous 24 h, coordonnées directes, un témoignage nommé.

### Veille `/veille` et blog

Registre de la charte newsletter, inchangé : impersonnel, informatif, sans offre ni prix. C'est le seul endroit du site où le « vous » est absent. Un seul pont vers le commercial : un encadré discret en fin de page, « Votre site est concerné ? Diagnostic en 2 minutes ».

### Apporteurs `/apporteurs` et agences `/agences`

Hors cible prospect froid. Même voix, argument unique : forfait, délai, une interlocutrice, marge ou commission claire. Pas de refonte prioritaire.

## 7. CTA et navigation

- Navigation principale (v1.4) : Décider · Refaire · Tenir · Études de cas · À propos, puis un lien « Espace client » et le bouton « Analyser mon site » (`/scan`). Chaque moment ouvre un mega menu de trois cases (`lib/mega-menu.ts`). Le rendez-vous reste dans le tiroir mobile, le footer et en fin de chaque page.
- Chaque page d'offre se termine par deux CTA : froid (analyse du site) en principal, chaud (rendez-vous) en secondaire. Jamais un seul CTA d'une seule température.
- Libellés fixes : « Analysez votre site en 2 minutes » (froid), « Discutons de votre projet » (chaud), « Voir l'étude de cas » (preuve).

## 8. Éléments de langage prêts à l'emploi

Accroches : Votre site WordPress vieillit mal · Ce que voient vos visiteurs n'est plus au niveau · Un site deux fois plus rapide, votre équipe qui publie comme avant · Six à dix semaines, prix et délai annoncés.

Recadrages : La vraie question n'est pas WordPress ou pas WordPress, c'est ce que vous gardez et ce que vous changez · Le problème n'est pas votre contenu, c'est ce qui l'affiche · Une refonte se juge à la vitesse mesurée le jour de la livraison, pas à la maquette.

Réassurance : Prix et délai écrits avant de commencer · Quinze ans à publier dans WordPress avant d'en développer · Une interlocutrice du devis à la mise en ligne · Performance mesurée avant, performance mesurée après · Je cadre, l'IA exécute.

Fermetures : On change ce qui est visible, on garde ce qui fonctionne · Un site se juge à ce qu'il coûte dans deux ans · Choisir la bonne techno. Construire utile. Éviter la complexité.

## 9. Plan de refonte éditoriale

Si trois choses seulement :
1. Réécrire le héros de la home (douleur + promesse + chiffre + CTA diagnostic) et remonter le bandeau de preuves juste dessous.
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
- Ne pas créer de catalogue de sites ou de packs : commoditise et érode l'argument AGEFIPH.
- Ne pas laisser un seul CTA d'une seule température sur une page.
- Ne pas laisser cohabiter deux chiffres pour la même réalité (années, projets, délais).
- Ne pas afficher les dix lignes ailleurs que sur `/tarifs` : ailleurs, trois choix au plus par moment, un seul mis en avant.
- Ne pas recopier un prix : chaque prix se lit dans sa source unique (§1).
- Ne pas présenter la maintenance comme une intervention ponctuelle ni rouvrir l'offre Dépannage WordPress.
- Ne pas laisser subsister une mention des anciennes offres IA au format d'origine (build pack, « direction technique fractionnée », sélecteur techno) sur aucune page, formulaire ou métadonnée. Exception cadrée : l'**Expert technique externalisé** (à partir de 900 € HT par mois), offre de conseil récurrente du catalogue §1, sous ce seul libellé — ne pas réintroduire « CTO externalisé » ni « CTO » (ADR-010).
- Ne pas traduire en anglais avant que le français soit figé.

## 11. Contrôle avant mise en ligne d'une page

- [ ] Le h1 nomme une douleur ou un bénéfice, pas une techno ; le bénéfice est en italique.
- [ ] Une preuve chiffrée apparaît avant la première offre.
- [ ] Les trois trajectoires portent leurs prix ; Découpler porte le badge « recommandée ».
- [ ] Chaque terme technique est suivi de sa traduction.
- [ ] Deux CTA, deux températures, libellés fixes.
- [ ] L'AGEFIPH n'apparaît qu'après la valeur.
- [ ] Zéro « nous », zéro tiret cadratin, zéro superlatif, zéro « simple ».
- [ ] Chiffres cohérents avec toutes les autres pages ; offres et prix identiques au catalogue du §1.
- [ ] Titre et méta-description réécrits sur le lexique.
- [ ] Test concurrent : un concurrent pourrait-il écrire le même titre ? Si oui, réécrire.
- [ ] Version anglaise traduite après validation du français.
