// ─────────────────────────────────────────────────────────────────────────────
// Estimation du coût LLM d'une lettre de veille, à partir de la consommation
// mesurée (`ProductionNote.consommation` ou l'objet plus riche de l'échantillon).
//
// Le repo mesure la conso mais ne la convertit pas en argent. Ces bornes sont
// des tarifs publics Anthropic — la source de vérité reste la facturation.
//
// Deux nuances qui rendent l'estimation prudente (elle sous-compte un peu) :
//   · `jetonsEntree` vient de `usage.input_tokens`, qui est DÉJÀ le hors-cache.
//     On additionne donc le cache, on ne le soustrait pas.
//   · Les écritures de cache (`cache_creation_input_tokens`, ×1,25) ne sont pas
//     tracées par la télémétrie : le premier chargement du brief coûte un poil
//     plus que ce total. Négligeable devant la sortie.
//   · Les lectures web ne sont pas facturées à l'acte : leur contenu est déjà
//     compté dans les jetons d'entrée. Seules les recherches ont un prix propre.
// ─────────────────────────────────────────────────────────────────────────────

/** Consommation mesurée d'une fabrication (les deux formes du repo). */
export interface ConsommationLettre {
  recherches: number;
  lectures: number;
  reprises: number;
  /** `usage.input_tokens` cumulé — hors cache, déjà au plein tarif. */
  jetonsEntree: number;
  jetonsSortie: number;
  /** `cache_read_input_tokens` cumulé. Absent de `ProductionNote`. */
  jetonsCacheLecture?: number;
}

/** Tarif par million de jetons + par recherche web serveur, en USD. */
export interface Tarif {
  entree: number;
  sortie: number;
  cacheLecture: number;
  rechercheWeb: number;
}

/**
 * Tarifs publics Anthropic (USD), constatés au 2026-08.
 * À aligner sur `ANTHROPIC_MODEL` : un autre palier change ces bornes.
 * Le défaut de la lettre est Sonnet 5 — c'est donc le tarif par défaut ici.
 */
export const TARIF_SONNET_5: Tarif = {
  entree: 3, // $/M jetons d'entrée hors cache
  sortie: 15, // $/M jetons de sortie
  cacheLecture: 0.3, // $/M jetons relus du cache (~0,1× entrée)
  rechercheWeb: 0.01, // $ par recherche web ($10 / 1000)
};

export const TARIF_OPUS_4_8: Tarif = {
  entree: 5,
  sortie: 25,
  cacheLecture: 0.5,
  rechercheWeb: 0.01,
};

export interface CoutLettre {
  /** Postes détaillés, en USD. */
  entree: number;
  sortie: number;
  cache: number;
  recherches: number;
  /** Total LLM, en USD. */
  total: number;
}

const parMillion = (jetons: number, prix: number) => (jetons / 1_000_000) * prix;

/** Coût LLM estimé d'une lettre, ventilé par poste (USD). */
export function estimeCoutLettre(
  conso: ConsommationLettre,
  tarif: Tarif = TARIF_SONNET_5,
): CoutLettre {
  const entree = parMillion(conso.jetonsEntree, tarif.entree);
  const sortie = parMillion(conso.jetonsSortie, tarif.sortie);
  const cache = parMillion(conso.jetonsCacheLecture ?? 0, tarif.cacheLecture);
  const recherches = conso.recherches * tarif.rechercheWeb;
  return { entree, sortie, cache, recherches, total: entree + sortie + cache + recherches };
}

/** Une ligne lisible pour le rapport de production. */
export function formateCoutLettre(
  conso: ConsommationLettre,
  tarif: Tarif = TARIF_SONNET_5,
): string {
  const c = estimeCoutLettre(conso, tarif);
  const usd = (n: number) => `$${n.toFixed(3)}`;
  return (
    `coût LLM ≈ ${usd(c.total)} ` +
    `(entrée ${usd(c.entree)} · sortie ${usd(c.sortie)} · ` +
    `cache ${usd(c.cache)} · recherches ${usd(c.recherches)})`
  );
}
