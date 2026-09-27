import type { DiagnosticConcurrent, ScanResult, SiteSignals } from "@sentinelle/types";
import type { Fait } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Les briefs du diagnostic — tout ce que le modèle saura, et rien d'autre.
//
// Règle 3 : le modèle ne connaît rien, il reçoit tout. La collecte reçoit ce
// que la page d'accueil dit d'elle-même, pour savoir quoi chercher ; la
// rédaction reçoit en plus la stack détectée et les faits retenus par les
// garde-fous. Pur : se teste sans réseau ni API.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIANCE: Record<string, string> = {
  high: "certain",
  medium: "probable",
  low: "indice faible",
};

function liste(valeurs: string[]): string {
  return valeurs.length > 0 ? valeurs.join(" · ") : "aucun";
}

function oui(valeur: boolean): string {
  return valeur ? "oui" : "non";
}

/** Ce que la page d'accueil dit : identité et discours. */
export function renderDiscours(site: SiteSignals): string {
  return [
    `Titre de la page : ${site.title ?? "absent"}`,
    `Description (meta) : ${site.description ?? "absente"}`,
    `Nom déclaré (données structurées ou Open Graph) : ${site.siteName ?? "aucun"}`,
    `Langue : ${site.lang ?? "non déclarée"}`,
    `Titres H1 : ${liste(site.h1)}`,
    `Titres H2 : ${liste(site.h2)}`,
    `Rubriques de navigation : ${liste(site.navLabels)}`,
    `Liens vers des réseaux : ${liste(site.socialLinks)}`,
    `Types de données structurées : ${liste(site.schemaTypes)}`,
    `Début du texte visible (${site.wordCount} mots au total) :`,
    site.excerpt || "(aucun texte lisible sans exécuter de JavaScript)",
  ].join("\n");
}

/**
 * Ce qui fait vendre, repéré par vocabulaire sur la page d'accueil : indicatif,
 * le prompt le traite comme tel (« semble », jamais « n'a pas »).
 */
export function renderCommercial(site: SiteSignals): string {
  return [
    `Preuves repérées : ${liste(site.proofs)}`,
    `Appels à l'action : ${liste(site.callsToAction)}`,
    `Formulaires : ${site.formCount} · liens téléphone ou e-mail : ${site.contactLinks}`,
  ].join("\n");
}

/** Comment la page est servie : les mesures du dispositif. */
export function renderDispositif(site: SiteSignals): string {
  const ko = Math.round(site.htmlBytes / 1024);
  return [
    `Temps de réponse de la page d'accueil (jusqu'aux en-têtes) : ${
      site.responseMs === null ? "non mesuré" : `${site.responseMs} ms`
    }`,
    `Poids du HTML : ${ko} Ko`,
    `Scripts : ${site.scriptCount}, dont domaines tiers : ${liste(site.thirdPartyHosts)}`,
    `Images : ${site.imageCount}, dont sans texte alternatif : ${site.imagesWithoutAlt}`,
    `HTTPS : ${oui(site.https)}`,
    `Balise viewport (mobile) : ${oui(site.hasViewport)}`,
    `URL canonique déclarée : ${oui(site.hasCanonical)}`,
    `Balises Open Graph : ${oui(site.hasOpenGraph)}`,
    `En-têtes de sécurité : HSTS ${oui(site.securityHeaders.hsts)}, CSP ${oui(
      site.securityHeaders.csp,
    )}, X-Frame-Options ${oui(site.securityHeaders.xFrameOptions)}`,
  ].join("\n");
}

function renderStack(result: ScanResult): string {
  if (result.components.length === 0) return "Aucun composant identifiable publiquement.";
  return result.components
    .map(
      (c) =>
        `- ${c.label} (${c.type}) : ${c.version ? `version ${c.version}` : "version inconnue"}, ${
          CONFIANCE[c.confidence]
        }`,
    )
    .join("\n");
}

export function renderCollecteBrief(result: ScanResult, site: SiteSignals): string {
  return [
    `Site analysé : ${result.url}`,
    "",
    "## Ce que dit sa page d'accueil",
    renderDiscours(site),
  ].join("\n");
}

