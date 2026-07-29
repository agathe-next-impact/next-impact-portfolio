import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import ReparerOuRefaire from "@/components/outils/reparer-ou-refaire";
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
        ? "Repair or rebuild? - Is your site at the end of the road?"
        : "Réparer ou refaire ? - Votre site est-il en bout de course ?",
    description:
      locale === "en"
        ? "9 checks to know whether to repair, optimize or rebuild your WordPress site: age, technical base, plugins, bugs, performance, evolution needs. A health score and a clear decision signal."
        : "9 vérifications pour savoir s'il faut réparer, optimiser ou refondre votre site WordPress : âge, socle technique, extensions, bugs, performance, besoins d'évolution. Un score de santé et un signal de décision clair.",
    path: "/outils/reparer-ou-refaire",
    keywords:
      locale === "en"
        ? [
            "repair or rebuild website",
            "WordPress end of life",
            "should I redo my site",
            "optimize or rebuild",
            "website redesign decision",
          ]
        : [
            "réparer ou refaire son site",
            "WordPress bout de course",
            "faut-il refaire son site",
            "optimiser ou refondre",
            "décision refonte site",
          ],
    locale,
  });
}

export default async function ReparerOuRefairePage({
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
      name: isEn ? "Repair or rebuild" : "Réparer ou refaire",
      url: "/outils/reparer-ou-refaire",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={isEn ? "Repair or rebuild?" : "Réparer ou refaire ?"}
        sousTitre={
          isEn
            ? "Is your site at the end of the road? 9 checks, a health score and a clear signal: repair, optimize or rebuild."
            : "Votre site est-il en bout de course ? 9 vérifications, un score de santé et un signal clair : réparer, optimiser ou refondre."
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
          <ReparerOuRefaire />
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
