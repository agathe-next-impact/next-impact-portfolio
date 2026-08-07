import type { ArticleKeyFigure } from "@/lib/markdown";
import type { Locale } from "@/i18n/routing";

/**
 * Emplacement optionnel des « chiffres clés » d'un article (front matter
 * `keyFigures`). Le gabarit fournit le contenant, jamais le contenu : les
 * chiffres propriétaires (scores PageSpeed, nombre de projets, délais
 * constatés) relèvent du travail éditorial et ne s'inventent pas.
 *
 * Rendu en `<dl>` — la relation terme/définition est la plus lisible pour un
 * moteur de réponse qui extrait une donnée chiffrée.
 */
export function ArticleKeyFigures({
  figures,
  locale,
}: {
  figures: ArticleKeyFigure[];
  locale: Locale;
}) {
  if (!figures.length) return null;
  const label = locale === "en" ? "Key figures" : "Chiffres clés";

  return (
    <section aria-label={label} className="border border-dark-gray">
      <p className="border-b border-dark-gray px-6 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray">
        {label}
      </p>
      <dl className="m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((figure) => (
          <div
            key={figure.label}
            className="border-b border-r border-dark-gray p-6 last:border-b-0"
          >
            <dd className="m-0 mb-2 text-3xl font-light leading-none text-foreground">
              {figure.value}
            </dd>
            <dt className="font-inter-tight text-sm leading-snug text-mid-gray">
              {figure.label}
            </dt>
            {figure.source && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-dark-gray">
                {figure.source}
              </p>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
