import {
  currentLetters,
  digestOfLetter,
  upsertLetter,
  withdrawLetter,
  ARCHIVE_MONTHS,
  type LetterInput,
  type LetterScope,
} from "../letters";
import { queryDatabase, publishedFilter, type NotionPage } from "./api";
import { firstParagraph, pageBody } from "./blocks";
import { editionsDatabaseId, lettersDatabaseId } from "./config";
import { PROPS } from "./map";
import * as p from "./properties";

// ─────────────────────────────────────────────────────────────────────────────
// La synchro des lettres de veille.
//
// Séparée de celle des livrables pour une raison de coût : lire une lettre, ce
// n'est pas lire une ligne de base, c'est descendre dans ses blocs, soit une
// requête par bloc porteur d'enfants. Sur une édition mensuelle de cinquante
// paragraphes, ça se compte en secondes.
//
// D'où l'ordre des opérations, qui n'est pas négociable : on lit d'abord les
// PROPRIÉTÉS de toutes les lettres, on écarte celles qui sortent de la fenêtre,
// et on ne descend dans le corps que de celles qui restent. Descendre d'abord
// coûterait le prix fort pour des archives qu'on s'apprête à retirer.
// ─────────────────────────────────────────────────────────────────────────────

export const LETTER_PROPS = {
  title: "Titre",
  period: "Période",
  scope: "Portée",
  pack: "Pack",
  organisation: "Organisation",
  chapo: "Chapô",
  published: "Publié",
} as const;

export interface LettersReport {
  /** Lettres publiées et dans la fenêtre de six mois. */
  published: number;
  created: number;
  updated: number;
  unchanged: number;
  /** Sorties de la fenêtre, ou dépubliées. */
  withdrawn: number;
  /**
   * Éditions du pipeline « Veilles clients » reprises comme lettres
   * personnalisées. `null` si le branchement n'est pas configuré.
   */
  editions: number | null;
}

