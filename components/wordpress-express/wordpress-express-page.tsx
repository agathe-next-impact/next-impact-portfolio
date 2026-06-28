"use client";

import { useLocale } from "next-intl";
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  CreditCard,
  Wrench,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { TICKETS, PACKS, FAQ, packHourlyRate, type PriceItem } from "@/lib/wordpress-express";
import InterventionForm from "@/components/wordpress-express/intervention-form";

function PriceCard({
  item,
  hint,
  isEn,
}: {
  item: PriceItem;
  hint?: string;
  isEn: boolean;
}) {
  const copy = isEn ? item.en : item.fr;
  const unit = item.unit ? (isEn ? item.unit.en : item.unit.fr) : "";
  return (
    <div
      className={
        "relative flex flex-col gap-3 border bg-jet p-6 " +
        (item.featured ? "border-vermilion" : "border-dark-gray")
      }
    >
      {copy.tag && (
        <span className="absolute right-4 top-4 border border-vermilion px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-vermilion">
          {copy.tag}
        </span>
      )}
      <h3 className="pr-20 text-base font-medium text-foreground">{copy.name}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-light tracking-tight text-foreground">{item.price}</span>
        {unit && <span className="font-mono text-xs text-mid-gray">{unit}</span>}
        <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">HT</span>
      </div>
      {hint && (
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">{hint}</p>
      )}
      <p className="font-inter-tight text-sm leading-relaxed text-mid-gray">{copy.desc}</p>
    </div>
  );
}

