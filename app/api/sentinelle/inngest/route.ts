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

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
