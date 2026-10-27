import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, KeyRound, Download, ShieldCheck } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { BlueprintSection, SectionHeading, Separator } from "@/components/aspect/section";
import { PageHero, HERO_BTN_PRIMARY, HERO_BTN_SECONDARY } from "@/components/aspect/page-hero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { CTO_PATH } from "@/lib/cto-externalise";
import { MAINTENANCE_PATH } from "@/lib/maintenance-offer";
import { CTA_CHAUD, CTA_ECHANGE } from "@/lib/visio-conseil";

// ─────────────────────────────────────────────────────────────────────────────
// Page « Espace client » — la visite de l'espace en ligne, et l'aiguillage vers
// les deux connexions (charte v1.4, ADR-012).
//
// Double rôle :
//   – pour le prospect, une PREUVE : ce qu'il verra chaque mois après la
//     signature (règle d'or : prouver avant de demander) ;
//   – pour le client, l'accès : lien « Espace client » du header et du footer.
//
// L'espace des accompagnements (/espace-direction, src/cto/) vit hors de
// app/[locale]/ : balise <a>, jamais le Link i18n (qui donnerait /en/espace…).
// Le lien vers l'espace abonné Sentinelle a été retiré de cette page.
//
// Aucune capture d'un vrai client : l'aperçu est une vidéo de présentation
// (YouTube Short, intégrée en nocookie). Les rubriques décrites reprennent celles de l'espace (src/cto/espace/
// sections.ts) sans l'importer : la vitrine ne dépend pas du code de l'espace.
// Contenu FR uniquement (locale EN en noindex).
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 86400;

const ESPACE_ACCOMPAGNEMENT = "/espace-direction";
const VIDEO_ID = "vzhmhfr1JOY";

