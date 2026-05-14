import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import TcoSaasVsSurMesure from "@/components/outils/tco-saas-vs-sur-mesure";
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
        ? "TCO calculator — SaaS vs custom web app over 3 years"
        : "Calculateur TCO — SaaS vs web app sur-mesure sur 3 ans",
    description:
      locale === "en"
        ? "Compare the 3-year total cost of staying on your current SaaS vs migrating to a custom web app. Includes time lost on workarounds and user growth."
        : "Comparez le coût total sur 3 ans entre rester sur votre SaaS actuel et migrer vers une web app sur-mesure. Inclut le temps perdu en contournements et la croissance utilisateur.",
    path: "/outils/tco-saas-vs-sur-mesure",
    keywords:
      locale === "en"
        ? [
            "TCO calculator",
            "SaaS vs custom",
            "SaaS migration ROI",
            "custom web app cost",
            "vendor lock-in",
          ]
        : [
            "calculateur TCO",
            "SaaS vs sur-mesure",
            "ROI migration SaaS",
            "coût web app sur-mesure",
            "vendor lock-in",
          ],
    locale,
  });
}

export default async function TcoPage({
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
      name: isEn ? "TCO calculator" : "Calculateur TCO",
      url: "/outils/tco-saas-vs-sur-mesure",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={
          isEn
            ? "TCO calculator — SaaS vs custom"
            : "Calculateur TCO — SaaS vs sur-mesure"
        }
        sousTitre={
          isEn
            ? "Compare the real 3-year cost of your current SaaS — including time lost on workarounds — vs a custom web app."
            : "Comparez le coût réel sur 3 ans de votre SaaS actuel — incluant le temps perdu en contournements — face à une web app sur-mesure."
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
            <TcoSaasVsSurMesure />
          </div>
        </section>
      </PageLayout>
    </>
  );
}
