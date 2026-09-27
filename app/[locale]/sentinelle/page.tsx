import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { InscriptionSentinelle } from "@/components/sentinelle/inscription-form";
import { OFFER_AMOUNT_CENTS, OFFER_PRICE_LABEL } from "@/lib/sentinelle-offer";
import { CTA_ECHANGE } from "@/lib/visio-conseil";

// Prix lu dans sa source pour la métadonnée et le JSON-LD anglais : le libellé
// OFFER_PRICE_LABEL n'existe qu'en français.
const OFFER_PRICE_LABEL_EN = `€${OFFER_AMOUNT_CENTS / 100}/month`;

// ─────────────────────────────────────────────────────────────────────────────
// Page d'offre du produit Sentinelle (19 €/mois, newsletter bimensuelle).
//
// Elle vit dans la vitrine — pas dans app/(sentinelle)/ — parce que c'est une
// page de vente : elle a besoin du header, du footer, de l'i18n et du SEO du
// site. Le groupe (sentinelle) est réservé au produit lui-même (scan, admin,
// espace client), qui est en noindex.
//
// Contenu réécrit le 2026-09-27 (demande d'Agathe) : h1 « La veille techno de votre
// site web », et une page qui dit vite et concrètement ce qu'est
// la lettre. Ce qu'elle promet suit la structure réelle d'un numéro
// (src/sentinelle/lettre/schema.ts) : douze points passés en revue, chacun
// conclu par agir, surveiller ou non concerné ; trois actions au plus ; les
// scénarios, l'échéancier et les questions. La liste des douze points est
// recopiée de AXES : la vitrine n'importe pas @sentinelle/* (règle
// d'isolation, docs/sentinelle/CLAUDE.md). Si AXES change, changer POINTS.
//
// ⚠️ AVANT_LANCEMENT : le produit n'est pas encore livré (scanner en phase 2,
// paiement en phase 5). Tant que ce drapeau est à true, la page est en noindex
// et le CTA principal renvoie vers /contact plutôt que vers un parcours qui
// n'aboutit pas.
//
// Le jour du lancement, trois gestes solidaires — les faire ensemble, sinon la
// page devient indexable sans être atteignable, ou l'inverse :
//   1. passer AVANT_LANCEMENT à false (rétablit /scan comme CTA froid) ;
//   2. l'entrée sitemap — FAIT (2026-08-15, `singlePages` dans
//      app/sitemap.xml/route.ts, avec la page d'offre /veille) ;
//   3. navigation — la veille entre dans le header via /veille (2026-08-15),
//      qui présente les deux lettres et renvoie ici pour le détail.
// ─────────────────────────────────────────────────────────────────────────────
const AVANT_LANCEMENT = false;

// Sentinelle avait été retirée du SEO/GEO le 2026-09-04. Elle y revient le
// 2026-09-27 (ADR-012) : elle revient dans l'index. Le même jour (ADR-013),
// elle sort du catalogue d'offres : elle se vend depuis le rapport de
// l'analyse du site et reste incluse dans le suivi et maintenance. Cette page
// reste sa fiche produit. Entrée sitemap et lignes llms conservées. Repasser ce
// drapeau à true pour la retirer de nouveau (et retirer ces entrées).
const RETIREE_DU_SEO = false;

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
      ? `Sentinelle: the tech watch letter for your website, ${OFFER_PRICE_LABEL_EN}`
      : `Sentinelle : la lettre de veille techno de votre site web, ${OFFER_PRICE_LABEL}`,
    description: isEn
      ? `Twice a month, a letter on your site: what changed around it, what it means for you, what to do. Plus an alert when a flaw hits a component you run. Reviewed before sending. ${OFFER_PRICE_LABEL_EN}.`
      : `Deux fois par mois, une lettre sur votre site : ce qui a changé autour de lui, ce que ça change pour vous, quoi faire. Plus une alerte quand une faille touche un composant installé chez vous. Relue avant envoi. ${OFFER_PRICE_LABEL}.`,
    path: "/sentinelle",
    keywords: isEn
      ? [
          "website tech watch letter",
          "WordPress monitoring",
          "website vulnerability alerts",
          "website component watch",
        ]
      : [
          "lettre de veille techno",
          "veille techno site web",
          "surveillance site WordPress",
          "alerte faille plugin WordPress",
          "veille composants site web",
          "refonte ou maintenance site web",
          "quand refondre son site",
        ],
    locale,
    // Contenu FR uniquement pour l'instant ; noindex tant que le produit n'est
    // pas livrable (AVANT_LANCEMENT) ou retiré du SEO/GEO (RETIREE_DU_SEO).
    noindex: isEn || AVANT_LANCEMENT || RETIREE_DU_SEO,
    // Pas d'alternate hreflang EN : la locale EN est en noindex.
    alternateLocales: ["fr"],
  });
}

