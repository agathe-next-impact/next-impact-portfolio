import type { NewsletterBlocks } from "@sentinelle/newsletter/blocks";
import type { Dossier, Lettre } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Ce que les deux passes reçoivent — et ce qu'elles ne reçoivent jamais.
//
// **Ni nom, ni adresse e-mail, ni raison sociale.** Le modèle n'en a pas besoin
// pour écrire, Anthropic est sous-traitant (plan §9), et une minimisation
// gratuite est une minimisation qu'on fait. L'adresse du site y est, elle : sans
// elle, il n'y a rien à observer.
//
// Le rendu est volontairement pauvre et plat. Ce qui n'y figure pas ne peut pas
// être écrit — c'est cette pauvreté qui rend les garde-fous applicables.
// ─────────────────────────────────────────────────────────────────────────────

export interface LettreContext {
  /** Période du numéro, en toutes lettres — « juillet-août 2026 ». */
  periodLabel: string;
  /** Adresse du site à observer. */
  siteUrl: string;
  sector: string | null;
  notes: string | null;
  blocks: NewsletterBlocks;
  /** Résumé du numéro précédent, pour la continuité. Vide au premier numéro. */
  previousIssue: PreviousIssue | null;
}

export interface PreviousIssue {
  periodLabel: string;
  /** Les actions annoncées la fois précédente, avec leur statut si connu. */
  actions: string[];
  /** Les échéances annoncées, pour ne pas les réannoncer à l'identique. */
  echeances: string[];
}

function line(label: string, value: string | null): string {
  return `${label} : ${value && value.trim() !== "" ? value : "non renseigné"}`;
}

/** Composant tel qu'il apparaît au modèle : nom, version, et rien d'implicite. */
function componentLines(blocks: NewsletterBlocks): string[] {
  if (blocks.health.components.length === 0) return ["- aucun composant suivi"];

  return blocks.health.components.map((component) => {
    const version = component.version ? component.version : "version inconnue";
    const alertes =
      component.openAlerts > 0 ? ` — ${component.openAlerts} alerte(s) sur la période` : "";
    return `- ${component.label} (${version})${alertes}`;
  });
}

/**
 * Le constaté, rendu en texte.
 *
 * C'est la base des deux passes : la collecte s'en sert pour savoir quoi
 * chercher et quoi ne pas recollecter, la rédaction pour savoir ce qu'elle a le
 * droit d'affirmer du site.
 */
export function renderConstate(context: LettreContext): string {
  const { blocks } = context;

  const alertes = blocks.delta.alerts.map(
    (alert) => `- [${alert.verdict ?? "info"}] ${alert.title} (envoyée le ${alert.at.slice(0, 10)})`,
  );

  const nouveaux = blocks.delta.newComponents.map(
    (component) => `- ${component.label}${component.version ? ` ${component.version}` : ""}`,
  );

  const radar = blocks.radar.map(
    (entry) =>
      `- ${entry.label}${entry.version ? ` ${entry.version}` : ""} : ${entry.title}, fin de support le ${entry.endsOn} (dans ${entry.daysLeft} jours)`,
  );

  const sections = [
    "# Période",
    `Numéro de ${context.periodLabel}, daté du ${blocks.issueDate.slice(0, 10)}.`,
    "",
    "# Le site à observer",
    context.siteUrl,
    "",
    "# Contexte du client",
    line("Secteur et taille", context.sector),
    line("Ce qu'il faut savoir du site", context.notes),
    "",
    "# Fiche technique établie (acquise — ne pas recollecter, ne pas contredire)",
    ...componentLines(blocks),
    blocks.health.withoutVersion > 0
      ? `(${blocks.health.withoutVersion} composant(s) suivis dont la version reste inconnue)`
      : "",
    "",
    blocks.delta.since
      ? `# Alertes envoyées depuis le numéro du ${blocks.delta.since.slice(0, 10)}`
      : "# Premier numéro : aucune alerte ne lui a encore été envoyée",
    ...(alertes.length > 0 ? alertes : ["- aucune alerte envoyée sur la période"]),
    "",
    "# Composants apparus sur la période",
    ...(nouveaux.length > 0 ? nouveaux : ["- aucun"]),
    "",
    "# Fins de support à venir dans les six mois (déjà vérifiées contre sa version)",
    ...(radar.length > 0 ? radar : ["- aucune"]),
  ];

  if (context.previousIssue) {
    sections.push(
      "",
      `# Numéro précédent (${context.previousIssue.periodLabel})`,
      "Actions annoncées :",
      ...(context.previousIssue.actions.length > 0
        ? context.previousIssue.actions.map((action) => `- ${action}`)
        : ["- aucune"]),
      "Échéances annoncées :",
      ...(context.previousIssue.echeances.length > 0
        ? context.previousIssue.echeances.map((echeance) => `- ${echeance}`)
        : ["- aucune"]),
    );
  }

  return sections.filter((section) => section !== "").join("\n");
}

