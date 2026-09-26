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
 * Vocabulaire de couleur des livrables.
 *
 * Trois teintes seulement, et chacune répond à une question que le client se
 * pose : est-ce que ça brûle (`alerte`), est-ce que ça approche (`attention`),
 * est-ce que c'est réglé (`fait`). Le reste est neutre.
 *
 * Le vermillon n'en fait PAS partie : il reste réservé aux éléments cliquables,
 * sans quoi l'œil ne sait plus où cliquer. Et aucune de ces teintes ne porte
 * seule une information — chaque pastille est doublée d'un mot, faute de quoi
 * l'écran devient illisible pour qui distingue mal le rouge du vert.
 */
export type Tone = "neutre" | "attention" | "alerte" | "fait";

const TONE_TEXT: Record<Tone, string> = {
  neutre: "border-dark-gray text-mid-gray",
  attention: "border-[#f2c94c]/45 text-[#f2c94c]",
  alerte: "border-[#ff8a7a]/45 text-[#ff8a7a]",
  fait: "border-[#7fd8a4]/45 text-[#7fd8a4]",
};

const TONE_FILL: Record<Tone, string> = {
  neutre: "bg-mid-gray/50",
  attention: "bg-[#f2c94c]",
  alerte: "bg-[#ff8a7a]",
  fait: "bg-[#7fd8a4]",
};

/** Étiquette d'état, en petit. */
export function Tag({ children, tone = "neutre" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${TONE_TEXT[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * Pastille carrée, jamais seule.
 *
 * Carrée et non ronde : la grille en bordures du système est faite d'angles
 * droits, un rond y détonne. `label` alimente le lecteur d'écran, pour qui la
 * couleur n'existe pas.
 */
export function Dot({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`mt-[6px] inline-block h-2 w-2 shrink-0 ${TONE_FILL[tone]}`}
    />
  );
}

/**
 * Un repère du bandeau de tête : un chiffre lisible de loin, son libellé au-dessus.
 *
 * Quatre au maximum. C'est la réponse à « où en est-on ? » avant tout
 * défilement ; au-delà de quatre, ce n'est plus un coup d'œil, c'est un tableau.
 */
export function Stat({
  label,
  value,
  hint,
  tone = "neutre",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  const color = tone === "neutre" ? "text-foreground" : TONE_TEXT[tone].split(" ")[1];

  return (
    <div className="border-t border-dark-gray px-4 py-5 sm:border-l sm:border-t-0 sm:first:border-l-0">
      <Label>{label}</Label>
      <p className={`mt-2 font-sans text-2xl font-light leading-none ${color}`}>{value}</p>
      {hint ? (
        <p className="mt-2 font-inter-tight text-xs leading-snug text-mid-gray">{hint}</p>
      ) : null}
    </div>
  );
}

/** Sommaire d'ancres. Rendu seulement quand il y a plus d'une section à atteindre. */
export function SectionNav({ items }: { items: { href: string; label: string; count: number }[] }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Sommaire de la page" className="mt-8 flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="border border-dark-gray px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:border-accent-secondary hover:text-foreground"
        >
          {item.label} <span className="text-foreground">{item.count}</span>
        </a>
      ))}
    </nav>
  );
}
