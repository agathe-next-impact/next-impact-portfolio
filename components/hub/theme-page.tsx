// ThemePage — gabarit d'une page thématique du hub « Quelle techno web ? ».
// Rend le parcours 4 temps à partir d'un objet HubTheme (lib/hub-themes.ts) :
//   1. Intro (la question posée + les voies)  2. Conseil minimal
//   3. Outil(s) en ligne                       4. Prestas possibles (par température)
// Composant serveur (aucun hook) — reçoit `locale`, comme HubRubriques. Tokens DS
// uniquement, langage « blueprint » (BlueprintSection / Separator). Animations
// sobres via <Reveal> (prose/titres) et <Stagger>/<StaggerItem> (cascade des
// collections) — opacity + translateY, viewport once, reduced-motion respecté.
// Ajouter un thème = ajouter une entrée dans HUB_THEMES, pas toucher ce fichier.

import type React from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight, BookOpen, GitBranch, Info, Lightbulb } from "lucide-react";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import PageLayout from "@/components/page-layout";
import type { HubTheme, Temp } from "@/lib/hub-themes";
import { tx } from "@/lib/hub-themes";
import { ConseilModalOnRead } from "@/components/documentation/conseil-modal-on-read";

const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

// Température → couleur d'accent. froid (regarde) → tiède (décide) → chaud (agit).
const TEMP: Record<Temp, { border: string; chip: string; fr: string; en: string }> = {
  froid: { border: "border-l-accent-secondary", chip: "text-accent-secondary", fr: "Froid", en: "Cold" },
  tiede: { border: "border-l-accent", chip: "text-accent", fr: "Tiède", en: "Warm" },
  chaud: { border: "border-l-vermilion", chip: "text-vermilion", fr: "Chaud", en: "Hot" },
};

type Href = Parameters<typeof Link>[0]["href"];

