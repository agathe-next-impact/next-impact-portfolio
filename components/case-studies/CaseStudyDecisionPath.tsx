import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { OFFERS } from "@/lib/visio-conseil";
import { formatDelai } from "@/lib/case-studies-data";
import type { CaseStudy, OffreConseilKey } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";

/** Correspondance offreConseil (taxonomie études de cas) → id d'offre /conseil. */
const CONSEIL_OFFER_ID: Record<OffreConseilKey, string> = {
  "selecteur-techno": "choix-techno-ia",
  "architecture-ia": "architecture-projet-ia",
  // Offres retirées du catalogue (charte §1) : ces cas pointent vers l'audit + roadmap.
  "pack-ia": "architecture-projet-ia",
  "direction-technique": "architecture-projet-ia",
};

const STEP_LINK =
  "group/link mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary no-underline transition-colors hover:text-foreground";

/**
 * Le chemin de décision — relie la fiche aux offres vendues : le besoin,
 * l'arbitrage (→ /conseil), la construction (→ /solutions-web + budget).
 * Masqué si le cas n'est rattaché à aucune offre (conseil ET construction null).
 */
export default async function CaseStudyDecisionPath({
  caseStudy,
  locale,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
}) {
  const { offreConseil, offreConstruction, budgetIndicatif } = caseStudy;
  if (!offreConseil && !offreConstruction) return null;

  const t = await getTranslations({
    locale,
    namespace: "caseStudyDetail.decisionPath",
  });

  // Prix tiré de la source canonique des offres /conseil — jamais dupliqué ici.
  const conseilPrice = offreConseil
    ? OFFERS.find((o) => o.id === CONSEIL_OFFER_ID[offreConseil])?.tiers[0]?.price
    : undefined;

  const budgetText = budgetIndicatif
    ? caseStudy.delai
      ? t("budgetLine", {
          budget: budgetIndicatif,
          delai: formatDelai(caseStudy.delai, locale),
        })
      : t("budgetLineNoDelai", { budget: budgetIndicatif })
    : null;

  const steps = [
    {
      key: "need",
      label: t("stepNeed"),
      line: caseStudy.description,
      link: null,
    },
    {
      key: "arbitrage",
      label: t("stepArbitrage"),
      line: caseStudy.arbitrage?.decision ?? t("arbitrageFallback"),
      link:
        offreConseil && conseilPrice
          ? {
              href: "/conseil" as const,
              label: t(`conseilLink.${offreConseil}`, { price: conseilPrice }),
            }
          : null,
    },
    ...(offreConstruction || budgetText
      ? [
          {
            key: "build",
            label: t("stepBuild"),
            line: offreConstruction
              ? t(`constructionLine.${offreConstruction}`)
              : (budgetText as string),
            link: offreConstruction
              ? { href: "/solutions-web" as const, label: t("constructionLink") }
              : null,
          },
        ]
      : []),
  ];

  return (
    <Reveal>
      <div className="mt-10 border border-dark-gray">
        <div className="border-b border-dark-gray px-6 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-secondary">
          {t("title")}
        </div>
        {steps.map((step, i) => (
          <div
            key={step.key}
            className="flex gap-4 px-6 py-5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-dark-gray"
          >
            <span className="font-mono text-[10px] leading-6 text-mid-gray">
              0{i + 1}
            </span>
            <div className="min-w-0">
              <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
                {step.label}
              </div>
              <p className="font-inter-tight text-sm leading-relaxed text-foreground">
                {step.line}
              </p>
              {step.key === "build" && offreConstruction && budgetText && (
                <p className="mt-1 font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {budgetText}
                </p>
              )}
              {step.link && (
                <Link href={step.link.href} className={STEP_LINK}>
                  {step.link.label}
                  <ArrowRight
                    size={10}
                    className="transition-transform duration-200 group-hover/link:translate-x-0.5"
                  />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
