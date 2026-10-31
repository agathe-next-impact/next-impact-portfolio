import { and, asc, eq, isNull, max, ne } from "drizzle-orm";
import { db } from "../db/client";
import { ctoClients, ctoPersons, ctoSites } from "../db/schema";
import { revokeAllSessions } from "../access";
import { servicesOuverts } from "../notion/map";
import { provisionOne, type WatchWish } from "../sentinelle";

// ─────────────────────────────────────────────────────────────────────────────
// Les clients créés et administrés depuis l'admin.
//
// Un client « local » n'a pas de fiche Notion (`cto_clients.notion_page_id`
// vide) : l'admin en est la source de vérité — services, coordonnées, sites. La
// synchro Notion n'y touche jamais (elle ne lit que les lignes rattachées à une
// page). Un client piloté par Notion reste géré dans Notion : ces fonctions
// refusent de le modifier, pour qu'un clic ne soit pas écrasé au balayage
// suivant.
//
// La première partie (validation, services) est pure et testée ; la seconde
// écrit en base.
// ─────────────────────────────────────────────────────────────────────────────

export const SERVICES: readonly { code: string; label: string; hint: string }[] = [
  { code: "direction-technique", label: "Direction technique", hint: "Décisions, documents, cartographie" },
  { code: "suivi-technique", label: "Suivi technique", hint: "État du site (WP Umbrella)" },
  { code: "actions", label: "Actions en cours", hint: "Roadmap et chantiers" },
  { code: "veille-technique", label: "Veille technique", hint: "Sentinelle : failles et fins de support" },
  { code: "veille-personnalisee", label: "Veille personnalisée", hint: "Lettres Signaux faibles" },
  { code: "prestations", label: "Prestations en cours", hint: "Missions, tarifs et règlements" },
  { code: "audit", label: "Audit", hint: "Synthèses d'audit remises" },
];

export const TIERS: readonly { code: string; label: string }[] = [
  { code: "direction", label: "Direction" },
  { code: "referent", label: "Référent" },
  { code: "audit", label: "Audit seul" },
];

export const STATUTS: readonly { code: "actif" | "suspendu" | "restitution" | "clos"; label: string }[] = [
  { code: "actif", label: "Actif" },
  { code: "suspendu", label: "Suspendu" },
  { code: "restitution", label: "Restitution" },
  { code: "clos", label: "Clos" },
];

const CODES_SERVICES = new Set(SERVICES.map((service) => service.code));
const CODES_PALIERS = new Set(TIERS.map((tier) => tier.code));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pur : ne garde que les services connus, sans doublon, dans l'ordre du catalogue. */
export function lireServices(valeurs: readonly string[]): string[] {
  const choisis = new Set(valeurs.filter((valeur) => CODES_SERVICES.has(valeur)));
  return SERVICES.map((service) => service.code).filter((code) => choisis.has(code));
}

/**
 * Pur : une adresse de site saisie à la main, ramenée à `https://hôte/chemin`,
 * ou `null` si elle ne ressemble pas à un site (pas de point, espaces, schéma
 * autre que http/https).
 */
