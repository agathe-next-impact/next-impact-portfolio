import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Schéma de référence : docs/sentinelle/specs/data-model.md.
// Les commentaires de la spec font partie du contrat et sont repris ici.
//
// Trois écarts assumés par rapport à la spec :
//   - `scans.ipHash` / `scans.userAgent` : la spec du scanner exige un rate
//     limit par IP mais le modèle ne prévoyait aucun endroit pour le compter, et
//     la stack n'a ni Redis ni KV. On stocke un SHA-256 de l'IP + sel serveur
//     (jamais l'IP en clair), purgé à 24 h. Voir plan-mise-en-oeuvre.md §2 (E5).
//   - `onDelete: "cascade"` sur les clés étrangères vers `clients` et
//     `stackItems` : la politique de conservation (§9 du plan) prévoit un
//     effacement sec à la résiliation. Sans cascade, supprimer un client
//     échouerait sur ses alertes et l'effacement resterait théorique.
//     `alerts.intelItemId` n'est PAS en cascade : un fait de veille ne se
//     supprime pas, et une suppression accidentelle doit échouer bruyamment.
//   - index de lecture (`createdAt`, `slug/type`, `status`) : purge de
//     rétention, rate limit, matching et file de validation lisent tous par ces
//     colonnes.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ────────────────────────────────────────────────────────────────

// Offre à palier unique : Sentinelle 19 €/mois, newsletter bimensuelle (deux
// envois par mois) + alertes au fil de l'eau. Remplace la grille 29 €/79 € de
// specs/architecture.md (décision du 2026-08-15).
//
// La colonne `plan` est conservée bien qu'elle n'ait qu'une valeur : elle est
// le point d'accroche documenté du modèle et ajouter une valeur plus tard est
// un simple ALTER TYPE. En revanche, tant qu'il n'y a qu'un palier, aucun code
// ne doit brancher dessus — ce serait du code mort.
export const planEnum = pgEnum("plan", ["veille"]);
// Taxonomie volontairement agnostique : la veille doit pouvoir suivre n'importe
// quelle technologie, pas seulement WordPress. Le pack d'origine typait
// « wp_core / wp_plugin / wp_theme / php / frontend » ; ces valeurs disaient à
// la fois la NATURE du composant et son écosystème, ce qui interdisait de
// surveiller un module Drupal, un paquet npm ou un serveur nginx.
//
// La nature vit désormais ici, l'écosystème dans la colonne `ecosystem`
// (« wordpress », « npm », « packagist », « drupal », « endoflife »…). C'est ce
// couple qui dit à un collecteur où chercher : un `cms_plugin` d'écosystème
// `wordpress` se cherche chez WPScan, une `js_library` d'écosystème `npm` chez
// OSV. Ajouter une technologie = ajouter une empreinte et, au besoin, un
// écosystème — jamais refondre le modèle (règle 6 du CLAUDE.md).
export const stackItemTypeEnum = pgEnum("stack_item_type", [
  "cms", // WordPress, Drupal, Shopify, Ghost…
  "cms_plugin", // extension d'un CMS
  "cms_theme",
  "framework", // Next.js, Nuxt, Laravel, Symfony…
  "js_library", // jQuery, Bootstrap, Alpine…
  "runtime", // PHP, Node
  "server", // nginx, Apache, LiteSpeed…
  "hosting", // OVH, o2switch, Vercel, Netlify…
  "cdn", // Cloudflare, Fastly, Akamai…
  "ecommerce", // WooCommerce, PrestaShop, Magento…
  "analytics", // GA4, Matomo, Plausible…
  "saas", // cercle 2 — présent dès le départ, non exploité au MVP
  "competitor_url", // cercle 3 — idem
]);
export const stackItemSourceEnum = pgEnum("stack_item_source", [
  "scanned", // détecté par le scanner
  "declared", // déclaré par le client à l'onboarding
]);
export const intelKindEnum = pgEnum("intel_kind", [
  "vulnerability",
  "release",
  "eol",
  "changelog",
  "page_diff",
]);
export const alertStatusEnum = pgEnum("alert_status", [
  "draft",
  "validated",
  "sent",
  "dismissed",
  "resolved",
]);
export const verdictEnum = pgEnum("verdict", ["green", "orange", "red", "info"]);

// ─── Acquisition ─────────────────────────────────────────────────────────

export const scans = pgTable(
  "scans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    status: text("status").notNull().default("pending"), // pending|running|done|failed
    result: jsonb("result"), // ScanResult sérialisé (composants détectés)
    leadEmail: text("lead_email"), // rempli à la capture — nullable
    // Écart spec : anti-abus du scanner public. SHA-256(ip + SCAN_IP_SALT),
    // jamais l'IP. Remis à NULL par la purge à 24 h.
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("scans_ip_hash_created_at").on(t.ipHash, t.createdAt)],
);

