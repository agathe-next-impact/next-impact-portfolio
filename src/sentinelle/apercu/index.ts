// API publique du module aperçu — l'échantillon de veille personnalisée joint
// au rapport de scan public. La partie déterministe (dossier.ts) croise le scan
// avec l'intel en base via le moteur des alertes ; la passe de rédaction
// (build.ts) écrit sans outils, bornée par le schéma et par le dossier.
//
// À la différence de la lettre abonnée, l'aperçu n'est PAS relu par un humain :
// le rapport l'affiche explicitement, et la garde `borner()` l'empêche d'être
// plus alarmiste que le croisement déterministe.

export {
  APERCU_STATUTS,
  APERCU_THEMES,
  croiser,
  renderDossier,
  toMatchable,
  type ApercuConstat,
  type ApercuThemeSlug,
} from "./dossier";

export { ApercuSchema, APERCU_JSON_SCHEMA, type ApercuPayload } from "./schema";

export { borner, buildApercu, APERCU_PROMPT } from "./build";
