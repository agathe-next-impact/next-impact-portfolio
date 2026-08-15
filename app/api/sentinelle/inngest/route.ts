import { serve } from "inngest/next";
import { functions, inngest } from "@sentinelle/inngest";

// Runtime Node : les collecteurs et le scanner font des requêtes sortantes et
// lisent des en-têtes ; l'edge runtime n'apporterait rien et interdirait
// certaines APIs Node dont dépendent les phases suivantes.
export const runtime = "nodejs";
// Le contenu dépend de l'événement reçu : jamais de mise en cache.
export const dynamic = "force-dynamic";
// Marge pour un scan complet (specs/scanner.md : ~8 requêtes sortantes).
// À relever si le plan Vercel le permet et que des collecteurs deviennent longs.
export const maxDuration = 60;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
