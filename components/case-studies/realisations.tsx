"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// Locale-agnostic project metadata
interface ProjectMeta {
  id: number;
  type: string;
  image: string;
  link: string;
  tab: string[];
}

const PROJECTS_META: ProjectMeta[] = [
  {
    id: 26,
    type: "wordpress",
    image: "/img/desktop-screen-arguinmarine.jpg",
    link: "/etudes-de-cas/arguin-marine",
    tab: ["wordpress"],
  },
  {
    id: 25,
    type: "webapp",
    image: "/img/desktop-screen-lapetitevitrine.jpg",
    link: "/etudes-de-cas/la-petite-vitrine",
    tab: ["webapp"],
  },
  {
    id: 24,
    type: "webapp",
    image: "/img/desktop-screen-peertopeer.jpg",
    link: "/etudes-de-cas/peer-to-peer",
    tab: ["webapp"],
  },
  {
    id: 23,
    type: "landing",
    image: "/img/desktop-screen-sejours-hermitage.jpg",
    link: "https://sejours.hermitagelelab.com/",
    tab: ["landing"],
  },
  {
    id: 22,
    type: "landing",
    image: "/img/desktop-screen-mariage-1.jpg",
    link: "https://www.nicocecile23mai2026.fr/",
    tab: ["landing"],
  },
  {
    id: 21,
    type: "landing",
    image: "/img/desktop-screen-mariage-2.jpg",
    link: "https://www.mariage-agathe-et-alain.fun/",
    tab: ["landing"],
  },
  {
    id: 20,
    type: "landing",
    image: "/img/desktop-screen-coiffeur.jpg",
    link: "https://artisan-coiffeur.lapetitevitrine.com/",
    tab: ["landing"],
  },
  {
    id: 19,
    type: "webapp",
    image: "/img/desktop-screen-panoramapub.png",
    link: "/etudes-de-cas/panorama-pub",
    tab: ["webapp"],
  },
  {
    id: 18,
    type: "webapp",
    image: "/img/mobile-screen-jeu-de-piste-hermitage.jpg",
    link: "/etudes-de-cas/hermitage-jeu-de-piste",
    tab: ["webapp"],
  },
  {
    id: 17,
    type: "headless",
    image: "/img/desktop-screen-cafe-citoyen.png",
    link: "/etudes-de-cas/cafe-citoyen",
    tab: ["headless"],
  },
  {
    id: 16,
    type: "headless",
    image: "/img/desktop-screen-comme-des-fous-jeux.jpg",
    link: "/etudes-de-cas/comme-des-fous-jeux",
    tab: ["headless"],
  },
  {
    id: 15,
    type: "headless",
    image: "/img/desktop-screen-comme-des-fous.jpg",
    link: "/etudes-de-cas/comme-des-fous",
    tab: ["headless"],
  },
  {
    id: 5,
    type: "headless",
    image: "/img/desktop-screen-next-event.webp",
    link: "/etudes-de-cas/next-event",
    tab: ["headless"],
  },
  {
    id: 3,
    type: "headless",
    image: "/img/desktop-screen-egc.webp",
    link: "/etudes-de-cas/les-etats-generaux-communaux",
    tab: ["headless"],
  },
  {
    id: 4,
    type: "headless",
    image: "/img/desktop-screen-lesdoleances.webp",
    link: "/etudes-de-cas/doleances",
    tab: ["headless"],
  },
  {
    id: 1,
    type: "wordpress",
    image: "/img/desktop-screen-proditec.webp",
    link: "/etudes-de-cas/proditec",
    tab: ["wordpress"],
  },
  {
    id: 2,
    type: "wordpress",
    image: "/img/desktop-screen-sowee.webp",
    link: "/etudes-de-cas/sowee",
    tab: ["wordpress"],
  },
  {
    id: 11,
    type: "wordpress",
    image: "/img/desktop-screen-infralliance.webp",
    link: "/etudes-de-cas/infralliance",
    tab: ["wordpress"],
  },
  {
    id: 12,
    type: "wordpress",
    image: "/img/desktop-screen-sdevo.webp",
    link: "/etudes-de-cas/sdevo",
    tab: ["wordpress"],
  },
  {
    id: 6,
    type: "wordpress",
    image: "/img/desktop-screen-salondelacarrosserie.webp",
    link: "/etudes-de-cas/salon-de-la-carrosserie",
    tab: ["wordpress"],
  },
  {
    id: 7,
    type: "wordpress",
    image: "/img/desktop-screen-hermitage.webp",
    link: "/etudes-de-cas/hermitage",
    tab: ["wordpress"],
  },
  {
    id: 8,
    type: "wordpress",
    image: "/img/desktop-screen-erp-services.webp",
    link: "/etudes-de-cas/erp-services",
    tab: ["wordpress"],
  },
  {
    id: 10,
    type: "wordpress",
    image: "/img/desktop-screen-wagner-hamisky.webp",
    link: "/etudes-de-cas/wagner-hamisky",
    tab: ["wordpress"],
  },
  {
    id: 14,
    type: "wordpress",
    image: "/img/desktop-screen-mediatico.webp",
    link: "/etudes-de-cas/mediatico",
    tab: ["wordpress"],
  },
  {
    id: 9,
    type: "wordpress",
    image: "/img/desktop-screen-senza-nature.webp",
    link: "/etudes-de-cas/senza-nature",
    tab: ["wordpress"],
  },
  {
    id: 13,
    type: "wordpress",
    image: "/img/desktop-screen-gem-connexion.webp",
    link: "/etudes-de-cas/connexion-plus",
    tab: ["wordpress"],
  },
];

