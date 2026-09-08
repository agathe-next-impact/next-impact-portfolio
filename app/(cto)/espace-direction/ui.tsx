import type { ReactNode } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulaire visuel de l'espace direction technique.
//
// Reprend les tokens Blueprint du site (bordures, mono en capitales espacées,
// accent vermillon ponctuel) sans importer les composants marketing : ceux-ci
// portent des animations et des variantes dont un outil consulté deux fois par
// mois n'a aucun usage.
//
// Densité basse, assumée. Un dirigeant ouvre cet écran pour trouver une réponse
// en dix secondes ; chaque élément supplémentaire est du temps qu'il perd.
// ─────────────────────────────────────────────────────────────────────────────

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mid-gray">
      {children}
    </p>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
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

/**
 * Bandeau d'information ou d'erreur.
 *
 * Un seul composant pour les deux : la seule différence est la couleur de la
 * bordure. Deux composants distincts finiraient par diverger de mise en page
 * pour rien.
 */
export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "erreur" | "succes";
}) {
  const border =
    tone === "erreur"
      ? "border-[#ff8a7a]/50"
      : tone === "succes"
        ? "border-[#7fd8a4]/50"
        : "border-dark-gray";

  return (
    <div className={`border ${border} bg-jet/40 px-4 py-3`}>
      <p className="font-inter-tight text-sm text-foreground">{children}</p>
    </div>
  );
}

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

/**
 * En-tête de page : le nom de l'entreprise cliente, puis le titre de l'écran.
 *
 * L'ordre compte. Trois personnes de trois entreprises peuvent ouvrir cet
 * espace ; la première chose à confirmer est « je suis bien chez moi ».
 */
export function PageHeader({
  company,
  title,
  children,
}: {
  company: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-dark-gray pb-6">
      <Label>{company}</Label>
      <h1 className="mt-2 font-sans text-2xl font-light text-foreground sm:text-3xl">
        {title}
      </h1>
      {children ? <div className="mt-4">{children}</div> : null}
    </header>
  );
}

export function formatDate(value: Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(value);
}

/**
 * Date sans heure.
 *
 * Les dates des livrables viennent de colonnes Notion sans heure : afficher
 * « 01:00 » sur une date de comité ferait croire à une précision qui n'existe
 * pas, et à un fuseau mal géré.
 */
export function formatDay(value: Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "Europe/Paris",
  }).format(value);
}

/** Montant en euros, sans centimes : un budget au centime près est un faux. */
export function formatAmount(value: number | null | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Étiquette d'état, en petit.
 *
 * Une seule couleur d'accent dans tout l'espace : le vermillon est réservé aux
 * actions. Un statut se lit à sa position et à son texte, pas à sa couleur —
 * sinon quatre statuts appellent quatre couleurs, et l'écran devient un tableau
 * de bord alors qu'il est un relevé.
 */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-dark-gray px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
      {children}
    </span>
  );
}
