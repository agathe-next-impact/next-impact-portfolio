# Plan de mise en œuvre — Sentinelle dans next-impact-portfolio

Établi après lecture du pack (`CLAUDE.md`, `specs/`, `prompts/phases.md`) et
confrontation au repo réel. Le pack décrit le **quoi** ; ce document décrit le
**comment dans CE repo**, avec les écarts constatés et les décisions à prendre
avant d'écrire la première ligne.

Rien n'a encore été codé. Ce document est le préalable à la phase 1.

---

## 1. État du repo (constaté)

| Point | Réalité |
| --- | --- |
| Next.js | `^16.1.6`, App Router, React 19.2 |
| Routing | tout le site vit dans `app/[locale]/…` (next-intl, `localePrefix: "as-needed"`) |
| Root layout | **il n'y a pas de `app/layout.tsx`** — c'est `app/[locale]/layout.tsx` qui rend `<html>/<body>` |
| Middleware | `proxy.ts` → `createMiddleware(routing)`, matcher qui exclut `api`, `_next`, fichiers SEO et tout ce qui contient un point |
| Alias TS | `@/*` → `./*` (pas de dossier `src/` aujourd'hui) |
| Build | `next build` avec **`typescript.ignoreBuildErrors: true`** + `npm run check:docs` en pré-étape |
| Tests | **aucun runner installé** (pas de vitest, pas de script `test`) |
| Déjà présents | `zod@^3.24`, `resend@^4.5.2` (inutilisé — les mails passent par `nodemailer` + `lib/email-template.ts`) |
| Absents | `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `inngest`, `stripe`, `@anthropic-ai/sdk`, `@react-email/*`, `vitest` |
| En-têtes | `next.config.mjs` applique CSP + HSTS + X-Frame-Options sur `/:path*` (donc aussi sur les futures routes Sentinelle) |
| Git | branche `refonte-etudes-de-cas`, `docs/sentinelle/` non suivi |

---

## 2. Écarts pack ↔ repo (à traiter, pas à découvrir en phase 3)

Sept points où le pack suppose quelque chose que le repo ne fournit pas.

### E1 — Le middleware next-intl va avaler `/scan` (bloquant)

`proxy.ts` matche tout sauf `api|_next|_vercel|…`. Une requête sur `/scan` sera
donc réécrite en `/fr/scan` par next-intl → route inexistante → 404.

**Correctif** : ajouter les préfixes Sentinelle à l'exclusion du matcher.

```ts
matcher: [
  "/((?!api|_next|_vercel|scan|admin|espace|sitemap\\.xml|robots\\.txt|llms\\.txt|manifest\\.webmanifest|favicon\\.ico|.*\\..*).*)",
],
```

C'est une modification d'un fichier vitrine, mais elle ne touche aucune page
marketing et elle est le minimum nécessaire à la coexistence. À faire en phase 1
et à vérifier par un `curl` sur une page FR et une page EN.

### E2 — Deuxième root layout (risque structurel n° 1)

Le site n'a pas de `app/layout.tsx` : `app/[locale]/layout.tsx` fait office de
root layout. `app/(sentinelle)/…` a donc besoin de **son propre root layout**
rendant `<html>/<body>`, ses polices et `globals.css`.

Next.js accepte plusieurs root layouts via groupes de routes, mais la
cohabitation « groupe + segment dynamique `[locale]` » n'est pas la
configuration canonique. **À valider par un spike de 20 minutes en phase 0**
(une page `app/(sentinelle)/scan/page.tsx` + layout minimal + `next build`).

Repli si le build refuse : `app/sentinelle/…` en segment statique nommé (même
isolation de fait, URLs `/sentinelle/scan`, `/sentinelle/admin`), ce qui reste
compatible avec l'extraction future en sous-domaine.

### E3 — `src/sentinelle/` et l'alias `@/*`

Il n'y a pas de `src/`. Avec l'alias actuel, un import donnerait
`@/src/sentinelle/db/schema` — moche et surtout impossible à réécrire d'un coup
lors de l'extraction.

**Correctif** : ajouter dans `tsconfig.json`

```json
"@sentinelle/*": ["./src/sentinelle/*"]
```

Tous les imports internes passent par `@sentinelle/…`. L'extraction future = un
`mv` + une ligne d'alias à changer.

### E4 — `ignoreBuildErrors: true` : le build ne valide rien

Le pack demande du TypeScript strict, mais `next build` ignore les erreurs de
types. Un `schema.ts` cassé passerait le build.

**Correctif** : script `typecheck` (`tsc --noEmit`) + le rendre bloquant pour
Sentinelle (au minimum dans `npm run test:sentinelle`). Ne **pas** basculer
`ignoreBuildErrors` à `false` globalement dans ce chantier : le code vitrine
existant n'a jamais été validé sous cette contrainte, ce serait un chantier à
part entière (à ouvrir séparément si souhaité).

### E5 — Rate limiting IP sans espace de stockage prévu

`specs/scanner.md` exige un rate limit par IP sur `POST /api/sentinelle/scan`,
mais `data-model.md` (déclaré « à implémenter strictement ») ne prévoit aucune
colonne pour ça, et la stack n'a ni Redis ni KV. Un compteur en mémoire est
inopérant en serverless (une instance par lambda).

**Recommandation** : amender le schéma — ajouter `ipHash text` (SHA-256 de
l'IP + sel serveur, jamais l'IP en clair) et `userAgent text` sur `scans`, puis
compter en SQL les scans de la dernière heure pour ce hash. Zéro dépendance,
RGPD-compatible, et ça donne en prime une métrique d'usage du scanner public.

Alternative si on veut une vraie fenêtre glissante : Upstash Redis (offre
gratuite) — mais c'est un service de plus à gérer pour un besoin marginal au
lancement.

### E6 — Le prompt système lu « au runtime » sur Vercel

`prompts/verdict-system-prompt.md` doit être éditable par Agathe sans toucher au
code. Mais un `readFileSync` sur `docs/…` en production échoue : le file tracing
Vercel n'embarque pas ce dossier dans le bundle de la fonction.

**Correctif phase 3** : le fichier source de vérité vit dans
`src/sentinelle/redaction/verdict-system-prompt.md`, lu au démarrage du module
avec `path.join(process.cwd(), …)`, et déclaré dans
`outputFileTracingIncludes` de `next.config.mjs` pour la route Inngest.
Le fichier `docs/sentinelle/prompts/verdict-system-prompt.md` reste la copie de
référence documentaire (ou devient un lien de doc vers le fichier réel).

Évolution possible plus tard (phase 4+) : stocker le prompt en base pour
l'éditer depuis l'admin, avec versionnage — c'est aussi ce qui permettrait de
corréler `generatedText` / `finalText` à une version de prompt.

### E7 — Deux stacks d'e-mail dans le même repo

Le site envoie via `nodemailer` + `lib/email-template.ts` (kit Blueprint) ;
Sentinelle devait envoyer via Resend + React Email sur un sous-domaine dédié.

**Révisé le 2026-08-15 : Resend est abandonné, Sentinelle envoie par SMTP
Google**, comme la vitrine (voir §10, « Envoi d'e-mails par SMTP Google »). Ce
n'est plus le fournisseur qui sépare les deux piles, c'est le transport et les
variables — et cette séparation reste **volontaire et cohérente avec
l'isolation**. À assumer et à écrire dans la doc, sinon une future session
« harmonisera » les deux et cassera l'extraction. Règle inchangée :
`lib/sendMail.ts` ne sert jamais à Sentinelle, `@sentinelle/emails` ne sert
jamais à la vitrine, et aucune variable de l'un ne sert de repli à l'autre.

---

## 3. Décisions à trancher (recommandation par défaut)

| # | Décision | Recommandation |
| --- | --- | --- |
| D1 | Emplacement des routes | `app/(sentinelle)/` si E2 valide, sinon `app/sentinelle/` |
| D2 | Stockage du rate limit | `scans.ipHash` + compte SQL (amendement au data-model, à acter) |
| D3 | Modèle LLM par défaut | `claude-opus-5` via `ANTHROPIC_MODEL` (voir §6) |
| D4 | Import vitrine → Sentinelle | interdit (règle 2, **vérifié par script**) ; Sentinelle → `components/ui/*` autorisé et listé |
| D5 | Branche de travail | partir de `master` après merge de `refonte-etudes-de-cas` ; une branche par phase (`sentinelle/phase-1`, …) |
| D6 | Emplacement du pack | reste dans `docs/sentinelle/` ; ajouter un pointeur dans le `CLAUDE.md` racine pour que chaque session le charge |

Sur D4, le pack interdit l'import vitrine → Sentinelle mais impose de réutiliser
le design system : la dépendance est donc à sens unique. Un petit script
(`scripts/check-sentinelle-isolation.mjs`) qui échoue si un fichier hors
`src/sentinelle/` importe `@sentinelle/` rend la règle mécanique plutôt que
déclarative. Coût : 30 lignes.

---

## 4. Phase 0 — préflight (½ journée, avant tout code métier)

Objectif : lever les deux risques structurels et préparer le terrain. Aucune
logique produit.

1. Spike layout : `app/(sentinelle)/layout.tsx` + `scan/page.tsx` « hello » →
   `next build` vert, `/scan` répond 200, `/` et `/en` inchangées. **Décide D1.**
2. Correctif matcher `proxy.ts` (E1) + vérification FR/EN.
3. Alias `@sentinelle/*` dans `tsconfig.json` (E3).
4. Scripts `package.json` : `typecheck`, `test`, `check:sentinelle`.
5. Installation des dépendances et vérification de compatibilité Next 16 /
   React 19 / Node 26 — surtout `inngest` (à installer et à faire répondre
   avant de construire quoi que ce soit dessus).
6. Comptes à ouvrir en parallèle (côté Agathe, hors code) : Neon, Inngest,
   Stripe en mode test, WPScan. **L'envoi d'e-mails ne demande plus de compte**
   depuis la bascule sur SMTP Google : un mot de passe d'application suffit
   (voir §10).

**Fini quand** : le site build et s'affiche à l'identique, une route Sentinelle
vide répond, `npm run typecheck` et `npm run test` existent et passent.

---

## 5. Phases 1 à 5 (le pack, ajusté au repo)

Je garde l'ordre et les définitions de fini du pack. Les ajouts ci-dessous sont
ce que le repo impose en plus.

### Phase 1 — Fondations (~2 j)

Le prompt du pack, plus :

- `drizzle.config.ts` à la racine, migrations dans `src/sentinelle/db/migrations/`.
- Schéma **conforme à `data-model.md`** + amendement D2 (`ipHash`, `userAgent`
  sur `scans`), documenté en tête de `schema.ts`.
- `db/client.ts` : driver HTTP `@neondatabase/serverless` (compatible
  serverless, pas de pool à gérer).
- `vitest.config.ts` : `environment: "node"`, `include: ["src/sentinelle/**/*.test.ts"]`.
- `matching/versions.ts` **d'abord**, avec les tests avant l'usage : c'est le
  seul module où un bug produit une fausse alerte rouge chez un client.
- `.env.example` : la liste du pack **plus** `INNGEST_EVENT_KEY`,
  `INNGEST_SIGNING_KEY`, `ANTHROPIC_MODEL`, `RESEND_FROM`,
  `SENTINELLE_ADMIN_PASSWORD` (préfixé pour ne pas collider), `SCAN_IP_SALT`.
- Route `app/api/sentinelle/inngest/route.ts` avec `export const runtime = "nodejs"`.

Fini : migration appliquée sur Neon, tests verts, healthcheck Inngest OK
(en local via `npx inngest-cli dev`), site inchangé.

### Phase 2 — Scanner public (~3 j)

Le prompt du pack, plus :

- `runtime = "nodejs"` sur toutes les routes Sentinelle (le scanner fait des
  `fetch` sortants et lit des en-têtes ; l'edge runtime n'apporte rien ici).
- `maxDuration` explicite sur la route Inngest (contrainte plan Vercel).
- Rate limit selon D2, avec message honnête en cas de dépassement.
- Pages : réutilisation de `components/ui/*` uniquement (liste tenue dans
  `src/sentinelle/README.md`), thème clair/sombre repris du DS Blueprint.
- **RGPD** : la capture d'e-mail crée une donnée personnelle. Ajouter une ligne
  dans `/confidentialite` (finalité, durée, base légale) et une mention sous le
  champ. À ne pas repousser en phase 5.
- `/scan` et `/admin/sentinelle` : `noindex` + exclusion de `robots.txt` et du
  sitemap (petite édition des route handlers SEO existants).

Fini : scan de bout en bout sur 2 vrais sites WordPress, rapport affiché, e-mail
en base, aucune régression Lighthouse sur la home.

### Phase 2 bis — dette de la phase 2 (½ j)

Ajoutée à la révision du 2026-08-15 : cinq points laissés ouverts par la phase 2,
détaillés dans `prompts/phases.md`. Deux sont visibles par un client (la note du
rapport qui nie le CMS qu'elle vient d'afficher, `isWordPress` qui nomme une
technologie dans un modèle agnostique), trois engagent juridiquement (module de
rétention vide, `/confidentialite` sans section Sentinelle alors que la capture
d'e-mail est en service, `robots.txt` sans exclusion).

### Phase 3 — Collecteurs agnostiques, matching, rédaction (~4 j)

**C'est la phase qui porte la promesse « toute technologie ».** Le scan est
agnostique depuis la phase 2 ; les trois collecteurs du pack (WPScan, Wordfence,
api.wordpress.org) ne le sont pas. En l'état, un abonné Shopify ou Next.js
paierait 19 €/mois sans jamais rien recevoir — pire que de ne pas le prendre
comme client.

- **Routage par écosystème** : le couple `(type, ecosystem)` d'un `stack_item`
  dit quel collecteur interroger. Un écosystème sans collecteur ne produit rien
  et le journalise ; ce n'est pas une erreur.
- **`endoflife.ts` en premier** : gratuit, sans clé, couvre PHP, Node, nginx,
  Apache, WordPress, Drupal, Laravel, Symfony, Django, Angular, Vue, jQuery. La
  source qui produira le plus d'alertes utiles, et la seule qui serve un client
  dont le site n'a pas de CMS.
- **`osv.ts`** : OSV.dev, gratuit, sans clé, vulnérabilités par écosystème de
  paquets (npm, Packagist, PyPI), là où WPScan s'arrête.
- **`wpscan.ts`** : WordPress seul, avec le repli Wordfence.
- Chaque collecteur en step Inngest distinct (retry indépendant), idempotence
  garantie par l'index `(source, external_id)` et testée par un double run.
- **Matching** : jointure sur `(type, ecosystem, slug)` et non sur le seul slug,
  sans quoi deux technologies homonymes de deux écosystèmes se croiseraient.
  Nouvelle règle rendue possible par la phase 2 : **pas de verdict rouge si
  `versionConfidence` n'est pas `high`**. Une version probable peut produire un
  orange « à vérifier », jamais un rouge.
- Couche rédaction : SDK `@anthropic-ai/sdk`, **sortie structurée** plutôt que
  « réponds en JSON » (voir §6) — le guard zod reste, mais pour les règles
  métier (ex. `red` seulement si version dans la plage **et** sévérité
  high/critical), pas pour le parsing.
- Journalisation du couple prompt/version + `generatedText` : c'est la donnée
  qui fera évoluer le prompt.
- Seed de développement (`scripts/seed-sentinelle.ts`) : **quatre** clients de
  stacks différentes — WordPress, Drupal, Next.js avec dépendances npm, site
  sans CMS sous nginx/PHP. La définition de fini du pack (un seul client
  WordPress) ne prouvait rien de l'agnosticité ; celle-ci si.

### Phase 4 — Admin, envoi et newsletter bimensuelle (~3 j) · **faite**

Le prompt du pack, plus :

- Auth admin : cookie httpOnly + `SENTINELLE_ADMIN_PASSWORD`, protection au
  niveau d'un layout serveur du groupe admin (pas d'un composant client), et
  `noindex`.
- Rendu des e-mails prévisualisé dans l'admin via `@react-email/render`.
- Envoi par SMTP Google : le transport existe déjà
  (`@sentinelle/emails`, `sendSentinelleMail`), il reste à écrire les gabarits.
  Adresse d'expédition = un alias Workspace vérifié en « Envoyer en tant que »
  (`veille@next-impact.digital`), pas un sous-domaine : Gmail n'expédie que
  sous une adresse qu'il connaît. DKIM à activer dans la console Workspace
  avant le premier envoi réel — il ne l'est pas par défaut.
- Garde-fou : impossible de passer `validated → sent` sans `finalText` non vide.
- **Newsletter bimensuelle et non digest mensuel** : cron le 1er et le 15, clé
  de période fournie par `newsletter/period.ts`. Palier unique, donc tous les
  blocs pour tout le monde — aucun branchement sur `plan`, ce serait du code
  mort.

### Phase 5 — Onboarding et espace client (~2 j, révisé)

Le paiement est **déjà fait** : Payment Link Stripe, webhook vérifié, adresse du
site collectée par champ personnalisé obligatoire. La phase 5 du pack décrivait
une session Checkout créée depuis le rapport de scan : abandonnée. Reste l'aval.

- Onboarding post-paiement : complétion de fiche → `stack_items` de source
  `declared`. C'est ce qui fait passer la surveillance de « 50 à 70 % des
  composants » à « exacte » — la promesse faite sur la page d'offre.
- Magic link : token signé (HMAC + expiration 15 min), stocké haché.
- CTA du rapport de scan branché sur le Payment Link, scanId en paramètre.
- Lancement de `/sentinelle` : `AVANT_LANCEMENT` à `false`, entrée au sitemap,
  décision sur la navigation. Les trois gestes ensemble.

---

## 6. Couche rédaction — précisions techniques

Le pack fixe `claude-sonnet-4-6` par défaut. C'est un modèle de génération
précédente ; à date, les identifiants à utiliser sont :

- `claude-opus-5` — **recommandé par défaut**. Le volume est faible (quelques
  alertes/jour), l'enjeu est la justesse du verdict, pas le coût.
- `claude-sonnet-5` — repli économique si le volume monte.

Rendre le modèle configurable via `ANTHROPIC_MODEL` comme prévu, avec
`claude-opus-5` en valeur par défaut.

**Coût réel** : ~3 k tokens d'entrée (prompt système + contexte alerte) et
~400 tokens de sortie par alerte. À 5 $/25 $ par million (Opus 5), cela fait
**≈ 0,025 $ par alerte** — soit quelques euros par mois même à 100 alertes.
Le poste LLM ne remet pas en cause l'objectif « < 50 €/mois ».

**Sortie structurée** : plutôt que de demander « réponds uniquement en JSON »
puis de parser, contraindre la réponse par un schéma JSON
(`output_config.format`). Le JSON est alors valide par construction ; le guard
zod ne sert plus qu'à vérifier les règles métier du prompt. Cela supprime en
grande partie le chemin « sortie invalide → un retry → draft vide » prévu par
le pack (à conserver malgré tout comme filet).

Deux règles du prompt système ne sont **pas** vérifiables par un schéma et
doivent être testées côté code, sur le contexte d'entrée :

1. `verdict: "red"` interdit si la version du client n'est pas dans la plage
   affectée ou si la sévérité source n'est pas high/critical.
2. Aucun composant cité qui ne figure pas dans la fiche client fournie
   (vérification par recherche des slugs du contexte dans le texte produit).

Ce sont les deux garde-fous qui protègent la crédibilité du service ; ils
méritent des tests vitest au même titre que `versions.ts`.

---

## 7. Risques ordonnés

| Risque | Impact | Parade |
| --- | --- | --- |
| Cohabitation des root layouts (E2) | bloque tout | spike phase 0, repli `app/sentinelle/` |
| Middleware next-intl (E1) | 404 silencieux | correctif matcher + test FR/EN |
| Comparaison de versions fausse | fausse alerte rouge chez un client → perte de confiance | tests exhaustifs avant tout usage, doute → verdict le plus bas |
| `ignoreBuildErrors` masque des erreurs | bug en prod | `typecheck` bloquant sur `src/sentinelle/` |
| Prompt introuvable au runtime (E6) | rédaction KO en prod uniquement | fichier dans `src/`, tracing déclaré, test de chargement |
| Réponse du scan sur un site lent | timeout Vercel | scan en step Inngest, jamais dans la requête HTTP |
| Dérive de l'isolation | extraction future impossible | `check:sentinelle` dans le build |

---

## 8. Estimation

Révisée le 2026-08-15, phases 0 à 2 étant faites : **≈ 10 jours** restants. Le
découpage en lots, les dépendances et les définitions de fini sont en §11, qui
fait foi — cette section n'en garde que le total. La phase 5 perd un jour (le
paiement est déjà en place), la phase 4 une demi-journée (le transport d'e-mail
est écrit), la phase 2 bis en ajoute une demie et la mise en production, souvent
oubliée, une autre.

