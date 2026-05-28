import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/json-ld";
import MultiSubjectContactForm from "@/components/contact/multi-subject-form";
import { ContactDirectInfo } from "@/components/contact/contact-direct-info";
import PageLayout from "@/components/page-layout";
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
            "contact freelance developer",
            "website quote",
            "web app quote",
            "web project request",
            "freelance video call",
            "project diagnostic",
            "free site audit",
            "discovery call",
            "Next.js pricing",
          ]
        : [
            "contact développeur freelance",
            "devis site web",
            "devis application web",
            "demande de projet web",
            "rendez-vous visio freelance",
            "diagnostic projet web",
            "audit site gratuit",
            "appel découverte",
            "tarif site Next.js",
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
      <PageLayout titre={t("title")} sousTitre={t("subtitle")}>
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "start" }}>
            <MultiSubjectContactForm />
            <ContactDirectInfo />
          </div>
        </section>
      </PageLayout>
    </main>
  );
}
