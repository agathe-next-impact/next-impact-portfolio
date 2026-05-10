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
        ? "WordPress stack diagnostic — Essential Presence, Accelerated Growth or Custom Platform"
        : "Diagnostic de stack WordPress — Présence Essentielle, Croissance Accélérée ou Plateforme Sur-Mesure",
    description:
      locale === "en"
        ? "Identify in 2 minutes the WordPress stack that fits your project: optimized monolithic, hybrid Astro or full Next.js."
        : "Identifiez en 2 minutes la stack WordPress adaptée à votre projet : monolithique optimisée, hybride Astro ou Next.js complète.",
    path: "/services/eligibilite",
    keywords:
      locale === "en"
        ? ["stack diagnostic", "monolithic WordPress", "WordPress Astro", "WordPress Next.js", "WordPress modernization"]
        : ["diagnostic stack", "WordPress monolithique", "WordPress Astro", "WordPress Next.js", "modernisation WordPress"],
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
          ? "WordPress stack diagnostic"
          : "Diagnostic de stack WordPress"
      }
      sousTitre={
        locale === "en"
          ? "An instant diagnostic to identify the stack — Essential Presence, Accelerated Growth or Custom Platform — that fits your project best."
          : "Un diagnostic immédiat pour identifier la stack — Présence Essentielle, Croissance Accélérée ou Plateforme Sur-Mesure — la plus adaptée à votre projet."
      }
    >
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <EligibilityForm />
        </div>
      </section>
    </PageLayout>
  );
}
