import { Suspense } from "react";
import AuditSiteIaClient from "@/components/gemini/audit-site-ia-client";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auditPage" });
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/audit-site-ia",
    keywords:
      locale === "en"
        ? [
            "free website audit",
            "Headless audit",
            "Headless WordPress migration",
            "AI website audit",
            "Headless WordPress",
          ]
        : [
            "audit site web gratuit",
            "audit Headless",
            "migration WordPress Headless",
            "audit IA site web",
            "WordPress Headless",
          ],
    locale,
  });
}




function LoadingFallback() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
      <div style={{
        width: 32, height: 32,
        border: "2px solid var(--rule)",
        borderTopColor: "var(--ink)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  );
}

export default async function AuditSiteIaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auditPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbAudit"), url: "/audit-site-ia" },
  ];

  const faqItems =
    locale === "en"
      ? [
          {
            question: "How does the AI-powered audit work?",
            answer:
              "Our tool uses AI to analyze your website on several criteria: performance, SEO, accessibility and best practices. The analysis runs in real time and you get personalized recommendations.",
          },
          {
            question: "Which aspects of the site are analyzed?",
            answer:
              "The audit reviews performance (loading speed), SEO (organic ranking), accessibility (WCAG compliance) and web development best practices.",
          },
          {
            question: "Is the audit free?",
            answer:
              "Yes, the base audit is completely free. It gives you a comprehensive view of your site's state and recommendations to improve it.",
          },
        ]
      : [
          {
            question: "Comment fonctionne l'audit propulsé par l'IA ?",
            answer:
              "Notre outil utilise l'intelligence artificielle pour analyser votre site web sur plusieurs critères : performance, SEO, accessibilité et bonnes pratiques. L'analyse est effectuée en temps réel et vous obtenez des recommandations personnalisées.",
          },
          {
            question: "Quels aspects du site sont analysés ?",
            answer:
              "L'audit examine la performance (vitesse de chargement), le SEO (référencement naturel), l'accessibilité (conformité WCAG) et les bonnes pratiques de développement web.",
          },
          {
            question: "L'audit est-il gratuit ?",
            answer:
              "Oui, l'audit de base est entièrement gratuit. Il vous permet d'obtenir une vue d'ensemble de l'état de votre site web et des recommandations pour l'améliorer.",
          },
        ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd questions={faqItems} />
      <Suspense fallback={<LoadingFallback />}>
        <AuditSiteIaClient />
      </Suspense>
    </>
  );
}
