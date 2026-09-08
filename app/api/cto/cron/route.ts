import { NextResponse, type NextRequest } from "next/server";
import { purgeExpiredAccess, type PurgeReport } from "@cto/access";
import { configurationIssue, syncFromNotion, type SyncReport } from "@cto/notion";

// ─────────────────────────────────────────────────────────────────────────────
// Le balayage quotidien de l'espace CTO.
//
// **Une route pour deux travaux, délibérément.** Le ménage des accès et la
// synchronisation des livrables n'ont rien à voir l'un avec l'autre, mais ils
// partagent la seule chose qui compte ici : ils doivent tourner tous les jours,
// sans personne devant. Deux entrées de Cron, ce serait deux configurations à
// tenir, deux secrets à faire tourner, et un jour l'une des deux oubliée.
//
// **Le ménage passe en premier, et il passe quoi qu'il arrive.** Il ne dépend
// que de la base ; la synchro dépend en plus de Notion. Les enchaîner dans
// l'autre sens ferait qu'une indisponibilité de Notion emporterait aussi la
// purge, c'est-à-dire ce que la page de confidentialité promet.
//
// **L'échec est bruyant, la configuration absente ne l'est pas.** Si la synchro
// tombe, la route rend 500 : un Cron rouge dans le tableau de bord Vercel est
// exactement ce qu'on veut voir. Mais tant que les variables Notion ne sont pas
// posées, elle rend 200 en le disant dans le corps — un Cron rouge tous les
// jours pour une raison connue et acceptée finit par ne plus être lu, et c'est
// le vrai incident qu'on manquerait alors.
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

/**
 * Le balayage tient largement dans la minute aujourd'hui. La marge sert au
 * premier passage sur un atelier bien rempli : la synchro s'espace de 350 ms
 * entre deux appels Notion et écrit un livrable à la fois.
 */
export const maxDuration = 300;

interface CronBody {
  purge: PurgeReport | { erreur: string };
  synchro: SyncReport | { ignoree: string } | { erreur: string };
}

/**
 * Vérifie que l'appel vient bien de Vercel Cron.
 *
 * Vercel envoie `Authorization: Bearer <CRON_SECRET>` dès que la variable est
 * posée. Sans elle, la route reste **fermée** au lieu de s'ouvrir à tout le
 * monde : une route de maintenance publique laisserait n'importe qui déclencher
 * des écritures et lire l'état de tous les accompagnements.
 */
function autorise(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!autorise(request)) {
    // 404 et non 401 : cette route n'a pas à confirmer son existence à qui n'a
    // pas le secret.
    return new NextResponse(null, { status: 404 });
  }

  const body: CronBody = {
    purge: { erreur: "non exécutée" },
    synchro: { ignoree: "non exécutée" },
  };
  let status = 200;

  try {
    body.purge = await purgeExpiredAccess();
  } catch (error) {
    console.error("[cto] purge impossible", error);
    body.purge = { erreur: error instanceof Error ? error.message : "échec" };
    status = 500;
  }

  const issue = configurationIssue();
  if (issue) {
    body.synchro = { ignoree: issue };
    return NextResponse.json(body, { status });
  }

  try {
    body.synchro = await syncFromNotion();
  } catch (error) {
    console.error("[cto] synchro Notion impossible", error);
    body.synchro = { erreur: error instanceof Error ? error.message : "échec" };
    status = 500;
  }

  return NextResponse.json(body, { status });
}
