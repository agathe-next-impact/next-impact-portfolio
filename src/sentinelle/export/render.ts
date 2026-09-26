import type { Lettre } from "@sentinelle/lettre/schema";
import type { ExportBlock, ExportSpan } from "./contract";

// ─────────────────────────────────────────────────────────────────────────────
// Une lettre de veille, mise à plat en blocs neutres.
//
// Même ordre que l'e-mail (`emails/NewsletterEmail.tsx`) : l'espace client doit
// montrer la lettre que le client a reçue, pas une autre composition du même
// contenu. Ce qui n'a pas de sens hors de l'e-mail (l'encart d'échantillon, les
// notes de production) ne sort pas.
//
// Pur : aucun accès à la base, testable sur une lettre de fixture.
// ─────────────────────────────────────────────────────────────────────────────

const STATUT_AXE: Record<Lettre["axes"][number]["statut"], string> = {
  agir: "À traiter",
  surveiller: "À surveiller",
  nonConcerne: "Non concerné",
};

function t(text: string, style: Omit<ExportSpan, "t"> = {}): ExportSpan {
  return { t: text, ...style };
}

function paragraphs(text: string): ExportBlock[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => ({ k: "p", s: [t(part)] }));
}

function h2(text: string): ExportBlock {
  return { k: "h2", s: [t(text)] };
}

function h3(text: string): ExportBlock {
  return { k: "h3", s: [t(text)] };
}

function li(...spans: ExportSpan[]): ExportBlock {
  return { k: "li", s: spans };
}

export function renderLettre(lettre: Lettre): ExportBlock[] {
  const out: ExportBlock[] = [];

  if (lettre.ligneContexte.trim()) out.push({ k: "p", s: [t(lettre.ligneContexte, { i: true })] });
  out.push(...paragraphs(lettre.chapeau));

  if (lettre.siteEnUnePhrase.trim()) {
    out.push(h2("Votre site en une phrase"));
    out.push({ k: "callout", s: [t(lettre.siteEnUnePhrase)] });
  }

  if (lettre.axes.length > 0) {
    out.push(h2("Les douze axes"));
    for (const axe of lettre.axes) {
      out.push(h3(`${axe.numero}. ${axe.nom}`));
      if (axe.question.trim()) out.push({ k: "p", s: [t(axe.question, { i: true })] });
      out.push(...paragraphs(axe.analyse));
      out.push({
        k: "p",
        s: [t(STATUT_AXE[axe.statut], { b: true }), ...(axe.horizon ? [t(` · ${axe.horizon}`)] : [])],
      });
    }
  }

  const { tendances } = lettre;
  if (tendances.duMois.length > 0) {
    out.push(h2("Les tendances du mois"));
    for (const item of tendances.duMois) {
      out.push(li(t(item.tendance, { b: true }), t(` (${item.faitDate}) `), t(item.pourCeSite)));
    }
  }
  if (tendances.marche.length > 0) {
    out.push(h2("Le marché des solutions"));
    for (const item of tendances.marche) {
      out.push(li(t(item.famille, { b: true }), t(` · ${item.mouvement}. ${item.lecture}`)));
    }
  }
  if (tendances.signauxDeDemande.length > 0) {
    out.push(h3("Signaux de demande"));
    for (const signal of tendances.signauxDeDemande) out.push(li(t(signal)));
  }
  if (tendances.deFond.length > 0) {
    out.push(h2("Les tendances de fond"));
    for (const item of tendances.deFond) {
      out.push(li(t(item.mouvement, { b: true }), t(` (${item.faitDate}) ${item.qualification}`)));
    }
  }
  if (tendances.ceQuiNeChangePas.length > 0) {
    out.push(h3("Ce qui ne change pas"));
    for (const item of tendances.ceQuiNeChangePas) out.push(li(t(item)));
  }

  const { synthese } = lettre;
  out.push(h2("Ce qui compte ce mois-ci"));
  for (const action of synthese.actions) {
    out.push(li(t(action.action, { b: true }), t(` · ${action.horizon}. ${action.pourquoi}`)));
  }
  if (synthese.reste.trim()) out.push(...paragraphs(synthese.reste));

  if (synthese.scenarios.length > 0) {
    out.push(h3("Scénarios"));
    for (const scenario of synthese.scenarios) {
      out.push({ k: "p", s: [t(scenario.nom, { b: true })] });
      out.push(li(t(`Commandé par : ${scenario.commandePar}`)));
      out.push(li(t(`Faits de marché : ${scenario.faitsDeMarche}`)));
      out.push(li(t(`Axes couverts : ${scenario.axesCouverts}`)));
      out.push(li(t(`Ordre de coût : ${scenario.ordreDeCout}`)));
      out.push(li(t(`Retour attendu : ${scenario.retourAttendu}`)));
      out.push(li(t(`Déclencheur : ${scenario.conditionDeDeclenchement}`)));
    }
  }
  if (synthese.aDifferer.length > 0) {
    out.push(h3("À différer"));
    for (const choix of synthese.aDifferer) out.push(li(t(choix.choix, { b: true }), t(` · ${choix.raison}`)));
  }

  out.push(h3("Budget"));
  out.push(...paragraphs(synthese.budget.coutTroisACinqAns));
  for (const indicateur of synthese.budget.indicateurs) out.push(li(t(indicateur)));
  out.push(...paragraphs(synthese.budget.pointDEquilibre));
  out.push(...paragraphs(synthese.budget.siPasDeChiffres));

  if (synthese.commentDecider.length > 0) {
    out.push(h3("Comment décider"));
    for (const entree of synthese.commentDecider) {
      out.push(li(t(entree.entree, { b: true }), t(` · ${entree.ceQuElleTeste} (${entree.date})`)));
    }
  }

  if (lettre.echeancier.length > 0) {
    out.push(h2("Échéancier à six mois"));
    for (const entree of lettre.echeancier) {
      out.push(li(t(entree.date, { b: true }), t(` · ${entree.echeance} (axe ${entree.axe})`)));
    }
  }

  if (lettre.questions.length > 0) {
    out.push(h2("Questions à poser à votre prestataire"));
    for (const question of lettre.questions) out.push(li(t(question.question)));
  }

  if (lettre.sources.length > 0) {
    out.push({ k: "hr" });
    out.push(h2("Sources"));
    for (const groupe of lettre.sources) {
      out.push(h3(groupe.theme));
      for (const fait of groupe.faits) {
        const source = /^https?:\/\//.test(fait.source)
          ? t(fait.source, { h: fait.source })
          : t(fait.source);
        out.push(li(t(`${fait.enonce} (${fait.date}) · `), source));
      }
    }
  }

  if (lettre.ligneCloture.trim()) {
    out.push({ k: "hr" });
    out.push({ k: "p", s: [t(lettre.ligneCloture, { i: true })] });
  }

  // Un titre sans rien dessous ne dit rien : on retire les sections vides que
  // des champs facultatifs auraient laissées.
  return out.filter((block, index) => {
    if (block.k !== "h2" && block.k !== "h3") return true;
    const next = out[index + 1];
    return next !== undefined && next.k !== "h2" && !(block.k === "h3" && next.k === "h3");
  });
}
