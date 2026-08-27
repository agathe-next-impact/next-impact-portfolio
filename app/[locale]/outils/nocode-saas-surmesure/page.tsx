import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import NocodeSaasSurmesure from "@/components/outils/nocode-saas-surmesure";
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
        ? "No-code, SaaS or custom? - Build, buy or no-code"
        : "No-code, SaaS ou sur-mesure ? - Construire, acheter ou no-code",
    description:
      locale === "en"
        ? "Webflow, an off-the-shelf SaaS, or custom development? 8 criteria (specificity, budget, autonomy, data, volume, integrations) to find the right family for your tool, then the next step."
        : "Webflow, un SaaS du marché, ou du développement sur-mesure ? 8 critères (spécificité, budget, autonomie, données, volume, intégrations) pour trouver la bonne famille pour votre outil, puis la prochaine étape.",
    path: "/outils/nocode-saas-surmesure",
    keywords:
      locale === "en"
        ? [
            "no-code or custom",
            "SaaS or build",
            "build vs buy",
            "Webflow or development",
            "Airtable or custom app",
          ]
        : [
            "no-code ou sur-mesure",
            "SaaS ou développement",
            "construire ou acheter",
            "Webflow ou développement",
            "Airtable ou application sur-mesure",
          ],
    locale,
  });
}

export default async function NocodeSaasSurmesurePage({
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
      name: isEn ? "No-code, SaaS or custom" : "No-code, SaaS ou sur-mesure",
      url: "/outils/nocode-saas-surmesure",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={isEn ? "No-code, SaaS or custom?" : "No-code, SaaS ou sur-mesure ?"}
        sousTitre={
          isEn
            ? "Build, buy or no-code? 8 criteria, one recommendation among three families, and the right next step for your case."
            : "Construire, acheter ou no-code ? 8 critères, une recommandation parmi trois familles, et la bonne prochaine étape pour votre cas."
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
          <NocodeSaasSurmesure />
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
