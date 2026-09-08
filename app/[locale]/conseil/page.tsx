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
      ? "Redesign advice: a clear-cut opinion before you commit a budget"
      : "Conseil refonte : un avis tranché avant d'engager un budget",
    description: isEn
      ? "Your WordPress site is aging? A €150 advisory call or a €650 audit with roadmap: decide and secure your technical choices before committing a budget."
      : "Votre site WordPress vieillit ? Visio conseil (150 €) ou audit + roadmap (650 €) : décider et sécuriser vos choix techniques avant d'engager un budget.",
    path: "/conseil",
    keywords: isEn
      ? [
          "WordPress redesign advice",
          "website audit and roadmap",
          "WordPress site audit",
          "redesign or optimize WordPress",
          "challenge agency quote",
          "website second opinion",
        ]
      : [
          "conseil refonte WordPress",
          "audit site WordPress",
          "audit et roadmap site web",
          "refondre ou optimiser WordPress",
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
    { name: isEn ? "Redesign advice" : "Conseil refonte", url: "/conseil" },
  ];

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <ServiceJsonLd
        locale={locale}
        name={isEn ? "Website redesign advice" : "Conseil refonte de site web"}
        description={
          isEn
            ? "Independent advice before a redesign: a one-hour advisory call with a written opinion, or a full audit with costed recommendations and a roadmap."
            : "Conseil indépendant avant une refonte : visio d'une heure avec avis écrit, ou audit complet avec préconisations chiffrées et roadmap."
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
