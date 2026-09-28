import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, FAQJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { PageHero, HERO_BTN_PRIMARY, HERO_BTN_SECONDARY } from "@/components/aspect/page-hero";
import { HeroNavCards, heroCardsEnfants } from "@/components/aspect/hero-nav-cards";
import { MEGA_SECTIONS } from "@/lib/mega-menu";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  CTO_BILLING_UNIT_CODE,
  CTO_COMMITMENT,
  CTO_PATH,
  CTO_PRICE,
  CTO_PRICE_CURRENCY,
  CTO_PRICE_VALUE,
  DELIVERABLES,
} from "@/lib/cto-externalise";
import {
  MAINTENANCE_BILLING_UNIT_CODE,
  MAINTENANCE_COMMITMENT,
  MAINTENANCE_PATH,
  MAINTENANCE_PRICE,
  MAINTENANCE_PRICE_CURRENCY,
  MAINTENANCE_PRICE_VALUE,
  MAINTENANCE_PRIX_VALIDES,
  MAINTENANCE_TIERS,
  maintenancePriceLabel,
} from "@/lib/maintenance-offer";
import { CTA_CHAUD, CTA_ECHANGE } from "@/lib/visio-conseil";
import { getSituation, packHref } from "@/lib/situations";

// ─────────────────────────────────────────────────────────────────────────────
// Page d'offre « Suivi et maintenance », et page d'atterrissage du moment
// « Gérer » du menu (charte v1.6, ADR-013 et ADR-014).
//
// h1 « Maintenir et évoluer » (demande d'Agathe du
// 2026-09-27). Ordre : douleur (description du héros) ; les deux services du
// moment (maintenir : suivi et maintenance, évoluer : expert technique
// externalisé) ; « La base de la qualité » : monitoring et veille, socle commun aux deux
// (les cinq mesures sont ce que l'espace en ligne affiche déjà) ; FAQ ; deux
// CTA de deux températures. Les paliers de chaque service vivent sur la page de
// son pack (components/packs/gerer-paliers.tsx), plus sur cette page.
//
// Toutes les valeurs viennent de lib/maintenance-offer.ts. Prix validés le
// 2026-09-27 (ADR-014) : la page est indexable. Si MAINTENANCE_PRIX_VALIDES
// repasse à false, elle retourne en noindex, hors sitemap et hors llms.
//
// Contenu FR uniquement pour l'instant (charte §3 : l'anglais suit la
// validation du français) ; la locale EN est en noindex, comme /sentinelle.
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 86400;

/** Un prix de source (« À partir de … ») repris en milieu de phrase. */
const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    // Le h1 (« Maintenir et évoluer ») précédé de la requête
    // principale, qui reste « maintenance WordPress ».
    title: isEn
      ? "WordPress maintenance: maintain and evolve your site"
      : "Maintenance WordPress : maintenir et évoluer",
    // Calibrée pour l'affichage SERP (≤ 160 caractères). Requête d'OFFRE
    // (« maintenance WordPress ») ; la requête de situation appartient à
    // /packs/site-a-tenir. La page porte les deux services du moment Gérer :
    // le suivi et maintenance en tête (prix lu dans lib/maintenance-offer.ts),
    // l'expert technique externalisé en second, sans son mot-clé principal,
    // qui appartient à /cto-externalise.
    description: isEn
      ? `Site monitored, backed up and kept current, with continuous watch: ${lowerFirst(MAINTENANCE_PRICE.en.amount)} ${MAINTENANCE_PRICE.en.period}. And a technical expert to decide what should evolve.`
      : `Site surveillé, sauvegardé, tenu à jour, avec veille en continu : ${lowerFirst(MAINTENANCE_PRICE.fr.amount)} ${MAINTENANCE_PRICE.fr.period}. Et un expert technique pour décider de ce qui doit évoluer.`,
    path: MAINTENANCE_PATH,
    keywords: isEn
      ? [
          "WordPress maintenance",
          "WordPress maintenance contract",
          "website care and maintenance",
          "website monitoring",
          "WordPress updates",
          "headless WordPress maintenance",
          "website maintenance and evolution",
        ]
      : [
          "maintenance WordPress",
          "contrat de maintenance WordPress",
          "suivi et maintenance site web",
          "maintenance site internet",
          "surveillance site web",
          "mise à jour WordPress",
          "sauvegarde site WordPress",
          "maintenance WordPress headless",
          "maintenance et évolution site web",
          "veille technique site web",
        ],
    locale,
    noindex: isEn || !MAINTENANCE_PRIX_VALIDES,
    alternateLocales: ["fr"],
  });
}

