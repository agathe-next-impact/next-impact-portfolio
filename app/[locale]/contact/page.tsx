import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/json-ld";
import MultiSubjectContactForm from "@/components/contact/multi-subject-form";
import { ContactDirectInfo } from "@/components/contact/contact-direct-info";
import { BlueprintSection } from "@/components/aspect/section";
import { PageHero } from "@/components/aspect/page-hero";
import { VisioConseilBanner } from "@/components/visio-conseil/visio-conseil-banner";
import { Reveal } from "@/components/ui/reveal";
import { SignalPaths } from "@/components/visuals/signal-paths";
import type { Locale } from "@/i18n/routing";

export const revalidate = 21600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/contact",
    image: "/img/contact-facilitation.jpg",
    keywords:
      locale === "en"
        ? [
            "contact web technology advice",
            "redesign advisory call",
            "website audit and roadmap",
            "WordPress redesign contact",
            "free website diagnostic",
          ]
        : [
            "contact conseil techno web",
            "visio conseil refonte",
            "audit et roadmap site web",
            "contact refonte WordPress",
            "diagnostic gratuit site web",
          ],
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbContact"), url: "/contact" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ContactPageJsonLd />

      {/* Hero (harmonisé /veille) */}
      <PageHero
        index="№ 01"
        kicker={t("breadcrumbContact")}
        title={t("title")}
        description={t("subtitle")}
        backdrop={
          <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-30">
            <SignalPaths />
          </div>
        }
      />

      {/* Form + direct info */}
      <BlueprintSection tone="obsidian">
        <div className="grid border-t border-dark-gray lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <MultiSubjectContactForm />
          </Reveal>
          <Reveal delay={0.08} className="border-t border-dark-gray lg:border-l lg:border-t-0">
            <ContactDirectInfo />
          </Reveal>
        </div>
        {/* Réassurance au moment de l'engagement : un verbatim client court,
            orienté conseil (source : recommandation LinkedIn, Senza Nature). */}
        <div className="border-t border-dark-gray px-6 py-6 lg:px-8">
          <blockquote className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-inter-tight text-sm italic leading-relaxed text-mid-gray">
              {locale === "en"
                ? "“Highly professional, fast and a great teacher — and excellent advice too! Our site is in good hands.”"
                : "« Très pro, rapide et pédagogue, elle est aussi de très bon conseil ! Notre site est entre de bonnes mains. »"}
            </p>
            <footer className="font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
              — Laura Schorestene, {locale === "en" ? "Founder, Senza Nature" : "Fondatrice, Senza Nature"}
            </footer>
          </blockquote>
        </div>
      </BlueprintSection>

      {/* Pas prêt pour un projet, juste une décision à trancher → visio conseil. */}
      <VisioConseilBanner tone="obsidian" />
    </main>
  );
}
