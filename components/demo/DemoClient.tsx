"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { LivreBlancBanner } from "@/components/livre-blanc-banner";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

function toYoutubeEmbed(url: string) {
  if (!url) return url;
  if (url.includes("youtube.com/embed/")) return url;
  const matchShorts = url.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (matchShorts) return `https://www.youtube.com/embed/${matchShorts[1]}`;
  const matchShort = url.match(/youtu\.be\/([\w-]+)/);
  if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
  const matchLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
  return url;
}

function isYoutubeShort(url: string) {
  return /youtube\.com\/shorts\//.test(url);
}

const mainVideoFr = {
  title: "Panorama Pub — Marketplace B2B Next.js + PostgreSQL",
  url: "https://youtu.be/9fMaBL1amYk",
  websiteLink: "https://panorama-pub.com",
};
const mainVideoEn = {
  title: "Panorama Pub — B2B marketplace, Next.js + PostgreSQL",
  url: "https://youtu.be/9fMaBL1amYk",
  websiteLink: "https://panorama-pub.com",
};

const demoVideosFr = [
  // App mobile / PWA
  {
    title: "App mobile (PWA)",
    url: "https://youtube.com/shorts/_kt_wA4zT68",
    projectLink: "/etudes-de-cas/hermitage-jeu-de-piste",
    projectName: "Hermitage — Jeu de piste mobile (PWA)",
    projectDescription:
      "Application mobile installable sans store, géolocalisée et fonctionnant hors-ligne. Next.js + service worker, persistance locale.",
  },
  // Web app extension applicative
  {
    title: "Extension applicative",
    url: "https://youtu.be/KU5K44bU9NM",
    projectLink: "/etudes-de-cas/comme-des-fous-jeux",
    projectName: "Comme des Fous — Section jeux en ligne",
    projectDescription:
      "Une zone applicative (jeux interactifs) intégrée au site Headless du média Comme des Fous : extension web app sur socle WordPress + Next.js.",
  },
  // Sites Headless
  {
    title: "Site vitrine Headless",
    url: "https://youtu.be/8aVVoDFakCY",
    projectLink: "/etudes-de-cas/cafe-citoyen",
    projectName: "Café citoyen — Site vitrine Headless",
    projectDescription:
      "Vitrine moderne d'une association culturelle, propulsée en WordPress Headless + Next.js. Performance, événements, prise de contact.",
  },
  {
    title: "Site média Headless",
    url: "https://youtu.be/6vUSbG6F50w",
    projectLink: "/etudes-de-cas/comme-des-fous",
    projectName: "Comme des Fous — Média participatif",
    projectDescription:
      "Le site du média participatif Comme des Fous, en WordPress Headless + Next.js : performance éditoriale, expérience lecteur fluide.",
  },
  {
    title: "Démo billetterie Headless",
    url: "https://youtu.be/I1qi5o31Lnk",
    projectLink: "/etudes-de-cas/next-event",
    projectName: "Next Event — Démo billetterie WordPress Headless",
    projectDescription:
      "Démonstration d'un site WordPress Headless avec Next.js : billetterie événementielle, agenda et expérience utilisateur soignée.",
  },
  // Plateformes citoyennes
  {
    title: "Plateforme citoyenne",
    url: "https://youtu.be/dJIndpLBm7o",
    projectLink: "/etudes-de-cas/les-etats-generaux-communaux",
    projectName: "États Généraux Communaux — Plateforme citoyenne",
    projectDescription:
      "Une plateforme de mobilisation citoyenne en WordPress Headless + Next.js : sécurité critique, carte interactive des groupes locaux.",
  },
  {
    title: "Site de mobilisation",
    url: "https://youtu.be/_OjiGiOWJus",
    projectLink: "/etudes-de-cas/doleances",
    projectName: "Les Doléances — Site de mobilisation",
    projectDescription:
      "Une vitrine pour mettre en lumière les doléances citoyennes de 2018-2019, en WordPress Headless + Next.js.",
  },
];

const demoVideosEn = [
  // Mobile app / PWA
  {
    title: "Mobile app (PWA)",
    url: "https://youtube.com/shorts/_kt_wA4zT68",
    projectLink: "/etudes-de-cas/hermitage-jeu-de-piste",
    projectName: "Hermitage — Mobile treasure hunt (PWA)",
    projectDescription:
      "A mobile app installable without app stores, geolocated and working offline. Next.js + service worker, local persistence.",
  },
  // Applicative extension
  {
    title: "Applicative extension",
    url: "https://youtu.be/KU5K44bU9NM",
    projectLink: "/etudes-de-cas/comme-des-fous-jeux",
    projectName: "Comme des Fous — Online games section",
    projectDescription:
      "An applicative zone (interactive games) embedded in the Headless media Comme des Fous: a web-app extension on top of a WordPress + Next.js foundation.",
  },
  // Headless sites
  {
    title: "Headless brochure site",
    url: "https://youtu.be/8aVVoDFakCY",
    projectLink: "/etudes-de-cas/cafe-citoyen",
    projectName: "Café citoyen — Headless brochure site",
    projectDescription:
      "A modern brochure site for a cultural association, powered by Headless WordPress + Next.js. Performance, events, contact.",
  },
  {
    title: "Headless media site",
    url: "https://youtu.be/6vUSbG6F50w",
    projectLink: "/etudes-de-cas/comme-des-fous",
    projectName: "Comme des Fous — Participatory media",
    projectDescription:
      "The participatory media Comme des Fous, on Headless WordPress + Next.js: editorial performance, smooth reader experience.",
  },
  {
    title: "Headless ticketing demo",
    url: "https://youtu.be/I1qi5o31Lnk",
    projectLink: "/etudes-de-cas/next-event",
    projectName: "Next Event — Headless WordPress ticketing demo",
    projectDescription:
      "Demo of a Headless WordPress site with Next.js: event ticketing, agenda and polished user experience.",
  },
  // Citizen platforms
  {
    title: "Citizen platform",
    url: "https://youtu.be/dJIndpLBm7o",
    projectLink: "/etudes-de-cas/les-etats-generaux-communaux",
    projectName: "États Généraux Communaux — Citizen platform",
    projectDescription:
      "A citizen mobilization platform on Headless WordPress + Next.js: critical security, interactive map of local groups.",
  },
  {
    title: "Advocacy site",
    url: "https://youtu.be/_OjiGiOWJus",
    projectLink: "/etudes-de-cas/doleances",
    projectName: "Les Doléances — Advocacy site",
    projectDescription:
      "A showcase highlighting the 2018-2019 citizen grievances, built on Headless WordPress + Next.js.",
  },
];

