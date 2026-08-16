// Sections marketing SSR de /audit-site-web. Composants serveur (aucun hook) :
// rendus dans le HTML initial → indexables. Les seules îles client importées
// (Reveal, RadialGauge) rendent leur contenu côté serveur et restent
// reduced-motion-safe. Tout le copy vient de lib/audit-page-content.ts.

import { Link } from "@/i18n/navigation";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { RadialGauge } from "@/components/visuals/radial-gauge";
import type { AuditPageContent } from "@/lib/audit-page-content";

const LABEL_MONO =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

const BTN_PRIMARY =
  "inline-flex h-12 items-center gap-2 rounded-sm border border-accent-secondary bg-accent-secondary px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";

const BTN_GHOST =
  "group inline-flex h-12 items-center gap-1.5 rounded-sm border border-dark-gray px-6 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

const LINK_MONO =
  "group mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground";

/** Exemple de résultat figé — score + 3 priorités, avant le formulaire détaillé. */
export function ExempleResultat({
  content,
  index,
}: {
  content: AuditPageContent["example"];
  index: string;
}) {
  return (
    <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
      <SectionHeading
        index={index}
        kicker={content.kicker}
        title={content.title}
        description={content.description}
      />
      <Reveal className="mt-10 grid gap-px overflow-hidden border border-dark-gray bg-dark-gray md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col items-center justify-center gap-3 bg-obsidian p-8">
          <RadialGauge value={content.score} size={132} label={content.scoreLabel} />
          <p className={LABEL_MONO}>{content.scoreCaption}</p>
        </div>
        <div className="flex flex-col bg-obsidian">
          {content.priorities.map((p, i) => (
            <div
              key={p.label}
              className={cn(
                "border-l-[3px] border-l-accent-secondary px-6 py-5",
                i < content.priorities.length - 1 && "border-b border-b-dark-gray",
              )}
            >
              <p className="font-inter-tight text-sm font-medium text-foreground">
                {p.label}
              </p>
              <p className="mt-1 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </BlueprintSection>
  );
}

/** Pour qui ? — 3 cibles + phrase de tri vers le diagnostic projet. */
export function PourQui({
  content,
  index,
}: {
  content: AuditPageContent["pourQui"];
  index: string;
}) {
  return (
    <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
      <SectionHeading index={index} kicker={content.kicker} title={content.title} />
      <Reveal className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
        {content.items.map((it) => (
          <div key={it} className="bg-obsidian p-6">
            <p className="font-inter-tight text-[15px] leading-relaxed text-foreground">
              {it}
            </p>
          </div>
        ))}
      </Reveal>
      <Reveal className="mt-8 flex flex-wrap items-center gap-4 border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 px-6 py-5">
        <p className="min-w-[12rem] flex-1 font-inter-tight text-sm text-mid-gray">
          {content.triPhrase}
        </p>
        <Link href={content.triHref} className={BTN_GHOST}>
          {content.triCta}
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </Reveal>
    </BlueprintSection>
  );
}

/** Preuves — 3 chiffres clés. */
export function Preuves({
  content,
  index,
}: {
  content: AuditPageContent["preuves"];
  index: string;
}) {
  return (
    <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
      <SectionHeading index={index} kicker={content.kicker} title={content.title} />
      <Reveal className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
        {content.items.map((p) => (
          <div key={p.label} className="flex flex-col gap-2 bg-obsidian p-8">
            <span className="text-4xl font-light tracking-tight text-foreground lg:text-5xl">
              {p.value}
            </span>
            <span className="font-inter-tight text-sm text-mid-gray">{p.label}</span>
          </div>
        ))}
      </Reveal>
    </BlueprintSection>
  );
}

/** Comment lire le verdict ? — 4 verdicts A–D renvoyant vers les offres. */
export function CommentLireVerdict({
  content,
  index,
}: {
  content: AuditPageContent["commentLire"];
  index: string;
}) {
  return (
    <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
      <SectionHeading
        index={index}
        kicker={content.kicker}
        title={content.title}
        description={content.description}
      />
      <Reveal className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
        {content.verdicts.map((v) => (
          <div key={v.code} className="flex flex-col gap-3 bg-obsidian p-6 lg:p-8">
            <h3 className="text-lg font-light tracking-tight text-foreground">
              {v.title}
            </h3>
            <p className="font-inter-tight text-[14px] leading-relaxed text-mid-gray">
              {v.description}
            </p>
            <Link href={v.href} className={LINK_MONO}>
              {v.offerLabel}
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        ))}
      </Reveal>
    </BlueprintSection>
  );
}

/** Limites de l'audit — 2 colonnes : ce qu'il détecte / ce qu'il ne remplace pas. */
export function LimitesAudit({
  content,
  index,
}: {
  content: AuditPageContent["limites"];
  index: string;
}) {
  return (
    <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
      <SectionHeading index={index} kicker={content.kicker} title={content.title} />
      <Reveal className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
        <div className="bg-obsidian p-6 lg:p-8">
          <p className={cn(LABEL_MONO, "mb-5 text-accent-secondary")}>
            {content.detectsTitle}
          </p>
          <ul className="flex flex-col gap-3">
            {content.detects.map((d) => (
              <li key={d} className="flex gap-2.5">
                <Check size={16} className="mt-0.5 shrink-0 text-accent-secondary" />
                <span className="font-inter-tight text-sm leading-relaxed text-foreground">
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-obsidian p-6 lg:p-8">
          <p className={cn(LABEL_MONO, "mb-5")}>{content.notReplaceTitle}</p>
          <ul className="flex flex-col gap-3">
            {content.notReplace.map((d) => (
              <li key={d} className="flex gap-2.5">
                <Minus size={16} className="mt-0.5 shrink-0 text-mid-gray" />
                <span className="font-inter-tight text-sm leading-relaxed text-mid-gray">
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </BlueprintSection>
  );
}

/** FAQ — accordéon natif <details> : 100 % SSR, accessible, sans JS. */
export function AuditFaq({
  content,
  index,
}: {
  content: AuditPageContent["faq"];
  index: string;
}) {
  return (
    <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
      <SectionHeading index={index} kicker={content.kicker} title={content.title} />
      <div className="mt-10 border-t border-dark-gray">
        {content.items.map((f) => (
          <details key={f.question} className="group border-b border-dark-gray">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
              <span className="font-inter-tight text-[15px] font-medium text-foreground md:text-base">
                {f.question}
              </span>
              <Plus
                size={16}
                className="shrink-0 text-mid-gray transition-transform group-open:rotate-45"
              />
            </summary>
            <p className="pb-6 font-inter-tight text-sm leading-relaxed text-mid-gray">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </BlueprintSection>
  );
}

/** CTA final — 2 sorties : lancer l'audit (ancre) / parler de mon site. */
export function CtaFinal({
  content,
  index,
}: {
  content: AuditPageContent["ctaFinal"];
  index: string;
}) {
  return (
    <BlueprintSection
      tone="jet"
      ticks
      innerClassName="px-6 py-20 lg:px-8 lg:py-28"
    >
      <Reveal className="flex flex-col items-center gap-6 text-center">
        <SectionHeading
          align="center"
          index={index}
          kicker={content.kicker}
          title={content.title}
          description={content.description}
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#outil" className={BTN_PRIMARY}>
            {content.primaryLabel}
            <ArrowRight size={14} />
          </a>
          <Link href={content.secondaryHref} className={BTN_GHOST}>
            {content.secondaryLabel}
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Reveal>
    </BlueprintSection>
  );
}
