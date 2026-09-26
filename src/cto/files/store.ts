import { createHash } from "node:crypto";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "../db/client";
import { ctoDeliverables, ctoFiles, ctoSiteReports } from "../db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Les fichiers rapatriés — pièces jointes Notion, rapports WP Umbrella.
//
// Trois opérations, et aucune autre : télécharger et ranger (`importFile`),
// relire (`readFile`), et dire si une personne a le droit de le relire
// (`fileBelongsTo`). La dernière est la seule qui compte vraiment : un fichier
// est adressé par son empreinte, que l'URL transporte ; sans ce contrôle,
// quiconque obtient l'empreinte d'un audit le télécharge.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Au-delà, le fichier n'est pas rapatrié et la synchro le signale.
 *
 * Quinze mégaoctets couvrent un rapport d'audit illustré ou un contrat scanné.
 * Plus gros, c'est presque toujours une vidéo ou une archive glissée par
 * erreur dans une colonne « Fichier » — mieux vaut le voir dans le rapport que
 * de le découvrir dans la facture Neon.
 */
export const MAX_FILE_BYTES = 15 * 1024 * 1024;

/** Le descripteur qu'un livrable garde de son fichier. Jamais le contenu. */
export interface FileRef {
  id: string;
  name: string;
  mime: string;
  size: number;
}

export class FileTooLargeError extends Error {
  constructor(readonly size: number) {
    super(`fichier de ${Math.round(size / 1024 / 1024)} Mo, au-delà de la limite de 15 Mo`);
    this.name = "FileTooLargeError";
  }
}

/** Type MIME déduit de l'extension, quand la source n'en donne pas de fiable. */
export function mimeFromName(name: string, fallback = "application/octet-stream"): string {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  const table: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    csv: "text/csv",
    txt: "text/plain",
    zip: "application/zip",
  };
  return table[ext] ?? fallback;
}

/** Empreinte hexadécimale d'un contenu : c'est l'identifiant du fichier. */
export function fileDigest(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/**
 * Télécharge une URL (souvent signée et éphémère) et range le fichier.
 *
 * Idempotent : un contenu déjà connu n'est pas réécrit, seule sa référence est
 * rendue. C'est ce qui permet à la synchro quotidienne de repasser sur les
 * mêmes pièces sans rien écrire — au prix d'un téléchargement par passage,
 * assumé : l'URL signée change à chaque lecture, elle ne dit donc rien du
 * contenu, et seule l'empreinte permet de savoir si la pièce a bougé.
 */
export async function importFile(
  url: string,
  name: string,
  options: { dryRun?: boolean; mime?: string } = {},
): Promise<FileRef> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`téléchargement refusé (${response.status})`);

  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_FILE_BYTES) throw new FileTooLargeError(declared);

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_FILE_BYTES) throw new FileTooLargeError(bytes.byteLength);

  const headerMime = response.headers.get("content-type")?.split(";")[0]?.trim();
  const mime =
    options.mime ??
    (headerMime && headerMime !== "application/octet-stream" && headerMime !== "binary/octet-stream"
      ? headerMime
      : mimeFromName(name));

  const ref: FileRef = { id: fileDigest(bytes), name, mime, size: bytes.byteLength };
  if (options.dryRun) return ref;

  await db()
    .insert(ctoFiles)
    .values({
      id: ref.id,
      name: ref.name,
      mime: ref.mime,
      size: ref.size,
      content: Buffer.from(bytes).toString("base64"),
    })
    .onConflictDoNothing();

  return ref;
}

/** Le fichier, prêt à servir. `null` s'il n'existe pas. */
export async function readFile(
  id: string,
): Promise<{ ref: FileRef; bytes: Uint8Array } | null> {
  const [row] = await db().select().from(ctoFiles).where(eq(ctoFiles.id, id)).limit(1);
  if (!row) return null;
  return {
    ref: { id: row.id, name: row.name, mime: row.mime, size: row.size },
    bytes: new Uint8Array(Buffer.from(row.content, "base64")),
  };
}

/**
 * Ce fichier appartient-il à cet accompagnement ?
 *
 * Deux chemins d'appartenance, et deux seulement : la version COURANTE et
 * publiée d'un document du client, ou un rapport de maintenance du client. Une
 * ancienne version compte aussi — l'historique d'un document reste consultable,
 * pièce comprise, comme tout l'historique append-only — mais pas un document
 * retiré : retirer, c'est retirer la pièce avec.
 */
export async function fileBelongsTo(fileId: string, clientId: string): Promise<boolean> {
  const [report] = await db()
    .select({ id: ctoSiteReports.id })
    .from(ctoSiteReports)
    .where(and(eq(ctoSiteReports.fileId, fileId), eq(ctoSiteReports.clientId, clientId)))
    .limit(1);
  if (report) return true;

  // Les documents et audits du client qui ont porté ce fichier, dans n'importe
  // quelle version — puis l'état COURANT de chacun : s'il est un retrait, la
  // pièce ne sort plus. Un audit liste ses pièces (images, annexe) dans
  // `payload.fichiers`, faute de pouvoir les chercher dans ses blocs.
  const porteurs = await db()
    .selectDistinct({ notionPageId: ctoDeliverables.notionPageId })
    .from(ctoDeliverables)
    .where(
      and(
        eq(ctoDeliverables.clientId, clientId),
        or(
          and(
            eq(ctoDeliverables.kind, "document"),
            sql`${ctoDeliverables.payload} -> 'fichier' ->> 'id' = ${fileId}`,
          ),
          and(
            inArray(ctoDeliverables.kind, ["audit", "proposition"]),
            sql`${ctoDeliverables.payload} -> 'fichiers' @> jsonb_build_array(${fileId}::text)`,
          ),
        ),
      ),
    );
  if (porteurs.length === 0) return false;

  const courants = await db()
    .selectDistinctOn([ctoDeliverables.notionPageId], {
      withdrawnAt: ctoDeliverables.withdrawnAt,
    })
    .from(ctoDeliverables)
    .where(
      and(
        eq(ctoDeliverables.clientId, clientId),
        inArray(
          ctoDeliverables.notionPageId,
          porteurs.map((row) => row.notionPageId),
        ),
      ),
    )
    .orderBy(ctoDeliverables.notionPageId, desc(ctoDeliverables.version));

  return courants.some((row) => row.withdrawnAt === null);
}
