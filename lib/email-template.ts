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
  scheme: "dark",
} as const;

export type EmailPalette = { [K in keyof typeof EMAIL]: string };

/**
 * Variante claire, fond blanc — pour les e-mails adressés aux clients de
 * l'espace client (`src/cto/`) : un e-mail sombre détonne dans une boîte
 * professionnelle et s'imprime mal. Mêmes rôles que `EMAIL`, périwinkle
 * foncé pour rester lisible sur blanc.
 */
export const EMAIL_LIGHT: EmailPalette = {
  bg: "#ffffff",
  panel: "#ffffff",
  surface: "#f5f5f8",
  border: "#e3e3e8",
  charcoal: "#c9c9d1",
  fg: "#111114",
  fgSoft: "#2b2b31",
  muted: "#5f5f69",
  faint: "#8a8a94",
  accent: EMAIL.accent,
  accentDeep: EMAIL.accentDeep,
  accent2: "#3446b8",
  title: EMAIL.title,
  body: EMAIL.body,
  mono: EMAIL.mono,
  scheme: "light",
};

export const SITE_URL = "https://next-impact.digital";
export const CONTACT_URL = `${SITE_URL}/contact`;
export const VISIO_URL = "https://calendar.app.google/Cw7TGQBzeZ1szKU86";

const FONTS_IMPORT = `<style>@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600&family=Inter+Tight:wght@400;500;600&display=swap');</style>`;

// ─── Kit ─────────────────────────────────────────────────────────────────────

