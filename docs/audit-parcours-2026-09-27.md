# Audit du parcours · contenus anciens et cohérence des trois moments

2026-09-27, branche `offres-trois-moments` (après 0acc5dc). Référentiel : charte
v1.4. Relevé fait dans le code (pas sur la production). Propositions et plan en
fin de document.

## 1. Diagnostic express

1. **Il existe quatre diagnostics froids au lieu d'un seul.** Le visiteur
   rencontre, selon la page, le quiz `/outils/reparer-ou-refaire` (bouton
   principal du héros de la home), le questionnaire `/solutions-web/eligibilite`
   (« Lancer le diagnostic », « Choisir cette stack »), un « audit gratuit sur
   rendez-vous » (26 fichiers vers `/audit-site-web`) et `/scan`. Le libellé
   fixe « Analysez votre site en 2 minutes » n'apparaît sur aucune page des
   moments Décider et Refaire.
2. **La promesse affichée n'est pas tenue.** « Réservez un audit gratuit », « en
   direct avec Agathe », « sur rendez-vous » mènent à `/scan`, qui est
   automatique. Un prospect froid qui vérifie constate l'écart dès le premier
   clic.
3. **Le rendez-vous passe par quatre outils** : `/contact`, Calendly, et deux
   agendas Google. Le bouton flottant, présent sur toutes les pages, propose en
   plus un « appel de 15 min » gratuit qui n'existe pas au catalogue.
4. **Les chiffres se contredisent** : 15 ans WordPress + 6 ans de développement,
   ou « 20 ans d'expérience » ; 22, 25, 26 ou 28 projets ; réponse sous 24 h ou
   sous 48 h ; délai de 6 à 10 semaines, ou 2-4 / 4-6 / 6-10 selon la page ;
   support de 30 jours, de 12 mois ou 3 mois de suivi inclus, parfois sur la
   même page (`/solutions-web`).
5. **Le moment Tenir est mal raccordé.** Sa page d'atterrissage est en noindex
   alors que ses prix non validés sont affichés sur trois pages indexées.
   `/conseil` dit que l'Expert technique externalisé est « la seule offre
   récurrente ». `/wordpress-headless` ne dit pas que le suivi Actif est
   obligatoire en headless. `/sentinelle` n'a pas de h1 et ne renvoie pas vers
   la maintenance.

## 2. Relevé par page (pages d'offre)

