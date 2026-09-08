import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import PrototypeIa from "@/components/outils/prototype-ia";
import PageLayout from "@/components/page-layout";
import { BlueprintSection } from "@/components/aspect/section";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title:
      locale === "en"
        ? "AI prototype: throwaway or maintainable? - Should you build it?"
        : "Prototype IA : jetable ou maintenable ? - Faut-il le construire ?",
    description:
      locale === "en"
        ? "Will your AI-generated prototype hold up in production? 9 checks on users, data, security and lifespan: keep iterating, scope it, or rebuild it."
        : "Un prototype généré par IA tiendra-t-il en production ? 9 vérifications sur les utilisateurs, les données, la sécurité et la durée de vie. Verdict immédiat.",
    path: "/outils/prototype-ia",
    keywords:
      locale === "en"
        ? [
            "AI prototype to production",
            "vibe coding risks",
            "is my AI app maintainable",
            "prototype or product",
            "AI generated code production",
          ]
        : [
            "prototype IA en production",
            "risques du vibe coding",
            "prototype ou produit",
            "code généré par IA",
            "cadrer un projet IA",
          ],
    locale,
  });
}

export default async function PrototypeIaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Tools" : "Outils", url: "/outils" },
    {
      name: isEn ? "AI prototype" : "Prototype IA",
      url: "/outils/prototype-ia",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <PageLayout
        titre={isEn ? "AI prototype: throwaway or maintainable?" : "Prototype IA : jetable ou maintenable ?"}
        sousTitre={
          isEn
            ? "AI can code fast, but should you build? 9 checks and a clear signal: keep the prototype, scope it, or rebuild it for production."
            : "L'IA code vite, mais faut-il construire ? 9 vérifications et un signal clair : garder le prototype, le cadrer, ou le reconstruire pour la production."
        }
      >
        <BlueprintSection
          tone="obsidian"
          innerClassName="px-6 py-12 lg:px-8 lg:py-16"
        >
          <Link
            href="/outils"
            className="group mb-10 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray transition-colors hover:text-accent-secondary"
          >
            <ArrowLeft
              size={12}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            {isEn ? "Back to tools" : "Retour aux outils"}
          </Link>
          <PrototypeIa />
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
