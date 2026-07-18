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
 * HomeStudio — présence humaine + démarche : mener un projet web aujourd'hui,
 * c'est aiguiller des IA différentes (gain de temps et de qualité) PUIS valider
 * ce qui tient en production. Le parcours (WordPress côté édition 15 ans, avant
 * 8 ans de développement) est la légitimité de validation — l'actif de
 * réassurance différenciant. Prolonge l'accroche du hero « L'IA code bien,
 * l'humain décide mieux ».
 */
export default function HomeStudio() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const bullets = isEn
    ? [
        ["Engineering & coordination", "Structuring the project and making different AIs work together — front, back and content — fast and friction-free."],
        ["Critical tech decisions", "WordPress or Headless, custom or SaaS, which stack, which hosting: trade-offs that commit you for years. AI suggests, the human decides."],
        ["Production validation", "15 years using WordPress and 8 years building: the legitimacy to judge performance, accessibility and maintainability — exactly where AI still gets it wrong."],
      ]
    : [
        ["Ingénierie & coordination", "Structurer le projet et faire travailler ensemble des IA différentes — front, back et contenu — vite et sans friction."],
        ["Choix techniques critiques", "WordPress ou Headless, sur-mesure ou SaaS, quelle stack, quel hébergement : des arbitrages qui engagent des années. L'IA propose, l'humain tranche."],
        ["Validation en production", "15 ans d'usage WordPress et 8 ans de développement : la légitimité pour juger perf, accessibilité et maintenabilité — là précisément où l'IA se trompe encore."],
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
                Leading a web project today means{" "}
                <span className="text-accent-secondary">orchestrating AIs — and validating.</span>
              </>
            ) : (
              <>
                Une expertise technique{" "}
                <span className="text-accent-secondary">devenue critique.</span>
              </>
            )}
          </h2>

          <p className="mt-5 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray">
            {isEn
              ? "Steered well, AI delivers speed and quality. But a web project is still engineering: structuring the work, coordinating several different AIs and settling the technical choices everything else depends on — then validating what holds up in production. That's where the human is decisive."
              : "Bien utilisée, l'IA fait gagner du temps et de la qualité. Mais mener un projet web reste un métier : Planifier, organiser, choisir les bons outils, coordonner, trancher et valider l'exécution. C'est là que l'humain n'est pas contournable."}
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
