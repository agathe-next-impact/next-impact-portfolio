import DocTabs from "@/components/documentation/doc-tabs";
import PageLayout from "@/components/page-layout";
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
