import { reponseWorker } from "../../sw-commun";
import { PWA_SCOPE } from "../pwa-config";

// ─────────────────────────────────────────────────────────────────────────────
// Le service worker de l'espace, servi par une route plutôt que depuis public/ :
// c'est ici qu'on pose `Service-Worker-Allowed`, sans lequel la portée ne
// pourrait pas être `/espace-direction` (sans barre finale — l'adresse que le
// client met en favori et que l'application installée ouvre).
//
// Le texte du worker est commun avec l'admin : voir `../../sw-commun.ts`.
// Jamais en cache ni préchargés ici : la connexion (jeton à usage unique) et
// les suggestions (`suggestion/<id>`, un GET qui enregistre le clic).
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-static";

export function GET() {
  return reponseWorker({
    portee: PWA_SCOPE,
    prefixe: "espace",
    accueil: PWA_SCOPE,
    jamais: ["connexion", "suggestion"],
    libelle: "Espace direction",
  });
}
