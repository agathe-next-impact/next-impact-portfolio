import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/json-ld";
import EligibilityForm from "@/components/tarifs/EligibilityForm";
import { ContactDirectInfo } from "@/components/contact/contact-direct-info";
import PageLayout from "@/components/page-layout";

export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Contact — Devis WordPress Headless & Appel Découverte Gratuit",
    description:
      "Identifiez la stack adaptée à votre projet en 4 étapes : WordPress monolithique optimisé, hybride Astro ou Next.js complet. " +
      "Audit IA gratuit, appel visio 15 min et devis personnalisé sous 48h.",
    path: "/contact",
    image: "/img/contact-facilitation.jpg",
    keywords: [
      "contact développeur WordPress Headless",
      "devis site WordPress Headless",
      "demande de projet web",
      "rendez-vous visio freelance",
      "diagnostic stack WordPress",
      "audit site gratuit",
      "appel découverte",
      "tarif site Next.js",
    ],
  });
}

export default function ContactPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Contact", url: "/contact" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ContactPageJsonLd />
      <PageLayout
        titre="Choisissez votre stack"
        sousTitre="Répondez à quelques questions pour identifier la stack WordPress adaptée à votre projet."
      >
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto space-y-12">
            <EligibilityForm />
            <ContactDirectInfo />
          </div>
        </section>
      </PageLayout>
    </main>
  );
}
