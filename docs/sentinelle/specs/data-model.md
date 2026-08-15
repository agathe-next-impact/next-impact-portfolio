# Modèle de données — schéma Drizzle de référence

> **Partiellement périmé depuis le 2026-08-15. La référence est désormais
> `src/sentinelle/db/schema.ts`**, qui documente ses écarts en tête de fichier.
> Ce document reste utile pour les intentions et la requête de matching de
> référence, pas pour les types.
>
> Trois écarts à connaître avant de lire :
>
> 1. **`stackItemTypeEnum` a changé de nature.** La taxonomie ci-dessous
>    (`wp_core`, `wp_plugin`, `wp_theme`, `php`, `frontend`) mélangeait la
>    nature d'un composant et son écosystème, ce qui interdisait de surveiller
>    un module Drupal, un paquet npm ou un serveur nginx. La nature vit
>    maintenant dans l'enum (`cms`, `cms_plugin`, `framework`, `runtime`,
>    `server`…), l'écosystème dans une colonne `ecosystem` portée par
>    `stack_items` **et** `intel_items`. C'est ce couple qui dit à un collecteur
>    où chercher.
> 2. **`planEnum` n'a plus qu'une valeur** (`veille`) : palier unique à 19 €/mois.
>    Aucun code ne doit brancher dessus tant qu'il en est ainsi.
> 3. **`digests.period`** vaut `"2026-08-1"` / `"2026-08-2"` et non `"2026-08"` :
>    deux envois par mois, l'index unique `(clientId, period)` rejetterait le
>    second.
>
> S'y ajoutent les trois écarts déjà documentés dans `schema.ts` : `ipHash` et
> `userAgent` sur `scans`, `onDelete: cascade`, index de lecture.

Le schéma ci-dessous est la référence à implémenter dans
`src/sentinelle/db/schema.ts`. Les commentaires font partie de la spec.

```typescript
import {
  pgTable, uuid, text, timestamp, jsonb, boolean, integer, pgEnum, uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────

export const planEnum = pgEnum("plan", ["surveillance", "conseil"]); // 29 / 79
export const stackItemTypeEnum = pgEnum("stack_item_type", [
  "wp_core", "wp_plugin", "wp_theme", "php", "hosting", "frontend",
  "saas",            // cercle 2 — présent dès le départ, non exploité au MVP
  "competitor_url",  // cercle 3 — idem
]);
export const stackItemSourceEnum = pgEnum("stack_item_source", [
  "scanned",   // détecté par le scanner
  "declared",  // déclaré par le client à l'onboarding
]);
export const intelKindEnum = pgEnum("intel_kind", [
  "vulnerability", "release", "eol", "changelog", "page_diff",
]);
export const alertStatusEnum = pgEnum("alert_status", [
  "draft", "validated", "sent", "dismissed", "resolved",
]);
export const verdictEnum = pgEnum("verdict", ["green", "orange", "red", "info"]);

// ─── Acquisition ─────────────────────────────────────────────────────────

export const scans = pgTable("scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  status: text("status").notNull().default("pending"), // pending|running|done|failed
  result: jsonb("result"),          // ScanResult sérialisé (composants détectés)
  leadEmail: text("lead_email"),    // rempli à la capture — nullable
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Clients & stack ─────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  company: text("company"),
  siteUrl: text("site_url").notNull(),
  sector: text("sector"),                 // contexte pour la rédaction LLM
  notes: text("notes"),                   // mémoire libre (échanges, contexte)
  plan: planEnum("plan").notNull().default("surveillance"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stackItems = pgTable("stack_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").notNull().references(() => clients.id),
  type: stackItemTypeEnum("type").notNull(),
  // Identifiant canonique du composant : slug wordpress.org pour les plugins
  // ("contact-form-7"), "wordpress" pour le core, "php", nom du SaaS,
  // URL pour competitor_url. C'est LA clé de jointure avec intel_items.
  slug: text("slug").notNull(),
  label: text("label").notNull(),          // nom affichable ("Contact Form 7")
  version: text("version"),                // version courante connue — nullable
  source: stackItemSourceEnum("source").notNull(),
  meta: jsonb("meta"),                     // licence, date expiration, etc.
  watchEnabled: boolean("watch_enabled").notNull().default(true),
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("stack_client_slug_type").on(t.clientId, t.slug, t.type),
]);

// ─── Intelligence collectée ──────────────────────────────────────────────

export const intelItems = pgTable("intel_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: intelKindEnum("kind").notNull(),
  source: text("source").notNull(),        // "wpscan" | "wordpress.org" | ...
  externalId: text("external_id").notNull(), // id source (CVE-..., version...)
  // Ciblage : quel composant est concerné
  targetSlug: text("target_slug").notNull(),
  targetType: stackItemTypeEnum("target_type").notNull(),
  affectedRange: text("affected_range"),   // ex. "< 6.7.0" — null si N/A
  fixedIn: text("fixed_in"),
  severity: text("severity"),              // low|medium|high|critical — si dispo
  title: text("title").notNull(),
  raw: jsonb("raw").notNull(),             // payload source complet — audit trail
  publishedAt: timestamp("published_at"),
  collectedAt: timestamp("collected_at").notNull().defaultNow(),
}, (t) => [
  // Idempotence des collecteurs : relançables sans doublons
  uniqueIndex("intel_source_external").on(t.source, t.externalId),
]);

// ─── Alertes (le croisement) ─────────────────────────────────────────────

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").notNull().references(() => clients.id),
  stackItemId: uuid("stack_item_id").notNull().references(() => stackItems.id),
  intelItemId: uuid("intel_item_id").notNull().references(() => intelItems.id),
  status: alertStatusEnum("status").notNull().default("draft"),
  verdict: verdictEnum("verdict"),          // proposé par le LLM, éditable
  generatedText: text("generated_text"),    // sortie LLM brute (audit)
  finalText: text("final_text"),            // texte validé/édité — celui envoyé
  recommendedAction: text("recommended_action"),
  sentAt: timestamp("sent_at"),
  resolvedAt: timestamp("resolved_at"),     // pour le suivi "recos passées"
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  // Un client n'est alerté qu'une fois par fait
  uniqueIndex("alert_client_intel").on(t.clientId, t.intelItemId),
]);

// ─── Digests mensuels ────────────────────────────────────────────────────

export const digests = pgTable("digests", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").notNull().references(() => clients.id),
  period: text("period").notNull(),         // "2026-08"
  status: alertStatusEnum("status").notNull().default("draft"),
  blocks: jsonb("blocks").notNull(),        // { health, delta, watch, reco, radar }
  finalHtml: text("final_html"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("digest_client_period").on(t.clientId, t.period),
]);
```

## Points d'implémentation

- **Le slug est le contrat du système** : scanner, collecteurs et matching
  doivent produire/consommer les mêmes slugs canoniques (slug wordpress.org
  pour les plugins). Une fonction `normalizeSlug()` unique, testée.
- **Comparaison de versions** (`matching/versions.ts`) : les plugins WP ne
  respectent pas toujours semver. Implémenter une comparaison tolérante
  (segments numériques) + parsing des plages ("< 6.7", ">= 2.0 < 2.4").
  Tests vitest exhaustifs — c'est le code le plus critique du produit.
- **Requête de matching de référence** : intel non encore alertée × stack_items
  actifs joints sur (targetSlug, targetType), filtre plage de version en TS
  après la jointure (la plage n'est pas exploitable en SQL simple).
- **`alerts.generatedText` vs `finalText`** : toujours conserver les deux —
  c'est l'audit trail de la validation humaine et ta donnée d'amélioration
  des prompts.
```
