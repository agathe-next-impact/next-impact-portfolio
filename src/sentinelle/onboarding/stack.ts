import type {
  Confidence,
  DetectedComponent,
  ScanResult,
  StackItemType,
} from "@sentinelle/types";
import { canonicalOf } from "@sentinelle/collectors/targets";

// ─────────────────────────────────────────────────────────────────────────────
// Composition de la fiche d'un client — pur, sans base ni réseau.
//
// Deux entrées, deux natures :
//
//  - **Ce que le scan a vu** (`scanned`). Cinquante à soixante-dix pour cent
//    d'un site, avec des versions parfois déduites. C'est ce qui remplit la
//    fiche le jour du paiement, sans rien demander à personne.
//  - **Ce que le client déclare** (`declared`). Le reste : les extensions qui ne
//    se chargent qu'en back-office, l'hébergeur exact, la version de PHP que
//    seul son panneau d'administration affiche. C'est ce qui fait passer la
//    surveillance de « partielle » à « exacte » — la promesse de la page d'offre.
//
// Règle qui gouverne tout le fichier : **le déclaré prime sur le détecté**. Un
// client qui corrige une version a raison contre une empreinte, toujours.
// ─────────────────────────────────────────────────────────────────────────────

/** Ce qu'une ligne de fiche porte, avant d'avoir un `clientId`. */
export interface StackDraft {
  type: StackItemType;
  slug: string;
  label: string;
  version: string | null;
  ecosystem: string | null;
  source: "scanned" | "declared";
  meta: Record<string, unknown> | null;
}

/**
 * Familles proposées au client à l'onboarding.
 *
 * Volontairement plus courte que `stackItemTypeEnum` : on ne demande pas à un
 * gérant de PME de distinguer un CDN d'un hébergeur. Les types absents d'ici
 * restent parfaitement valides en base — ils viennent du scan, pas d'un
 * formulaire.
 */
export const DECLARABLE_TYPES: Array<{ value: StackItemType; label: string; hint: string }> = [
  { value: "cms_plugin", label: "Extension / module", hint: "Yoast SEO, Contact Form 7…" },
  { value: "cms_theme", label: "Thème", hint: "le thème de votre site" },
  { value: "runtime", label: "Langage / exécution", hint: "PHP, Node.js" },
  { value: "server", label: "Serveur web", hint: "nginx, Apache" },
  { value: "js_library", label: "Bibliothèque", hint: "jQuery, Bootstrap" },
  { value: "framework", label: "Socle technique", hint: "Laravel, Next.js, Symfony" },
  { value: "ecommerce", label: "Boutique", hint: "WooCommerce, PrestaShop" },
  { value: "hosting", label: "Hébergeur", hint: "OVH, o2switch, Vercel" },
  { value: "saas", label: "Service tiers", hint: "Mailchimp, Stripe, un CRM" },
];

const DECLARABLE_VALUES = new Set(DECLARABLE_TYPES.map((entry) => entry.value));

/**
 * Écritures courantes qui ne tombent pas sur le slug canonique.
 *
 * Des données, pas du code : le jour où quelqu'un écrit « Node JS », on ajoute
 * une ligne. Sans cette table, « Node.js » deviendrait le slug `node-js`, que
 * personne ne surveille — et le client croirait son runtime suivi.
 */
const ALIASES: Record<string, string> = {
  "node-js": "nodejs",
  node: "nodejs",
  "next-js": "next",
  nextjs: "next",
  "nuxt-js": "nuxt",
  "vue-js": "vue",
  vuejs: "vue",
  "react-js": "react",
  reactjs: "react",
  "j-query": "jquery",
  "word-press": "wordpress",
  wp: "wordpress",
  "woo-commerce": "woocommerce",
  woo: "woocommerce",
  "apache2": "apache",
  "http-apache": "apache",
  "php-fpm": "php",
};

/** Identifiant canonique d'un nom saisi à la main. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Une version saisie à la main est-elle exploitable ?
 *
 * On accepte « 6.4 », « 6.4.3 », « 8.2.15-1 », « v2.0 ». On refuse « à jour »,
 * « la dernière » et « je ne sais pas » — écrire ça en base ferait comparer une
 * phrase à une plage de versions, et le matching produirait n'importe quoi.
 */
export function normalizeVersion(input: string | null | undefined): string | null {
  if (!input) return null;

  const trimmed = input.trim().replace(/^v/i, "");
  if (!trimmed) return null;

  return /^\d+(\.\d+)*([.-][0-9a-z]+)*$/i.test(trimmed) ? trimmed : null;
}

/**
 * Écosystème de veille d'un composant déclaré.
 *
 * Le catalogue d'empreintes du scanner fait autorité : c'est lui qui fixe le
 * vocabulaire, et c'est la seule façon que la clé de jointure du matching —
 * (slug, type, ecosystem) — soit la même des deux côtés.
 *
 * Deux replis, et un refus assumé :
 *  - un slug connu impose son type ET son écosystème (« php » est un runtime
 *    suivi par endoflife.date, même si le client l'a rangé ailleurs) ;
 *  - une extension ou un thème hérite de l'écosystème de la plateforme du site
 *    — c'est ce qui rend un plugin WordPress déclaré immédiatement surveillé ;
 *  - le reste part avec `ecosystem: null`, donc affiché mais non surveillé. Le
 *    dire au client vaut mieux que lui laisser croire l'inverse.
 */
