import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import EstimateurBudget from "@/components/outils/estimateur-budget";
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
        ? "Budget & timeline estimator — Web project quote in 60 seconds"
        : "Estimateur budget & délai — Devis projet web en 60 secondes",
    description:
      locale === "en"
        ? "Get an indicative budget range and lead time for your web project: classic WordPress, Headless site, custom web app or mobile PWA. Estimate based on real Next Impact projects."
        : "Obtenez une fourchette de budget et un délai indicatif pour votre projet web : WordPress classique, site Headless, web app sur-mesure ou PWA mobile. Estimation basée sur les projets réels Next Impact.",
    path: "/outils/estimateur-budget",
    keywords:
      locale === "en"
        ? [
            "budget estimator",
            "web project cost",
            "Next.js web app pricing",
            "Headless WordPress quote",
            "PWA estimate",
          ]
        : [
            "estimateur budget",
            "coût projet web",
            "tarif web app Next.js",
            "devis WordPress Headless",
            "estimation PWA",
          ],
    locale,
  });
}

export default async function EstimateurBudgetPage({
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
      name: isEn ? "Budget estimator" : "Estimateur budget",
      url: "/outils/estimateur-budget",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={
          isEn
            ? "Budget & timeline estimator"
            : "Estimateur budget & délai"
        }
        sousTitre={
          isEn
            ? "Get a realistic budget and lead time for your web project in 60 seconds. Site, web app, mobile PWA — all covered."
            : "Obtenez en 60 secondes une fourchette de budget et un délai réaliste pour votre projet web. Site, web app, PWA mobile — toutes les voies couvertes."
        }
      >
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <Link
              href="/outils"
              className="inline-flex items-center gap-1.5 text-sm text-extralightblue/60 hover:text-white transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {isEn ? "Back to tools" : "Retour aux outils"}
            </Link>
            <EstimateurBudget />
          </div>
        </section>
      </PageLayout>
    </>
  );
}
