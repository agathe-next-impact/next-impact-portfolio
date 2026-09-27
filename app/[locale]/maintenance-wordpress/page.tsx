import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { PageHero, HERO_BTN_PRIMARY, HERO_BTN_SECONDARY } from "@/components/aspect/page-hero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { CTO_PATH, CTO_PRICE } from "@/lib/cto-externalise";
import {
  MAINTENANCE_BILLING_UNIT_CODE,
  MAINTENANCE_COMMITMENT,
  MAINTENANCE_CONTACT_HREF,
  MAINTENANCE_MAX_SITES,
  MAINTENANCE_ONBOARDING,
  MAINTENANCE_PATH,
  MAINTENANCE_PRICE,
  MAINTENANCE_PRICE_CURRENCY,
  MAINTENANCE_PRICE_VALUE,
  MAINTENANCE_PRIX_VALIDES,
  MAINTENANCE_TIERS,
} from "@/lib/maintenance-offer";

// ─────────────────────────────────────────────────────────────────────────────
// Page d'offre « Suivi et maintenance » — et page d'atterrissage du moment
// « Tenir » du menu (charte v1.4, ADR-012).
//
// Ordre de conviction (charte §5, version courte) : douleur, ce qui est
// surveillé (la preuve : c'est ce que l'espace en ligne affiche déjà), les deux
// paliers, l'échelle « Tenir » (Sentinelle en dessous, l'expert au-dessus),
// FAQ, deux CTA de deux températures.
//
// Toutes les valeurs viennent de lib/maintenance-offer.ts. Tant que
// MAINTENANCE_PRIX_VALIDES vaut false, la page est en noindex (prix proposés,
// pas encore validés) et reste hors sitemap et hors llms.
//
// Contenu FR uniquement pour l'instant (charte §3 : l'anglais suit la
// validation du français) ; la locale EN est en noindex, comme /sentinelle.
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    title: isEn
      ? "WordPress maintenance: your site monitored, updated and backed up"
      : "Maintenance WordPress : votre site surveillé, à jour et sauvegardé",
    description: isEn
      ? "Uptime monitoring, daily backups, checked updates, vulnerabilities fixed, a readable monthly report in your online workspace. From €89 excl. VAT per month."
      : "Disponibilité surveillée, sauvegarde quotidienne, mises à jour vérifiées, failles corrigées, rapport mensuel lisible dans votre espace en ligne. À partir de 89 € HT par mois.",
    path: MAINTENANCE_PATH,
    keywords: isEn
      ? ["WordPress maintenance", "WordPress maintenance contract", "website monitoring", "WordPress updates"]
      : [
          "maintenance WordPress",
          "contrat de maintenance WordPress",
          "maintenance site internet",
          "surveillance site web",
          "mise à jour WordPress",
          "sauvegarde site WordPress",
          "maintenance WordPress headless",
        ],
    locale,
    noindex: isEn || !MAINTENANCE_PRIX_VALIDES,
    alternateLocales: ["fr"],
  });
}

const SURVEILLE = [
  {
    titre: "La disponibilité",
    corps: "Votre site est testé en continu, jour et nuit. S'il tombe, je suis alertée tout de suite.",
  },
  {
    titre: "Les sauvegardes",
    corps: "Une copie complète chaque jour, stockée hors de votre serveur, prête à être restaurée.",
  },
  {
    titre: "Les mises à jour",
    corps: "WordPress, extensions et thème mis à jour, puis vérifiés : une mise à jour qui casse une page est annulée.",
  },
  {
    titre: "Les failles connues",
    corps: "Chaque faille publiée sur un composant installé chez vous est repérée et corrigée dans le délai du palier.",
  },
  {
    titre: "La vitesse",
    corps: "Le score de vitesse Google est relevé chaque mois : une dégradation se voit avant de se sentir.",
  },
];

