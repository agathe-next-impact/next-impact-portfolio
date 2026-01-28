import { Suspense } from "react";
import AuditSiteIaClient from "@/components/gemini/audit-site-ia-client";

// Revalidate toutes les 24 heures
export const revalidate = 86400;

export async function generateMetadata() {
  return {
    title: "Faut-il migrer vers WordPress Headless ? | Next Impact",
    description: "Découvrez notre audit de site WordPress et les avantages de la migration vers WordPress Headless. Analyse approfondie pour optimiser votre présence en ligne.",
    openGraph: {
      title: "Faut-il migrer vers WordPress Headless ?  | Next Impact",
      url: "https://next-impact.digital/audit-site-ia",
      siteName: "Next Impact - Développeuse WordPress Freelance",
      description: "Découvrez notre audit de site WordPress et les avantages de la migration vers WordPress Headless. Analyse approfondie pour optimiser votre présence en ligne.",
      type: "website",
      images: [
        {
          url: "/img/avatar.png",
          width: 1200,
          height: 630,
          alt: "Next Impact - Développeuse WordPress Freelance",
        },
      ],
    },
  };
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
    </div>
  );
}

export default function AuditSiteIaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuditSiteIaClient />
    </Suspense>
  );
}
