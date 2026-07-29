# Directives Claude Code — Évolution du site next-impact.digital (v3.1)

À déposer à la racine du repo next-impact (en `CLAUDE.md`, ou référencé depuis lui).
Source : cadrage v3.1 du 29/07/2026. Ces directives sont la traduction exécutable du cadrage ;
en cas d'ambiguïté, demander à Agathe plutôt qu'interpréter.

## Contexte et thèse (à connaître avant tout code)

Le site pivote vers le rôle « bras droit IA » fondé sur cette thèse, qui gouverne aussi le ton :
**« L'IA ne doit pas décider à votre place. Elle doit rendre vos décisions meilleures — en
éclairant avant, en exécutant après. Entre les deux, il y a vous. »**
Le site existant (Next.js, prod) reste en ligne pendant les travaux : chaque lot est livrable
indépendamment, aucune refonte globale. Objectif directeur : convertir un prospect froid —
le site prouve avant de demander.

## Règles transverses (toutes les PR)

1. **Lexique contraint.** Employer : « diagnostic informationnel », « dispositif de veille »,
   « bras droit IA », « pré-diagnostic express ». Interdits absolus dans tout contenu, meta,
   slug, alt, code visible : « assistante », « reconversion », « pas de spécialité »,
   **« boussole »** (le mot disparaît du site), « Petite Vitrine » (hors page légale/archive privée).
2. **Registre.** Résultats et doctrines, jamais de chantier : aucun contenu ne présente
   Signaux Faibles ou une offre comme « en cours », « bêta », « bientôt ». Les recommandations
   sont des options (« vous pouvez », « je propose »), jamais des injonctions.
3. **Chiffres.** Seules sources autorisées : l'endpoint metrics.json de Signaux Faibles et
   l'étude de cas. Tout autre chiffre dans un contenu = placeholder `{à-fournir}` bloquant la PR.
4. **SEO.** Toute suppression/renommage d'URL ⇒ 301 dans la table du Lot A ; meta et OG mis à
   jour dans la même PR ; sitemap régénéré ; aucun lien interne mort (vérification automatisée).
5. **Prix.** Sur la page du rôle, ne jamais afficher/rappeler 150 € ou tout prix d'entrée du
   site ailleurs que dans le CTA visio ; l'ancre locale est 1 500 €.
6. **Qualité.** Standards existants du repo (lint, typecheck, build) + Lighthouse ≥ 95 ×4 sur
   les pages touchées + accessibilité (focus visible, contrastes AA, reduced-motion).
7. **Décisions.** Tenir un `docs/decisions.md` dans le repo (format ADR court) ; toute
   adaptation prise en autonomie y est consignée. Modifications structurantes (nav, hero,
   suppression de page non listée) : demander d'abord.

## Lot 0 — Reconnaissance (obligatoire avant tout)

Explorer le repo : framework/version, système de contenu (MDX ? CMS ?), routing des pages
citées ci-dessous, composants de cartes/hero existants, gestion des 301 actuelle, analytics.
Produire un rapport court : cartographie des pages réelles vs pages attendues par ces
directives, et signaler tout écart (page absente, slug différent) AVANT le Lot A.
Pages attendues : `/`, `/conseil`, `/solutions-web`, `/etudes-de-cas` (+ étude de cas
petite-vitrine), `/outils`, `/outils/boussole`, `/audit-site-web`, `/avantage-oeth`,
`/a-propos`, `/documentation`, `/apporteurs`, `/agences`, `/contact`.

## Lot A — Vague de dépublication unique (une seule PR, une seule opération SEO)

### A.1 Table des 301 (exhaustive, à compléter au Lot 0 si slugs différents)
| Ancienne URL | Destination | Motif |
|---|---|---|
| /avantage-oeth | /a-propos | retrait AGEFIPH |
| /etudes-de-cas/la-petite-vitrine | /solutions-web | suppression offre |
| /outils/boussole | /outils/selecteur-techno | renommage outil |
| (toute autre URL contenant « boussole » ou « petite-vitrine ») | équivalent le plus proche | purge lexicale |

### A.2 Retraits
- **AGEFIPH** : entrées de menu/footer, badge « TIH −30 % » (hero et bloc final), simulateur
  (retiré des outils), toutes mentions dans les contenus, meta-description et meta-keywords,
  FAQ. Une ligne factuelle TIH peut subsister sur /a-propos (texte fourni par Agathe).
- **La Petite Vitrine** : section home complète (vidéo incluse), page d'offre, étude de cas,
  entrées de nav/footer, mentions dans les autres pages, images orphelines. Les 10 clients
  pilotes : aucun impact code (gestion privée hors site).
- **« Boussole »** : renommer l'outil en **« Sélecteur techno web & IA »** (page, nav, hero,
  FAQ « Qu'est-ce que la Boussole… » réécrite, meta-keywords purgés). Renommer le
  « Diagnostic 2 min » en **« Pré-diagnostic express (2 min) »** partout (nav, footer, CTA).
### A.3 Acceptation
Grep du build : zéro occurrence de « boussole », « Petite Vitrine », « AGEFIPH », « OETH »,
« TIH » (hors /a-propos et pages légales) dans le HTML rendu ; 301 testés (script) ; sitemap
sans les URLs supprimées ; Search Console : anciennes URLs soumises en changement d'adresse.

## Lot B — Étude de cas « Un agent de veille en production »

