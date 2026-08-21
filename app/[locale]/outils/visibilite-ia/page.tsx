import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/json-ld";
import VisibiliteIa from "@/components/outils/visibilite-ia";
import { FAQ_ITEMS } from "@/lib/visibilite-ia";
import PageLayout from "@/components/page-layout";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Plus } from "lucide-react";
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
        ? "AI visibility diagnostic - Is your site visible to ChatGPT and Perplexity?"
        : "Diagnostic visibilité IA - Votre site est-il visible dans ChatGPT et Perplexity ?",
    description:
      locale === "en"
        ? "10 questions to score your site's visibility in AI engines (ChatGPT, Perplexity, AI Overviews) on 4 axes: AI crawler access, content citability, structure and schema, external authority. A clear verdict and concrete actions, free."
        : "10 questions pour situer la visibilité de votre site dans les moteurs IA (ChatGPT, Perplexity, AI Overviews) sur 4 axes : accès des robots IA, citabilité du contenu, structure et données, autorité externe. Un verdict clair et des actions concrètes, gratuitement.",
    path: "/outils/visibilite-ia",
    keywords:
      locale === "en"
        ? [
            "AI visibility test",
            "is my site visible to ChatGPT",
            "GEO generative engine optimization",
            "cited by Perplexity",
            "AI Overviews visibility",
          ]
        : [
            "visibilité moteurs IA",
            "mon site est-il visible dans ChatGPT",
            "GEO generative engine optimization",
            "être cité par Perplexity",
            "visibilité AI Overviews",
          ],
    locale,
  });
}

export default async function VisibiliteIaPage({
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
      name: isEn ? "AI visibility diagnostic" : "Diagnostic visibilité IA",
      url: "/outils/visibilite-ia",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQJsonLd
        questions={FAQ_ITEMS.map((f) => ({
          question: isEn ? f.questionEn : f.questionFr,
          answer: isEn ? f.answerEn : f.answerFr,
        }))}
      />
      <PageLayout
        titre={
          isEn
            ? "Is your site visible to AI engines?"
            : "Votre site est-il visible dans les moteurs IA ?"
        }
        sousTitre={
          isEn
            ? "ChatGPT, Perplexity, AI Overviews: 10 questions, a score on 4 axes and your priority actions — useful whatever the result."
            : "ChatGPT, Perplexity, AI Overviews : 10 questions, un score sur 4 axes et vos actions prioritaires — utile quel que soit le résultat."
        }
      >
        <BlueprintSection
          tone="obsidian"
          innerClassName="px-6 py-12 lg:px-8 lg:py-16"
        >
          <Link
            href="/outils"
            className="group mb-10 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray transition-colors hover:text-accent-secondary"
          >
            <ArrowLeft
              size={12}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            {isEn ? "Back to tools" : "Retour aux outils"}
          </Link>
          <VisibiliteIa />
        </BlueprintSection>

        <Separator />

        <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="FAQ"
            title={isEn ? "Questions about this diagnostic" : "Questions sur ce diagnostic"}
          />
          <div className="mt-10 border-t border-dark-gray">
            {FAQ_ITEMS.map((f) => (
              <details key={f.id} className="group border-b border-dark-gray">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-inter-tight text-[15px] font-medium text-foreground md:text-base">
                    {isEn ? f.questionEn : f.questionFr}
                  </span>
                  <Plus
                    size={16}
                    className="shrink-0 text-mid-gray transition-transform group-open:rotate-45"
                  />
                </summary>
                <p className="max-w-3xl pb-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {isEn ? f.answerEn : f.answerFr}
                </p>
              </details>
            ))}
          </div>
        </BlueprintSection>
      </PageLayout>
    </>
  );
}