interface ProjectContent {
  title: string;
  alt: string;
  description: string;
}

const CONTENT_FR: Record<number, ProjectContent> = {
  26: {
    title: "Arguin Marine",
    alt: "Site vitrine d'Arguin Marine, location de bateaux sur le Bassin d'Arcachon",
    description:
      "Vitrine WordPress d'un service de location de bateaux haut de gamme sur le Bassin d'Arcachon.",
  },
  25: {
    title: "La Petite Vitrine",
    alt: "La Petite Vitrine — service de mise en ligne de mini-sites par métier",
    description:
      "Service packagé de mise en ligne de mini-sites par métier pour indépendants et TPE.",
  },
  24: {
    title: "Peer to Peer",
    alt: "Plateforme Peer to Peer d'auto-observation en santé mentale",
    description:
      "Plateforme libre d'auto-observation en santé mentale, 100 % locale et sans compte.",
  },
  23: {
    title: "Séjours à L'Hermitage",
    alt: "Landing de séjours dans un Tiers Lieu rural",
    description:
      "Séjours d'entreprise sur-mesure en nature, team-building et séminaires innovants.",
  },
  22: {
    title: "Mariage Nicolas & Cécile",
    alt: "Landing de mariage Nicolas et Cécile",
    description:
      "Nicolas et Cécile se marient le 23 mai 2026 — programme détaillé, ton intime et RSVP brunch.",
  },
  21: {
    title: "Mariage Agathe & Alain",
    alt: "Landing de mariage Agathe et Alain",
    description:
      "Agathe et Alain célèbrent leur mariage le 27 septembre — programme, hébergement et ton chaleureux.",
  },
  20: {
    title: "Artisan Coiffeur",
    alt: "Landing artisan coiffeur — La Petite Vitrine",
    description:
      "Salon de coiffure moderne à Paris proposant des services de coiffure professionnels.",
  },
  17: {
    title: "Café citoyen",
    alt: "Site vitrine du Café citoyen",
    description: "Site vitrine du Café citoyen",
  },
  18: {
    title: "L'hermitage - Jeu de piste",
    alt: "Jeu de piste du domaine forestier du Tiers Lieu L'Hermitage",
    description: "Jeu de piste du domaine forestier du Tiers Lieu L'Hermitage",
  },
  16: {
    title: "Comme des fous - Jeux en ligne",
    alt: "Jeux en ligne du média Comme des fous",
    description: "Jeux en ligne du média participatif Comme des fous",
  },
  15: {
    title: "Comme des fous - Media WordPress Headless",
    alt: "Site du média Comme des fous",
    description: "Site du média participatif Comme des fous",
  },
  5: {
    title: "Next Event - Démo WordPress Headless",
    alt: "Site de démonstration Next Event",
    description: "Site de démonstration pour une billetterie événementielle.",
  },
  3: {
    title: "Les Etats Généraux Communaux",
    alt: "Site vitrine des Etats Généraux Communaux",
    description: "Site vitrine des Etats Généraux Communaux",
  },
  4: {
    title: "Les Doléances",
    alt: "Vitrine des Doléances",
    description: "Vitrine des Doléances de 2018-2019",
  },
  19: {
    title: "Panorama Pub",
    alt: "Annuaire Panorama Pub - fournisseurs d'objets publicitaires",
    description: "Premier annuaire en ligne des fournisseurs d'objets publicitaires",
  },
  1: {
    title: "Proditec",
    alt: "Site corporate Proditec",
    description: "Site corporate multilingue",
  },
  2: {
    title: "Sowee",
    alt: "Section blog de Sowee",
    description: "Section blog de Sowee",
  },
  11: {
    title: "Infralliance",
    alt: "Site vitrine d'Infralliance",
    description: "Site vitrine d'Infralliance",
  },
  12: {
    title: "Syndicat départemental d'énergie du Val d'Oise",
    alt: "Plugin de gestion des subventions SDEVO",
    description: "Plugin de gestion des subventions SDEVO",
  },
  6: {
    title: "Salon de la Carrosserie 2024",
    alt: "Site vitrine du Salon de la Carrosserie 2024",
    description: "Site vitrine du Salon de la Carrosserie 2024",
  },
  7: {
    title: "Tiers Lieu L'Hermitage",
    alt: "Site vitrine du Tiers Lieu L'Hermitage",
    description: "Site vitrine du Tiers Lieu L'Hermitage",
  },
  8: {
    title: "ERP Services",
    alt: "Site vitrine d'ERP Services",
    description: "Site vitrine d'ERP Services",
  },
  10: {
    title: "Wagner Hamisky",
    alt: "Site vitrine Wagner Hamisky",
    description: "Site vitrine de la galerie Wagner Hamisky",
  },
  14: {
    title: "Mediatico",
    alt: "Site vitrine de Mediatico",
    description: "Site vitrine de Mediatico",
  },
  9: {
    title: "Senza Nature",
    alt: "Site ecommerce Senza Nature",
    description: "Site ecommerce Senza Nature",
  },
  13: {
    title: "Connexion Plus",
    alt: "Connexion Plus - Développeur WordPress Freelance",
    description: "Site vitrine Connexion Plus",
  },
};

