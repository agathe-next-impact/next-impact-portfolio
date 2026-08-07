// Helpers partagés des routes thématiques du hub. Factorise la métadonnée et le
// rendu pour que chaque `documentation/<slug>/page.tsx` se réduise à 3 lignes.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ThemePage } from "@/components/hub/theme-page";
import { getHubTheme, tx } from "@/lib/hub-themes";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { DocBreadcrumb, toCrumbs } from "@/components/documentation/doc-breadcrumb";
import type { Locale } from "@/i18n/routing";

type Params = Promise<{ locale: Locale }>;

/** Métadonnée d'une page thématique, dérivée de la donnée du thème. */
export async function themeMetadata(slug: string, params: Params): Promise<Metadata> {
  const { locale } = await params;
  const theme = getHubTheme(slug);
  if (!theme) return {};
  return generatePageMetadata({
    title: tx(theme.meta.title, locale),
    description: tx(theme.meta.description, locale),
    path: `/documentation/${slug}`,
    keywords: locale === "en" ? theme.keywords.en : theme.keywords.fr,
    locale,
  });
}

/** Rendu d'une page thématique (breadcrumb + parcours 4 temps). */
export async function ThemeRoute({ slug, params }: { slug: string; params: Params }) {
  const { locale } = await params;
  const theme = getHubTheme(slug);
  if (!theme) notFound();

  const t = await getTranslations({ locale, namespace: "documentationPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDocs"), url: "/documentation" },
    { name: tx(theme.kicker, locale), url: `/documentation/${slug}` },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ThemePage
        theme={theme}
        locale={locale}
        breadcrumb={<DocBreadcrumb items={toCrumbs(breadcrumbItems)} className="mb-6" />}
      />
    </main>
  );
}
