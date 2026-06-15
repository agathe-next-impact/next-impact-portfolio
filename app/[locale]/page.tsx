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
            ? "WordPress modernization & Next.js development"
            : "Modernisation de sites WordPress & développement Next.js"
        }
        description={
          isEn
            ? "Modernizing ageing WordPress sites and building custom Next.js applications: optimized WordPress, Headless WordPress + Next.js, web apps and PWAs. Fixed budget and timeline from the start."
            : "Modernisation de sites WordPress vieillissants et développement d'applications Next.js sur-mesure : WordPress optimisé, Headless WordPress + Next.js, web app et PWA. Budget et délai fixés dès le départ."
        }
        serviceType={isEn ? "Web development" : "Développement web"}
        url="/services"
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
