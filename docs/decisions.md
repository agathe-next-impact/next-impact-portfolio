# Décisions — évolution next-impact.digital (directives v3.1)

Journal ADR court exigé par la règle transverse 7. Une entrée par décision
prise en autonomie ; les modifications structurantes restent soumises à accord
préalable.

## ADR-001 — 2026-07-29 — Lot 0 mené avant tout code

Reconnaissance complète du repo (stack, routing, 301, analytics, empreinte
lexicale). Rapport : `.claude/docs/lot-0-reconnaissance.md`. Cinq écarts
identifiés, dont deux soumis à arbitrage d'Agathe avant le Lot A (articles
AGEFIPH/TIH non listés ; destination 301 du simulateur).

## ADR-002 — 2026-07-29 — Purge et 301 bilingues FR + EN

Les directives ne mentionnent pas l'i18n ; le site est bilingue (next-intl,
FR sans préfixe, EN sous `/en`). Toute dépublication, purge lexicale et 301 du
Lot A s'applique aux deux locales, en suivant le pattern de doublons FR/EN
déjà en place dans `next.config.mjs`.

## ADR-003 — 2026-07-29 — Mentions AGEFIPH incidentes : édition, pas suppression

Les MDX blog/doc qui mentionnent l'AGEFIPH au détour d'un passage (articles
prix notamment) sont conservés : seul le passage concerné est réécrit ou
retiré. La suppression de page ne s'applique qu'aux contenus entièrement
dédiés au sujet, listés dans la table 301 validée.

## ADR-004 — 2026-07-29 — Arbitrages d'Agathe sur les écarts du Lot 0

