"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Définition des projets
const PROJECTS = [
  {
    id: 5,
    title: "Next Event - Démo WordPress Headless",
    type: "headless",
    image: "/img/desktop-screen-next-event.jpg",
    alt: "Site de démonstration Next Event",
    description: "Site de démonstration pour une billetterie événementielle.",
    link: "/etudes-de-cas/next-event",
    tab: ["derniers", "headless"],
  },
  {
    id: 3,
    title: "Les Etats Généraux Communaux",
    type: "headless",
    image: "/img/desktop-screen-egc.png",
    alt: "Site vitrine des Etats Généraux Communaux",
    description: "Site vitrine des Etats Généraux Communaux",
    link: "/etudes-de-cas/les-etats-generaux-communaux",
    tab: ["derniers", "association", "headless", "ess"],
  },
  {
    id: 4,
    title: "Les Doléances",
    type: "headless",
    image: "/img/desktop-screen-lesdoleances.png",
    alt: "Vitrine des Doléances",
    description: "Vitrine des Doléances de 2018-2019",
    link: "/etudes-de-cas/doleances",
    tab: ["derniers", "derniers", "headless", "ess"],
  },
  {
    id: 1,
    title: "Proditec",
    type: "corporate",
    image: "/img/desktop-screen-proditec.jpg",
    alt: "Site corporate Proditec",
    description: "Site corporate multilingue",
    link: "/etudes-de-cas/proditec",
    tab: ["derniers", "corporate"],
  },
  {
    id: 2,
    title: "Sowee",
    type: "institution",
    image: "/img/desktop-screen-sowee.jpg",
    alt: "Section blog de Sowee",
    description: "Section blog de Sowee",
    link: "/etudes-de-cas/sowee",
    tab: ["derniers", "derniers", "institutional"],
  },
  {
    id: 11,
    title: "Infralliance",
    type: "institutional",
    image: "/img/desktop-screen-infralliance.jpg",
    alt: "Site vitrine d'Infrallian",
    description: "Site vitrine de d'Infralliance",
    link: "/etudes-de-cas/infralliance",
    tab: ["derniers", "institutional"],
  },
  {
    id: 12,
    title: "Syndicat départemental d'énergie du Val d'Oise",
    type: "institutional",
    image: "/img/desktop-screen-sdevo.png",
    alt: "Plugin de gestion des subventions SDEVO",
    description: "Plugin de gestion des subventions SDEVO",
    link: "/etudes-de-cas/sdevo",
    tab: ["derniers", "institutional"],
  },
  {
    id: 6,
    title: "Salon de la Carrosserie 2024",
    type: "corporate",
    image: "/img/desktop-screen-salondelacarrosserie.jpg",
    alt: "Site vitrine du Salon de la Carrosserie 2024",
    description: "Site vitrine du Salon de la Carrosserie 2024",
    link: "/etudes-de-cas/salon-de-la-carrosserie",
    tab: ["derniers", "corporate"],
  },
  {
    id: 7,
    title: "Tiers Lieu L'Hermitage",
    type: "ess",
    image: "/img/desktop-screen-hermitage.jpg",
    alt: "Site vitrine du Tiers Lieu L'Hermitage",
    description: "Site vitrine du Tiers Lieu L'Hermitage",
    link: "/etudes-de-cas/hermitage",
    tab: ["derniers", "ess"],
  },
  {
    id: 8,
    title: "ERP Services",
    type: "corporate",
    image: "/img/desktop-screen-erp-services.jpg",
    alt: "Site vitrine d'ERP Services",
    description: "Site vitrine d'ERP Services",
    link: "/etudes-de-cas/erp-services",
    tab: ["derniers", "corporate"],
  },
  {
    id: 10,
    title: "Wagner Hamisky",
    type: "corporate",
    image: "/img/desktop-screen-wagner-hamisky.jpg",
    alt: "Site vitrine Wagner Hamisky",
    description: "Site vitrine de la galerie Wagner Hamisky",
    link: "/etudes-de-cas/wagner-hamisky",
    tab: ["derniers", "corporate"],
  },
  {
    id: 14,
    title: "Mediatico",
    type: "ess",
    image: "/img/desktop-screen-mediatico.jpg",
    alt: "Site vitrine de Mediatico",
    description: "Site vitrine de Mediatico",
    link: "/etudes-de-cas/mediatico",
    tab: ["derniers", "ess"],
  },
  {
    id: 9,
    title: "Senza Nature",
    type: "corporate",
    image: "/img/desktop-screen-senza-nature.jpg",
    alt: "Site ecommerce Senza Nature",
    description: "Site ecommerce Senza Nature",
    link: "/etudes-de-cas/senza-nature",
    tab: ["derniers", "corporate"],
  },
  {
    id: 13,
    title: "Connexion Plus",
    type: "ess",
    image: "/img/desktop-screen-gem-connexion.jpg",
    alt: "Connexion Plus - Développeuse WordPress Freelance",
    description: "Site vitrine Connexion Plus",
    link: "/etudes-de-cas/connexion-plus",
    tab: ["derniers", "ess"],
  },
];

