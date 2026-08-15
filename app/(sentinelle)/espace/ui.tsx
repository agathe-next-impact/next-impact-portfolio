import type { ReactNode } from "react";
import Link from "next/link";
import type { Verdict } from "@sentinelle/types";

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulaire visuel de l'espace client.
//
// Distinct de celui de l'admin (`app/(sentinelle)/admin/ui.tsx`) et ce n'est pas
// une duplication par négligence : les deux écrans ne parlent pas à la même
// personne. L'admin affiche des statuts de production (brouillon, validée,
// écartée) ; l'espace n'a pas à connaître ces mots — un abonné ne doit jamais
// lire qu'une alerte le concernant est « en brouillon quelque part ».
//
// Densité plus faible qu'en admin, aussi : on consulte cet écran deux fois par
// an, pas dix fois par jour.
// ─────────────────────────────────────────────────────────────────────────────

const VERDICT_STYLE: Record<Verdict, { label: string; className: string }> = {
  red: { label: "À traiter", className: "text-[#ff8a7a] border-[#ff8a7a]/40" },
  orange: { label: "À surveiller", className: "text-[#f5c451] border-[#f5c451]/40" },
  green: { label: "Rien à faire", className: "text-[#7fd8a4] border-[#7fd8a4]/40" },
  info: { label: "Information", className: "text-accent-secondary border-accent-secondary/40" },
};

export function VerdictBadge({ verdict }: { verdict: Verdict | null }) {
  if (!verdict) return null;

  const style = VERDICT_STYLE[verdict];
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${style.className}`}
    >
      {style.label}
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
  "inline-flex items-center justify-center px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export const buttonClass = {
  primary: `${BUTTON_BASE} border border-accent-secondary bg-accent-secondary text-obsidian hover:opacity-90`,
  ghost: `${BUTTON_BASE} border border-dark-gray text-foreground hover:border-accent-secondary`,
  quiet: `${BUTTON_BASE} border border-transparent text-mid-gray hover:text-foreground`,
} as const;

export const inputClass =
  "w-full border border-dark-gray bg-transparent px-4 py-3 font-inter-tight text-base text-foreground placeholder:text-mid-gray/50 focus:border-accent-secondary focus:outline-none";

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

/** Bandeau de résultat, lu depuis l'URL après une redirection. */
export function Notice({ message, tone }: { message: string; tone: "ok" | "erreur" }) {
  return (
    <p
      role="status"
      className={`border-l-2 px-4 py-3 font-inter-tight text-sm leading-relaxed ${
        tone === "ok" ? "border-[#7fd8a4] text-[#7fd8a4]" : "border-[#ff8a7a] text-[#ff8a7a]"
      }`}
    >
      {message}
    </p>
  );
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(date);
}

/** Familles de composants, dans les mots du client — pas ceux du modèle. */
export const FAMILY_LABEL: Record<string, string> = {
  cms: "Gestionnaire de contenu",
  cms_plugin: "Extensions",
  cms_theme: "Thème",
  ecommerce: "Boutique",
  framework: "Socle technique",
  js_library: "Bibliothèques",
  runtime: "Langage / exécution",
  server: "Serveur web",
  hosting: "Hébergement",
  cdn: "Réseau de diffusion",
  analytics: "Mesure d'audience",
  saas: "Services tiers",
  competitor_url: "Veille concurrentielle",
};