/** Consigne de la passe de collecte. */
export function renderCollecteBrief(context: LettreContext): string {
  return [
    renderConstate(context),
    "",
    "# Ta mission",
    "Rassemble le dossier de ce numéro : l'actualité de la période sur les cinq champs,",
    "puis l'observation du site sur ce que la fiche ne couvre pas. Ne rédige pas la lettre.",
  ].join("\n");
}

/** Consigne de la passe de rédaction. */
export function renderRedactionBrief(context: LettreContext, dossier: Dossier): string {
  const faits = dossier.faits.map((fait, index) =>
    [
      `## Fait ${index + 1} — ${fait.famille || "sans famille"}`,
      fait.enonce,
      `Date : ${fait.date || "non datée"}`,
      `Source : ${fait.source}`,
      fait.chiffre ? `Chiffre : ${fait.chiffre} (périmètre : ${fait.perimetre || "non précisé"})` : "",
      fait.echeance ? `Échéance : ${fait.echeance}` : "",
      fait.toucheFiche.length > 0 ? `Touche la fiche : ${fait.toucheFiche.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const observations = dossier.observations.map(
    (observation) =>
      `- [${observation.statut}] ${observation.sujet} : ${observation.constat}${observation.page ? ` (${observation.page})` : ""}`,
  );

  const publics = dossier.publics.map(
    (public_) =>
      `- ${public_.nom} — vient chercher : ${public_.cherche} ; le site doit obtenir : ${public_.attenduDuSite} ; niveau de réponse actuel : ${public_.niveauDeReponse}`,
  );

  const aConfirmer = dossier.aConfirmer.map(
    (entry) => `- ${entry.point} (à vérifier : ${entry.sourceAVerifier})`,
  );

  return [
    renderConstate(context),
    "",
    "# Dossier de la période — les faits, datés et sourcés",
    ...(faits.length > 0 ? faits : ["Aucun fait collecté sur cette période."]),
    "",
    "# Observations du site",
    ...(observations.length > 0 ? observations : ["- aucune observation"]),
    "",
    "# Publics reconstitués",
    ...(publics.length > 0 ? publics : ["- aucun public reconstitué"]),
    "",
    "# À confirmer — ne pas affirmer dans la lettre",
    ...(aConfirmer.length > 0 ? aConfirmer : ["- rien"]),
    dossier.siteInjoignable.trim() !== ""
      ? `\n# Le site n'a pas pu être analysé\n${dossier.siteInjoignable}\nDis-le en tête de lettre et n'affirme rien de son état actuel.`
      : "",
    "",
    "# Ta mission",
    "Écris la lettre : les cinq axes, les tendances qualifiées pour ce site, la synthèse.",
    "Tout ce que tu affirmes vient de ce qui précède.",
  ]
    .filter((section) => section !== "")
    .join("\n");
}

/** Ce que le numéro précédent lègue au suivant. */
export function previousIssueFrom(lettre: Lettre, periodLabel: string): PreviousIssue {
  return {
    periodLabel,
    actions: lettre.synthese.actions.map((action) => `${action.action} (${action.horizon})`),
    echeances: lettre.echeancier.map((entry) => `${entry.date} — ${entry.echeance}`),
  };
}
