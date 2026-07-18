# Verdicts vague 4 — mode 1 (F3, B0, B4)

Rendu par verificateur-coherence le 2026-07-18. Branche `posit-conseil`.
F3 CRÉER · B4 CRÉER · B0 CRÉER recentré (arbitrage Agathe requis).
Non vérifié : Search Console.

## Slugs et ordres convenus

- F3 : `content/documentation/avant-signer/12-questions-ia-a-poser-a-votre-prestataire.mdx` (`order: 1`, nouveau dossier)
- B0 : `content/documentation/ia-et-code/ce-que-l-ia-change-dans-la-creation-d-un-site-web.mdx` (`order: 3`, sous réserve d'arbitrage)
- B4 : `content/documentation/ia-et-code/dette-technique-du-code-genere-par-ia.mdx` (`order: 4`)

## F3 — « Les 12 questions IA à poser à votre prestataire » : CRÉER

Frictions toutes levées : rubrique avant-signer 100 % générique (zéro IA, pas
de bloc reading — seule rubrique sans « À lire ») ; décrypteur-devis = 9
facteurs santé du devis, aucun IA ; A4 = questions à SE poser ; A7 = ce que le
pro vérifie chez vous ; F1 = 5 questions budget génériques.

- **Intention** : « quelles questions poser à une agence/un freelance sur son
  usage de l'IA avant de signer — et quelles réponses sont acceptables ».
  Valeur = pour chaque question : bonne réponse attendue + signal d'alarme.
- **Requêtes** : « questions à poser à une agence web sur l'IA », « mon agence
  web utilise l'IA que vérifier », « devis site web fait avec IA »,
  « prestataire web ChatGPT transparence ».
- **Structure** : 12 questions en H3 sous 3-4 H2 (production du code,
  propriété/réversibilité, contenu, maintenance/responsabilité). FAQ balisée
  DISTINCTE des 12 (méta-questions : « faut-il fuir un prestataire qui utilise
  l'IA ? », « un devis moins cher grâce à l'IA est-il suspect ? »). Exactement
  12 — si le compte naturel diffère, changer le titre, pas gonfler.
- **Maillage** : rubrique avant-signer (parent + nouveau reading) ·
  `/outils/decrypteur-devis` · `/conseil` (150 €) · F1 · A4 · B4 (même vague).
- **Ne pas couvrir** : questions budget/périmètre (F1 + décrypteur) ;
  comparatif IA vs pro et responsabilité (A4, une phrase + lien) ; mécanismes
  de la dette (B4 — F3 pose « comment relisez-vous le code généré ? », B4
  explique pourquoi) ; reprise (A7) ; fond du contenu IA (cluster D) ; ne pas
  reproduire les 9 points du décrypteur.

## B0 — « Ce que l'IA change dans la création d'un site web » : CRÉER recentré

Le panorama-stack du mapping = RENONCER (aspirerait la rubrique ia-et-code, le
pilier, A4 et pré-consommerait B1-B6 ; « stack » n'intéresse pas un DIRCOM).
Intention voisine réelle et non couverte : le décideur qui se demande « les
sites coûtent-ils moins cher ? les délais ont-ils fondu ? que fait vraiment
mon prestataire avec l'IA ? qu'est-ce qui ne change pas ? ».

- **Rôle** : article-chapeau du cluster B (comme F1 pour les prix) — chaque
  dimension = un H2 avec verdict, renvois vers B1/B2/B5/B6 à mesure de leur
  existence.
- **Requêtes** : « l'IA va-t-elle remplacer les agences web », « l'IA
  rend-elle les sites web moins chers », « impact de l'IA sur la création de
  sites web 2026 ». INTERDIT : « l'IA peut-elle remplacer un développeur
  web » (H2 d'A4).
- **Titre sans « stack »** (doctrine) : « Ce que l'IA change (vraiment) dans
  la création d'un site web en 2026 ».
- **Maillage** : rubrique ia-et-code (parent + reading) · A4 · B4 · pilier ·
  `/outils/boussole` ou `prototype-ia` · `/conseil` · rubrique etre-trouve.
- **Ne pas couvrir** : cadre jetable/à cadrer/maintenable (rubrique) ;
  comparatif + verdicts + responsabilité (A4, 1-2 phrases) ; 3 voies + 5
  critères (pilier) ; dette (B4, 2-3 phrases + lien) ; AI search (un
  paragraphe + liens, pas les chiffres du blog) ; chatbots/RAG en profondeur
  (cluster E, survol + renvoi outils-metier) ; sécurité code IA (B6/A4).
- **Arbitrages Agathe** : ① recentrage décideur (sinon RENONCER) ; ② B0
  recentré absorbe la part décideur de B2 « dev assisté par IA » → B2 ne sera
  pas créé sans verdict mode 1, présomption de fusion dans B0.

## B4 — « La dette technique du code généré par IA » : CRÉER

Intention vierge (grep « dette technique » : 6 occurrences, toutes hors IA).
Frontière avec A7 nette : A7 = curatif, propriétaire d'un site généré cassé ;
B4 = préventif, commanditaire d'un développement assisté par IA.

- **Intention** : « le code IA crée-t-il de la dette ; par quels mécanismes
  (duplication, dépendances, absence d'architecture/tests, code non relu,
  régénérations) ; comment la limiter (relecture, tests, conventions,
  architecture avant génération) ».
- **Requêtes** : « dette technique code IA », « qualité du code généré par
  IA », « code généré par IA maintenable ? », « risques développement assisté
  par IA ».
- **Sources primaires attendues** : GitClear (duplication/churn), Google DORA
  (stabilité de livraison). Ne pas refaire Stanford (A4 le possède, angle
  sécurité).
- **Maillage** : rubrique ia-et-code (parent + reading) · A7 (« si le mal est
  fait ») · A4 · F3 (même vague) · `/outils/prototype-ia` · `/conseil`
  (150/490).
- **Ne pas couvrir** : récupérabilité/3 issues (A7) ; comparatif/responsabilité
  (A4) ; liste des questions (F3 — B4 justifie pourquoi les poser) ; sécurité
  en profondeur (B6, un paragraphe + lien A4) ; arbitrage jetable/maintenable
  (rubrique + prototype-ia) ; AUCUNE fourchette chiffrée de coût.

## Frontière interne de la vague (rédactions parallèles)

| Sujet | F3 | B0 | B4 |
|---|---|---|---|
| Questions au prestataire | **Possède (les 12)** | 1 phrase + lien | 1 phrase + lien |
| Panorama délais/prix/pratiques | 2-3 phrases | **Possède** | — |
| Mécanismes dette / garde-fous | 1 question + lien | 1 section courte + lien | **Possède** |
| IA vs pro, responsabilité | lien A4 | lien A4 | lien A4 |
| Reprise site IA cassé | lien A7 | lien A7 | lien A7 |

## Prérequis infra (architecte-fusion)

1. `content/documentation/avant-signer/` + `categoryLabels` (« Avant de
   signer ») + `RELATED_CATEGORIES` (`choisir`, `ia-et-code`,
   `projet-site-web`) dans `[category]/[slug]/page.tsx`.
2. `app/llms.txt/route.ts` (+ llms-full) : label `avant-signer`.
3. `lib/hub-themes.ts` : bloc `reading` pour avantSigner (F3) ; extension du
   reading d'iaEtCode (B0 si validé, B4).
4. Sitemap : rien à faire (découverte par dossier, exclusion slugs rubriques
   en place).
5. **Héritage** : `lib/hub-themes.ts:674` — l'outil « Simulateur de tarifs »
   de la rubrique avant-signer pointe `/tarifs` (301 → `/solutions-web`) : à
   corriger au passage.
6. Rappels : `faq` + `updated` + `order`, 150/490, AGEFIPH nulle part, aucune
   fourchette nouvelle.
