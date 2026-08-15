import { createHash } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { scans } from "@sentinelle/db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Anti-abus du scanner public.
//
// Le compteur vit en base et non en mémoire : en serverless, une variable de
// module est recréée à chaque démarrage à froid et remise à zéro — un compteur
// applicatif ne compterait rien.
//
// L'IP n'est jamais stockée en clair : on garde un SHA-256 salé, purgé à 24 h
// (plan-mise-en-oeuvre.md §9). Le sel rend le hachage inexploitable pour
// remonter à une IP par force brute sur l'espace des adresses.
// ─────────────────────────────────────────────────────────────────────────────

/** Scans autorisés par heure et par adresse. */
export const SCANS_PER_HOUR = 5;

export function hashIp(ip: string): string {
  const salt = process.env.SCAN_IP_SALT ?? "";
  if (!salt) {
    // Pas de secret par défaut : un sel vide donnerait un hachage réversible.
    console.warn("[sentinelle] SCAN_IP_SALT absent — le hachage des IP est affaibli.");
  }
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/**
 * Adresse de l'appelant derrière les proxys de Vercel.
 * Le premier élément de x-forwarded-for est le client d'origine.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "inconnue";
}

export interface RateLimitVerdict {
  allowed: boolean;
  used: number;
  limit: number;
}

/** Combien de scans cette adresse a-t-elle lancés dans la dernière heure ? */
export async function checkRateLimit(ipHash: string): Promise<RateLimitVerdict> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const [row] = await db()
    .select({ count: sql<number>`count(*)::int` })
    .from(scans)
    .where(and(eq(scans.ipHash, ipHash), gte(scans.createdAt, oneHourAgo)));

  const used = row?.count ?? 0;
  return { allowed: used < SCANS_PER_HOUR, used, limit: SCANS_PER_HOUR };
}

/**
 * Purge des empreintes d'IP de plus de 24 h.
 *
 * Leur seule finalité est l'anti-abus, qui ne regarde que la dernière heure :
 * les garder plus longtemps serait de la collecte sans usage. Appelée par le
 * cron de rétention.
 */
export async function purgeExpiredIpHashes(): Promise<number> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const rows = await db()
    .update(scans)
    .set({ ipHash: null, userAgent: null })
    .where(and(sql`${scans.ipHash} is not null`, sql`${scans.createdAt} < ${yesterday}`))
    .returning({ id: scans.id });

  return rows.length;
}
