import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/json-ld";
import { ContactFunnel } from "@/components/contact/contact-funnel";
import PageLayout from "@/components/page-layout";

export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Contact — Devis WordPress Headless & Appel Découverte Gratuit",
    description:
      "Trouvez l'offre adaptée à votre structure en 4 étapes. " +
      "Association, PME ou Grand Compte : audit IA gratuit, appel visio 15 min et devis personnalisé sous 48h.",
    path: "/contact",
    image: "/img/contact-facilitation.jpg",
    keywords: [
      "contact développeur WordPress Headless",
      "devis site WordPress Headless",
      "demande de projet web",
      "rendez-vous visio freelance",
      "péréquation solidaire",
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
        titre="Trouvez votre offre"
        sousTitre="Répondez à quelques questions pour découvrir la solution adaptée à vos besoins."
      >
        <div className="mt-4 sm:mt-8 mb-6 space-y-12 md:space-y-24">
          <ContactFunnel />
        </div>
      </PageLayout>
    </main>
  );
}