export default function WordpressExpressPage() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  const steps = isEn
    ? [
        ["Describe", "You fill in the form: the issue, the URL, the urgency. Two minutes, no commitment."],
        ["I reply within 24h", "A clear diagnosis and a secure payment link if I can act — otherwise a transparent quote."],
        ["I fix it", "Backup, intervention, then a written report of exactly what was done."],
      ]
    : [
        ["Vous décrivez", "Vous remplissez le formulaire : le problème, l'URL, l'urgence. Deux minutes, sans engagement."],
        ["Je réponds sous 24h", "Un diagnostic clair et un lien de paiement sécurisé si je peux intervenir — sinon un devis transparent."],
        ["J'interviens", "Sauvegarde, intervention, puis un compte-rendu écrit de ce qui a été fait."],
      ];

  const reassurance: Array<[typeof ShieldCheck, string]> = isEn
    ? [
        [ShieldCheck, "Backup before any intervention"],
        [FileText, "Clear quote beyond 1h — nothing billed without approval"],
        [Wrench, "Written report of what was done"],
        [Clock, "Reply within 24 business hours"],
        [CreditCard, "Payment link only if the request is validated"],
      ]
    : [
        [ShieldCheck, "Sauvegarde avant toute intervention"],
        [FileText, "Devis clair au-delà d'1h — rien facturé sans accord"],
        [Wrench, "Compte-rendu écrit de ce qui a été fait"],
        [Clock, "Réponse sous 24h ouvrées"],
        [CreditCard, "Lien de paiement seulement si la demande est validée"],
      ];

  return (
    <main>
      {/* § 01 — Hero */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
            № 01 — {isEn ? "WordPress support · No subscription" : "Dépannage WordPress · Sans abonnement"}
          </p>
          <h1 className="max-w-3xl text-3xl font-light leading-[1.05] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {isEn
              ? "A WordPress problem? On-demand help, no subscription."
              : "Un problème WordPress ? On intervient à la demande, sans abonnement."}
          </h1>
          <p className="mt-5 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
            {isEn
              ? "A down site, an update that breaks everything, a security hole, slowness, a display bug… Describe your need: I reply within 24 business hours with a clear diagnosis and, if I can fix it fast, a secure payment link. Otherwise, a transparent quote — no surprises."
              : "Site en panne, mise à jour qui casse tout, faille, lenteur, bug d'affichage… Décrivez votre besoin : je réponds sous 24h ouvrées avec un diagnostic clair et, si je peux régler vite, un lien de paiement sécurisé. Sinon, un devis transparent — sans surprise."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#demande"
              className="group inline-flex h-11 items-center gap-2 border border-vermilion bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white no-underline transition-colors hover:bg-vermilion-bright"
            >
              {isEn ? "Describe my problem" : "Décrire mon problème"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#tarifs"
              className="inline-flex h-11 items-center border border-dark-gray px-5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground no-underline transition-colors hover:border-mid-gray"
            >
              {isEn ? "See pricing" : "Voir les tarifs"}
            </a>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
            {isEn
              ? "Reply within 24 business hours · Backup before any action · Clear quote beyond 1h"
              : "Réponse sous 24h ouvrées · Sauvegarde avant toute action · Devis clair au-delà d'1h"}
          </p>
        </Reveal>
      </BlueprintSection>
      <Separator />

      {/* § 02 — Tickets à l'unité */}
      <BlueprintSection id="tarifs" tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 02"
          kicker={isEn ? "Pay as you go" : "Payez à l'usage"}
          title={isEn ? "À la carte tickets" : "Tickets à l'unité"}
          description={
            isEn
              ? "One-off intervention, no commitment. Every ticket includes analysis and a prior backup."
              : "Intervention ponctuelle, sans engagement. Chaque ticket inclut l'analyse et une sauvegarde préalable."
          }
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TICKETS.map((item) => (
            <StaggerItem key={item.id}>
              <PriceCard item={item} isEn={isEn} />
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 max-w-3xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Every ticket: analysis + prior backup. Simple fix included if doable in under 1h, otherwise a clear quote before any billing. Prices excl. VAT."
            : "Tous les tickets : analyse + sauvegarde préalable. Correction simple incluse si réalisable en moins d'1h, sinon devis clair avant toute facturation. Prix HT."}
        </p>
      </BlueprintSection>
      <Separator />

      {/* § 03 — Packs prépayés (crédits) */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "Prepaid credits" : "Crédits prépayés"}
          title={isEn ? "WordPress hour packs" : "Packs d'heures WordPress"}
          description={
            isEn
              ? "Hours usable on demand, no subscription. You keep a support reserve; I step in when you need it — at a degressive rate."
              : "Des heures utilisables à la demande, sans abonnement. Vous gardez une réserve de support ; j'interviens quand vous en avez besoin — à tarif dégressif."
          }
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PACKS.map((item) => {
            const hours = parseInt(item.id.match(/(\d+)h/)?.[1] ?? "0", 10);
            const hint = hours
              ? `${packHourlyRate(item, hours, locale)} ${isEn ? "effective" : "effectif"}`
              : undefined;
            return (
              <StaggerItem key={item.id}>
                <PriceCard item={item} hint={hint} isEn={isEn} />
              </StaggerItem>
            );
          })}
        </Stagger>
        <p className="mt-6 max-w-3xl font-inter-tight text-sm leading-relaxed text-mid-gray">
          {isEn
            ? "Pay once, draw on the hours as needed. Fewer micro-invoices, a predictable budget, and support always at hand. Prices excl. VAT."
            : "Vous payez une fois, vous puisez dans les heures au besoin. Moins de micro-factures, un budget prévisible, et du support toujours sous la main. Prix HT."}
        </p>
      </BlueprintSection>
      <Separator />

      {/* § 04 — Réparer ou refaire */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 04"
          kicker={isEn ? "Repair or rebuild" : "Réparer ou refaire ?"}
          title={
            isEn
              ? "Fix when enough. Rebuild only when justified."
              : "Réparer quand c'est suffisant. Refaire seulement quand c'est justifié."
          }
          description={
            isEn
              ? "Some WordPress problems are solved in a short intervention. Others reveal a technical base that is too fragile. In that case, Next Impact helps you decide whether to fix, optimize or restart on a healthier foundation."
              : "Certains problèmes WordPress se règlent en une intervention courte. D'autres révèlent une base technique trop fragile. Dans ce cas, Next Impact vous aide à décider s'il faut corriger, optimiser ou repartir sur une base plus saine."
          }
        />
      </BlueprintSection>
      <Separator />

      {/* § 04 — Comment ça marche */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 05"
          kicker={isEn ? "How it works" : "Comment ça marche"}
          title={isEn ? "From request to fix" : "De la demande à la correction"}
        />
        <Stagger className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-3">
          {steps.map(([title, desc], i) => (
            <StaggerItem key={title} className="bg-obsidian p-6 lg:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-vermilion">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-light tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">{desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </BlueprintSection>
      <Separator />

      {/* § 06 — Demande d'intervention */}
      <BlueprintSection tone="obsidian" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 06"
          kicker={isEn ? "Intervention request" : "Demande d'intervention"}
          title={isEn ? "Describe your need" : "Décrivez votre besoin"}
          description={
            isEn
              ? "No online payment. You send the request; I get back to you within 24 business hours with a payment link only if I validate it."
              : "Aucun paiement en ligne. Vous envoyez la demande ; je reviens sous 24h ouvrées avec un lien de paiement seulement si je la valide."
          }
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray lg:grid-cols-[1.5fr_1fr]">
          <div className="bg-obsidian p-6 lg:p-8">
            <Reveal>
              <InterventionForm id="demande" />
            </Reveal>
          </div>
          <div className="bg-obsidian p-6 lg:p-8">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
              {isEn ? "What I commit to" : "Mes engagements"}
            </p>
            <ul className="flex flex-col gap-4">
              {reassurance.map(([Icon, label]) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-secondary" />
                  <span className="font-inter-tight text-sm leading-snug text-mid-gray">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </BlueprintSection>
      <Separator />

      {/* § 07 — FAQ */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          index="№ 07"
          kicker="FAQ"
          title={isEn ? "Frequently asked questions" : "Questions fréquentes"}
        />
        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2">
          {FAQ.map((item) => {
            const c = isEn ? item.en : item.fr;
            return (
              <div key={c.q} className="bg-jet p-6 lg:p-8">
                <h3 className="text-base font-medium text-foreground">{c.q}</h3>
                <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">{c.a}</p>
              </div>
            );
          })}
        </div>
      </BlueprintSection>
    </main>
  );
}
