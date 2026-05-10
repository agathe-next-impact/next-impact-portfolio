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
  const matchShort = url.match(/youtu\.be\/([\w-]+)/);
  if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
  const matchLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
  return url;
}

const mainVideoFr = {
  title: "WordPress Headless pour une vitrine de 2026",
  url: "https://youtu.be/8aVVoDFakCY?si=kbqPlZgPDfHOF43f",
  websiteLink: "https://cafecitoyen.art",
};
const mainVideoEn = {
  title: "Headless WordPress for a 2026 brochure site",
  url: "https://youtu.be/8aVVoDFakCY?si=kbqPlZgPDfHOF43f",
  websiteLink: "https://cafecitoyen.art",
};

const demoVideosFr = [
  {
    title: "Démo 1",
    url: "https://youtu.be/I1qi5o31Lnk?si=3wismwIKR4UXIy7o",
    projectLink: "/etudes-de-cas/next-event",
    projectName: "WordPress Headless pour Next Event",
    projectDescription:
      "Démonstration complète d'un site WordPress Headless avec Next.js : billetterie événementielle, performance et expérience utilisateur",
  },
  {
    title: "Démo 1",
    url: "https://youtu.be/_OjiGiOWJus?si=wQigij89yIdLfpfc",
    projectLink: "/etudes-de-cas/doleances",
    projectName: "WordPress Headless pour les Doleances",
    projectDescription:
      "Un site de promotion des doléances citoyennes avec WordPress Headless et Next.js",
  },
  {
    title: "Démo 2",
    url: "https://youtu.be/dJIndpLBm7o",
    projectLink: "/etudes-de-cas/les-etats-generaux-communaux",
    projectName: "WordPress Headless pour les États Généraux Communaux",
    projectDescription:
      "Une plateforme pour les États Généraux Communaux utilisant WordPress Headless avec Next.js",
  },
  {
    title: "Démo 3",
    url: "https://youtu.be/6vUSbG6F50w",
    projectLink: "/etudes-de-cas/comme-des-fous",
    projectName: "WordPress Headless pour Comme des Fous",
    projectDescription:
      "Le médias en ligne Comme des Fous, propulsé par WordPress Headless et Next.js",
  },
  {
    title: "Démo 4",
    url: "https://youtu.be/SIj61ECS1Mo",
    projectLink: "/etudes-de-cas/comme-des-fous-jeux",
    projectName: "Section de jeux en ligne pour Comme des Fous",
    projectDescription:
      "Une section de jeux en ligne intégrée au site de Comme des Fous, développée en WordPress Headless avec Next.js",
  },
];

const demoVideosEn = [
  {
    title: "Demo 1",
    url: "https://youtu.be/I1qi5o31Lnk?si=3wismwIKR4UXIy7o",
    projectLink: "/etudes-de-cas/next-event",
    projectName: "Headless WordPress for Next Event",
    projectDescription:
      "Full demo of a Headless WordPress site with Next.js: event ticketing, performance and user experience",
  },
  {
    title: "Demo 1",
    url: "https://youtu.be/_OjiGiOWJus?si=wQigij89yIdLfpfc",
    projectLink: "/etudes-de-cas/doleances",
    projectName: "Headless WordPress for Les Doléances",
    projectDescription:
      "A platform promoting citizen petitions, built on Headless WordPress and Next.js",
  },
  {
    title: "Demo 2",
    url: "https://youtu.be/dJIndpLBm7o",
    projectLink: "/etudes-de-cas/les-etats-generaux-communaux",
    projectName: "Headless WordPress for États Généraux Communaux",
    projectDescription:
      "A platform for the États Généraux Communaux, using Headless WordPress with Next.js",
  },
  {
    title: "Demo 3",
    url: "https://youtu.be/6vUSbG6F50w",
    projectLink: "/etudes-de-cas/comme-des-fous",
    projectName: "Headless WordPress for Comme des Fous",
    projectDescription:
      "The Comme des Fous online media outlet, powered by Headless WordPress and Next.js",
  },
  {
    title: "Demo 4",
    url: "https://youtu.be/SIj61ECS1Mo",
    projectLink: "/etudes-de-cas/comme-des-fous-jeux",
    projectName: "Online games section for Comme des Fous",
    projectDescription:
      "An online games section embedded in the Comme des Fous site, built with Headless WordPress and Next.js",
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
        titre={isEn ? "Headless WordPress in action" : "WordPress Headless en action"}
        sousTitre={
          isEn
            ? "See in video how a Headless WordPress site works with Next.js."
            : "Découvrez en vidéo le fonctionnement d'un WordPress Headless Next.js."
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
                        ? "Café citoyen d'Auger-Saint-Vincent brochure site"
                        : "Vitrine du Café citoyen d'Auger-Saint-Vincent"}
                    </h2>
                    <p className="text-lg text-white/80">
                      {isEn ? "Headless WordPress + Next.js" : "WordPress Headless Next.js"}
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
              {demoVideos.map((video, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-5 gap-0 w-full rounded-2xl overflow-hidden border"
                  style={{ minHeight: "320px" }}
                >
                  {/* Colonne vidéo */}
                  <div className="col-span-1 md:col-span-3 h-full flex items-center justify-center bg-black">
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ position: "relative", width: "100%" }}
                    >
                      <div
                        style={{
                          width: "100%",
                          paddingTop: "56.25%",
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
              ))}
            </div>
          </section>
        </div>
      </PageLayout>
    </main>
  );
}
