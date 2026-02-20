import { BentoGrid } from "@/components/documentation/bento-grid";
import { DemoShowcase } from "@/components/documentation/demo-showcase";
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Comprendre — WordPress Headless & Next.js",
    description:
      "Le centre de ressources pour comprendre WordPress Headless et Next.js. " +
      "Guides techniques, tutoriels et bonnes pratiques pour développeurs et chefs de projet.",
    path: "/documentation",
    keywords: [
      "documentation WordPress Headless",
      "tutoriels Next.js",
      "guides techniques",
      "ressources développeurs",
    ],
  });
}

export default function DocumentationPage() {
  return (
    <main>
      <PageLayout
        titre="Comprendre"
        sousTitre="Le centre de ressources pour comprendre WordPress Headless et Next.js."
      >
        <div className="container mx-auto py-12">
          <BentoGrid />
          <DemoShowcase />
        </div>
      </PageLayout>
    </main>
  );
}