function normalize(value: string | null): string | null {
  if (!value) return null;
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function scopeOf(page: NotionPage): LetterScope | null {
  const value = normalize(p.select(page, LETTER_PROPS.scope));
  if (value === "generale") return "generale";
  if (value === "sectorielle") return "sectorielle";
  if (value === "personnalisee") return "personnalisee";
  return null;
}

function windowStart(): Date {
  const debut = new Date();
  debut.setMonth(debut.getMonth() - ARCHIVE_MONTHS);
  return debut;
}

/**
 * Balaie la base Lettres.
 *
 * `clientByOrganisation` sert aux seules lettres personnalisées. La relation vise
 * l'ORGANISATION et non l'accompagnement, parce que c'est ainsi que les éditions
 * sont produites : une par organisation et par mois. Le rattachement à un espace
 * client suit tout seul, et une organisation qui n'en a pas encore verra sa
 * lettre attendre sans erreur.
 */
export async function syncLetters(
  clientByOrganisation: Map<string, string>,
  options: { dryRun: boolean },
  /** Ligne du pipeline « Veilles clients » → accompagnement (relation « Veille — organisation »). */
  clientByVeilleOrganisation: Map<string, string> = new Map(),
): Promise<{ report: LettersReport; warnings: string[] }> {
  const warnings: string[] = [];
  const report: LettersReport = {
    published: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    withdrawn: 0,
    editions: null,
  };

  const pages = await queryDatabase(
    lettersDatabaseId(),
    publishedFilter(LETTER_PROPS.published),
  );
  const etats = new Map((await currentLetters()).map((l) => [l.notionPageId, l]));
  const debut = windowStart();
  const retenues = new Set<string>();

  for (const page of pages) {
    const titre = p.text(page, LETTER_PROPS.title) ?? "(sans titre)";
    const scope = scopeOf(page);
    const periode = p.date(page, LETTER_PROPS.period);

    if (!scope) {
      warnings.push(`Lettre « ${titre} » sans portée : elle n'est distribuée à personne.`);
      continue;
    }
    if (!periode) {
      warnings.push(`Lettre « ${titre} » sans période : impossible de la classer, ignorée.`);
      continue;
    }
    // Hors fenêtre : on ne descend même pas dans son corps.
    if (periode.getTime() < debut.getTime()) continue;

    let clientId: string | null = null;

    if (scope === "personnalisee") {
      const cibles = p.relation(page, LETTER_PROPS.organisation);
      clientId = cibles.length === 1 ? (clientByOrganisation.get(cibles[0]) ?? null) : null;
      if (!clientId) {
        warnings.push(
          cibles.length === 0
            ? `Lettre personnalisée « ${titre} » sans organisation : elle n'apparaît nulle part.`
            : `Lettre personnalisée « ${titre} » : son organisation n'a pas d'accompagnement rattaché, elle attend.`,
        );
        continue;
      }
    }

    const secteur = scope === "sectorielle" ? p.select(page, LETTER_PROPS.pack) : null;
    if (scope === "sectorielle" && !secteur) {
      warnings.push(`Lettre sectorielle « ${titre} » sans pack : elle n'atteint aucun client.`);
      continue;
    }

    retenues.add(page.id);
    report.published += 1;

    const body = await pageBody(page.id);
    const chapo = p.text(page, LETTER_PROPS.chapo) ?? firstParagraph(body);

    await ecrire(
      {
        notionPageId: page.id,
        scope,
        sector: secteur,
        clientId,
        title: titre,
        period: periode,
        chapo,
        body,
      },
      etats.get(page.id),
      report,
      options.dryRun,
    );
  }

  // Les éditions du pipeline passent DANS le même balayage, et avant le
  // retrait : faites à part, elles seraient retirées ici à chaque passage,
  // puisque la base Lettres ne les contient pas.
  const editions = await syncEditions(
    clientByVeilleOrganisation,
    etats,
    retenues,
    debut,
    report,
    options,
  );
  warnings.push(...editions.warnings);

  // Retrait : dépubliée dans l'atelier, ou sortie de la fenêtre de six mois. Les
  // deux se traitent pareil — la lettre quitte l'espace, la ligne reste.
  for (const [notionPageId, etat] of etats) {
    if (etat.withdrawn || retenues.has(notionPageId)) continue;
    // Base des éditions illisible ce tour-ci : on ne sait pas si une lettre
    // personnalisée absente a été dépubliée ou simplement pas vue. Dans le
    // doute, on ne retire rien — un retrait à tort se voit chez le client, un
    // retrait différé d'un jour ne se voit pas.
    if (editions.failed && etat.scope === "personnalisee") continue;
    if (!options.dryRun) await withdrawLetter(notionPageId);
    report.withdrawn += 1;
  }

  return { report, warnings };
}

type Etat = { digest: string; withdrawn: boolean };

async function ecrire(
  input: LetterInput,
  etat: Etat | undefined,
  report: LettersReport,
  dryRun: boolean,
): Promise<void> {
  if (!etat) {
    if (!dryRun) await upsertLetter(input);
    report.created += 1;
    return;
  }
  if (!etat.withdrawn && etat.digest === digestOfLetter(input)) {
    report.unchanged += 1;
    return;
  }
  if (!dryRun) await upsertLetter(input);
  report.updated += 1;
}

/**
 * Reprend les éditions du pipeline « Veilles clients » comme lettres
 * personnalisées.
 *
 * Seules les éditions au statut **Envoyé** passent : c'est le même interrupteur
 * que le portail de veille, qui n'affiche que ce que le relecteur a transmis.
 * Brouillon et Relu restent dans l'atelier du pipeline.
 *
 * Le rattachement passe par la ligne du pipeline (« Organisation » de
 * l'édition), que la fiche Clients désigne dans « Veille — organisation ». Une
 * édition dont l'organisation n'est reliée à aucun accompagnement est ignorée
 * sans bruit : la plupart des organisations du pipeline sont des clients veille
 * seule, qui lisent leurs éditions sur le portail.
 */
async function syncEditions(
  clientByVeilleOrganisation: Map<string, string>,
  etats: Map<string, Etat>,
  retenues: Set<string>,
  debut: Date,
  report: LettersReport,
  options: { dryRun: boolean },
): Promise<{ warnings: string[]; failed: boolean }> {
  const warnings: string[] = [];
  const databaseId = editionsDatabaseId();
  if (!databaseId) return { warnings, failed: false };
  if (clientByVeilleOrganisation.size === 0) {
    report.editions = 0;
    return { warnings, failed: false };
  }

  let pages: NotionPage[];
  try {
    pages = await queryDatabase(databaseId, {
      property: PROPS.editions.status,
      select: { equals: "Envoyé" },
    });
  } catch (error) {
    warnings.push(
      `Éditions de veille illisibles (${error instanceof Error ? error.message : "erreur"}). ` +
        "La page « Veilles clients » est-elle partagée avec l'intégration ? " +
        "Aucune lettre personnalisée retirée ce tour-ci.",
    );
    return { warnings, failed: true };
  }

  let count = 0;
  for (const page of pages) {
    const clientId = p
      .relation(page, PROPS.editions.organisation)
      .map((id) => clientByVeilleOrganisation.get(id))
      .find((id): id is string => Boolean(id));
    if (!clientId) continue;

    const titre = p.text(page, PROPS.editions.title) ?? "(édition sans titre)";
    const periode = p.date(page, PROPS.editions.date);
    if (!periode) {
      warnings.push(`Édition « ${titre} » sans date d'édition : impossible de la classer, ignorée.`);
      continue;
    }
    if (periode.getTime() < debut.getTime()) continue;

    retenues.add(page.id);
    report.published += 1;
    count += 1;

    const body = await pageBody(page.id);
    await ecrire(
      {
        notionPageId: page.id,
        scope: "personnalisee",
        sector: null,
        clientId,
        title: titre,
        period: periode,
        chapo: firstParagraph(body),
        body,
      },
      etats.get(page.id),
      report,
      options.dryRun,
    );
  }

  report.editions = count;
  return { warnings, failed: false };
}