function Apercu() {
  // Short YouTube (format vertical 9:16), intégré dans la colonne de droite du
  // héros. Domaine nocookie + chargement différé : aucun impact sur les CWV.
  return (
    <figure className="m-0 mx-auto w-full max-w-[320px]">
      <div className="rounded-md bg-overlay-gray p-2 md:p-3">
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-sm border border-dark-gray bg-jet">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&playsinline=1`}
            title="Visite de l'espace client Next Impact"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
      <figcaption className="mt-3 font-inter-tight text-sm text-mid-gray">
        La visite de l&apos;espace en ligne en quelques secondes.
      </figcaption>
    </figure>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return generatePageMetadata({
    title: isEn
      ? "Client area: your reports, alerts and decisions in one place"
      : "Espace client : rapports, alertes et décisions",
    description: isEn
      ? "Every Next Impact engagement is tracked in an online workspace: audit, site health, monthly reports, decisions, watch letters. Downloadable at any time."
      : "Chaque prestation Next Impact se suit dans un espace en ligne : audit, état du site, rapports mensuels, décisions, lettres de veille. Téléchargeable à tout moment.",
    path: "/espace-client",
    keywords: isEn
      ? ["client area", "online workspace", "website maintenance report"]
      : ["espace client", "espace en ligne", "rapport de maintenance site web", "suivi de site web"],
    locale,
    noindex: isEn,
    alternateLocales: ["fr"],
  });
}

const RUBRIQUES = [
  {
    nom: "Missions",
    question: "Où en sont les travaux ?",
    corps: "La vue d'ensemble, les décisions prises et leur motif, votre audit complet avec sa roadmap.",
  },
  {
    nom: "Votre site",
    question: "Comment va mon site ?",
    corps: "Disponibilité, sauvegardes, mises à jour, failles connues, vitesse. Et les rapports de chaque mois.",
  },
  {
    nom: "Agir",
    question: "Que dois-je faire ?",
    corps: "Ce qui demande votre attention, ce qui attend votre arbitrage, les propositions chiffrées.",
  },
  {
    nom: "Veille",
    question: "Qu'est-ce qui change autour de moi ?",
    corps: "Les lettres et les alertes qui concernent vos composants, et les documents de référence.",
  },
];

const PAR_OFFRE = [
  {
    offre: "Audit + roadmap",
    href: "/conseil#architecture-projet-ia",
    ouvre: "Le rapport d'audit en entier, les préconisations et la roadmap, relisibles et téléchargeables.",
  },
  {
    offre: "Suivi et maintenance",
    href: MAINTENANCE_PATH,
    ouvre: "L'état de votre site mesure par mesure, les rapports mensuels, les lettres Sentinelle.",
  },
  {
    offre: "Expert technique externalisé",
    href: CTO_PATH,
    ouvre: "Les décisions, la cartographie de votre système, les arbitrages, les documents et la veille technique.",
  },
];

export default async function EspaceClientPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: isEn ? "Home" : "Accueil", url: "/" },
    { name: "Espace client", url: "/espace-client" },
  ];

  return (
    <main>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />

      <PageHero
        index="№ 00"
        kicker="Espace client"
        title={
          <>
            Tout ce que je fais pour vous,{" "}
            <em className="font-normal not-italic text-accent-secondary">au même endroit</em>.
          </>
        }
        description="Chaque prestation se suit dans un espace en ligne : l'audit, l'état de votre site, les rapports, les décisions, la veille. Vous y voyez ce qui a été fait, ce qui reste à décider, et vous pouvez tout télécharger."
        actions={
          <>
            {/* Premier bouton de chaque héros : l'échange gratuit (Calendly).
                La connexion suit, en filet. */}
            <a href={CTA_ECHANGE.href} target="_blank" rel="noopener noreferrer" className={HERO_BTN_PRIMARY}>
              {CTA_ECHANGE.label.fr}
            </a>
            <a href={ESPACE_ACCOMPAGNEMENT} className={HERO_BTN_SECONDARY}>
              <KeyRound size={14} aria-hidden />
              Me connecter
            </a>
          </>
        }
        aside={<Apercu />}
      />

      <Separator />

      {/* ── Les quatre rubriques ──────────────────────────────────────── */}
      <BlueprintSection>
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 01"
            kicker="Rangé par question"
            title={
              <>
                Quatre rubriques, <span className="text-accent-secondary">quatre questions que vous vous posez</span>.
              </>
            }
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {RUBRIQUES.map((r) => (
            <div key={r.nom} className="border-b border-dark-gray p-6 md:border-r lg:border-b-0 lg:last:border-r-0 lg:p-7">
              <p className="font-mono text-2xs uppercase tracking-[0.14em] text-accent-secondary">{r.nom}</p>
              <h3 className="mt-2 text-lg font-light tracking-tight text-foreground">« {r.question} »</h3>
              <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">{r.corps}</p>
            </div>
          ))}
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── Ce que chaque offre y ouvre ───────────────────────────────── */}
      <BlueprintSection tone="jet">
        <div className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
          <SectionHeading
            index="№ 02"
            kicker="Selon votre prestation"
            title={
              <>
                Ce que vous y trouvez, <span className="text-accent-secondary">offre par offre</span>.
              </>
            }
          />
        </div>
        <div>
          {PAR_OFFRE.map((o) => (
            <Link
              key={o.offre}
              href={o.href as Parameters<typeof Link>[0]["href"]}
              className="group flex flex-col gap-1 border-b border-dark-gray px-6 py-5 no-underline last:border-b-0 md:flex-row md:items-baseline md:gap-8 lg:px-8"
            >
              <span className="text-lg font-light tracking-tight text-foreground group-hover:text-accent-secondary md:w-72 md:shrink-0">
                {o.offre}
              </span>
              <span className="font-inter-tight text-base leading-relaxed text-mid-gray">{o.ouvre}</span>
            </Link>
          ))}
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── Sécurité et restitution ───────────────────────────────────── */}
      <BlueprintSection>
        <div className="grid md:grid-cols-2">
          <div className="border-b border-dark-gray p-6 md:border-b-0 md:border-r lg:p-8">
            <ShieldCheck className="h-5 w-5 text-accent-secondary" aria-hidden />
            <h3 className="mt-3 text-xl font-light tracking-tight text-foreground">Sans mot de passe</h3>
            <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
              Vous vous connectez par un lien reçu par e-mail, puis avec la clé d&apos;accès de votre appareil. Chaque personne a son propre accès, et vous voyez les appareils connectés.
            </p>
          </div>
          <div className="p-6 lg:p-8">
            <Download className="h-5 w-5 text-accent-secondary" aria-hidden />
            <h3 className="mt-3 text-xl font-light tracking-tight text-foreground">Tout se télécharge</h3>
            <p className="mt-2 font-inter-tight text-base leading-relaxed text-mid-gray">
              L&apos;ensemble de votre dossier se télécharge en un document. Si vous changez de prestataire, vous partez avec votre historique.
            </p>
          </div>
        </div>
      </BlueprintSection>

      <Separator />

      {/* ── Deux CTA, deux températures ───────────────────────────────── */}
      <BlueprintSection tone="jet" innerClassName="px-6 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="№ 03"
            kicker="Pas encore client"
            title={
              <>
                Commencez par <span className="text-accent-secondary">analyser votre site</span>.
              </>
            }
            description="Gratuit, deux minutes, aucun accès demandé."
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
