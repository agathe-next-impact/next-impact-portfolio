import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title:
      locale === "en"
        ? "Headless WordPress Next.js demo — Event ticketing"
        : "Démo WordPress Headless Next.js — Billeterie événementielle",
    description:
      locale === "en"
        ? "See live how Headless WordPress works with Next.js for an online ticketing platform. Performance, flexibility and the WordPress back office."
        : "Découvrez en live le fonctionnement d'un WordPress Headless avec Next.js sur le cas d'une billeterie en ligne. Performance, flexibilité et back-office WordPress.",
    path: "/demo",
    keywords:
      locale === "en"
        ? [
            "Headless WordPress demo",
            "Headless WordPress Next.js",
            "event ticketing",
            "Headless WordPress video",
          ]
        : [
            "démo WordPress Headless",
            "WordPress Headless Next.js",
            "billeterie événementielle",
            "vidéo WordPress Headless",
          ],
    locale,
  });
}

export default async function DemoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demoPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDemo"), url: "/demo" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {children}
    </>
  );
}
