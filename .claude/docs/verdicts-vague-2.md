# Verdicts vague 2 — mode 1 (A4, A6, A7, F1)

Rendu par verificateur-coherence le 2026-07-18. Branche `posit-conseil`.
Sources lues : `quelle-techno-ia.md` (intégral), blog
`combien-coute-wordpress-headless-2026-chiffre.mdx`, doc
`combien-coute-une-web-app-sur-mesure.mdx`, entrées `ia-et-code` et `reparer`
de `lib/hub-themes.ts`, outils `prototype-ia` et `reparer-ou-refaire`,
recherche live. Non vérifié : Search Console.

## A4 — « Site IA vs site pro » : CRÉER (absorbe A6)

- La friction avec `quelle-techno-ia` est réelle (chapô + § AI-build) mais le
  pilier est optimisé « quelle techno choisir » et ne contient aucun tableau
  comparatif IA vs pro. Intention comparative distincte, non couverte.
- **Intention** : « un site généré par IA (ChatGPT, v0, Lovable, Bolt, builders
  Wix/Hostinger/Framer) vaut-il un site fait par un professionnel — et pour qui
  la réponse est oui/non ? »
- **Requêtes** : « site généré par IA vs professionnel », « créer son site avec
  ChatGPT avis », « site fait par IA fiable ? », « IA peut-elle remplacer un
  développeur web », « v0 / Lovable site professionnel ».
- **Accueil** : `content/documentation/ia-et-code/` (dossier à créer —
  prérequis infra).
- **Maillage** : rubrique ia-et-code · `/outils/prototype-ia` · `/conseil`
  (150 €) · `quelle-techno-ia` (complémentaire) · A7 · `/documentation/etre-trouve`.
- **Ne pas couvrir** : framing 3 voies + 5 critères (propriété du pilier) ;
  fourchettes budgétaires détaillées (→ F1) ; reprise de site IA (→ A7) ;
  mécanique citations (→ etre-trouve). **Interdit** : reprendre verbatim la
  FAQ « Une IA peut-elle vraiment créer mon site pour 20 €/mois ? » (déjà dans
  le FAQPage JSON-LD du pilier).
- **Modif induite** : lien `quelle-techno-ia` § AI-build → A4.
- Section « Quand l'IA suffit / quand c'est un piège » intégrée (ex-A6) avec
  verdicts par cas d'usage (vitrine locale, e-commerce, MVP, asso, PME B2B) et
  CTA `prototype-ia`.

## A6 — RENONCER (fusion dans A4)

Intention indistinguable d'A4 ; déjà traitée 3× (`quelle-techno-ia` l.51,
rubrique ia-et-code, outil `prototype-ia`). Créer A6 = cannibalisation
garantie. Écart au mapping → décision Agathe à acter.

## A7 — « Reprendre un site généré par IA » : CRÉER

- Intention vierge : rubrique `reparer` + outil `reparer-ou-refaire` sont
  100 % WordPress, inapplicables à un site v0/Lovable. Personne ne répond à
  « qui peut reprendre mon site IA ».
- **Intention** : « mon site généré par IA pose problème (panne, sécurité,
  évolution impossible, invisible) — réparer, reprendre ou reconstruire, et
  qui peut le faire ? »
- **Requêtes** : « reprendre un site généré par IA », « réparer site Lovable /
  v0 / Bolt », « site fait avec l'IA problème », « développeur pour reprendre
  code généré par IA », « récupérer contenu site IA ».