/** Construit les blocs et le layout pour une palette donnée. */
export function createEmailKit(P: EmailPalette) {
  // ─── Blocs de contenu ────────────────────────────────────────────────────────

  function emailKicker(index: string, label: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;"><tr>
      <td style="font-family:${P.mono};font-size:11px;letter-spacing:0.14em;color:${P.accent2};text-transform:uppercase;white-space:nowrap;padding-right:10px;">${index}</td>
      <td width="28" style="border-top:1px solid ${P.charcoal};font-size:0;line-height:0;">&nbsp;</td>
      <td style="font-family:${P.mono};font-size:11px;letter-spacing:0.14em;color:${P.muted};text-transform:uppercase;white-space:nowrap;padding-left:10px;">${label}</td>
    </tr></table>`;
  }

  function emailH1(text: string): string {
    return `<h1 style="font-family:${P.title};font-weight:300;font-size:27px;line-height:1.12;letter-spacing:-0.5px;color:${P.fg};margin:0 0 14px;">${text}</h1>`;
  }

  function emailH2(text: string): string {
    return `<div style="font-family:${P.mono};font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${P.accent2};margin:0 0 14px;">${text}</div>`;
  }

  function emailLead(html: string): string {
    return `<p style="font-family:${P.body};font-size:16px;line-height:1.65;color:${P.muted};margin:0 0 22px;">${html}</p>`;
  }

  function emailParagraph(html: string): string {
    return `<p style="font-family:${P.body};font-size:15px;line-height:1.7;color:${P.fgSoft};margin:0 0 16px;">${html}</p>`;
  }

  function emailDivider(): string {
    return `<div style="height:1px;background:${P.border};margin:26px 0;font-size:0;line-height:0;">&nbsp;</div>`;
  }

  function emailCard(html: string, opts?: { accent?: boolean }): string {
    const accentBorder = opts?.accent ? `border-left:2px solid ${P.accent2};` : "";
    return `<div style="background:${P.surface};border:1px solid ${P.border};${accentBorder}border-radius:3px;padding:20px 22px;margin:0 0 22px;">${html}</div>`;
  }

  /** Tableau clé/valeur — « spec rows » bordées du design system. */
  function emailKvTable(rows: Array<[string, string]>): string {
    const trs = rows
      .map(
        ([k, v]) => `<tr>
      <td style="font-family:${P.mono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${P.muted};background:${P.surface};border:1px solid ${P.border};padding:11px 14px;vertical-align:top;width:34%;">${k}</td>
      <td style="font-family:${P.body};font-size:14px;line-height:1.55;color:${P.fg};border:1px solid ${P.border};padding:11px 14px;vertical-align:top;">${v && String(v).trim() ? v : "—"}</td>
    </tr>`,
      )
      .join("");
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px;">${trs}</table>`;
  }

  /** Étapes numérotées — index en cellule bordée (accent secondaire). */
  function emailSteps(steps: Array<[string, string]>): string {
    const rows = steps
      .map(
        ([label, text], i) => `<tr>
      <td valign="top" style="width:34px;padding:0 12px 14px 0;">
        <div style="width:26px;height:26px;border:1px solid ${P.charcoal};border-radius:2px;font-family:${P.mono};font-size:12px;color:${P.accent2};text-align:center;line-height:26px;">${i + 1}</div>
      </td>
      <td valign="top" style="padding:0 0 14px;font-family:${P.body};font-size:14px;line-height:1.55;color:${P.fgSoft};">
        <strong style="color:${P.fg};font-weight:600;">${label}</strong>${text ? ` — ${text}` : ""}
      </td>
    </tr>`,
      )
      .join("");
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">${rows}</table>`;
  }

  /** CTA — plein indigo (primary) ou contour (ghost), libellé mono majuscule. */
  function emailButton(
    href: string,
    label: string,
    opts?: { variant?: "primary" | "ghost" },
  ): string {
    const ghost = opts?.variant === "ghost";
    const bg = ghost ? "transparent" : P.accent;
    const color = ghost ? P.fgSoft : "#ffffff";
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${bg};border:1px solid ${P.charcoal};color:${color};font-family:${P.mono};font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;padding:13px 22px;border-radius:2px;">${label}</a>`;
  }

  function emailButtonRow(buttons: string[]): string {
    return `<div style="margin:0 0 8px;">${buttons.map((b) => `<span style="display:inline-block;margin:0 8px 10px 0;">${b}</span>`).join("")}</div>`;
  }

  /** Stylise le HTML produit par marked() aux tokens Blueprint (pour le corps d'audit). */
  function styleMarkdownForEmail(html: string): string {
    return html
      .replace(
        /<h1>/g,
        `<h1 style="font-family:${P.title};font-weight:300;font-size:22px;line-height:1.2;letter-spacing:-0.3px;color:${P.fg};margin:24px 0 12px;">`,
      )
      .replace(
        /<h2>/g,
        `<h2 style="font-family:${P.title};font-weight:400;font-size:18px;line-height:1.25;color:${P.fg};margin:22px 0 10px;">`,
      )
      .replace(
        /<h3>/g,
        `<h3 style="font-family:${P.mono};font-weight:600;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${P.accent2};margin:20px 0 8px;">`,
      )
      .replace(
        /<p>/g,
        `<p style="font-family:${P.body};font-size:14px;line-height:1.7;color:${P.fgSoft};margin:0 0 12px;">`,
      )
      .replace(
        /<ul>/g,
        `<ul style="font-family:${P.body};font-size:14px;line-height:1.7;color:${P.fgSoft};margin:0 0 14px;padding-left:18px;">`,
      )
      .replace(
        /<ol>/g,
        `<ol style="font-family:${P.body};font-size:14px;line-height:1.7;color:${P.fgSoft};margin:0 0 14px;padding-left:18px;">`,
      )
      .replace(/<li>/g, `<li style="margin:0 0 6px;">`)
      .replace(/<strong>/g, `<strong style="color:${P.fg};font-weight:600;">`)
      .replace(/<a /g, `<a style="color:${P.accent2};text-decoration:underline;" `)
      .replace(
        /<blockquote>/g,
        `<blockquote style="border-left:2px solid ${P.accent2};margin:0 0 14px;padding:4px 0 4px 16px;color:${P.muted};">`,
      )
      .replace(
        /<hr>/g,
        `<hr style="border:none;border-top:1px solid ${P.border};margin:22px 0;">`,
      );
  }

  // ─── Layout ──────────────────────────────────────────────────────────────────

  function emailLayout(opts: {
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
  <meta name="color-scheme" content="${P.scheme}">
  <meta name="supported-color-schemes" content="${P.scheme}">
  ${FONTS_IMPORT}
  </head>
  <body style="margin:0;padding:0;background:${P.bg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${P.bg};font-size:1px;line-height:1px;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${P.bg}" style="background:${P.bg};border-collapse:collapse;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="${P.panel}" style="width:600px;max-width:600px;background:${P.panel};border:1px solid ${P.border};border-radius:4px;border-collapse:separate;">
        <!-- En-tête : wordmark + contact -->
        <tr><td style="padding:18px 26px;border-bottom:1px solid ${P.border};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle" style="font-family:${P.mono};font-size:13px;letter-spacing:0.12em;color:${P.fg};text-transform:uppercase;">
              <span style="display:inline-block;width:8px;height:8px;background:${P.accent2};vertical-align:middle;margin-right:9px;"></span>NEXT IMPACT
            </td>
            <td valign="middle" align="right" style="font-family:${P.mono};font-size:11px;letter-spacing:0.06em;color:${P.muted};">
              <a href="${VISIO_URL}" style="color:${P.accent2};text-decoration:none;">${isEn ? "VIDEO CALL" : "VISIO"}</a>
              <span style="color:${P.faint};">&nbsp;·&nbsp;</span>
              <a href="tel:+33673981638" style="color:${P.muted};text-decoration:none;">06 73 98 16 38</a>
            </td>
          </tr></table>
        </td></tr>
        <!-- Trait d'accent -->
        <tr><td style="font-size:0;line-height:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="64" style="height:2px;background:${P.accent};font-size:0;line-height:0;">&nbsp;</td>
            <td style="height:2px;background:${P.panel};font-size:0;line-height:0;">&nbsp;</td>
          </tr></table>
        </td></tr>
        <!-- Contenu -->
        <tr><td style="padding:34px 26px 30px;">${contentHtml}</td></tr>
        <!-- Pied -->
        <tr><td style="padding:22px 26px;border-top:1px solid ${P.border};">
          <div style="font-family:${P.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${P.fgSoft};margin:0 0 6px;">Next Impact Digital</div>
          <div style="font-family:${P.body};font-size:12px;line-height:1.6;color:${P.muted};">
            <a href="mailto:agathe@next-impact.digital" style="color:${P.accent2};text-decoration:none;">agathe@next-impact.digital</a>
            &nbsp;·&nbsp;
            <a href="tel:+33673981638" style="color:${P.muted};text-decoration:none;">06 73 98 16 38</a>
          </div>
          <div style="font-family:${P.mono};font-size:10px;letter-spacing:0.08em;margin-top:8px;">
            <a href="${homeUrl}" style="color:${P.faint};text-decoration:none;">NEXT-IMPACT.DIGITAL</a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body>
  </html>`;
  }

  return { emailKicker, emailH1, emailH2, emailLead, emailParagraph, emailDivider, emailCard, emailKvTable, emailSteps, emailButton, emailButtonRow, styleMarkdownForEmail, emailLayout };
}

/** Kit par défaut : Blueprint sombre (site, Sentinelle, admin). */
export const {
  emailKicker,
  emailH1,
  emailH2,
  emailLead,
  emailParagraph,
  emailDivider,
  emailCard,
  emailKvTable,
  emailSteps,
  emailButton,
  emailButtonRow,
  styleMarkdownForEmail,
  emailLayout,
} = createEmailKit(EMAIL);

/** Kit clair, fond blanc : e-mails aux clients de l'espace client. */
export const lightEmail = createEmailKit(EMAIL_LIGHT);
