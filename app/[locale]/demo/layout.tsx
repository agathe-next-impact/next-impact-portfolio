import { getTranslations } from "next-intl/server";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";

// Pas de generateMetadata ici : demo/page.tsx et demo/metadata-test/page.tsx
// portent chacun les leurs. Celles du layout, toujours écrasées, étaient
// mortes (et contenaient la coquille « Billeterie ») : retirées le 2026-09-28.

export default async function DemoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Next type le segment en string ; le layout [locale] a déjà validé la valeur.
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "demoPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDemo"), url: "/demo" },
  ];

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      {children}
    </>
  );
}