| Page | Écarts principaux |
|---|---|
| `/` | h1 « Experte des projets web » (ni douleur ni bénéfice). Onglets du héros Veille / Conseil / Refonte : l'ancien triptyque, sans Tenir, qui fait doublon avec la section des trois moments et place la visio (avec ses prix) dans le héros. Bouton principal vers le quiz. Bandeau de logos techno et IA en 2e position au lieu du bandeau de preuves (`ProofStrip` existe, il n'est utilisé que sur `/wordpress-headless`). Étude mise en avant : Réseauteurs au lieu de Proditec 45 → 98. Pas de bloc AGEFIPH, pas de CTA final (la page finit sur la FAQ). « En bref » et FAQ : prix en dur et « audit de site gratuit, sur rendez-vous ». Bloc diagnostic : « Qu'est-ce qui ralentit votre site ? » vers `/solutions-web/eligibilite`. |
| `/conseil` | h1 « Conseillé avant de s'engager. » (cible : « Un avis tranché avant d'engager un budget »). La 3e case est l'Expert technique externalisé, pas la veille. « La seule offre récurrente » est faux. Ancres `#choix-techno-ia` et `#architecture-projet-ia` (anciens noms IA, visibles dans toutes les URL du menu). Réservation Calendly directe (slugs d'anciens noms). Pas de paire de CTA en fin de page. Prix en dur dans le héros et la FAQ. |
| `/solutions-web` | h1 « Solutions pour une refonte ». Forfaits nommés Vitrine simple / Site complexe / Plateforme et app au lieu de Consolider / Découpler / Refonder. « Construire sur le besoin », « Choisir cette stack ». Héros vers `/solutions-web/eligibilite`. Carte web app vers un agenda Google. `home-perf` : « Réservez un audit gratuit ». FAQ 2-4 / 4-6 / 6-10 semaines. Support 30 jours (process) et 12 mois (carte) contre 3 mois inclus. Pas de paire de CTA finale. |
| `/cto-externalise` | h1 FR sans douleur (l'EN la porte). CTA chaud « Cadrer un accompagnement », froid « Réserver mon audit gratuit ». 650 € et « trois semaines » en dur. Aucun renvoi vers le moment Tenir. |
| `/wordpress-headless` | h1 « WordPress Headless avec Next.js » (techno en titre). « Diagnostic Web & IA en direct avec Agathe, gratuit » vers `/audit-site-web`. Prix et délais contradictoires (4 000 € en 4-6 semaines, web app « 6 500 € à 15 000 €+ »). Ne mentionne pas le suivi Actif obligatoire. |
| `/a-propos` | h1 « À propos ». Aucun CTA : le bloc `ctaFinal` existe dans les messages mais n'est rendu nulle part. « 20 ans » répété, « Un sélecteur web & IA ». |
| `/contact` | Sept sujets (cinq prévus), prix en dur, « Diagnostic gratuit de mon site » manuel en concurrence avec `/scan`, pas de sujet Sentinelle. « Sous 24 h » contre « sous 48 h » ailleurs. |
| `/etudes-de-cas` | « Réserver mon audit gratuit », rendez-vous vers un agenda Google, « la visio Sélecteur ». Fiches : CTA chaud « Mettre en place votre agent IA » (offre IA supprimée). Proditec absent de la sélection. |
| `/tarifs` | Conforme (tous les prix lus dans leurs sources). Réserve : paliers de maintenance non validés affichés sur une page indexée. |
| `/maintenance-wordpress` | Conforme sur les CTA. 89 € en dur dans la méta et le JSON-LD. Noindex. |
| `/sentinelle` | Pas de h1 (héros en h2). 19 € en dur. Mentionne la maintenance sans lien. « Poser une question » au lieu du libellé chaud. |
| `/espace-client` | Conforme, sauf l'ancre `#architecture-projet-ia`. |

## 3. Relevé transverse

- **Header et mobile** : tiroir « Prendre rendez-vous » vers Calendly.
- **Bouton flottant** (toutes les pages) : « Réserver un appel de 15 min » vers
  un agenda Google, tiret cadratin dans le sous-titre.
- **Footer** : aucun lien vers `/scan`, commentaire faux sur la redirection.
- **Pas de page 404** : la 404 par défaut de Next, sans navigation.
- **Menu** : les badges recopient 150, 650, 2 250, 4 000 et 6 500 € (le
  commentaire du fichier dit l'inverse).
- **Documentation (environ 72 articles)** : l'encadré « Pour aller plus loin »
  propose « Audit IA », « Nos offres », « Nos offres SEO » (offre inexistante) ;
  le hub propose « Lancer le Sélecteur » en CTA principal ; le preset
  `AUDIT_GRATUIT` de `lib/hub-themes.ts` est répété sur 7 pages ; 10 articles
  web app disent « Lancez le diagnostic » vers `/contact` ; plusieurs mdx
  pointent vers un agenda Google.
- **Blog** : aucun encadré de fin (la charte en demande un) ; 4 billets sans
  aucune sortie.
- **Outils** : « Réparer mon site », « Optimiser mon site » vers `/contact`
  (réminiscence de l'offre Dépannage supprimée), « Sélecteur » partout, prix en
  dur dans une dizaine d'outils. `/outils` finit sans renvoi vers un moment.
- **/veille** : « Sentinelle, 19 € » affiché (la charte veut la veille sans
  prix) ; `/scan` passé par le `Link` i18n, qui produit `/en/scan` en anglais,
  soit une 404.
- **/articles** : index vide (`content/articles` n'existe pas) mais présent au
  sitemap ; deux articles AGEFIPH en français toujours indexés.
- **Divers** : `app/vous-etes/page.tsx` hors `[locale]` pointe vers trois pages
  inexistantes ; formulaires `/agences` et `/apporteurs` en `mailto:`,
  probablement bloqués par la CSP `form-action 'self'`, à vérifier.
- **Code mort portant l'ancien discours** : une quarantaine de composants non
  importés (`home-cta`, `services-old/*`, `gemini/*`, `benchmarking`,
  simulateurs…), `lib/audit-page-content.ts` et la page `audit-site-web`
  court-circuitée par la redirection, les variantes non `default` de
  `lib/homepage-profiles.ts`, une dizaine de namespaces morts dans
  `messages/*.json`. Ce code ne s'affiche pas, mais c'est lui qu'on recopie
  quand on cherche un texte existant.
- **Tirets cadratins** : environ 116 dans `lib/case-studies-data.ts`, 63 dans
  `lib/hub-themes.ts`, 25 dans `messages/fr.json`, 22 sur `/veille`, environ 900
  dans `content/documentation` et 67 dans `content/blog`.

## 4. Propositions

### A. Lisibilité : une porte froide, une porte chaude, partout les mêmes

1. **`/scan` devient la seule porte froide.** Tous les « audit gratuit », « Diagnostic
   Web & IA », « Lancer le diagnostic », « Réparer ou refaire ? Faites le test »
   pointent vers `/scan` avec le libellé fixe. Les quiz (`reparer-ou-refaire`,
   sélecteur, `eligibilite`) restent des outils rangés dans Décider, jamais un
   bouton d'appel à l'action.
2. **Un seul composant de fin de page** (`CtaPaire` : froid `/scan` en principal,
   chaud « Discutons de votre projet » vers `/contact` en secondaire), avec un
   `<a>` simple pour `/scan` (évite `/en/scan`). Posé en fin de home, de
   `/conseil`, de `/solutions-web`, de `/cto-externalise`, de `/a-propos`,
   `/wordpress-headless`, `/etudes-de-cas` et sur la future 404.
3. **Un seul canal de rendez-vous** : `/contact`. Calendly ne sert plus qu'au
   paiement de la visio et de l'audit, depuis `/conseil`. Les agendas Google
   disparaissent du site. Le bouton flottant propose `/scan` et `/contact`, sans
   appel de 15 min.
4. **Home remise dans l'ordre de la charte** : héros douleur/bénéfice (une des
   quatre variantes du §6, adaptée au libellé `/scan`), sans onglets (la
   section des trois moments fait déjà ce travail, les onglets la doublent) ;
   `ProofStrip` à la place du bandeau de logos ; Proditec en étude mise en
   avant ; bloc AGEFIPH court ; `CtaPaire` en fin de page ; « En bref » réécrit
   sur les trois moments.
5. **Une page 404** qui propose les trois moments et `/scan`.

### B. Groupement : chaque page sait dans quel moment elle se trouve

1. **Un repère de moment** en tête de chaque page d'offre (kicker « Décider »,
   « Refaire » ou « Tenir », lien vers la page d'atterrissage) et **un pont vers
   le moment suivant** en fin de page (`MomentSuivant`) : Décider mène à Refaire,
   Refaire à Tenir (le `TenirBanner` existant), Tenir revient à Décider pour
   l'Expert technique externalisé. Le visiteur n'a jamais de cul-de-sac.
2. **`/solutions-web` parle en trajectoires** : forfaits renommés Consolider /
   Découpler / Refonder (techno en sous-titre), h1 de la charte, « Construire »
   et « Choisir cette stack » retirés, délais et suivi inclus lus dans la source.
3. **`/conseil` aligné sur le menu** : voir la décision 1 ci-dessous ; la veille
   gratuite en 3e case ; ancres renommées (`#visio`, `#audit`) ; la phrase « la
   seule offre récurrente » corrigée.
4. **Tenir raccordé** : `/wordpress-headless` annonce le suivi Actif inclus dans
   le coût réel du headless ; `/sentinelle` reçoit un h1 et un lien vers la
   maintenance ; `/cto-externalise` reçoit le pont Tenir.
5. **Une seule sortie éditoriale** pour la documentation, le blog et la veille :
   l'encadré de la charte (« Votre site est concerné ? Analysez-le en 2
   minutes »), qui remplace « Pour aller plus loin / Audit IA / Nos offres » et
   le preset `AUDIT_GRATUIT`.

### C. Cohérence : une source par fait, pas seulement par prix

1. **`lib/chiffres.ts`** : années (WordPress, développement), projets livrés,
   délai de réponse, délai d'un projet par trajectoire. Toutes les pages lisent
   ce fichier, comme les prix.
2. **Les prix recopiés passent par leur source** : menu, héros, bannières, FAQ,
   sujets du formulaire, méta et JSON-LD de Sentinelle et de la maintenance.
   Petit utilitaire de formatage par offre pour que ce soit plus simple que de
   recopier.
3. **Purge du vocabulaire** : sélecteur, Web & IA, nos offres, agent IA, pack
   IA, « Réparer mon site », « Construire ».
4. **Purge du code mort** (composants, `lib/audit-page-content.ts`, page
   `audit-site-web`, variantes et namespaces non lus). Sans effet visible, elle
   supprime la source des régressions.
5. **Passe typographique** des tirets cadratins : pages vivantes et données
   d'abord (`case-studies-data`, `hub-themes`, `messages`, `/veille`), la
   documentation ensuite par lot.
6. **Nettoyage d'index** : `/articles` retiré du sitemap ou supprimé, articles
   AGEFIPH à arbitrer, `app/vous-etes` supprimé.

## 5. Décisions à prendre par Agathe

1. **Expert technique externalisé** : le menu et `/tarifs` le rangent dans Tenir,
   `/conseil` (charte §6) le présente dans Décider. Proposition : Tenir
   seulement ; `/conseil` garde une ligne de renvoi. Amendement de charte §6.
2. **Chiffres de référence** : années de développement (6 ou 8 ?), « 20 ans
   d'expérience » gardé ou non, nombre de projets, délai de réponse (24 h ou
   48 h).
3. **Délais** : « 6 à 10 semaines » pour tout, ou un délai par trajectoire
   (proposition : par trajectoire, lu dans `getTiers`, et « de 3 à 10 semaines
   selon la trajectoire » en résumé).
4. **Suivi après livraison** : 3 mois inclus remplace « 30 jours » et « 12 mois
   de support prioritaire » ? (Proposition : oui.)
5. **Prix de la maintenance** : les valider (la page sort du noindex), ou
   masquer les paliers sur les pages indexées en attendant.
6. **Bouton flottant** : le garder avec `/scan` et `/contact`, ou le retirer.
7. **Articles AGEFIPH** : les garder indexés en fin de parcours, ou les retirer.

## 6. Plan en lots

Si trois lots seulement :
1. **Porte froide unique** (A1 à A3) : `/scan` partout, `CtaPaire`, un seul canal
   de rendez-vous. Surtout du remplacement de liens et de libellés. Impact
   maximal : c'est ce que le prospect clique.
2. **Home** (A4, A5) : héros, preuve, étude mise en avant, CTA final, 404.
3. **Trajectoires et moments** (B1 à B4) : `/solutions-web`, `/conseil`, ponts
   entre moments, Tenir raccordé.

Ensuite : C1 et C2 (sources de chiffres et de prix, après les décisions 2 à 4),
B5 (sortie éditoriale de la documentation), C4 (code mort), C5 (typographie),
C6 (index). Puis l'agent `coherence-seo-geo` et un build à la fin de chaque lot.

## 7. Garde-fous

- Ne pas couper la preuve pour alléger : on range l'explicatif, on garde les
  chiffres et les cas.
- Ne pas remettre la visio, l'AGEFIPH ni un abonnement dans le héros.
- Ne pas afficher plus de trois choix par moment hors `/tarifs`.
- Ne pas supprimer les outils : ils changent de rôle (ressources de Décider),
  ils ne disparaissent pas.
- Ne pas traduire en anglais avant que le français soit figé.
