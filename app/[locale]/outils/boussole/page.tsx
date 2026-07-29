import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import Boussole from "@/components/outils/boussole";
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
        ? "Web & AI Tech Compass - Which web tech should you choose?"
        : "Boussole Techno Web & IA - Quelle techno web choisir ?",
    description:
      locale === "en"
        ? "8 criteria to find your solution family: repair, WordPress, no-code, Headless, SaaS or custom. A neutral decision tool, then the right next step for your case."
        : "8 critères pour trouver votre famille de solution : réparer, WordPress, no-code, Headless, SaaS ou sur-mesure. Un outil de décision neutre, puis la bonne prochaine étape.",
    path: "/outils/boussole",
    keywords:
      locale === "en"
        ? [
            "which web technology",
            "WordPress or Headless",
            "no-code or custom",
            "SaaS or build",
            "web tech decision",
          ]
        : [
            "quelle techno web",
            "WordPress ou Headless",
            "no-code ou sur-mesure",
            "SaaS ou développement",
            "choix techno web",
          ],
    locale,
  });
}

export default async function BoussolePage({
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
      name: isEn ? "Tech Compass" : "Boussole Techno",
      url: "/outils/boussole",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={isEn ? "Web & AI Tech Compass" : "Boussole Techno Web & IA"}
        sousTitre={
          isEn
            ? "WordPress, no-code, Headless, SaaS or custom? Eight criteria, one recommendation — and the right next step for your case."
            : "WordPress, no-code, Headless, SaaS ou sur-mesure ? Huit critères, une recommandation — et la bonne prochaine étape pour votre cas."
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
          <Boussole />
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
