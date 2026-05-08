import { Metadata } from "next";
import HomeClient from "@/components/home-client";
import { pageMetadata } from "@/lib/metadata";
import { WebsiteJsonLd, HomepageJsonLd } from "@/components/json-ld";
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

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <HomepageJsonLd />
      <HomeClient />
    </>
  );
}