// Les cinq mesures, une ligne chacune : la preuve reste, le détail vit dans
// la FAQ et sur la page du pack.
const SURVEILLE = [
  { titre: "La disponibilité", corps: "Testée jour et nuit, alerte immédiate." },
  { titre: "Les sauvegardes", corps: "Chaque jour, hors de votre serveur." },
  { titre: "Les mises à jour", corps: "Vérifiées, annulées si une page casse." },
  { titre: "Les failles connues", corps: "Repérées et corrigées dans le délai du palier." },
  { titre: "La vitesse", corps: "Score Google relevé chaque mois." },
];

// Colonne droite du héros (page mère du moment « Gérer ») : ses pages
// enfants, et elles seules, les parcours du panneau du menu. Entretenir, puis
// piloter.
const HERO_CARDS = heroCardsEnfants(MEGA_SECTIONS.tenir, "fr");

// Les deux services du moment « Gérer », dans l'ordre du plus léger au plus
// engageant. Chaque carte mène aux paliers du service, sur la page de son pack.
// Les puces reprennent les titres des accordéons de la page de chaque offre
// (demande d'Agathe du 2026-09-27), lus dans leur source : les volets du pack
// Maintenance (lib/situations.ts) et les livrables de /cto-externalise
// (lib/cto-externalise.ts).
const SERVICES = [
  {
    href: packHref("site-a-tenir"),
    verbe: "Maintenir",
    nom: "Suivi et maintenance",
    corps:
      "Quelqu'un tient votre site : surveillance, sauvegardes, mises à jour vérifiées, corrections, rapport mensuel. Deux paliers, Essentiel et Actif.",
    // Les actions programmées se détaillent en sous-puces : les cartes de leur
    // volet (sauvegardes, mises à jour, correctifs ; demande d'Agathe du
    // 2026-09-27).
    points:
      getSituation("site-a-tenir")?.page.offres?.flatMap((o) =>
        o.volets.map((v) => ({
          titre: v.titre,
          sous: v.titre === "Actions programmées" ? v.cartes.map((c) => c.titre) : [],
        })),
      ) ?? [],
    prix: `${MAINTENANCE_PRICE.fr.amount} ${MAINTENANCE_PRICE.fr.period}`,
    engagement: MAINTENANCE_COMMITMENT.fr,
  },
  {
    href: packHref("decisions-techniques"),
    verbe: "Évoluer",
    nom: "Expert technique externalisé",
    corps:
      "Quelqu'un décide avec vous : ce qu'il faut faire évoluer, dans quel ordre, avec quels prestataires. Deux paliers, Référent et Direction technique.",
    // Les huit livrables regroupés en trois (demande d'Agathe du 2026-09-27).
    // Indices dans DELIVERABLES : les titres restent lus dans leur source.
    points: [
      { titre: "Connaître et sécuriser l'existant", livrables: [0, 5] },
      { titre: "Planifier et budgéter", livrables: [1, 4, 6] },
      { titre: "Décider et contrôler", livrables: [2, 3, 7] },
    ].map((g) => ({
      titre: g.titre,
      sous: g.livrables.map((i) => DELIVERABLES[i]?.fr.title).filter((t): t is string => Boolean(t)),
    })),
    prix: `${CTO_PRICE.fr.amount} ${CTO_PRICE.fr.period}`,
    engagement: `${CTO_COMMITMENT.fr}.`,
  },
];