/** Une ligne de comparaison, même forme pour le site analysé et ses concurrents. */
function ligneComparee(
  nom: string,
  url: string,
  mesures: {
    plateforme: string | null;
    composants: string[];
    titre: string | null;
    h1: string | null;
    responseMs: number | null;
    htmlKo: number;
    scripts: number;
    domainesTiers: number;
    https: boolean;
    hsts: boolean;
    donneesStructurees: string[];
    preuves: string[];
    appelsAction: string[];
  },
): string {
  return [
    `### ${nom} · ${url}`,
    `Plateforme : ${mesures.plateforme ?? "non reconnue"} (${liste(mesures.composants)})`,
    `Titre : ${mesures.titre ?? "absent"}`,
    `H1 : ${mesures.h1 ?? "absent"}`,
    `Preuves repérées : ${liste(mesures.preuves)}`,
    `Appels à l'action : ${liste(mesures.appelsAction)}`,
    `Réponse : ${mesures.responseMs === null ? "non mesurée" : `${mesures.responseMs} ms`} · HTML ${
      mesures.htmlKo
    } Ko · ${mesures.scripts} scripts · ${mesures.domainesTiers} domaines tiers`,
    `HTTPS ${oui(mesures.https)} · HSTS ${oui(mesures.hsts)} · données structurées : ${liste(
      mesures.donneesStructurees,
    )}`,
  ].join("\n");
}

export function renderConcurrents(
  result: ScanResult,
  site: SiteSignals,
  concurrents: DiagnosticConcurrent[],
): string {
  if (concurrents.length === 0) {
    return "Aucun concurrent n'a pu être identifié et mesuré : la comparaison n'est pas possible.";
  }

  const soi = ligneComparee("Site analysé", result.url, {
    plateforme: result.platform,
    composants: result.components
      .filter((c) => ["cms", "ecommerce", "framework", "cms_theme", "hosting"].includes(c.type))
      .map((c) => c.label),
    titre: site.title,
    h1: site.h1[0] ?? null,
    responseMs: site.responseMs,
    htmlKo: Math.round(site.htmlBytes / 1024),
    scripts: site.scriptCount,
    domainesTiers: site.thirdPartyHosts.length,
    https: site.https,
    hsts: site.securityHeaders.hsts,
    donneesStructurees: site.schemaTypes,
    preuves: site.proofs,
    appelsAction: site.callsToAction,
  });

  return [
    "Mesures faites de la même façon pour tous (page d'accueil, analyse externe, même jour).",
    "",
    soi,
    ...concurrents.map((c) => `\n${ligneComparee(c.nom, c.url, c)}\nPourquoi concurrent : ${c.motif}`),
  ].join("\n");
}

export function renderRedactionBrief(
  result: ScanResult,
  site: SiteSignals,
  faits: Fait[],
  secteur: string | null = null,
  concurrents: DiagnosticConcurrent[] = [],
): string {
  const faitsTexte =
    faits.length === 0
      ? "Aucun fait externe retenu : la recherche n'a rien donné de vérifiable."
      : faits.map((f, i) => `${i + 1}. [${f.rubrique}] ${f.enonce} (source : ${f.source})`).join("\n");

  return [
    `Site analysé : ${result.url}`,
    `Date de l'analyse : ${result.scannedAt.slice(0, 10)}`,
    `Plateforme reconnue : ${result.platform ?? "aucune"}`,
    "",
    "## Secteur d'activité",
    secteur ?? "Non établi par une source vérifiable : à déduire prudemment de la page d'accueil.",
    "",
    "## Concurrents et leurs sites",
    renderConcurrents(result, site, concurrents),
    "",
    "## Ce que dit la page d'accueil",
    renderDiscours(site),
    "",
    "## Ce qui fait vendre (repéré sur la page d'accueil)",
    renderCommercial(site),
    "",
    "## Comment la page est servie (données techniques, à traduire en effets)",
    renderDispositif(site),
    "",
    "## Composants détectés",
    renderStack(result),
    "",
    "## Limites de l'analyse",
    result.notes.join("\n"),
    "",
    "## Faits externes vérifiés",
    faitsTexte,
  ].join("\n");
}
