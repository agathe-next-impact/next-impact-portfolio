import type { ReactNode } from "react";
import Link from "next/link";
import type { Verdict } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulaire visuel de l'admin.
//
// Même langage que le site (grille en bordures fines, libellés mono en
// majuscules, Figtree/Inter Tight) mais densité d'outil interne : pas de héros,
// pas d'animation, tout au-dessus de la ligne de flottaison. Ces composants sont
// locaux à l'admin exprès — ils ne sont pas du design system, et n'ont pas à
// vivre plus longtemps que l'écran qu'ils servent.
// ─────────────────────────────────────────────────────────────────────────────

export const VERDICT_LABEL: Record<Verdict, string> = {
  red: "À traiter",
  orange: "À surveiller",
  green: "Rien à faire",
  info: "Information",
};

const VERDICT_COLOR: Record<Verdict, string> = {
  red: "text-[#ff8a7a] border-[#ff8a7a]/40",
  orange: "text-[#f5c451] border-[#f5c451]/40",
  green: "text-[#7fd8a4] border-[#7fd8a4]/40",
  info: "text-accent-secondary border-accent-secondary/40",
};

export function VerdictBadge({ verdict }: { verdict: Verdict | null }) {
  if (!verdict) {
    return <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">—</span>;
  }

  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${VERDICT_COLOR[verdict]}`}
    >
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label: Record<string, string> = {
    draft: "brouillon",
    validated: "validée",
    sent: "envoyée",
    dismissed: "écartée",
    resolved: "résolue",
  };

  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
      {label[status] ?? status}
    </span>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">{children}</p>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-dark-gray bg-jet/40 ${className}`}>{children}</div>;
}

const BUTTON_BASE =
  "inline-flex items-center justify-center px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export const buttonClass = {
  primary: `${BUTTON_BASE} border border-accent-secondary bg-accent-secondary text-obsidian hover:opacity-90`,
  ghost: `${BUTTON_BASE} border border-dark-gray text-foreground hover:border-accent-secondary`,
  danger: `${BUTTON_BASE} border border-dark-gray text-mid-gray hover:border-[#ff8a7a] hover:text-[#ff8a7a]`,
} as const;

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-accent-secondary"
    >
      ← {children}
    </Link>
  );
}

/** Bandeau de résultat d'action, lu depuis l'URL après une redirection. */
export function Notice({ message, tone }: { message: string; tone: "ok" | "erreur" }) {
  return (
    <p
      role="status"
      className={`border-l-2 px-4 py-3 font-inter-tight text-sm ${
        tone === "ok"
          ? "border-[#7fd8a4] text-[#7fd8a4]"
          : "border-[#ff8a7a] text-[#ff8a7a]"
      }`}
    >
      {message}
    </p>
  );
}

/** Date courte, heure de Paris — l'admin se lit depuis la France. */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
}
