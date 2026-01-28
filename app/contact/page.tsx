
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import { MagicCard } from "@/components/magicui/magic-card";
import { Metadata } from "next";
import { CDCCard } from "@/components/tools";

// Revalidate toutes les 6 heures
export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact | Next Impact",
    description: "Contactez-moi pour discuter de votre projet web WordPress. Prise de rendez-vous et formulaire de contact disponibles.",
    openGraph: {
      title: "Contact | Next Impact",
      url: "https://next-impact.digital/contact",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      description: "Contactez-moi pour discuter de votre projet web WordPress. Prise de rendez-vous et formulaire de contact disponibles.",
      type: "website",
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

export default function ContactPage() {
  return (
    <section className="lg:w-4/6 w-full container mx-auto px-4 md:py-16 pt-16 text-center">
          <h1 className="text-5xl md:text-6xl tracking-tight mt-12 mb-6">
                Contact</h1>

      <p className="my-4 text-lg text-center">
        Vous avez une idée, un projet ou une refonte en tête&nbsp;? Parlons-en.
      </p>

      <div className="mt-24 space-y-12 rounded-2xl">
        <MagicCard className="rounded-2xl">
        <div className="flex flex-col gap-4 border p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold text-regularblue mb-2">Prendre un rendez-vous</h2>
          <p className="mb-4">
            Réservez un créneau directement dans mon agenda pour discuter de votre projet.
          </p>
          <Link
            href="https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress"
            target="_blank"
            rel="noopener noreferrer"
            className="w-max mx-auto gap-1 rounded-full px-6 py-2 text-white bg-regularblue hover:text-white hover:bg-regularblue/80 transition-all duration-900 ease-in-out"
          >
            Réserver un appel découverte
          </Link>
        </div>
        </MagicCard>

        <MagicCard className="rounded-2xl">
          <ContactForm />
        </MagicCard>
      </div>

      <div className="mt-12 text-sm text-mediumblue text-center">
        <p>Basée en France - Disponible à distance</p>
        <p>Freelance WordPress, Next.js</p>
        <p className="pt-4 "><a href="mailto:agathe@next-impact.digital" className="text-medium font-googletitre text-lg">agathe@next-impact.digital</a></p>
      </div>
    </section>
  );
}
