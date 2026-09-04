import { BentoGrid } from "@/components/documentation/bento-grid";
import { AllCategoriesGrid } from "@/components/documentation/cross-category-nav";
import { DocumentationToolsSection } from "@/components/documentation/documentation-internal-links";
import {
  DocumentationSearch,
  type DocSearchItem,
} from "@/components/documentation/documentation-search";
import { getAllArticles } from "@/lib/markdown";
import { HubRubriques } from "@/components/hub/hub-rubriques";
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
import { HUB_THEMES, tx } from "@/lib/hub-themes";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documentationPage" });
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/documentation",
    keywords:
      locale === "en"
        ? [
            "which web tech",
            "choose web technology",
            "web tech in the AI era",
            "WordPress no-code Headless custom",
          ]
        : [
            "quelle techno web",
            "choisir sa techno web",
            "techno web à l'heure de l'IA",
            "WordPress no-code Headless sur-mesure",
          ],
    locale,
  });
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documentationPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDocs"), url: "/documentation" },
  ];

  // Corpus de recherche du héros : tous les articles de documentation de la
  // locale, réduits aux champs utiles (le filtrage est fait côté client).
  const searchItems: DocSearchItem[] = getAllArticles(locale)
    .map((a) => ({
      slug: a.slug,
      category: a.category,
      title: a.title,
      description: a.description ?? "",
    }))
    .filter((a) => a.title && a.category);

  // Une seule taxonomie visible : le JSON-LD du hub liste les 7 rubriques de
  // décision (source : lib/hub-themes.ts), pas les catégories encyclopédiques.
  const rubriqueItems = Object.values(HUB_THEMES).map((theme) => ({
    name: tx(theme.kicker, locale),
    url: `/documentation/${theme.slug}`,
    description: tx(theme.meta.description, locale),
  }));

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={t("metaTitle")}
        description={t("metaDescription")}
        url="/documentation"
        items={rubriqueItems}
      />
      <PageLayout
        titre={t("hubTitle")}
        sousTitre={t("hubSubtitle")}
        headerSlot={<DocumentationSearch items={searchItems} locale={locale} />}
      >
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            {/* Bibliothèque remontée sous le héros : les catégories d'abord */}
            <AllCategoriesGrid />

            {/* Couche décision : le Sélecteur + les 7 rubriques par question.
                Pas de filet ici : la grille ci-dessus porte déjà son border-y. */}
            <div className="mt-14" />
            <HubRubriques locale={locale} />

            <DocumentationToolsSection />
          </div>
        </section>
      </PageLayout>
    </main>
  );
}
