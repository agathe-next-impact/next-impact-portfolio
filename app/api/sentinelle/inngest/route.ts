import { serve } from "inngest/next";
import { functions, inngest } from "@sentinelle/inngest";

// Runtime Node : les collecteurs et le scanner font des requêtes sortantes et
// lisent des en-têtes ; l'edge runtime n'apporterait rien et interdirait
// certaines APIs Node dont dépendent les phases suivantes.
export const runtime = "nodejs";
// Le contenu dépend de l'événement reçu : jamais de mise en cache.
export const dynamic = "force-dynamic";
// La fabrication d'un numéro de la lettre de veille domine désormais ce budget :
// une passe de collecte peut faire jusqu'à trente recherches web et huit
// lectures de page, et se compte en minutes — là où un scan complet tient en une
// poignée de secondes.
//
// 300 s est le maximum d'un plan Vercel Pro ; sur un plan Hobby la valeur est
// ramenée à 60 s en silence, et les collectes échoueront par dépassement. Si
// elles dépassent malgré les 300 s, le geste suivant n'est pas de raccourcir la
// recherche mais de passer la collecte sur l'API Batches : pour un numéro
// bimensuel la latence n'a aucune importance, et le coût y est divisé par deux.
export const maxDuration = 300;

// ── Adresse annoncée à Inngest ──────────────────────────────────────────────
// Sans ceci, le SDK déduit son URL de `VERCEL_URL`, c'est-à-dire l'URL de
// déploiement immuable (`next-impact-<hash>.vercel.app`). Or « Vercel
// Authentication » est active sur ce projet en mode
// `prod_deployment_urls_and_all_previews` : cette URL précise répond 302 vers
// l'écran de connexion Vercel, tandis que le domaine public répond 200.
//
// Inngest enregistrait donc l'application sur une adresse qu'il ne peut pas
// joindre. Les événements arrivaient bien, mais aucun appel ne revenait, et
// le rejet ayant lieu au bord du réseau — avant la fonction — il ne laissait
// aucune trace dans les logs runtime. Les scans restaient `pending` à vie
// (constaté le 2026-08-16 sur les scans 50b44589 et 2ecbb10b).
//
// On force donc le domaine public. Uniquement en production : une préversion
// doit continuer à s'annoncer sous sa propre URL, jamais sous celle de la
// production — sans quoi elle traiterait les événements réels.
const serveHost =
  process.env.INNGEST_SERVE_HOST ??
  (process.env.VERCEL_ENV === "production" ? "https://www.next-impact.digital" : undefined);

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
  ...(serveHost ? { serveHost } : {}),
});