- **Accueil** : `content/documentation/ia-et-code/` + renvoi visible depuis la
  rubrique `reparer` (modif d'exécution, sans dénaturer son périmètre WP).
- **Maillage** : rubrique ia-et-code · `/outils/prototype-ia` ·
  `/documentation/reparer` (« votre cas est un WordPress ? c'est ici ») ·
  `/audit-site-web` ou `/conseil` · A4 · `quelle-techno-ia` § réversibilité.
- **Ne pas couvrir** : arbitrage réparer/refaire WordPress ; comparatif IA vs
  pro (A4) ; **aucune fourchette chiffrée de coût de reprise** (toute
  fourchette serait nouvelle → arbitrage Agathe). Ne pas prétendre que l'outil
  reparer-ou-refaire s'applique aux sites IA.

## F1 — « Combien coûte un site web en 2026 » : CRÉER (consolidation)

- Les deux contenus prix existants sont spécialisés (headless / web app) ;
  aucun ne couvre l'intention générique. F1 = page chapeau qui consolide et
  renvoie, sans dupliquer leurs tableaux.
- **Intention** : « combien coûte un site web en 2026, fourchettes par type
  (vitrine, WordPress, headless, no-code/builder IA, web app) et coût 3 ans ».
- **Requêtes** : « combien coûte un site web 2026 », « prix site internet
  professionnel », « tarif création site web PME », « prix site vitrine
  2026 », « coût site web par an ».
- **Accueil** : `content/documentation/choisir/`.
- **Maillage** : rubrique choisir · blog headless chiffré + doc web app
  (approfondissements) · `/outils/boussole` ou `/outils/decrypteur-devis` ·
  `/conseil` (150/490) · `quelle-techno-ia`.
- **Ne pas couvrir** : décomposition jours-homme headless ; 5 postes de coût
  web app ; le choix de techno. Ne pas reprendre verbatim la FAQ « Quel budget
  prévoir pour un site professionnel en 2026 ? » (FAQPage du pilier).

### Fourchettes DÉJÀ publiées (réutilisables à l'identique, sans arbitrage)

| Source | Fourchettes |
|---|---|
| `quelle-techno-ia.md` l.77/121 | no-code : quelques centaines à 2 000 €/an · WordPress professionnel : 3 000–10 000 € · sur-mesure : 8 000–25 000 €+ · builder IA ≈ 20-25 €/mois |
| Blog headless l.13-129 | headless : 2 250 / 4 000 / 6 500 €+ · exploitation 510–1 355 €/an · TCO 3 ans 5 500–8 000 € (WP classique 4 500–6 500 €) · WP thème classique 1 500–3 000 € (200–500 €/an) · Webflow 3 000–8 000 € (600–1 800 €/an) · web app 10 000 €+ |
| Doc web app l.88-121, 173 | web app simple 12–25 k€ · moyenne 25–50 k€ · complexe 50–150 k€ · PWA standalone 8–30 k€ · TJM 350–650 € |
| Contexte (acté) | conseil 150 € / architecture 490 € |

Tension à expliciter (pas à réconcilier en inventant) : « WordPress pro
3 000–10 000 € » (pilier) vs « WP classique 1 500–3 000 € » + « headless
2 250–6 500 € » (blog) — périmètres différents, clé de lecture à donner.

### Fourchettes NOUVELLES = arbitrage Agathe AVANT rédaction

E-commerce (rien de publié) · vitrine freelance vs agence (si ce découpage
est voulu) · coût de reprise d'un site IA · toute modification d'une borne
déjà publiée.

## Décisions Agathe (bloquantes)

1. Fusion A6 → A4 (écart au mapping).
2. **Incohérence AGEFIPH publiée** : blog headless l.97 « 50 % du montant
   HT … limite 75 % de la contribution » vs doc web app l.125 « 30 % du coût
   main-d'œuvre ». Deux règles contradictoires en ligne. F1 n'en reprend
   aucune tant que non arbitré ; l'article fautif devra être corrigé.
3. Fourchettes nouvelles F1 : go/no-go chiffre par chiffre.

## Prérequis infra (architecte-fusion, avant publication A4/A7)

`content/documentation/ia-et-code/` inexistant ; `categoryLabels` (l.33) et
`RELATED_CATEGORIES` (l.133) de `[category]/[slug]/page.tsx` ne connaissent
que `etre-trouve` ; `reading` de l'entrée `ia-et-code` de `hub-themes.ts` à
câbler. Reproduire le précédent vague 1 (`etre-trouve`), sitemap compris.

## Slugs convenus (orchestrateur)

- A4 : `site-genere-par-ia-vs-site-professionnel`
- A7 : `reprendre-un-site-genere-par-ia`
- F1 : `combien-coute-un-site-web-en-2026`
