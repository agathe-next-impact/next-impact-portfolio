"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseLettreDraft,
  requestDigestRebuild,
  saveDigestLettre,
  sendDigest,
  validateDigest,
} from "@sentinelle/admin";
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
//
// Il n'y a plus d'action ici pour les alertes de veille (CVE, fin de support) :
// depuis 2026-09, elles se rédigent, se relisent et se valident dans leur page
// Notion — voir docs/sentinelle/notion-alertes.md. Ce fichier ne porte que le
// cycle de la lettre bimensuelle, qui reste dans l'admin.
// ─────────────────────────────────────────────────────────────────────────────

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

// ─── Numéros de la lettre bimensuelle ────────────────────────────────────────

export async function enregistrerNumero(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("digestId"));
  const lue = parseLettreDraft(String(formData.get("lettre") ?? ""));
  if (!lue.ok) {
    retour(`/admin/sentinelle/numeros/${id}`, { ok: false, reason: lue.reason }, "");
    return;
  }

  const resultat = await saveDigestLettre(id, lue.lettre);
  const violations = resultat.ok ? resultat.value.violations : [];

  retour(
    `/admin/sentinelle/numeros/${id}`,
    resultat,
    violations.length > 0
      ? `Numéro enregistré. La validation le refusera en l'état : ${violations.join(" · ")}`
      : "Numéro enregistré.",
  );
}

export async function validerNumero(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("digestId"));
  const lue = parseLettreDraft(String(formData.get("lettre") ?? ""));
  if (!lue.ok) {
    retour(`/admin/sentinelle/numeros/${id}`, { ok: false, reason: lue.reason }, "");
    return;
  }

  const resultat = await validateDigest(id, lue.lettre);

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

export async function refabriquerNumero(formData: FormData): Promise<void> {
  await requireSession();

  const id = String(formData.get("digestId"));
  const resultat = await requestDigestRebuild(id);

  retour(
    `/admin/sentinelle/numeros/${id}`,
    resultat,
    "Refabrication lancée. Comptez quelques minutes, puis rechargez la page.",
  );
}
