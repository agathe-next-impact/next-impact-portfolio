import { Metadata } from "next";
import HomeClient from "@/components/home-client";
import { pageMetadata } from "@/lib/metadata";
import { WebsiteJsonLd, HomepageJsonLd } from "@/components/json-ld";

// Revalidate toutes les heures
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.home();
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