// ─── Clients & stack ─────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  company: text("company"),
  siteUrl: text("site_url").notNull(),
  sector: text("sector"), // contexte pour la rédaction LLM
  notes: text("notes"), // mémoire libre (échanges, contexte)
  plan: planEnum("plan").notNull().default("veille"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  active: boolean("active").notNull().default(true),
  // Date de résiliation. Sans elle, « effacement à J+3 mois » (§9 du plan) n'est
  // pas implémentable : `active: false` dit qu'un abonnement s'est arrêté, pas
  // quand. Remise à NULL en cas de réabonnement.
  deactivatedAt: timestamp("deactivated_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stackItems = pgTable(
  "stack_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    type: stackItemTypeEnum("type").notNull(),
    // Écosystème d'où vient l'identifiant, et donc base de vulnérabilités à
    // interroger : "wordpress", "npm", "packagist", "drupal", "endoflife"…
    // Null quand le composant n'est suivi par aucun catalogue (un hébergeur,
    // par exemple) : il reste affiché dans la fiche, sans veille automatique.
    ecosystem: text("ecosystem"),
    // Identifiant canonique DANS cet écosystème : slug wordpress.org pour un
    // plugin ("contact-form-7"), nom npm ("jquery"), produit endoflife.date
    // ("php"). Avec `type` et `ecosystem`, c'est la clé de jointure avec
    // intel_items.
    slug: text("slug").notNull(),
    label: text("label").notNull(), // nom affichable ("Contact Form 7")
    version: text("version"), // version courante connue — nullable
    source: stackItemSourceEnum("source").notNull(),
    meta: jsonb("meta"), // licence, date expiration, etc.
    watchEnabled: boolean("watch_enabled").notNull().default(true),
    lastCheckedAt: timestamp("last_checked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("stack_client_slug_type").on(t.clientId, t.slug, t.type),
    // Le matching part de (targetSlug, targetType) vers les stacks actifs.
    index("stack_slug_type").on(t.slug, t.type),
  ],
);

// ─── Intelligence collectée ──────────────────────────────────────────────

export const intelItems = pgTable(
  "intel_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: intelKindEnum("kind").notNull(),
    source: text("source").notNull(), // "wpscan" | "wordpress.org" | ...
    externalId: text("external_id").notNull(), // id source (CVE-..., version...)
    // Ciblage : quel composant est concerné
    targetSlug: text("target_slug").notNull(),
    targetType: stackItemTypeEnum("target_type").notNull(),
    // Même rôle que sur stack_items : c'est ce qui permet de ne pas confondre
    // le paquet npm « wordpress » avec le CMS du même nom.
    targetEcosystem: text("target_ecosystem"),
    affectedRange: text("affected_range"), // ex. "< 6.7.0" — null si N/A
    fixedIn: text("fixed_in"),
    severity: text("severity"), // low|medium|high|critical — si dispo
    title: text("title").notNull(),
    raw: jsonb("raw").notNull(), // payload source complet — audit trail
    publishedAt: timestamp("published_at"),
    collectedAt: timestamp("collected_at").notNull().defaultNow(),
  },
  (t) => [
    // Idempotence des collecteurs : relançables sans doublons
    uniqueIndex("intel_source_external").on(t.source, t.externalId),
    index("intel_target").on(t.targetSlug, t.targetType),
  ],
);

// ─── Alertes (le croisement) ─────────────────────────────────────────────

export const alerts = pgTable(
  "alerts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    stackItemId: uuid("stack_item_id")
      .notNull()
      .references(() => stackItems.id, { onDelete: "cascade" }),
    intelItemId: uuid("intel_item_id")
      .notNull()
      .references(() => intelItems.id),
    status: alertStatusEnum("status").notNull().default("draft"),
    verdict: verdictEnum("verdict"), // proposé par le LLM, éditable
    generatedText: text("generated_text"), // sortie LLM brute (audit)
    finalText: text("final_text"), // texte validé/édité — celui envoyé
    recommendedAction: text("recommended_action"),
    sentAt: timestamp("sent_at"),
    resolvedAt: timestamp("resolved_at"), // pour le suivi "recos passées"
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    // Un client n'est alerté qu'une fois par fait. C'est cet index qui garantit
    // qu'un bug de matching ne se traduit pas par un doublon dans la boîte du
    // client — la garantie est dans le moteur, pas dans le code applicatif.
    uniqueIndex("alert_client_intel").on(t.clientId, t.intelItemId),
    // File de validation de l'admin.
    index("alert_status_created_at").on(t.status, t.createdAt),
  ],
);

// ─── Newsletter bimensuelle ──────────────────────────────────────────────
//
// Deux envois par mois, pas un. La spec d'origine prévoyait un digest mensuel
// avec une période au format "2026-08" ; l'index unique (clientId, period)
// aurait alors rejeté le second envoi du mois — l'erreur serait apparue en
// production, au 15 du mois, sur un client payant.
// Format retenu : "2026-08-1" et "2026-08-2".

export const digests = pgTable(
  "digests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    // "AAAA-MM-N" où N vaut 1 (envoi du 1er) ou 2 (envoi du 15).
    period: text("period").notNull(),
    status: alertStatusEnum("status").notNull().default("draft"),
    blocks: jsonb("blocks").notNull(), // { health, delta, watch, reco, radar }
    finalHtml: text("final_html"),
    sentAt: timestamp("sent_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("digest_client_period").on(t.clientId, t.period)],
);
