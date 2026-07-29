import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import AuditPwa from "@/components/outils/audit-pwa";
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
        ? "PWA opportunity diagnostic - Should you build one?"
        : "Diagnostic d'opportunité PWA - Faut-il en créer une ?",
    description:
      locale === "en"
        ? "9 strategic questions to evaluate whether an installable PWA is relevant for your project: mobile usage, offline needs, store dependency, native complexity and technical baseline."
        : "9 questions de cadrage pour évaluer si une PWA installable est pertinente pour votre projet : usage mobile, hors-ligne, dépendance aux stores, complexité native et socle technique.",
    path: "/outils/audit-pwa",
    keywords:
      locale === "en"
        ? [
            "PWA opportunity",
            "Progressive Web App diagnostic",
            "PWA or native app",
            "mobile app strategy",
            "PWA business case",
          ]
        : [
            "opportunité PWA",
            "diagnostic Progressive Web App",
            "PWA ou application native",
            "stratégie application mobile",
            "business case PWA",
          ],
    locale,
  });
}

export default async function AuditPwaPage({
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
      name: isEn ? "PWA opportunity" : "Opportunité PWA",
      url: "/outils/audit-pwa",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={
          isEn
            ? "PWA opportunity diagnostic"
            : "Diagnostic d'opportunité PWA"
        }
        sousTitre={
          isEn
            ? "Should your project become an installable mobile app? 9 questions, an opportunity score and a decision signal."
            : "Votre projet gagnerait-il à devenir une app mobile installable ? 9 questions, un score d'opportunité et un signal de décision."
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
          <AuditPwa />
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
