import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import PageLayout from "@/components/page-layout";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import EligibilityForm from "@/components/tarifs/EligibilityForm";
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
        ? "Which service for your site? 2-minute diagnostic"
        : "Quelle prestation pour votre site ? Diagnostic en 2 minutes",
    description:
      locale === "en"
        ? "Five questions to find the service that fits your project: Optimization, Redesign or Evolution. Price excl. VAT shown with the result."
        : "Cinq questions pour trouver la prestation adaptée à votre projet : Optimisation, Refonte ou Évolution. Le prix HT s'affiche avec le résultat.",
    path: "/solutions-web/eligibilite",
    keywords:
      locale === "en"
        ? ["website project diagnostic", "WordPress redesign", "headless WordPress", "custom web app"]
        : ["diagnostic projet site web", "refonte site WordPress", "WordPress headless", "web app sur mesure"],
    locale,
  });
}

export default async function EligibilityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <>
    <BreadcrumbJsonLd
      locale={locale}
      items={[
        { name: isEn ? "Home" : "Accueil", url: "/" },
        { name: isEn ? "Services" : "Prestations", url: "/solutions-web" },
        { name: isEn ? "Project diagnostic" : "Diagnostic de projet", url: "/solutions-web/eligibilite" },
      ]}
    />
    <PageLayout
      titre={
        locale === "en"
          ? "Project diagnostic"
          : "Diagnostic de projet"
      }
      sousTitre={
        locale === "en"
          ? "Five questions to find the service that fits your project: Optimization, Redesign or Evolution, with its price excl. VAT."
          : "Cinq questions pour trouver la prestation adaptée à votre projet : Optimisation, Refonte ou Évolution, avec son prix HT."
      }
    >
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <EligibilityForm />
        </div>
      </section>
    </PageLayout>
    </>
  );
}