export default function DemoClient() {
  const [isHovered, setIsHovered] = useState(false);
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const mainVideo = isEn ? mainVideoEn : mainVideoFr;
  const demoVideos = isEn ? demoVideosEn : demoVideosFr;

  return (
    <main>
      <PageLayout
        titre={isEn ? "Demos — Websites, web apps and mobile applications" : "Démos — Sites web, web apps et applications mobiles"}
        sousTitre={
          isEn
            ? "From a Next.js + PostgreSQL B2B marketplace to a mobile PWA and Headless WordPress sites: see Next Impact projects in action."
            : "De la marketplace B2B Next.js + PostgreSQL au jeu de piste mobile PWA en passant par les sites Headless WordPress : les réalisations Next Impact en action."
        }
      >
        <div id="demo-main-video" className="mt-8 mb-16">
          <section className="max-w-5xl mx-auto px-4 py-12">
            {/* Video container with animations */}
            <div
              className="relative group animate-scale-in delay-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Video wrapper */}
              <div className="relative border border-border rounded-2xl overflow-hidden transform transition-transform duration-500">
                {/* Video placeholder */}

                <div
                  style={{
                    width: "100%",
                    paddingTop: "56.25%",
                    position: "relative",
                  }}
                >
                  <iframe
                    src={toYoutubeEmbed(mainVideo.url)}
                    title={mainVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                    style={{ background: "black" }}
                  ></iframe>
                </div>
              </div>
              {/* Info bar */}
              <div className="p-6 bg-mediumblue/50 backdrop-blur-sm border-x border-1 border-white/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h2 className="font-medium text-3xl text-white/90">
                      {isEn
                        ? "Panorama Pub — B2B marketplace shipped in 2 months"
                        : "Panorama Pub — Marketplace B2B livrée en 2 mois"}
                    </h2>
                    <p className="text-lg text-white/80">
                      {isEn
                        ? "Custom web app · Next.js + PostgreSQL + Vercel"
                        : "Web app sur-mesure · Next.js + PostgreSQL + Vercel"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="p-6 bg-darkblue/20 backdrop-blur-sm text-center rounded-b-3xl border border-white/20">
                <a
                  href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-lightyellow hover:bg-lightyellow/90 text-darkblue px-6 py-3 text-xl font-googletitre font-medium">
                    {isEn ? "Book a video call" : "Réserver une visio"}
                  </Button>
                </a>
              </div>
            </div>
            {/* Demo videos grid */}
            <div className="mt-36 grid grid-cols-1 gap-8">
              {demoVideos.map((video, idx) => {
                const isShort = isYoutubeShort(video.url);
                return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-5 gap-0 w-full rounded-2xl overflow-hidden border"
                  style={{ minHeight: "320px" }}
                >
                  {/* Colonne vidéo */}
                  <div className="col-span-1 md:col-span-3 h-full flex items-center justify-center bg-black p-4">
                    <div
                      className={
                        isShort
                          ? "w-full max-w-[280px] mx-auto"
                          : "w-full"
                      }
                      style={{ position: "relative" }}
                    >
                      <div
                        style={{
                          width: "100%",
                          paddingTop: isShort ? "177.78%" : "56.25%",
                          position: "relative",
                        }}
                      >
                        <iframe
                          src={toYoutubeEmbed(video.url)}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full border-0"
                          style={{ background: "black" }}
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  {/* Colonne infos */}
                  <div className="col-span-1 md:col-span-2 flex flex-col justify-center items-start p-6 bg-mediumblue/40 backdrop-blur-md h-full">
                    <div className="mb-4">
                      <h3 className="text-2xl md:text-xl font-semibold text-white mb-2">
                        {video.projectName}
                      </h3>
                      <p className="text-base text-white/80 mb-2">
                        {video.projectDescription}
                      </p>
                    </div>
                    {video.projectLink && (
                      <Link
                        // @ts-expect-error – href comes from internal data
                        href={video.projectLink}
                        className="text-coral font-medium underline hover:text-coral/80 transition"
                      >
                        {isEn ? "View project" : "Voir le projet"}
                      </Link>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </section>
        </div>
      </PageLayout>
    </main>
  );
}
