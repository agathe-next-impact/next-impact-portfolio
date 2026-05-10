"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
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
    id: 19,
    type: "webapp",
    image: "/img/desktop-screen-panoramapub.png",
    link: "/etudes-de-cas/panorama-pub",
    tab: ["recents", "webapp"],
  },
  {
    id: 18,
    type: "webapp",
    image: "/img/mobile-screen-jeu-de-piste-hermitage.jpg",
    link: "/etudes-de-cas/hermitage-jeu-de-piste",
    tab: ["recents", "webapp"],
  },
  {
    id: 17,
    type: "headless",
    image: "/img/desktop-screen-cafe-citoyen.png",
    link: "/etudes-de-cas/cafe-citoyen",
    tab: ["recents", "headless"],
  },
  {
    id: 16,
    type: "headless",
    image: "/img/desktop-screen-comme-des-fous-jeux.jpg",
    link: "/etudes-de-cas/comme-des-fous-jeux",
    tab: ["recents", "headless"],
  },
  {
    id: 15,
    type: "headless",
    image: "/img/desktop-screen-comme-des-fous.jpg",
    link: "/etudes-de-cas/comme-des-fous",
    tab: ["recents", "headless"],
  },
  {
    id: 5,
    type: "headless",
    image: "/img/desktop-screen-next-event.webp",
    link: "/etudes-de-cas/next-event",
    tab: ["recents", "headless"],
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

export default function Realisations({ count, defaultTab = "recents" }: RealisationsProps) {
  const t = useTranslations("realisations");
  const locale = useLocale() as Locale;

  return (
    <section id="realisations" className="relative overflow-hidden">
      <div className="container relative p-0">
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex justify-center mb-12 -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="flex overflow-x-auto md:overflow-visible md:flex-wrap bg-white/10 backdrop-blur-sm p-1 rounded-full gap-1 max-w-full scrollbar-hide">
              <TabsTrigger
                value="recents"
                className="rounded-full data-[state=active]:bg-background/10 whitespace-nowrap shrink-0 text-xs md:text-sm"
              >
                {t("tabs.recents")}
              </TabsTrigger>
              <TabsTrigger
                value="webapp"
                className="rounded-full data-[state=active]:bg-background/10 whitespace-nowrap shrink-0 text-xs md:text-sm"
              >
                {t("tabs.webapp")}
              </TabsTrigger>
              <TabsTrigger
                value="headless"
                className="rounded-full data-[state=active]:bg-background/10 whitespace-nowrap shrink-0 text-xs md:text-sm"
              >
                {t("tabs.headless")}
              </TabsTrigger>
              <TabsTrigger
                value="wordpress"
                className="rounded-full data-[state=active]:bg-background/10 whitespace-nowrap shrink-0 text-xs md:text-sm"
              >
                {t("tabs.wordpress")}
              </TabsTrigger>
            </TabsList>
          </div>

          {["recents", "webapp", "headless", "wordpress"].map((tab) => (
            <TabsContent value={tab} className="mt-0" key={tab}>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {getProjectsByTab(tab, count ?? PROJECTS_META.length).map(
                  (project, index) => {
                    const content = getProjectContent(locale, project.id);
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full"
                      >
                        <div className="group relative overflow-hidden rounded-2xl bg-mediumblue/30 backdrop-blur-md transition-all duration-500 border border-1 border-white/10 h-full flex flex-col">
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={project.image}
                              alt={content.alt}
                              fill
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <Link href={project.link}>
                              <h3 className="text-2xl font-medium transition-colors duration-300 text-white group-hover:text-white/70">
                                {content.title}
                              </h3>
                              <p className="mt-2 text-white/70 text-sm group-hover:text-white/50">
                                {content.description}
                              </p>
                            </Link>
                            <div className="mt-4 mt-auto">
                              <Link
                                href={project.link}
                                className="inline-flex items-center text-sm font-medium  text-white group-hover:text-white/70 transition-all duration-300 hover:translate-x-1"
                              >
                                {t("viewProject")}
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  },
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
