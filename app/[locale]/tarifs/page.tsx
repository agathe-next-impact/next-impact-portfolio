import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/aspect/page-hero";
import { Separator } from "@/components/aspect/section";
import { TarifsMoments } from "@/components/tarifs/tarifs-moments";
import type { Locale } from "@/i18n/routing";

// ─────────────────────────────────────────────────────────────────────────────
// /tarifs : la seule page qui montre à la fois les packs et le catalogue (charte
// v1.6, ADR-014). D'abord les sept packs, par besoin, avec leur budget ; ensuite
// les sept lignes du catalogue et leurs paliers, par moment (ADR-013). Jusqu'au
// 2026-09-27 cette URL redirigeait vers /solutions-web. Les prix sont lus dans
// leurs sources (voir TarifsMoments).
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
    // La page affiche les packs puis le catalogue : la description dit les
    // deux, dans cet ordre. Aucun prix ici : ils sont sur la page.
    description: isEn
      ? "Every price on one page: the budget of each path, by situation, then the catalogue: advice, three services, care and maintenance, technical expert."
      : "Tous les tarifs sur une page : le budget de chaque parcours, par situation, puis le catalogue : conseil, trois prestations, suivi et maintenance, expert technique.",
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
        index="№ 01"
        kicker="Tarifs"
        title={
          <>
            Tous les prix, <em className="font-normal not-italic text-accent-secondary">avant tout rendez-vous</em>.
          </>
        }
        description="Chaque offre, chaque palier, rangés en trois moments : diagnostiquer, faire évoluer, gérer. Prix hors taxes, écrits avant de commencer."
      />
      <Separator />
      <TarifsMoments />
    </main>
  );
}