const FAQ = [
  {
    question: "Suivi et maintenance ou expert technique : lequel choisir ?",
    answer:
      "Le suivi et maintenance entretient l'existant : mises à jour, sauvegardes, corrections. L'expert technique externalisé décide de l'existant : faut-il maintenir, refaire ou remplacer, dans quel ordre et à quel budget. Les deux se complètent.",
  },
  {
    question: "Mon site a été réalisé par quelqu'un d'autre, vous pouvez le suivre ?",
    answer:
      "Oui. Le suivi démarre par un état des lieux : inventaire des composants, première sauvegarde, rattrapage des mises à jour. S'il montre que le site n'est pas maintenable en l'état, je vous le dis, avec la prestation adaptée et son prix.",
  },
  {
    question: "Mon site est headless, ou c'est une web app : est-ce couvert ?",
    answer: `Oui, aux deux paliers, avec une grille à part : ${maintenancePriceLabel("essentiel", "headless", "fr")} au palier Essentiel, ${maintenancePriceLabel("actif", "headless", "fr")} au palier Actif. Le back-office et le site affiché sont deux environnements à tenir, chacun avec ses mises à jour.`,
  },
  {
    question: "Que comprend la veille en continu ?",
    answer:
      "Les composants installés sur votre site sont suivis : fins de support, failles publiées, évolutions qui vous concernent. Une alerte part quand l'un d'eux devient un risque, et deux lettres par mois disent ce que ça change pour la suite. C'est Sentinelle, incluse dans les deux paliers.",
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


  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <ServiceJsonLd
        locale={locale}
        name="Suivi et maintenance de site WordPress"
        description={`Disponibilité surveillée, sauvegarde quotidienne, mises à jour vérifiées, failles corrigées, veille en continu et rapport mensuel dans un espace en ligne. Deux paliers, ${MAINTENANCE_TIERS.map((tier) => tier.name.fr).join(" et ")}, ${lowerFirst(MAINTENANCE_PRICE.fr.amount)} ${MAINTENANCE_PRICE.fr.period}.`}
        serviceType="Maintenance de site web"
        url={MAINTENANCE_PATH}
        offer={{
          minPrice: MAINTENANCE_PRICE_VALUE,
          priceCurrency: MAINTENANCE_PRICE_CURRENCY,
          billingUnitCode: MAINTENANCE_BILLING_UNIT_CODE,
        }}
        // Les deux services réellement présentés sur la page (№ 01). L'expert
        // technique externalisé pointe vers sa fiche de référence (CTO_PATH),
        // qui porte son propre nœud Service : pas de second Service ici, pour
        // ne pas doublonner /cto-externalise.
        offerCatalog={{
          name: "Gérer : maintenir et évoluer",
          items: [
            {
              name: "Suivi et maintenance",
              description: SERVICES[0].corps,
              url: SERVICES[0].href,
              minPrice: MAINTENANCE_PRICE_VALUE,
              priceCurrency: MAINTENANCE_PRICE_CURRENCY,
              billingUnitCode: MAINTENANCE_BILLING_UNIT_CODE,
            },
            {
              name: "Expert technique externalisé",
              description: SERVICES[1].corps,
              url: CTO_PATH,
              minPrice: CTO_PRICE_VALUE,
              priceCurrency: CTO_PRICE_CURRENCY,
              billingUnitCode: CTO_BILLING_UNIT_CODE,
            },
          ],
        }}
      />
      <FAQJsonLd questions={FAQ} />

      {/* ── Héros : h1 demandé par Agathe le 2026-09-27 ; la douleur ouvre
          la description. ─────────────────────────────────────────────── */}
      <PageHero
        index="№ 00"
        kicker="Gérer · Maintenance et expertise"
        title={
          <>
            Maintenir et <em className="font-normal not-italic text-accent-secondary">évoluer</em>
          </>
        }
        description="Une mise à jour ratée ne devrait pas se découvrir par un client. Je surveille votre site, je le tiens à jour et je vous rends compte chaque mois dans un rapport lisible sans être développeur. Quand les décisions techniques s'accumulent, je les tranche avec vous et je pilote ce qui doit évoluer."
        actions={
          <>
            {/* L'échange gratuit en premier (Calendly, nouvel onglet) ; /scan vit
                hors de app/[locale]/ : balise <a>, pas le Link i18n. */}
            <a href={CTA_ECHANGE.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_PRIMARY}>
              {CTA_ECHANGE.label.fr}
              <ArrowRight size={14} />
            </a>
            <a href="/scan" className={HERO_BTN_SECONDARY}>
              Analysez votre site
            </a>
          </>
        }
        note={`${MAINTENANCE_PRICE.fr.amount} ${MAINTENANCE_PRICE.fr.period} · ${MAINTENANCE_COMMITMENT.fr}`}
        aside={<HeroNavCards label="Les prestations" cards={HERO_CARDS} fill />}
      />

      <Separator />

      {/* ── Les deux services : maintenir, évoluer ─────────────────── */}
      <BlueprintSection id="services">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 01"
            kicker="Deux services"
            title={
              <>
                Maintenir, <span className="text-accent-secondary">évoluer</span>.
              </>
            }
            description="La maintenance tient ce qui existe. L'expert technique décide de ce qui doit évoluer, et le pilote. Les deux reposent sur la même surveillance et la même veille."
          />
        </div>
        <div className="grid md:grid-cols-2">
          {SERVICES.map((svc, i) => (
            <Link
              key={svc.href}
              href={`${svc.href}#paliers`}
              className={
                i === 0
                  ? "group flex flex-col gap-2 border-b border-dark-gray p-6 no-underline md:border-b-0 md:border-r lg:p-8"
                  : "group flex flex-col gap-2 p-6 no-underline lg:p-8"
              }
            >
              <span className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">{svc.verbe}</span>
              <span className="text-2xl font-light tracking-tight text-foreground group-hover:text-accent-secondary">
                {svc.nom}
              </span>
              <span className="font-inter-tight text-base leading-relaxed text-mid-gray">{svc.corps}</span>
              {svc.points.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {svc.points.map((point) => (
                    <li
                      key={point.titre}
                      className="flex gap-3 font-inter-tight text-base leading-snug text-foreground/85"
                    >
                      <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-accent-secondary" />
                      <span className="flex flex-col gap-1">
                        {point.titre}
                        {point.sous.length > 0 && (
                          <ul className="flex flex-col gap-1">
                            {point.sous.map((sous) => (
                              <li key={sous} className="flex gap-2.5 text-sm text-mid-gray">
                                <span aria-hidden="true" className="mt-[0.6em] h-px w-2 shrink-0 bg-mid-gray" />
                                {sous}
                              </li>
                            ))}
                          </ul>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <span className="mt-auto pt-3 text-base text-foreground">{svc.prix}</span>
              <span className="font-inter-tight text-sm text-mid-gray">{svc.engagement}</span>
              <span className="pt-2 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary">
                Voir les paliers →
              </span>
            </Link>
          ))}
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── La base de la qualité : deux piliers, le monitoring et la veille
          techno en continu, socle des deux services (demande d'Agathe du
          2026-09-27). ─────────────────────────────────────────────────── */}
      <BlueprintSection tone="jet" id="surveille">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker="Inclus dans les deux services"
            title={
              <>
                La base de la <span className="text-accent-secondary">qualité</span>
              </>
            }
            description="Deux piliers : le monitoring dit l'état de votre site, la veille techno dit ce qui va le changer."
          />
        </div>
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col border-b border-dark-gray p-6 md:border-b-0 md:border-r lg:p-8">
            <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">Pilier 1</p>
            <h3 className="mt-2 text-2xl font-light tracking-tight text-foreground">Monitoring</h3>
            <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
              Cinq mesures, relevées chaque mois dans votre espace.
            </p>
            <ul className="mt-4 flex-1">
              {SURVEILLE.map((s) => (
                <li key={s.titre} className="border-t border-dark-gray py-2.5 font-inter-tight text-sm leading-snug">
                  <span className="text-foreground">{s.titre}</span>
                  <span className="text-mid-gray"> · {s.corps}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/espace-client"
              className="mt-4 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
            >
              Voir à quoi ressemble l&apos;espace en ligne →
            </Link>
          </div>
          <div id="veille" className="flex flex-col p-6 lg:p-8">
            <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">Pilier 2</p>
            <h3 className="mt-2 text-2xl font-light tracking-tight text-foreground">Veille techno en continu</h3>
            <p className="mt-2 flex-1 font-inter-tight text-base leading-relaxed text-mid-gray">
              Les composants installés chez vous sont suivis. Une faille publiée devient une alerte, puis une
              correction ; deux lettres par mois disent ce qui change pour votre site.
            </p>
            <Link
              href="/veille#gratuite"
              className="mt-4 font-mono text-2xs uppercase tracking-[0.08em] text-accent-secondary no-underline hover:text-foreground"
            >
              Lire la lettre de veille gratuite →
            </Link>
          </div>
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <BlueprintSection id="faq">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading index="№ 05" kicker="Questions fréquentes" title="Avant de confier votre site" />
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
            index="№ 06"
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
              Analysez votre site
              <ArrowRight size={14} />
            </a>
            <a href={CTA_CHAUD.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_SECONDARY}>
              {CTA_CHAUD.label.fr}
            </a>
          </div>
        </div>
      </BlueprintSection>
    </main>
  );
}
