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
      ? "Paid advisory call — WordPress themes/plugins & tech stack choice"
      : "Visio conseil payante — thèmes/plugins WordPress & choix de techno",
    description: isEn
      ? "Two paid video advisory calls: WordPress advice (which themes and plugins, well used) and tech stack advice (which technology for your web project, challenge an agency quote). Live analysis, written recap — and the price is credited to your project quote. No subscription."
      : "Deux visios conseil payantes : Conseil WordPress (quels thèmes et extensions, bien utilisés) et Conseil choix de techno (quelle technologie pour votre projet web, challenger un devis d'agence). Analyse en direct, compte-rendu écrit — et le prix est déduit de votre devis projet. Sans abonnement.",
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
    { name: isEn ? "Advisory call" : "Visio conseil", url: "/conseil" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name={isEn ? "Paid web advisory call" : "Visio conseil web payante"}
        description={
          isEn
            ? "Two on-demand paid video advisory calls: WordPress advice (themes and plugins choice and usage) and tech stack advice (which technology for a web project, agency quote review). Written recap, price credited to the project quote."
            : "Deux visios conseil payantes à la demande : Conseil WordPress (choix et usage des thèmes et extensions) et Conseil choix de techno (quelle technologie pour un projet web, relecture de devis d'agence). Compte-rendu écrit, prix déduit du devis projet."
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