const CONTENT_EN: Record<number, ProjectContent> = {
  26: {
    title: "Arguin Marine",
    alt: "Arguin Marine brochure site, boat rental on the Arcachon Basin",
    description:
      "WordPress brochure site for a high-end boat-rental service on the Arcachon Basin.",
  },
  25: {
    title: "La Petite Vitrine",
    alt: "La Petite Vitrine — go-live service for small profession-based sites",
    description:
      "A packaged go-live service for small profession-based sites, for freelancers and very small businesses.",
  },
  24: {
    title: "Peer to Peer",
    alt: "Peer to Peer mental-health self-observation platform",
    description:
      "A free, fully local mental-health self-observation platform — no account required.",
  },
  23: {
    title: "L'Hermitage Stays",
    alt: "Landing page — stays at a rural Tiers Lieu",
    description:
      "Bespoke corporate stays in nature — team-building and innovative offsites.",
  },
  22: {
    title: "Nicolas & Cécile's Wedding",
    alt: "Wedding landing page — Nicolas and Cécile",
    description:
      "Nicolas and Cécile are getting married on 23 May 2026 — full programme, intimate tone and brunch RSVP.",
  },
  21: {
    title: "Agathe & Alain's Wedding",
    alt: "Wedding landing page — Agathe and Alain",
    description:
      "Agathe and Alain celebrate their wedding on 27 September — programme, accommodation and warm tone.",
  },
  20: {
    title: "Artisan Coiffeur",
    alt: "Artisan hairdresser landing — La Petite Vitrine",
    description:
      "A modern Paris hair salon offering professional hairdressing services.",
  },
  17: {
    title: "Café Citoyen",
    alt: "Café Citoyen brochure site",
    description: "Café Citoyen brochure site",
  },
  18: {
    title: "L'Hermitage – Treasure Hunt",
    alt: "Treasure hunt across the Tiers Lieu L'Hermitage woodland estate",
    description: "Treasure hunt across the Tiers Lieu L'Hermitage woodland estate",
  },
  16: {
    title: "Comme des Fous – Online Games",
    alt: "Online games on the Comme des Fous media outlet",
    description: "Online games for the participatory media outlet Comme des Fous",
  },
  15: {
    title: "Comme des Fous – Headless WordPress Media",
    alt: "The website of the Comme des Fous media outlet",
    description: "The website of the participatory media outlet Comme des Fous",
  },
  5: {
    title: "Next Event – Headless WordPress Demo",
    alt: "Next Event demo site",
    description: "Demo site for an event ticketing platform.",
  },
  3: {
    title: "Les Etats Généraux Communaux",
    alt: "Brochure site for Les Etats Généraux Communaux",
    description: "Brochure site for Les Etats Généraux Communaux",
  },
  4: {
    title: "Les Doléances",
    alt: "Showcase for the Doléances",
    description: "Showcase for the citizens' grievances of 2018-2019",
  },
  19: {
    title: "Panorama Pub",
    alt: "Panorama Pub directory — promotional-products suppliers",
    description: "The first online directory of promotional-products suppliers",
  },
  1: {
    title: "Proditec",
    alt: "Proditec corporate site",
    description: "Multilingual corporate site",
  },
  2: {
    title: "Sowee",
    alt: "Sowee blog section",
    description: "Sowee blog section",
  },
  11: {
    title: "Infralliance",
    alt: "Infralliance brochure site",
    description: "Infralliance brochure site",
  },
  12: {
    title: "Syndicat départemental d'énergie du Val d'Oise",
    alt: "SDEVO grant-management plugin",
    description: "SDEVO grant-management plugin",
  },
  6: {
    title: "Salon de la Carrosserie 2024",
    alt: "Salon de la Carrosserie 2024 brochure site",
    description: "Salon de la Carrosserie 2024 brochure site",
  },
  7: {
    title: "Tiers Lieu L'Hermitage",
    alt: "Tiers Lieu L'Hermitage brochure site",
    description: "Tiers Lieu L'Hermitage brochure site",
  },
  8: {
    title: "ERP Services",
    alt: "ERP Services brochure site",
    description: "ERP Services brochure site",
  },
  10: {
    title: "Wagner Hamisky",
    alt: "Wagner Hamisky brochure site",
    description: "Brochure site for the Wagner Hamisky gallery",
  },
  14: {
    title: "Mediatico",
    alt: "Mediatico brochure site",
    description: "Mediatico brochure site",
  },
  9: {
    title: "Senza Nature",
    alt: "Senza Nature e-commerce site",
    description: "Senza Nature e-commerce site",
  },
  13: {
    title: "Connexion Plus",
    alt: "Connexion Plus — freelance WordPress developer",
    description: "Connexion Plus brochure site",
  },
};

