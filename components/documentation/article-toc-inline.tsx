import type { Locale } from "@/i18n/routing";
import type { TocEntry } from "@/lib/toc";

/**
 * Sommaire ancré du gabarit d'article — généré depuis les H2, rendu côté
 * serveur (le sommaire flottant existant est client et ne compte pas pour les
 * crawlers). N'apparaît qu'au-delà de 3 sections, comme prévu au contrat.
 */
export function ArticleTocInline({
  entries,
  locale,
}: {
  entries: TocEntry[];
  locale: Locale;
}) {
  const sections = entries.filter((e) => e.level === 2);
  if (sections.length <= 3) return null;

  const label = locale === "en" ? "Contents" : "Sommaire";

  return (
    <nav aria-label={label} className="mb-10 border border-dark-gray bg-jet/30 px-6 py-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray">
        {label}
      </p>
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {sections.map((section, i) => (
          <li key={section.id} className="flex gap-3 text-sm">
            <span className="font-mono text-[11px] text-dark-gray" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${section.id}`}
              className="text-mid-gray no-underline transition-colors hover:text-accent-secondary"
            >
              {section.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