Nouvelle page sous /etudes-de-cas. Structure imposée (ton : rapport d'exploitation, pas
témoignage) : contexte L'Hermitage → problème → architecture (schéma simple, composant ou SVG)
→ doctrine (traçabilité, silence assumé, fait vs hypothèse) → **résultats chiffrés** (≥ 6
métriques réelles : éditions livrées, coût moyen par brief, temps de relecture… fournies par
Agathe — placeholders bloquants sinon) → « ce que ça donnerait chez vous » (CTA pré-diagnostic
et visio). JSON-LD Article. C'est la page la plus maillée du site à terme : prévoir les ancres.
**Acceptation** : page publiée avec chiffres réels, Lighthouse ok, liée depuis /etudes-de-cas.

## Lot C — Page du rôle /bras-droit-ia + vente du diagnostic

### C.1 Contenus (verbatim, ne pas réécrire)
- **H1** : « L'IA qui éclaire vos décisions. Pas celle qui les prend. »
- **Sous-titre** : « Je conçois les dispositifs qui vous informent avant de décider, et les
  agents qui exécutent après — sous votre contrôle, avec des règles publiées. Vous restez le
  seul à trancher. »
- **Bloc preuve** (sous le hero) : métriques vivantes consommées depuis metrics.json de
  signauxfaibles.io ({n} briefs livrés · {x} € le coût moyen d'un brief · lien « doctrine
  publiée ») — fetch côté serveur, revalidation 24 h, fallback gracieux si l'endpoint est
  indisponible (masquer le bloc, ne jamais afficher d'erreur ni de zéros).
- **Le triptyque** (structure de la page, l'humain au centre) :
  1. **Éclairer** — Diagnostic informationnel · 1 500 € HT · 10 jours (achat en ligne) ;
     Veille intégrée · setup 2 500–6 000 € + 350–600 €/mois.
  2. **Décider** *(badge « recommandé », visuellement central)* — Accompagnement bras droit :
     Cap 490 €/mois · Renfort 1 290 €/mois — « quelqu'un qui prépare vos options, jamais ne
     tranche pour vous ».
  3. **Exécuter** — Agents & outils métiers · forfait 5 000–20 000 € ; encadré « Pourquoi une
     développeuse pour vos agents » : testés comme du logiciel · intégrés à votre SI, pas à
     côté · votre code, vos prompts, réversibles · coûts mesurés et publiés.
- **CTA** : froid = « Réserver une visio conseil — 150 € » (lien existant) ; direct =
  « Commander un diagnostic informationnel — 1 500 € » (Stripe Checkout, produit one-shot,
  email de confirmation avec questionnaire de cadrage — contenu du questionnaire fourni par
  Agathe, placeholder bloquant).
- **FAQ** (5 entrées, écriture réponse-directe) : différence abonnement veille / intégration
  sur mesure · travail avec l'intranet existant (SharePoint, Teams, Notion) · le diagnostic
  est-il déduit de la suite (oui, sous 60 jours) · garanties sur les données et la
  réversibilité · faites-vous toujours du web (oui — les agents s'intègrent dans l'existant).
### C.2 Intégrations home et maillage
Carte « Bras droit IA » ajoutée sur la home au rang des cartes existantes (SANS renommer les
autres — Lot D) ; lien depuis /conseil (« votre besoin est récurrent ? ») et depuis l'étude
de cas du Lot B. JSON-LD `Service` ×3 + `FAQPage`.
### C.3 Acceptation
Achat test Stripe de bout en bout ; bloc preuve alimenté par le vrai endpoint ; règle des prix
(§transverse 5) respectée ; e2e du parcours visio et du parcours achat.

## Lot D — Unification (NE PAS COMMENCER sans feu vert explicite d'Agathe, conditionné aux
données du Lot C : ≥ 10 visios ou 1 diagnostic vendu sous 30 jours)

- Hero général du site : promesse de tête « L'IA qui éclaire vos décisions » (déclinaison
  exacte fournie par Agathe au moment du feu vert).
- Renommage des cartes home sur le triptyque Éclairer / Décider / Exécuter (les prestations
  web historiques rangées sous Exécuter).
- Page À-propos réécrite selon l'ordre de convergence : 1) le geste (« transformer
  l'information en décisions, et les décisions en systèmes ») ; 2) la preuve d'abord (Signaux
  Faibles, chiffres, doctrine) ; 3) le parcours comme convergence (master VTI → 15 ans
  d'éditorial web → 6 ans de développement → « les agents IA sont l'endroit exact où ces trois
  vies se rejoignent ») ; 4) la thèse ; 5) photo, disponibilité, CTA visio.
- Deux ressources de référence dans /documentation (contenus rédigés par Agathe, intégration
  et JSON-LD Article par Claude Code) : « Agents IA en entreprise : ce qui tient en
  production » et « La doctrine éditoriale d'un agent fiable ».
- Bandeau « Nous avons construit Signaux Faibles » : uniquement au lancement public du produit.

## Ce qui reste à la main d'Agathe (bloquants identifiés)
Chiffres réels de l'étude de cas (Lot B) · texte de la ligne TIH sur /a-propos (Lot A) ·
compte/produit Stripe et questionnaire de cadrage (Lot C) · déclinaison du hero et contenus
des 2 ressources (Lot D) · feu vert du Lot D · photo et disponibilité (À-propos).