/** La lettre en quatre faits : quand, sur quoi, par qui, combien. */
const EN_BREF = [
  { terme: "Quand", valeur: "Le 1er et le 15 de chaque mois, par e-mail." },
  { terme: "Sur quoi", valeur: "Votre site : les composants qu'il utilise vraiment, croisés avec l'actualité de la quinzaine." },
  { terme: "Par qui", valeur: "Préparée avec l'IA, relue et corrigée par moi avant chaque envoi." },
  { terme: "Combien", valeur: `${OFFER_PRICE_LABEL}, sans engagement.` },
];

/** Ce que contient un numéro, dans l'ordre de lecture. */
const DANS_LA_LETTRE = [
  {
    index: "01",
    titre: "Ce qui a changé autour de vous",
    corps:
      "Les faits de la quinzaine dans votre écosystème : une faille, une fin de support, une nouvelle règle, ce que font vos concurrents. Chacun est daté et porte sa source.",
  },
  {
    index: "02",
    titre: "Votre site en douze points",
    corps:
      "Chaque fait est rapporté à votre site et à vos enjeux : sécurité, hébergement, visibilité, coûts… Chaque point se conclut par un mot : agir, surveiller ou non concerné.",
  },
  {
    index: "03",
    titre: "Quoi faire",
    corps:
      "Trois actions au plus, par ordre d'urgence. Pour chacune : ce que ça change chez vous, et si vous pouvez la faire seul.",
  },
  {
    index: "04",
    titre: "La suite",
    corps:
      "Consolider, faire évoluer ou refondre : trois scénarios avec leur ordre de coût, un échéancier à six mois et trois questions à poser à votre prestataire.",
  },
];

/** Les douze points, recopiés de AXES (src/sentinelle/lettre/schema.ts). */
const POINTS = [
  "Socle technique et architecture",
  "Sécurité et maintenance",
  "Hébergement, infrastructure et souveraineté",
  "Visibilité, recherche et acquisition",
  "IA intégrée au projet",
  "Réglementaire et conformité",
  "Données, mesure et consentement",
  "Expérience, performance et accessibilité",
  "Contenu, éditorial et confiance",
  "Coûts, prestataires et marché",
  "Dépendance fournisseur et réversibilité",
  "Gouvernance du projet et contractuel",
];

const GARANTIES = [
  {
    titre: "Écrite pour vous",
    corps: "« Votre formulaire de contact », pas « le endpoint REST du plugin ».",
  },
  {
    titre: "Des faits vérifiés",
    corps: "Un fait sans date ni source ne peut pas entrer dans la lettre : le code le bloque.",
  },
  {
    titre: "Relue avant envoi",
    corps: "Rien ne part automatiquement. Je relis, je corrige, puis j'envoie.",
  },
  {
    titre: "Pas de fausse alerte",
    corps: "Une alerte ne part que si votre version est réellement touchée et la faille jugée sévère.",
  },
];

const LIMITES = [
  "La lettre part de ce que votre site montre publiquement : aucun test d'intrusion, aucun accès demandé.",
  "Une analyse publique repère en général 50 à 70 % des extensions installées. Votre fiche est complétée avec vous à l'activation.",
  "Sentinelle prévient, elle n'intervient pas. Pour qu'on intervienne sur votre site, le suivi et maintenance inclut Sentinelle.",
];

