import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import PageLayout from "@/components/page-layout";
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
        ? "Project diagnostic: classic, Headless, web app or custom application"
        : "Diagnostic de projet : classique, Headless, web app ou application sur-mesure",
    description:
      locale === "en"
        ? "Identify in 2 minutes the path that fits your project: classic WordPress site, Headless WordPress + Next.js site, custom web app or mobile application."
        : "Identifiez en 2 minutes la voie adaptée à votre projet : site WordPress classique, site Headless WordPress + Next.js, web app sur-mesure ou application mobile.",
    path: "/solutions-web/eligibilite",
    keywords:
      locale === "en"
        ? ["project diagnostic", "classic WordPress", "Headless WordPress Next.js", "custom web app", "mobile PWA"]
        : ["diagnostic projet", "WordPress classique", "Headless WordPress Next.js", "web app sur-mesure", "PWA mobile"],
    locale,
  });
}

export default async function EligibilityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <PageLayout
      titre={
        locale === "en"
          ? "Project diagnostic"
          : "Diagnostic de projet"
      }
      sousTitre={
        locale === "en"
          ? "An instant diagnostic to identify the right path for your project: classic WordPress site, Headless site, custom web app or mobile application."
          : "Un diagnostic immédiat pour identifier la voie adaptée à votre projet : site WordPress classique, site Headless, web app sur-mesure ou application mobile."
      }
    >
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <EligibilityForm />
        </div>
      </section>
    </PageLayout>
  );
}
