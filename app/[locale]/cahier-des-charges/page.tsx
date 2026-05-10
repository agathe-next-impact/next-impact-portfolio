import PageLayout from "@/components/page-layout";
import CahierDesChargesForm from "@/components/cahier-des-charges/cahier-des-charges-form-wrapper"
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/json-ld";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "specsPage" });
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/cahier-des-charges",
    keywords:
      locale === "en"
        ? ["specifications", "web project", "specs", "project brief"]
        : ["cahier des charges", "projet site web", "spécifications", "brief projet"],
    locale,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "specsPage" });
  const tOutils = await getTranslations({ locale, namespace: "toolsPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbTools"), url: "/outils" },
    { name: t("breadcrumbSpecs"), url: "/cahier-des-charges" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <WebApplicationJsonLd
        name={t("title")}
        description={t("metaDescription")}
        url="/cahier-des-charges"
        applicationCategory="BusinessApplication"
      />
      <PageLayout titre={t("title")} sousTitre={t("subtitle")}>
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <Link
              href="/outils"
              className="inline-flex items-center gap-1.5 text-sm text-extralightblue/60 hover:text-white transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {tOutils("backToTools")}
            </Link>
            <CahierDesChargesForm />
          </div>
        </section>
      </PageLayout>
    </>
  )
}
