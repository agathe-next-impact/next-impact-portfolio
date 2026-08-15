import type { CSSProperties } from "react";
import type { Verdict } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Jetons visuels des e-mails Sentinelle.
//
// Copie assumée de l'identité du site (Blueprint : fond obsidian, grille en
// bordures fines, libellés mono en majuscules, Figtree pour les titres, Inter
// Tight pour le corps) — et non un import de `lib/email-template.ts`, qui est le
// kit de la vitrine. Les deux piles d'e-mail restent séparées (plan §2, E7) :
// même fournisseur, deux identités, deux cycles de vie. Le jour de l'extraction
// en sous-domaine, ce dossier part tel quel.
//
// Contraintes propres à l'e-mail, qui expliquent tout ce qui suit :
//   · pas de variable CSS ni de classe — styles en ligne, couleurs en hexa ;
//   · pas de flexbox fiable — React Email rend des tables ;
//   · les polices de marque ne chargent que sur Apple Mail, d'où les replis
//     Arial/Helvetica déclarés dans chaque pile.
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  bg: "#050505",
  panel: "#0b0b0d",
  surface: "#131318",
  border: "#242424",
  charcoal: "#363636",
  fg: "#ffffff",
  fgSoft: "#e6e6e6",
  muted: "#9e9e9e",
  faint: "#6f6f6f",
  accent: "#8aa2f0",
} as const;

export const FONTS = {
  title: "'Figtree','Helvetica Neue',Arial,sans-serif",
  body: "'Inter Tight','Helvetica Neue',Arial,sans-serif",
  mono: "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace",
} as const;

/**
 * Couleur et libellé de chaque verdict.
 *
 * Le libellé dit ce qu'il faut FAIRE, pas la gravité ressentie : « à traiter »
 * plutôt que « critique ». C'est la même règle que dans le prompt système — une
 * alerte qui fait peur sans dire quoi faire ne sert à rien.
 *
 * Les couleurs sont choisies claires : sur fond obsidian, un rouge saturé passe
 * mal, et le contraste compte plus que la nuance.
 */
export const VERDICT_STYLE: Record<Verdict, { color: string; label: string }> = {
  red: { color: "#ff8a7a", label: "À traiter" },
  orange: { color: "#f5c451", label: "À surveiller" },
  green: { color: "#7fd8a4", label: "Rien à faire" },
  info: { color: COLORS.accent, label: "Pour information" },
};

export const styles = {
  body: {
    backgroundColor: COLORS.bg,
    margin: 0,
    padding: "24px 0",
  } satisfies CSSProperties,

  container: {
    backgroundColor: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    margin: "0 auto",
    maxWidth: "600px",
    width: "100%",
  } satisfies CSSProperties,

  section: {
    padding: "28px 32px",
  } satisfies CSSProperties,

  kicker: {
    color: COLORS.accent,
    fontFamily: FONTS.mono,
    fontSize: "11px",
    letterSpacing: "0.14em",
    margin: 0,
    textTransform: "uppercase",
  } satisfies CSSProperties,

  label: {
    color: COLORS.muted,
    fontFamily: FONTS.mono,
    fontSize: "11px",
    letterSpacing: "0.14em",
    margin: "0 0 10px",
    textTransform: "uppercase",
  } satisfies CSSProperties,

  h1: {
    color: COLORS.fg,
    fontFamily: FONTS.title,
    fontSize: "26px",
    fontWeight: 300,
    letterSpacing: "-0.4px",
    lineHeight: 1.2,
    margin: "0 0 18px",
  } satisfies CSSProperties,

  paragraph: {
    color: COLORS.fgSoft,
    fontFamily: FONTS.body,
    fontSize: "15px",
    lineHeight: 1.7,
    margin: "0 0 14px",
  } satisfies CSSProperties,

  muted: {
    color: COLORS.muted,
    fontFamily: FONTS.body,
    fontSize: "13px",
    lineHeight: 1.65,
    margin: "0 0 10px",
  } satisfies CSSProperties,

  panel: {
    backgroundColor: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    padding: "20px 24px",
  } satisfies CSSProperties,

  rule: {
    border: "none",
    borderTop: `1px solid ${COLORS.border}`,
    margin: 0,
  } satisfies CSSProperties,

  link: {
    color: COLORS.accent,
    textDecoration: "underline",
  } satisfies CSSProperties,

  footer: {
    color: COLORS.faint,
    fontFamily: FONTS.body,
    fontSize: "12px",
    lineHeight: 1.6,
    margin: "0 0 8px",
  } satisfies CSSProperties,
} as const;

/** Date en toutes lettres, en français — « 15 août 2026 ». */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(date);
}