Coûts de fonctionnement au lancement : Neon et Inngest gratuits, envoi d'e-mails
**0 €** (compris dans le Google Workspace déjà payé — 2 000 destinataires/jour,
très au-dessus du besoin), Anthropic quelques euros. **WPScan ~30 € n'est plus une dépense obligatoire** :
endoflife.date et OSV.dev sont gratuits et sans clé, et couvrent tout le parc
non-WordPress. WPScan reste souhaitable pour la profondeur sur les extensions
WordPress, mais le produit tient sans lui dès le lancement — objectif
< 50 €/mois largement tenu.

---

## 9. Conservation des données

La politique actuelle du site (`/confidentialite`, §5) déclare deux durées :
prospect/contact **3 ans après le dernier échange**, audience **~14 mois**.
Sentinelle introduit des données que ces deux lignes ne couvrent pas. Proposition,
alignée sur l'existant là où c'est la même finalité :

| Donnée | Durée | Justification |
| --- | --- | --- |
| `scans.ipHash`, `userAgent` | **24 h**, puis mise à `NULL` | anti-abus uniquement ; le rate limit ne regarde que la dernière heure |
| `scan` anonyme (sans e-mail) | **30 j**, puis suppression de la ligne | le lien de rapport reste valable un mois, au-delà le diagnostic est périmé |
| `scans.result` (avec e-mail) | **12 mois**, puis purge du JSON | un état technique d'il y a un an n'a plus de valeur |
| `scans.leadEmail` + URL + date | **3 ans** après le dernier échange | même régime que le formulaire de contact — c'est le même prospect |
| `clients`, `stack_items` | abonnement **+ 3 mois**, puis suppression | fenêtre de réactivation, puis effacement sec |
| Textes d'`alerts` / `digests` | abonnement **+ 12 mois** | preuve de la prestation rendue en cas de litige |
| Métriques d'alerte anonymisées | sans limite | verdict proposé / verdict corrigé, sans texte ni client — c'est ce qui fait progresser le prompt |
| `intel_items` (CVE, versions, EOL) | sans limite ; `raw` purgé à **24 mois** | aucune donnée personnelle, c'est le patrimoine du produit |
| Tokens magic link | **15 min**, hachés, supprimés à l'usage | |
| Facturation | **10 ans**, **chez Stripe** | obligation comptable ; rien de tout ça ne descend en base Sentinelle |

