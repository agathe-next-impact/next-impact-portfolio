// Vue imprimable de la checklist GEO — document HTML autonome généré côté
// client et imprimé via un iframe caché (window.print → « Enregistrer en
// PDF »). Choix délibéré : zéro dépendance dans le bundle client (jspdf reste
// côté serveur pour le cahier des charges), mise en page propre garantie par
// @page/@media print.

// Import relatif (et non l'alias @/) pour rester compilable en node pur par
// scripts/test-checklist-geo.ts.
import { ITEMS, SECTIONS, type SectionId } from "./checklist-geo";

const SITE = "https://next-impact.digital";

/** Construit le document HTML imprimable, cases cochées incluses. */
export function buildChecklistPrintHtml(
  locale: "fr" | "en",
  checkedIds: readonly string[],
): string {
  const isEn = locale === "en";
  const checked = new Set(checkedIds);
  const prefix = isEn ? "/en" : "";

  const title = isEn
    ? "GEO checklist — getting cited by AI engines"
    : "Checklist GEO — être cité par les moteurs IA";
  const intro = isEn
    ? "24 concrete actions across the 4 GEO priorities for an SMB: AI crawler access, answer pages, structure and markup, external authority."
    : "24 actions concrètes sur les 4 chantiers GEO d'une PME : accès des robots IA, pages-réponses, structure et balisage, autorité externe.";
  const levelLabel = (level: "interne" | "prestataire") =>
    level === "interne" ? (isEn ? "In-house" : "Interne") : isEn ? "Provider" : "Prestataire";

  const dateStr = new Date().toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sectionsHtml = SECTIONS.map((section) => {
    const items = ITEMS.filter((i) => i.section === section.id as SectionId);
    const rows = items
      .map((item) => {
        const isChecked = checked.has(item.id);
        return `
        <li class="item${isChecked ? " done" : ""}">
          <span class="box" aria-hidden="true">${isChecked ? "&#10003;" : ""}</span>
          <span class="body">
            <span class="action">${isEn ? item.actionEn : item.actionFr}
              <span class="level">${levelLabel(item.level)}</span></span>
            <span class="why">${isEn ? item.whyEn : item.whyFr}</span>
          </span>
        </li>`;
      })
      .join("");
    return `
      <section>
        <h2><span class="num">${section.order}.</span> ${isEn ? section.titleEn : section.titleFr}</h2>
        <p class="subtitle">${isEn ? section.subtitleEn : section.subtitleFr}</p>
        <ul>${rows}</ul>
      </section>`;
  }).join("");

  const footer = isEn
    ? `<p><strong>Next steps</strong> — Free AI visibility diagnostic: ${SITE}${prefix}/outils/visibilite-ia &middot; Guide: ${SITE}${prefix}/documentation/etre-trouve &middot; Prioritize on a call (&euro;150): ${SITE}${prefix}/conseil</p>
       <p class="meta">${title} &middot; Next Impact Digital &middot; ${dateStr}</p>`
    : `<p><strong>Étapes suivantes</strong> — Diagnostic visibilité IA gratuit : ${SITE}/outils/visibilite-ia &middot; Guide : ${SITE}/documentation/etre-trouve &middot; Prioriser en visio (150 &euro;) : ${SITE}/conseil</p>
       <p class="meta">${title} &middot; Next Impact Digital &middot; ${dateStr}</p>`;

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: Georgia, "Times New Roman", serif;
    color: #1a1a1a; background: #fff;
    font-size: 10.5pt; line-height: 1.45;
  }
  header { border-bottom: 2px solid #1a1a1a; padding-bottom: 10px; margin-bottom: 14px; }
  .brand { font-family: "Courier New", monospace; font-size: 8pt; letter-spacing: 0.18em; text-transform: uppercase; color: #555; margin: 0 0 6px; }
  h1 { font-size: 17pt; margin: 0 0 6px; line-height: 1.2; }
  .intro { margin: 0; color: #444; font-size: 10pt; }
  section { margin-bottom: 12px; break-inside: avoid-page; }
  h2 { font-size: 12.5pt; margin: 14px 0 2px; border-bottom: 1px solid #bbb; padding-bottom: 3px; }
  h2 .num { color: #c33d1a; }
  .subtitle { margin: 2px 0 6px; color: #555; font-size: 9.5pt; font-style: italic; }
  ul { list-style: none; margin: 0; padding: 0; }
  .item { display: flex; gap: 8px; padding: 4px 0; break-inside: avoid; }
  .box {
    flex: 0 0 auto; width: 11pt; height: 11pt; margin-top: 2pt;
    border: 1.2pt solid #1a1a1a; text-align: center;
    font-size: 9pt; line-height: 11pt; font-family: Arial, sans-serif;
  }
  .done .box { background: #1a1a1a; color: #fff; }
  .body { display: block; }
  .action { display: block; font-weight: bold; font-size: 10pt; }
  .level {
    font-family: "Courier New", monospace; font-weight: normal;
    font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;
    border: 0.8pt solid #888; color: #555; padding: 0 4px; margin-left: 6px;
    white-space: nowrap;
  }
  .why { display: block; color: #555; font-size: 9pt; }
  footer { margin-top: 16px; border-top: 2px solid #1a1a1a; padding-top: 8px; font-size: 9pt; color: #333; }
  footer .meta { color: #777; font-size: 8pt; }
</style>
</head>
<body>
  <header>
    <p class="brand">Next Impact Digital &middot; next-impact.digital</p>
    <h1>${title}</h1>
    <p class="intro">${intro}</p>
  </header>
  ${sectionsHtml}
  <footer>${footer}</footer>
</body>
</html>`;
}