export default async function SentinellePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: "Sentinelle", url: "/sentinelle" },
  ];

  // TODO lancement : repointer le CTA froid sur /scan quand le scanner existe
  // (phase 2). D'ici là, /contact est le seul parcours qui aboutit.
  const ctaFroid = AVANT_LANCEMENT ? "/contact" : "/scan";
  const ctaFroidLibelle = AVANT_LANCEMENT
    ? "Être prévenu du lancement"
    : "Analysez votre site en 2 minutes";

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      {/* Schéma Service aligné sur le contenu visible : la lettre de veille,
          19 €/mois (source unique du tarif : lib/sentinelle-offer.ts). */}
      <ServiceJsonLd
        locale={locale}
        name={
          isEn
            ? "Sentinelle: the tech watch letter for your website"
            : "Sentinelle : la lettre de veille techno de votre site web"
        }
        description={
          isEn
            ? `A letter on your site on the 1st and 15th of each month: what changed around it, twelve points each concluded by act, watch or not concerned, three actions at most and the options ahead (consolidate, evolve or rebuild). An alert between two letters when a severe flaw hits a component you run. Reviewed by a human before sending. ${OFFER_PRICE_LABEL_EN}, no commitment.`
            : `Une lettre sur votre site le 1er et le 15 de chaque mois : ce qui a changé autour de lui, douze points conclus chacun par agir, surveiller ou non concerné, trois actions au plus et les scénarios pour la suite (consolider, faire évoluer ou refondre). Une alerte entre deux lettres quand une faille sévère touche un composant installé chez vous. Relue par un humain avant envoi. ${OFFER_PRICE_LABEL}, sans engagement.`
        }
        serviceType={isEn ? "Technology watch" : "Veille technologique"}
        url="/sentinelle"
      />

      {/* ── Héros : ce qu'est la lettre, en deux phrases ─────────────────── */}
      <BlueprintSection ticks innerClassName="px-6 py-16 lg:px-12 lg:py-24">
        <SectionHeading
          index="№ 00"
          as="h1"
          kicker="Sentinelle"
          title={
            <>
              La veille techno de{" "}
              <em className="font-normal not-italic text-accent-secondary">votre site web</em>
            </>
          }
          description="Deux fois par mois, une lettre sur votre site : ce qui a changé autour de lui, ce que ça change pour vous, et quoi faire. Entre deux lettres, une alerte si une faille touche un composant installé chez vous."
        />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Premier bouton de chaque héros : l'échange gratuit (Calendly). */}
          <a
            href={CTA_ECHANGE.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-accent-secondary bg-accent-secondary px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-obsidian transition-opacity hover:opacity-90"
          >
            {CTA_ECHANGE.label.fr}
          </a>
          <Link
            href={ctaFroid}
            className="inline-flex items-center justify-center border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground"
          >
            {ctaFroidLibelle}
          </Link>
          <Link
            href="#dans-la-lettre"
            className="inline-flex items-center justify-center border border-dark-gray px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-foreground"
          >
            Voir ce qu'elle contient
          </Link>
        </div>

        <dl className="mt-12 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 lg:grid-cols-4">
          {EN_BREF.map((item) => (
            <div key={item.terme} className="bg-obsidian p-5">
              <dt className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">
                {item.terme}
              </dt>
              <dd className="mt-2 font-inter-tight text-base leading-relaxed text-foreground/85">
                {item.valeur}
              </dd>
            </div>
          ))}
        </dl>
      </BlueprintSection>

      {/* ── Ce que contient un numéro ────────────────────────────────────── */}
      <BlueprintSection
        id="dans-la-lettre"
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 01"
          kicker="Dans chaque lettre · quatre parties"
          title="La veille de votre écosystème, rapportée à votre site"
          description="Sentinelle suit l'actualité technique et stratégique de ce qui entoure votre site : ses technologies, votre secteur, vos concurrents. Chaque lettre ne garde que ce qui vous touche, et le traduit en enjeux pour votre site."
        />

        <ol className="mt-12 grid gap-px border border-dark-gray bg-dark-gray md:grid-cols-2 lg:grid-cols-4">
          {DANS_LA_LETTRE.map((bloc) => (
            <li key={bloc.index} className="bg-jet p-6 lg:p-8">
              <span className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">
                {bloc.index}
              </span>
              <h3 className="mt-4 text-xl font-light tracking-tight text-foreground">{bloc.titre}</h3>
              <p className="mt-3 font-inter-tight text-base leading-relaxed text-mid-gray">{bloc.corps}</p>
            </li>
          ))}
        </ol>

        {/* Les douze points : détail en accordéon natif, présent dans le HTML. */}
        <details className="group mt-8 border border-dark-gray">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-mono text-2xs uppercase tracking-[0.14em] text-foreground hover:bg-obsidian [&::-webkit-details-marker]:hidden">
            Les douze points passés en revue
            <span aria-hidden="true" className="text-lg font-light text-mid-gray transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <ol className="grid gap-x-8 gap-y-2 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
            {POINTS.map((point, i) => (
              <li key={point} className="flex gap-3 font-inter-tight text-base text-mid-gray">
                <span className="font-mono text-2xs leading-6 text-accent-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {point}
              </li>
            ))}
          </ol>
        </details>
      </BlueprintSection>

      {/* ── Un exemple : à quoi ressemble un point ───────────────────────── */}
      <BlueprintSection
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 02"
          kicker="Exemple"
          title="À quoi ressemble un point"
          description="Exemple fictif, au format d'une lettre réelle."
        />

        <figure className="mt-10 max-w-3xl border border-l-[3px] border-dark-gray border-l-accent-secondary bg-jet/40 p-6 lg:p-8">
          <p className="flex flex-wrap items-center gap-3 font-mono text-2xs uppercase tracking-[0.14em] text-mid-gray">
            <span>02 · Sécurité et maintenance</span>
            <span className="border border-accent-secondary/60 bg-accent-secondary/10 px-2 py-0.5 text-accent-secondary">
              Agir
            </span>
          </p>
          <p className="mt-4 font-inter-tight text-base leading-relaxed text-foreground/90 md:text-lg">
            Une faille a été publiée le 12 sur l&apos;extension qui gère votre formulaire de
            contact. Votre version est concernée ; la suivante la corrige. Mise à jour
            depuis votre administration, un quart d&apos;heure avec la vérification du
            formulaire : vous pouvez la faire seul.
          </p>
          <p className="mt-3 font-mono text-2xs tracking-[0.06em] text-mid-gray">
            Source : l&apos;avis de sécurité, lien et date dans la lettre.
          </p>
        </figure>
      </BlueprintSection>

      {/* ── Comment elle est faite ───────────────────────────────────────── */}
      <BlueprintSection
        tone="jet"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 03"
          kicker="Comment elle est faite"
          title="Lisible sans être développeur"
        />

        <div className="mt-10 grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 lg:grid-cols-4">
          {GARANTIES.map((bloc) => (
            <div key={bloc.titre} className="bg-jet p-6">
              <h3 className="text-lg font-light tracking-tight text-foreground">{bloc.titre}</h3>
              <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">{bloc.corps}</p>
            </div>
          ))}
        </div>
      </BlueprintSection>

      {/* ── Prix et inscription : une décision ───────────────────────────
          Plus de paiement en ligne (2026-09-27) : une demande d'inscription,
          validée à la main, puis une facture. L'ancre #inscription est la
          cible des liens « s'inscrire » de l'espace abonné. */}
      <BlueprintSection
        id="inscription"
        className="border-t border-dark-gray"
        innerClassName="px-6 py-14 lg:px-12 lg:py-20"
      >
        <SectionHeading
          index="№ 04"
          kicker="Tarif et inscription"
          title="19 € par mois"
          description="Les deux lettres mensuelles et les alertes sont comprises. Facturé chaque mois, sans engagement : un message suffit pour arrêter."
        />

        <p className="mt-8 max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray">
          Laissez vos coordonnées : je valide votre inscription, je vous envoie la
          facture, et un e-mail vous ouvre votre espace. Une question avant de
          vous lancer ?{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-foreground">
            Écrivez-moi
          </Link>
          .
        </p>

        <div className="mt-8">
          <InscriptionSentinelle />
        </div>

        <ul className="mt-12 max-w-3xl space-y-4">
          {LIMITES.map((limite) => (
            <li
              key={limite}
              className="border-l border-dark-gray pl-5 font-inter-tight text-base leading-relaxed text-mid-gray"
            >
              {limite}
            </li>
          ))}
        </ul>
      </BlueprintSection>
    </main>
  );
}
