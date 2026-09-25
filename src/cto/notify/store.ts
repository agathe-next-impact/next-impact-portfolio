import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients } from "../db/schema";
import { activePersons, sendPublicationNotice, type PublicationSummary } from "../access";
import { listForClient, type DeliverableKind } from "../deliverables";

// ─────────────────────────────────────────────────────────────────────────────
// La notification, détachée de la synchro.
//
// `src/cto/notion/sync.ts` écrit les livrables dans `cto_deliverables` et
// s'arrête là — il ne sait plus rien envoyer par e-mail. Ce module fait
// l'inverse : il ne lit jamais Notion, seulement l'état déjà écrit en base, et
// décide seul quoi notifier en comparant `recordedAt` à `cto_clients.last_notified_at`
// (voir schema.ts pour pourquoi cette date existe).
//
// Conséquence voulue : synchroniser dix fois dans l'après-midi pendant qu'on
// relit un audit ne prévient personne. La notification est un geste séparé,
// lancé quand le contenu est prêt à être vu — `npm run cto:notify`.
// ─────────────────────────────────────────────────────────────────────────────

/** Intitulés lisibles pour l'e-mail. Jamais de titres de livrables. */
const KIND_LABELS: Record<DeliverableKind, string> = {
  decision: "relevé de décisions",
  roadmap: "roadmap",
  cartographie: "cartographie",
  veille: "veille",
  document: "documents",
  prestation: "prestations",
  audit: "audit",
};

export interface NotifyReport {
  /** Accompagnements pour lesquels un e-mail est parti (ou serait parti, à blanc). */
  notified: number;
  /** Accompagnements actifs sans rien de neuf depuis leur dernière notification. */
  upToDate: number;
  warnings: string[];
}

/**
 * Notifie chaque accompagnement actif de ce qui a été publié depuis SA
 * dernière notification — pas depuis le dernier balayage, ce n'est pas la même
 * borne : un accompagnement jamais notifié reçoit tout ce qui est visible
 * aujourd'hui, même publié il y a plusieurs balayages.
 *
 * Un accompagnement `suspendu` ou en `restitution` est ignoré ET sa date n'
 * avance pas : à la réactivation, le prochain passage le rattrape d'un coup au
 * lieu de le laisser en arrière définitivement — même principe que la synchro,
 * qui continue d'écrire en silence pendant une suspension.
 */
export async function notifyPendingPublications(
  options: { dryRun?: boolean } = {},
  now: Date = new Date(),
): Promise<NotifyReport> {
  const dryRun = options.dryRun === true;
  const warnings: string[] = [];
  let notified = 0;
  let upToDate = 0;

  const base = process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
  const url = `${base}/espace-direction`;

  const clients = await db()
    .select({ id: ctoClients.id, lastNotifiedAt: ctoClients.lastNotifiedAt })
    .from(ctoClients)
    .where(eq(ctoClients.status, "actif"));

  for (const client of clients) {
    const since = client.lastNotifiedAt;
    const items = (await listForClient(client.id)).filter(
      (item) => !since || item.recordedAt.getTime() > since.getTime(),
    );

    if (items.length === 0) {
      upToDate += 1;
      continue;
    }

    const parKind = new Map<DeliverableKind, number>();
    let nouveautes = 0;
    let corrections = 0;
    for (const item of items) {
      if (item.version === 1) nouveautes += 1;
      else corrections += 1;
      parKind.set(item.kind, (parKind.get(item.kind) ?? 0) + 1);
    }

    const summary: PublicationSummary = {
      nouveautes,
      corrections,
      parCategorie: [...parKind].map(([kind, count]) => ({ label: KIND_LABELS[kind], count })),
    };

    const persons = await activePersons(client.id);
    if (persons.length === 0) {
      // Rien n'a pu être communiqué : la date n'avance pas, pour que ce
      // contenu reste « à notifier » le jour où quelqu'un rejoint l'espace.
      warnings.push(`Accompagnement ${client.id} : du nouveau à notifier, mais aucune personne active.`);
      continue;
    }

    if (!dryRun) {
      for (const person of persons) {
        try {
          await sendPublicationNotice({ email: person.email, name: person.name }, summary, url);
        } catch (error) {
          console.error("[cto] notification de publication impossible", error);
          warnings.push(`Notification non envoyée à ${person.email} : l'envoi a échoué.`);
        }
      }

      await db().update(ctoClients).set({ lastNotifiedAt: now }).where(eq(ctoClients.id, client.id));
    }

    notified += 1;
  }

  return { notified, upToDate, warnings };
}
