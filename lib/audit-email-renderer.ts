import { marked } from "marked";
import {
  EMAIL,
  CONTACT_URL,
  SITE_URL,
  emailButton,
  emailButtonRow,
  emailH1,
  emailKicker,
  styleMarkdownForEmail,
} from "@/lib/email-template";

/**
 * Reproduit côté serveur le rendu de l'audit (score, verdict, tableaux comparatifs,
 * stack recommandée) au design system « Blueprint » : sombre, grille en bordures,
 * libellés mono, accent indigo. Renvoie un bloc de contenu destiné à être enveloppé
 * par `emailLayout` (en-tête / pied partagés).
 */

// --- Extraction des données (même logique que audit-dashboard.tsx) ---
function extractDashboardData(md: string) {
  const scoreMatch = md.match(/Indice de modernité.*?:[^\d]*(\d+)/i);
  let score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  if (score > 10) score = 0;

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

// --- Dashboard : score + verdict en cartes bordées sombres ---
function renderDashboardHtml(score: number, verdict: string) {
  let scoreColor = "#f87171"; // rouge
  if (score >= 5) scoreColor = "#fbbf24"; // ambre
  if (score >= 8) scoreColor = "#4ade80"; // vert

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:separate;">
      <tr>
        <td width="50%" valign="top" style="padding-right:7px;">
          <div style="background:${EMAIL.surface};border:1px solid ${EMAIL.border};border-radius:3px;padding:22px;text-align:center;">
            <div style="font-family:${EMAIL.mono};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:${EMAIL.muted};margin-bottom:10px;">
              Indice de modernité
            </div>
            <div style="font-family:${EMAIL.title};font-size:48px;font-weight:300;color:${scoreColor};line-height:1;">
              ${score}<span style="font-size:18px;color:${EMAIL.faint};">/10</span>
            </div>
          </div>
        </td>
        <td width="50%" valign="top" style="padding-left:7px;">
          <div style="background:${EMAIL.surface};border:1px solid ${EMAIL.border};border-radius:3px;padding:22px;text-align:center;">
            <div style="font-family:${EMAIL.mono};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:${EMAIL.muted};margin-bottom:10px;">
              Verdict stratégique
            </div>
            <div style="font-family:${EMAIL.mono};display:inline-block;padding:7px 14px;border:1px solid ${EMAIL.accent2};border-radius:2px;font-weight:600;font-size:13px;color:${EMAIL.fg};text-transform:uppercase;letter-spacing:0.06em;">
              ${verdict}
            </div>
            <div style="font-family:${EMAIL.mono};font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:${EMAIL.faint};margin-top:10px;">
              Recommandation IA
            </div>
          </div>
        </td>
      </tr>
    </table>
  `;
}

// --- Tableau comparatif : grille sombre en bordures ---
function renderComparisonTableHtml(headers: string[], rows: string[][]) {
  const thCells = headers
    .map(
      (h) =>
        `<th style="font-family:${EMAIL.mono};padding:11px 14px;background:${EMAIL.surface};color:${EMAIL.muted};font-weight:600;text-transform:uppercase;font-size:10px;letter-spacing:0.08em;border:1px solid ${EMAIL.border};text-align:left;">${h}</th>`,
    )
    .join("");

  const bodyRows = rows
    .map((row) => {
      const cells = row
        .map(
          (cell, cIdx) =>
            `<td style="font-family:${EMAIL.body};padding:11px 14px;color:${cIdx === 0 ? EMAIL.fg : EMAIL.fgSoft};font-size:13px;border:1px solid ${EMAIL.border};text-align:left;">${cell.replace(/\*+/g, "")}</td>`,
        )
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:${EMAIL.panel};border-collapse:collapse;">
      <thead><tr>${thCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;
}

// --- Carte stack recommandée + CTA ---
function renderStackCardHtml(stack: string, highlights: string[]) {
  const highlightsList = highlights
    .map(
      (h) =>
        `<li style="font-family:${EMAIL.body};font-size:13px;line-height:1.6;color:${EMAIL.muted};margin-bottom:6px;">${h}</li>`,
    )
    .join("");

  return `
    <div style="border:1px solid ${EMAIL.border};border-left:2px solid ${EMAIL.accent2};background:${EMAIL.surface};border-radius:3px;padding:24px;margin:24px 0;text-align:center;">
      <div style="font-family:${EMAIL.mono};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:${EMAIL.accent2};margin-bottom:10px;">
        Stack recommandée
      </div>
      <div style="font-family:${EMAIL.title};font-size:22px;font-weight:400;color:${EMAIL.fg};margin-bottom:${highlights.length ? "16px" : "20px"};">
        ${stack}
      </div>
      ${highlights.length > 0 ? `<ul style="list-style:disc;text-align:left;padding-left:20px;margin:0 0 20px;">${highlightsList}</ul>` : ""}
      <div style="border-top:1px solid ${EMAIL.border};margin-top:4px;padding-top:18px;">
        <div style="font-family:${EMAIL.body};font-size:14px;color:${EMAIL.fgSoft};margin-bottom:14px;">
          Discutons de cette recommandation
        </div>
        ${emailButtonRow([
          emailButton(CONTACT_URL, "Nous contacter"),
          emailButton(SITE_URL, "Découvrir Next Impact", { variant: "ghost" }),
        ])}
      </div>
    </div>
  `;
}

// --- Point d'entrée principal — renvoie un bloc de contenu (sans en-tête/pied) ---
export function renderAuditEmailHtml(markdown: string, url: string): string {
  const { score, verdict } = extractDashboardData(markdown);
  const cleaned = cleanMarkdown(markdown);
  const allTables = parseAllMarkdownTables(cleaned);
  const stackData = parseRecommendedStack(markdown);

  let markdownBody = cleaned;
  allTables.forEach((tbl) => {
    markdownBody = markdownBody.replace(tbl.raw, "");
  });
  if (stackData) {
    const stackSection = markdownBody.match(/###\s*\d+\.\s*Stack recommandée[\s\S]*?(?=\n###\s|\n---|$)/i);
    if (stackSection) {
      markdownBody = markdownBody.replace(stackSection[0], "");
    }
  }

  const bodyHtml = styleMarkdownForEmail(marked.parse(markdownBody) as string);

  const tablesHtml = allTables
    .map((tbl) => renderComparisonTableHtml(tbl.headers, tbl.rows))
    .join("");

  const stackHtml =
    stackData && stackData.stack
      ? renderStackCardHtml(stackData.stack, stackData.highlights)
      : "";

  return `
    ${emailKicker("№ AUDIT", "Diagnostic IA")}
    ${emailH1("Quelle techno pour votre refonte ?")}
    <p style="font-family:${EMAIL.body};font-size:13px;line-height:1.6;color:${EMAIL.muted};margin:0 0 24px;word-break:break-all;">
      <a href="${url}" style="color:${EMAIL.accent2};text-decoration:none;">${url}</a>
    </p>
    ${renderDashboardHtml(score, verdict)}
    <div>${bodyHtml}</div>
    ${tablesHtml}
    ${stackHtml}
  `;
}
