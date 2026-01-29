"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/json-ld";


function DemoPageClient() {
  function toYoutubeEmbed(url: string) {
    if (!url) return url;
    // Si déjà embed
    if (url.includes("youtube.com/embed/")) return url;
    // youtu.be short link
    const matchShort = url.match(/youtu\.be\/([\w-]+)/);
    if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
    // youtube.com/watch?v=...
    const matchLong = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
    if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
    return url;
  }

  const mainVideo = {
    title: "Présentation complète de la plateforme",
    url: "https://youtu.be/I1qi5o31Lnk?si=3wismwIKR4UXIy7o",
    websiteLink: "https://next-event.fr",
  };

  const demoVideos = [
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
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <main>
      <PageLayout
        titre="WordPress Headless en action"
        sousTitre="Découvrez en vidéo le fonctionnement de notre solution WordPress Headless Next.js."
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
                    <h3 className="font-medium text-3xl text-white/90">
                      Billeterie événementielle
                    </h3>
                    <p className="text-lg text-white/80">
                      WordPress Headless Next.js
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="p-6 bg-darkblue/20 backdrop-blur-sm text-center rounded-b-3xl border border-white/20">
                <Link
                  href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-lightyellow hover:bg-lightyellow/90 text-darkblue px-6 py-3 text-xl font-googletitre font-medium">
                    Réserver une visio
                  </Button>
                </Link>
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
                      <h4 className="text-2xl md:text-xl font-semibold text-white mb-2">
                        {video.projectName}
                      </h4>
                      <p className="text-base text-white/80 mb-2">
                        {video.projectDescription}
                      </p>
                    </div>
                    {video.projectLink && (
                      <Link
                        href={video.projectLink}
                        className="text-coral font-medium underline hover:text-coral/80 transition"
                      >
                        Voir le projet
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

export default function DemoPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Démo", url: "/demo" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <DemoPageClient />
    </>
  );
}
