import { reponseWorker } from "../../sw-commun";
import { ADMIN_HOME, ADMIN_PWA_SCOPE } from "../pwa-config";

// ─────────────────────────────────────────────────────────────────────────────
// Le service worker de l'admin, servi par une route pour poser
// `Service-Worker-Allowed` (portée `/admin-cto`, sans barre finale).
//
// Même worker que l'espace client (`../../sw-commun.ts`) : l'application doit
// s'ouvrir et se lire hors ligne. Les pages rassemblent les données de tous les
// clients : leur cache est vidé à la fermeture de session (écran de connexion,
// `PurgeHorsLigneAdmin`), et le bandeau « Hors ligne » dit qu'on lit une copie.
//
// Caches préfixés `admin-` : le worker de l'espace ne supprime que les siens.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-static";

export function GET() {
  return reponseWorker({
    portee: ADMIN_PWA_SCOPE,
    prefixe: "admin",
    accueil: ADMIN_HOME,
    jamais: ["connexion"],
    libelle: "Supervision",
  });
}
