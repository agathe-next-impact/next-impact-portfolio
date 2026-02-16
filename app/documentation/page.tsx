import DocTabs from "@/components/documentation/doc-tabs";
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ressources WordPress Headless & Next.js",
    description:
      "Guides techniques, tutoriels et bonnes pratiques WordPress Headless, " +
      "Next.js et Astro. Ressources pour développeurs et chefs de projet.",
    alternates: { canonical: "/documentation" },
    openGraph: {
      title: "Ressources WordPress Headless & Next.js",
      url: "https://www.next-impact.digital/documentation",
      description:
        "Guides techniques, tutoriels et bonnes pratiques WordPress Headless, " +
        "Next.js et Astro. Ressources pour développeurs et chefs de projet.",
      type: "website",
      siteName: "Next Impact",
      images: [
        {
          url: "/img/desktop-screen-next-impact.png",
          width: 1200,
          height: 630,
          alt: "Next Impact — WordPress Headless & Next.js",
        },
      ],
    },
  };
}

export default function DocumentationPage() {
  return (
    <main>
      <PageLayout
        titre="Ressources"
        sousTitre="La documentation complète pour maîtriser WordPress, Next.js, les technologies web modernes et réussir vos projets."
      >
        <div className="container mx-auto py-12">
          <DocTabs />
        </div>
      </PageLayout>
    </main>
  );
}
