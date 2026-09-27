// API publique du module audit : l'envoi par e-mail du diagnostic en quatre
// cases du scan public. Les libellés (`./prestations`) sont des données pures,
// importées directement par le rapport client pour ne pas tirer la base dans
// le bundle navigateur.

export { envoyerAudit, type AuditEnvoiOutcome } from "./envoi";
export {
  BESOIN_LABELS,
  CASES_TITRES,
  ECHANGE_URL,
  PAGE_PRESTATIONS,
  PRESTATIONS,
  TONALITE_LABELS,
} from "./prestations";
