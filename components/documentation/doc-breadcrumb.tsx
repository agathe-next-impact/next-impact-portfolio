import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface BreadcrumbCrumb {
  name: string;
  /** Absent sur le dernier niveau (la page courante). */
  href?: string;
}

/**
 * Convertit les items passés à `<BreadcrumbJsonLd>` en fil visible, pour que les
 * deux ne puissent pas diverger : même source, le dernier niveau non cliquable.
 */
export function toCrumbs(items: Array<{ name: string; url: string }>): BreadcrumbCrumb[] {
  return items.map((item, i) => ({
    name: item.name,
    href: i < items.length - 1 ? item.url : undefined,
  }));
}

/**
 * Fil d'Ariane visible des pages de documentation — article (4 niveaux),
 * rubrique et catégorie (3 niveaux). Rendu côté serveur : les moteurs IA lisent
 * mal le JS, et ce fil est le miroir visible du `BreadcrumbList` JSON-LD.
 *
 * Rien à voir avec `components/ui/breadcrumb.tsx` (primitive shadcn inutilisée).
 */
export function DocBreadcrumb({
  items,
  className = "mb-8",
}: {
  items: BreadcrumbCrumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Fil d'Ariane" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 p-0 text-[0.8125rem] text-mid-gray">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex list-none items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  className="no-underline transition-colors hover:text-accent-secondary"
                >
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-3 w-3 shrink-0 text-dark-gray" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