export function ThemePage({
  theme,
  locale,
  breadcrumb,
}: {
  theme: HubTheme;
  locale: string;
  /** Fil d'Ariane visible, fourni par la route (même source que le JSON-LD). */
  breadcrumb?: React.ReactNode;
}) {
  const isEn = locale === "en";

  const copy = {
    optionsLabel: isEn ? "The possible paths" : "Les voies possibles",
    adviceKicker: isEn ? "Minimal advice" : "Conseil minimal",
    adviceTitle: isEn ? "What actually tips the decision" : "Ce qui fait vraiment pencher la décision",
    readingKicker: isEn ? "Worth reading" : "À lire",
    readingTitle: isEn ? "Go deeper on this question" : "Approfondir la question",
    toolsKicker: isEn ? "Online tools" : "Outils en ligne",
    toolsTitle: isEn ? "Test it yourself, free" : "Testez vous-même, gratuitement",
    prestasKicker: isEn ? "Next step" : "Prochaine étape",
    prestasTitle: isEn ? "Get a decision on your case" : "Faire trancher votre cas",
    doctrine: isEn
      ? "The content is enough to understand. A call or audit applies it to your real case before you spend — the tools qualify, the advice decides."
      : "Le contenu suffit pour comprendre. Une visio ou un audit l'applique à votre cas réel avant d'investir — l'outil qualifie, le conseil tranche.",
  };

  return (
    <PageLayout
      titre={tx(theme.question, locale)}
      sousTitre={tx(theme.intro, locale)}
      secNo={theme.index}
      breadcrumb={breadcrumb}
    >
      {/* 1 — Intro : le contexte + les voies possibles */}
      <BlueprintSection innerClassName="px-6 py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-8">
          <Reveal
            as="p"
            className="max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg"
          >
            {tx(theme.context, locale)}
          </Reveal>

          <div>
            <Reveal className="mb-4 flex items-center gap-2">
              <GitBranch size={15} className="text-accent-secondary" />
              <p className={LABEL_MONO}>{copy.optionsLabel}</p>
            </Reveal>
            <Stagger className="grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
              {theme.options.map((opt) => (
                <StaggerItem
                  key={opt.label.fr}
                  className="flex flex-col gap-2 bg-obsidian p-5 lg:p-6"
                >
                  <p className="font-inter-tight text-base text-foreground">
                    {tx(opt.label, locale)}
                  </p>
                  <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                    {tx(opt.detail, locale)}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </BlueprintSection>
      <Separator />

      {/* 2 — Conseil minimal */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-14 lg:px-8 lg:py-16">
        <Reveal className="mb-10">
          <SectionHeading kicker={copy.adviceKicker} title={copy.adviceTitle} />
        </Reveal>
        <Stagger className="border border-dark-gray bg-obsidian">
          {theme.advice.map((a, i) => (
            <StaggerItem
              key={a.point.fr}
              className={
                "flex items-start gap-4 px-5 py-5 lg:px-7 " +
                (i < theme.advice.length - 1 ? "border-b border-dark-gray" : "")
              }
            >
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-inter-tight text-[15px] text-foreground">
                  {tx(a.point, locale)}
                </p>
                <p className="mt-1.5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                  {tx(a.detail, locale)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-6 flex items-start gap-3 border border-dark-gray bg-obsidian px-4 py-4">
          <Info size={14} className="mt-0.5 shrink-0 text-mid-gray" />
          <p className="font-inter-tight text-[13px] leading-relaxed text-mid-gray">
            {copy.doctrine}
          </p>
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* 2 bis — À lire : articles longs rattachés au thème (optionnel) */}
      {theme.reading && theme.reading.length > 0 && (
        <>
          <BlueprintSection innerClassName="px-6 py-14 lg:px-8 lg:py-16">
            <Reveal className="mb-10">
              <SectionHeading kicker={copy.readingKicker} title={copy.readingTitle} />
            </Reveal>
            <Stagger className="border border-dark-gray bg-obsidian">
              {theme.reading.map((r, i) => {
                const Icon = r.icon ?? BookOpen;
                return (
                  <StaggerItem
                    key={r.href + r.name.fr}
                    className={i < theme.reading!.length - 1 ? "border-b border-dark-gray" : ""}
                  >
                    <Link
                      href={r.href as Href}
                      className="group flex items-start gap-4 px-5 py-5 no-underline transition-colors hover:bg-jet lg:px-7"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-dark-gray bg-jet">
                        <Icon className="h-[1.125rem] w-[1.125rem] text-vermilion" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-inter-tight text-base text-foreground">
                          {tx(r.name, locale)}
                        </p>
                        <p className="mt-1.5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                          {tx(r.blurb, locale)}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="mt-1 shrink-0 text-mid-gray transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </BlueprintSection>
          <Separator />
        </>
      )}

      {/* 3 — Outil(s) en ligne */}
      <BlueprintSection innerClassName="px-6 py-14 lg:px-8 lg:py-16">
        <Reveal className="mb-10">
          <SectionHeading kicker={copy.toolsKicker} title={copy.toolsTitle} />
        </Reveal>
        <Stagger className="grid grid-cols-1 border-r border-t border-dark-gray sm:grid-cols-2">
          {theme.tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <StaggerItem
                key={tool.href + tool.name.fr}
                className="border-b border-l border-dark-gray"
              >
                <Link
                  href={tool.href as Href}
                  className="group flex h-full flex-col gap-4 p-6 no-underline transition-colors hover:bg-jet lg:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center border border-dark-gray bg-jet">
                      <Icon className="h-[1.125rem] w-[1.125rem] text-vermilion" />
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-mid-gray transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </div>
                  <div>
                    <p className="font-inter-tight text-base text-foreground">
                      {tx(tool.name, locale)}
                    </p>
                    <p className="mt-1.5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                      {tx(tool.blurb, locale)}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* 4 — Prestas possibles, hiérarchisées par température */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-14 lg:px-8 lg:py-16">
        <Reveal className="mb-10">
          <SectionHeading kicker={copy.prestasKicker} title={copy.prestasTitle} />
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-px border border-dark-gray bg-dark-gray md:grid-cols-3">
          {theme.prestas.map((p) => {
            const temp = TEMP[p.temp];
            const isHot = p.temp === "chaud";
            return (
              <StaggerItem
                key={p.href + p.name.fr}
                className={`flex flex-col justify-between gap-5 border-l-[3px] bg-obsidian p-6 lg:p-7 ${temp.border}`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`font-mono text-[9px] uppercase tracking-[0.16em] ${temp.chip}`}>
                      {isEn ? temp.en : temp.fr}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground">
                      {tx(p.price, locale)}
                    </span>
                  </div>
                  <p className="font-inter-tight text-base text-foreground">
                    {tx(p.name, locale)}
                  </p>
                  <p className="mt-1.5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                    {tx(p.blurb, locale)}
                  </p>
                </div>
                <Link
                  href={p.href as Href}
                  className={
                    isHot
                      ? "group inline-flex h-10 items-center justify-center gap-1.5 border border-charcoal bg-vermilion px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-white no-underline transition-colors hover:bg-vermilion-bright"
                      : "group inline-flex h-10 items-center justify-center gap-1.5 border border-dark-gray px-4 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:bg-jet"
                  }
                >
                  {tx(p.cta, locale)}
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </BlueprintSection>

      {/* Rubrique d'arbitrage techno uniquement : les autres rubriques ne
          posent pas la question que tranche la visio à 150 €. */}
      {theme.slug === "choisir" && (
        <ConseilModalOnRead source="documentation/choisir" />
      )}
    </PageLayout>
  );
}
