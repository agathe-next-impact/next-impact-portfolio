
"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"


export default function Advantages() {

const features = [
  {
    id: "analytics",
    title: "Admin de WordPress",
    description: "En conservant WordPress comme outil d'administration, votre site web reste facilement administrable.",
    image: "/img/desktop-screen-wordpress.jpg?height=400&width=600",
  },
  {
    id: "automation",
    title: "Interface au design moderne",
    description: "Des front-end adaptés aux exigeances du web moderne et de vos visiteurs développées sur-mesure avec les dernières technologies.",
    image: "/img/beautiful-ui.jpg?height=400&width=600",
  },
  {
    id: "collaboration",
    title: "Fonctionnalités puissantes",
    description: "Des fonctionnalités développées sur vos besoins ni plus ni moins.",
    image: "/img/functionnalities.jpg?height=400&width=600",
  },
]
   
  const [selectedFeature, setSelectedFeature] = useState(features[0].id)

  const currentFeature = features.find((feature) => feature.id === selectedFeature) || features[0]
 
  return (
    <>
    <div className="container py-16 px-0">
    <h2 className="text-5xl font-medium text-center mb-2 text-regularblue">Pourquoi passer en Headless ?</h2>
      <p className="text-regularblue/80 text-lg max-w-3xl mx-auto">
        En combinant la puissance de WordPress avec des technologies front-end modernes, j'offre des solutions web qui allient facilité d'utilisation, performance et design attractif.
      </p>
      

    <div className="mt-16 mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Features List */}
        <div className="space-y-4">
          <div className="space-y-2">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all duration-200 group",
                  selectedFeature === feature.id
                    ? "bg-white/60 border-regularblue/20"
                    : "bg-white/50 border-border hover:bg-white/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-medium text-2xl mb-2 transition-colors",
                        selectedFeature === feature.id ? "text-mediumblue" : "text-regularblue group-hover:text-foreground",
                      )}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm transition-colors",
                        selectedFeature === feature.id
                          ? "text-mediumblue"
                          : "text-mediumblue/80 group-hover:text-mediumblue",
                      )}
                    >
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 transition-all duration-200 ml-4 flex-shrink-0",
                      selectedFeature === feature.id
                        ? "text-regularblue rotate-360"
                        : "text-regularblue/80 group-hover:text-regularblue group-hover:translate-x-1",
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Image */}
        <div className="lg:sticky lg:top-8">
          <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-muted border shadow-lg">
            <Image
              src={currentFeature.image || "/placeholder.svg"}
              alt={currentFeature.title}
              fill
              className="object-cover object-left transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-medium text-regularblue mb-1">{currentFeature.title}</h4>
                <p className="text-sm text-regularblue/80">{currentFeature.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
            </div>
    </>
  );
}
