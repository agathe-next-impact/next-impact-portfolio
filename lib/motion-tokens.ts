/**
 * Tokens motion partagés — source de vérité des durées et easings.
 *
 * Centralisation sans retuning : les valeurs sont celles déjà utilisées par
 * les composants pivots (Reveal 0.5 s, template 0.3 s, RadialGauge 1.2 s).
 * Toute évolution du langage motion du site passe par ce fichier.
 */

/** Ease-out franc — entrées / reveals (courbe historique du design system). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Durées en secondes. */
export const DUR = { micro: 0.15, ui: 0.3, reveal: 0.5, chart: 1.2 } as const;
