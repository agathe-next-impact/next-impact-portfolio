"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";

const FIGARO_URL =
  "https://www.lefigaro.fr/economie/wordpress-headless-comment-les-pme-peuvent-moderniser-leur-site-sans-tout-reconstruire-avec-next-impact-digital-20260512";

const BTN_GHOST =
  "inline-flex h-11 items-center gap-2 border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

/**
 * HomeStudio — présence humaine + conviction : la section « à propos » de la home,
 * axée sur le manifeste (voir /a-propos §03). Thèse : l'IA n'a pas remplacé le
 * conseil, elle l'a rendu critique. Les 3 points reprennent les 3 piliers du
 * manifeste (l'IA amplifie sans remplacer · la décision ne se délègue pas ·
 * expert + IA en multiplicateur) et les ancrent dans la légitimité personnelle
 * (15 ans d'usage WordPress, 6 ans de développement). Prolonge l'accroche du hero.
 */
export default function HomeStudio() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const bullets = isEn
    ? [
        ["AI amplifies, it doesn't replace", "An amplifier of skill, not a substitute: without domain expertise, the plausible error slips through. That's where 20 years of systems practice weigh in."],
        ["The decision isn't delegated", "WordPress or Headless, custom or SaaS, which stack, which hosting: trade-offs that commit you for years. AI proposes, the human decides."],
        ["I frame it, AI runs it", "15 years using WordPress and 6 years building: the legitimacy to judge performance, accessibility and maintainability — where AI still gets it wrong. I hold the project ownership, AI runs the build."],
      ]
    : [
        ["L'IA amplifie, elle ne remplace pas", "Un amplificateur de compétence, pas un substitut : sans expertise du domaine, l'erreur plausible passe inaperçue. C'est là que 20 ans de pratique des systèmes pèsent."],
        ["La décision ne se délègue pas", "WordPress ou Headless, sur-mesure ou SaaS, quelle stack, quel hébergement : des arbitrages qui engagent des années. L'IA propose, l'humain tranche."],
        ["Je cadre, l'IA exécute", "15 ans d'usage WordPress et 6 ans de développement : la légitimité pour juger perf, accessibilité et maintenabilité — là où l'IA se trompe encore. Je tiens la maîtrise d'ouvrage, l'IA tient le chantier."],
      ];

  return (
    <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-10 lg:py-24">
      {/* En-tête de section */}
      <Reveal className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
        <span>№ 05</span>
        <span className="h-px w-6 bg-accent-secondary/50" />
        <span className="text-mid-gray">{isEn ? "The studio" : "Le studio"}</span>
      </Reveal>

      {/* 2 colonnes */}
      <div className="mt-10 grid gap-12 border-t border-dark-gray pt-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        {/* Photo */}
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-dark-gray bg-overlay-gray">
            <Image
              src="/img/contact-agathe-km.png"
              alt={isEn ? "Agathe Karinthi-Martin, founder of Next Impact" : "Agathe Karinthi-Martin, fondatrice de Next Impact"}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 360px, 100vw"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground">
              Agathe Karinthi-Martin
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
              <span className="status-dot" />
              {isEn ? "Remote · France" : "Remote · France"}
            </span>
          </div>
        </Reveal>

        {/* Texte */}
        <Reveal delay={0.08} className="flex flex-col">
          <h2 className="max-w-2xl text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-4xl">
            {isEn ? (
              <>
                {"AI hasn't replaced advice. "}
                <span className="text-accent-secondary">It has made it critical.</span>
              </>
            ) : (
              <>
                {"L'IA n'a pas remplacé le conseil. "}
                <span className="text-accent-secondary">Elle l&apos;a rendu critique.</span>
              </>
            )}
          </h2>

          <p className="mt-5 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray">
            {isEn
              ? "AI is the best intern we've ever had: fast, structured, tireless. But an intern, however brilliant, doesn't decide the strategy. Leading a web project is still a craft — scoping the work, arbitrating the architecture, settling the choices that commit you for years, then validating what holds up in production. That's where the human is not optional."
              : "L'IA est le meilleur stagiaire qu'on ait jamais eu : rapide, structuré, infatigable. Mais un stagiaire, même brillant, ne décide pas de la stratégie. Mener un projet web reste un métier — cadrer, arbitrer l'architecture, trancher les choix qui engagent des années, puis valider ce qui tient en production. C'est là que l'humain n'est pas contournable."}
          </p>

          {/* Deux savoir-faire */}
          <dl className="mt-8 flex flex-col gap-5 border-t border-dark-gray pt-8">
            {bullets.map(([label, text]) => (
              <div key={label} className="grid gap-1.5 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
                  {label}
                </dt>
                <dd className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {text}
                </dd>
              </div>
            ))}
          </dl>

          {/* Preuve presse + lien parcours */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/a-propos" className={BTN_GHOST}>
              {isEn ? "My full journey" : "Mon parcours complet"}
              <ArrowRight size={14} />
            </Link>
            <a
              href={FIGARO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter-tight text-[13px] italic text-mid-gray transition-colors hover:text-foreground"
            >
              {isEn ? "Featured in Le Figaro — May 2026" : "Vu dans Le Figaro — mai 2026"}
            </a>
          </div>
        </Reveal>
      </div>
    </BlueprintSection>
  );
}
