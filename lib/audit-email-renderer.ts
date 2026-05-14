import { marked } from "marked";

/**
 * Reproduit côté serveur le même rendu que le site :
 * - AuditDashboard (score, verdict, nature)
 * - MarkdownRenderer (nettoyage, tableaux comparatifs, stack recommandée)
 * Le tout en HTML inline-style compatible email.
 * Typographies : Nunito (titres) + Inter (texte) avec fallback Arial.
 */

// --- Fonts (mêmes que tailwind : googletitre = Nunito, googletexte = Inter) ---
const FONT_TITRE = "'Nunito', Arial, sans-serif";
const FONT_TEXTE = "'Inter', Arial, sans-serif";
const GOOGLE_FONTS_IMPORT = `<style>@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');</style>`;

// --- Extraction des données (même logique que audit-dashboard.tsx) ---
function extractDashboardData(md: string) {
  const scoreMatch = md.match(/Indice de modernité.*?:[^\d]*(\d+)/i);
  let score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  if (score > 10) score = 0;

  // Nouveau format : "**Voie recommandée :** ✅ B. WordPress Headless + Next.js"
  const verdictMatch = md.match(/\*\*Voie recommandée\s*:\*\*\s*✅?\s*([^\n]+)/i);
  const verdict = verdictMatch
    ? verdictMatch[1].replace(/[*\[\]✅]/g, "").trim()
    : "Non défini";

  const natureMatch = md.match(/1\.\s*\*\*Nature de l'organisation.*?:.*?\*\*(.*?)(?:\n|$)/i);
  const natureMatchBF = md.match(/1\.\s*\*\*Nature de l'organisation.*?:(.*?)(?:\n|$)/i);
  let nature = natureMatch ? natureMatch[1].trim() : (natureMatchBF ? natureMatchBF[1].trim() : "Non détecté");
  nature = nature.replace(/\*\*/g, "").trim();

  return { score, verdict, nature };
}

// --- Extraction des tableaux (même logique que parseMarkdownTable.ts) ---
function parseAllMarkdownTables(markdown: string) {
  const tableRegex = /((?:\|.*\|[\r\n]+)+)/g;
  const tables: { headers: string[]; rows: string[][]; raw: string }[] = [];
  let match;
  while ((match = tableRegex.exec(markdown)) !== null) {
    const raw = match[1];
    const lines = raw.trim().split("\n").filter((l) => l.trim().startsWith("|"));
    if (lines.length < 2) continue;
    const headers = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map((line) =>
      line.split("|").map((cell) => cell.trim()).filter(Boolean)
    );
    tables.push({ headers, rows, raw });
  }
  return tables;
}

// --- Extraction de la stack recommandée ---
// Source primaire : ligne du tableau §5 commençant par "| ✅ Nom de la stack |"
// Fallback : si le tableau est cassé, extraire depuis "**Voie recommandée :** ✅ B. <stack>"
function parseRecommendedStack(markdown: string) {
  const tableRow = markdown.match(/\|\s*✅\s*([^|]+?)\s*\|/);
  if (tableRow) {
    return { stack: tableRow[1].trim(), highlights: [] as string[] };
  }
  const verdictLine = markdown.match(/\*\*Voie recommandée\s*:\*\*\s*✅?\s*[A-E]\.\s*([^\n]+)/i);
  if (verdictLine) {
    return { stack: verdictLine[1].replace(/[*\[\]]/g, "").trim(), highlights: [] as string[] };
  }
  return null;
}

// --- Nettoyage du markdown (même logique que markdown-renderer.tsx) ---
function cleanMarkdown(content: string) {
  let clean = content;
  const identityRegex = /(\*\*Étape 1\s?:[\s\S]*?)(?=\*\*Étape 2)/i;
  if (identityRegex.test(clean)) {
    clean = clean.replace(identityRegex, "");
  }
  const step2TitleRegex = /\*\*Étape 2\s?:\s?Analyse Stratégique\s?\(Format Markdown\)\*\*/i;
  clean = clean.replace(step2TitleRegex, "");
  return clean.trim();
}

// --- Dashboard HTML (reproduit audit-dashboard.tsx) ---
function renderDashboardHtml(score: number, verdict: string) {
  let scoreColor = "#ef4444";
  let scoreBg = "#fef2f2";
  let scoreBorder = "#fecaca";
  if (score >= 5) { scoreColor = "#ca8a04"; scoreBg = "#fefce8"; scoreBorder = "#fde68a"; }
  if (score >= 8) { scoreColor = "#059669"; scoreBg = "#ecfdf5"; scoreBorder = "#a7f3d0"; }

  let verdictColor = "#1e40af";
  if (verdict.includes("Accélérer")) verdictColor = "#065f46";
  if (verdict.includes("Pivoter")) verdictColor = "#9a3412";

  return `
    <h1 style="font-family:${FONT_TITRE};font-size:22px;font-weight:700;text-align:center;color:#1e3a5f;margin-bottom:24px;">
      Audit IA — Quelle techno pour votre refonte ?
    </h1>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="50%" valign="top" style="padding-right:8px;">
          <div style="background:${scoreBg};border:2px solid ${scoreBorder};border-radius:16px;padding:24px;text-align:center;">
            <div style="font-family:${FONT_TITRE};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${scoreColor};opacity:0.8;margin-bottom:8px;">
              Indice de Modernité
            </div>
            <div style="font-family:${FONT_TITRE};font-size:48px;font-weight:700;color:${scoreColor};line-height:1;">
              ${score}<span style="font-size:18px;opacity:0.6;">/10</span>
            </div>
          </div>
        </td>
        <td width="50%" valign="top" style="padding-left:8px;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;text-align:center;">
            <div style="font-family:${FONT_TITRE};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">
              Verdict Stratégique
            </div>
            <div style="font-family:${FONT_TITRE};display:inline-block;padding:6px 16px;border-radius:20px;font-weight:700;font-size:16px;color:${verdictColor};text-transform:uppercase;">
              ${verdict}
            </div>
            <div style="font-family:${FONT_TEXTE};font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin-top:8px;">
              Recommandation IA
            </div>
          </div>
        </td>
      </tr>
    </table>
  `;
}

// --- Tableau comparatif HTML (reproduit ComparisonTable.tsx) ---
function renderComparisonTableHtml(headers: string[], rows: string[][]) {
  const thCells = headers
    .map(
      (h) =>
        `<th style="font-family:${FONT_TITRE};padding:12px 16px;background:rgba(255,255,255,0.1);color:#ffffff;font-weight:400;text-transform:uppercase;font-size:11px;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,0.2);">${h}</th>`
    )
    .join("");

  const bodyRows = rows
    .map((row, rIdx) => {
      const cells = row
        .map(
          (cell) =>
            `<td style="font-family:${FONT_TEXTE};padding:12px 16px;color:#ffffff;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.1);text-align:center;">${cell.replace(/\*+/g, "")}</td>`
        )
        .join("");
      return `<tr style="background:${rIdx % 2 === 0 ? "#1e3a5f" : "#1a3352"};">${cells}</tr>`;
    })
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;margin:24px 0;background:#1e3a5f;border-collapse:collapse;">
      <thead><tr>${thCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;
}

// --- Stack recommandée HTML (reproduit RecommendedStackCard.tsx) ---
function renderStackCardHtml(stack: string, highlights: string[]) {
  const highlightsList = highlights
    .map((h) => `<li style="margin-bottom:4px;">${h}</li>`)
    .join("");

  return `
    <div style="max-width:500px;margin:24px auto;border:1px solid #34d399;background:#ecfdf5;border-radius:12px;padding:24px;text-align:center;">
      <div style="font-family:${FONT_TITRE};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#047857;margin-bottom:8px;">
        Stack recommandée
      </div>
      <div style="font-family:${FONT_TITRE};font-size:22px;font-weight:700;color:#064e3b;margin-bottom:12px;">
        ${stack}
      </div>
      ${highlights.length > 0 ? `<ul style="font-family:${FONT_TEXTE};list-style:disc;text-align:left;padding-left:20px;color:#065f46;font-size:13px;line-height:1.6;margin-bottom:20px;">${highlightsList}</ul>` : ""}
      <div style="border-top:1px solid #a7f3d0;margin-top:16px;padding-top:16px;">
        <div style="font-family:${FONT_TITRE};font-size:14px;font-weight:700;color:#064e3b;margin-bottom:12px;">
          Discutons de cette recommandation
        </div>
        <a href="${CONTACT_URL}" style="font-family:${FONT_TITRE};display:inline-block;background:#ff6b6b;color:#1e3a5f;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;margin:0 6px 8px 6px;">
          Nous contacter
        </a>
        <a href="${SITE_URL}" style="font-family:${FONT_TITRE};display:inline-block;background:#ffffff;color:#1e3a5f;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;border:1px solid #1e3a5f;margin:0 6px 8px 6px;">
          Découvrir Next Impact
        </a>
      </div>
    </div>
  `;
}

// --- Header email (logo + liens) ---
const LOGO_URL = "https://next-impact.digital/img/logo-small.png";
const VISIO_URL = "https://calendar.app.google/Cw7TGQBzeZ1szKU86";
const SITE_URL = "https://next-impact.digital";
const CONTACT_URL = `${SITE_URL}/contact`;

function renderEmailHeader() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-bottom:2px solid #e5e7eb;padding-bottom:16px;">
      <tr>
        <td valign="middle" style="width:50%;">
          <a href="https://next-impact.digital" style="text-decoration:none;">
            <img src="${LOGO_URL}" alt="Next Impact Digital" height="40" style="height:40px;width:auto;display:block;" />
          </a>
        </td>
        <td valign="middle" style="width:50%;text-align:right;">
          <span style="font-family:${FONT_TITRE};font-size:14px;font-weight:700;color:#1e3a5f;display:block;margin-bottom:4px;">
            Next Impact Digital
          </span>
          <a href="${VISIO_URL}" style="font-family:${FONT_TEXTE};font-size:12px;color:#ff6b6b;text-decoration:none;font-weight:600;margin-right:12px;">
            Visio
          </a>
          <a href="tel:0673981638" style="font-family:${FONT_TEXTE};font-size:12px;color:#1e3a5f;text-decoration:none;">
            06 73 98 16 38
          </a>
        </td>
      </tr>
    </table>
  `;
}

// --- Point d'entrée principal ---
export function renderAuditEmailHtml(markdown: string, url: string): string {
  const { score, verdict } = extractDashboardData(markdown);
  const cleaned = cleanMarkdown(markdown);
  const allTables = parseAllMarkdownTables(cleaned);
  const stackData = parseRecommendedStack(markdown);

  // Retirer les tableaux et la stack du markdown pour éviter les doublons
  let markdownBody = cleaned;
  allTables.forEach((tbl) => {
    markdownBody = markdownBody.replace(tbl.raw, "");
  });
  if (stackData) {
    // Nouveau format : "### 5. Stack recommandée — comparatif" jusqu'à la fin ou prochain h3/---
    const stackSection = markdownBody.match(/###\s*\d+\.\s*Stack recommandée[\s\S]*?(?=\n###\s|\n---|$)/i);
    if (stackSection) {
      markdownBody = markdownBody.replace(stackSection[0], "");
    }
  }

  // Convertir le markdown restant en HTML
  const bodyHtml = marked.parse(`# ${url}\n\n${markdownBody}`) as string;

  // Assembler les tableaux comparatifs
  const tablesHtml = allTables
    .map((tbl) => renderComparisonTableHtml(tbl.headers, tbl.rows))
    .join("");

  // Stack recommandée
  const stackHtml =
    stackData && stackData.stack
      ? renderStackCardHtml(stackData.stack, stackData.highlights)
      : "";

  return `
    ${GOOGLE_FONTS_IMPORT}
    <div style="font-family:${FONT_TEXTE};max-width:700px;margin:0 auto;color:#1e3a5f;">
      ${renderEmailHeader()}
      ${renderDashboardHtml(score, verdict)}
      <div style="font-family:${FONT_TEXTE};font-size:15px;line-height:1.8;color:#1e3a5f;">
        ${bodyHtml}
      </div>
      ${tablesHtml}
      ${stackHtml}
    </div>
  `;
}
