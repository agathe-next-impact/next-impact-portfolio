/**
 * Kit email « Blueprint » — aligné sur le design system de la branche refonte-aspect.
 * Sombre (obsidian), grille en bordures 1px, libellés mono majuscules, accent indigo
 * (« vermilion »), accent secondaire périwinkle, titres Figtree / corps Inter Tight.
 *
 * Contraintes email : tout en table + styles inline, couleurs en hex (les variables CSS
 * du site ne sont pas exploitables). Les polices de marque sont importées (rendu fidèle
 * sur Apple Mail) avec repli Arial/Helvetica pour Gmail/Outlook.
 */

export const EMAIL = {
  bg: "#050505", // obsidian (fond de page)
  panel: "#0b0b0d", // panneau central
  surface: "#131318", // cartes / cellules de libellé (jet/ebony)
  border: "#242424", // dark-gray (traits de grille)
  charcoal: "#363636",
  fg: "#ffffff",
  fgSoft: "#e6e6e6",
  muted: "#9e9e9e", // mid-gray
  faint: "#6f6f6f",
  accent: "#1f08a0", // vermilion-bright — CTA
  accentDeep: "#130273", // vermilion
  accent2: "#8aa2f0", // périwinkle — kickers / liens
  title: "'Figtree','Helvetica Neue',Arial,sans-serif",
  body: "'Inter Tight','Helvetica Neue',Arial,sans-serif",
  mono: "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace",
} as const;

export const SITE_URL = "https://next-impact.digital";
export const CONTACT_URL = `${SITE_URL}/contact`;
export const VISIO_URL = "https://calendar.app.google/Cw7TGQBzeZ1szKU86";

const FONTS_IMPORT = `<style>@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600&family=Inter+Tight:wght@400;500;600&display=swap');</style>`;

// ─── Blocs de contenu ────────────────────────────────────────────────────────

export function emailKicker(index: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;"><tr>
    <td style="font-family:${EMAIL.mono};font-size:11px;letter-spacing:0.14em;color:${EMAIL.accent2};text-transform:uppercase;white-space:nowrap;padding-right:10px;">${index}</td>
    <td width="28" style="border-top:1px solid ${EMAIL.charcoal};font-size:0;line-height:0;">&nbsp;</td>
    <td style="font-family:${EMAIL.mono};font-size:11px;letter-spacing:0.14em;color:${EMAIL.muted};text-transform:uppercase;white-space:nowrap;padding-left:10px;">${label}</td>
  </tr></table>`;
}

export function emailH1(text: string): string {
  return `<h1 style="font-family:${EMAIL.title};font-weight:300;font-size:27px;line-height:1.12;letter-spacing:-0.5px;color:${EMAIL.fg};margin:0 0 14px;">${text}</h1>`;
}

export function emailH2(text: string): string {
  return `<div style="font-family:${EMAIL.mono};font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${EMAIL.accent2};margin:0 0 14px;">${text}</div>`;
}

export function emailLead(html: string): string {
  return `<p style="font-family:${EMAIL.body};font-size:16px;line-height:1.65;color:${EMAIL.muted};margin:0 0 22px;">${html}</p>`;
}

export function emailParagraph(html: string): string {
  return `<p style="font-family:${EMAIL.body};font-size:15px;line-height:1.7;color:${EMAIL.fgSoft};margin:0 0 16px;">${html}</p>`;
}

export function emailDivider(): string {
  return `<div style="height:1px;background:${EMAIL.border};margin:26px 0;font-size:0;line-height:0;">&nbsp;</div>`;
}

export function emailCard(html: string, opts?: { accent?: boolean }): string {
  const accentBorder = opts?.accent ? `border-left:2px solid ${EMAIL.accent2};` : "";
  return `<div style="background:${EMAIL.surface};border:1px solid ${EMAIL.border};${accentBorder}border-radius:3px;padding:20px 22px;margin:0 0 22px;">${html}</div>`;
}

/** Tableau clé/valeur — « spec rows » bordées du design system. */
export function emailKvTable(rows: Array<[string, string]>): string {
  const trs = rows
    .map(
      ([k, v]) => `<tr>
    <td style="font-family:${EMAIL.mono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL.muted};background:${EMAIL.surface};border:1px solid ${EMAIL.border};padding:11px 14px;vertical-align:top;width:34%;">${k}</td>
    <td style="font-family:${EMAIL.body};font-size:14px;line-height:1.55;color:${EMAIL.fg};border:1px solid ${EMAIL.border};padding:11px 14px;vertical-align:top;">${v && String(v).trim() ? v : "—"}</td>
  </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px;">${trs}</table>`;
}

