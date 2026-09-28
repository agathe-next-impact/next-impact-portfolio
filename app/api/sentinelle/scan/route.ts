import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";
import { inngest, scanRequested } from "@sentinelle/inngest";
import { normalizeSiteUrl, isPubliclyScannable } from "@sentinelle/url";
import { checkRateLimit, clientIp, hashIp } from "@sentinelle/scanner/rate-limit";
import { undeliverableReason } from "@sentinelle/emails/send";
import { requestIp, verifyRecaptcha } from "@/lib/recaptcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TEMPORAIRE (2026-09-28, demande d'Agathe) : plafond d'une analyse par heure
// et par adresse levé. Repasser à `false` pour le rétablir ; reCAPTCHA reste
// actif. Chaque scan a un coût (API Anthropic) : ne pas l'oublier ouvert.
const PLAFOND_SUSPENDU = true;

// L'opt-in du premier écran (2026-09-28) : organisation, e-mail et site,
// avant l'analyse. L'e-mail devient le destinataire de l'audit (`auditEmail`),
// envoyé dès qu'il est prêt ; ce n'est PAS une inscription à la veille, qui
// reste le formulaire du rapport (`leadEmail`).
const Body = z.object({
  url: z.string().min(3).max(2048),
  organisation: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email().max(320),
  // Sans case cochée, rien n'est enregistré.
  consentement: z.literal(true),
  // Pot de miel : un champ caché qu'un humain laisse vide.
  site: z.string().max(0).optional(),
  recaptchaToken: z.string().max(4096).optional(),
});

function messageErreur(champ: PropertyKey | undefined): string {
  switch (champ) {
    case "url":
      return "Adresse de site manquante.";
    case "email":
      return "Cette adresse e-mail ne semble pas valide.";
    case "consentement":
      return "Cochez la case pour lancer l'analyse.";
    case "organisation":
      return "Renseignez le nom de votre organisation.";
    default:
      return "Demande illisible.";
  }
}

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
    return Response.json(
      { error: messageErreur(parsed.error.issues[0]?.path[0]) },
      { status: 400 },
    );
  }
  if (undeliverableReason(parsed.data.email)) {
    return Response.json(
      { error: "Cette adresse e-mail ne semble pas valide." },
      { status: 400 },
    );
  }

  // reCAPTCHA ne bloque plus ce scan : c'est l'outil gratuit qui sert de porte
  // d'entrée au prospect froid (règle d'or du site), et un faux positif ici
  // coûte un prospect. Le score reste journalisé pour garder trace d'un abus
  // éventuel ; l'anti-abus réel est le plafond d'une analyse par heure et par
  // adresse ci-dessous (checkRateLimit), qui protège le coût du scan sans
  // jamais refuser un vrai visiteur isolé.
  const captcha = await verifyRecaptcha(
    parsed.data.recaptchaToken,
    "sentinelle_scan",
    requestIp(req.headers),
  );
  if (!captcha.ok) {
    console.warn(`[recaptcha] scan laissé passer malgré un jeton refusé (${captcha.reason})`);
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
    // En développement, le plafond (1 scan/heure) bloquerait chaque session de
    // test au premier essai. La production, elle, applique la limite, sauf
    // quand PLAFOND_SUSPENDU est levé.
    if (process.env.NODE_ENV !== "development" && !PLAFOND_SUSPENDU) {
      const verdict = await checkRateLimit(ipHash);
      if (!verdict.allowed) {
        return Response.json(
          {
            error:
              "Le scanner est limité à une analyse par heure et par adresse. " +
              "Réessayez un peu plus tard.",
          },
          { status: 429 },
        );
      }
    }

    const [scan] = await db()
      .insert(scans)
      .values({
        url,
        status: "pending",
        auditEmail: parsed.data.email,
        leadOrganisation: parsed.data.organisation,
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
