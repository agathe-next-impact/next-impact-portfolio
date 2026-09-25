// API publique du dossier de restitution : collecte puis rendu PDF.

export { collectRestitution, type RestitutionData } from "./collect";
export { clean, renderRestitutionPdf } from "./pdf";
