import React from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ServicesOffers({ offers }: { offers: any[] }) {
  return (
    <section id="offres">
      <div className="mx-auto max-w-7xl py-14 px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <Card key={index} className="flex flex-col h-full bg-mediumblue/60 backdrop-blur-lg rounded-3xl duration-300 border-white/10 p-4">
              <div className="mb-4 grid grid-cols-[auto_1fr]">
              <CardHeader className="items-center gap-4">
                <div className="w-14 h-14 flex-shrink-0">
                  <Image 
                    src={offer.icon} 
                    alt={offer.title} 
                    className="object-contain"
                    width={52}
                    height={52}
                  />
                </div>
                <CardDescription className={`text-2xl font-googletitre font-semibold text-lightyellow
                  ${offer.recommended ? 'text-lightyellow' : 'text-amber-400'}`}
                >
                  {offer.name}
                <p className="text-2xl md:text-lg text-white">{offer.tech}</p>
                </CardDescription>

                <CardTitle className="text-xl font-bold text-primary">{offer.title}</CardTitle>
              </CardHeader>
              </div>
              <CardContent>
                <p className={`text-xl mb-6 ${
                  offer.recommended
                    ? "text-lightyellow hover:text-lightyellow/90"
                    : "text-amber-300 hover:text-amber-300/90"
                }`}
                >{offer.concept}</p>
                <ul className="space-y-3 mb-8">
                  {offer.features.map((feature: string, fidx: number) => (
                    <li key={fidx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: offer.color }} />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <Link href="https://calendar.app.google/ZagmCTp8PBTczTnJA" className="w-full mt-auto" target="_blank" rel="noopener noreferrer">
                <Button
                  className={`w-full h-12 font-medium font-googletitre text-base rounded-full ${
                    offer.recommended
                      ? "bg-lightyellow hover:bg-lightyellow/90 text-darkblue"
                      : "bg-orange hover:bg-orange/90 text-darkblue"
                  }`}
                >
                  En savoir plus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
