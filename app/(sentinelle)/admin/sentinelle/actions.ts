"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  dismissAlert,
  dismissComponent,
  reopenAlert,
  saveAlertContent,
  saveDigestBlocks,
  sendAlert,
  sendDigest,
  validateAlert,
  validateDigest,
  VERDICTS,
} from "@sentinelle/admin";
import type { DraftedAlert, Verdict } from "@sentinelle/types";
import { requireSession } from "../session";

// ─────────────────────────────────────────────────────────────────────────────
// Actions serveur de l'admin.
//
// **Chacune revérifie la session.** Une action serveur est une URL publique : la
// garde du layout protège l'affichage, pas l'exécution. Oublier ce contrôle ici
// laisserait quiconque connaît le nom de l'action envoyer un e-mail à un client.
//
// Le retour passe par l'URL (`?ok=` / `?erreur=`) plutôt que par un état client :
// les pages restent des composants serveur, et un rechargement ne rejoue pas
// l'action.
// ─────────────────────────────────────────────────────────────────────────────

function lireContenu(formData: FormData): DraftedAlert {
  const texte = (name: string) => String(formData.get(name) ?? "");
  const verdict = texte("verdict") as Verdict;

  return {
    verdict: VERDICTS.includes(verdict) ? verdict : "info",
    title: texte("title"),
    body: texte("body"),
    whatItChanges: texte("whatItChanges"),
    recommendedAction: texte("recommendedAction"),
    diyPossible: formData.get("diyPossible") === "on",
    effortEstimate: texte("effortEstimate"),
  };
}

/** Renvoie vers la page d'où vient le formulaire, avec le résultat en clair. */
function retour(
  destination: string,
  resultat: { ok: true } | { ok: false; reason: string },
  succes: string,
): never {
  const query = new URLSearchParams(
    resultat.ok ? { ok: succes } : { erreur: resultat.reason },
  );

  revalidatePath("/admin/sentinelle", "layout");
  redirect(`${destination}?${query.toString()}`);
}

export async function enregistrerAlerte(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("alertId"));
  const resultat = await saveAlertContent(id, lireContenu(formData));

  retour(`/admin/sentinelle/alertes/${id}`, resultat, "Texte enregistré.");
}

export async function validerAlerte(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("alertId"));
  // Le contenu du formulaire n'est présent que depuis la page de relecture ; la
  // validation en lot, elle, s'appuie sur ce qui est déjà en base.
  const contenu = formData.has("title") ? lireContenu(formData) : undefined;
  const resultat = await validateAlert(id, contenu);

  retour(
    String(formData.get("retour") ?? `/admin/sentinelle/alertes/${id}`),
    resultat,
    "Alerte validée — elle est prête à partir.",
  );
}

export async function envoyerAlerte(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("alertId"));
  const resultat = await sendAlert(id);

  retour(
    String(formData.get("retour") ?? `/admin/sentinelle/alertes/${id}`),
    resultat,
    resultat.ok ? `Envoyée à ${resultat.value.to}.` : "",
  );
}

export async function ecarterAlerte(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("alertId"));
  const resultat = await dismissAlert(id);

  retour(
    String(formData.get("retour") ?? `/admin/sentinelle/alertes/${id}`),
    resultat,
    "Alerte écartée.",
  );
}

export async function rouvrirAlerte(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("alertId"));
  const resultat = await reopenAlert(id);

  retour(
    String(formData.get("retour") ?? `/admin/sentinelle/alertes/${id}`),
    resultat,
    "Alerte remise dans la file.",
  );
}

// ─── Numéros de la lettre bimensuelle ────────────────────────────────────────

function lireBlocs(formData: FormData): { watch: string; reco: string } {
  return {
    watch: String(formData.get("watch") ?? ""),
    reco: String(formData.get("reco") ?? ""),
  };
}

export async function enregistrerNumero(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("digestId"));
  const resultat = await saveDigestBlocks(id, lireBlocs(formData));

  retour(`/admin/sentinelle/numeros/${id}`, resultat, "Numéro enregistré.");
}

export async function validerNumero(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("digestId"));
  const resultat = await validateDigest(id, lireBlocs(formData));

  retour(
    `/admin/sentinelle/numeros/${id}`,
    resultat,
    "Numéro validé — le rendu est figé, il est prêt à partir.",
  );
}

export async function envoyerNumero(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("digestId"));
  const resultat = await sendDigest(id);

  retour(
    `/admin/sentinelle/numeros/${id}`,
    resultat,
    resultat.ok ? `Envoyé à ${resultat.value.to}.` : "",
  );
}

/**
 * Écarte toutes les alertes ouvertes d'un composant.
 *
 * Le geste qui rend la file utilisable : vingt-neuf CVE sur le même paquet se
 * traitent en une décision. Ne touche jamais une alerte déjà envoyée.
 */
export async function ecarterComposant(formData: FormData): Promise<void> {
  await requireSession();

  const clientId = String(formData.get("clientId"));
  const stackItemId = String(formData.get("stackItemId"));
  const resultat = await dismissComponent(clientId, stackItemId);

  retour(
    `/admin/sentinelle/clients/${clientId}`,
    resultat,
    resultat.ok ? `${resultat.value} alerte(s) écartée(s).` : "",
  );
}
