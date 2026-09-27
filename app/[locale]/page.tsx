import { Metadata } from "next";
import HomeClient from "@/components/home-client";
import { pageMetadata } from "@/lib/metadata";
import {
  WebsiteJsonLd,
  HomepageJsonLd,
  BreadcrumbJsonLd,
  ServiceJsonLd,
  FAQJsonLd,
} from "@/components/json-ld";
import { getHomeContent } from "@/lib/home-content";
import { getAllSlugs } from "@/lib/case-studies-data";
import { TRAJECTOIRES, TRAJECTOIRE_ORDER } from "@/lib/trajectoires";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les heures
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata.home(locale);
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const { faq } = getHomeContent(locale);
  // Nombre d'études de cas publiées, pour la bande de preuve sous le héros :
  // lu dans la source, jamais écrit en dur.
  const documented = getAllSlugs().length;

  // Les trois prestations sous leur seul nom, lu dans lib/trajectoires.ts
  // (charte v1.6, ADR-014) : « Optimisation, Refonte ou Évolution ».
  const names = TRAJECTOIRE_ORDER.map((slug) => TRAJECTOIRES[slug].name[isEn ? "en" : "fr"]);
  const prestations = `${names.slice(0, -1).join(", ")} ${isEn ? "or" : "ou"} ${names.at(-1)}`;

  return (
    <>
      <WebsiteJsonLd />
      <HomepageJsonLd locale={locale} />
      <BreadcrumbJsonLd locale={locale} items={[{ name: isEn ? "Home" : "Accueil", url: "/" }]} />
      <ServiceJsonLd
        locale={locale}
        name={
          isEn
            ? "WordPress site redesign"
            : "Refonte de site WordPress"
        }
        description={
          isEn
            ? `An aging WordPress site made fast and modern again without rebuilding everything. Three services at a fixed price, ${prestations}, in 6 to 10 weeks, performance measured before and after, with a technical and strategic watch at every step.`
            : `Un site WordPress qui vieillit redevient rapide et moderne sans tout reconstruire. Trois prestations au forfait, ${prestations}, en 6 à 10 semaines, performance mesurée avant et après, avec une veille technique et stratégique à chaque étape.`
        }
        serviceType={isEn ? "Web consulting and development" : "Conseil et développement web"}
        url="/solutions-web"
      />
      <FAQJsonLd
        questions={faq.items.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />
      <HomeClient documented={documented} />
    </>
  );
}
