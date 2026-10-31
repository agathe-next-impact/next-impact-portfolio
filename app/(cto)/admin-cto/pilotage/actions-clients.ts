"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ajouterPersonneLocale,
  ajouterSiteLocal,
  alignerSentinelle,
  basculerAccesLocal,
  clientDetail,
  creerClientLocal,
  lancerScanSentinelle,
  majClientLocal,
  majSiteLocal,
  manquesDeSite,
  retirerSiteLocal,
  sendAccessLink,
  STATUTS,
  validerNouveauClient,
  validerSite,
} from "@cto/admin";
import { poserFlash } from "../../flash";
import { requireSession } from "../session";

// ─────────────────────────────────────────────────────────────────────────────
// Actions serveur de l'administration d'un client créé depuis l'admin.
//
// Comme `actions.ts` : chaque action revérifie la session (une action serveur
// est une URL publique, la garde du layout ne protège que l'affichage) et ne
// touche jamais un client piloté par Notion — les fonctions de `@cto/admin`
// (`local.ts`) le refusent, et le message s'affiche tel quel.
// ─────────────────────────────────────────────────────────────────────────────

function origine(): string {
  return process.env.CTO_ORIGIN?.split(",")[0]?.trim() || "https://next-impact.digital";
}

function texte(formData: FormData, nom: string): string {
  return String(formData.get(nom) ?? "");
}

/** Un message d'erreur lisible, d'où qu'il vienne. */
function message(error: unknown): string {
  return error instanceof Error ? error.message : "Opération impossible.";
}

function pageClient(clientId: string): string {
  return `/admin-cto/pilotage/clients/${clientId}`;
}

async function fin(clientId: string, texteFlash: string, ok = true): Promise<never> {
  await poserFlash(texteFlash, ok ? "succes" : "erreur");
  revalidatePath(pageClient(clientId));
  revalidatePath("/admin-cto/pilotage");
  redirect(pageClient(clientId));
}

/** Le message de l'admin, suivi de ce que Sentinelle a fait pour s'aligner sur le changement. */
async function etSentinelle(clientId: string, texteFlash: string): Promise<string> {
  const suite = await alignerSentinelle(clientId).catch(() => null);
  return suite ? `${texteFlash} ${suite}` : texteFlash;
}

/** Les lignes de site d'un formulaire : `site.<n>.<champ>`, jusqu'à la première ligne absente. */
function lireSites(formData: FormData) {
  const sites = [];
  for (let n = 0; n < 12; n += 1) {
    if (!formData.has(`site.${n}.url`)) break;
    sites.push({
      name: texte(formData, `site.${n}.name`),
      url: texte(formData, `site.${n}.url`),
      wpUmbrellaProjectId: texte(formData, `site.${n}.projet`),
      watch: formData.get(`site.${n}.veille`) === "on",
      suiviFormule: texte(formData, `site.${n}.formule`) || null,
      sansSuivi: formData.get(`site.${n}.sansSuivi`) === "on",
    });
  }
  return sites;
}

/** Crée le client, son premier accès et ses sites ; invite le contact si demandé. */
export async function creerClient(formData: FormData): Promise<void> {
  await requireSession();

  const resultat = validerNouveauClient({
    company: texte(formData, "company"),
    tier: texte(formData, "tier"),
    services: formData.getAll("services").map(String),
    contactName: texte(formData, "contactName"),
    contactEmail: texte(formData, "contactEmail"),
    contactRole: texte(formData, "contactRole"),
    sites: lireSites(formData),
  });

  if (!resultat.ok) {
    await poserFlash(resultat.erreurs.join(" "), "erreur");
    redirect("/admin-cto/pilotage/nouveau");
  }

  let clientId: string;
  try {
    clientId = await creerClientLocal(resultat.value);
  } catch (error) {
    console.error("[cto] création de client impossible", error);
    await poserFlash(message(error), "erreur");
    redirect("/admin-cto/pilotage/nouveau");
  }

  const manques = manquesDeSite(resultat.value.services, resultat.value.sites);
  let texteFlash = `Client « ${resultat.value.company} » créé.`;

  if (formData.get("inviter") === "on") {
    const detail = await clientDetail(clientId);
    const premiere = detail?.persons[0];
    if (premiere) {
      const envoi = await sendAccessLink(premiere.id, origine());
      texteFlash += envoi.ok ? ` Invitation envoyée à ${envoi.email}.` : ` Invitation non envoyée : ${envoi.reason}`;
    }
  }
  if (manques.length > 0) texteFlash += ` À compléter : ${manques.join(" ")}`;

  await fin(clientId, texteFlash);
}

/** Raison sociale, palier, statut. */
export async function majCoordonnees(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  const statut = STATUTS.find((s) => s.code === texte(formData, "status"))?.code;
  try {
    await majClientLocal(clientId, {
      company: texte(formData, "company"),
      tier: texte(formData, "tier"),
      status: statut,
    });
  } catch (error) {
    return fin(clientId, message(error), false);
  }
  return fin(clientId, await etSentinelle(clientId, "Coordonnées enregistrées."));
}

/** Active et désactive des services : l'espace du client se recompose au prochain affichage. */
export async function majServices(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  try {
    await majClientLocal(clientId, { services: formData.getAll("services").map(String) });
  } catch (error) {
    return fin(clientId, message(error), false);
  }
  return fin(
    clientId,
    await etSentinelle(clientId, "Services enregistrés. L'espace du client se met à jour à son prochain affichage."),
  );
}

export async function ajouterPersonne(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  try {
    await ajouterPersonneLocale(clientId, {
      name: texte(formData, "name"),
      email: texte(formData, "email"),
      role: texte(formData, "role") || null,
    });
  } catch (error) {
    return fin(clientId, message(error), false);
  }
  return fin(clientId, "Personne ajoutée. Envoyez-lui son invitation depuis la liste.");
}

export async function basculerPersonne(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  const revoque = texte(formData, "action") === "revoquer";
  try {
    await basculerAccesLocal(texte(formData, "personId"), revoque);
  } catch (error) {
    return fin(clientId, message(error), false);
  }
  return fin(clientId, await etSentinelle(clientId, revoque ? "Accès révoqué, sessions fermées." : "Accès rétabli."));
}

export async function ajouterSite(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  const [ligne] = lireSites(formData);
  const site = validerSite(ligne ?? {});
  if (!site.ok) return fin(clientId, site.erreurs.join(" "), false);
  try {
    await ajouterSiteLocal(clientId, site.value);
  } catch (error) {
    return fin(clientId, message(error), false);
  }
  return fin(clientId, await etSentinelle(clientId, "Site ajouté."));
}

export async function enregistrerSite(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  const [ligne] = lireSites(formData);
  const site = validerSite(ligne ?? {});
  if (!site.ok) return fin(clientId, site.erreurs.join(" "), false);
  try {
    await majSiteLocal(texte(formData, "siteId"), site.value);
  } catch (error) {
    return fin(clientId, message(error), false);
  }
  return fin(clientId, await etSentinelle(clientId, "Site enregistré."));
}

export async function retirerSite(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  try {
    await retirerSiteLocal(texte(formData, "siteId"));
  } catch (error) {
    return fin(clientId, message(error), false);
  }
  return fin(clientId, await etSentinelle(clientId, "Site retiré de l'espace du client."));
}

/** Provisionne Sentinelle pour ce client et relance l'analyse de tous ses sites. */
export async function lancerScan(formData: FormData): Promise<void> {
  await requireSession();
  const clientId = texte(formData, "clientId");
  const resultat = await lancerScanSentinelle(clientId);
  return fin(clientId, resultat.message, resultat.ok);
}
