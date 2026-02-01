"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"



type Feature = {
  id: string
  title: string
  description: string
  badge: string
  image?: string
  details: string[]
}

type FeatureCarouselProps = {
  features: Feature[]
}

export default function FeatureCarousel({ features }: FeatureCarouselProps) {
  const [activeFeature, setActiveFeature] = useState(0)

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length)
  }

  const currentFeature = features[activeFeature]

  return (
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-center">
        <div className="col-span-1 space-y-6">
        {/* Image Section */}
        <div className="relative">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[3/2]">
                <Image
                  src={currentFeature.image || "/placeholder.svg"}
                  alt={currentFeature.title}
                  fill
                  className="object-cover object-top transition-all duration-500"
                />
                <div className="absolute bottom-4 left-4">
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <div className="space-y-4">
          <div className="mb-6">
            <h3 className="text-2xl font-medium text-regularblue mb-2">{currentFeature.title}</h3>
            <p className="text-regularblue/80 mb-4">{currentFeature.description}</p>
            <ul className="flex content-center">
              {currentFeature.details.map((detail, index) => (
                <li key={index} className="flex items-center text-sm mr-6 bg-extralightblue/40 py-1 px-4 rounded-full">
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          
        </div>
        </div>

          {/* Feature Navigation */}
          <div className="space-y-2">
            {features.map((feature, index) => {
              return (
                <Card
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    index === activeFeature ? "border-regularblue/50 bg-extralightblueblue/50" : "hover:border-regularblue/30"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          index === activeFeature ? "bg-extralightblue" : "bg-extralightblue/30"
                        }`}
                      >
                        
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-regularblue text-lg">{feature.title}</h4>
                        <p className="text-xs text-regularblue/80 line-clamp-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveFeature(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === activeFeature ? "bg-regularblue w-8" : "bg-extralightblue hover:bg-extralightblue/50"
            }`}
          />
        ))}
      </div>
      </div>
  )
}