Trois points qui méritent d'être décidés consciemment plutôt que subis.

**Les `stack_items` sont une cartographie de vulnérabilités.** La liste des
plugins et versions d'un client est exactement ce qu'un attaquant voudrait.
Conséquence : effacement sec à la résiliation (pas d'archive « au cas où »),
accès admin protégé, et aucune sortie de ces données hors de la base.

**Anthropic devient sous-traitant.** La couche rédaction envoie le contexte
d'une alerte à l'API. Il faut donc (a) le déclarer dans `/confidentialite` au
même titre que Vercel ou Google, et (b) **ne jamais envoyer nom ni e-mail du
client au modèle** : le prompt système n'en a pas besoin, il travaille sur le
secteur, les notes et le stack. C'est une minimisation gratuite, et elle
prolonge naturellement la règle 3 du `CLAUDE.md` (« le LLM ne connaît rien, il
reçoit tout » → il ne reçoit que ce qui sert à rédiger).

**L'effacement n'est pas instantané.** Les sauvegardes Neon (PITR) survivent à
la suppression logique. La politique doit le dire honnêtement : « l'effacement
est effectif sous 7 jours, délai d'expiration des sauvegardes ».

À noter : le groupe Sentinelle ayant son propre root layout, GA4 et Clarity ne
s'y chargent pas — les pages de scan et l'espace client ne sont pas tracés, ce
qui est le bon défaut. Ne pas les y ajouter « pour mesurer la conversion » sans
repasser par la bannière de consentement.

### Mise en œuvre

La rétention est du **code testé**, pas un paragraphe dans une page légale :

- `src/sentinelle/retention/policy.ts` — source unique des durées (constantes +
  fonctions `expiredScans()`, `expiredClients()`, `anonymizableAlerts()`),
  couvert par vitest avec une horloge injectée.
- Cron Inngest `retention-daily` (03:00 Europe/Paris), un step par catégorie,
  idempotent, qui journalise ce qu'il a purgé.
- `deleteAllDataFor({ email | clientId })` — une fonction, appelable depuis
  l'admin, pour honorer une demande d'effacement en une minute plutôt qu'en
  écrivant du SQL à la main un dimanche.

Livrable côté légal, en phase 2 (dès la capture d'e-mail, pas en phase 5) : une
section Sentinelle dans `/confidentialite` — finalités (diagnostic à la demande,
surveillance contractuelle), base légale (mesure précontractuelle pour le scan,
exécution du contrat pour la surveillance), sous-traitants (Neon, Inngest,
Google, Anthropic, Stripe) et le tableau de durées ci-dessus.

---

## 10. État d'avancement

### Phase 0 — préflight : **faite** (2026-08-15)

- **D1 tranchée : `app/(sentinelle)/` fonctionne.** Le spike est concluant —
  deux root layouts cohabitent (celui de `app/[locale]/` pour la vitrine, celui
  du groupe pour Sentinelle). Le build passe, `/scan` sort en statique. Le repli
  `app/sentinelle/` n'est pas nécessaire.
- **E1 corrigé** : `proxy.ts` exclut `scan|admin|espace` du matcher next-intl.
  Vérifié en conditions réelles : `/scan` répond 200 sans redirection, `/`,
  `/en`, `/solutions-web`, `/en/solutions-web` et `/contact` restent à 200.
- **E3 corrigé** : alias `@sentinelle/*` dans `tsconfig.json` et
  `vitest.config.mts`.
- **E4 corrigé, autrement que prévu** : un `tsc --noEmit` sur tout le repo
  remonte 14 erreurs préexistantes dans le code vitrine — inutilisable comme
  garde-fou. D'où `tsconfig.sentinelle.json`, qui cadre le typecheck sur le
  périmètre Sentinelle et doit rester vert. `npm test` = typecheck + vitest.
  Assainir la vitrine reste un chantier distinct, non ouvert ici.
- **D4 outillée** : `scripts/check-sentinelle-isolation.mjs`, branché sur
  `npm run build`. Le build échoue si un fichier vitrine importe `@sentinelle/*`.
- **Trouvaille hors plan** : `.gitignore` contenait `.env*`, qui avalait
  `.env.example` — le fichier que le pack demande de tenir à jour n'aurait
  jamais été versionné. Exception `!.env.example` ajoutée.
- Pointeur ajouté dans le `CLAUDE.md` racine (D6).

### Phase 1 — fondations : **faite sauf l'application de la migration**

- Dépendances : `drizzle-orm` 0.45, `@neondatabase/serverless` 1.1, `inngest` 4.18,
  `drizzle-kit` 0.31, `vitest` 4.1. `zod` 3.24 était déjà présent.
- `src/sentinelle/db/schema.ts` conforme à `specs/data-model.md`, avec les trois
  écarts documentés en tête de fichier (`ipHash`/`userAgent`, `onDelete: cascade`,
  index de lecture). Migration initiale générée : 6 tables, 102 lignes de SQL,
  commitée dans `db/migrations/`.
- `db/client.ts` : driver HTTP Neon. `db()` est une fonction, pas une constante :
  le module s'importe sans `DATABASE_URL`, l'erreur ne survient qu'à la première
  requête réelle — le build du site vitrine ne dépend donc pas de la base.
- **`matching/versions.ts` + 27 tests verts.** Couvre le piège lexical
  (« 6.6.20 » > « 6.6.3 »), les versions à quatre segments, les pré-versions
  (`1.0-beta` < `1.0`, `beta2` < `beta10`), les plages `< 6.7` et `>= 2.0 < 2.4`,
  et surtout le comportement en cas de doute : version inconnue ou plage
  illisible → **non affecté**, jamais d'alerte.
- Inngest branché : client, catalogue d'événements typés, fonction `healthcheck`,
  route `app/api/sentinelle/inngest`. Introspection vérifiée en mode dev :
  `function_count: 1`.
- **Écart API constaté** : le pack a été écrit pour Inngest v3. La v4 a supprimé
  `EventSchemas` et `createFunction` prend désormais deux arguments, les
  déclencheurs passant dans les options. Le typage des événements se fait par
  Standard Schema — donc par des schémas zod, ce qui applique gratuitement la
  règle « zod sur toutes les entrées externes » à la file de messages.

**Reste à faire pour clore la phase 1** : créer le projet Neon, renseigner
`DATABASE_URL` dans `.env.local`, puis `npm run db:migrate`. C'est la seule
étape qui dépend d'un compte externe.

### Changement d'offre — palier unique 19 € (2026-08-15)

> Écrit d'abord à 9 €, puis **arrêté à 19 €/mois** le même jour : c'est le tarif
> que portent `lib/sentinelle-offer.ts` et le Payment Link Stripe. Ce document a
> été aligné sur eux, et non l'inverse.

La grille 29 €/79 € est abandonnée au profit d'**un seul tarif à 19 €/mois** :
alertes au fil de l'eau + **newsletter bimensuelle**, deux envois par mois.
Appliqué : `planEnum` réduit à `veille`, migration régénérée (elle n'avait pas
encore été appliquée, donc aucun `ALTER TYPE` à porter), `.env.example` ramené à
un seul prix Stripe, `specs/architecture.md` mis à jour.

Conséquence trouvée à cette occasion : `digests.period` valait `"2026-08"` et
l'index unique `(clientId, period)` **aurait rejeté le second envoi du mois**.
Le format devient `"2026-08-1"` / `"2026-08-2"`, calculé par
`src/sentinelle/newsletter/period.ts` (12 tests). Le calcul se fait en heure de
Paris et non en UTC : un cron du 1er à 07:00 Paris tombe encore la veille en UTC
une partie de l'année, ce qui aurait rangé un numéro sur deux sous la mauvaise
clé.

Point de vigilance économique, à surveiller plutôt qu'à trancher maintenant : la
relecture humaine étant obligatoire (règle 4), 24 numéros par an et par client
font de son temps — et non de la technique — la borne du nombre de clients
servables. À 19 € pour 24 numéros au lieu de 29 € pour 12, le rapport
relecture/euro est multiplié par trois par rapport au modèle du pack.

### Page d'offre `/sentinelle` (2026-08-15)

Créée dans la vitrine (`app/[locale]/sentinelle/page.tsx`), pas dans le groupe
produit : c'est une page de vente, elle a besoin du header, du footer, de l'i18n
et du SEO du site. Composant serveur, sans JavaScript client, pour ne rien
coûter aux Core Web Vitals.

Structure : douleur → ce que vous recevez (deux choses) → pourquoi l'alerte est
lisible → 19 €/mois → limites énoncées avant. CTA à deux températures.

**En noindex tant que le produit n'est pas livrable** (drapeau `AVANT_LANCEMENT`
en tête de fichier) : le scanner arrive en phase 2 et le paiement en phase 5,
envoyer des prospects vers un parcours qui n'aboutit pas coûterait plus que ça
ne rapporte. Le CTA pointe donc vers `/contact` en attendant. Les trois gestes
de lancement (drapeau, sitemap, navigation) sont listés dans le fichier.

Non fait volontairement : aucun lien depuis le header ou la home — cela
toucherait des surfaces marketing existantes, ce que la règle 1 du pack réserve
à une demande explicite.

### Abonnement par Payment Link Stripe (2026-08-15)

Fait, en avance sur la phase 5 du pack et par un chemin plus court : au lieu
d'un tunnel Checkout codé sur mesure, l'abonnement passe par un **Payment Link**
— la page de paiement hébergée par Stripe, créée dans le tableau de bord. Stripe
Link (paiement en un clic) y apparaît automatiquement comme moyen de paiement.

- `billing/offer.ts` — montant, libellé, résolution de l'URL du Payment Link.
- `billing/subscription.ts` — traduction d'une session de paiement en fiche
  client. Pur, sans SDK ni base : 15 tests.
- `billing/store.ts` — upsert sur `clients.email`. **L'idempotence des rejeux
  Stripe ne repose sur aucun compteur applicatif** : c'est la contrainte
  d'unicité qui la garantit. Une valeur vide venant de Stripe n'écrase jamais
  une adresse de site déjà renseignée.
- `billing/stripe.ts` + `app/api/sentinelle/stripe/webhook/route.ts` —
  vérification de signature obligatoire, corps brut (`req.text()`), codes de
  retour choisis pour piloter les nouvelles tentatives de Stripe : 400 sur
  signature invalide (ne jamais retenter), 500 sur échec d'écriture (retenter),
  200 sur événement non géré (sinon Stripe boucle indéfiniment).
- Vérifié : une requête sans signature, ou avec une signature forgée, reçoit un
  400 et n'écrit rien.

Règle de conception : **un paiement encaissé produit toujours une fiche**. Une
donnée manquante devient un avertissement journalisé, jamais un rejet — perdre
la trace d'un client qui a payé est le pire résultat possible. Seule l'absence
d'adresse e-mail fait exception : sans elle, la fiche n'a pas de clé.

Deux gestes côté tableau de bord Stripe, sans quoi le code ne sert à rien :

1. créer le Payment Link sur un prix récurrent de 19 €/mois, **avec un champ
   personnalisé obligatoire de clé `site_url`** — sans lui on encaisse un
   abonnement sans savoir quel site surveiller ;
2. déclarer le webhook vers `/api/sentinelle/stripe/webhook` en écoutant
   `checkout.session.completed` et `customer.subscription.deleted`, puis coller
   le secret dans `STRIPE_WEBHOOK_SECRET`.

Point d'isolation résolu au passage : la page `/sentinelle` est une page
marketing et ne peut pas importer le code du produit sans violer la règle 2.
Les faits publics de l'offre vivent donc dans `lib/sentinelle-offer.ts`, dont
`billing/offer.ts` dépend — dépendance inversée, dans le sens autorisé. Le
montant affiché et le montant vérifié par le webhook ne peuvent pas diverger.

Hors périmètre de ce lot : la fabrication et l'envoi des numéros (phase 4), le
portail client Stripe et l'espace abonné (phase 5), l'e-mail de bienvenue.
Aujourd'hui, un paiement crée une fiche cliente — rien ne part encore.

### Phase 2 — scanner public, techno-agnostique (2026-08-15)

Le pack décrivait un scanner WordPress-first. La consigne — « la veille doit
être techno agnostique et capable de toutes les détecter » — a déplacé
l'architecture : **détecter une technologie ne doit plus demander d'écrire du
code**.

- `scanner/detect.ts` — moteur générique et pur. Il ne connaît aucune
  technologie : il applique des empreintes à une observation de page.
- `scanner/fingerprints.ts` — **des données, pas du code**. 45 empreintes
  couvrant CMS (WordPress, Drupal, Joomla, TYPO3, SPIP, Ghost, Craft, Shopify,
  Wix, Squarespace, Webflow), e-commerce, méta-frameworks (Next, Nuxt,
  SvelteKit, Remix, Astro, Gatsby, Angular), frameworks serveur, serveurs web,
  runtimes, hébergeurs, CDN, bibliothèques JS et mesure d'audience. Ajouter une
  techno = trois lignes.
- `scanner/detectors/wordpress.ts` — la seule exception assumée : WordPress a
  droit à un détecteur profond (extensions et thème énumérés) parce que c'est le
  parc surveillé en priorité. Il n'impose rien au moteur.

**Conséquence sur le modèle de données** : la taxonomie du pack
(`wp_core / wp_plugin / wp_theme / php / frontend`) mélangeait la nature d'un
composant et son écosystème, ce qui interdisait de surveiller un module Drupal
ou un paquet npm. La nature vit désormais dans `stackItemTypeEnum` (générique),
l'écosystème dans une colonne `ecosystem` présente sur `stack_items` **et**
`intel_items`. C'est ce couple qui dira à un collecteur où chercher : WPScan
pour `wordpress`, OSV pour `npm`/`packagist`, endoflife.date pour un runtime.
Migration régénérée (toujours pas appliquée, donc sans coût).

Reste du lot : rate limit par empreinte d'IP (compté en base, pas en mémoire —
en serverless un compteur applicatif ne compte rien), fonction Inngest
`scan-async`, routes POST/GET/PATCH, pages `/scan` et `/scan/[id]` avec
interrogation toutes les 1,5 s, capture d'e-mail et limites affichées.

