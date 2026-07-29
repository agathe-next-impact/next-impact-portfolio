import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import DecrypteurDevis from "@/components/outils/decrypteur-devis";
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
        ? "Web quote decoder - Is this quote any good?"
        : "Décrypteur de devis web - Ce devis est-il bon ?",
    description:
      locale === "en"
        ? "9 checks to read a website quote: code ownership, hosting, lock-in, vague items, recurring costs, right-sizing. Get a health score and the questions to ask before signing."
        : "9 vérifications pour lire un devis web : propriété du code, hébergement, dépendance, postes flous, coûts récurrents, surdimensionnement. Un score de santé et les questions à poser avant de signer.",
    path: "/outils/decrypteur-devis",
    keywords:
      locale === "en"
        ? [
            "read a web quote",
            "website quote review",
            "questions before signing",
            "second opinion quote",
            "web project budget",
          ]
        : [
            "lire un devis web",
            "analyser un devis site internet",
            "questions avant de signer",
            "second avis devis",
            "budget projet web",
          ],
    locale,
  });
}

export default async function DecrypteurDevisPage({
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
      name: isEn ? "Quote decoder" : "Décrypteur de devis",
      url: "/outils/decrypteur-devis",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={isEn ? "Web quote decoder" : "Décrypteur de devis web"}
        sousTitre={
          isEn
            ? "Received a quote for a website or web tool? 9 checks, a health score and the right questions to ask before you sign."
            : "Vous avez reçu un devis pour un site ou un outil web ? 9 vérifications, un score de santé et les bonnes questions à poser avant de signer."
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
          <DecrypteurDevis />
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
