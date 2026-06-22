import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import WordpressExpressPage from "@/components/wordpress-express/wordpress-express-page";
import { FAQ } from "@/lib/wordpress-express";
import type { Locale } from "@/i18n/routing";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return generatePageMetadata({
    title: isEn
      ? "WordPress support on demand — no subscription"
      : "Dépannage WordPress à la demande — sans abonnement",
    description: isEn
      ? "A WordPress problem? On-demand intervention without subscription: express diagnosis, Express Ticket (149€), urgent 24h fix or prepaid hour packs. Reply within 24 business hours, backup before any action, clear quote beyond 1h."
      : "Un problème WordPress ? Intervention à la demande sans abonnement : diagnostic express, Ticket Express (149 €), urgence 24h ou packs d'heures prépayées. Réponse sous 24h ouvrées, sauvegarde avant toute action, devis clair au-delà d'1h.",
    path: "/depannage-wordpress",
    keywords: isEn
      ? [
          "WordPress support",
          "WordPress maintenance on demand",
          "fix WordPress site",
          "WordPress troubleshooting",
          "WordPress emergency help",
          "WordPress hourly support",
          "no subscription WordPress",
        ]
      : [
          "dépannage WordPress",
          "maintenance WordPress à la demande",
          "réparer site WordPress",
          "intervention WordPress urgente",
          "ticket WordPress",
          "support WordPress sans abonnement",
          "WordPress en panne",
        ],
    locale,
  });
}

export default async function DepannageWordpressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: isEn ? "WordPress support" : "Dépannage WordPress", url: "/depannage-wordpress" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name={isEn ? "WordPress support on demand" : "Dépannage WordPress à la demande"}
        description={
          isEn
            ? "On-demand WordPress intervention without subscription: diagnosis, fixes, urgent 24h handling and prepaid hour packs. Backup before any action, clear quote beyond one hour."
            : "Intervention WordPress à la demande sans abonnement : diagnostic, corrections, prise en charge urgente sous 24h et packs d'heures prépayées. Sauvegarde avant toute action, devis clair au-delà d'une heure."
        }
        serviceType={isEn ? "WordPress maintenance" : "Maintenance WordPress"}
        url="/depannage-wordpress"
      />
      <FAQJsonLd
        questions={FAQ.map((item) => ({
          question: isEn ? item.en.q : item.fr.q,
          answer: isEn ? item.en.a : item.fr.a,
        }))}
      />
      <WordpressExpressPage />
    </>
  );
}