**Deux bugs trouvés en confrontant le scanner au vrai web**, tous deux invisibles
sur les fixtures et tous deux porteurs de fausses alertes en phase 3 :

1. `?ver=1785161844` sur wordpress.org est un horodatage de purge de cache, pas
   une version. Il était rapporté tel quel et aurait été comparé à des plages
   affectées.
2. Plus grave : le `?ver=` était cherché dans la source entière — donc dans tout
   le HTML — si bien que **tous les composants d'une page héritaient de la
   première version rencontrée**. Sur wordpress.org, thème et extensions
   portaient la version de Gutenberg. Chaque composant aurait été confronté aux
   plages affectées avec la version d'un autre.

Les deux sont corrigés, chacun avec son test de non-régression. Vérifié ensuite
sur quatre sites réels : next-impact.digital (Next.js/Vercel), wordpress.org
(WordPress 7.2 + extensions), drupal.org (Drupal 10 + Apache), prestashop.com
(WordPress + Nuxt + deux CDN).

Choix de conception à retenir : `DetectedComponent` distingue `confidence` (le
composant est-il là ?) de `versionConfidence` (la version est-elle sûre ?). Ce
sont deux questions différentes, et c'est la seconde que le matching devra
consulter avant de fonder une alerte rouge sur une comparaison de plage.

### Révision de la planification (2026-08-15)

`prompts/phases.md` a été réécrit. Les prompts d'origine étaient périmés sur
trois points : produit WordPress-first, deux paliers tarifaires, paiement par
session Checkout. Ils décrivaient aussi les phases 1 et 2 comme à faire.

Ce qui change dans l'exécution, par ordre d'importance :

1. **La phase 3 devient la phase de l'agnosticité.** Trois collecteurs routés
   par écosystème au lieu de trois collecteurs WordPress. `endoflife.ts` passe
   en premier — c'est la source la plus rentable et la seule qui serve un client
   sans CMS.
2. **Une phase 2 bis apparaît** pour solder cinq points ouverts, dont deux
   visibles par un client et trois à portée juridique.
3. **La définition de fini de la phase 3 change de nature** : quatre clients de
   stacks différentes au lieu d'un client WordPress. Une définition de fini qui
   ne teste qu'un WordPress ne prouve rien d'une promesse « toute technologie ».
4. La phase 5 se réduit à l'onboarding et à l'espace client.

État vérifié le 2026-08-15 : `npm test` vert (83 tests, 5 fichiers), typecheck
Sentinelle propre, scanner confronté à neuf sites réels de stacks différentes.
**La base Neon est joignable mais vide** — la migration n'a jamais été
appliquée, et c'est le seul blocage total : toute route qui touche la base
répond 500. Voir la phase 1 pour le correctif `drizzle.config.ts`.

### Envoi d'e-mails par SMTP Google (2026-08-15)