1. Les deux articles dédiés AGEFIPH/TIH
   (`/articles/reduire-contribution-agefiph-sous-traitance-tih`,
   `/articles/attestation-deductibilite-tih-guide-entreprises`) sont
   **conservés en ligne**. L'acceptation A.3 est adaptée : zéro occurrence
   AGEFIPH/OETH/TIH hors `/a-propos`, pages légales **et ces deux articles**
   (ainsi que leur listing dans l'index des articles).
2. `/outils/simulateur-agefiph` : 301 → `/outils` (équivalent le plus proche),
   FR et EN.

## ADR-005 — 2026-07-29 — Adaptations autonomes pendant le Lot A

1. Événement analytics `boussole_result` renommé `selecteur_techno_result` et
   source newsletter `boussole` → `selecteur-techno` (rupture de continuité
   des séries de mesure, assumée pour la purge lexicale).
2. Tableaux TCO des articles blog « headless vs classique » (FR/EN) : la ligne
   déduction AGEFIPH retirée, totaux recalculés (4 700 € net → 5 900 €).
3. Les deux articles TIH conservés pointaient vers `/avantage-oeth`
   (breadcrumb + CTA « Simuler mon économie ») : breadcrumb recâblé sur
   `/articles`, CTA remplacé par « En savoir plus sur le statut TIH » →
   `/a-propos`.
4. Étude de cas « Artisan Coiffeur » (client pilote) conservée ; seule la
   mention « La Petite Vitrine » de ses alt/descriptions est retirée. Le lien
   externe artisan-coiffeur.lapetitevitrine.com reste (domaine du client,
   pas d'occurrence du lexique interdit dans le HTML rendu).
5. Entrée métadonnées `simulateurTarifs` (pointait vers la page simulateur
   supprimée, aucun usage) retirée de `lib/metadata.ts`.
6. Clé de navigation i18n `nav.boussole` renommée `nav.selecteurTechno` ;
   clés footer devenues sans usage (`oethAdvantage`, `agefiphSimulator`,
   `tihMention`, `hero.tihMention`) supprimées des deux locales.

## ADR-006 — 2026-07-30 — Réintégration de l'étude de cas La Petite Vitrine

Sur demande explicite d'Agathe, l'étude de cas « La Petite Vitrine »
(dépubliée par le Lot A, commit 548023c) est restaurée à l'identique depuis
git : données FR/EN (`lib/case-studies-data.ts`), carte de la grille
(`components/case-studies/realisations.tsx`), image
`public/img/desktop-screen-lapetitevitrine.jpg`. Les 301
`/etudes-de-cas/la-petite-vitrine → /solutions-web` (FR + EN) sont retirées
de `next.config.mjs`. La mention retirée des alt/descriptions d'Artisan
Coiffeur (ADR-005 §4) n'est pas rétablie.

## ADR-007 — 2026-09-07 — Réinstauration de l'offre récurrente « CTO externalisé »

Sur demande explicite d'Agathe, l'offre récurrente de direction technique,
supprimée le 27 août 2026 par le commit `b8a328d` (« Direction technique
externalisée », 750 € HT/mois), est réinstaurée sous le nom **CTO externalisé**,
le terme réellement recherché.

Écarts assumés par rapport aux conditions de la suppression :

1. **Tarif et engagement révisés** : à partir de 950 € HT par mois, engagement de
   3 mois minimum puis reconduction au mois. L'ancien palier de 750 €/mois sans
   engagement n'est pas rétabli et ne doit plus être cité.
2. **Page dédiée plutôt que carte sur `/conseil`** : l'offre vit sur
   `/cto-externalise` (bilingue FR + EN). `/conseil` et `/solutions-web` s'y
   contentent d'un bandeau de renvoi en pied de page. Les cartes d'offre de
   `/conseil` restent les deux offres ponctuelles du catalogue.
3. **Accès par une entrée plate de la navigation principale**, pas par un menu
   déroulant : le panneau masqué du défunt menu « Ressources », retiré le
   16 août 2026, restait dans le DOM et déclenchait le prefetch Next de ses
   destinations à chaque page. Une entrée de plus coûte moins qu'un panneau.
4. **Deep-links historiques recâblés** : `?sujet=direction-technique` et
   `?sujet=accompagnement` atterrissent sur le nouveau sujet de contact
   `cto-externalise` au lieu de « Autre ».

La charte éditoriale a été amendée en conséquence (v1.2 du 7 septembre 2026) :
catalogue porté à six lignes au §1, offre récurrente placée en aval au §5,
clause de fermeture de la page Conseil réécrite au §6, et fiche de page
`/cto-externalise` ajoutée. Sans cet amendement, la charte primant sur
`CLAUDE.md`, la passe éditoriale suivante aurait purgé l'offre en toute
bonne foi.

Source de vérité unique du contenu et du prix : `lib/cto-externalise.ts`. Les
données structurées, les fichiers `llms.txt` / `llms-full.txt`, le sujet du
formulaire de contact et le sitemap en dérivent ; aucun ne réécrit le prix.

## ADR-008 — 2026-09-08 — Refonte de l'offre « CTO externalisé » : deux paliers publiés

Remplace les points 1 et 3 de l'[ADR-007](#adr-007--2026-09-07--réinstauration-de-loffre-récurrente--cto-externalisé-),
sur la base de la synthèse d'offre « Direction technique externalisée » remise
par Agathe. L'offre reste sur `/cto-externalise` et reste la seule ligne
récurrente du catalogue ; ce qui change, c'est sa structure et son prix.

1. **Prix d'entrée ramené de 950 à 900 € HT par mois**, et passage d'un tarif
   unique à **deux paliers publics** : Référent (900 €/mois, un système simple et
   des décisions ponctuelles) et Direction technique (1 900 €/mois, le cas
   courant : plusieurs outils, des prestataires, des échéances). Le troisième
   palier de la synthèse, Renforcée à 3 500 €/mois, n'est **pas** publié : il se
   cadre en conversation. Ne pas l'ajouter au site sans arbitrage.
2. **Engagement porté de 3 à 6 mois**, puis reconduction au mois, avec un préavis
   de 2 mois. Motif : six mois est la durée qu'il faut pour qu'un cycle complet
   se voie (cartographie, roadmap tenue, arbitrages rendus, première revue
   d'opportunité).
3. **La page décrit désormais les livrables**, pas seulement la couverture :
   cartographie du système, roadmap datée et budgétée, relevé de décisions,
   revue de devis avec alternative chiffrée, budget technique à trois ans, plan
   de continuité et dossier de restitution, registre des évolutions, revue
   d'opportunité. Ce sont eux qui distinguent une direction technique d'un
   abonnement au conseil, et ils rendent la prestation vérifiable.
4. **Périmètre resserré et garde-fous réécrits** : l'offre couvre le numérique
   visible (site, applications web, données et outils en ligne, briques d'IA,
   hébergement, sécurité, prestataires). Elle exclut le SI interne, l'infogérance
   et le support de niveau 1, l'astreinte 24/7, la communication et le marketing,
   et la réalisation au delà du quota du palier. L'ancien garde-fou « pas de
   développement inclus » est retiré : le palier Direction technique inclut 4 h
   de réalisation par mois.
5. **L'entrée de navigation plate de l'ADR-007 n'a jamais été mise en service** :
   le merge du 8 septembre a conservé le mega menu de la branche distante, où le
   CTO externalisé est un item du panneau « Conseil ». Le motif de l'ADR-007
   (éviter le prefetch fantôme d'un panneau masqué) reste satisfait, le panneau
   du mega menu n'étant monté qu'à l'ouverture.

Conséquence documentaire : charte v1.2 mise à jour au §1 (ligne du catalogue),
au §5 (mention « en aval ») et fiche de page `/cto-externalise` réécrite ;
`.claude/agents/coherence-seo-geo.md` réaligné, faute de quoi la passe SEO
suivante aurait rétabli 950 € et l'engagement de 3 mois en toute bonne foi.

Point laissé ouvert : la synthèse impose qu'**aucun contrat ne démarre sans
l'audit + roadmap préalable (650 € HT)**. La page l'indique dans son parcours de
démarrage, mais les autres sections de la synthèse (revue d'opportunité, flux
mensuel d'évolutions, traitement écrit du conflit d'intérêt) ne sont pas encore
publiées.

## ADR-009 — 2026-09-10 — Le CTO externalisé revient sur `/conseil`, sans quitter sa page

Remplace la clause de fermeture de l'[ADR-007](#adr-007--2026-09-07--réinstauration-de-loffre-récurrente--cto-externalisé-)
(« `/conseil` s'y contente d'un bandeau de renvoi ») sur demande d'Agathe. Le
catalogue ne bouge pas : six lignes, dont une seule récurrente. Ce qui change,
c'est l'endroit où le lecteur de `/conseil` la rencontre.

1. **`/conseil` présente les trois lignes Conseil**, dans l'ordre d'engagement
   croissant : visio conseil refonte (§ 04), audit + roadmap (§ 05), CTO
   externalisé (§ 06, ancre `#cto-externalise`). La troisième section reprend le
   gabarit des deux autres, dans `OFFERS` (`lib/visio-conseil.ts`). Le bandeau
   `CtoExternaliseBanner` est retiré de la page : il ferait doublon. Il reste en
   place sur `/solutions-web`.
2. **Présenter n'est pas vendre.** Le CTA de la section (« Voir l'offre
   complète ») part vers `/cto-externalise`, qui reste la fiche complète
   (paliers, livrables, périmètre, FAQ) et la destination de l'item du mega menu.
   Aucun prix ni condition n'est recopié : la section dérive de
   `lib/cto-externalise.ts`, source de vérité unique, y compris pour les deux
   paliers et l'engagement cités en puces.
3. **Garde-fous de la charte §5 tenus.** L'offre récurrente n'ouvre pas la page :
   le héros, son titre et son CTA principal restent sur la visio conseil, offre
   froide et ponctuelle. Le CTO n'entre dans le bandeau d'aperçu du héros qu'en
   troisième position et sans mention « recommandée » — c'est un aperçu du
   catalogue, pas une accroche.
4. **Ancres de nav réparées au passage.** Le mega menu desktop scrollait lui-même
   vers les ancres d'offre de la page courante ; l'accordéon mobile et le CTA du
   header, eux, passaient par un `Link` next-intl nu, qui ne fait qu'une
   navigation « même route » sans bouger la vue. Le lien « Audit + roadmap »
   (`/conseil#architecture-projet-ia`) était donc inerte sur mobile une fois sur
   `/conseil`. La logique est sortie dans `hooks/use-same-page-anchor.ts` et
   appliquée aux trois endroits ; elle respecte `prefers-reduced-motion`.
5. **Parité FR/EN des prix rétablie** dans les sections d'offre : `price` devient
   bilingue (« 150 € » / « €150 ») et la mention légale suit la locale (HT /
   excl. VAT). La version anglaise affichait « 150 € HT ». `CaseStudyDecisionPath`,
   qui lit ce même prix, prend désormais la variante de sa locale.

Conséquence documentaire : charte v1.2 amendée au §6 (fiche `/conseil`
réécrite), et coquille du §12 corrigée au passage — elle citait encore 950 € HT,
tarif d'avant l'[ADR-008](#adr-008--2026-09-08--refonte-de-loffre--cto-externalisé--deux-paliers-publiés).

## ADR-010 — 2026-09-10 — L'offre récurrente se renomme « Expert technique externalisé »

Décision explicite d'Agathe, en rupture assumée avec le garde-fou du §1/§10 de
la charte (« CTO » toléré non traduit « parce que c'est le mot que le prospect
tape », libellé protégé « sous ce seul libellé »). Le garde-fou reposait sur un
pari de correspondance de requête ; Agathe préfère un intitulé compréhensible
sans jargon pour une cible DIRCOM/dirigeant non technique. Confirmé
explicitement après qu'on lui a signalé le conflit avec l'ADR-007/ADR-009.

1. **Nouveau nom commercial : « Expert technique externalisé »** (FR) /
   « Outsourced technical expert » (EN), partout où l'offre est nommée : titre
   et méta de `/cto-externalise`, JSON-LD, item du mega menu, footer, libellé
   du sujet de formulaire de contact, FAQ, `llms.txt`/`llms-full.txt`, et le
   corps de `lib/cto-externalise.ts` (y compris les réponses de FAQ qui
   utilisaient « le CTO externalisé » en sujet de phrase).
2. **Ce qui NE change PAS** : l'URL `/cto-externalise`, la valeur du sujet de
   formulaire (`cto-externalise`), `CTO_PATH`/`CTO_CONTACT_HREF`/le nom des
   constantes dans le code, le contenu de `src/cto/` (espace client), et les
   documents historiques (`docs/cto-externalise/*.md`,
   `docs/evolution-offre-next-impact.md`) qui restent tels qu'écrits au moment
   des faits.
3. **Prix, paliers, structure de l'offre inchangés** — seul le libellé change.
   Le catalogue reste à six lignes (charte §1, ligne « Accompagnement »
   renommée).

Conséquence documentaire : charte v1.2 amendée aux §1, §5, §6, §10 (le
garde-fou qui imposait « CTO externalisé » comme seul libellé toléré est
remplacé par un garde-fou équivalent sur « Expert technique externalisé ») ;
`.claude/agents/coherence-seo-geo.md` mis à jour pour ne pas revenir sur ce
renommage lors d'un prochain passage.

## ADR-011 — 2026-09-25 — L'espace client reçoit l'audit complet, lu dans sa page Notion

Revient sur un choix inscrit dans `src/cto/deliverables/types.ts` : un lien de
roadmap vers un rapport d'audit était « la porte vers le document source, pas un
moyen d'en rapatrier le contenu ici ». Décision explicite d'Agathe (option C de
l'analyse du 2026-09-25), réponses aux quatre questions posées :

1. **Un client audit seul a accès à l'espace.** Palier `audit`, service
   `Audit` sur sa fiche Clients : l'espace lui ouvre la section Audit, le
   tableau de bord et la veille générale.
2. **La source est la page Notion, pas les JSON du kit.** La page de mission
   (« Audits et Roadmap ») est la version relue et retouchée après
   `/publier-notion` ; les fichiers `constats.json`, `roadmap.json` du kit
   restent locaux et peuvent diverger.
3. **Le contenu entier est recopié**, synthèse, sous-pages et bases inline,
   pas un résumé. Il vit en base derrière la session et le contrôle
   d'appartenance ; la notification n'annonce que des compteurs ; la
   restitution PDF le reprend en entier.
4. **L'intégration Notion est partagée sur « Audits et Roadmap »**, en plus de
   « Direction technique — clients ».

Conséquences :

- Nouveau type de livrable `audit` (enum Postgres, migration 0012), donc
  append-only comme les autres : une correction de l'audit après remise écrit
  une version datée, l'historique dit quelles parties ont changé.
- Nouvelle base Notion facultative **Audits** (`CTO_NOTION_DB_AUDITS`) : une
  ligne par audit remis, qui pointe sa page de mission. Le contenu reste dans la
  page, la ligne ne porte que le rattachement, la date des mesures, l'annexe et
  l'interrupteur `Publié`.
- Les actions de la base inline ROADMAP d'un audit au statut « Validé client »
  (puis « En cours », « Fait ») deviennent des chantiers de la roadmap de
  l'espace, sans ressaisie. « Proposé » reste une recommandation, lisible dans
  l'audit seulement.
- Le modèle d'audit n'est pas figé dans le code : toute sous-page devient une
  partie, toute base inline un tableau. Seule ROADMAP est reconnue par son nom.
- Coût : une centaine de requêtes Notion par audit publié et par balayage
  (environ 30 s). Acceptable à quelques audits ; à revoir au-delà de cinq ou six
  audits publiés en même temps (le Cron a 300 s).

## ADR-012 — 2026-09-27 — Trois moments, dix lignes : Sentinelle et la maintenance entrent au catalogue

Demande d'Agathe du 2026-09-27 : ajouter à la vitrine Sentinelle (lettre de
veille et alertes personnalisées), une offre de monitoring et maintenance, et
mettre en avant l'espace client, en gardant le site simple pour le visiteur.
Parcours réfléchi, puis maquetté (canvas « Offres en trois moments »), puis
mis en œuvre sur la branche `offres-trois-moments` (plan :
`docs/plan-offres-trois-moments.md`). Charte amendée en v1.4.

1. **Le catalogue passe de six à dix lignes**, rangées en trois moments :
   Décider (visio 150 €, audit + roadmap 650 €, veille gratuite), Refaire (les
   trois trajectoires, refonte ou création), Tenir (Sentinelle 19 €/mois,
   Suivi et maintenance Essentiel et Actif, mise sous suivi, Expert technique
   externalisé). Le visiteur ne voit les dix lignes que sur `/tarifs`.
2. **Offre Suivi et maintenance** : source unique `lib/maintenance-offer.ts`,
   page `/maintenance-wordpress` (aussi page d'atterrissage de « Tenir »).
   Prix PROPOSÉS, non validés : Essentiel 89 € HT/mois, Actif 229 € HT/mois
   (obligatoire en headless), démarrage 290 € HT (offert pour un site livré),
   engagement 3 mois, 20 sites au maximum. Drapeau
   `MAINTENANCE_PRIX_VALIDES = false` : page en noindex, hors sitemap, hors
   llms, tant qu'Agathe n'a pas validé.
3. **Trois mois de suivi Essentiel inclus dans chaque forfait**
   (`SUIVI_INCLUS_MOIS`, mettre 0 pour le retirer de tout le site). Engagement
   commercial proposé, à confirmer.
4. **Sentinelle revient dans l'index** (revient sur la décision du
   2026-09-04) : `RETIREE_DU_SEO = false`, sitemap. Tirets cadratins retirés
   de sa page ; la limite « ni un contrat de maintenance » devient un renvoi
   vers le suivi et maintenance.
5. **Navigation** : Décider · Refaire · Tenir · Études de cas · À propos, lien
   « Espace client », bouton « Analyser mon site » vers `/scan` (le bouton
   pointait vers Calendly depuis le 2026-09-10 ; le rendez-vous reste dans le
   tiroir mobile et en fin de page).
6. **CTA froid unique : l'analyse du site `/scan`.** `/audit-site-web` et
   `/audit-site-ia` redirigent vers `/scan` (307) au lieu de Calendly (revient
   sur la décision du 2026-09-10) : la cinquantaine de liens internes vers
   `/audit-site-web` retrouvent un diagnostic gratuit. Libellé fixe
   « Analysez votre site en 2 minutes » : l'ancien « Voyez ce qui ralentit
   votre site » promettait une mesure de vitesse que l'analyse ne fait pas.
7. **`/tarifs` redevient une page** (la redirection 301 vers `/solutions-web`
   est retirée) ; **`/espace-client`** est créée (visite de l'espace en ligne,
   schéma sans données réelles, aiguillage vers les deux connexions) ; le
   bandeau `CtoExternaliseBanner` de `/solutions-web` est remplacé par
   `TenirBanner` (« Après la livraison ») et supprimé.
8. **Formulaire de contact** : sujet `maintenance` ajouté, « Projet de refonte
   ou de création », sujets rangés par moment.

Hors périmètre, à faire ensuite : le pont vers la visio dans le rapport de
`/scan` quand le verdict est mauvais (code Sentinelle, soumis à
`docs/sentinelle/CLAUDE.md`) ; un service `projet` dans l'espace en ligne ; la
version anglaise des nouvelles pages (FR d'abord, charte §3).

## ADR-013 — 2026-09-27 — L'offre se simplifie : sept lignes, Diagnostiquer · Évoluer · Gérer

Demande d'Agathe du 2026-09-27, après la mise en œuvre de l'ADR-012 :
« comment simplifier l'offre », puis « applique cela », avec les termes
Diagnostiquer, Évoluer, Gérer. Constat : les trois moments avaient simplifié
le rangement, pas l'offre. Le catalogue était passé de six à dix lignes, la
home montrait huit cartes et huit prix dans une seule section, chaque
trajectoire portait trois noms, et l'Expert technique externalisé vivait dans
deux moments. Charte amendée en v1.5. Amende l'ADR-012, revient sur l'ADR-009.

1. **Les trois moments se renomment** Diagnostiquer · Évoluer · Gérer (en
   anglais : Diagnose · Evolve · Manage), à la place de Décider · Refaire ·
   Tenir. Le mot « Décider » ne désigne plus à la fois un moment et une
   offre. Les URL et les identifiants techniques ne changent pas (clés
   `decider`, `refaire`, `tenir`, composant `TenirBanner`), selon la règle
   déjà appliquée par l'ADR-010.
2. **Un seul nom par trajectoire** : Consolider, Découpler, Refonder, la
   technique en sous-titre. « Vitrine simple », « Site complexe »,
   « Plateforme et app » et « Choisir cette stack » sont retirés de
   `components/services/PricingCards.tsx`, source unique des trajectoires.
   Ces libellés classaient par type de site : un site vitrine lent se
   reconnaissait dans « Vitrine simple » et s'éloignait de la trajectoire
   recommandée.
3. **La home pose une décision** : seules les trois trajectoires sont en
   cartes. « Diagnostiquer » et « Gérer » tiennent en une phrase chacune,
   avec un prix et un lien (`components/home-offres.tsx`).
4. **On compte les offres, pas les paliers** : le catalogue passe de dix à
   sept lignes. Le suivi et maintenance est une ligne à deux paliers. La
   mise sous suivi (290 € HT, à valider) devient sa condition de démarrage,
   dite dans le détail de la ligne sur `/tarifs`.
5. **Sentinelle sort du catalogue**, et reste dans l'index. Elle se vend
   depuis le rapport de l'analyse du site, qui porte déjà le lien
   d'abonnement, et reste incluse dans le suivi et maintenance, où elle se
   dit en pastille. Elle quitte le menu, les cartes et les lignes de
   `/tarifs` ; son prix reste lisible en note sur `/tarifs` et sur la page
   de la maintenance. Le footer garde son lien. Aucun code Sentinelle n'est
   modifié. Amende les points 1 et 5 de l'ADR-012 ; le point 4 (retour dans
   l'index) est conservé.
6. **L'Expert technique externalisé ne vit plus que dans « Gérer »**.
   `/conseil` revient à deux offres et un renvoi : le bandeau
   `CtoExternaliseBanner` est rétabli en fin de catalogue et garde l'ancre
   `#cto-externalise`. Le « En bref » et la FAQ de `/conseil` gardent une
   ligne de renvoi. Revient sur l'ADR-009.
7. **« Gérer » présente deux offres** : entretenir (suivi et maintenance),
   piloter (expert technique externalisé). Le mega menu du moment compte
   deux cases ; la grille du panneau suit le nombre de cases.
8. **Une seule porte froide sur les pages d'offre** : le bouton principal du
   héros de la home, celui du héros de `/solutions-web` et celui des
   trajectoires Consolider et Découpler mènent à `/scan`, avec le libellé
   fixe. Le test « Réparer ou refaire ? » et le test d'éligibilité restent
   des outils, plus des boutons d'appel à l'action.
9. **Titre de `/conseil`** aligné sur le titre cible de la charte §6 : « Un
   avis tranché avant d'engager un budget ».

Non traité ici, à arbitrer par Agathe :

- Les liens de rendez-vous passent encore par Calendly et par trois agendas
  Google. La carte Refonder garde son bouton vers un agenda Google.
- La carte Refonder annonce « Support prioritaire 12 mois », la méthode
  « 30 jours », alors que chaque forfait annonce trois mois de suivi inclus.
- Les prix du suivi et maintenance ne sont pas validés
  (`MAINTENANCE_PRIX_VALIDES = false`).
- Les portes froides hors pages d'offre (documentation, hub, outils, études
  de cas, libellés « audit gratuit ») : relevé et plan dans
  `docs/audit-parcours-2026-09-27.md`.
- Le héros de la home (titre, onglets Veille / Conseil / Refonte) et le
  titre « Construire sur le besoin » de `/solutions-web`.
- La suite proposée, l'offre par situation : `docs/plan-offres-par-situation.md`.

## ADR-014 — 2026-09-27 — L'offre par situation : besoins, situations, packs, et la veille partout

Demandes d'Agathe du 2026-09-27, après l'ADR-013 : « créer des packs par
situation et structurer par situation, besoin, et non par type d'offre »,
puis six arbitrages sur la proposition (`docs/plan-offres-par-situation.md`)
et trois consignes en cours de mise en œuvre (noms des prestations, veille).
Charte amendée en v1.6. Amende l'ADR-012 (prix du suivi) et l'ADR-013 (noms
des prestations, forme de la home et du menu).

1. **Trois niveaux : le besoin, la situation, le pack.** Le besoin mène au
   pack par la situation précise. Les besoins sont dits à la première
   personne et rangés par moment : « Je veux pouvoir décider »
   (Diagnostiquer), « Je veux faire évoluer mon site web » (Évoluer), « Je
   veux agir dans la durée » (Gérer). Les noms de moment restent ceux du
   menu ; les clés techniques ne changent pas.
2. **Six situations, un pack par situation.** Un pack met des lignes du
   catalogue dans l'ordre (avant, pendant, après) et en donne le budget. Il
   ne crée ni ligne, ni prix, ni remise, ni nom propre. Le catalogue reste
   de sept lignes. Le garde-fou du §10 sur les packs est inversé : seuls le
   catalogue de sites à personnaliser et les packs d'heures restent exclus.
3. **Le mot affiché est « pack »** (arbitrage d'Agathe, contre la
   proposition « parcours »).
4. **Source unique** : `lib/situations.ts` (besoins, situations, étapes,
   budgets calculés, contenu des pages). Les montants des prestations
   passent de `PricingCards.getTiers` à `lib/trajectoires.ts`, avec une
   valeur numérique : un budget se calcule, il ne se recopie pas.
5. **Les prestations se renomment** : Optimisation (ex-Consolider), Refonte
   (ex-Découpler, recommandée), Évolution (ex-Refonder). Remplace le point 2
   de l'ADR-013. Les identifiants `forfait-classique`, `forfait-headless`,
   `forfait-webapp` et les ancres ne changent pas.
6. **Prix du suivi et maintenance validés**, avec une grille par type de
   site, par mois et hors taxes : site WordPress, Essentiel 89 €, Actif
   249 € ; site headless ou web app, Essentiel 129 €, Actif 299 €.
   `MAINTENANCE_PRIX_VALIDES = true` : `/maintenance-wordpress` devient
   indexable, entre au sitemap, dans llms et dans le catalogue JSON-LD, qui
   lisent tous le drapeau.
7. **La règle « Actif obligatoire en headless » est retirée.** Lecture de
   l'arbitrage d'Agathe, qui donne deux paliers pour le headless : les deux
   paliers existent pour chaque type de site, la grille porte la différence.
   Les trois mois de suivi inclus dans un forfait sont au palier Essentiel de
   la grille du site livré. À confirmer par Agathe.
8. **La veille technique et stratégique distingue chaque offre.** Première
   analyse dans l'audit + roadmap et dans les trois prestations ; en continu
   dans le suivi et maintenance (Sentinelle incluse) et dans l'expert
   technique externalisé. Définie une fois (`VEILLE` dans
   `lib/situations.ts`), dite sur la home, sur chaque page de pack, sur
   `/packs`, `/tarifs`, `/maintenance-wordpress`, dans les puces de l'audit
   et dans « ce qui est inclus » de chaque prestation. Sentinelle reste hors
   catalogue (ADR-013).
9. **Six pages nouvelles**, `/packs/<situation>`, et leur index `/packs` :
   pages d'atterrissage de la prospection, une par situation. Preuve lue
   dans `lib/case-studies-data.ts` (Proditec, Comme des fous, Réseauteurs).
   Contenu en français, locale anglaise en noindex.
10. **Home et menu par besoin.** La home revient à trois colonnes, une par
    besoin, dont les cartes sont des situations ; la colonne « Évoluer » est
    au centre, le pack Refonte seul recommandé. Remplace le point 3 de
    l'ADR-013. Les cases du mega menu deviennent des situations et mènent
    aux pages de pack ; le panneau porte le besoin en titre.
11. **`/tarifs`** montre les packs par besoin, puis le catalogue par moment.
12. **Pas de bloc AGEFIPH sur les pages de pack** : l'AGEFIPH a été retirée
    du site par les directives v3.1 (`.claude/docs/`), qui priment.

Non traité ici, à arbitrer par Agathe :

- Le montant de la mise sous suivi (290 € HT), repris de la proposition.
- Les noms des deux paliers du suivi : Essentiel et Actif sont conservés ;
  Agathe les décrit comme « maintenance simple » et « suivi + maintenance ».
  « Simple » est un mot banni par la charte §3.
- Deux voisinages de noms : le moment « Évoluer » contient la prestation
  « Évolution » ; l'onglet « Refonte » du héros de la home désigne les trois
  prestations, alors que « Refonte » nomme désormais l'une d'elles.
- Les pages de pack « Gérer » recoupent `/maintenance-wordpress` et
  `/cto-externalise` : elles y renvoient pour le détail, mais l'intention de
  recherche est proche.
- La version anglaise des pages de pack (FR d'abord, charte §3).

## ADR-015 — 2026-09-27 — Cartes de prestation : le nom de l'offre en titre, la technique dite aussitôt

Demande d'Agathe du 2026-09-27, après l'ADR-014 : « affiche les titres
d'offres dans les cartes prestation de façon très visible et indique ce que
c'est techniquement de façon claire immédiatement ». Sur ces cartes, le nom
de l'offre était un repère en petites capitales au-dessus de la situation, et
la technique n'était pas dite. Amende, pour les seules cartes de prestation,
la règle de l'ADR-014 et de la charte v1.6 selon laquelle le titre d'une
carte est une situation. La charte reste en v1.6, avec une précision datée.

1. **Le titre d'une carte de prestation est le nom de l'offre** :
   Optimisation, Refonte, Évolution, en grand. Celui de la prestation
   recommandée prend la couleur d'accent.
2. **La carte dit aussitôt ce que c'est techniquement**, en deux lignes sous
   le titre : le nom technique en caractères lisibles, puis une phrase en
   clair. Source unique : `lib/trajectoires.ts`, champs `technique` et
   `enClair`. Le nom technique reste un sous-titre suivi de sa traduction :
   la règle « aucun terme technique en titre » de la charte §3 tient.
3. **La situation vient juste après**, puis le résultat, le prix et
   l'action.
4. **Périmètre** : les trois cartes de la colonne « Évoluer » de la home
   (`components/home-offres.tsx`) et les trois cartes de `/solutions-web`
   (`components/services/PricingCards.tsx`). Une carte reconnaît une
   prestation par le nom de son offre (`trajectoireDuNom`), sans champ
   ajouté à `lib/situations.ts`.

Non traité ici, à arbitrer par Agathe :

- Les autres cartes de la home (visio, suivi et maintenance, expert
  technique externalisé), les cases du menu, les lignes de `/packs` et les
  pages de pack gardent la situation en titre.
- La bande d'aperçu du héros de `/solutions-web` garde le nom de la
  prestation en petites capitales.
- Les trois phrases en clair sont à relire par Agathe : elles reprennent ce
  que les pages disaient déjà, elles n'ont pas été validées mot à mot.

## ADR-016 — 2026-09-27 — Un seul terme par pack, jamais la phrase de situation

Demande d'Agathe du 2026-09-27 : « utilise pour chaque pack 1 seul terme pour
le désigner (jamais les phrases de situation) ». Noms et place de la phrase
tranchés par Agathe le même jour. Remplace la règle de l'ADR-014 (« un pack
n'a pas de nom propre, il se désigne par sa situation ») et étend à tous les
packs la forme des cartes de prestation (ADR-015). Charte v1.6, précision
datée.

1. **Six noms**, un terme chacun, dans `nom` de `lib/situations.ts` :
   Arbitrage (`devis-a-juger`), Optimisation, Refonte, Évolution (les trois
   prestations, noms lus dans `lib/trajectoires.ts`), Maintenance
   (`site-a-tenir`), Pilotage (`decisions-techniques`). En anglais :
   Decision, Optimization, Redesign, Evolution, Maintenance, Steering.
   Forme affichée : `packNom()`, « Pack Refonte ».
2. **Le nom désigne le pack partout** : titre des cartes de la home, libellé
   des cases du menu, titre des lignes de `/packs`, de `/tarifs` et des
   « autres situations », surtitre et fil d'Ariane des pages de pack, nom du
   schéma Service et de la CollectionPage, libellé des liens de llms.
3. **La situation devient une ligne « pour qui »** : sous le nom sur les
   cartes et les lignes, en description dans le menu, dans la note du héros
   des pages de pack, et après le nom dans llms. Elle ne titre plus rien et
   n'est plus un libellé de lien.
4. **Inchangés** : le h1 des pages de pack (la douleur, charte §5), les
   `metaTitle` (formulés pour la recherche), les slugs et les URL, les
   phrases des besoins (« Je veux… »), qui titrent toujours les panneaux du
   menu et les colonnes.

Choix écartés : « Diagnostic » pour Arbitrage (se confond avec l'analyse
gratuite de `/scan`), « Suivi » pour Maintenance (sert déjà aux trois mois
inclus), « Direction technique » pour Pilotage (nom du palier supérieur de
l'expert technique externalisé).

## ADR-017 — 2026-09-27 — Graisse maximale du site : 500

Demande d'Agathe du 2026-09-27 : « aucune font weight ne doit être
supérieur à 500 ». Le numéro ADR-016 est réservé à une décision menée en
parallèle par une autre session (désignation des packs).

Constat : le thème Tailwind du projet décalait les noms de graisse d'un
cran. `font-medium` valait 600, `font-semibold` 700, `font-bold` 800. Une
classe au nom anodin rendait donc plus gras qu'attendu : c'est ce qui est
arrivé aux cartes de prestation de l'ADR-015, écrites en `font-medium`.

1. **La règle vit dans le thème** (`tailwind.config.ts`) : `font-medium`,
   `font-semibold`, `font-bold`, `font-extrabold` et `font-black` sont
   plafonnées à 500. Aucune classe ne peut rendre plus gras, dans la
   vitrine comme dans les espaces client et Sentinelle, qui partagent ce
   thème. Pour écrire 500, la classe juste est `font-regular`.
2. **Feuille de style globale** (`app/globals.css`) : les deux règles à 600
   passent à 500, et `b`, `strong` et `th`, que le navigateur rend en gras,
   sont ramenés à 500.
3. **Graisses écrites en ligne** : tous les `fontWeight` de 600 et plus des
   dossiers `app/` et `components/` sont ramenés à 500.
4. **Image de partage** (`app/og.png`) : Figtree 500 à la place de 600.
5. **Les noms de classe ne sont pas réécrits.** Les quelque trois cents
   `font-medium`, `font-semibold` et `font-bold` du code restent en place
   et rendent 500. Les renommer en `font-regular` toucherait une centaine
   de fichiers pendant qu'une autre session y travaille : à faire à part.

Non traité ici, à arbitrer par Agathe :

- Les e-mails (`lib/email-template.ts`, `lib/audit-email-renderer.ts`) et la
  feuille d'impression de la checklist (`lib/checklist-geo-print.ts`)
  gardent leurs graisses : ce ne sont pas des pages du site, et une
  messagerie rend 500 comme du texte normal.
- La hiérarchie visuelle qui reposait sur le gras (libellés de boutons,
  titres du menu) repose maintenant sur la taille, la couleur et les
  capitales. À relire à l'œil.

## ADR-018 — 2026-09-27 — Arbitrages sur l'offre par situation

Réponses d'Agathe du 2026-09-27 aux points laissés ouverts par l'ADR-014.

1. **Mise sous suivi : 290 € HT, une fois**, validée (offerte pour un site
   livré par Next Impact).
2. **« Actif obligatoire en headless » reste retiré** : les deux paliers
   existent pour chaque type de site ; les trois mois inclus dans un forfait
   sont au palier Essentiel de la grille du site livré.
3. **Noms des paliers conservés** : Essentiel et Actif.
4. **L'Évolution (web app) n'a pas d'administration WordPress** : application
   Next.js, base de données et administration sur mesure, formation incluse.
   Seules l'Optimisation et la Refonte gardent l'interface WordPress. Corrigés :
   la stack de la carte Évolution (`components/services/PricingCards.tsx`), la
   FAQ de `/solutions-web` et les cartes de comparaison
   (`lib/homepage-profiles.ts`, `lib/homepage-profiles-en.ts`), le §1 de la
   charte.
5. **Le héros de la home est refait** (`components/hero.tsx`), sur la
   variante 1 de la charte §6 : « Votre site WordPress vieillit mal. Il peut
   redevenir rapide *sans tout reconstruire*. », une phrase de promesse (les
   trois prestations, prix et délai écrits, veille à chaque étape), deux
   boutons (analyse du site, rendez-vous), la photo d'Agathe et les logos
   clients. Les onglets Veille / Conseil / Refonte sont retirés : ils
   doublaient la section de l'offre par besoin et plaçaient des prix dans le
   héros. La bande de preuve (`ProofStrip` : 45 → 98, études publiées,
   Core Web Vitals, Le Figaro) remplace le bandeau de logos techno, juste sous
   le héros. Le panneau de la dernière lettre Substack quitte la home.

## ADR-019 — 2026-09-27 — Le héros de la home porte les trois idées, plus la douleur

Demande d'Agathe du 2026-09-27 : « modifie la charte et ne centre pas sur la
douleur mais bien sur les idées », les idées étant l'expertise de projet web,
la veille constante et la direction externalisée. Amende le point 5 de
l'ADR-018 (héros sur la variante 1 de la charte, « Votre site WordPress
vieillit mal… »). Charte amendée en v1.7.

1. **Le titre du héros de la home dit les trois idées**, en trois ou quatre
   mots, une idée en italique : expertise de projet web (concevoir, livrer),
   veille constante (veiller), direction externalisée (piloter, décider).
   Variante recommandée : « Concevoir, *veiller*, piloter. », un verbe par
   moment de l'offre. Il ne nomme ni douleur, ni offre, ni prix, ni techno.
2. **Le sous-titre porte le mesurable** (prix annoncé, performance mesurée,
   une seule interlocutrice) : un titre de trois mots ne prouve rien seul.
3. **La douleur quitte le héros de la home** ; elle reste l'entrée des pages
   d'offre et des pages de pack, qui reçoivent la prospection, et des
   messages de prospection.
4. **Les abonnements restent hors du héros** en tant qu'offres : ni nom
   (« Expert technique externalisé », « Suivi et maintenance »), ni prix. Ce
   sont les idées de veille et de direction qui titrent, pas les offres.
5. Le reste de l'ADR-018 est inchangé : boutons, photo, logos clients, bande
   de preuve sous le héros.

**Choix d'Agathe, appliqué le même jour** : titre « Pilotage de *projet web* »
(anglais « Web project *leadership* »), sous-titre « Surveiller, maintenir,
réaliser. » (« Monitor, maintain, deliver. »). Champ `tagline` ajouté à
`HeroVariant` (`lib/homepage-profiles.ts`), rendu sous le h1 par
`components/hero.tsx`. La description garde la phrase de promesse, qui porte
le mesurable. Le point 2 ci-dessus s'applique donc à la description, pas au
sous-titre.

Non traité ici : les métadonnées de la home (§6), qui restent sur la refonte
WordPress pour la recherche ; le surtitre du héros, « Refonte de site
WordPress », conservé.

## ADR-020 — 2026-09-27 — Home, section 2 : l'offre en onglets, un par famille

Demande d'Agathe du 2026-09-27 : « reprends les tabs qui existaient sur la
home, 1 par famille ; chaque tab doit contenir les packs en cartouche pleine
largeur sans trop de contenu ». Remplace la forme en trois colonnes de la
section 2 (ADR-014, point 10). Charte v1.7, §6.

1. **Trois onglets**, un par famille : Diagnostiquer, Évoluer, Gérer, au
   motif des anciens onglets du héros (numéro, libellé en capitales,
   indicateur glissant). Évoluer est ouvert par défaut.
2. **Chaque onglet** : la phrase du besoin, puis un cartouche pleine largeur
   par pack. Un cartouche garde le nom du pack, la technique (prestation) ou
   l'offre au centre, la situation en ligne « pour qui », le budget et un
   lien ; le résultat détaillé et la phrase en clair quittent la home et
   restent sur la page du pack. Une ligne de pied par famille : la veille
   gratuite, les pastilles d'inclus, l'espace en ligne.
3. **Les trois panneaux sont rendus** dans le HTML, les inactifs en
   `hidden` : tous les packs restent lisibles par les moteurs et sans
   JavaScript. Navigation au clavier selon le motif ARIA « tabs » (flèches,
   Origine, Fin).
4. Inchangés : le bloc de veille et le bandeau des deux boutons sous les
   onglets.

Fichier : `components/home-offres.tsx`.

## ADR-021 — 2026-09-27 — Home, section 3 : la spécificité, analyse et veille continue

Demande d'Agathe du 2026-09-27. Le bloc de veille, jusqu'ici en bas de la
section 2, devient une section à part, la section 3 de la home
(`components/home-veille.tsx`). Charte v1.7, §1 et §6.

1. **Surtitre** « La spécificité de Next Impact » ; **titre** « Analyse et
   veille *continue* » (anglais « Analysis and watch, *continuous* »).
2. **Deux cartes**, une par forme de veille, renommées à la source (`VEILLE`
   dans `lib/situations.ts`), donc partout où elles s'affichent (pastilles
   des étapes des pages de pack, `/packs`, `/tarifs`) :
   - « Analyse technique et stratégique » (ex « Veille : première
     analyse ») ;
   - « Veille écosystème et technos » (ex « Veille en continu »).
3. **Sous chaque carte, les packs qui la contiennent**, en badges à bord
   carré, chacun vers la page du pack. Liste calculée par
   `packsAvecVeille()` depuis les étapes des packs, jamais écrite. Au
   2026-09-27 : analyse dans Arbitrage, Optimisation, Refonte, Évolution,
   Pilotage ; veille dans Optimisation, Refonte, Évolution (par les mois de
   suivi inclus), Maintenance, Pilotage.
4. Le paragraphe « où » de chaque carte est retiré (les badges le disent) ;
   le paragraphe de détail est conservé.

## ADR-022 — 2026-09-27 — L'audit + roadmap devient un pack de « Diagnostiquer »

Demande d'Agathe : l'audit + roadmap doit se lire dans Diagnostiquer. Il y
figurait au catalogue, mais le besoin « Je veux pouvoir décider » n'avait
qu'un pack (Arbitrage) : dans le menu, la home, `/packs` et `/tarifs`, l'audit
n'apparaissait que comme étape d'autres packs (Arbitrage, Évolution, Pilotage).

1. Septième situation, `etat-des-lieux`, besoin `decider` : **Audit + roadmap**,
   « Je prépare une décision qui engage un budget ». Parcours : analyse du
   site (gratuite), audit + roadmap, puis expert technique externalisé si les
   décisions reviennent tous les mois. Budget calculé : le prix de l'audit, en
   une fois.
2. Le panneau Diagnostiquer du menu compte trois cases : Arbitrage, Audit,
   Veille et ressources.
3. La requête d'offre (« audit site WordPress ») reste à `/conseil` ; la page
   de pack vise la situation (état des lieux, plan par étapes avant budget).
4. Le catalogue reste de sept lignes : un pack assemble, il n'ajoute rien.
5. Complément du même jour (demande d'Agathe). Les offres de Diagnostiquer
   ne portent plus le mot « pack » : « Arbitrage », « Audit + roadmap », « Voir
   l'offre » (`estPack()` dans `lib/situations.ts`). La veille quitte la
   section Diagnostiquer (case du menu, lien de l'onglet de la home, ligne de
   `/tarifs`). L'offre gratuite est mise en avant partout : badge plein
   « Gratuit, sans engagement », bord d'accent (`estGratuit()`).
6. Menu Évoluer : le badge donne le prix de la prestation tel que
   `/solutions-web` l'affiche (« À partir de … HT »), pas le budget du pack ;
   le sous-titre est la solution technique (`technique` de
   `lib/trajectoires.ts`).
7. Toujours le 2026-09-27 : le mot « pack » ne s'affiche plus nulle part
   (`packNom()` rend le nom seul). Le concept se dit « parcours » (anglais
   « path ») dans les textes, les llms et les métadonnées ; les adresses
   `/packs/...` et les identifiants de code ne changent pas. Les cartes du
   menu et les cartouches de la home ont deux gabarits : la carte mise en
   avant (gratuite ou recommandée) est grande, bordée d'accent, avec une
   pastille ; les autres sont plus compactes. Dans le menu, le prix passe en
   pied de case, le statut en pastille.
8. Menu Gérer : Maintenance et Pilotage affichent un tarif mensuel (« À
   partir de … HT / mois », lu dans `mensuel`), pas le budget du parcours.
   Sous-titres (`sousTitre`, repris sur la home) : « Surveillance et
   correctifs en continu » (Maintenance), « Direction technique
   externalisée » (Pilotage).
9. Entrées du menu principal : Audit · Prestations · Pilotage · Veille ·
   Études de cas (anglais : Audit · Services · Steering · Tech watch · Case
   studies). Seuls les libellés `nav` changent (`messages/*.json`) ; les clés
   `decider`, `refaire`, `tenir`, `surveiller`, les panneaux et les noms de
   moment de la home et de `/tarifs` restent ceux de l'ADR-013.
10. Dans le menu, Pilotage (panneau Pilotage) et Sentinelle (panneau
   Veille) prennent la case mise en avant : fond distinct, bord et titre
   d'accent, comme les offres gratuites et recommandées.
11. H1 de `/solutions-web` (entrée « Prestations ») : « Réalisation de
   projet web », accent sur « projet web ». Il ne reprend plus le besoin
   « Je veux faire évoluer mon site web ».
12. `/tarifs` : la section 02 « Diagnostiquer » (échange gratuit, audit +
   roadmap) est supprimée ; les sections suivantes sont renumérotées. Les deux
   offres restent lisibles, avec leur prix, dans la section 01 (parcours par
   besoin).
   Sections de `/tarifs` renumérotées dans l'ordre, de № 01 (héros) à № 05.
13. Menu : les entrées Audit, Prestations, Pilotage et Veille ouvrent leur
   panneau (desktop et accordéon mobile) et ne mènent plus à une page ; la
   ligne supérieure du panneau (le besoin) n'est plus un lien, « Voir la
   page » disparaît. Les pages mères (`/conseil`, `/solutions-web`,
   `/maintenance-wordpress`, `/veille`) sont conservées : seuls les liens du
   menu vers elles sont retirés.
14. Correction de 13 : la ligne supérieure de chaque panneau redevient le lien
   vers la page mère, et c'est le seul (l'entrée de nav reste un bouton).
   Elle est rendue plus lisible : « Votre besoin » en surtitre, le besoin en
   grand, et à droite un bouton d'accent « Voir la page <entrée> » (« Voir la
   page Prestations »), toute la ligne cliquable.
15. Tiroir mobile refait pour un usage simple : chaque rubrique en grande
   ligne (nom + besoin en clair), offres en cibles tactiles d'au moins 48 px
   (nom, sous-titre, prix, pastille), page mère en fin de liste, les deux
   actions épinglées en bas, Échap ferme, la page derrière ne défile plus.
16. Correction de 14 (demande d'Agathe du 2026-09-27, « le lien de menu
   parent doit être cliquable ») : sur desktop, l'entrée de nav redevient un
   lien vers la page mère. Le survol et le focus ouvrent toujours le
   panneau ; le clic mène à la page. La ligne supérieure du panneau reste
   un lien. Dans le tiroir mobile, la rubrique garde son accordéon (un tap
   doit ouvrir la liste) et la page mère reste en fin de liste.

## ADR-023 — 2026-09-27 — La visio conseil payante devient un échange gratuit de 15 minutes

Demande d'Agathe du 2026-09-27 : « remplace l'offre visio conseil par 15 min
pour en discuter gratuite ». Nom, outil et rôle du bouton chaud tranchés par
Agathe le même jour. Charte v1.7, amendement daté.

1. **La visio conseil refonte (150 € HT, une heure, avis écrit sous 48 h,
   déduite du devis sous 30 jours) est supprimée.** Elle est remplacée par
   l'**Échange de 15 minutes**, gratuit, sans engagement : poser la
   situation et savoir par où commencer (analyse du site, audit + roadmap ou
   devis). Pas d'avis écrit : l'écrit, c'est l'audit + roadmap.
2. **Réservation sur Calendly** :
   `https://calendly.com/agathe-next-impact/prise-de-contact-conseil`
   (lien fourni par Agathe). Source unique : `ECHANGE_URL`, `ECHANGE_NAME` et
   `CTA_CHAUD` dans `lib/visio-conseil.ts`. L'identifiant d'offre et l'ancre
   `#choix-techno-ia` sont conservés (liens en circulation).
3. **Le bouton chaud « Discutons de votre projet » réserve l'échange**
   partout : héros de la home, section 2, pages de pack, `/packs`, `/tarifs`,
   `/maintenance-wordpress`, `/espace-client`, tiroir mobile du header, bouton
   flottant (qui pointait vers un agenda Google), rapport de scan (session
   Sentinelle, URL recopiée conformément à l'isolation). Lien externe, nouvel
   onglet. `/contact` reste dans le footer et la navigation ; son sujet
   « Visio conseil refonte (150 €) » devient « Une décision à trancher ».
4. **Packs** : l'étape « Visio conseil refonte » devient « Échange de 15
   minutes » (gratuit). `CREDIT_WINDOW_DAYS` et l'avantage « visio déduite du
   devis » disparaissent. Arbitrage : budget gratuit, audit + roadmap en
   variante ; titre de page « Un devis à juger ? Parlons-en avant de
   signer ». Optimisation et Refonte : budgets inchangés (la visio y était
   comptée à 0 €). Un budget à 0 € s'affiche « Gratuit ».
5. **Pages et données** : `/conseil` (héros, bandeau d'offres, réassurance,
   « Comment ça marche », FAQ, métadonnées, schéma), bandeau de la home,
   « En bref » et FAQ de la home, `/tarifs`, FAQ de l'expert technique,
   JSON-LD (catalogue, ReserveAction vers `ECHANGE_URL`), llms.txt et
   llms-full.txt, métadonnées de `/contact`, outils, hub de documentation et
   études de cas (libellés « … en visio · 150 € » remplacés).

Incident : la réécriture du budget d'Arbitrage a supprimé par erreur
`BUDGET_AUDIT` (pack Audit, ADR-022, écrit par une autre session), ce qui a
mis le site de développement en erreur 500 quelques minutes. Rétabli à
l'identique de sa description (analyse gratuite, puis audit, en une fois).

## ADR-024 — 2026-09-27 — Le cartouche « En bref » devient « L'essentiel », juste avant la FAQ

Demande d'Agathe du 2026-09-27 : garder les cartouches « En bref » pour leur
effet GEO, mais plus en haut de page. Charte v1.7, précision datée.

1. **Position.** Sur la home, `/solutions-web`, `/conseil`,
   `/cto-externalise` et `/a-propos`, le cartouche quitte le dessous du héros
   et se place juste avant la FAQ, qu'il ouvre comme une synthèse. Le haut
   de page reste à la preuve (bandeau de chiffres, puis l'offre).
2. **Pourquoi la GEO n'y perd pas.** Les moteurs de réponse découpent la
   page en passages et citent le passage autoportant, pas le premier. Le
   texte reste dans le HTML servi, les lignes viennent de la même source que
   llms.txt, et les classes `.home-tldr`, `.services-tldr`, `.cto-tldr`,
   `.conseil-tldr`, `.about-tldr` restent les cibles du Speakable.
3. **Titre.** « L'essentiel » (EN « Key points ») : « En bref » annonçait un
   résumé d'ouverture, le mot ne tenait plus en fin de page.
4. **Gabarit commun** `components/en-bref.tsx`, sans `<Reveal>` : l'animation
   rendait le bloc à opacity 0 jusqu'au défilement, et un moteur qui rend la
   page sans défiler aurait vu un texte invisible. Jamais replié ni masqué.
5. **Hors périmètre.** `/wordpress-headless` garde sa section « Le WordPress
   headless en cinq faits » en № 02 : c'est une page pilier explicative, les
   faits y sont le contenu, pas un encart de synthèse.

## ADR-025 — 2026-09-27 — Sentinelle : l'e-mail pour l'abonné seul, l'espace pour tous

Demande d'Agathe du 2026-09-27. Sentinelle a deux publics, et chacun lit sa
veille à un seul endroit.

1. **Abonné Sentinelle seul** (formule `veille`, Payment Link Stripe) : lettres,
   alertes et liens de connexion partent par e-mail. Chaque lettre invite à
   ouvrir l'espace abonné (`/espace`), ouvert dès l'abonnement : une ligne sous
   le chapeau, un encart avec bouton avant la clôture.
2. **Client en accompagnement** (formule `accompagnement`, fiche créée par le
   provisionnement depuis l'espace d'accompagnement) : rien ne part par e-mail.
   Un numéro ou une alerte validés sont publiés dans l'espace d'accompagnement
   par l'export. L'admin remplace le bouton d'envoi par cette mention, et
   l'envoi est refusé côté serveur (`planMailReason`).
3. **L'espace abonné porte aussi les archives de la lettre gratuite**
   (Substack), sous les numéros Sentinelle.
4. **Bascule de formule.** Le provisionnement passe la fiche à
   `accompagnement`, y compris un abonné seul adopté. Un paiement Stripe la
   remet à `veille`. Un abonné qui passe en accompagnement garde son abonnement
   Stripe : le résilier reste un geste manuel.

## ADR-026 — 2026-09-27 — Sentinelle : fin de l'abonnement en ligne, inscription par opt-in

Demande d'Agathe du 2026-09-27. Remplace le Payment Link Stripe ; précise le
point 4 de l'ADR-025 (il n'y a plus de paiement Stripe pour remettre une fiche
en `veille` : c'est l'activation d'une demande qui le fait).

1. **L'abonnement commence par un opt-in** : nom, organisation, e-mail, adresse
   du site, case de consentement. Le même formulaire vit sur la page
   `/sentinelle` (section « Tarif et inscription », ancre `#inscription`) et
   dans le rapport d'analyse, qui ajoute son identifiant pour amorcer la fiche.
2. **Agathe valide chaque demande** dans l'admin (`/admin/sentinelle/inscriptions`),
   prévenue par e-mail à la première demande d'une adresse. « Activer » crée la
   fiche en formule `veille`, analyse le site (ou reprend le rapport), ouvre
   l'espace et envoie la bienvenue. Rien ne part vers le demandeur avant.
3. **Le prix reste affiché (19 €/mois), la facturation se fait hors ligne.**
   Résiliation sur simple message, faite depuis la fiche client de l'admin.
4. **Retirés** : module `billing/`, webhook Stripe, page de retour de paiement
   `/espace/bienvenue`, portail de facturation de l'espace, dépendance `stripe`,
   variables `STRIPE_*`. Les colonnes `stripe_*` de `clients` restent en base,
   jamais écrites.
5. **Données** : une demande traitée est effacée 30 jours après la décision ;
   sans réponse, au bout de 3 ans. Politique de confidentialité mise à jour.

## ADR-027 — 2026-09-27 — La lettre Sentinelle couvre les concurrents directs

Demande d'Agathe du 2026-09-27, après la réécriture de la section « Quatre
parties » de `/sentinelle` : la lettre est la veille de l'écosystème du site
(technologies, secteur, marché, concurrents), rapportée au site et à ses enjeux.

1. **Collecte** : une étape 3 identifie deux à quatre concurrents directs (mêmes
   règles que le diagnostic du rapport d'analyse), lit leur page d'accueil et
   compare ; leurs mouvements datés entrent dans les faits (famille
   « Concurrence »). Budget de lecture porté de 8 à 12 pages. Les concurrents
   du numéro précédent sont repris d'un numéro à l'autre.
2. **Rédaction** : un bloc « Vos concurrents » dans les tendances — ce que fait
   chaque concurrent, et ce que ça change pour le site. Ton de conseil, jamais
   de dénigrement.
3. **Garde-fous** : un concurrent absent du dossier ne peut pas être nommé
   (numéro refusé) ; leurs sites comptent comme sources connues ; une lettre
   muette sur des concurrents identifiés est signalée à la relecture.

## ADR-028 — 2026-09-27 — Le premier bouton de chaque héros : l'échange gratuit

Demande d'Agathe du 2026-09-27. Dans tous les héros, le premier bouton (plein)
est l'échange gratuit de 15 minutes sur Calendly (`CTA_ECHANGE` dans
`lib/visio-conseil.ts`, libellé « Échange gratuit de 15 min », nouvel onglet).
Amende la charte §7 pour les héros : l'analyse du site (`/scan`) y passe en
second, en filet ; les boutons existants restent, en filet. Les fins de page ne
changent pas (froid principal, chaud secondaire).

Pages concernées : accueil, `/solutions-web`, `/maintenance-wordpress`,
`/cto-externalise`, `/packs` et chaque pack, `/veille`, `/sentinelle`,
`/wordpress-headless`, `/etudes-de-cas`, `/espace-client`, `/agences`,
`/apporteurs`. `/conseil` avait déjà l'échange en premier. Les pages sans
bouton dans leur héros (contact, tarifs, à propos, études de cas détaillées,
articles, documentation) n'en reçoivent pas.
