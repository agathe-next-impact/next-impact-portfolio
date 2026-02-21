import PageLayout from "@/components/page-layout";
import CahierDesChargesForm from "@/components/cahier-des-charges/cahier-des-charges-form-wrapper"
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/json-ld";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Générateur de cahier des charges",
    description:
      "Remplissez le formulaire pour obtenir votre cahier des charges complet et personnalisé. " +
      "Outil gratuit pour structurer votre projet de site web.",
    path: "/cahier-des-charges",
    keywords: [
      "cahier des charges",
      "projet site web",
      "spécifications",
      "brief projet",
    ],
  });
}

export default function Home() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/outils" },
    { name: "Cahier des charges", url: "/cahier-des-charges" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <WebApplicationJsonLd
        name="Générateur de cahier des charges"
        description="Créez votre cahier des charges complet et personnalisé. Outil gratuit pour structurer votre projet de site web."
        url="/cahier-des-charges"
        applicationCategory="BusinessApplication"
      />
      <PageLayout
        titre="Générateur de cahier des charges"
        sousTitre="Remplissez le formulaire pour obtenir votre cahier des charges complet et personnalisé."
      >
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <Link
              href="/outils"
              className="inline-flex items-center gap-1.5 text-sm text-extralightblue/60 hover:text-white transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux outils
            </Link>
            <CahierDesChargesForm />
          </div>
        </section>
      </PageLayout>
    </>
  )
}
