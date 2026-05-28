import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import AuditPwa from "@/components/outils/audit-pwa";
import PageLayout from "@/components/page-layout";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title:
      locale === "en"
        ? "PWA / mobile readiness audit — Is your site ready?"
        : "Audit PWA / mobile readiness — Votre site est-il prêt ?",
    description:
      locale === "en"
        ? "9-criteria self-assessment to know if your site is ready to become an installable Progressive Web App. HTTPS, manifest, service worker, mobile performance, touch UX."
        : "Auto-évaluation en 9 critères pour savoir si votre site est prêt à devenir une PWA installable. HTTPS, manifest, service worker, performance mobile, UX tactile.",
    path: "/outils/audit-pwa",
    keywords:
      locale === "en"
        ? [
            "PWA audit",
            "mobile readiness",
            "Progressive Web App test",
            "PWA checklist",
            "PWA install",
          ]
        : [
            "audit PWA",
            "mobile readiness",
            "test Progressive Web App",
            "checklist PWA",
            "installer PWA",
          ],
    locale,
  });
}

export default async function AuditPwaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "Tools" : "Outils", url: "/outils" },
    {
      name: isEn ? "PWA audit" : "Audit PWA",
      url: "/outils/audit-pwa",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PageLayout
        titre={
          isEn
            ? "PWA / mobile readiness audit"
            : "Audit PWA / mobile readiness"
        }
        sousTitre={
          isEn
            ? "Is your site ready to become an installable mobile app? 9 questions, a score and a verdict."
            : "Votre site est-il prêt à devenir une app mobile installable ? 9 questions, un score et un verdict."
        }
      >
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            <Link
              href="/outils"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                textDecoration: "none",
                marginBottom: 40,
              }}
            >
              <ArrowLeft size={12} />
              {isEn ? "Back to tools" : "Retour aux outils"}
            </Link>
            <AuditPwa />
          </div>
        </section>
      </PageLayout>
    </>
  );
}
