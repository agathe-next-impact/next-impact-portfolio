import type { StackItemType } from "@sentinelle/types";
import { FINGERPRINT_BY_SLUG } from "@sentinelle/scanner/fingerprints";
import { ENDOFLIFE_BASELINE, slugForEndoflifeProduct, sourcesFor, type OsvCoordinates } from "./catalog";

// ─────────────────────────────────────────────────────────────────────────────
// Routeur de collecte — pur, testable, sans réseau.
//
// Il répond à une seule question : « au vu des stacks surveillées, quelles
// requêtes faut-il faire aujourd'hui, et à qui ? » Le couple (type, ecosystem)
// d'un stack_item dit où chercher ; ce fichier en tire une liste de cibles
// dédupliquée, bornée, et journalisable.
//
// Ce qu'il ne fait jamais : appeler une API, décider d'une alerte, ou inventer
// une coordonnée. Un composant sans source connue ressort dans `skipped` avec
// sa raison — ce n'est pas une erreur, c'est une information (un hébergeur, un
// CDN, une plateforme SaaS n'ont rien à surveiller).
// ─────────────────────────────────────────────────────────────────────────────

/** Ce dont le routeur a besoin d'un stack_item — rien de plus. */
export interface WatchedComponent {
  slug: string;
  type: StackItemType;
  ecosystem: string | null;
  version?: string | null;
}

/**
 * Identité canonique de quelques produits que le scanner ne détecte pas depuis
 * l'extérieur, mais qu'un client peut déclarer à l'onboarding.
 */
const OFF_CATALOG: Record<string, { type: StackItemType; ecosystem: string }> = {
  nodejs: { type: "runtime", ecosystem: "endoflife" },
};

/**
 * Type et écosystème canoniques d'un slug.
 *
 * La source de vérité est le catalogue d'empreintes du scanner : c'est lui qui
 * fixe le vocabulaire, et c'est la seule façon de garantir que la clé de
 * jointure du matching — (slug, type, ecosystem) — soit la même des deux côtés.
 */
export function canonicalOf(
  slug: string,
): { type: StackItemType; ecosystem: string | null } | null {
  const print = FINGERPRINT_BY_SLUG.get(slug);
  if (print) return { type: print.type, ecosystem: print.ecosystem ?? null };
  return OFF_CATALOG[slug] ?? null;
}

export interface OsvTarget {
  /** Coordonnées du paquet chez OSV.dev — vocabulaire de la source. */
  pkg: OsvCoordinates;
  /** Slug canonique visé, pour retrouver le composant au matching. */
  slug: string;
  type: StackItemType;
  /** Écosystème côté stack — celui du modèle, pas celui d'OSV. */
  ecosystem: string | null;
  /** Versions connues chez les clients — dédupliquées, jamais nulles. */
  versions: string[];
}

export interface WordPressTarget {
  slug: string;
  role: "core" | "plugin" | "theme";
  type: StackItemType;
  versions: string[];
}

export interface CollectionPlan {
  /** Produits endoflife.date à interroger. */
  endoflife: string[];
  osv: OsvTarget[];
  wordpress: WordPressTarget[];
  /** Composants écartés, avec la raison — journalisés, jamais tus. */
  skipped: Array<{ slug: string; reason: string }>;
}

function pushVersion(versions: string[], version: string | null | undefined): void {
  if (version && !versions.includes(version)) versions.push(version);
}

/**
 * Dresse le plan de collecte du jour.
 *
 * Les cibles sont dédupliquées entre clients : dix sites sous WordPress 6.4
 * produisent une requête, pas dix. C'est ce qui permet au cron de rester borné
 * quand le nombre d'abonnés augmente.
 */
export function planCollection(
  components: WatchedComponent[],
  options: { baseline?: string[] } = {},
): CollectionPlan {
  const endoflife = new Set(options.baseline ?? ENDOFLIFE_BASELINE);
  const osv = new Map<string, OsvTarget>();
  const wordpress = new Map<string, WordPressTarget>();
  const skipped: Array<{ slug: string; reason: string }> = [];
  const seenSkips = new Set<string>();

  for (const component of components) {
    const sources = sourcesFor(component);
    const hasSource = Boolean(sources.endoflife || sources.osv || sources.wordpress);

    if (!hasSource) {
      if (!seenSkips.has(component.slug)) {
        seenSkips.add(component.slug);
        skipped.push({
          slug: component.slug,
          reason: component.ecosystem
            ? `aucune source connue pour l'écosystème « ${component.ecosystem} »`
            : "composant sans écosystème de veille (hébergeur, CDN, plateforme)",
        });
      }
      continue;
    }

    if (sources.endoflife) endoflife.add(sources.endoflife);

    if (sources.osv) {
      const key = `${sources.osv.ecosystem}:${sources.osv.name}`;
      const target = osv.get(key) ?? {
        pkg: sources.osv,
        slug: component.slug,
        type: component.type,
        ecosystem: component.ecosystem,
        versions: [],
      };
      pushVersion(target.versions, component.version);
      osv.set(key, target);
    }

    if (sources.wordpress) {
      const key = `${sources.wordpress}:${component.slug}`;
      const target = wordpress.get(key) ?? {
        slug: component.slug,
        role: sources.wordpress,
        type: component.type,
        versions: [],
      };
      pushVersion(target.versions, component.version);
      wordpress.set(key, target);
    }
  }

  return {
    endoflife: [...endoflife].sort(),
    osv: [...osv.values()],
    wordpress: [...wordpress.values()],
    skipped,
  };
}

/** Nombre d'appels sortants qu'un plan va coûter, avant de le lancer. */
export function estimateCalls(plan: CollectionPlan): number {
  // endoflife : une requête par produit. OSV : une requête groupée, plus une
  // par vulnérabilité inconnue (non prévisible, majorée ici par le nombre de
  // cibles). WordPress : une requête par composant.
  return plan.endoflife.length + 1 + plan.osv.length + plan.wordpress.length;
}

export { slugForEndoflifeProduct };