Resend est abandonné avant d'avoir servi. La vitrine envoyait déjà par
`smtp.gmail.com` (compte Workspace `agathe@next-impact.digital`, mot de passe
d'application) ; Sentinelle fait désormais de même. Trois raisons : un
fournisseur de moins à administrer, zéro coût marginal, et un domaine dont la
réputation d'envoi est déjà établie plutôt qu'un sous-domaine neuf à chauffer.

Ce que la bascule ne change pas — et c'est le point à ne pas perdre : les deux
piles restent séparées. `src/sentinelle/emails/` a son propre transport, ses
propres variables `SENTINELLE_SMTP_*` et **aucun repli** sur les `NODEMAILER_*`
de la vitrine. Un repli silencieux ferait partir la veille sous l'identité du
site le jour d'un oubli de variable ; une erreur qui nomme la variable manquante
vaut mieux. Le jour de l'extraction en sous-domaine, `emails/` part tel quel.

- `emails/config.ts` — lecture d'environnement pure et testée (`resolveMailConfig`).
- `emails/send.ts` — transport paresseux, `sendSentinelleMail`, plus
  `verifyMailTransport()` qui authentifie sans envoyer : dix secondes après une
  rotation de mot de passe, au lieu de le découvrir sur une alerte client.
- 17 tests, `npm test` vert (100 tests). Authentification vérifiée en réel
  contre `smtp.gmail.com:465`.

Trois contraintes propres à Google, écrites dans `emails/config.ts` pour
qu'elles ne se redécouvrent pas :

1. Le mot de passe est un **mot de passe d'application** de 16 caractères
   (validation en deux étapes requise), pas celui du compte. Google l'affiche
   par groupes de quatre — les espaces collés font échouer l'authentification,
   `resolveMailConfig` les retire.
2. **Gmail réécrit l'en-tête From** s'il ne correspond pas au compte
   authentifié ou à un alias « Envoyer en tant que » vérifié. D'où
   `SENTINELLE_MAIL_FROM` laissé vide en local : l'alias `veille@` doit exister
   côté Google avant qu'on l'écrive ici. Le sous-domaine
   `sentinelle.next-impact.digital` prévu par le pack n'a plus lieu d'être.
3. Quota : 2 000 destinataires/jour en Workspace. Large pour des alertes et deux
   numéros par mois, mais ce n'est pas illimité — à revoir si le nombre d'abonnés
   dépasse quelques centaines, la même architecture pouvant alors pointer sur un
   relais SMTP transactionnel sans changer une ligne d'appelant.

Reste à faire quand la phase 4 arrivera : activer DKIM pour le domaine dans la
console Workspace (il ne l'est pas par défaut), créer et vérifier l'alias
`veille@next-impact.digital`, et renseigner les `SENTINELLE_SMTP_*` sur Vercel.
La dépendance `resend` reste dans `package.json`, désormais inutilisée.

### Lot 0 — migration appliquée, chaîne complète vérifiée (2026-08-15)

La base n'est plus vide : 6 tables, 6 enums, 9 index — dont les uniques qui
portent l'idempotence (`alert_client_intel`, `intel_source_external`,
`digest_client_period`, `clients_email_unique`).

`drizzle.config.ts` : `process.loadEnvFile(".env.local")` sous `try/catch` et
bascule sur `DATABASE_URL_UNPOOLED`, avec repli sur `DATABASE_URL`. Le repli
compte pour la CI et Vercel, qui passent les variables autrement.

**Vérification de bout en bout** : `POST /api/sentinelle/scan` sur drupal.org →
step Inngest → `status: done` en moins de deux secondes, deux composants
détectés (Drupal 10 en confiance haute, Apache HTTP Server sans version),
`ipHash` de 64 caractères et `userAgent` en base. C'est la première fois que la
chaîne tourne entière.

Deux problèmes trouvés à cette occasion, tous deux invisibles en tests :

1. **Inngest v4 ne devine plus le mode développement.** Sans `INNGEST_DEV=1`,
   le SDK part en mode cloud : la route d'enregistrement répond 500 en boucle et
   `inngest.send()` échoue faute de clé. Le pack, écrit pour la v3, ne pouvait
   pas le prévoir. Variable ajoutée à `.env.local` et à `.env.example`, avec la
   consigne de ne jamais la définir en production.
2. **Un envoi d'événement raté laissait un scan fantôme.** La ligne est écrite
   avant la mise en file ; l'échec de `inngest.send()` remontait à l'appelant
   sans toucher la ligne, qui restait `pending` pour toujours — et le front
   interrogeait dans le vide. `app/api/sentinelle/scan/route.ts` ferme désormais
   la ligne en `failed` avec un message honnête. Vérifié en coupant le serveur
   Inngest : la route répond 500 et la ligne est en `failed`, plus en `pending`.

Confirmé au passage, en conditions réelles et post-migration : le rapport de
drupal.org affiche « Drupal 10 » puis, deux lignes plus bas, « Ce site n'utilise
pas de CMS détecté publiquement ». C'est le point 1 de la phase 2 bis, qui reste
donc bien la prochaine étape.

### Lot 1 — phase 2 bis soldée (2026-08-15)

Les cinq points sont faits. `npm test` vert (125 tests, 9 fichiers), build vert.

1. **`platform: string | null` remplace `isWordPress`** dans `ScanResult`. La
   dérivation vit dans `scanner/platform.ts` : CMS d'abord, boutique ensuite,
   méta-framework à défaut. Un site Next.js répond donc « next » et non « pas de
   plateforme ». Le détecteur profond WordPress reste branché sur la présence du
   composant, pas sur un booléen de modèle.
2. **La note du rapport a trois cas** et non deux, dans le même fichier et testée
   sur fixtures : WordPress (énumération partielle), autre CMS ou boutique
   (« les composants internes de Drupal… ne sont pas visibles publiquement »),
   ni l'un ni l'autre (fiche déclarative). Le test de non-régression porte
   explicitement sur Drupal et Shopify — le bug constaté sur drupal.org.
3. **Rétention implémentée.** `retention/policy.ts` porte les durées et les
   décisions (pures, horloge injectée, 15 tests) ; `retention/purge.ts` exécute
   et journalise ; le cron `retention-daily` tourne à 03 h 00 Europe/Paris, un
   step par catégorie. Le SQL ne décide de rien : il présélectionne, la
   politique tranche, la suppression se fait par liste d'identifiants — ce qui
   rend le journal exact.
4. **Section 8 de `/confidentialite`** : les deux traitements (diagnostic à la
   demande, surveillance contractuelle), leurs bases légales, les cinq
   sous-traitants, le tableau des durées, l'effacement effectif sous sept jours
   et le fait que le modèle ne reçoit jamais nom ni e-mail.
5. **`robots.txt`** exclut `/scan`, `/admin` et `/espace` pour tous les robots,
   sans exception. Le fichier était vingt blocs recopiés à la main ; il est
   désormais composé, ce qui garantit qu'aucun agent n'oublie une exclusion.

Deux décisions prises en cours de route, toutes deux imposées par le réel :

**`clients.deactivated_at` ajoutée** (migration `0001`, appliquée sur Neon).
Sans elle, « effacement à J+3 mois » n'était pas implémentable : `active: false`
dit qu'un abonnement s'est arrêté, jamais quand. Le webhook Stripe l'écrit à la
résiliation, l'upsert la remet à NULL au réabonnement — sans quoi la purge
effacerait dans trois mois les données d'un client qui vient de repayer.

**Le §9 se contredisait** : « clients supprimés à +3 mois » et « textes d'alertes
conservés à +12 mois » ne peuvent pas être vrais ensemble, les alertes étant en
cascade sur le client. Résolution retenue, qui tient les deux promesses : à
+3 mois le stack est supprimé et la fiche **anonymisée** (e-mail, nom, société,
adresse, identifiants Stripe effacés, la ligne survit) ; à +12 mois les textes
d'alertes et de numéros sont purgés. Ne restent alors que verdicts et dates, qui
ne désignent plus personne — la métrique anonyme que le §9 conserve sans limite.

Vérifié en réel contre Neon, horloge avancée de 48 h : deux scans du jour,
empreinte d'IP et user-agent effacés, tout le reste à zéro. `robots.txt` rendu
et relu.

Deux points laissés ouverts sciemment :

- **Les tokens de magic link ne sont pas décrits dans `/confidentialite`.** La
  fonctionnalité n'existe pas (phase 5) ; une page légale ne décrit pas un
  traitement qui n'a pas lieu. À ajouter avec l'espace client. — *Fait au lot 4 :
  section 8.3 (« Accès à votre espace abonné ») et ligne au tableau des durées.*
- **Les colonnes de date sont des `timestamp` sans fuseau.** Postgres y écrit
  l'heure du serveur (UTC sur Neon, Europe/Paris en local) : les seuils de
  rétention peuvent donc glisser d'une à deux heures en développement. Sans
  conséquence sur des durées qui se comptent en jours, mais c'est une bascule en
  `timestamptz` à faire un jour, avant que d'autres colonnes ne s'y ajoutent.

### Lot 2 — phase 3 faite (2026-08-15)

Les quatre sous-lots sont livrés. `npm test` vert (187 tests, 15 fichiers),
build vert, et — c'est ce qui compte ici — tout a été vérifié contre les vraies
API et la vraie base, pas seulement en tests.

**2a — routeur et collecte agnostique.** Le catalogue de sources
(`collectors/catalog.ts`) est une table, comme les empreintes du scanner :
ajouter une technologie surveillée n'est pas une branche de `switch`. Il ne
porte que les exceptions — les endroits où le nom chez la source diffère du
nôtre (« apache » → `apache-http-server`, Laravel → `laravel/framework`) ;
le reste se déduit de l'écosystème. Un composant sans source connue ressort dans
`plan.skipped` avec sa raison, journalisée. `endoflife.ts` produit deux faits
par branche — fin de support et dernière version — **tous deux exprimés comme
une plage de versions**, ce qui permet au matching de traiter une fin de support
exactement comme une faille : même code, même prudence.

Vérifié en réel : 20 produits, **543 faits en base sans aucun client**, et une
seconde passe qui écrit 0 nouveau fait pour 543 mises à jour.

**2b — matching.** Jointure sur `(slug, type, ecosystem)` et jamais sur le seul
slug ; pas d'alerte sans version ; **pas de rouge sans version certaine** ; plage
illisible ou version hors plage → rien. La confiance dans la version voyage dans
`stack_items.meta.versionConfidence` — le scanner la calculait déjà, elle n'était
simplement pas conservée. Défaut prudent quand elle manque : « probable », qui
interdit le rouge.

Le seed des quatre clients (`npm run db:seed`) est la preuve d'agnosticité :
WordPress + WooCommerce, Drupal, Next.js + npm, site sans CMS. Chacun reçoit des
alertes pertinentes, **le quatrième compris** (PHP 7.4 et nginx 1.18 hors
support). 442 paires écartées pour « version hors plage » : le silence est
compté, pas subi.

**2c — OSV, WPScan, releases.** OSV interrogé avec la version du client, puis
**la plage revérifiée de notre côté** : deux calculs valent mieux qu'un quand une
erreur envoie un rouge à quelqu'un qui n'est pas concerné. Une faille à plusieurs
plages disjointes devient autant de faits suffixés `#1`, `#2` — notre grammaire
de plages ne gère pas la disjonction, et les segments étant disjoints un client
n'en croise qu'un.

Idempotence prouvée : cinq passes successives, la dernière écrit 0 fait et 0
alerte. Les passes intermédiaires écrivent encore parce que le plafond de douze
failles par paquet vide la file sur plusieurs jours — c'est voulu et journalisé,
jamais silencieux.

**2d — rédaction.** Sortie structurée (schéma JSON dans la requête) plutôt que
« réponds en JSON » : le JSON est valide par construction, et zod ne sert plus
qu'à vérifier que le schéma et le code ne divergent pas. Le prompt système vit
dans `src/sentinelle/redaction/` et est déclaré dans `outputFileTracingIncludes`
— lu par son chemin, il serait absent du déploiement Vercel sans cette ligne.

Les deux garde-fous sont du code, pas des consignes, et ils ont été éprouvés sur
du texte réellement produit par le modèle : un rouge dont la version passe en
« probable » est abaissé en orange ; le même texte présenté comme une alerte sur
un autre composant est **rejeté** parce qu'il nomme Next.js. Le premier est
corrigible, le second ne l'est pas — un texte qui parle du mauvais composant
n'est pas rattrapable, il est faux.

Quatre décisions prises en cours de route :

1. **Le repli Wordfence du pack n'existe plus.** Vérifié le 2026-08-15 : l'API
   v2 répond 410, la v3 exige une authentification. Sans `WPSCAN_API_KEY`, il
   n'existe aujourd'hui aucune source gratuite et anonyme de vulnérabilités
   WordPress. Le collecteur ne produit rien et le journalise, comme le veut la
   règle du routeur. Un site WordPress reste couvert pour les fins de support
   (endoflife.date) et les retards d'extension (api.wordpress.org).
2. **`releases.ts` ne traite pas le cœur de WordPress.** endoflife.date donne
   déjà, par branche, la dernière version et la date de fin de correctifs. Un
   client en 6.4.3 doit lire « 6.4.10 est disponible sur votre branche » plutôt
   qu'un « passez en 7.0 » qui ignore son contexte ; ajouter une troisième source
   sur le même objet ne produirait que des doublons. Le fichier couvre ce
   qu'endoflife ne couvre pas : les soixante mille extensions.
3. **Un fait « retard de version » par composant, pas par version publiée**
   (`plugin:contact-form-7`, sans numéro). Sinon chaque sortie amont créerait un
   fait de plus, donc une alerte de plus, pour la même chose.
4. **`endoflife.date` est interrogé sur un socle fixe de vingt produits**,
   indépendamment des clients. La veille a de la valeur au premier jour, et un
   nouvel abonné est couvert à la seconde où sa fiche existe plutôt qu'au
   lendemain de la première collecte. Vingt requêtes quotidiennes sur une API
   gratuite : le coût est nul.

Deux constats à emporter en phase 4 :

- **Le volume d'alertes par client est le vrai sujet, pas la technique.** Le
  client Drupal accumule 26 alertes, le Next.js 29 — presque toutes légitimes
  (ces versions traînent beaucoup de CVE). Une file de validation qui les
  présente une par une sera inutilisable : l'admin doit grouper par composant.
- **La règle « pas de rouge sur une version probable » n'a pas pu être prouvée
  en réel**, faute de cas : aucune faille de sévérité haute ne touche jQuery
  1.12.4 ni Bootstrap 4.6.0, les deux composants à version probable du seed.
  Elle est prouvée par test unitaire, et la vérification en base confirme
  l'invariant : zéro alerte rouge fondée sur une version non certaine.

### Lot 3 — phase 4 faite (2026-08-15)

Admin de validation, gabarits d'e-mail, newsletter bimensuelle. `npm test` vert
(242 tests, 20 fichiers), build vert, isolation vérifiée — et, comme au lot 2,
tout a été confronté à la vraie base, à la vraie API et au vrai SMTP.

**L'admin, `/admin/sentinelle`.** Mot de passe unique, cookie httpOnly portant
une expiration signée (HMAC, clé = le mot de passe) : le secret ne voyage jamais,
une session expire d'elle-même, et changer le mot de passe ferme toutes les
sessions sans rien stocker en base. Garde dans un layout serveur, et
**revérification dans chaque action serveur** — une action serveur est une URL
publique, le layout ne protège que l'affichage. Il n'existe pas de compteur
d'essais fiable en serverless (même constat qu'au E5) : la protection est la
longueur du secret, imposée à 16 caractères, et l'admin refuse de s'ouvrir
en-deçà plutôt que de protéger à moitié.

