import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getRubrique, rx, type RubriqueSlug } from "@/lib/documentation-rubriques";

/**
 * CTA de sortie UNIQUE d'un article — contextuel à sa rubrique et à la bonne
 * température (voir la table de mapping dans lib/documentation-rubriques.ts).
 *
 * Règle : température froide par défaut, l'outil gratuit d'abord. Pas de CTA
 * intermédiaire dans le corps, pas de bannière visio : la doc prouve, elle ne
 * vend pas — c'est sa crédibilité qui la rend citable.
 */
export function ArticleCta({
  rubrique,
  locale,
}: {
  rubrique: RubriqueSlug;
  locale: Locale;
}) {
  const entry = getRubrique(rubrique);
  if (!entry) return null;

  const { cta, ctaTitle } = entry;

  return (
    <section className="border border-l-[3px] border-dark-gray border-l-vermilion bg-jet/40 p-6 md:p-8">
      <p className="mb-4 max-w-[46ch] text-xl font-light leading-snug text-foreground">
        {rx(ctaTitle, locale)}
      </p>
      <Link
        href={cta.href as Parameters<typeof Link>[0]["href"]}
        className="inline-flex min-h-11 items-center gap-2 py-2.5 rounded-sm bg-accent-secondary px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-obsidian no-underline transition-colors hover:bg-accent-secondary/85"
      >
        {rx(cta.label, locale)}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
        {rx(cta.note, locale)}
      </p>
      {cta.secondary && (
        <p className="mt-4 border-t border-dark-gray pt-4 text-sm">
          <Link
            href={cta.secondary.href as Parameters<typeof Link>[0]["href"]}
            className="text-mid-gray underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {rx(cta.secondary.label, locale)}
          </Link>
        </p>
      )}
    </section>
  );
}
