import WebsiteAuditTool from "@/components/audit/website-audit-tool-wrapper"
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Audit de site web",
    description:
      "Analysez l'efficacité de votre site web : performance, SEO, contenu et optimisation de la conversion. " +
      "Audit gratuit et recommandations personnalisées.",
    path: "/audit",
    keywords: [
      "audit site web",
      "performance web",
      "SEO",
      "optimisation conversion",
      "Core Web Vitals",
    ],
  });
}

export default function Home() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Audit de site web", url: "/audit" },
  ];

  return (
    <main className="flex-1">
      <BreadcrumbJsonLd items={breadcrumbItems} />
        <section className="w-full pt-4 md:pt-8 lg:pt-12 xl:pt-12">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center space-y-4 py-8">
            <h1>
              Audit de site web
            </h1>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto">
        <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
          Analysez l&apos;efficacité de votre site web : performance, SEO, contenu et optimisation de la conversion.
        </p>
        <WebsiteAuditTool />
      </div>
    </main>
  )
}

