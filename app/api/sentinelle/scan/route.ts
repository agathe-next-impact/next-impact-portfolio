import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { inngest, scanRequested } from "@sentinelle/inngest";
import { normalizeSiteUrl, isPubliclyScannable } from "@sentinelle/url";
import { checkRateLimit, clientIp, hashIp } from "@sentinelle/scanner/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  url: z.string().min(3).max(2048),
});

/**
 * Demande d'analyse d'un site.
 *
 * Rend la main immédiatement : le scan lui-même part en tâche de fond (Inngest)
 * et le front interroge GET /api/sentinelle/scan/[id].
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "corps de requête illisible" }, { status: 400 });
  }

  const parsed = Body.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: "adresse manquante" }, { status: 400 });
  }

  const url = normalizeSiteUrl(parsed.data.url);
  if (!url) {
    return Response.json(
      { error: "Cette adresse ne semble pas valide. Exemple : exemple.fr" },
      { status: 400 },
    );
  }

  // Garde-fou : le scanner public ne doit pas servir à sonder un réseau interne.
  if (!isPubliclyScannable(url)) {
    return Response.json(
      { error: "Seuls les sites accessibles publiquement peuvent être analysés." },
      { status: 400 },
    );
  }

  const ipHash = hashIp(clientIp(req.headers));

  try {
    const verdict = await checkRateLimit(ipHash);
    if (!verdict.allowed) {
      return Response.json(
        {
          error: `Vous avez lancé ${verdict.used} analyses dans la dernière heure. Réessayez un peu plus tard.`,
        },
        { status: 429 },
      );
    }

    const [scan] = await db()
      .insert(scans)
      .values({
        url,
        status: "pending",
        ipHash,
        userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
      })
      .returning({ id: scans.id });

    // La ligne est déjà écrite : si la mise en file échoue, elle resterait
    // « pending » indéfiniment et le front interrogerait dans le vide. On la
    // ferme honnêtement plutôt que de laisser un scan fantôme en base.
    try {
      await inngest.send(scanRequested.create({ scanId: scan.id, url }));
    } catch (error) {
      console.error("[sentinelle] mise en file de l'analyse impossible", error);
      await db()
        .update(scans)
        .set({ status: "failed", result: { error: "L'analyse n'a pas pu être lancée." } })
        .where(eq(scans.id, scan.id));
      return Response.json({ error: "Analyse indisponible pour le moment." }, { status: 500 });
    }

    return Response.json({ scanId: scan.id }, { status: 202 });
  } catch (error) {
    console.error("[sentinelle] création de scan impossible", error);
    return Response.json({ error: "Analyse indisponible pour le moment." }, { status: 500 });
  }
}
