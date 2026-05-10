import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import AboutClient from "@/components/about/AboutClient";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/a-propos",
    keywords:
      locale === "en"
        ? [
            "about Next Impact",
            "Agathe Karinthi-Martin",
            "freelance Headless WordPress developer",
            "social-economy organizations",
            "sustainable engagement",
            "headless",
            "freelance journey",
          ]
        : [
            "à propos Next Impact",
            "Agathe Karinthi-Martin",
            "développeur WordPress Headless freelance",
            "ESS",
            "engagement durable",
            "headless",
            "parcours freelance",
          ],
    locale,
  });
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbAbout"), url: "/a-propos" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PersonJsonLd />
      <AboutClient />
    </>
  );
}
