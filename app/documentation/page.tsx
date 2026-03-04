import { BentoGrid } from "@/components/documentation/bento-grid";
import { DemoShowcase } from "@/components/documentation/demo-showcase";
import { AllCategoriesGrid } from "@/components/documentation/cross-category-nav";
import { DocumentationToolsSection } from "@/components/documentation/documentation-internal-links";
import { AuditContextualBanner } from "@/components/documentation/audit-contextual-banner";
import PageLayout from "@/components/page-layout";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";

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

const documentationCategories = [
  { name: "Marketing Digital", url: "/documentation/marketing-digital", description: "Principes et concepts de base du marketing digital." },
  { name: "SEO", url: "/documentation/seo", description: "Guides et ressources pour maîtriser le SEO de votre site." },
  { name: "Design & UI/UX", url: "/documentation/design-ui-ux", description: "Expériences utilisateurs engageantes et accessibles." },
  { name: "Projet de site web", url: "/documentation/projet-site-web", description: "Préparer et mener un projet de site web de A à Z." },
  { name: "WordPress", url: "/documentation/wordpress", description: "Bonnes pratiques et guides pour WordPress." },
  { name: "Headless CMS", url: "/documentation/headless-cms", description: "Architecture headless, API REST et découplage front/back." },
  { name: "Blog", url: "/documentation/blog", description: "Actualités et analyses sur le développement web." },
];

export default function DocumentationPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Comprendre", url: "/documentation" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name="Comprendre — WordPress Headless & Next.js"
        description="Le centre de ressources pour comprendre WordPress Headless et Next.js. Guides techniques, tutoriels et bonnes pratiques."
        url="/documentation"
        items={documentationCategories}
      />
      <PageLayout
        titre="Comprendre"
        sousTitre="Le centre de ressources pour comprendre WordPress Headless et Next.js."
      >
        <div className="container mx-auto py-12">
          <BentoGrid />
          <AuditContextualBanner />
          <AllCategoriesGrid />
          <DocumentationToolsSection />
          <DemoShowcase />
        </div>
      </PageLayout>
    </main>
  );
}
