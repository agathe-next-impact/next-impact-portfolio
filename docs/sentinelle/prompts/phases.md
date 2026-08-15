# Prompts de mise en œuvre — à exécuter dans Claude Code, dans l'ordre

Usage : ouvrir le repo du site dans Claude Code, puis coller le prompt de la
phase en cours. Ne lancer une phase que lorsque la définition de fini de la
précédente est vérifiée.

**Révision du 2026-08-15.** Les prompts d'origine décrivaient un produit
WordPress-first à deux paliers. Trois décisions les ont périmés :

1. **La veille doit couvrir toute technologie**, pas seulement WordPress. Le
   scanner l'applique déjà (empreintes génériques, `ecosystem` dans le modèle) ;
   les collecteurs de la phase 3 doivent suivre, sans quoi un abonné Shopify ou
   Next.js paierait sans jamais rien recevoir.
2. **Palier unique à 19 €/mois** : alertes au fil de l'eau + newsletter
   bimensuelle. Plus de `plan=conseil`, plus de blocs réservés à un palier.
3. **Abonnement par Payment Link Stripe**, pas par session Checkout créée
   depuis le rapport de scan.

Sources de vérité, dans cet ordre : `src/sentinelle/db/schema.ts` pour le modèle
(il fait autorité sur `specs/data-model.md`, dont la taxonomie est périmée),
`docs/sentinelle/CLAUDE.md` pour les six règles, ce fichier pour l'exécution.

**Ordre de passage, dépendances et définitions de fini : plan §11.** Ce
fichier-ci dit *comment* faire chaque phase, le plan dit *quand* et *dans quel
ordre*. Le premier geste est l'application de la migration Neon (lot 0) : tant
qu'elle n'est pas faite, rien de ce qui suit n'est testable.

---

## Phase 1 — Fondations · **faite, migration comprise**

Dépendances, schéma Drizzle, `db/client.ts`, `matching/versions.ts` et ses
tests, Inngest branché avec un healthcheck.

Migration appliquée sur Neon le 2026-08-15 (6 tables, 6 enums, 9 index).
`drizzle.config.ts` charge `.env.local` explicitement — drizzle-kit ne lit que
`.env` — et utilise `DATABASE_URL_UNPOOLED`, le pooler Neon étant en mode
transaction, inadapté au DDL.

**Pour développer en local** : `INNGEST_DEV=1` dans `.env.local` est
obligatoire. Le SDK v4 ne devine plus le mode développement ; sans cette
variable il part en mode cloud, l'enregistrement de l'application répond 500 et
aucun événement ne part. Ne jamais la définir en production.

---

## Phase 2 — Scanner public · **faite**

Moteur de détection générique + catalogue d'empreintes (des données, pas du
code), détecteur WordPress profond en exception assumée, rate limit par
empreinte d'IP comptée en base, `scan-async` Inngest, routes POST/GET/PATCH,
pages `/scan` et `/scan/[id]`.

Vérifié sur des sites réels de neuf stacks : Webflow, Next.js, Drupal 10, Wix,
Squarespace, SPIP 4.4.19, Shopify (×2), WordPress. Un site sur neuf refuse la
connexion (protection anti-bot) — rendu comme un résultat, pas comme un plantage.

---

## Phase 2 bis — Dette de la phase 2 · **faite** (2026-08-15)

Compte rendu, décisions et points laissés ouverts : plan §10, « Lot 1 — phase
2 bis soldée ». Le détail ci-dessous est conservé comme trace de la commande.

Cinq points laissés ouverts. Les deux premiers sont visibles par un client, les
trois suivants engagent juridiquement.

1. **Corriger la note du rapport.** Dans `scanner/index.ts`, la note est
   conditionnée à `isWordPress` et non à « aucun CMS détecté » : un site Drupal
   ou Shopify lit « Ce site n'utilise pas de CMS détecté publiquement » à trois
   lignes d'une ligne qui affiche « Drupal 10 ». Vérifié en conditions réelles.
   Il faut trois cas et non deux :
   - WordPress → énumération partielle des extensions (note actuelle) ;
   - autre CMS détecté → « les composants internes de <CMS> ne sont pas visibles
     publiquement, la fiche se complète à l'activation » ;
   - aucun CMS ni e-commerce détecté → fiche déclarative.
   Test de non-régression sur une fixture Drupal et une fixture Shopify.

2. **Remplacer `isWordPress: boolean` par `platform: string | null`** dans
   `ScanResult`. C'est le seul endroit du modèle qui nomme une technologie, ce
   qui contredit la règle 6 et la consigne d'agnosticité. `platform` porte le
   slug du CMS ou du méta-framework détecté, `null` si aucun. Adapter le rapport
   et `scan-async`.

