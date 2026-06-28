import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/json-ld";
import MultiSubjectContactForm from "@/components/contact/multi-subject-form";
import { ContactDirectInfo } from "@/components/contact/contact-direct-info";
import { BlueprintSection } from "@/components/aspect/section";
import { WordpressExpressBanner } from "@/components/wordpress-express/wordpress-express-banner";
import { VisioConseilBanner } from "@/components/visio-conseil/visio-conseil-banner";
import { Reveal } from "@/components/ui/reveal";
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
            "AI prototype second opinion",
            "web quote review",
            "Web AI Tech Compass",
            "WordPress support",
            "project roadmap",
          ]
        : [
            "contact conseil techno web",
            "second avis prototype IA",
            "relecture devis web",
            "Boussole Techno Web IA",
            "dépannage WordPress",
            "roadmap projet web",
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

      {/* Hero */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            № 01
          </p>
          <h1 className="max-w-3xl text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {t("subtitle")}
          </p>
        </Reveal>
      </BlueprintSection>

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
      </BlueprintSection>

      {/* Pas prêt pour un projet, juste une décision à trancher → visio conseil. */}
      <VisioConseilBanner tone="obsidian" />
      {/* Besoin ponctuel WordPress plutôt qu'un projet → dépannage à la demande. */}
      <WordpressExpressBanner tone="jet" />
    </main>
  );
}
