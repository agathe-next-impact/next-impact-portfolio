import type { Locale } from "@/i18n/routing";

/**
 * Bloc « En bref » en tête d'article — décliné du bloc « En bref » de la home
 * (`components/home-tldr.tsx`) : même liseré accent, même hiérarchie typo, mais
 * rendu serveur et alimenté par le front matter `enBref`.
 *
 * C'est la pièce maîtresse du gabarit GEO : 3 à 4 phrases autonomes,
 * compréhensibles hors contexte, extractibles telles quelles par un LLM. Champ
 * obligatoire du contrat — sans lui, l'article ne passe pas au gabarit.
 */
export function ArticleEnBref({
  lines,
  locale,
}: {
  lines: string[];
  locale: Locale;
}) {
  const label = locale === "en" ? "In short" : "En bref";

  return (
    <aside
      role="note"
      aria-label={label}
      className="article-en-bref mb-10 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5 lg:px-8"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-secondary">
        {label}
      </p>
      {lines.length === 1 ? (
        <p className="font-inter-tight text-[15px] leading-relaxed text-foreground">
          {lines[0]}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {lines.map((line) => (
            <li
              key={line}
              className="font-inter-tight text-sm leading-relaxed text-foreground md:text-[15px]"
            >
              {line}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
