"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { recordSyncRun, sendAccessLink, setSyncEnabled, summarizeNotify, summarizeSync } from "@cto/admin";
import { configurationIssue, syncFromNotion } from "@cto/notion";
import { notifyPendingPublications } from "@cto/notify";
import { requireSession } from "../session";

// ─────────────────────────────────────────────────────────────────────────────
// Actions serveur de l'admin de supervision.
//
// **Revérifie la session.** Une action serveur est une URL publique : la garde
// du layout (`pilotage/layout.tsx`) protège l'affichage, pas l'exécution.
// Oublier ce contrôle ici laisserait quiconque connaît le nom de l'action
// couper la synchro d'un client sans être connecté.
// ─────────────────────────────────────────────────────────────────────────────

function origine(): string {
  return process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
}

export async function basculerSynchro(formData: FormData): Promise<void> {
  await requireSession();

  const clientId = String(formData.get("clientId"));
  const enabled = formData.get("next") === "actif";

  await setSyncEnabled(clientId, enabled);

  revalidatePath(`/admin-cto/pilotage/clients/${clientId}`);
  revalidatePath("/admin-cto/pilotage");
  redirect(`/admin-cto/pilotage/clients/${clientId}`);
}

/**
 * Envoie le lien de connexion d'une personne — l'invitation, ou un nouveau
 * lien pour quelqu'un qui a perdu le sien. Remplace `npm run cto:invite
 * --client …` pour toute personne déjà créée depuis la base Personnes.
 */
export async function envoyerLien(formData: FormData): Promise<void> {
  await requireSession();

  const clientId = String(formData.get("clientId"));
  const personId = String(formData.get("personId"));
  const outcome = await sendAccessLink(personId, origine());
  const message = outcome.ok ? `Lien de connexion envoyé à ${outcome.email}.` : outcome.reason;

  redirect(
    `/admin-cto/pilotage/clients/${clientId}?${outcome.ok ? "message" : "erreur"}=${encodeURIComponent(message)}`,
  );
}

/** Ce que les deux panneaux de l'écran de pilotage affichent après un clic. */
export interface RapportState {
  ok: boolean;
  lines: string[];
  warnings: string[];
  /** Parmi `warnings`, ce qui touche un accès ou un rattachement. */
  alerts: string[];
  at: string | null;
}

/**
 * Lance la synchro Notion tout de suite, sans attendre le Cron de 4 h — la
 * même fonction que `npm run cto:sync`. `mode=a-blanc` lit sans écrire.
 * N'envoie aucun e-mail, comme la commande.
 */
export async function synchroniser(_prev: RapportState, formData: FormData): Promise<RapportState> {
  await requireSession();
  const at = new Date().toISOString();

  const issue = configurationIssue();
  if (issue) return { ok: false, lines: [issue], warnings: [], alerts: [], at };

  const dryRun = formData.get("mode") === "a-blanc";
  try {
    const report = await syncFromNotion({ dryRun });
    // Au journal, sans e-mail : le rapport est sous les yeux de qui a cliqué.
    await recordSyncRun({ source: "admin", report });
    revalidatePath("/admin-cto/pilotage", "layout");
    return { ok: true, ...summarizeSync(report), at };
  } catch (error) {
    console.error("[cto] synchro depuis l'admin impossible", error);
    const erreur = error instanceof Error ? error.message : "Échec de la synchro.";
    if (!dryRun) await recordSyncRun({ source: "admin", error: erreur });
    return { ok: false, lines: [erreur], warnings: [], alerts: [], at };
  }
}

/**
 * Prévient les clients de ce qui a été publié depuis leur dernière
 * notification — la même fonction que `npm run cto:notify`. `mode=a-blanc`
 * dit qui serait prévenu sans rien envoyer.
 */
export async function prevenir(_prev: RapportState, formData: FormData): Promise<RapportState> {
  await requireSession();
  const at = new Date().toISOString();
  const dryRun = formData.get("mode") === "a-blanc";

  try {
    const report = await notifyPendingPublications({ dryRun });
    return { ok: true, ...summarizeNotify(report, dryRun), at };
  } catch (error) {
    console.error("[cto] notification depuis l'admin impossible", error);
    return {
      ok: false,
      lines: [error instanceof Error ? error.message : "Échec de la notification."],
      warnings: [],
      alerts: [],
      at,
    };
  }
}
