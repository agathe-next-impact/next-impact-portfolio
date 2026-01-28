import DocTabs from "@/components/documentation/doc-tabs";
import { Metadata } from "next";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "Ressources de création de sites web WordPress & Headless | Next Impact",
    description:
      "Explorez notre documentation complète pour maîtriser WordPress, Next.js et les technologies web modernes. Des guides pratiques aux tutoriels avancés, trouvez tout ce dont vous avez besoin pour réussir vos projets.",
    openGraph: {
      title: "Ressources WordPress & Headless | Next Impact",
      url: "https://next-impact.digital",
      description:
        "Explorez notre documentation complète pour maîtriser WordPress, Next.js et les technologies web modernes. Des guides pratiques aux tutoriels avancés, trouvez tout ce dont vous avez besoin pour réussir vos projets.",
      type: "website",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      images: [
        {
          url: "/img/avatar.webp",
          width: 1200,
          height: 630,
          alt: "Next Impact - Développeuse WordPress Freelance",
        },
      ],
    },
  };
}

export default function DocumentationPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:py-16 pt-16 text-center">
        <h1 className="text-5xl md:text-6xl tracking-tight mt-12 mb-6">
          Ressources
        </h1>
        <p className="text-xl text-regularblue/80 max-w-3xl mx-auto">
          Explorez notre documentation complète pour maîtriser WordPress,
          Next.js et les technologies web modernes. Des guides pratiques aux
          tutoriels avancés, trouvez tout ce dont vous avez besoin pour réussir
          vos projets.
        </p>
        <div className="container mx-auto py-12">
          <DocTabs />
        </div>
      </section>
    </main>
  );
}