3. **Implémenter `retention/policy.ts` et le cron `retention-daily`** (03:00
   Europe/Paris), conformément au §9 du plan de mise en œuvre. Le module est
   vide alors que son propre commentaire l'annonce en phase 2, et `ipHash` /
   `userAgent` sont aujourd'hui conservés sans limite alors que la politique
   annonce 24 h. Durées : source unique en constantes, fonctions pures testées
   avec une horloge injectée, plus `deleteAllDataFor({ email | clientId })`.

4. **Ajouter la section Sentinelle à `/confidentialite`** : finalités
   (diagnostic à la demande, surveillance contractuelle), bases légales (mesure
   précontractuelle pour le scan, exécution du contrat pour la surveillance),
   sous-traitants (Neon, Inngest, Google, Anthropic, Stripe) et le tableau des
   durées. Le `PATCH` capture déjà des adresses e-mail : ce point n'est pas
   reportable.

5. **Exclure `/scan`, `/admin` et `/espace` de `robots.txt`.** Le `noindex` du
   layout couvre l'indexation, le plan demandait les deux ceintures.

Fini quand : `npm test` vert, un scan sur un site Drupal et un site Shopify
affiche une note exacte, la page de confidentialité est à jour, le cron de
rétention tourne en local et journalise ce qu'il purge.

---

## Phase 3 — Collecteurs agnostiques, matching, rédaction · **faite** (2026-08-15)

Compte rendu, décisions et constats : plan §10, « Lot 2 — phase 3 faite ». Le
détail ci-dessous est conservé comme trace de la commande. Deux écarts assumés y
sont expliqués : le repli Wordfence n'existe plus, et `releases.ts` ne traite pas
le cœur de WordPress.

C'est ici que se joue la promesse « toute technologie ». Le scan est agnostique
depuis la phase 2 ; la veille ne l'est pas encore.

### 1. Collecteurs, routés par écosystème

Le couple `(type, ecosystem)` d'un `stack_item` dit où chercher. Écrire un
routeur dans `collectors/index.ts` qui dérive des `stack_items` actifs la liste
des produits à interroger, et n'appelle que les collecteurs concernés. Un
écosystème sans collecteur ne produit rien et le journalise — jamais une erreur.