// Fonction utilitaire pour filtrer les projets par tab et limiter le nombre
const getProjectsByTab = (tab: string, count: number) =>
  PROJECTS.filter((project) => project.tab.includes(tab)).slice(0, count);

interface RealisationsProps {
  count?: number;
}

export default function Realisations({ count }: RealisationsProps) {
  // Limiter le nombre de réalisations affichées par tab
  return (
    <section id="realisations" className="relative overflow-hidden">
      <div className="container relative p-0">
        <Tabs defaultValue="derniers" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="flex flex-wrap md:bg-white/10 bg-transparent backdrop-blur-sm p-1 rounded-full">
              <TabsTrigger
                value="derniers"
                className="rounded-full data-[state=active]:bg-background/10"
              >
                Réalisations marquantes
              </TabsTrigger>
              <TabsTrigger
                value="corporate"
                className="rounded-full data-[state=active]:bg-background/10"
              >
                Corporate
              </TabsTrigger>
              <TabsTrigger
                value="institutional"
                className="rounded-full data-[state=active]:bg-background/10"
              >
                Institutionnel
              </TabsTrigger>
			        <TabsTrigger
                value="ess"
                className="rounded-full data-[state=active]:bg-background/10"
              >
                ESS
              </TabsTrigger>
              <TabsTrigger
                value="headless"
                className="rounded-full data-[state=active]:bg-background/10"
              >
                Headless
              </TabsTrigger>
            </TabsList>
          </div>

          {["derniers", "ess", "corporate", "institutional", "headless"].map((tab) => (
            <TabsContent value={tab} className="mt-0" key={tab}>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {getProjectsByTab(tab, count ?? PROJECTS.length).map(
                  (project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full"
                    >
                      <div className="group relative overflow-hidden rounded-2xl bg-mediumblue/30 backdrop-blur-md transition-all duration-500 border border-1 border-white/10 hover:shadow h-full flex flex-col">
                        <div className="flex align-middle aspect-video overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.alt}
                            height={200}
                            width={200}
                            loading="lazy"
                            className="w-full mx-auto object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <Link href={project.link}>
                            <h3 className="text-2xl font-medium transition-colors duration-300 text-white group-hover:text-white/70">
                              {project.title}
                            </h3>
                            <p className="mt-2 text-white/70 text-sm group-hover:text-white/50">
                              {project.description}
                            </p>
                          </Link>
                          <div className="mt-4 mt-auto">
                            <Link
                              href={project.link}
                              className="inline-flex items-center text-sm font-medium  text-white group-hover:text-white/70 transition-all duration-300 hover:translate-x-1"
                            >
                              Voir le projet
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
