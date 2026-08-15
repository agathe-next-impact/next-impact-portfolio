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
Sentinelle doit envoyer via Resend + React Email sur un sous-domaine dédié.

C'est **volontaire et cohérent avec l'isolation** — mais à assumer et à écrire
dans la doc, sinon une future session « harmonisera » les deux et cassera
l'extraction. Règle : `lib/sendMail.ts` ne sert jamais à Sentinelle,
`@sentinelle/emails/send` ne sert jamais à la vitrine.

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
   Resend + sous-domaine d'envoi avec SPF/DKIM, Stripe en mode test, WPScan.

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

### Phase 3 — Collecteurs, matching, rédaction (~4 j)

Le prompt du pack, plus :

- Chaque collecteur en step Inngest distinct (retry indépendant), idempotence
  garantie par l'index `(source, external_id)` et testée par un double run.
- Couche rédaction : SDK `@anthropic-ai/sdk`, **sortie structurée** plutôt que
  « réponds en JSON » (voir §6) — le guard zod reste, mais pour les règles
  métier (ex. `red` seulement si version dans la plage **et** sévérité
  high/critical), pas pour le parsing.
- Journalisation du couple prompt/version + `generatedText` : c'est la donnée
  qui fera évoluer le prompt.
- Seed de développement (`scripts/seed-sentinelle.ts`) : 1 client fictif,
  3 `stack_items` dont un vulnérable connu — c'est la définition de fini du pack.

### Phase 4 — Admin et envoi (~3 j)

Le prompt du pack, plus :

- Auth admin : cookie httpOnly + `SENTINELLE_ADMIN_PASSWORD`, protection au
  niveau d'un layout serveur du groupe admin (pas d'un composant client), et
  `noindex`.
- Rendu des e-mails prévisualisé dans l'admin via `@react-email/render`.
- Domaine d'envoi : `sentinelle.next-impact.digital`, `reply-to` vers
  l'adresse d'Agathe, SPF/DKIM vérifiés avant le premier envoi réel.
- Garde-fou : impossible de passer `validated → sent` sans `finalText` non vide.

### Phase 5 — Stripe et onboarding (~3 j)

Le prompt du pack, plus :

- Webhook : `runtime = "nodejs"`, `dynamic = "force-dynamic"`, corps brut via
  `await req.text()`, vérification de signature obligatoire, idempotence par
  `event.id` (table ou contrainte d'unicité) — Stripe rejoue.
- Magic link : token signé (HMAC + expiration 15 min), stocké haché.
- CTA du rapport de scan branché sur le Checkout réel (fin du placeholder posé
  en phase 2).

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

Phase 0 : ½ j · Phase 1 : 2 j · Phase 2 : 3 j · Phase 3 : 4 j · Phase 4 : 3 j ·
Phase 5 : 3 j — soit **≈ 15,5 jours** de travail effectif, recette comprise.
C'est plus large que les « 3 semaines » du pack parce que j'y compte les
écarts du §2 et la recette réelle entre chaque phase.

Coûts de fonctionnement au lancement : Neon et Inngest gratuits, Resend 0–20 €,
WPScan ~30 €, Anthropic quelques euros → objectif < 50 €/mois tenu.

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
Resend, Anthropic, Stripe) et le tableau de durées ci-dessus.

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

### Prochaine étape

Phase 2 — scanner public. Décision à confirmer avant de commencer : scan
synchrone (sans Inngest ni polling) ou asynchrone comme prévu au pack. Le
premier fait gagner deux jours et reste compatible avec la base.
