"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { poserFlash } from "../../../flash";
import {
  assembleWeek,
  digestsOfWeek,
  dismissDigest,
  editDigest,
  parseWeek,
  reopenDigest,
  resetDigest,
  retouchesDuFormulaire,
  sendDigest,
  validateDigest,
} from "@cto/digest";
import { syncSentinelle } from "@cto/sentinelle";
import { requireSession } from "../../session";

// ─────────────────────────────────────────────────────────────────────────────
// Actions de la relecture des digests.
//
// Toutes portent sur UN digest (champ `id`) : on retouche, on valide, on envoie
// au cas par cas. Aucune action n'envoie en lot, et l'envoi ne valide pas : un
// digest part seulement s'il a été validé d'abord.
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

function idDe(formData: FormData): string {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Digest non précisé.");
  return id;
}

function origine(): string {
  return process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
}

/** Exécute un geste, pose le message, revient sur la semaine (et le digest). */
async function geste(formData: FormData, faire: (id: string, week: string) => Promise<string>): Promise<never> {
  await requireSession();
  const week = semaineDe(formData);
  const id = idDe(formData);
  try {
    await poserFlash(await faire(id, week));
  } catch (error) {
    await poserFlash(error instanceof Error ? error.message : "Action impossible.", "erreur");
  }
  revalidatePath(PAGE);
  redirect(`${PAGE}?semaine=${week}#digest-${id}`);
}

/** Relit les exports Sentinelle et réassemble les brouillons non retouchés de la semaine. */
export async function reassembler(formData: FormData): Promise<void> {
  await requireSession();
  const week = semaineDe(formData);
  await syncSentinelle();
  const report = await assembleWeek(week);
  revalidatePath(PAGE);
  await poserFlash(
    `${report.created + report.refreshed} brouillon(s) assemblé(s), ${report.frozen} validé(s) ou retouché(s) laissé(s) tel(s) quel(s).`,
  );
  redirect(`${PAGE}?semaine=${week}`);
}

/** Enregistre les retouches d'un brouillon ; « Enregistrer et valider » le valide dans la foulée. */
export async function retoucher(formData: FormData): Promise<void> {
  await geste(formData, async (id, week) => {
    const digest = (await digestsOfWeek(week)).find((candidat) => candidat.id === id);
    if (!digest) throw new Error("Digest introuvable.");
    await editDigest(id, retouchesDuFormulaire(digest.content, (nom) => {
      const valeur = formData.get(nom);
      return typeof valeur === "string" ? valeur : null;
    }));
    if (formData.get("intention") === "valider") {
      await validateDigest(id);
      return `${digest.company} : retouches enregistrées, digest validé. Il n'est pas encore envoyé.`;
    }
    return `${digest.company} : retouches enregistrées.`;
  });
}

/** Abandonne les retouches d'un brouillon : il redevient celui des sources. */
export async function retablir(formData: FormData): Promise<void> {
  await geste(formData, async (id) => {
    await resetDigest(id);
    return "Retouches abandonnées : le brouillon est réassemblé depuis les sources.";
  });
}

/** Repasse un digest validé (non envoyé) en brouillon, pour le retoucher. */
export async function repasserEnBrouillon(formData: FormData): Promise<void> {
  await geste(formData, async (id) => {
    await reopenDigest(id);
    return "Digest repassé en brouillon.";
  });
}

/** Refuse UN digest non envoyé : il quitte la relecture et ne sera pas réassemblé. */
export async function refuser(formData: FormData): Promise<void> {
  await requireSession();
  const week = semaineDe(formData);
  const id = idDe(formData);
  try {
    await dismissDigest(id);
    await poserFlash("Digest refusé : il ne partira pas et ne sera pas réassemblé.");
  } catch (error) {
    await poserFlash(error instanceof Error ? error.message : "Refus impossible.", "erreur");
  }
  revalidatePath(PAGE);
  redirect(`${PAGE}?semaine=${week}`);
}

/** Envoie UN digest validé. */
export async function envoyer(formData: FormData): Promise<void> {
  await requireSession();
  const week = semaineDe(formData);
  const id = idDe(formData);
  try {
    const report = await sendDigest(id, `${origine()}/espace-direction/veille?semaine=${week}`);
    const suite = report.warnings.length > 0 ? ` ${report.warnings.join(" ")}` : "";
    await poserFlash(`${report.sent ? "Digest envoyé." : "Digest non envoyé."}${suite}`, report.sent && !suite ? "succes" : "erreur");
  } catch (error) {
    await poserFlash(error instanceof Error ? error.message : "Envoi impossible.", "erreur");
  }
  revalidatePath(PAGE);
  redirect(`${PAGE}?semaine=${week}#digest-${id}`);
}
