import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/json-ld";
import { getAuditPageContent } from "@/lib/audit-page-content";
import PageLayout from "@/components/page-layout";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { Sonar } from "@/components/visuals/sonar";
import { BrandLogo } from "@/components/brand-logo";
import { VisioConseilBanner } from "@/components/visio-conseil/visio-conseil-banner";
import type { Locale } from "@/i18n/routing";

import AuditExperience from "./_components/AuditExperience";
import {
  ExempleResultat,
  PourQui,
  Preuves,
  CommentLireVerdict,
  LimitesAudit,
  AuditFaq,
  CtaFinal,
} from "./_components/sections";

// Revalidate toutes les 24 heures (contenu statique indexable).
export const revalidate = 86400;

const BTN_PRIMARY =
  "inline-flex h-12 items-center gap-2 rounded-sm border border-charcoal bg-vermilion px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";

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
    path: "/audit-site-web",
    keywords:
      locale === "en"
        ? [
            "free website audit",
            "website diagnosis",
            "WordPress audit",
            "Core Web Vitals audit",
            "Headless WordPress",
          ]
        : [
            "audit site web gratuit",
            "diagnostic site web",
            "audit WordPress",
            "audit Core Web Vitals",
            "WordPress Headless",
          ],
    locale,
  });
}

function LoadingFallback() {
  return (
    <div className="flex min-h-[12rem] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark-gray border-t-accent-secondary" />
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
  const c = getAuditPageContent(locale);

  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbAudit"), url: "/audit-site-web" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd
        questions={c.faq.items.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      <main>
        <PageLayout
          titre={c.hero.title}
          sousTitre={c.hero.subtitle}
          secNo="№ 01"
          ticks
          backdrop={
            <div className="absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_70%)]">
              <Sonar />
            </div>
          }
          headerSlot={
            <div className="flex flex-col gap-4 border-t border-dark-gray pt-8">
              <div>
                <a href="#outil" className={BTN_PRIMARY}>
                  {c.hero.ctaPrimary}
                  <ArrowRight size={14} />
                </a>
              </div>
              <p className="max-w-xl font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">
                {c.hero.reassurance}
              </p>
            </div>
          }
        >
          {/* № 02 — Outil interactif (Phase 1 : flux GeminiSearch → rapport email) */}
          <BlueprintSection
            id="outil"
            tone="obsidian"
            innerClassName="px-6 py-16 lg:px-8 lg:py-20"
          >
            <SectionHeading
              index="№ 02"
              kicker={c.tool.kicker}
              title={c.tool.title}
              description={c.tool.description}
            />
            <Reveal className="mt-10 max-w-3xl" delay={0.05}>
              <Suspense fallback={<LoadingFallback />}>
                <AuditExperience />
              </Suspense>
            </Reveal>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-dark-gray pt-8">
              <Link
                href="/outils"
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray transition-colors hover:text-accent-secondary"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                {c.tool.backToTools}
              </Link>
              <div className="flex items-center gap-6 opacity-70">
                <BrandLogo
                  src="/img/logo-wordpress.webp"
                  srcLight="/img/logo-wordpress-small.webp"
                  alt="Logo WordPress"
                  width={36}
                  height={36}
                />
                <BrandLogo
                  src="/img/logo-nextjs.webp"
                  srcLight="/img/logo-nextjs.webp"
                  alt="Logo Next.js"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </BlueprintSection>

          <Separator />
          <ExempleResultat index="№ 03" content={c.example} />
          <Separator />
          <PourQui index="№ 04" content={c.pourQui} />
          <Separator />
          <Preuves index="№ 05" content={c.preuves} />
          <Separator />
          <CommentLireVerdict index="№ 06" content={c.commentLire} />
          <Separator />
          <LimitesAudit index="№ 07" content={c.limites} />
          <Separator />
          <AuditFaq index="№ 08" content={c.faq} />
          <Separator />
          {/* Upsell tiède : la preuve gratuite vient d'être livrée → l'étage
              au-dessus est la visio conseil payante (déduite du devis). */}
          <VisioConseilBanner tone="jet" />
          <Separator />
          <CtaFinal index="№ 09" content={c.ctaFinal} />
        </PageLayout>
      </main>
    </>
  );
}