**La file est groupée par composant, pas par alerte.** C'est la conséquence
directe du constat du lot 2 : vingt-neuf alertes sur le même paquet npm ne se
relisent pas une par une. Un client par ligne (rouges, prêtes, sans texte,
ancienneté), puis un dossier client où chaque composant porte sa propre décision
— dont « écarter les vingt-neuf » en un geste.

**Le contenu relu est du JSON dans `final_text`.** Écart assumé au nom de la
colonne : le gabarit d'e-mail a besoin de champs séparés (verdict, titre, corps,
ce que ça change, action, faisable seul, effort). Un paragraphe unique aurait
obligé soit à appauvrir l'e-mail, soit à redécouper du texte à l'envoi —
c'est-à-dire à deviner. La lecture accepte les deux vocabulaires (snake_case du
prompt, camelCase du modèle TypeScript) parce que le même formulaire s'amorce
depuis `generated_text` et se relit depuis `final_text` ; un texte libre écrit à
la main n'est pas perdu, il atterrit dans le corps.

**Les gabarits sont en React Email**, rendus en HTML **et** en texte depuis le
même arbre : les deux ne peuvent pas diverger, et un e-mail sans partie texte
part avec un score de spam plus élevé. Kit visuel propre au produit
(`emails/theme.ts`), copie assumée de l'identité du site — jamais un import de
`lib/email-template.ts`. L'aperçu de l'admin est le rendu réel, dans une iframe
`sandbox`.

**La newsletter est bimensuelle et à moitié écrite par la machine, à moitié
pas.** Les blocs 1, 2 et 5 (état du site, delta depuis le numéro précédent,
radar des fins de support) s'assemblent depuis la base **sans modèle** : ce sont
des faits, les faire réécrire n'ajouterait qu'un risque d'invention. Les blocs 3
et 4 sont rédigés par Claude, avec le même garde-fou de code qu'une alerte — un
numéro qui nomme une technologie absente de la fiche est refusé.

Trois décisions prises en cours de route :

1. **Le radar ne retient une échéance que si la version du client est dans la
   plage.** Sans ce contrôle, un client en PHP 8.3 lirait chaque quinzaine que
   PHP 8.1 arrive en fin de vie : vrai, mais pas pour lui. C'est le même piège
   que celui du matching, et il se reteste ici.
2. **Un numéro déjà écrit n'est jamais réécrit**, même en brouillon. Le rejeu du
   cron ne doit pas effacer une relecture en cours ; refaire un numéro est un
   geste conscient, pas un effet de bord.
3. **`final_html` est figé à la validation et c'est lui qui part.** Le numéro
   est daté par sa période (le 1er ou le 15) et non par l'instant d'expédition :
   le rendu est donc déterministe, et ce qui a été relu est exactement ce qui a
   été envoyé. C'est aussi la pièce qu'un litige exhumerait.

**Vérifié en réel, et pas seulement en tests** : quatre numéros fabriqués pour
les quatre clients du seed, les quatre avec leurs blocs rédigés acceptés par le
garde-fou ; seconde passe → 0 créé, 4 déjà en place (idempotence). Le radar a
produit une échéance juste (PHP 8.2, fin de correctifs au 31/12/2026, 137 jours)
et zéro pour les clients qui ne sont pas sur cette branche. Puis les deux cycles
complets, adresse d'un client de démonstration basculée le temps de l'envoi vers
le compte SMTP lui-même, puis restaurée :

- alerte : envoi refusé avant validation → validation → envoi accepté par Gmail
  (`messageId` rendu) → second envoi refusé, statut `sent` ;
- numéro : mêmes refus, HTML figé de 8 885 caractères, envoi réel, second envoi
  refusé.

Deux corrections nées de cette vérification :

- `isAnonymizedEmail` disait « fiche anonymisée par la purge » à propos des
  fiches de démonstration, qui vivent sur le même domaine `.invalid` sans avoir
  jamais été purgées. Le préfixe `efface-` compte désormais autant que le
  domaine, et une adresse en `.invalid` a son propre refus. Une explication
  fausse envoie chercher un bug là où il n'y en a pas.
- Les adresses de démonstration sont refusées **avant** l'appel SMTP : un envoi
  qui part chercher un serveur pour un domaine réservé par la RFC 2606
  ressemblerait à une panne.

Ce qui reste hors de ce lot, volontairement : l'alias `veille@` et DKIM (gestes
Google Workspace, côté Agathe — l'envoi part aujourd'hui sous l'adresse du
compte authentifié), et le lien vers l'admin depuis le site (elle n'a rien à
faire dans une navigation publique ; l'URL se connaît).

### Lot 4 — phase 5 faite (2026-08-15)

Onboarding post-paiement, espace client, lancement. `npm test` vert (277 tests,
23 fichiers), build vert, isolation vérifiée — et, comme aux lots précédents,
tout a été confronté à la vraie base, au vrai SMTP et à la vraie file Inngest.

**Le webhook ne fait plus qu'écrire la fiche.** Tout l'aval — amorcer le stack,
souhaiter la bienvenue — part dans un événement `sentinelle/client.subscribed`
traité par une fonction Inngest. Deux raisons : un scan de site prend des
secondes que Stripe ne donne pas, et un envoi d'e-mail qui échoue ne doit pas
faire retenter un paiement. La page de retour de paiement émet le **même**
événement : la fonction est idempotente, et ce doublon de chemin couvre le cas
où le webhook n'est pas configuré — un abonné qui a payé ne dépend donc pas d'un
réglage de tableau de bord.

**Le CTA du rapport porte l'identifiant du scan** (`client_reference_id`, seul
paramètre que Stripe fait voyager jusqu'au webhook). À l'ouverture de
l'abonnement, la fiche est amorcée avec ce que le client vient de lire à
l'écran, plutôt qu'avec une seconde analyse faite deux minutes plus tard — qui
pourrait dire autre chose et donner l'impression d'un produit qui hésite. Sans
scan d'origine, la fonction analyse le site elle-même ; un site qui refuse
l'analyse donne une fiche déclarative, pas une erreur.

**L'espace client n'a pas de mot de passe.** Un lien de connexion valable quinze
minutes, à usage unique, dont seule l'empreinte SHA-256 est stockée. Le jeton
porte l'identifiant du client et son expiration, signés : un lien forgé ou
périmé est rejeté **sans toucher la base**. L'usage unique, lui, est garanti par
la base — la suppression conditionnelle de la ligne fait office de verrou entre
deux instances serverless.

Quatre décisions prises en cours de route :

1. **Le lien n'est pas consommé à l'affichage, mais au clic.** Les passerelles
   de sécurité des messageries ouvrent les liens d'un e-mail avant leur
   destinataire pour les vérifier : un jeton à usage unique consommé par un
   `GET` serait brûlé avant d'avoir servi, et l'abonné lirait « ce lien a déjà
   servi » sans avoir rien cliqué. Un bouton coûte un geste et supprime toute
   cette classe de pannes. Vérifié en réel : après chargement de la page de
   connexion, le jeton était toujours consommable.
