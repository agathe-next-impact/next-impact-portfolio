"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function VideoDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <section className="bg-white/5 backdrop-blur-md relative w-full min-h-screen flex items-center justify-center mt-48 px-4 py-16 overflow-hidden border-y border-white/10">
        <div className="max-w-6xl w-full space-y-8">
          {/* Header with animation */}
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-lightyellow font-medium text-balance animate-slide-up delay-200">       
              Démo <span className="text-white font-googletexte text-2xl md:text-3xl lg:text-4xl">WordPress Headless</span>
            </h2>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto text-pretty animate-slide-up delay-200">
              Découvrez comment ça fonctionne en pratique un WordPress headless pour une billeterie événementielle.
             </p>
          </div>

          {/* Video container with animations */}
          <div
            className="relative group animate-scale-in delay-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            {/* Video wrapper */}
            <div className="relative rounded-2xl overflow-hidden transform transition-transform duration-500">
              {/* Video placeholder */}
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                <video className="w-full h-full object-cover" poster="/modern-dashboard.png" loop muted playsInline>
                  <source src="/demo-video.mp4" type="video/mp4" />
                </video>

                {/* Play/Pause button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={handlePlayPause}
                    className={`
                      relative h-20 w-20 rounded-full bg-background/90 backdrop-blur-sm 
                      hover:bg-background hover:scale-110 
                      
                      transition-all duration-300
                      ${isHovered ? "scale-100 opacity-100" : "scale-90 opacity-80"}
                    `}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-foreground" />
                    ) : (
                      <Play className="h-8 w-8 text-foreground ml-1" />
                    )}
                    <span className="sr-only">{isPlaying ? "Mettre en pause" : "Lire la vidéo"}</span>
                  </Button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm text-sm font-medium border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  2:34
                </div>
              </div>

              {/* Info bar */}
              <div className="p-6 bg-mediumblue backdrop-blur-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium text-3xl text-white/90">Billeterie événementielle</h3>
                    <p className="text-lg text-white/80">WordPress Headless Next.js</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="p-6 bg-darkblue backdrop-blur-sm text-center">
                <Link href="https://calendar.app.google/Cw7TGQBzeZ1szKU86" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-lightyellow hover:bg-lightyellow/90 text-darkblue px-6 py-3 text-xl font-googletitre font-medium">
                    Réserver une visio
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

    </>
  )
}
