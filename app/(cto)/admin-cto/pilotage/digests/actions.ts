"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assembleWeek, parseWeek, validateAndSend } from "@cto/digest";
import { syncSentinelle } from "@cto/sentinelle";
import { requireSession } from "../../session";

// ─────────────────────────────────────────────────────────────────────────────
// Actions de la relecture des digests.
//
// Revérifient la session, comme toutes les actions de l'admin : une action
// serveur est une URL publique, la garde du layout ne protège que l'affichage.
// ─────────────────────────────────────────────────────────────────────────────

const PAGE = "/admin-cto/pilotage/digests";

function semaineDe(formData: FormData): string {
  const week = String(formData.get("week") ?? "");
  if (!parseWeek(week)) throw new Error("Semaine invalide.");
  return week;
}

function origine(): string {
  return process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
}

/** Relit les exports Sentinelle et réassemble les brouillons de la semaine. */
export async function reassembler(formData: FormData): Promise<void> {
  await requireSession();
  const week = semaineDe(formData);
  await syncSentinelle();
  const report = await assembleWeek(week);
  revalidatePath(PAGE);
  redirect(`${PAGE}?semaine=${week}&message=${encodeURIComponent(
    `${report.created + report.refreshed} brouillon(s) assemblé(s), ${report.frozen} déjà validé(s).`,
  )}`);
}

/** Valide et envoie : un digest (champ `id`) ou tous les brouillons de la semaine. */
export async function validerEtEnvoyer(formData: FormData): Promise<void> {
  await requireSession();
  const week = semaineDe(formData);
  const id = formData.get("id");
  const report = await validateAndSend(week, {
    ids: id ? [String(id)] : undefined,
    url: `${origine()}/espace-direction/veille?semaine=${week}`,
  });
  revalidatePath(PAGE);
  const suite = report.warnings.length > 0 ? ` ${report.warnings.join(" ")}` : "";
  redirect(`${PAGE}?semaine=${week}&message=${encodeURIComponent(
    `${report.sent} digest(s) envoyé(s), ${report.validated} validé(s).${suite}`,
  )}`);
}