2. **Le retour de paiement ouvre une session, mais seulement deux heures.**
   L'identifiant de session Stripe traîne dans un historique de navigation ; il
   ne doit pas valoir clé d'accès permanente. Au-delà, la page renvoie vers le
   lien de connexion classique.
3. **Le déclaré ne se fait jamais écraser par le détecté.** La règle est dans le
   `setWhere` de l'upsert, donc en SQL, pas dans une précaution d'appelant. Un
   client qui corrige une version doit voir sa correction tenir au prochain
   scan, sans quoi il ne la fera pas deux fois. C'est l'invariant qui a été le
   plus explicitement testé, en base réelle.
4. **Ce qui n'est pas surveillable est dit comme tel.** Un composant déclaré
   qu'aucun catalogue public ne couvre (un hébergeur, un module maison) est
   affiché mais annoncé sans veille automatique — dans la fiche, dans le message
   de confirmation et dans l'e-mail de bienvenue. La question est posée au
   catalogue de collecte, pas déduite de la présence d'un écosystème : annoncer
   « 14 composants surveillés » quand trois ne sont interrogeables nulle part
   serait la première promesse non tenue du produit.

**L'e-mail de bienvenue est le seul du produit à partir sans relecture.** La
règle 4 porte sur ce que le produit **affirme** d'un site ; un accusé de
réception qui compte des composants et donne un lien n'affirme rien qui puisse
être faux, et le faire attendre ferait patienter quelqu'un qui vient de payer.
Il ne part qu'une fois : la marque est posée **avant** l'envoi par une écriture
conditionnelle (deux rejeux simultanés ne peuvent pas gagner tous les deux) et
relâchée si l'envoi échoue — sans quoi une panne SMTP passagère priverait
définitivement un abonné de son message d'accueil.

**Vérifié en réel, et pas seulement en tests.** Une fiche jetable créée sur Neon
a servi à éprouver trente points : import de scan idempotent, correction de
version par le client qui survit à un rescan, retrait d'une ligne déclarée qui
n'emporte pas les lignes détectées, jeton consommé une fois puis refusé, jeton
falsifié refusé sur la signature, jeton périmé refusé, plafond de trois liens
par quart d'heure, session refusée sous un autre secret, bienvenue refusée avant
tout appel SMTP sur une adresse de démonstration. Puis la chaîne entière : scan
réel de wordpress.org (sept composants, six couverts par une source), e-mail de
bienvenue **réellement expédié** par Gmail, rejeu refusé ; et le parcours
complet par la file — événement émis, drupal.org analysé, deux composants
importés, bienvenue partie, le tout en moins de deux secondes. Enfin les routes
en HTTP : `/espace/fiche` sans session redirige (307), avec session affiche la
fiche, un jeton falsifié affiche un refus lisible.

**Le lancement était déjà fait** (drapeau `AVANT_LANCEMENT` à `false`, entrée au
sitemap, page `/veille` et navigation) et n'appartenait donc plus à ce lot.

Ce qui reste hors de ce lot, volontairement : le portail Stripe doit être activé
une fois dans le tableau de bord (le code le demande, la configuration est un
geste humain), et le Payment Link a besoin de sa page de retour
(`/espace/bienvenue?session_id={CHECKOUT_SESSION_ID}`) — les deux sont listés
dans « En parallèle, hors code ».

### Refonte de la lettre bimensuelle (2026-08-15)

Le numéro change de nature. Il n'est plus un relevé de surveillance — cinq blocs
dont deux rédigés — mais une **lettre de consultant** : douze axes croisant
l'observation du site et l'actualité de la période, des tendances qualifiées
pour ce site-là, trois scénarios commandés par une configuration
d'opportunités et de menaces, une méthode de calcul de retour et une fenêtre de
décision datée. Le prompt de référence est fourni par Agathe ; il est repris
presque tel quel, découpé en deux prompts système dans
`src/sentinelle/redaction/`.

**Ce qui a rendu la refonte possible sans toucher à la règle 3.** Une lettre de
veille a besoin d'actualité extérieure ; une seule passe qui chercherait et
écrirait dans le même geste rendrait la règle invérifiable. D'où deux passes :

| Passe | Outils | Écrit | Ce qui la borne |
| --- | --- | --- | --- |
| collecte | recherche et lecture web (`max_uses` : 30 et 8) | rien | le budget, côté serveur |
| rédaction | aucun | la lettre | le dossier collecté, et lui seul |

La rédaction reste donc un modèle qui ne connaît rien et reçoit tout. Ce qu'il
reçoit a simplement été collecté et vérifié une étape plus tôt.

**Le garde-fou a changé de forme, et il le fallait.** Celui des alertes refuse
tout texte nommant une technologie hors fiche. Appliqué ici, il aurait refusé
**chaque** numéro : « où va chaque famille de solutions » nomme forcément des
technologies que le client n'a pas. Il devient donc deux régimes — vocabulaire
borné sur ce qui est affirmé **du site**, sourçage obligatoire sur ce qui relève
du **marché** (aucune URL hors dossier, aucune source sans date). S'y ajoute ce
qu'une sortie structurée ne sait pas exprimer : douze axes et pas onze, trois
scénarios, trois questions, un horizon derrière chaque « agir ».

**Ce que le code ne vérifie pas, et qu'il ne faut pas croire vérifié :**
l'attribution. « Votre site utilise Drupal » et « Drupal progresse » emploient le
même mot ; seule la relecture les distingue. C'est écrit dans `lettre/guards.ts`
plutôt que sous-entendu, parce qu'un garde-fou qu'on croit plus fort qu'il n'est
est pire qu'un garde-fou absent.

Quatre décisions prises en cours de route :

1. **Recherche par client, pas mutualisée.** Arbitrage d'Agathe, lecture
   littérale du prompt : chaque numéro fait ses propres recherches, et la
   personnalisation commence à la collecte. Le coût est celui de ce choix (voir
   le point de vigilance ci-dessous) ; une passe mutualisée aurait divisé la
   facture par dix mais aussi la finesse de la collecte.
2. **`pause_turn` est une pause, pas une erreur.** Une boucle d'outils serveur
   s'arrête au bout de dix itérations et attend qu'on lui rende la main. Avec un
   budget de trente recherches, on la rencontre à chaque numéro : sans reprise,
   la collecte rendrait un dossier vide sans qu'aucune erreur ne soit levée.
3. **Un step Inngest par client.** Chaque step est une invocation HTTP distincte,
   donc son propre `maxDuration`. Vingt clients dans un seul step ne verraient
   jamais le vingtième.
4. **Le dossier est conservé à côté de la lettre**, dans `digests.blocks`. Une
   lettre sans son dossier n'est plus vérifiable six mois plus tard, seulement
   croyable.

**L'ancien moteur de numéro a été retiré**, pas laissé à côté : `newsletter/draft.ts`,
`buildIssueFor`, `runNewsletterBuild` et le prompt de la newsletter n'existent
plus. Deux moteurs de numéro cohabitant, une prochaine session en aurait choisi
un au hasard. `newsletter/` garde ce qu'il est seul à savoir produire : la
cadence du 1er et du 15, et le constaté (fiche suivie, alertes envoyées, radar).

### Ce que la première fabrication réelle a appris (2026-08-15)

Un numéro complet a été fabriqué contre les vraies API, sur next-impact.digital.
Trois résultats, dont deux ont imposé une correction immédiate.

**1. Le schéma complet de la lettre ne compile pas.** L'API répond
`400 — The compiled grammar is too large`. La sortie structurée compile le schéma
en grammaire, et celle d'une lettre à douze axes dépasse ce qu'elle accepte. La
rédaction se fait donc en **trois appels** (axes, tendances, synthèse), suivant
les étapes du prompt. Le brief est mis en cache entre les trois. Ce n'est pas un
contournement : chaque appel a aussi sa propre marge de `max_tokens`, là où la
lettre entière frôlait le plafond.

**2. Le garde-fou de vocabulaire produisait un faux positif.** Un numéro a été
refusé parce qu'il écrivait « WordPress » à propos d'un site sous Next.js. Le mot
était juste : le dossier décrivait les publics du site comme « des dirigeants au
parc WordPress vieillissant ». Le vocabulaire autorisé ignorait `dossier.publics`
et le contexte client. Corrigé — un garde-fou qui interdit à un studio de parler
du parc de ses clients ne protège plus rien, il empêche d'écrire.

**3. Les chiffres réels, qui remplacent mes estimations.** Ils sont mesurés et
stockés dans l'encart de production de chaque numéro (`consommation`) :

| Mesure | Valeur constatée | Ce que j'avais estimé |
| --- | --- | --- |
| Durée d'un numéro | **22 min** (1 325 s) — dont ~17 de collecte | « quelques minutes » |
| Coût d'un numéro | **≈ 8 $** | 1,50 à 2,50 $ |
| Jetons d'entrée | **1,43 million** | — |
| Recherches / lectures | 18 / 8 | 10 à 30 / 8 |
| Longueur de la lettre | **6 975 mots** | cible 3 000 à 4 500 |

Le poste dominant est le million et demi de jetons d'entrée : dans une boucle
d'outils, l'historique — résultats de recherche et pages lues — est renvoyé et
refacturé à chaque tour. Ce n'est pas un défaut d'implémentation, c'est le coût
de la recherche par client.

**Ce que ces chiffres impliquent, sans détour :**

- **≈ 16 $ par mois et par client** (deux numéros) sur un abonnement à 19 €.
  L'arbitrage « recherche par client » a été pris en connaissance d'un ordre de
  grandeur qui s'est révélé quatre fois trop bas. À rouvrir avant d'ouvrir les
  inscriptions, avec ce chiffre-là et non une estimation.
