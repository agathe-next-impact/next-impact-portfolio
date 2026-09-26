import { sendMail } from "@/lib/sendMail";
import {
  EMAIL,
  emailButton,
  emailCard,
  emailDivider,
  emailH1,
  emailH2,
  emailKicker,
  emailLayout,
  emailLead,
  emailParagraph,
} from "@/lib/email-template";
import type { DigestContent, DigestLine, DigestTone } from "./types";
import { weekLabel } from "./week";

// ─────────────────────────────────────────────────────────────────────────────
// L'e-mail du digest hebdomadaire.
//
// **Exception assumée à la règle de la couche d'accès** (« aucun contenu de
// l'espace ne voyage par e-mail », `src/cto/access/notify.ts`), décidée le
// 26 septembre 2026 : le digest est fait pour être lu dans la boîte. Il ne
// porte que des lignes courtes, déjà relues à leur source ; les lettres
// complètes, les décisions et les livrables restent dans l'espace, derrière
// un lien.
// ─────────────────────────────────────────────────────────────────────────────

const TONE_COLOR: Record<DigestTone, string> = {
  critique: "#ff8a7a",
  attention: "#f2c94c",
  ok: "#7fd8a4",
  info: EMAIL.accent2,
};

const TONE_LABEL: Record<DigestTone, string> = {
  critique: "Critique",
  attention: "À surveiller",
  ok: "RAS",
  info: "Info",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Une ligne : pastille de couleur, ton écrit en toutes lettres, texte. */
function lineHtml(line: DigestLine): string {
  const color = line.tone ? TONE_COLOR[line.tone] : EMAIL.charcoal;
  const label = [line.tag, line.tone ? TONE_LABEL[line.tone] : null].filter(Boolean).join(" · ");
  return `<tr>
    <td width="14" valign="top" style="padding:7px 0 0;"><div style="width:8px;height:8px;border-radius:4px;background:${color};font-size:0;line-height:0;">&nbsp;</div></td>
    <td style="padding:2px 0 8px;font-family:${EMAIL.body};font-size:14px;line-height:1.5;color:${EMAIL.fgSoft};">
      ${label ? `<span style="font-family:${EMAIL.mono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL.muted};">${escapeHtml(label)}</span><br>` : ""}${escapeHtml(line.text)}
    </td>
  </tr>`;
}

function linesHtml(lines: DigestLine[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">${lines.map(lineHtml).join("")}</table>`;
}

export function digestEmailHtml(content: DigestContent, name: string, url: string): string {
  const parts: string[] = [
    emailKicker("01", "Veille de la semaine"),
    emailH1(escapeHtml(weekLabel(content.week))),
    emailLead(`Bonjour ${escapeHtml(name)}, voici ce que vos deux veilles retiennent de la semaine.`),
  ];

  if (content.sentinelle) {
    parts.push(emailH2("Veille technique · votre site"));
    parts.push(emailCard(linesHtml(content.sentinelle.lines)));
  }

  if (content.signaux.length > 0) {
    parts.push(emailDivider());
    for (const signal of content.signaux) {
      parts.push(emailH2(`Signaux faibles · ${escapeHtml(signal.label ?? signal.title)}`));
      const action = signal.action
        ? `<div style="margin:10px 0 0;padding:10px 12px;border-left:2px solid ${EMAIL.accent2};font-family:${EMAIL.body};font-size:14px;color:${EMAIL.fg};"><span style="font-family:${EMAIL.mono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL.muted};">Action de la semaine</span><br>${escapeHtml(signal.action)}</div>`
        : "";
      parts.push(emailCard(linesHtml(signal.lines) + action));
    }
  } else if (content.signauxAttendus) {
    parts.push(emailParagraph("Signaux faibles : pas de nouvelle édition cette semaine."));
  }

  parts.push(emailButton(url, "Voir le digest et les lettres complètes"));

  return emailLayout({
    preheader: `${weekLabel(content.week)} : votre veille en quelques lignes.`,
    contentHtml: parts.join(""),
  });
}

export async function sendDigestEmail(
  to: { email: string; name: string },
  content: DigestContent,
  url: string,
): Promise<void> {
  const parsed = /W(\d+)$/.exec(content.week);
  await sendMail({
    to: to.email,
    subject: `Votre veille de la semaine${parsed ? ` ${Number(parsed[1])}` : ""}`,
    html: digestEmailHtml(content, to.name, url),
  });
}
