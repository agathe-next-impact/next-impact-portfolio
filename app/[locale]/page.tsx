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
            ? "Web technology advice in the age of AI"
            : "Conseil techno web à l'heure de l'IA"
        }
        description={
          isEn
            ? "Independent advice to choose the right web technology now that AI can code fast — WordPress, no-code, AI coding, SaaS, Headless or custom — then implementation only when it is the right choice. Fixed budget and timeline from the start."
            : "Conseil indépendant pour choisir la bonne techno web à l'heure où l'IA peut coder vite — WordPress, no-code, IA coding, SaaS, Headless ou sur-mesure — puis mise en œuvre seulement quand c'est le bon choix. Budget et délai fixés dès le départ."
        }
        serviceType={isEn ? "Web consulting and development" : "Conseil et développement web"}
        url="/conseil"
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
