# src/sentinelle — produit Sentinelle

Code du produit de veille par abonnement, isolé du site vitrine pour pouvoir
être extrait en sous-domaine sans réécriture.

Spécifications : `docs/sentinelle/` (CLAUDE.md, specs/, prompts/).
Plan d'exécution et écarts constatés : `docs/sentinelle/plan-mise-en-oeuvre.md`.

## Règle d'isolation

La dépendance est **à sens unique** :

- Sentinelle **peut** importer le design system du site (c'est demandé par la
  spec de la phase 2 : réutiliser l'existant, mode sombre compris).
- Le site vitrine ne doit **jamais** importer `@sentinelle/*`. Cette règle est
  vérifiée mécaniquement par `npm run check:sentinelle`, branché sur le build.

Imports vitrine autorisés, tenus à jour ici pour que le coût d'extraction reste
visible :

| Import | Utilisé par | À l'extraction |
| --- | --- | --- |
| `@/components/theme-provider` | `app/(sentinelle)/layout.tsx` | à copier (une trentaine de lignes autour de next-themes) |
| `app/globals.css` | `app/(sentinelle)/layout.tsx` | à copier (tokens du design system Blueprint) |
| `@/components/ui/*` | pages produit (phase 2+) | à copier, ou à extraire en paquet partagé |
| `@/lib/sentinelle-offer` | `billing/offer.ts` | à déplacer dans `billing/` — la page marketing restera côté vitrine |

Ce dernier mérite une explication : les faits publics de l'offre (montant,
libellé, URL du Payment Link) vivent côté vitrine **exprès**. La page `/sentinelle`
est une page marketing, elle ne peut pas importer le code du produit sans violer
la règle ci-dessus. La dépendance est donc inversée : c'est `billing/offer.ts`
qui lit `lib/sentinelle-offer.ts`. Résultat, le montant affiché sur la page et
celui vérifié par le webhook ne peuvent pas diverger.

Ce qui n'est **jamais** partagé : `lib/sendMail.ts` et `lib/email-template.ts`.
Sentinelle envoie par le même fournisseur que la vitrine — SMTP Google — mais
avec son propre transport (`emails/`), ses propres variables
`SENTINELLE_SMTP_*` et **aucun repli** sur les `NODEMAILER_*`. Un repli
silencieux ferait partir la veille sous l'identité du site le jour d'un oubli
de variable. La coexistence des deux piles est volontaire (voir plan §2, E7, et
§10 pour la bascule Resend → Google du 2026-08-15).

## Alias

`@sentinelle/*` → `src/sentinelle/*` (déclaré dans `tsconfig.json` et
`vitest.config.mts`). Tous les imports internes passent par cet alias : le jour
de l'extraction, c'est une ligne à changer.

## Modules

| Dossier | Rôle | Phase |
| --- | --- | --- |
| `db/` | schéma Drizzle, connexion Neon, migrations | 1 ✔ |
| `matching/` | comparaison de versions, croisement intel × stack | 1 ✔ (versions) / 3 |
| `inngest/` | client, catalogue d'événements, fonctions de fond | 1 ✔ |
| `scanner/` | détection passive, agnostique (moteur + empreintes) | 2 ✔ |
| `retention/` | politique de conservation et purge | 2 |
| `newsletter/` | cadence du 1er et du 15, constaté d'un numéro | 1 ✔ / 4 ✔ |
| `lettre/` | lettre de veille bimensuelle : collecte web puis rédaction | 4 ✔ (refonte) |
| `billing/` | abonnement via Payment Link Stripe + webhook | ✔ (portail client en 5) |
| `collectors/` | WPScan/Wordfence, api.wordpress.org, endoflife.date | 3 ✔ |
| `redaction/` | appel API Claude, garde zod sur la sortie | 3 ✔ |
| `emails/` | transport SMTP Google, gabarits React Email, rendu HTML + texte | 4 ✔ |
| `admin/` | session, file de validation, cycle draft → validated → sent | 4 ✔ |
| `access/` | liens de connexion à usage unique, session de l'espace client | 5 ✔ |
| `onboarding/` | fiche déclarative, amorçage depuis un scan, bienvenue | 5 ✔ |
| `espace/` | lectures de l'espace abonné, portail de facturation Stripe | 5 ✔ |

`lettre/` mérite la note la plus longue, parce que sa forme est son garde-fou.
Le numéro n'est plus un relevé de surveillance mais une lettre de consultant :
cinq axes, tendances qualifiées pour ce site, trois scénarios, une fenêtre de
décision. Elle a donc besoin d'actualité extérieure — ce que la règle 3
(« le LLM ne connaît rien ») semble interdire.

Le découpage résout la contradiction sans l'assouplir :

| Passe | Outils | Écrit | Ce qui la borne |
| --- | --- | --- | --- |
| `collecte.ts` | recherche et lecture web (`max_uses` : 30 et 8) | rien | le budget côté serveur, pas une consigne |
| `redaction.ts` | aucun | la lettre | le dossier collecté, et lui seul |

