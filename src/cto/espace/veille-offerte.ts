// ─────────────────────────────────────────────────────────────────────────────
// La veille offerte (décision du 2026-09-27). Pur, testé.
//
// Chaque client a un espace, et la veille — personnalisée (Signaux Faibles)
// ET technique (Sentinelle) — lui est offerte à l'ouverture. Elle dure :
//
//  - sans limite pour un client RÉCURRENT : direction technique, suivi des
//    actions, suivi et maintenance, ou une veille déjà souscrite. Elle fait
//    partie de ce qu'il paie ;
//  - un mois pour un client PONCTUEL (audit seul, prestation ponctuelle, rien
//    encore) : le mois qui suit l'ouverture de son espace.
//
// À la fin du mois, les lettres déjà reçues restent lisibles, les suivantes
// n'arrivent plus. L'espace, lui, reste ouvert : l'arrêt de la veille ne
// ferme rien d'autre.
// ─────────────────────────────────────────────────────────────────────────────

/** Durée de la veille offerte à un client ponctuel, en mois. */
export const VEILLE_OFFERTE_MOIS = 1;

/** Les services qui font d'un client un client récurrent : sa veille ne s'arrête pas. */
export const SERVICES_RECURRENTS = [
  "direction-technique",
  "actions",
  "suivi-technique",
  "veille-personnalisee",
  "veille-technique",
] as const;

export interface VeilleOfferte {
  /** Vrai pour un client récurrent : pas de fin. */
  recurrente: boolean;
  /** Fin de la veille offerte ; null pour un client récurrent. */
  jusquau: Date | null;
  /** La veille court-elle à cette date ? */
  active: boolean;
}

/**
 * La veille d'un accompagnement à une date donnée. `services === null` (colonne
 * jamais renseignée, régime historique) compte comme récurrent : on ne coupe
 * pas la veille d'un accompagnement antérieur à cette règle.
 */
export function veilleOfferte(services: string[] | null, ouverture: Date, maintenant: Date): VeilleOfferte {
  const recurrente = services === null || services.some((code) => (SERVICES_RECURRENTS as readonly string[]).includes(code));
  if (recurrente) return { recurrente: true, jusquau: null, active: true };
  const jusquau = new Date(ouverture);
  jusquau.setMonth(jusquau.getMonth() + VEILLE_OFFERTE_MOIS);
  return { recurrente: false, jusquau, active: maintenant < jusquau };
}
