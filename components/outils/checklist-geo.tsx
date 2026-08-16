"use client";

// Checklist GEO actionnable — outil de la rubrique « Être trouvé à l'heure de
// l'IA », pendant actionnable du diagnostic visibilité IA. 24 actions groupées
// par les 4 chantiers du guide GEO PME (C2), cases cochables persistées en
// localStorage, barre de progression, et téléchargement PDF via une vue print
// générée dans un iframe caché (zéro dépendance client — voir
// lib/checklist-geo-print.ts). Escalier de CTA par température d'avancement :
// froid → rubrique + diagnostic gratuits, tiède → visio 150 €, chaud →
// cadrage 490 €. Doctrine : checklist et téléchargement utilisables sans
// email ; la modale newsletter vient après la preuve de valeur.
// Modèle : visibilite-ia.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  FileDown,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import ConseilModal from "@/components/ui/conseil-modal";
import { Reveal } from "@/components/ui/reveal";
import { track } from "@/lib/track";
import {
  computeProgress,
  computeSectionProgress,
  getCtaTier,
  ITEMS,
  SECTIONS,
  type CtaTier,
  type Level,
} from "@/lib/checklist-geo";
import { buildChecklistPrintHtml } from "@/lib/checklist-geo-print";

const LS_CHECKED = "ni:checklist-geo:checked";

const BTN_PRIMARY =
  "inline-flex h-11 items-center gap-2 border border-accent-secondary bg-accent-secondary px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";
const BTN_GHOST =
  "group inline-flex h-11 items-center gap-1.5 rounded-sm border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";
const LABEL_MONO =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray";

type LinkHref = Parameters<typeof Link>[0]["href"];

// Escalier de CTA proportionné à l'avancement. Le barreau gratuit reste
// présent à tous les paliers.
function getCtas(tier: CtaTier) {
  if (tier === "froid")
    return {
      lead: {
        fr: "Vous démarrez : commencez par comprendre le terrain, puis situez votre site — les deux sont gratuits.",
        en: "Just starting: first understand the landscape, then score your site — both are free.",
      },
      primary: {
        fr: "Comprendre le GEO : Être trouvé à l'heure de l'IA",
        en: "Understand GEO: Getting found in the AI era",
        href: "/documentation/etre-trouve",
      },
      secondary: {
        fr: "Me situer : diagnostic visibilité IA",
        en: "Score my site: AI visibility diagnostic",
        href: "/outils/visibilite-ia",
      },
    };
  if (tier === "tiede")
    return {
      lead: {
        fr: "Chantier lancé : une visio sert à prioriser les actions restantes selon votre site réel.",
        en: "Work in progress: a call helps prioritize the remaining actions for your actual site.",
      },
      primary: {
        fr: "Prioriser mes actions en visio — 150 €",
        en: "Prioritize my actions on a call — €150",
        href: "/conseil",
      },
      secondary: {
        fr: "Approfondir : la rubrique Être trouvé",
        en: "Go deeper: the Getting found section",
        href: "/documentation/etre-trouve",
      },
    };
  return {
    lead: {
      fr: "Socle en place : l'étape d'après est un plan structuré — quoi mesurer, quoi renforcer, dans quel ordre.",
      en: "Foundations in place: the next step is a structured plan — what to measure, what to strengthen, in what order.",
    },
    primary: {
      fr: "Cadrer la suite — 490 €",
      en: "Scope the next phase — €490",
      href: "/conseil",
    },
    secondary: {
      fr: "Re-tester ma visibilité IA",
      en: "Re-test my AI visibility",
      href: "/outils/visibilite-ia",
    },
  };
}

function levelBadge(level: Level, isEn: boolean) {
  return level === "interne"
    ? { label: isEn ? "In-house" : "Interne", cls: "border-accent-secondary text-accent-secondary" }
    : { label: isEn ? "Provider" : "Prestataire", cls: "border-dark-gray text-mid-gray" };
}