Entre les deux, `guards.ts` applique **deux régimes** : ce que la lettre affirme
du site est borné par le vocabulaire de la fiche et du dossier ; ce qu'elle dit
du marché est borné par le sourçage (aucune URL hors dossier, aucune source sans
date). Le second régime est ce qui permet à un numéro de nommer des technologies
que le client n'a pas — sans lui, l'ancien garde-fou d'alerte refuserait chaque
numéro. Ce que le code ne vérifie pas : l'attribution. C'est la relecture.

Trois pièges qui ne se voient qu'en production, et que le code traite :

- **`pause_turn` n'est pas une erreur.** Une boucle d'outils serveur s'arrête au
  bout de dix itérations et attend qu'on lui rende la main ; avec trente
  recherches on la rencontre à chaque numéro. `collecte.ts` reprend la
  conversation sans ajouter de message.
- **Un step Inngest par client.** Chaque step est une invocation HTTP distincte,
  donc son propre `maxDuration` ; vingt clients dans un seul step ne verraient
  jamais le vingtième.
- **Le dossier est conservé à côté de la lettre** dans `digests.blocks`. Une
  lettre sans son dossier n'est plus vérifiable six mois plus tard, seulement
  croyable.

`admin/` mérite une note : `session.ts` et `content.ts` sont **purs et testés**
(signature de jeton, contrat de contenu), `queue.ts` et `actions.ts` touchent la
base, et la glue Next — cookies, redirections, formulaires — vit dans
`app/(sentinelle)/admin/`. La règle 4 (« aucune alerte ne part sans validation
humaine ») est implémentée dans `actions.ts` sous forme de refus, pas de
consigne : on ne valide pas un contenu incomplet, on n'envoie que ce qui est
`validated`, jamais deux fois, jamais à une fiche résiliée, effacée ou de
démonstration.

Deux points à ne pas « harmoniser » :

- **Chaque action serveur revérifie la session.** Une action serveur est une URL
  publique ; la garde du layout protège l'affichage, pas l'exécution. Vaut aussi
  pour l'espace client.
- **Le statut `sent` s'écrit après l'envoi**, jamais avant. Un doublon visible
  dans la file vaut mieux qu'une alerte marquée envoyée que personne n'a reçue.

`access/` et `onboarding/` suivent le même découpage : `token.ts`, `session.ts`
et `stack.ts` sont purs et testés, `store.ts` touche la base, la glue Next vit
dans `app/(sentinelle)/espace/`. Trois invariants y sont portés par du code, pas
par des consignes :

- **Le déclaré ne se fait jamais écraser par le détecté** — clause `setWhere` de
  l'upsert, donc en SQL. Un client qui corrige une version doit voir sa
  correction tenir au prochain scan, sans quoi il ne la fera pas deux fois.
- **Un lien de connexion ne sert qu'une fois** — la suppression conditionnelle
  de la ligne fait office de verrou, y compris entre deux instances serverless.
- **Le formulaire de connexion ne dit jamais si une adresse est cliente.** Même
  message dans tous les cas ; le détail part au journal, pas à l'écran.

## Commandes

```sh
npm test                    # typecheck du périmètre Sentinelle + vitest
npm run test:watch          # vitest en watch
npm run typecheck:sentinelle
npm run check:sentinelle    # garde-fou d'isolation
npm run check:mail          # authentification SMTP Google, sans rien envoyer
npm run db:generate         # génère une migration depuis le schéma
npm run db:migrate          # applique les migrations (DATABASE_URL requise)
npm run db:studio           # explorateur de base Drizzle

# Serveur Inngest local. L'URL est obligatoire : nos fonctions ne sont pas sur
# la route par défaut. Et `INNGEST_DEV=1` doit être dans .env.local, sinon le
# SDK v4 part en mode cloud et n'envoie rien.
npx inngest-cli@latest dev -u http://localhost:3000/api/sentinelle/inngest
```

## Ajouter une technologie à la veille

`src/sentinelle/scanner/fingerprints.ts` est un fichier de **données**. Pour
qu'une nouvelle technologie soit détectée puis surveillée, il n'y a pas de code
à écrire :

```ts
{
  slug: "matomo",            // identifiant dans son écosystème
  label: "Matomo",           // ce que lit le client
  type: "analytics",         // nature — voir stackItemTypeEnum
  ecosystem: "npm",          // où chercher ses failles ; null = pas de veille
  signals: [{ on: "html", match: /matomo\.js/i, confidence: "high" }],
}
```

Deux règles de rédaction, parce qu'une fausse détection devient une fausse
alerte : `confidence: "high"` est réservé aux signatures qu'une autre techno ne
peut pas produire par accident, et une version n'est capturée que si la source
la donne vraiment — `version: null` vaut mieux qu'un numéro inventé.

## Deux règles à ne pas contourner

**En cas de doute, on n'alerte pas.** `matching/versions.ts` renvoie « non
affecté » dès qu'une version est inconnue ou une plage illisible. Un faux
négatif se rattrape au digest mensuel ; une fausse alerte rouge coûte un client.

**L'unicité est dans le moteur, pas dans le code.** `alert_client_intel` et
`intel_source_external` sont des index uniques : ils garantissent qu'un client
n'est alerté qu'une fois par fait, même si le code applicatif se trompe. Ne pas
les retirer pour « simplifier une insertion ».
