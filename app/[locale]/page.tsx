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

  return (
    <>
      <WebsiteJsonLd />
      <HomepageJsonLd />
      <BreadcrumbJsonLd items={[{ name: isEn ? "Home" : "Accueil", url: "/" }]} />
      <ServiceJsonLd
        name={
          isEn
            ? "WordPress site redesign"
            : "Refonte de site WordPress"
        }
        description={
          isEn
            ? "An aging WordPress site made fast and modern again without rebuilding everything: optimized, headless or web app redesign, at a fixed price, in 6 to 10 weeks, performance measured before and after."
            : "Un site WordPress qui vieillit redevient rapide et moderne sans tout reconstruire : refonte optimisée, headless ou web app, en forfait, en 6 à 10 semaines, performance mesurée avant et après."
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
      <HomeClient />
    </>
  );
}