export default function ChecklistGeo() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [downloaded, setDownloaded] = useState(false);

  // Reprise de l'état coché (après hydratation, pour ne pas désynchroniser le SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_CHECKED);
      if (!raw) return;
      const ids = JSON.parse(raw);
      if (Array.isArray(ids)) setChecked(new Set(ids.filter((v) => typeof v === "string")));
    } catch {
      /* stockage indisponible → checklist vierge */
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(LS_CHECKED, JSON.stringify([...next]));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChecked(new Set());
    try {
      localStorage.removeItem(LS_CHECKED);
    } catch {
      /* noop */
    }
  }, []);

  const checkedIds = useMemo(() => [...checked], [checked]);
  const progress = useMemo(() => computeProgress(checkedIds), [checkedIds]);
  const tier = getCtaTier(progress.pct);
  const ctas = getCtas(tier);

  // Téléchargement : vue print dans un iframe caché → boîte de dialogue
  // d'impression du navigateur (« Enregistrer en PDF »). Aucun email requis.
  const download = useCallback(() => {
    const html = buildChecklistPrintHtml(isEn ? "en" : "fr", [...checked]);
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) {
      iframe.remove();
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();
    // Petit délai : laisse le document se poser avant d'imprimer.
    window.setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      // Nettoyage différé : la boîte de dialogue lit le document de l'iframe.
      window.setTimeout(() => iframe.remove(), 60_000);
    }, 80);
    setDownloaded(true);
    track("checklist_geo_download", { done: progress.done, pct: progress.pct });
  }, [checked, isEn, progress.done, progress.pct]);

  // Preuve de valeur d'abord : la modale n'est montée qu'après un vrai
  // engagement (téléchargement, ou au moins 3 actions cochées).
  const engaged = downloaded || progress.done >= 3;

  return (
    <Reveal className="w-full border border-dark-gray bg-obsidian">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-dark-gray px-6 py-6 lg:px-8">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-dark-gray bg-jet">
          <ListChecks className="h-[1.125rem] w-[1.125rem] text-vermilion" />
        </div>
        <div>
          <p className={LABEL_MONO}>
            {isEn ? "The GEO checklist" : "La checklist GEO"}
          </p>
          <p className="mt-2 font-inter-tight text-[15px] leading-relaxed text-foreground">
            {isEn
              ? "24 concrete actions to get cited by ChatGPT, Perplexity and AI Overviews, grouped by the 4 GEO priorities for an SMB: AI crawler access, answer pages, structure and markup, external authority. Check off as you go — your progress is saved on this device."
              : "24 actions concrètes pour être cité par ChatGPT, Perplexity et les AI Overviews, groupées par les 4 chantiers GEO d'une PME : accès des robots IA, pages-réponses, structure et balisage, autorité externe. Cochez au fil de l'eau — votre avancement est conservé sur cet appareil."}
          </p>
        </div>
      </div>

      {/* Barre de progression + actions */}
      <div className="border-b border-dark-gray px-6 py-5 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="min-w-[220px] flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className={LABEL_MONO}>{isEn ? "Progress" : "Avancement"}</p>
              <p className="font-mono text-[11px] text-mid-gray" aria-hidden="true">
                {progress.done}/{progress.total}
              </p>
            </div>
            <div
              className="mt-2 h-1.5 w-full border border-dark-gray bg-jet"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-valuenow={progress.done}
              aria-valuetext={
                isEn
                  ? `${progress.done} of ${progress.total} actions done`
                  : `${progress.done} actions sur ${progress.total} faites`
              }
              aria-label={isEn ? "Checklist progress" : "Avancement de la checklist"}
            >
              <div
                className="h-full bg-accent-secondary transition-[width] duration-300"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={download} className={BTN_PRIMARY}>
              <FileDown size={14} />
              {isEn ? "Download the checklist (PDF)" : "Télécharger la checklist (PDF)"}
            </button>
            <button
              type="button"
              onClick={reset}
              className={BTN_GHOST}
              disabled={progress.done === 0}
            >
              <RotateCcw size={13} />
              {isEn ? "Reset" : "Tout décocher"}
            </button>
          </div>
        </div>
        <p className="mt-3 font-inter-tight text-[12px] leading-relaxed text-mid-gray">
          {isEn
            ? "The download opens your browser's print dialog: choose \"Save as PDF\". Your checked items are included."
            : "Le téléchargement ouvre la boîte d'impression du navigateur : choisissez « Enregistrer en PDF ». Vos cases cochées sont reprises."}
        </p>
      </div>

      {/* Les 4 chantiers */}
      {SECTIONS.map((section) => {
        const items = ITEMS.filter((i) => i.section === section.id);
        const sp = computeSectionProgress(checkedIds, section.id);
        return (
          <fieldset
            key={section.id}
            className="border-b border-dark-gray px-6 py-6 last-of-type:border-b-0 lg:px-8"
          >
            <legend className="sr-only">
              {section.order}. {isEn ? section.titleEn : section.titleFr}
            </legend>
            <div className="mb-4 flex items-baseline justify-between gap-4" aria-hidden="true">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent-secondary">
                  {isEn ? "Priority" : "Chantier"} {section.order}/4
                </p>
                <p className="mt-1 font-inter-tight text-[15px] font-medium text-foreground">
                  {isEn ? section.titleEn : section.titleFr}
                </p>
                <p className="mt-0.5 font-inter-tight text-[13px] text-mid-gray">
                  {isEn ? section.subtitleEn : section.subtitleFr}
                </p>
              </div>
              <p className="shrink-0 font-mono text-[11px] text-mid-gray">
                {sp.done}/{sp.total}
              </p>
            </div>
            <ul className="border border-dark-gray">
              {items.map((item, i) => {
                const isChecked = checked.has(item.id);
                const badge = levelBadge(item.level, isEn);
                return (
                  <li
                    key={item.id}
                    className={`border-l-[3px] ${
                      isChecked ? "border-l-accent-secondary" : "border-l-transparent"
                    } ${i < items.length - 1 ? "border-b border-b-dark-gray" : ""}`}
                  >
                    <label className="group flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-jet">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(item.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-secondary ${
                          isChecked
                            ? "border-accent-secondary bg-accent-secondary text-obsidian"
                            : "border-mid-gray bg-jet group-hover:border-foreground"
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`font-inter-tight text-sm leading-relaxed ${
                            isChecked ? "text-mid-gray line-through decoration-dark-gray" : "text-foreground"
                          }`}
                        >
                          {isEn ? item.actionEn : item.actionFr}{" "}
                          <span
                            className={`ml-1 inline-block whitespace-nowrap border px-1.5 py-px align-middle font-mono text-[9px] uppercase tracking-[0.12em] no-underline ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </span>
                        <span className="mt-0.5 block font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                          {isEn ? item.whyEn : item.whyFr}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}

      {/* Prochaine étape (adaptée à l'avancement) */}
      <div className="border-t border-dark-gray px-6 py-8 lg:px-8">
        <p className={`${LABEL_MONO} mb-3`}>{isEn ? "Next step" : "Prochaine étape"}</p>
        <p
          className="mb-5 max-w-2xl font-inter-tight text-[14px] leading-relaxed text-foreground"
          role="status"
          aria-live="polite"
        >
          {isEn ? ctas.lead.en : ctas.lead.fr}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={ctas.primary.href as LinkHref} className={BTN_PRIMARY}>
            {isEn ? ctas.primary.en : ctas.primary.fr}
            <ArrowRight size={14} />
          </Link>
          <Link href={ctas.secondary.href as LinkHref} className={BTN_GHOST}>
            {isEn ? ctas.secondary.en : ctas.secondary.fr}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        {engaged && <ConseilModal source="checklist-geo" />}
      </div>
    </Reveal>
  );
}
