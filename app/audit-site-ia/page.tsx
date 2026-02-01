import { Suspense } from "react";
import AuditSiteIaClient from "@/components/gemini/audit-site-ia-client";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/json-ld";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Audit d'opportunité de migration WordPress Headless avec IA",
    description:
      "Obtenez un audit complet de migration vers WordPress Headless pour votre site web en quelques secondes. Analyse sur votre url avec recommandations personnalisées.",
    path: "/audit-site-ia",
    keywords: [
      "audit site web",
      "audit Headless",
      "migration WordPress Headless",
      "audit IA site web",
      "WordPress Headless IA",
    ],
  });
}




function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
    </div>
  );
}

export default function AuditSiteIaPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Audit site web IA", url: "/audit-site-ia" },
  ];

  const faqItems = [
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
