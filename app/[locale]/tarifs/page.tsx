import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/aspect/page-hero";
import { Separator } from "@/components/aspect/section";
import { TarifsMoments } from "@/components/tarifs/tarifs-moments";
import type { Locale } from "@/i18n/routing";

// ─────────────────────────────────────────────────────────────────────────────
// /tarifs — récapitulatif de toutes les offres et de leurs paliers, par moment
// (charte v1.4, ADR-012). Jusqu'au 2026-09-27 cette URL redirigeait vers
// /solutions-web ; elle redevient une page, la seule qui liste le catalogue
// entier. Les prix sont lus dans leurs sources (voir TarifsMoments).
// Contenu FR uniquement (locale EN en noindex).
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    title: isEn
      ? "Prices: advice, redesign and ongoing care"
      : "Tarifs : conseil, refonte et suivi de votre site",
    description: isEn
      ? "All Next Impact prices in one page: advisory call and audit, three redesign packages, then watch, maintenance and technical leadership."
      : "Tous les tarifs sur une page : visio conseil et audit, trois forfaits de refonte, puis veille, maintenance et direction technique. Prix affichés, paliers compris.",
    path: "/tarifs",
    keywords: isEn
      ? ["website redesign prices", "WordPress maintenance price"]
      : ["tarif refonte site WordPress", "prix refonte site internet", "tarif maintenance WordPress", "prix site headless"],
    locale,
    noindex: isEn,
    alternateLocales: ["fr"],
  });
}

export default async function TarifsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <main>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: isEn ? "Home" : "Accueil", url: "/" },
          { name: isEn ? "Prices" : "Tarifs", url: "/tarifs" },
        ]}
      />
      <PageHero
        index="№ 00"
        kicker="Tarifs"
        title={
          <>
            Tous les prix, <em className="font-normal not-italic text-accent-secondary">avant tout rendez-vous</em>.
          </>
        }
        description="Chaque offre, chaque palier, rangés en trois moments : décider, refaire, tenir. Prix hors taxes, écrits avant de commencer."
      />
      <Separator />
      <TarifsMoments />
    </main>
  );
}
