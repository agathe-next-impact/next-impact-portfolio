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
  "inline-flex min-h-11 items-center gap-2 py-2.5 border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

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
        ["I've been in your seat", "15 years publishing in WordPress before building with it: I know what an editorial team needs, because it was my job."],
        ["The decision isn't delegated", "WordPress or headless, custom or SaaS, which stack, which hosting: trade-offs that commit you for years. They are settled in writing, before the build."],
        ["I frame it, AI executes", "AI speeds up production; it does not judge performance, accessibility or maintainability. I hold the project ownership and the responsibility, from quote to delivery."],
      ]
    : [
        ["J'ai été à votre place", "15 ans à publier dans WordPress avant d'en développer : je sais ce dont une équipe éditoriale a besoin, parce que c'était mon métier."],
        ["La décision ne se délègue pas", "WordPress ou headless, sur-mesure ou SaaS, quelle stack, quel hébergement : des arbitrages qui engagent des années. Ils se tranchent par écrit, avant la production."],
        ["Je cadre, l'IA exécute", "L'IA accélère la production ; elle ne juge ni la performance, ni l'accessibilité, ni la maintenabilité. Je tiens la maîtrise d'ouvrage et la responsabilité, du devis à la livraison."],
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
                {"Fifteen years publishing in WordPress "}
                <span className="text-accent-secondary">before building with it.</span>
              </>
            ) : (
              <>
                {"Quinze ans à publier dans WordPress "}
                <span className="text-accent-secondary">avant d'en développer.</span>
              </>
            )}
          </h2>

          <p className="mt-5 max-w-xl font-inter-tight text-base leading-relaxed text-mid-gray">
            {isEn
              ? "A solo studio is a guarantee, not a limitation: one person scopes the work, arbitrates the architecture, settles the choices that commit you for years, then validates what holds up in production. One point of contact, one responsibility, from quote to delivery."
              : "Un studio solo est une garantie, pas une limite : une seule personne cadre, arbitre l'architecture, tranche les choix qui engagent des années, puis valide ce qui tient en production. Une interlocutrice, une responsabilité, du devis à la mise en ligne."}
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
              {isEn ? "Featured in Le Figaro · May 2026" : "Vu dans Le Figaro · mai 2026"}
            </a>
          </div>
        </Reveal>
      </div>
    </BlueprintSection>
  );
}
