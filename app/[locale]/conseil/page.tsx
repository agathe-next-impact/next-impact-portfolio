import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import VisioConseilPage from "@/components/visio-conseil/visio-conseil-page";
import { FAQ } from "@/lib/visio-conseil";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return generatePageMetadata({
    title: isEn
      ? "Web technology advice in the age of AI"
      : "Conseil techno web à l'heure de l'IA",
    description: isEn
      ? "AI can code fast. Next Impact helps you decide what to build, with which technology, and how far to go before investing."
      : "L'IA peut coder vite. Next Impact vous aide à choisir quoi construire, avec quelle techno, et jusqu'où aller avant d'investir.",
    path: "/conseil",
    keywords: isEn
      ? [
          "WordPress advice",
          "which WordPress theme",
          "which WordPress plugins",
          "tech stack advice",
          "which technology web project",
          "challenge agency quote",
          "website second opinion",
        ]
      : [
          "conseil WordPress",
          "quel thème WordPress",
          "quelles extensions WordPress",
          "conseil choix de techno",
          "quelle techno projet web",
          "challenger devis agence",
          "deuxième avis site web",
        ],
    locale,
  });
}

export default async function ConseilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Web & AI tech advice" : "Conseil techno Web & IA", url: "/conseil" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name={isEn ? "Web & AI technology advice" : "Sélecteur techno web & IA"}
        description={
          isEn
            ? "Independent advice to choose between WordPress, no-code, AI coding, SaaS, Headless or custom development before building."
            : "Conseil indépendant pour choisir entre WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure avant de construire."
        }
        serviceType={isEn ? "Web consulting" : "Conseil web"}
        url="/conseil"
      />
      <FAQJsonLd
        questions={FAQ.map((item) => ({
          question: isEn ? item.en.q : item.fr.q,
          answer: isEn ? item.en.a : item.fr.a,
        }))}
      />
      <VisioConseilPage />
    </>
  );
}