export function resolveDeclared(
  rawLabel: string,
  rawType: StackItemType,
  platform: string | null,
): { type: StackItemType; slug: string; ecosystem: string | null } | null {
  const label = rawLabel.trim();
  if (!label) return null;

  const slugged = slugify(label);
  if (!slugged) return null;

  const slug = ALIASES[slugged] ?? slugged;
  const canonical = canonicalOf(slug);
  if (canonical) return { type: canonical.type, slug, ecosystem: canonical.ecosystem };

  const type = DECLARABLE_VALUES.has(rawType) ? rawType : "saas";

  // Une extension ou un thème n'a de sens que dans l'écosystème d'un CMS ; le
  // seul CMS dont les extensions ont un catalogue public interrogeable est
  // WordPress. Ailleurs, on affiche sans promettre de veille.
  if ((type === "cms_plugin" || type === "cms_theme") && platform === "wordpress") {
    return { type, slug, ecosystem: "wordpress" };
  }

  return { type, slug, ecosystem: null };
}

/** Une ligne du formulaire d'onboarding, telle qu'elle arrive. */
export interface DeclaredInput {
  label: string;
  type: StackItemType;
  version?: string | null;
}

export interface DeclaredOutcome {
  items: StackDraft[];
  /** Lignes écartées, avec la raison — affichée au client, jamais avalée. */
  rejected: Array<{ label: string; reason: string }>;
  /** Composants acceptés mais sans veille automatique possible. */
  unwatched: string[];
}

/**
 * Traduit le formulaire d'onboarding en lignes de fiche.
 *
 * Les doublons sont fusionnés sur (slug, type) : c'est la clé unique en base,
 * et deux lignes identiques feraient échouer l'enregistrement complet plutôt
 * qu'une seule.
 */
export function parseDeclaredComponents(
  rows: DeclaredInput[],
  options: { platform?: string | null } = {},
): DeclaredOutcome {
  const platform = options.platform ?? null;
  const byKey = new Map<string, StackDraft>();
  const rejected: DeclaredOutcome["rejected"] = [];
  const unwatched: string[] = [];

  for (const row of rows) {
    const label = row.label?.trim() ?? "";
    if (!label) continue; // ligne vide : le formulaire en propose toujours quelques-unes

    const resolved = resolveDeclared(label, row.type, platform);
    if (!resolved) {
      rejected.push({ label, reason: "nom inexploitable" });
      continue;
    }

    const rawVersion = row.version?.trim() ?? "";
    const version = normalizeVersion(rawVersion);
    if (rawVersion && !version) {
      rejected.push({
        label,
        reason: `« ${rawVersion} » n'est pas un numéro de version — laissez vide si vous ne l'avez pas`,
      });
      continue;
    }

    const key = `${resolved.type}:${resolved.slug}`;
    byKey.set(key, {
      type: resolved.type,
      slug: resolved.slug,
      label,
      version,
      ecosystem: resolved.ecosystem,
      source: "declared",
      // Le client a regardé son administration : sa version fait foi. C'est ce
      // `high` qui autorise un verdict rouge (matching, règle du lot 2).
      meta: { versionConfidence: "high" satisfies Confidence },
    });

    if (!resolved.ecosystem) unwatched.push(label);
  }

  return { items: [...byKey.values()], rejected, unwatched };
}

/**
 * Lignes de fiche issues d'un scan.
 *
 * La confiance dans la version voyage dans `meta` : c'est elle, et non la
 * confiance dans la présence du composant, que le matching consulte avant de
 * fonder un verdict rouge sur une comparaison de plage.
 */
export function stackItemsFromScan(result: ScanResult): StackDraft[] {
  return result.components.map((component: DetectedComponent) => ({
    type: component.type,
    slug: component.slug,
    label: component.label,
    version: component.version,
    ecosystem: component.ecosystem,
    source: "scanned" as const,
    meta: {
      ...(component.versionConfidence ? { versionConfidence: component.versionConfidence } : {}),
      ...(component.evidence ? { evidence: component.evidence } : {}),
    },
  }));
}

/**
 * Fusionne le détecté et le déclaré.
 *
 * Le déclaré gagne, toujours et en entier — y compris sur une version que le
 * scan croyait certaine. Un client qui corrige sa fiche doit voir sa correction
 * tenir au prochain scan, sans quoi il ne la fera pas deux fois.
 */
export function mergeStack(scanned: StackDraft[], declared: StackDraft[]): StackDraft[] {
  const merged = new Map<string, StackDraft>();

  for (const item of scanned) merged.set(`${item.type}:${item.slug}`, item);
  for (const item of declared) merged.set(`${item.type}:${item.slug}`, item);

  return [...merged.values()];
}