/** Étapes numérotées — index en cellule bordée (accent secondaire). */
export function emailSteps(steps: Array<[string, string]>): string {
  const rows = steps
    .map(
      ([label, text], i) => `<tr>
    <td valign="top" style="width:34px;padding:0 12px 14px 0;">
      <div style="width:26px;height:26px;border:1px solid ${EMAIL.charcoal};border-radius:2px;font-family:${EMAIL.mono};font-size:12px;color:${EMAIL.accent2};text-align:center;line-height:26px;">${i + 1}</div>
    </td>
    <td valign="top" style="padding:0 0 14px;font-family:${EMAIL.body};font-size:14px;line-height:1.55;color:${EMAIL.fgSoft};">
      <strong style="color:${EMAIL.fg};font-weight:600;">${label}</strong>${text ? ` — ${text}` : ""}
    </td>
  </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">${rows}</table>`;
}

/** CTA — plein indigo (primary) ou contour (ghost), libellé mono majuscule. */
export function emailButton(
  href: string,
  label: string,
  opts?: { variant?: "primary" | "ghost" },
): string {
  const ghost = opts?.variant === "ghost";
  const bg = ghost ? "transparent" : EMAIL.accent;
  const color = ghost ? EMAIL.fgSoft : "#ffffff";
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${bg};border:1px solid ${EMAIL.charcoal};color:${color};font-family:${EMAIL.mono};font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;padding:13px 22px;border-radius:2px;">${label}</a>`;
}

export function emailButtonRow(buttons: string[]): string {
  return `<div style="margin:0 0 8px;">${buttons.map((b) => `<span style="display:inline-block;margin:0 8px 10px 0;">${b}</span>`).join("")}</div>`;
}

/** Stylise le HTML produit par marked() aux tokens Blueprint (pour le corps d'audit). */
export function styleMarkdownForEmail(html: string): string {
  return html
    .replace(
      /<h1>/g,
      `<h1 style="font-family:${EMAIL.title};font-weight:300;font-size:22px;line-height:1.2;letter-spacing:-0.3px;color:${EMAIL.fg};margin:24px 0 12px;">`,
    )
    .replace(
      /<h2>/g,
      `<h2 style="font-family:${EMAIL.title};font-weight:400;font-size:18px;line-height:1.25;color:${EMAIL.fg};margin:22px 0 10px;">`,
    )
    .replace(
      /<h3>/g,
      `<h3 style="font-family:${EMAIL.mono};font-weight:600;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL.accent2};margin:20px 0 8px;">`,
    )
    .replace(
      /<p>/g,
      `<p style="font-family:${EMAIL.body};font-size:14px;line-height:1.7;color:${EMAIL.fgSoft};margin:0 0 12px;">`,
    )
    .replace(
      /<ul>/g,
      `<ul style="font-family:${EMAIL.body};font-size:14px;line-height:1.7;color:${EMAIL.fgSoft};margin:0 0 14px;padding-left:18px;">`,
    )
    .replace(
      /<ol>/g,
      `<ol style="font-family:${EMAIL.body};font-size:14px;line-height:1.7;color:${EMAIL.fgSoft};margin:0 0 14px;padding-left:18px;">`,
    )
    .replace(/<li>/g, `<li style="margin:0 0 6px;">`)
    .replace(/<strong>/g, `<strong style="color:${EMAIL.fg};font-weight:600;">`)
    .replace(/<a /g, `<a style="color:${EMAIL.accent2};text-decoration:underline;" `)
    .replace(
      /<blockquote>/g,
      `<blockquote style="border-left:2px solid ${EMAIL.accent2};margin:0 0 14px;padding:4px 0 4px 16px;color:${EMAIL.muted};">`,
    )
    .replace(
      /<hr>/g,
      `<hr style="border:none;border-top:1px solid ${EMAIL.border};margin:22px 0;">`,
    );
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export function emailLayout(opts: {
  contentHtml: string;
  preheader?: string;
  locale?: string;
}): string {
  const { contentHtml, preheader = "", locale = "fr" } = opts;
  const isEn = locale === "en";
  const homeUrl = isEn ? `${SITE_URL}/en` : SITE_URL;

  return `<!DOCTYPE html>
<html lang="${isEn ? "en" : "fr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
${FONTS_IMPORT}
</head>
<body style="margin:0;padding:0;background:${EMAIL.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${EMAIL.bg};font-size:1px;line-height:1px;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${EMAIL.bg}" style="background:${EMAIL.bg};border-collapse:collapse;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="${EMAIL.panel}" style="width:600px;max-width:600px;background:${EMAIL.panel};border:1px solid ${EMAIL.border};border-radius:4px;border-collapse:separate;">
      <!-- En-tête : wordmark + contact -->
      <tr><td style="padding:18px 26px;border-bottom:1px solid ${EMAIL.border};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td valign="middle" style="font-family:${EMAIL.mono};font-size:13px;letter-spacing:0.12em;color:${EMAIL.fg};text-transform:uppercase;">
            <span style="display:inline-block;width:8px;height:8px;background:${EMAIL.accent2};vertical-align:middle;margin-right:9px;"></span>NEXT IMPACT
          </td>
          <td valign="middle" align="right" style="font-family:${EMAIL.mono};font-size:11px;letter-spacing:0.06em;color:${EMAIL.muted};">
            <a href="${VISIO_URL}" style="color:${EMAIL.accent2};text-decoration:none;">${isEn ? "VIDEO CALL" : "VISIO"}</a>
            <span style="color:${EMAIL.faint};">&nbsp;·&nbsp;</span>
            <a href="tel:+33673981638" style="color:${EMAIL.muted};text-decoration:none;">06 73 98 16 38</a>
          </td>
        </tr></table>
      </td></tr>
      <!-- Trait d'accent -->
      <tr><td style="font-size:0;line-height:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td width="64" style="height:2px;background:${EMAIL.accent};font-size:0;line-height:0;">&nbsp;</td>
          <td style="height:2px;background:${EMAIL.panel};font-size:0;line-height:0;">&nbsp;</td>
        </tr></table>
      </td></tr>
      <!-- Contenu -->
      <tr><td style="padding:34px 26px 30px;">${contentHtml}</td></tr>
      <!-- Pied -->
      <tr><td style="padding:22px 26px;border-top:1px solid ${EMAIL.border};">
        <div style="font-family:${EMAIL.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${EMAIL.fgSoft};margin:0 0 6px;">Next Impact Digital</div>
        <div style="font-family:${EMAIL.body};font-size:12px;line-height:1.6;color:${EMAIL.muted};">
          <a href="mailto:agathe@next-impact.digital" style="color:${EMAIL.accent2};text-decoration:none;">agathe@next-impact.digital</a>
          &nbsp;·&nbsp;
          <a href="tel:+33673981638" style="color:${EMAIL.muted};text-decoration:none;">06 73 98 16 38</a>
        </div>
        <div style="font-family:${EMAIL.mono};font-size:10px;letter-spacing:0.08em;margin-top:8px;">
          <a href="${homeUrl}" style="color:${EMAIL.faint};text-decoration:none;">NEXT-IMPACT.DIGITAL</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
