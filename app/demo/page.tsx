"use client";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";
import MainVideo from "@/components/main-video";


function toYoutubeEmbed(url: string) {
  if (!url) return url;
  // Si déjà embed
  if (url.includes('youtube.com/embed/')) return url;
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
    projectDescription: "Un site de promotion des doléances citoyennes avec WordPress Headless et Next.js",
  },
];

export default function DemoPage() {
const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
	return (
		<>
			<PageHero
				badge="WordPress Headless"
				titre1="Découvrez le Headless"
				titre2="en démo"
				sousTitre="Visionnez nos démonstrations pour mieux comprendre nos solutions et services."
				cta1Text="Solutions"
				cta1Link="/solutions"
				cta2Text="RDV en visio"
				cta2Link="https://calendar.app.google/HuwRpoVGoKBj2PkX8"
				illustration="/illustrations/data-flow-animated.svg" // Remplacez par une illustration pertinente
			/>
			<main className="max-w-5xl mx-auto px-4 py-12">
                
          {/* Video container with animations */}
          <div
            className="relative group animate-scale-in delay-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
        
            {/* Video wrapper */}
            <div className="relative border border-border rounded-2xl overflow-hidden transform transition-transform duration-500">
              {/* Video placeholder */}

              <MainVideo
                url={mainVideo.url}
                title={mainVideo.title}
                poster="/modern-dashboard.png"
                infoTitle="WordPress Headless Next.js"
                infoDescription="Découvrez les fonctionnalités d'une billeterie en ligne propulsée par WordPress Headless et Next.js."
                ctaText="Prendre RDV en visio"
                ctaLink="https://calendar.app.google/HuwRpoVGoKBj2PkX8"
                websiteLink={mainVideo.websiteLink}
              />

    

            </div>
          </div>
            {/* Demo videos grid */}
        <div className="mt-36 grid grid-cols-1 gap-8">
          {demoVideos.map((video, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-0 w-full rounded-2xl overflow-hidden border border-lightyellow/50 bg-card" style={{ minHeight: '320px' }}>
              {/* Colonne vidéo */}
               <div className="col-span-1 md:col-span-3 h-full flex items-center justify-center bg-black">
                 <div className="w-full h-full flex items-center justify-center" style={{ position: 'relative', width: '100%' }}>
                   <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative' }}>
                     <iframe
                       src={toYoutubeEmbed(video.url)}
                       title={video.title}
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                       className="absolute top-0 left-0 w-full h-full border-0"
                       style={{ background: 'black' }}
                     ></iframe>
                   </div>
                 </div>
               </div>
              {/* Colonne infos */}
              <div className="col-span-1 md:col-span-2 flex flex-col justify-center items-start p-6 bg-white/40 backdrop-blur-md h-full">
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-regularblue mb-2">{video.projectName}</h4>
                  <p className="text-base text-gray-700 mb-2">{video.projectDescription}</p>
                </div>
                {video.projectLink && (
                  <Link href={video.projectLink} target="_blank" className="text-coral font-medium underline hover:text-coral/80 transition">
                    Voir le projet
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
			</main>
		</>
	);
}
