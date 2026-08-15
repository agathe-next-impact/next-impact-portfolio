import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@sentinelle/db/client";
import { clients, stackItems } from "@sentinelle/db/schema";
import type { ScanResult, StackItemType } from "@sentinelle/types";
import { detectPlatform } from "@sentinelle/scanner/platform";
import { stackItemsFromScan, type StackDraft } from "./stack";

// ─────────────────────────────────────────────────────────────────────────────
// Écritures de la fiche client — le côté base de l'onboarding.
//
// Un invariant gouverne tout : **le déclaré ne se fait jamais écraser par le
// détecté**. Un scan qui repasse et remet « version probable » sur une version
// que le client a corrigée à la main annulerait le seul geste qu'on lui demande.
// C'est la clause `setWhere` des upserts qui le garantit, en SQL, pas une
// précaution dans le code appelant.
// ─────────────────────────────────────────────────────────────────────────────

export interface FicheComponent {
  id: string;
  type: StackItemType;
  slug: string;
  label: string;
  version: string | null;
  ecosystem: string | null;
  source: "scanned" | "declared";
  watchEnabled: boolean;
}

export interface Fiche {
  client: {
    id: string;
    email: string;
    name: string;
    company: string | null;
    siteUrl: string;
    sector: string | null;
    notes: string | null;
    active: boolean;
    stripeCustomerId: string | null;
    onboardedAt: Date | null;
    welcomeSentAt: Date | null;
    createdAt: Date;
  };
  components: FicheComponent[];
  /** Plateforme déduite de la fiche — décide de l'écosystème d'une extension. */
  platform: string | null;
}

/** Fiche complète d'un client, ou null s'il n'existe pas. */
export async function getFiche(clientId: string): Promise<Fiche | null> {
  const [client] = await db()
    .select({
      id: clients.id,
      email: clients.email,
      name: clients.name,
      company: clients.company,
      siteUrl: clients.siteUrl,
      sector: clients.sector,
      notes: clients.notes,
      active: clients.active,
      stripeCustomerId: clients.stripeCustomerId,
      onboardedAt: clients.onboardedAt,
      welcomeSentAt: clients.welcomeSentAt,
      createdAt: clients.createdAt,
    })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!client) return null;

  const rows = await db()
    .select({
      id: stackItems.id,
      type: stackItems.type,
      slug: stackItems.slug,
      label: stackItems.label,
      version: stackItems.version,
      ecosystem: stackItems.ecosystem,
      source: stackItems.source,
      watchEnabled: stackItems.watchEnabled,
    })
    .from(stackItems)
    .where(eq(stackItems.clientId, clientId))
    .orderBy(asc(stackItems.type), asc(stackItems.label));

  const components = rows as FicheComponent[];

  return {
    client,
    components,
    // La règle de priorité (CMS > boutique > méta-framework) vit dans le
    // scanner : la réécrire ici ferait diverger la fiche du rapport.
    platform: detectPlatform(
      components.map((component) => ({
        type: component.type,
        slug: component.slug,
        label: component.label,
        ecosystem: component.ecosystem,
        version: component.version,
        confidence: "high" as const,
        versionConfidence: null,
      })),
    ),
  };
}

/**
 * Verse dans la fiche ce qu'un scan a détecté.
 *
 * Idempotent : relancer un scan met à jour les versions détectées et n'invente
 * aucune ligne. Une ligne déclarée par le client n'est jamais touchée — la
 * condition est dans le `setWhere`, donc dans la base.
 */
export async function importScannedStack(
  clientId: string,
  result: ScanResult,
): Promise<{ written: number }> {
  const drafts = stackItemsFromScan(result);
  if (drafts.length === 0) return { written: 0 };

  const written = await db()
    .insert(stackItems)
    .values(drafts.map((draft) => ({ ...draft, clientId })))
    .onConflictDoUpdate({
      target: [stackItems.clientId, stackItems.slug, stackItems.type],
      set: {
        label: sql`excluded.label`,
        version: sql`excluded.version`,
        ecosystem: sql`excluded.ecosystem`,
        meta: sql`excluded.meta`,
        lastCheckedAt: sql`now()`,
      },
      // Le détecté ne remplace que du détecté.
      setWhere: eq(stackItems.source, "scanned"),
    })
    .returning({ id: stackItems.id });

  return { written: written.length };
}