function getProjectContent(locale: Locale, id: number): ProjectContent {
  const map = locale === "en" ? CONTENT_EN : CONTENT_FR;
  return map[id] ?? CONTENT_FR[id];
}

const getProjectsByTab = (tab: string, count: number) =>
  PROJECTS_META.filter((project) => project.tab.includes(tab)).slice(0, count);

interface RealisationsProps {
  count?: number;
  defaultTab?: string;
}

const TAB_KEYS = ["landing", "webapp", "headless", "wordpress"] as const;
type TabKey = typeof TAB_KEYS[number];

export default function Realisations({ count, defaultTab = "headless" }: RealisationsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const t = useTranslations("realisations");
  const locale = useLocale() as Locale;

  return (
    <section id="realisations">
      {/* Sélecteur d'onglets — cellules bordées blueprint */}
      <div className="mb-12 flex border border-dark-gray">
        {TAB_KEYS.map((tab, idx) => {
          const isActive = activeTab === tab;
          const projectCount = PROJECTS_META.filter((p) => p.tab.includes(tab)).length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={isActive}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-3.5 text-center font-mono text-[10px] uppercase leading-tight tracking-[0.08em] transition-colors",
                idx < TAB_KEYS.length - 1 && "border-r border-dark-gray",
                isActive
                  ? "bg-vermilion text-white"
                  : "bg-jet text-mid-gray hover:bg-ebony hover:text-foreground",
              )}
            >
              <span className="text-inherit">{t(`tabs.${tab}`)}</span>
              <span className={cn("font-mono text-[9px] tracking-[0.05em] text-inherit", isActive ? "opacity-100" : "opacity-50")}>
                {projectCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grille de réalisations — cellules jointives bordées */}
      {TAB_KEYS.map((tab) =>
        activeTab === tab ? (
          <Stagger
            key={tab}
            stagger={0.04}
            className="grid grid-cols-1 border-l border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3"
          >
            {getProjectsByTab(tab, count ?? PROJECTS_META.length).map((project) => {
              const content = getProjectContent(locale, project.id);
              const isExternal = project.link.startsWith("http");
              const externalProps = isExternal ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
              return (
                <StaggerItem
                  key={project.id}
                  className={cn(
                    "group relative flex flex-col border-b border-r border-dark-gray transition-colors duration-300",
                    "hover:border-mid-gray/40 hover:bg-jet/40",
                  )}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={content.alt}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-dark-gray px-6 py-5">
                    <Link
                      href={project.link}
                      {...externalProps}
                      className="block no-underline"
                    >
                      <h3 className="text-lg font-light tracking-tight text-foreground">
                        {content.title}
                      </h3>
                      <p className="mt-1.5 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
                        {content.description}
                      </p>
                    </Link>
                    <div className="mt-auto pt-4">
                      <Link
                        href={project.link}
                        {...externalProps}
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary no-underline transition-colors hover:text-foreground"
                      >
                        {isExternal ? t("visitLanding") : t("viewProject")}
                        <ArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        ) : null
      )}
    </section>
  );
}
