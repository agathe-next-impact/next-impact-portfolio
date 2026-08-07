import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import AboutClient from "@/components/about/AboutClient";
import { BreadcrumbJsonLd, FAQJsonLd, PersonJsonLd } from "@/components/json-ld";
import { getAboutContent } from "@/lib/about-content";
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
            "web technology advice",
            "multidisciplinary web background",
            "technical business marketing design",
            "holistic web project vision",
            "AI coding",
            "web AI tech selector",
            "technology choice",
            "project scoping",
            "TIH provider",
          ]
        : [
            "à propos Next Impact",
            "Agathe Karinthi-Martin",
            "conseil techno web",
            "parcours pluridisciplinaire web",
            "technique business marketing design",
            "vision globale projet web",
            "IA coding",
            "Sélecteur techno web IA",
            "choix technologie",
            "cadrage projet",
            "prestataire TIH",
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
  const about = getAboutContent(locale);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PersonJsonLd />
      <FAQJsonLd questions={about.faq.items} />
      <AboutClient />
    </>
  );
}