export function normaliserUrlSite(saisie: string | null | undefined): string | null {
  const brut = saisie?.trim();
  if (!brut || /\s/.test(brut)) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(brut) ? brut : `https://${brut}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return `${url.protocol}//${url.host}${url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

export interface SiteSaisi {
  name: string;
  url: string;
  wpUmbrellaProjectId: number | null;
  watch: boolean;
  suiviFormule: "Essentiel" | "Actif" | null;
  sansSuivi: boolean;
}

export interface NouveauClient {
  company: string;
  tier: string;
  services: string[];
  contact: { name: string; email: string; role: string | null };
  sites: SiteSaisi[];
}

export type Validation<T> = { ok: true; value: T } | { ok: false; erreurs: string[] };

/** Pur : un site saisi (champ par champ), ou une erreur nommant ce qui ne va pas. */
export function validerSite(brut: {
  name?: string | null;
  url?: string | null;
  wpUmbrellaProjectId?: string | number | null;
  watch?: boolean;
  suiviFormule?: string | null;
  sansSuivi?: boolean;
}): Validation<SiteSaisi> {
  const erreurs: string[] = [];
  const url = normaliserUrlSite(brut.url);
  if (!url) erreurs.push(`Adresse de site invalide : « ${brut.url ?? ""} ».`);

  const projetBrut = typeof brut.wpUmbrellaProjectId === "string" ? brut.wpUmbrellaProjectId.trim() : brut.wpUmbrellaProjectId;
  let projet: number | null = null;
  if (projetBrut !== null && projetBrut !== undefined && projetBrut !== "") {
    const n = Number(projetBrut);
    if (!Number.isInteger(n) || n <= 0) erreurs.push(`ID projet WP Umbrella invalide : « ${projetBrut} ».`);
    else projet = n;
  }

  const formule = brut.suiviFormule === "Essentiel" || brut.suiviFormule === "Actif" ? brut.suiviFormule : null;
  if (erreurs.length > 0 || !url) return { ok: false, erreurs };

  return {
    ok: true,
    value: {
      name: brut.name?.trim() || url.replace(/^https?:\/\//, ""),
      url,
      wpUmbrellaProjectId: projet,
      watch: brut.watch === true,
      suiviFormule: formule,
      sansSuivi: brut.sansSuivi === true,
    },
  };
}

/** Pur : la création d'un client, ou la liste de ce qui manque. */
export function validerNouveauClient(brut: {
  company?: string | null;
  tier?: string | null;
  services?: readonly string[];
  contactName?: string | null;
  contactEmail?: string | null;
  contactRole?: string | null;
  sites?: Parameters<typeof validerSite>[0][];
}): Validation<NouveauClient> {
  const erreurs: string[] = [];
  const company = brut.company?.trim() ?? "";
  if (!company) erreurs.push("La raison sociale est obligatoire.");
  if (company.length > 200) erreurs.push("La raison sociale dépasse 200 caractères.");

  const tier = brut.tier && CODES_PALIERS.has(brut.tier) ? brut.tier : "direction";

  const name = brut.contactName?.trim() ?? "";
  const email = brut.contactEmail?.trim().toLowerCase() ?? "";
  if (!name) erreurs.push("Le nom du contact est obligatoire.");
  if (!EMAIL.test(email)) erreurs.push("L'adresse e-mail du contact est invalide.");

  const sites: SiteSaisi[] = [];
  const vus = new Set<string>();
  for (const site of brut.sites ?? []) {
    // Une ligne entièrement vide est une ligne laissée en blanc du formulaire.
    if (!site.url?.trim() && !site.name?.trim() && !String(site.wpUmbrellaProjectId ?? "").trim()) continue;
    const lu = validerSite(site);
    if (!lu.ok) {
      erreurs.push(...lu.erreurs);
      continue;
    }
    if (vus.has(lu.value.url)) {
      erreurs.push(`Site en double : ${lu.value.url}.`);
      continue;
    }
    vus.add(lu.value.url);
    sites.push(lu.value);
  }

  if (erreurs.length > 0) return { ok: false, erreurs };
  return {
    ok: true,
    value: {
      company,
      tier,
      services: lireServices(brut.services ?? []),
      contact: { name, email, role: brut.contactRole?.trim() || null },
      sites,
    },
  };
}

/** Pur : un client qui suit un service qui exige un site, mais sans site pour l'honorer. */
export function manquesDeSite(services: readonly string[], sites: readonly { url: string | null; watch: boolean; wpUmbrellaProjectId: number | null }[]): string[] {
  const manques: string[] = [];
  if (services.includes("veille-technique") && !sites.some((site) => site.watch && site.url)) {
    manques.push("Veille technique : cocher « Veille » sur au moins un site pour que Sentinelle démarre.");
  }
  if (services.includes("suivi-technique") && !sites.some((site) => site.wpUmbrellaProjectId !== null)) {
    manques.push("Suivi technique : renseigner l'ID projet WP Umbrella d'au moins un site.");
  }
  return manques;
}

// ─── Écritures ─────────────────────────────────────────────────────────────

/** Vrai si l'admin est la source de vérité de ce client (pas de fiche Notion). */
export async function estClientLocal(clientId: string): Promise<boolean> {
  const [client] = await db()
    .select({ notionPageId: ctoClients.notionPageId })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);
  return Boolean(client) && client.notionPageId === null;
}

async function exigerLocal(clientId: string): Promise<void> {
  if (!(await estClientLocal(clientId))) {
    throw new Error("Ce client est piloté par Notion : le modifier dans sa fiche, puis synchroniser.");
  }
}

export async function creerClientLocal(client: NouveauClient): Promise<string> {
  const maintenant = new Date();
  const [cree] = await db()
    .insert(ctoClients)
    .values({
      company: client.company,
      tier: client.tier,
      services: client.services,
      servicesOuverts: servicesOuverts(client.services, {}, maintenant),
    })
    .returning({ id: ctoClients.id });

  await db().insert(ctoPersons).values({
    clientId: cree.id,
    email: client.contact.email,
    name: client.contact.name,
    role: client.contact.role,
  });

  for (const [position, site] of client.sites.entries()) {
    await db().insert(ctoSites).values({
      clientId: cree.id,
      name: site.name,
      url: site.url,
      wpUmbrellaProjectId: site.wpUmbrellaProjectId,
      watch: site.watch,
      suiviFormule: site.suiviFormule,
      sansSuivi: site.sansSuivi,
      position,
    });
  }
  return cree.id;
}

export async function majClientLocal(
  clientId: string,
  patch: { company?: string; tier?: string; status?: "actif" | "suspendu" | "restitution" | "clos"; services?: string[] },
): Promise<void> {
  await exigerLocal(clientId);
  const [actuel] = await db()
    .select({ status: ctoClients.status, servicesOuverts: ctoClients.servicesOuverts })
    .from(ctoClients)
    .where(eq(ctoClients.id, clientId))
    .limit(1);
  if (!actuel) throw new Error("Client introuvable.");

  const valeurs: Partial<typeof ctoClients.$inferInsert> = {};
  if (patch.company !== undefined) {
    const company = patch.company.trim();
    if (!company) throw new Error("La raison sociale est obligatoire.");
    valeurs.company = company;
  }
  if (patch.tier !== undefined && CODES_PALIERS.has(patch.tier)) valeurs.tier = patch.tier;
  if (patch.status !== undefined && patch.status !== actuel.status) {
    valeurs.status = patch.status;
    valeurs.statusChangedAt = new Date();
  }
  if (patch.services !== undefined) {
    const services = lireServices(patch.services);
    valeurs.services = services;
    valeurs.servicesOuverts = servicesOuverts(services, actuel.servicesOuverts, new Date());
  }
  if (Object.keys(valeurs).length > 0) await db().update(ctoClients).set(valeurs).where(eq(ctoClients.id, clientId));
}

export async function ajouterPersonneLocale(
  clientId: string,
  personne: { name: string; email: string; role: string | null },
): Promise<void> {
  await exigerLocal(clientId);
  const email = personne.email.trim().toLowerCase();
  if (!personne.name.trim() || !EMAIL.test(email)) throw new Error("Nom et adresse e-mail valides requis.");
  const [existante] = await db()
    .select({ id: ctoPersons.id })
    .from(ctoPersons)
    .where(and(eq(ctoPersons.clientId, clientId), eq(ctoPersons.email, email)))
    .limit(1);
  if (existante) throw new Error("Cette adresse a déjà un accès chez ce client.");
  await db().insert(ctoPersons).values({ clientId, email, name: personne.name.trim(), role: personne.role?.trim() || null });
}

/** Révoque (ferme les sessions) ou rétablit l'accès d'une personne d'un client local. */
export async function basculerAccesLocal(personId: string, revoque: boolean): Promise<void> {
  const [personne] = await db()
    .select({ clientId: ctoPersons.clientId })
    .from(ctoPersons)
    .where(eq(ctoPersons.id, personId))
    .limit(1);
  if (!personne) throw new Error("Personne introuvable.");
  await exigerLocal(personne.clientId);

  await db().update(ctoPersons).set({ revokedAt: revoque ? new Date() : null }).where(eq(ctoPersons.id, personId));
  if (revoque) await revokeAllSessions(personId);
}

export async function ajouterSiteLocal(clientId: string, site: SiteSaisi): Promise<void> {
  await exigerLocal(clientId);
  const [dernier] = await db().select({ n: max(ctoSites.position) }).from(ctoSites).where(eq(ctoSites.clientId, clientId));
  await db().insert(ctoSites).values({
    clientId,
    name: site.name,
    url: site.url,
    wpUmbrellaProjectId: site.wpUmbrellaProjectId,
    watch: site.watch,
    suiviFormule: site.suiviFormule,
    sansSuivi: site.sansSuivi,
    position: (dernier?.n ?? -1) + 1,
  });
}

async function siteLocal(siteId: string): Promise<{ id: string; clientId: string }> {
  const [site] = await db()
    .select({ id: ctoSites.id, clientId: ctoSites.clientId, notionPageId: ctoSites.notionPageId })
    .from(ctoSites)
    .where(eq(ctoSites.id, siteId))
    .limit(1);
  if (!site) throw new Error("Site introuvable.");
  if (site.notionPageId !== null) throw new Error("Ce site vient de Notion : le modifier dans la base Sites.");
  return site;
}

export async function majSiteLocal(siteId: string, site: SiteSaisi): Promise<string> {
  const { clientId } = await siteLocal(siteId);
  await db()
    .update(ctoSites)
    .set({
      name: site.name,
      url: site.url,
      wpUmbrellaProjectId: site.wpUmbrellaProjectId,
      watch: site.watch,
      suiviFormule: site.suiviFormule,
      sansSuivi: site.sansSuivi,
    })
    .where(eq(ctoSites.id, siteId));
  return clientId;
}

export async function retirerSiteLocal(siteId: string): Promise<string> {
  const { clientId } = await siteLocal(siteId);
  await db().update(ctoSites).set({ removedAt: new Date() }).where(eq(ctoSites.id, siteId));
  return clientId;
}

// ─── Lecture pour l'écran d'administration ────────────────────────────────

export interface SiteAdmin extends SiteSaisi {
  id: string;
  /** `notion` : ligne de la base Sites (non modifiable ici) ; `admin` : créé depuis l'admin. */
  origine: "notion" | "admin";
}

export interface ReglageClient {
  id: string;
  company: string;
  tier: string;
  status: string;
  services: string[] | null;
  local: boolean;
  sentinelleClientId: string | null;
  sites: SiteAdmin[];
}

export async function reglageClient(clientId: string): Promise<ReglageClient | null> {
  const [client] = await db().select().from(ctoClients).where(eq(ctoClients.id, clientId)).limit(1);
  if (!client) return null;

  const sites = await db()
    .select()
    .from(ctoSites)
    .where(and(eq(ctoSites.clientId, clientId), isNull(ctoSites.removedAt)))
    .orderBy(asc(ctoSites.position), asc(ctoSites.createdAt));

  return {
    id: client.id,
    company: client.company,
    tier: client.tier,
    status: client.status,
    services: client.services,
    local: client.notionPageId === null,
    sentinelleClientId: client.sentinelleClientId,
    sites: sites.map((site) => ({
      id: site.id,
      name: site.name,
      url: site.url ?? "",
      wpUmbrellaProjectId: site.wpUmbrellaProjectId,
      watch: site.watch,
      suiviFormule: site.suiviFormule === "Essentiel" || site.suiviFormule === "Actif" ? site.suiviFormule : null,
      sansSuivi: site.sansSuivi,
      origine: site.notionPageId === null ? "admin" : "notion",
    })),
  };
}

// ─── Sentinelle ────────────────────────────────────────────────────────────

/**
 * Provisionne le client chez Sentinelle et relance l'analyse de ses sites.
 *
 * Site principal : le premier site dont la case « Veille » est cochée ; les
 * suivants sont des sites supplémentaires. Contact : la première personne dont
 * l'accès n'est pas révoqué. Réservé aux clients locaux : pour un client Notion,
 * la fiche (Site surveillé, Contact veille) fait foi et la synchro provisionne.
 */
/** Ce que le client demande à Sentinelle, d'après sa fiche : le « voeu » de provisionnement. */
async function voeuSentinelle(reglage: ReglageClient): Promise<WatchWish> {
  const voulu = (reglage.services ?? []).includes("veille-technique") && reglage.status !== "clos";

  if (!reglage.local) {
    // Client Notion : le site et le contact viennent de sa fiche, recopiés au balayage.
    const [fiche] = await db()
      .select({ site: ctoClients.watchedSite, contact: ctoClients.watchContact })
      .from(ctoClients)
      .where(eq(ctoClients.id, reglage.id))
      .limit(1);
    return { clientId: reglage.id, company: reglage.company, wanted: voulu, site: fiche?.site ?? null, contact: fiche?.contact ?? null };
  }

  const surveilles = reglage.sites.filter((site) => site.watch && !site.sansSuivi);
  const [personne] = await db()
    .select({ email: ctoPersons.email })
    .from(ctoPersons)
    .where(and(eq(ctoPersons.clientId, reglage.id), isNull(ctoPersons.revokedAt), ne(ctoPersons.email, "")))
    .orderBy(asc(ctoPersons.createdAt))
    .limit(1);
  return {
    clientId: reglage.id,
    company: reglage.company,
    wanted: voulu,
    site: surveilles[0]?.url ?? null,
    contact: personne?.email ?? null,
  };
}

export async function lancerScanSentinelle(clientId: string): Promise<{ ok: boolean; message: string }> {
  const reglage = await reglageClient(clientId);
  if (!reglage) return { ok: false, message: "Client introuvable." };
  if (!(reglage.services ?? []).includes("veille-technique")) {
    return { ok: false, message: "Le service « Veille technique » n'est pas activé pour ce client." };
  }
  if (reglage.status === "clos") return { ok: false, message: "Accompagnement clos : Sentinelle ne le suit plus." };
  return provisionOne(await voeuSentinelle(reglage), { rescan: true });
}

/**
 * Aligne Sentinelle sur le client après un changement de services, de statut ou
 * de sites : désactive sa veille si le service est retiré ou l'accompagnement
 * clos, la crée ou la met à jour sinon. Sans effet pour un client que Sentinelle
 * ne connaît pas et qui ne la demande pas. Ne lève pas : le résultat est une
 * phrase à ajouter au message de l'admin, ou `null` s'il n'y a rien à dire.
 */
export async function alignerSentinelle(clientId: string): Promise<string | null> {
  const reglage = await reglageClient(clientId);
  if (!reglage || !reglage.local) return null;
  if (!reglage.sentinelleClientId && !(reglage.services ?? []).includes("veille-technique")) return null;

  const resultat = await provisionOne(await voeuSentinelle(reglage), { rescan: false });
  return resultat.ok ? `Sentinelle : ${resultat.message}` : `Sentinelle non alignée : ${resultat.message}`;
}
