import { normalizeUrl } from "@sentinelle/lettre/guards";
import { normalizeSiteUrl } from "@sentinelle/url";
import { sansTiret, selonCharte } from "./guards";
import type { DiagnosticConcurrent, ScanResult } from "@sentinelle/types";
import { MAX_CONCURRENTS, MAX_SECTEUR, type ConcurrentCollecte, type Faits } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Le secteur et les concurrents — le cœur du diagnostic.
//
// La collecte NOMME les concurrents ; elle ne les décrit pas. Leur site est
// ensuite lu par le même scanner passif que le site analysé (page d'accueil,
// liste blanche, User-Agent identifiable) : la comparaison repose sur des
// mesures faites de la même façon des deux côtés, pas sur ce qu'en dit un
// modèle. Un concurrent dont le site ne répond pas disparaît de la grille.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hôtes qui ne sont jamais le site d'un concurrent : annuaires, réseaux,
 * registres, encyclopédies. La collecte s'y appuie comme sources, mais un
 * concurrent qui « serait » linkedin.com ne compare rien.
 */
const HOTES_EXCLUS = [
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "wikipedia.org",
  "pagesjaunes.fr",
  "societe.com",
  "pappers.fr",
  "infogreffe.fr",
  "data.gouv.fr",
  "mappy.com",
  "google.com",
  "indeed.com",
  "welcometothejungle.com",
  "trustpilot.com",
];

function hote(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function estExclu(host: string): boolean {
  return HOTES_EXCLUS.some((exclu) => host === exclu || host.endsWith(`.${exclu}`));
}

/** Une source vérifiable : obtenue par la recherche, ou page du site analysé. */
export function sourceVerifiee(source: string, obtenues: Set<string>, siteUrl: string): boolean {
  if (!/^https?:\/\//i.test(source.trim())) return false;
  const siteHote = hote(siteUrl);
  return obtenues.has(normalizeUrl(source)) || (siteHote !== null && hote(source) === siteHote);
}

/** Le secteur, s'il est établi par une source vérifiable. */
export function retenirSecteur(
  secteur: Faits["secteur"],
  obtenues: Set<string>,
  siteUrl: string,
): string | null {
  const libelle = selonCharte(sansTiret(secteur.libelle));
  if (!libelle) return null;
  if (!sourceVerifiee(secteur.source, obtenues, siteUrl)) return null;
  if (libelle.length <= MAX_SECTEUR) return libelle;
  // Trop long : on garde la tête, coupée au dernier mot entier.
  const coupe = libelle.slice(0, MAX_SECTEUR);
  return coupe.slice(0, Math.max(coupe.lastIndexOf(" "), 20)).replace(/[,;:(\s]+$/, "");
}

/**
 * Les concurrents à mesurer : source vérifiée, adresse publique, ni le site
 * analysé ni un annuaire, un seul par domaine, quatre au plus.
 */
export function retenirConcurrents(
  concurrents: ConcurrentCollecte[],
  obtenues: Set<string>,
  siteUrl: string,
): Array<ConcurrentCollecte & { url: string }> {
  const siteHote = hote(siteUrl);
  const vus = new Set<string>();
  const retenus: Array<ConcurrentCollecte & { url: string }> = [];

  for (const concurrent of concurrents) {
    if (!sourceVerifiee(concurrent.source, obtenues, siteUrl)) continue;
    const url = normalizeSiteUrl(concurrent.site);
    const host = url ? hote(url) : null;
    if (!url || !host || host === siteHote || estExclu(host) || vus.has(host)) continue;
    vus.add(host);
    retenus.push({ ...concurrent, url });
    if (retenus.length >= MAX_CONCURRENTS) break;
  }

  return retenus;
}

/** Les composants qui disent de quoi le site est fait, sans le détail. */
const TYPES_STRUCTURANTS = new Set(["cms", "ecommerce", "framework", "cms_theme", "hosting"]);

/**
 * Deux sites qui servent le même titre sont la même organisation (constaté :
 * une école et sa filiale « Sales Academy », titre et H1 identiques). Le
 * premier mesuré est gardé.
 */
export function sansDoublons(concurrents: DiagnosticConcurrent[]): DiagnosticConcurrent[] {
  const titres = new Set<string>();
  return concurrents.filter((c) => {
    const titre = c.titre?.trim().toLowerCase();
    if (!titre) return true;
    if (titres.has(titre)) return false;
    titres.add(titre);
    return true;
  });
}

/** La mesure d'un concurrent, dans la forme que le rapport et le brief lisent. */
export function versConcurrent(
  concurrent: ConcurrentCollecte & { url: string },
  result: ScanResult,
): DiagnosticConcurrent {
  const site = result.site;
  return {
    nom: concurrent.nom.trim().slice(0, 200),
    url: result.url,
    motif: concurrent.motif.trim().slice(0, 400),
    plateforme: result.platform,
    composants: result.components
      .filter((c) => TYPES_STRUCTURANTS.has(c.type))
      .map((c) => c.label)
      .slice(0, 6),
    titre: site?.title ?? null,
    h1: site?.h1[0] ?? null,
    responseMs: site?.responseMs ?? null,
    htmlKo: site ? Math.round(site.htmlBytes / 1024) : 0,
    scripts: site?.scriptCount ?? 0,
    domainesTiers: site?.thirdPartyHosts.length ?? 0,
    https: site?.https ?? result.url.startsWith("https://"),
    hsts: site?.securityHeaders.hsts ?? false,
    donneesStructurees: site?.schemaTypes ?? [],
    preuves: site?.proofs ?? [],
    appelsAction: site?.callsToAction ?? [],
  };
}