- **`collectors/endoflife.ts` — la source agnostique, à écrire en premier.**
  endoflife.date, gratuit, sans clé. Couvre PHP, Node, nginx, Apache, WordPress,
  Drupal, Laravel, Symfony, Django, Angular, Vue, Bootstrap, jQuery… Produit des
  `intel_items` de kind `eol` (fin de support, avec la date) et `release`
  (dernière version connue d'une branche). C'est la source qui produira le plus
  d'alertes utiles, et la seule qui serve un client dont le site n'a pas de CMS.
- **`collectors/osv.ts`** — OSV.dev, gratuit, sans clé, `POST /v1/querybatch`.
  Vulnérabilités par écosystème de paquets (npm, Packagist, PyPI). Couvre les
  `js_library`, `framework` et `ecommerce` hors WordPress.
- **`collectors/wpscan.ts`** — WordPress seul : core, extensions, thèmes.
  Fallback Wordfence Intelligence si `WPSCAN_API_KEY` est absente.
- **`collectors/releases.ts`** — api.wordpress.org pour les dernières versions
  WordPress. Pour les autres écosystèmes, la dernière version vient
  d'endoflife.date : ne pas écrire un collecteur par technologie.

Tous idempotents via l'index `(source, external_id)`, testés par un double run.
Chacun dans son propre step Inngest, pour que le retry soit indépendant.

### 2. Cron `collect-daily` (06:00 Europe/Paris)

Un step par collecteur, puis le matching. Le nombre d'appels sortants doit être
borné et journalisé : le jour où un client aura 60 composants, ce cron ne doit
pas partir en 60 requêtes par source.

### 3. Matching — trois règles qui protègent la crédibilité

Jointure sur `(type, ecosystem, slug)`, plus seulement sur le slug : deux
technologies homonymes dans deux écosystèmes ne doivent jamais se croiser.

- Pas d'alerte si `stack_item.version` est nulle.
- **Pas de verdict rouge si `versionConfidence` n'est pas `high`.** Le scanner
  distingue déjà « le composant est-il là ? » de « la version est-elle sûre ? » ;
  c'est la seconde qui conditionne une comparaison de plage. Une version
  probable peut produire un orange « à vérifier », jamais un rouge.
- Plage illisible ou version hors plage → non affecté. Le doute ne produit rien.

Tests vitest : version dans la plage, hors plage, version nulle, version
probable, doublon, homonymie inter-écosystèmes.

### 4. Rédaction

`@anthropic-ai/sdk`, modèle configurable par `ANTHROPIC_MODEL`, défaut
`claude-opus-5`. **Sortie structurée** (schéma JSON) plutôt que « réponds en
JSON » : le JSON est alors valide par construction et le guard zod ne sert plus
qu'aux règles métier. Prompt système chargé depuis
`src/sentinelle/redaction/verdict-system-prompt.md` (dans `src/`, pas dans
`docs/` : le file tracing Vercel n'embarque pas `docs/`), déclaré dans
`outputFileTracingIncludes`.

Contexte transmis au modèle : l'alerte, l'intel, le `stack_item`, le secteur et
les notes du client. **Jamais le nom ni l'e-mail du client** — le prompt n'en a
pas besoin, et Anthropic est sous-traitant.

Deux garde-fous non vérifiables par un schéma, à tester côté code : pas de rouge
hors plage ou hors sévérité haute, et aucun composant cité qui ne figure pas
dans le contexte fourni.

**Définition de fini** — c'est elle qui prouve l'agnosticité. Seeder quatre
clients de stacks différentes : un WordPress, un Drupal, un Next.js avec des
dépendances npm, un site sans CMS servi par nginx avec PHP. `collect-daily`
doit produire au moins une alerte pertinente pour chacun des trois premiers,
au moins une alerte de fin de support pour le quatrième, et **zéro alerte rouge
fondée sur une version de confiance moyenne**.

---

## Phase 4 — Admin de validation, envoi, newsletter (~3 j)

1. **Admin** `app/(sentinelle)/admin/sentinelle` : protection par
   `SENTINELLE_ADMIN_PASSWORD` en cookie httpOnly, vérifiée dans un layout
   serveur du groupe admin (pas dans un composant client), `noindex`. Liste des
   drafts groupés par client, aperçu du rendu e-mail via
   `@react-email/render`, actions valider / éditer / rejeter. Garde-fou :
   `validated → sent` impossible si `finalText` est vide.
2. **`emails/AlertEmail.tsx`** en React Email : pastille de verdict, titre,
   corps, « ce que ça change pour vous », action recommandée avec mention du
   « faisable seul » ou d'une fourchette, pied fixe. Sobre, lisible dans un
   client mail, cohérent avec l'identité du site. Ne jamais utiliser
   `lib/email-template.ts` ni `lib/sendMail.ts` de la vitrine.
3. **Envoi : déjà écrit.** `emails/send.ts` (SMTP Google, transport propre au
   produit, `SENTINELLE_SMTP_*`) et `emails/config.ts` existent et sont testés
   — voir le plan §10. Il reste les gestes hors code, à faire avant le premier
   envoi réel : activer DKIM dans la console Google Workspace, créer et vérifier
   l'alias `veille@next-impact.digital` en « Envoyer en tant que », puis
   renseigner `SENTINELLE_MAIL_FROM` et `SENTINELLE_MAIL_REPLY_TO`. Sans alias
   vérifié, Gmail réécrit silencieusement l'expéditeur.
4. **Newsletter bimensuelle**, pas un digest mensuel. Cron le 1er et le 15 à
   07:00 Europe/Paris. La clé de période vient de `newsletter/period.ts` (déjà
   écrit et testé) : `"2026-08-1"` / `"2026-08-2"`, sans quoi l'index unique
   `(clientId, period)` rejetterait le second envoi du mois. Blocs 1, 2 et 5
   (état du stack, delta depuis le numéro précédent, radar des fins de support à
   six mois) assemblés **sans LLM**, depuis la base. Blocs 3 et 4 (veille
   contextualisée, recommandation du numéro) générés en draft. Palier unique :
   tous les blocs pour tout le monde, aucun branchement sur `plan`.

Fini : cycle réel sur un client test — draft → validation → e-mail reçu ;
numéro de newsletter → relecture → e-mail reçu.

---

## Phase 5 — Onboarding et espace client (~2 j)

Le paiement est déjà en place : Payment Link Stripe, webhook
`/api/sentinelle/stripe/webhook` traitant `checkout.session.completed` et
`customer.subscription.deleted`, adresse du site collectée par un champ
personnalisé obligatoire. Il ne reste donc que l'aval.

1. **Onboarding post-paiement** : page de complétion de fiche — composants non
   détectables publiquement, SaaS, hébergeur exact, secteur, notes — créant des
   `stack_items` de source `declared`. C'est ce qui fait passer la surveillance
   de « 50 à 70 % des composants » à « exacte », et c'est la promesse faite sur
   la page d'offre. E-mail de bienvenue récapitulant la fiche.
2. **Espace client** `app/(sentinelle)/espace` : magic link (token HMAC,
   15 min, stocké haché, supprimé à l'usage), liste des alertes reçues, fiche de
   stack, lien vers le customer portal Stripe.
3. **Brancher le CTA du rapport de scan** sur le Payment Link, avec le scanId en
   paramètre pour rapprocher le scan de l'abonnement.
4. **Lancement de la page d'offre** : passer `AVANT_LANCEMENT` à `false` dans
   `app/[locale]/sentinelle/page.tsx`, ajouter l'entrée au sitemap, décider de
   l'entrée dans la navigation. Les trois gestes ensemble, jamais séparément.

Fini : parcours complet en mode test — scan → rapport → paiement → fiche créée →
onboarding → première alerte reçue.