const FAQ = [
  {
    question: "Mon site a été réalisé par quelqu'un d'autre, vous pouvez le suivre ?",
    answer:
      "Oui. Le suivi démarre par un état des lieux : inventaire des composants, première sauvegarde, rattrapage des mises à jour. S'il montre que le site n'est pas maintenable en l'état, je vous le dis, avec la trajectoire adaptée et son prix.",
  },
  {
    question: "Mon site est headless : est-ce couvert ?",
    answer:
      "Oui, au palier Actif, qui est obligatoire dans ce cas : le back-office WordPress et le site affiché sont deux environnements à tenir, chacun avec ses mises à jour.",
  },
  {
    question: "Quelle différence avec Sentinelle ?",
    answer:
      "Sentinelle vous prévient et vous conseille, elle n'intervient pas. Le suivi et maintenance agit : mises à jour, sauvegardes, corrections. Sentinelle est incluse dans les deux paliers.",
  },
  {
    question: "Que se passe-t-il si j'arrête ?",
    answer:
      "Vous gardez vos accès, vos sauvegardes et l'historique de vos rapports, téléchargeable depuis votre espace en ligne. Après les trois premiers mois, l'arrêt se fait au mois.",
  },
];

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: "Suivi et maintenance", url: MAINTENANCE_PATH },
  ];

  const onboarding = MAINTENANCE_ONBOARDING.fr;

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <ServiceJsonLd
        locale={locale}
        name="Suivi et maintenance de site WordPress"
        description="Disponibilité surveillée, sauvegarde quotidienne, mises à jour vérifiées, failles corrigées et rapport mensuel dans un espace en ligne. Deux paliers, à partir de 89 € HT par mois."
        serviceType="Maintenance de site web"
        url={MAINTENANCE_PATH}
        offer={{
          minPrice: MAINTENANCE_PRICE_VALUE,
          priceCurrency: MAINTENANCE_PRICE_CURRENCY,
          billingUnitCode: MAINTENANCE_BILLING_UNIT_CODE,
        }}
      />
      <FAQJsonLd questions={FAQ} />

      {/* ── Héros : la douleur ─────────────────────────────────────────── */}
      <PageHero
        index="№ 00"
        kicker="Tenir · Suivi et maintenance"
        title={
          <>
            Une mise à jour ratée ne devrait pas se découvrir{" "}
            <em className="font-normal not-italic text-accent-secondary">par un client</em>.
          </>
        }
        description="Je surveille votre site, je le mets à jour, je le sauvegarde, et je vous rends compte chaque mois dans un rapport que vous pouvez lire sans être développeur. Quand réparer ne suffit plus, je vous le dis."
        actions={
          <>
            {/* /scan vit hors de app/[locale]/ : balise <a>, pas le Link i18n. */}
            <a href="/scan" className={HERO_BTN_PRIMARY}>
              Analysez votre site en 2 minutes
              <ArrowRight size={14} />
            </a>
            <Link href={MAINTENANCE_CONTACT_HREF} className={HERO_BTN_SECONDARY}>
              Discutons de votre projet
            </Link>
          </>
        }
        note={`${MAINTENANCE_PRICE.fr.amount} ${MAINTENANCE_PRICE.fr.period} · ${MAINTENANCE_COMMITMENT.fr}`}
      />

      <Separator />

      {/* ── Ce qui est surveillé : la preuve ──────────────────────────── */}
      <BlueprintSection>
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 01"
            kicker="Ce qui est surveillé"
            title={
              <>
                Cinq mesures, <span className="text-accent-secondary">chaque mois dans votre espace</span>.
              </>
            }
            description="Ce ne sont pas des promesses : ce sont les mesures que votre espace en ligne affiche, section « État du site », avec leur date."
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5">
          {SURVEILLE.map((s) => (
            <div
              key={s.titre}
              className="border-b border-dark-gray p-6 md:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <h3 className="text-lg font-light tracking-tight text-foreground">{s.titre}</h3>
              <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">{s.corps}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-dark-gray px-6 py-5 lg:px-8">
          <Link
            href="/espace-client"
            className="font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
          >
            Voir à quoi ressemble l&apos;espace en ligne →
          </Link>
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── Les deux paliers ──────────────────────────────────────────── */}
      <BlueprintSection id="paliers">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker="Deux paliers"
            title={
              <>
                Selon ce que votre site <span className="text-accent-secondary">porte pour vous</span>.
              </>
            }
            description={MAINTENANCE_COMMITMENT.fr}
          />
        </div>
        <div className="grid md:grid-cols-2">
          {MAINTENANCE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.recommended
                  ? "border-b border-dark-gray bg-jet p-6 md:border-b-0 lg:p-8"
                  : "border-b border-dark-gray p-6 md:border-b-0 md:border-r lg:p-8"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Palier</p>
                {tier.recommended && (
                  <span className="rounded-full bg-accent-secondary px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-obsidian">
                    Le cas courant
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-3xl font-light tracking-tight text-foreground">{tier.name.fr}</h3>
              <p className="mt-3 text-xl tracking-tight text-foreground">{tier.price.fr}</p>
              <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">{tier.forWhom.fr}</p>
              <ul className="mt-6 flex flex-col gap-2">
                {tier.items.fr.map((item) => (
                  <li key={item} className="flex gap-2 font-inter-tight text-base leading-relaxed text-foreground/85">
                    <span className="shrink-0 pt-px font-mono text-2xs text-accent-secondary">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-dark-gray px-6 py-8 lg:px-8">
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">{onboarding.price}</p>
          <h3 className="mt-2 text-xl font-light tracking-tight text-foreground">{onboarding.title}</h3>
          <p className="mt-2 max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray">{onboarding.body}</p>
          <p className="mt-4 font-inter-tight text-sm text-mid-gray">
            {MAINTENANCE_MAX_SITES} sites suivis au maximum en même temps : chaque rapport est relu.
          </p>
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── L'échelle « Tenir » ───────────────────────────────────────── */}
      <BlueprintSection tone="jet">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 03"
            kicker="Tenir votre site dans la durée"
            title={
              <>
                Prévenir, entretenir, <span className="text-accent-secondary">décider</span>.
              </>
            }
            description="Sentinelle prévient, la maintenance intervient, l'expert technique tranche. Chaque marche inclut la veille de la précédente."
          />
        </div>
        <div className="grid md:grid-cols-3">
          <Link
            href="/sentinelle"
            className="group flex flex-col gap-2 border-b border-dark-gray p-6 no-underline md:border-b-0 md:border-r lg:p-8"
          >
            <span className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Prévenir</span>
            <span className="text-xl font-light tracking-tight text-foreground group-hover:text-accent-secondary">Sentinelle</span>
            <span className="font-inter-tight text-base leading-relaxed text-mid-gray">
              Vous avez déjà un prestataire, ou vous intervenez vous-même : deux lettres par mois et une alerte quand un composant devient un risque.
            </span>
            <span className="mt-auto pt-3 text-base text-foreground">{OFFER_PRICE_LABEL}</span>
          </Link>
          <div className="flex flex-col gap-2 border-b border-dark-gray bg-obsidian p-6 md:border-b-0 md:border-r lg:p-8">
            <span className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">Entretenir · cette page</span>
            <span className="text-xl font-light tracking-tight text-foreground">Suivi et maintenance</span>
            <span className="font-inter-tight text-base leading-relaxed text-mid-gray">
              Quelqu&apos;un tient votre site : surveillance, sauvegardes, mises à jour, corrections. Sentinelle incluse.
            </span>
            <span className="mt-auto pt-3 text-base text-foreground">
              {MAINTENANCE_PRICE.fr.amount} {MAINTENANCE_PRICE.fr.period}
            </span>
          </div>
          <Link
            href={CTO_PATH}
            className="group flex flex-col gap-2 p-6 no-underline lg:p-8"
          >
            <span className="font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">Décider chaque mois</span>
            <span className="text-xl font-light tracking-tight text-foreground group-hover:text-accent-secondary">
              Expert technique externalisé
            </span>
            <span className="font-inter-tight text-base leading-relaxed text-mid-gray">
              Les décisions techniques reviennent tous les mois : une direction technique à temps partagé, sans recruter.
            </span>
            <span className="mt-auto pt-3 text-base text-foreground">
              {CTO_PRICE.fr.amount} {CTO_PRICE.fr.period}
            </span>
          </Link>
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <BlueprintSection>
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading index="№ 04" kicker="Questions fréquentes" title="Avant de confier votre site" />
        </div>
        <div>
          {FAQ.map((f) => (
            <details key={f.question} className="group border-b border-dark-gray px-6 py-5 last:border-b-0 lg:px-8">
              <summary className="cursor-pointer list-none text-lg font-light tracking-tight text-foreground marker:hidden">
                {f.question}
              </summary>
              <p className="mt-3 max-w-3xl font-inter-tight text-base leading-relaxed text-mid-gray">{f.answer}</p>
            </details>
          ))}
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── Deux CTA, deux températures ───────────────────────────────── */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="№ 05"
            kicker="Par où commencer"
            title={
              <>
                Voyez d&apos;abord <span className="text-accent-secondary">de quoi votre site est fait</span>.
              </>
            }
            description="L'analyse est gratuite et ne demande aucun accès : elle liste les composants de votre site et ceux qui sont à risque."
          />
          <div className="flex flex-wrap gap-3 lg:shrink-0">
            <a href="/scan" className={HERO_BTN_PRIMARY}>
              Analysez votre site en 2 minutes
              <ArrowRight size={14} />
            </a>
            <Link href={MAINTENANCE_CONTACT_HREF} className={HERO_BTN_SECONDARY}>
              Discutons de votre projet
            </Link>
          </div>
        </div>
      </BlueprintSection>
    </main>
  );
}
