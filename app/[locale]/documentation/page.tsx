import { BentoGrid } from "@/components/documentation/bento-grid";
import { AllCategoriesGrid } from "@/components/documentation/cross-category-nav";
import { DocumentationToolsSection } from "@/components/documentation/documentation-internal-links";
import { AuditContextualBanner } from "@/components/documentation/audit-contextual-banner";
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
      <PageLayout titre={t("hubTitle")} sousTitre={t("hubSubtitle")}>
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            {/* Couche 1 — décision : le Sélecteur + les 6 rubriques par question */}
            <HubRubriques locale={locale} />

            {/* Couche 2 — bibliothèque : contenus encyclopédiques (démotés) */}
            <div className="mb-10 border-t border-dark-gray pt-12" />
            <AuditContextualBanner />
            <AllCategoriesGrid />
            <DocumentationToolsSection />
          </div>
        </section>
      </PageLayout>
    </main>
  );
}
