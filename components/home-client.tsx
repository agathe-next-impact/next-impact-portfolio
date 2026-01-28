"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

// Dynamic imports pour les composants lourds
const Hero = dynamic(() => import("@/components/hero"), {
  loading: () => <div className="min-h-screen" />
});

const ExpandableCardDemo = dynamic(() => import("./expandable-cards").then(mod => ({ default: mod.ExpandableCardDemo })), {
  loading: () => <div className="min-h-[400px]" />
});


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

export default function HomeClient() {
  const [isHovered, setIsHovered] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const mainVideo = {
    title: "Présentation complète de la plateforme",
    url: "https://youtu.be/I1qi5o31Lnk?si=3wismwIKR4UXIy7o",
    websiteLink: "https://next-event.fr",
  };      


  const handlePlayVideo = () => {
    setPlayVideo(true);
  };

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Whats's Headless Section */}
        <ExpandableCardDemo />

        {/* Video Demo Section */}
        <section className="max-w-5xl mx-auto px-4 py-12 mb-16">
          <div
            className="relative group animate-scale-in delay-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
        
            {/* Video wrapper */}
            <div className="relative border border-border rounded-2xl overflow-hidden transform transition-transform duration-500" onClick={handlePlayVideo} style={{ cursor: 'pointer' }}>
              {/* Video placeholder */}

              <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative' }}>
                 {playVideo ? (
                   <iframe
                     src={toYoutubeEmbed(mainVideo.url) + '?autoplay=1'}
                     title={mainVideo.title}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     className="absolute top-0 left-0 w-full h-full border-0"
                     style={{ background: 'black' }}
                   ></iframe>
                 ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center">
                    <Image 
                      src={`https://img.youtube.com/vi/${mainVideo.url.split('/').pop()?.split('?')[0]}/maxresdefault.jpg`} 
                      alt={mainVideo.title} 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                    </div>
                  </div>
                 )}
               </div>

            </div>
              {/* Info bar */}
              <div className="p-6 bg-mediumblue/50 backdrop-blur-sm border-x border-1 border-white/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium text-3xl text-white/90">Billeterie événementielle</h3>
                    <p className="text-lg text-white/80">WordPress Headless Next.js</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="p-6 bg-darkblue/20 backdrop-blur-sm text-center rounded-b-3xl border border-white/20">
                <Link href="https://calendar.app.google/com/Cw7TGQBzeZ1szKU86" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-lightyellow hover:bg-lightyellow/90 text-darkblue px-6 py-3 text-xl font-googletitre font-medium">
                    Réserver une visio
                  </Button>
                </Link>
              </div>

          </div>
        </section>
        
      </main>
    </>
  );
}
