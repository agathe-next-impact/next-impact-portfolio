import { BentoGrid } from "@/components/documentation/bento-grid";
import { DemoShowcase } from "@/components/documentation/demo-showcase";
import { AllCategoriesGrid } from "@/components/documentation/cross-category-nav";
import { DocumentationToolsSection } from "@/components/documentation/documentation-internal-links";
import { AuditContextualBanner } from "@/components/documentation/audit-contextual-banner";
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
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
            "Headless WordPress documentation",
            "Next.js tutorials",
            "technical guides",
            "developer resources",
          ]
        : [
            "documentation WordPress Headless",
            "tutoriels Next.js",
            "guides techniques",
            "ressources développeurs",
          ],
    locale,
  });
}

const documentationCategories = [
  { name: "Marketing Digital", url: "/documentation/marketing-digital", description: "Principes et concepts de base du marketing digital." },
  { name: "SEO", url: "/documentation/seo", description: "Guides et ressources pour maîtriser le SEO de votre site." },
  { name: "Design & UI/UX", url: "/documentation/design-ui-ux", description: "Expériences utilisateurs engageantes et accessibles." },
  { name: "Projet de site web", url: "/documentation/projet-site-web", description: "Préparer et mener un projet de site web de A à Z." },
  { name: "WordPress", url: "/documentation/wordpress", description: "Bonnes pratiques et guides pour WordPress." },
  { name: "Headless CMS", url: "/documentation/headless-cms", description: "Architecture headless, API REST et découplage front/back." },
  { name: "Blog", url: "/documentation/blog", description: "Actualités et analyses sur le développement web." },
];

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

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={t("metaTitle")}
        description={t("metaDescription")}
        url="/documentation"
        items={documentationCategories}
      />
      <PageLayout titre={t("title")} sousTitre={t("subtitle")}>
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            <BentoGrid />
            <AuditContextualBanner />
            <AllCategoriesGrid />
            <DocumentationToolsSection />
            <DemoShowcase />
          </div>
        </section>
      </PageLayout>
    </main>
  );
}
