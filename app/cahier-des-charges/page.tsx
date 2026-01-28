import PageLayout from "@/components/page-layout";
import CahierDesChargesForm from "@/components/cahier-des-charges/cahier-des-charges-form-wrapper"
import { Metadata } from "next";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Générateur de cahier des charges de projet de site web | Next Impact",
    description: "Générateur de cahier des charges pour votre projet de site web. Remplissez le formulaire pour obtenir un document complet et personnalisé.",
    openGraph: {
      title: "Générateur de cahier des charges de projet de site web | Next Impact",
      url: "https://next-impact.digital/cahier-des-charges",
      description: "Générateur de cahier des charges pour votre projet de site web. Remplissez le formulaire pour obtenir un document complet et personnalisé.",
      type: "website",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      images: [
        {
          url: "/img/avatar.png",
          width: 1200,
          height: 630,
          alt: "Next Impact - Développeuse WordPress Freelance",
        },
      ],
    },
  };
}

export default function Home() {
  return (
    <main>
      <PageLayout
        titre="Générateur de cahier des charges"
        sousTitre="Remplissez le formulaire pour obtenir votre cahier des charges complet."
      >
      <div className="mt-8">
      <CahierDesChargesForm />
      </div>
      </PageLayout>
    </main>
  )
}
