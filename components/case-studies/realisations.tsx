"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

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

export default function Realisations({ count, defaultTab = "webapp" }: RealisationsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const t = useTranslations("realisations");
  const locale = useLocale() as Locale;

  return (
    <section id="realisations">
      {/* Tab selector */}
      <div
        style={{
          display: "flex",
          border: "1px solid var(--rule)",
          marginBottom: 48,
          overflow: "hidden",
        }}
      >
        {TAB_KEYS.map((tab, idx) => {
          const isActive = activeTab === tab;
          const projectCount = PROJECTS_META.filter((p) => p.tab.includes(tab)).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={isActive ? "tab-sel-active" : ""}
              style={{
                flex: 1,
                minWidth: 0,
                padding: "14px 8px",
                border: "none",
                borderRight: idx < TAB_KEYS.length - 1 ? "1px solid var(--rule)" : "none",
                background: isActive ? "var(--ink)" : "var(--paper)",
                color: isActive ? "#ffffff" : "var(--ink-2)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                lineHeight: 1.2,
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--paper-2)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--paper)";
              }}
            >
              <span>{t(`tabs.${tab}`)}</span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  opacity: isActive ? 0.5 : 0.4,
                  letterSpacing: "0.05em",
                }}
              >
                {projectCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {TAB_KEYS.map((tab) =>
        activeTab === tab ? (
          <div
            key={tab}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}
          >
            {getProjectsByTab(tab, count ?? PROJECTS_META.length).map((project, index) => {
              const content = getProjectContent(locale, project.id);
              const isExternal = project.link.startsWith("http");
              const externalProps = isExternal ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
              const col = index % 3;
              return (
                <div
                  key={project.id}
                  style={{
                    border: "1px solid var(--rule)",
                    marginRight: col < 2 ? -1 : 0,
                    marginBottom: -1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                    <Image
                      src={project.image}
                      alt={content.alt}
                      fill
                      style={{ objectFit: "cover", objectPosition: "top" }}
                      sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
                    />
                  </div>
                  <div
                    style={{
                      padding: "20px 24px",
                      borderTop: "1px solid var(--rule)",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link
                      href={project.link}
                      {...externalProps}
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <h3
                        className="ni-serif"
                        style={{ fontSize: 18, color: "var(--ink)", marginBottom: 6 }}
                      >
                        {content.title}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
                        {content.description}
                      </p>
                    </Link>
                    <div style={{ marginTop: "auto", paddingTop: 16 }}>
                      <Link
                        href={project.link}
                        {...externalProps}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 10,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--accent-color)",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {isExternal ? t("visitLanding") : t("viewProject")}
                        <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null
      )}
    </section>
  );
}