- **22 minutes ne tiennent dans aucun `maxDuration`.** Il est passé de 60 à
  300 s (maximum d'un plan Vercel Pro), et c'est toujours quatre fois trop peu.
  **La collecte doit passer sur l'API Batches** : pour un numéro bimensuel la
  latence n'a aucune importance, et le coût y est divisé par deux. Ce n'était
  qu'un repli dans mes notes ; c'est le chemin.
- **La lettre est 55 % plus longue que sa cible.** Le garde-fou le signale sans
  bloquer. C'est du réglage de prompt, pas un défaut de structure — mais 7 000
  mots deux fois par mois et par client déplacent encore la borne de relecture
  que le §11 identifiait déjà comme la vraie limite du nombre d'abonnés.

**Ce qui a été vérifié bon**, sur la même fabrication : la collecte a rendu un
dossier structuré valide (10 faits datés et sourcés, 20 observations statuées),
la lettre écrite tient ses douze axes avec des statuts justes, ses trois
scénarios portent chacun une condition de déclenchement observable, et la
déontologie est respectée à la lettre — l'axe sécurité écrit « la version
réellement déployée n'est pas vérifiable depuis l'extérieur » au lieu d'affirmer
la faille.

### Prochaine étape

Lot 5 — mise en production. Séquence complète en §11. `MAGIC_LINK_SECRET` est
générée en local et reste à renseigner sur Vercel. Prérequis externes inchangés :
DKIM et alias `veille@`, qui conditionnent l'identité d'expédition mais plus le
fait d'envoyer.

### Post-plan — aperçu de veille sur le rapport de scan (2026-08-16)

Le rapport public `/scan/[id]` produit désormais un **aperçu de veille
personnalisée**, de même forme que la lettre abonnée (cinq grands thèmes avec
statut + cap consolider/évoluer/refondre), pour montrer le produit plutôt que
le décrire. Décisions structurantes :

- **Pas de passe de collecte** : le dossier croise les composants du scan avec
  l'intel déjà en base (crons quotidiens) via `decide()` — le même moteur que
  les alertes clients. Une seule passe LLM sans outils (règle 3 respectée),
  coût borné (~1 appel, 6 000 tokens max), pas de recherche web.
- **Non relu, et dit comme tel** : contrairement à la lettre (règle 4),
  l'aperçu s'affiche sans validation humaine. En compensation : le rapport
  porte la mention « non relu » en clair, et la garde `borner()` interdit un
  statut « agir » sans fait red/orange retenu par le croisement déterministe.
- Module isolé `src/sentinelle/apercu/` (dossier pur + schéma + fabrication),
  prompt `src/sentinelle/redaction/apercu-system-prompt.md` (tracé par le glob
  existant), stocké dans `scans.result.apercu` (jsonb, pas de migration),
  étape Inngest séparée dans `scan-async` — son échec laisse le rapport
  intact. Le front interroge tant que l'aperçu est `pending`, dans la borne
  des 120 s existante. Tests : `apercu/dossier.test.ts`.

---

## 11. Séquence de la suite (arrêtée le 2026-08-15)

Trois principes de séquencement, qui expliquent l'ordre choisi :

1. **Rien ne se teste tant que la base est vide.** Le lot 0 passe donc avant
   tout, y compris avant les corrections de la phase 2 bis.
2. **Chaque lot laisse le produit dans un état vérifiable en conditions
   réelles**, pas seulement en tests unitaires. Un lot fini se constate.
3. **Les prérequis externes se lancent maintenant, pas au début du lot qui en
   dépend** (DKIM, alias d'envoi, décisions de tarif). Ils prennent du temps
   humain, pas du temps de développement : les mettre en parallèle est gratuit.

| Lot | Contenu | Durée | Bloqué par |
| --- | --- | --- | --- |
| 0 | Appliquer la migration Neon — **fait le 2026-08-15** | ½ j | — |
| 1 | Phase 2 bis — dette de la phase 2 | ½ j | 0 ✔ |
| 2 | Phase 3 — collecteurs, matching, rédaction — **fait le 2026-08-15** | 4 j | 0, 1 |
| 3 | Phase 4 — admin, envoi, newsletter — **fait le 2026-08-15** | 2,5 j | 2 ✔ |
| 4 | Phase 5 — onboarding, espace client, lancement — **fait le 2026-08-15** | 2 j | 3 ✔ |
| 5 | Mise en production | ½ j | 4 ✔ |

**≈ 10 jours.** La phase 4 perd une demi-journée : le transport d'e-mail est
écrit et vérifié depuis la bascule sur SMTP Google.

### Lot 0 — Appliquer la migration (½ j) · **fait**

Compte rendu et trouvailles : §10, « Lot 0 — migration appliquée ». Le reste de
cette section est conservé comme trace de ce qui était prévu.

Constat du jour : la base Neon répond mais ne contient **aucune table**. Toute
route qui la touche répond 500 — scan, webhook Stripe, tout.

- `drizzle.config.ts` : `process.loadEnvFile(".env.local")` sous `try/catch` en
  tête (drizzle-kit charge `.env`, jamais `.env.local`) et bascule sur
  `DATABASE_URL_UNPOOLED` (le pooler Neon est en mode transaction, il ne
  convient pas au DDL).
- `npm run db:migrate`.

**Fini quand** : les 6 tables existent, et un scan réel parcourt la chaîne
complète — POST `/api/sentinelle/scan` → step Inngest local → `/scan/[id]`
affiche le rapport → la ligne est en base avec son `ipHash`. C'est la première
fois que le produit tournera de bout en bout ; prévoir de la marge pour ce qui
se révélera à cette occasion.

### Lot 1 — Phase 2 bis (½ j)

Les cinq points de `prompts/phases.md`, inchangés sauf un : la section
`/confidentialite` liste désormais **Google** comme sous-traitant d'envoi, pas
Resend. Ordre conseillé à l'intérieur du lot : `platform` d'abord (il touche le
type partagé), la note du rapport ensuite, puis rétention, légal, robots.

### Lot 2 — Phase 3 (4 j), en quatre sous-lots livrables

Découpé pour qu'un arrêt en cours de route laisse quelque chose d'utile.

| Sous-lot | Contenu | Fini quand |
| --- | --- | --- |
| 2a | routeur par écosystème + `endoflife.ts` + cron `collect-daily` | des `intel_items` réels en base, sans aucun client |
| 2b | matching intel × stack | des `alerts` en draft sur le seed, zéro rouge sur une version de confiance moyenne |
| 2c | `osv.ts`, puis `wpscan.ts` / `releases.ts` | double run sans doublon (idempotence prouvée) |
| 2d | rédaction Claude | texte généré sur une alerte réelle, deux garde-fous testés |

Deux points d'infrastructure à ne pas oublier dans 2d, sans quoi ça ne marche
qu'en local : le prompt système vit dans `src/sentinelle/redaction/`, et
`next.config.mjs` n'a **pas encore** d'`outputFileTracingIncludes` — à ajouter
pour la route Inngest.

`ANTHROPIC_API_KEY` est renseignée depuis le 2026-08-15 : 2d n'a plus de
prérequis externe. Reste à installer `@anthropic-ai/sdk`.

Le seed des quatre clients (WordPress, Drupal, Next.js + npm, site sans CMS)
n'est pas un accessoire de test : c'est lui qui prouve l'agnosticité. À écrire
au début de 2b, pas à la fin du lot.

### Lot 3 — Phase 4 (2,5 j) · **fait**

Compte rendu et décisions : §10, « Lot 3 — phase 4 faite ». L'ordre prévu a été
tenu : admin d'abord (sans elle, rien ne peut partir — règle 4), gabarits
ensuite, newsletter en dernier.

Le prérequis externe **n'a pas bloqué le lot et reste à faire** : DKIM activé
dans la console Google Workspace et alias `veille@next-impact.digital` vérifié
en « Envoyer en tant que ». Sans l'alias, Gmail réécrit l'expéditeur sans
prévenir — les envois vérifiés le 2026-08-15 sont donc partis sous l'adresse du
compte authentifié, ce qui est acceptable en test et pas en production.

### Lot 4 — Phase 5 (2 j) · **fait**

Compte rendu et décisions : §10, « Lot 4 — phase 5 faite ». Deux écarts au prévu,
tous deux expliqués là-bas : le lancement (drapeau `AVANT_LANCEMENT`, sitemap,
navigation) avait déjà été fait avec la page `/veille` et n'appartenait donc plus
à ce lot ; et le parcours post-paiement passe par un événement Inngest plutôt que
par le webhook lui-même, ce qui le rend rejouable et indépendant de Stripe.

`MAGIC_LINK_SECRET` est générée en local. Deux gestes restent côté tableau de
bord, listés dans « En parallèle, hors code » : la page de retour du Payment Link
et l'activation du portail de facturation.

### Lot 5 — Mise en production (½ j)

Le lot qu'on oublie systématiquement, et qui ne se découvre qu'en le faisant :

- toutes les variables d'environnement sur Vercel (base, Inngest, Anthropic,
  SMTP Google, Stripe, admin, magic link) ;
- application Inngest enregistrée en production, `INNGEST_SIGNING_KEY` et
  `INNGEST_EVENT_KEY` renseignées, crons visibles dans le tableau de bord ;
- webhook Stripe de production pointé sur l'URL déployée ;
- `npm run check:mail` depuis l'environnement de production ;
- un envoi réel de bout en bout vers une adresse de test.

### En parallèle, hors code

| À faire | Pour quel lot | Qui |
| --- | --- | --- |
| Activer DKIM (console Workspace) | 5 — avant le premier envoi réel à un client | Agathe |
| Créer et vérifier l'alias `veille@` | 5 — idem, puis renseigner `SENTINELLE_MAIL_FROM` | Agathe |
| Page de retour du Payment Link → `/espace/bienvenue?session_id={CHECKOUT_SESSION_ID}` | 5 | Agathe |
| Activer le portail de facturation Stripe (une case dans le tableau de bord) | 5 | Agathe |
| Trancher le tarif — **fait** (19 €/mois) | 4 ✔ | Agathe |
| Décider du régime des clés Stripe | 0 | Agathe |
| Clé WPScan (facultative) | 2c | Agathe |

### Trois décisions à trancher avant le lot 2

**Le tarif : tranché à 19 €/mois** (2026-08-15). C'était déjà la valeur de
`lib/sentinelle-offer.ts` — qui fait autorité et alimente la page comme le
webhook — et celle du Payment Link Stripe ; ce sont les documents qui portaient
encore 9 €, ils ont été alignés. Plus rien à décider ici.

**Les clés Stripe de `.env.local` sont des clés de production** (`rk_live_`,
secret de webhook live), alors que le plan prévoyait le mode test. Un
développement local branché sur la production peut créer de vrais abonnements.
Recommandation : clés test en local, clés live sur Vercel uniquement.

**La relecture humaine borne le nombre de clients**, pas la technique
(règle 4, 24 numéros par an et par client). Ce n'est pas un obstacle au
lancement, mais c'est la variable à surveiller dès les premiers abonnés : à
19 € pour 24 numéros, chaque euro encaissé coûte trois fois plus de relecture
que dans le modèle du pack (29 € pour 12 numéros).

### Ce qui reste volontairement hors plan

L'assainissement des 14 erreurs de types du code vitrine (chantier distinct,
voir E4), l'ajout de Sentinelle à la navigation du site (règle 1 : surface
marketing, demande explicite requise), et le stockage du prompt système en base
pour l'éditer depuis l'admin (évolution phase 4+, pas un prérequis).