export interface ProfilePatch {
  company?: string | null;
  siteUrl?: string | null;
  sector?: string | null;
  notes?: string | null;
}

/**
 * Enregistre la fiche déclarative : profil + composants déclarés.
 *
 * Le formulaire porte **la totalité** de ce que le client déclare : une ligne
 * qu'il a retirée doit disparaître. On remplace donc l'ensemble des lignes
 * `declared`, sans jamais toucher aux lignes `scanned`.
 */
export async function saveDeclaredStack(
  clientId: string,
  declared: StackDraft[],
  profile: ProfilePatch = {},
  now: Date = new Date(),
): Promise<{ kept: number; removed: number }> {
  const patch: Record<string, unknown> = { onboardedAt: now };
  if (profile.company !== undefined) patch.company = profile.company;
  if (profile.siteUrl) patch.siteUrl = profile.siteUrl;
  if (profile.sector !== undefined) patch.sector = profile.sector;
  if (profile.notes !== undefined) patch.notes = profile.notes;

  await db().update(clients).set(patch).where(eq(clients.id, clientId));

  const keys = declared.map((item) => `${item.type}:${item.slug}`);

  // Suppression des lignes déclarées qui ne figurent plus dans le formulaire.
  // Le filtre porte sur `source = 'declared'` : un composant détecté par le
  // scan ne disparaît pas parce que le client ne l'a pas retapé à la main.
  const existing = await db()
    .select({ id: stackItems.id, slug: stackItems.slug, type: stackItems.type })
    .from(stackItems)
    .where(and(eq(stackItems.clientId, clientId), eq(stackItems.source, "declared")));

  const obsolete = existing
    .filter((row) => !keys.includes(`${row.type}:${row.slug}`))
    .map((row) => row.id);

  if (obsolete.length > 0) {
    await db().delete(stackItems).where(inArray(stackItems.id, obsolete));
  }

  if (declared.length === 0) return { kept: 0, removed: obsolete.length };

  await db()
    .insert(stackItems)
    .values(declared.map((item) => ({ ...item, clientId })))
    .onConflictDoUpdate({
      target: [stackItems.clientId, stackItems.slug, stackItems.type],
      set: {
        label: sql`excluded.label`,
        version: sql`excluded.version`,
        ecosystem: sql`excluded.ecosystem`,
        meta: sql`excluded.meta`,
        // Une ligne détectée que le client confirme devient déclarée : sa
        // version est désormais certaine, et c'est ce qui autorise un rouge.
        source: sql`excluded.source`,
      },
    });

  return { kept: declared.length, removed: obsolete.length };
}

/**
 * Marque l'e-mail de bienvenue comme parti.
 *
 * Écriture conditionnelle : le premier passage gagne. C'est ce qui rend le
 * parcours post-paiement rejouable sans qu'un abonné reçoive deux fois le même
 * message — Stripe rejoue ses webhooks, et un rejeu n'est pas un événement.
 */
export async function markWelcomeSent(
  clientId: string,
  at: Date = new Date(),
): Promise<boolean> {
  const rows = await db()
    .update(clients)
    .set({ welcomeSentAt: at })
    .where(and(eq(clients.id, clientId), sql`${clients.welcomeSentAt} is null`))
    .returning({ id: clients.id });

  return rows.length > 0;
}

/** Rattache le scan d'origine à la fiche, sans jamais en écraser un déjà noté. */
export async function linkOriginScan(clientId: string, scanId: string): Promise<void> {
  await db()
    .update(clients)
    .set({ originScanId: scanId })
    .where(and(eq(clients.id, clientId), sql`${clients.originScanId} is null`));
}
