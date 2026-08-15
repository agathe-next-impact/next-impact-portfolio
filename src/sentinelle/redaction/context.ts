import type { Client, IntelItem, StackItem, StackItemMeta, Verdict } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Contexte transmis au modèle — « le LLM ne connaît rien, il reçoit tout »
// (règle 3 du CLAUDE.md), et il ne reçoit que ce qui sert à rédiger.
//
// **Ni le nom ni l'e-mail du client ne sortent d'ici.** Anthropic est
// sous-traitant : le prompt n'a pas besoin de l'identité du client pour écrire
// une alerte sur une version de PHP, donc elle ne part pas. C'est une
// minimisation gratuite, et elle est testée — pas seulement promise.
//
// Le module est pur : il transforme des lignes de base en texte. Aucun appel
// réseau, aucune lecture d'environnement. C'est ce qui permet de vérifier ce
// qu'on envoie sans envoyer quoi que ce soit.
// ─────────────────────────────────────────────────────────────────────────────

export interface RedactionContext {
  /** Ce qu'on sait du client, et rien de plus : de quoi contextualiser. */
  business: {
    sector: string | null;
    notes: string | null;
  };
  component: {
    label: string;
    slug: string;
    type: string;
    ecosystem: string | null;
    version: string | null;
    /** Certitude sur la version — le modèle doit pouvoir nuancer. */
    versionConfidence: string;
  };
  intel: {
    kind: string;
    source: string;
    title: string;
    severity: string | null;
    affectedRange: string | null;
    fixedIn: string | null;
    publishedAt: string | null;
  };
  matching: {
    /** Verdict calculé par le code. Le modèle peut l'abaisser, jamais le monter. */
    verdict: Verdict;
    reason: string;
  };
}

export type ContextSources = {
  client: Pick<Client, "sector" | "notes">;
  stackItem: Pick<StackItem, "label" | "slug" | "type" | "ecosystem" | "version"> & {
    meta?: unknown;
  };
  intelItem: Pick<
    IntelItem,
    "kind" | "source" | "title" | "severity" | "affectedRange" | "fixedIn" | "publishedAt"
  >;
  verdict: Verdict;
  reason: string;
};

/**
 * Assemble le contexte d'une alerte.
 *
 * Prend les lignes telles qu'elles sortent de la base et n'en garde que
 * l'utile : c'est ici, à un seul endroit, que se décide ce qui part chez le
 * sous-traitant.
 */
export function buildContext(sources: ContextSources): RedactionContext {
  const meta = (sources.stackItem.meta ?? {}) as StackItemMeta;

  return {
    business: {
      sector: sources.client.sector ?? null,
      notes: sources.client.notes ?? null,
    },
    component: {
      label: sources.stackItem.label,
      slug: sources.stackItem.slug,
      type: sources.stackItem.type,
      ecosystem: sources.stackItem.ecosystem ?? null,
      version: sources.stackItem.version ?? null,
      versionConfidence: meta.versionConfidence ?? "medium",
    },
    intel: {
      kind: sources.intelItem.kind,
      source: sources.intelItem.source,
      title: sources.intelItem.title,
      severity: sources.intelItem.severity ?? null,
      affectedRange: sources.intelItem.affectedRange ?? null,
      fixedIn: sources.intelItem.fixedIn ?? null,
      publishedAt: sources.intelItem.publishedAt
        ? sources.intelItem.publishedAt.toISOString().slice(0, 10)
        : null,
    },
    matching: {
      verdict: sources.verdict,
      reason: sources.reason,
    },
  };
}

const CONFIDENCE_FR: Record<string, string> = {
  high: "certaine",
  medium: "probable — à confirmer avec le client",
  low: "incertaine",
};

const KIND_FR: Record<string, string> = {
  vulnerability: "faille de sécurité publiée",
  eol: "fin de support d'une branche",
  release: "nouvelle version disponible",
  changelog: "changement annoncé",
  page_diff: "modification observée sur une page",
};

function line(label: string, value: string | null): string {
  return value ? `${label} : ${value}` : `${label} : non renseigné`;
}

/**
 * Rend le contexte en texte, tel qu'il part dans le message utilisateur.
 *
 * Du texte et non du JSON : le modèle écrit mieux à partir d'une fiche lisible,
 * et un humain qui relit un journal d'audit voit tout de suite ce qui a été
 * envoyé.
 */
export function renderContext(context: RedactionContext): string {
  return [
    "# Le client",
    line("Secteur", context.business.sector),
    line("Notes de contexte", context.business.notes),
    "",
    "# Le composant concerné",
    `Nom : ${context.component.label}`,
    `Famille : ${context.component.type}`,
    line("Écosystème", context.component.ecosystem),
    line("Version installée", context.component.version),
    `Certitude sur la version : ${
      CONFIDENCE_FR[context.component.versionConfidence] ?? context.component.versionConfidence
    }`,
    "",
    "# Le fait de veille",
    `Nature : ${KIND_FR[context.intel.kind] ?? context.intel.kind}`,
    `Source : ${context.intel.source}`,
    `Intitulé de la source : ${context.intel.title}`,
    line("Sévérité annoncée par la source", context.intel.severity),
    line("Versions affectées", context.intel.affectedRange),
    line("Corrigé à partir de", context.intel.fixedIn),
    line("Date de publication", context.intel.publishedAt),
    "",
    "# Ce que le moteur a calculé",
    `Verdict proposé : ${context.matching.verdict}`,
    `Raison : ${context.matching.reason}`,
    "",
    "Rédige l'alerte correspondante.",
  ].join("\n");
}

/**
 * Le seul composant que le modèle a le droit de nommer.
 *
 * Sert au garde-fou de `guards.ts` : tout autre nom de technologie apparaissant
 * dans le texte produit est une invention, et une alerte qui nomme un composant
 * que le client n'a pas coûte la confiance en une phrase.
 */
export function allowedComponents(context: RedactionContext): string[] {
  return [context.component.label, context.component.slug];
}
