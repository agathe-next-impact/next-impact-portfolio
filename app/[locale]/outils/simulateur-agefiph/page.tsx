import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import SimulateurAgefiph from "@/components/simulateur-agefiph";
import PageLayout from "@/components/page-layout";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title:
      locale === "en"
        ? "AGEFIPH simulator — Calculate your TIH deduction"
        : "Simulateur AGEFIPH — Calculez votre déduction TIH",
    description:
      locale === "en"
        ? "Estimate the 30% AGEFIPH deduction applicable to your web project (site, web app or mobile app) by subcontracting to a TIH-certified developer."
        : "Estimez la déduction AGEFIPH de 30 % applicable à votre projet web (site, web app ou app mobile) en sous-traitant à un développeur TIH.",
    path: "/outils/simulateur-agefiph",
    keywords:
      locale === "en"
        ? [
            "AGEFIPH simulator",
            "OETH calculator",
            "TIH deduction",
            "AGEFIPH contribution reduction",
            "disability employment",
          ]
        : [
            "simulateur AGEFIPH",
            "calculateur OETH",
            "déduction TIH",
            "réduction contribution AGEFIPH",
            "obligation emploi handicap",
          ],
    locale,
  });
}

export default async function SimulateurAgefiphPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Tools" : "Outils", url: "/outils" },
    {
      name: isEn ? "AGEFIPH simulator" : "Simulateur AGEFIPH",
      url: "/outils/simulateur-agefiph",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={
          isEn
            ? "AGEFIPH simulator — TIH deduction"
            : "Simulateur AGEFIPH — Déduction TIH"
        }
        sousTitre={
          isEn
            ? "Estimate the 30% labor-cost deduction applicable to your web project. Works for websites, Headless platforms, custom web apps and mobile applications."
            : "Estimez la déduction de 30 % du coût main-d'œuvre applicable à votre projet web. Valable pour les sites, plateformes Headless, web apps sur-mesure et applications mobiles."
        }
      >
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <Link
              href="/outils"
              className="inline-flex items-center gap-1.5 text-sm text-extralightblue/60 hover:text-white transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {isEn ? "Back to tools" : "Retour aux outils"}
            </Link>
            <SimulateurAgefiph />
            <div className="mt-12 max-w-3xl mx-auto text-center">
              <p className="text-white/60 font-googletexte text-sm">
                {isEn ? (
                  <>
                    Want more context on the OETH benefit?{" "}
                    <Link href="/avantage-oeth" className="text-lightyellow hover:text-lightyellow/80 underline">
                      Read the full OETH page
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Vous voulez plus de contexte sur l'avantage OETH ?{" "}
                    <Link href="/avantage-oeth" className="text-lightyellow hover:text-lightyellow/80 underline">
                      Consultez la page OETH complète
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
